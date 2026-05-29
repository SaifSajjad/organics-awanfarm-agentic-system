import { DeliveryStatus, PaymentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { formatDelivery } from "@/lib/db-formatters";

const generateDeliveriesSchema = z.object({
  deliveryDate: z.string().optional(),
  riderId: z.string().min(1).optional(),
  routeId: z.string().min(1).optional(),
  subscriptionIds: z.array(z.string().min(1)).optional()
});

function dayWindow(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
}

function atHour(base: Date, hour: number) {
  const date = new Date(base);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function decimal(value: unknown, fallback = "0") {
  return new Prisma.Decimal(String(value ?? fallback));
}

function shouldGenerateDelivery(
  subscription: {
    frequency: string;
    schedules: Array<{ active: boolean; dayOfWeek: number | null; specificDate: Date | null }>;
  },
  deliveryDate: Date
) {
  if (subscription.frequency === "DAILY") return true;
  if (subscription.frequency === "WEEKLY") return true;
  if (subscription.frequency === "ONE_TIME") {
    return subscription.schedules.some((schedule) => {
      if (!schedule.active || !schedule.specificDate) return false;
      const { start, end } = dayWindow(deliveryDate);
      return schedule.specificDate >= start && schedule.specificDate < end;
    });
  }

  if (subscription.frequency === "CUSTOM_DAYS") {
    return subscription.schedules.some((schedule) => schedule.active && schedule.dayOfWeek === deliveryDate.getDay());
  }

  return false;
}

export async function GET() {
  const deliveries = await prisma.delivery.findMany({
    include: {
      address: true,
      route: true,
      rider: true,
      order: {
        include: {
          customer: true,
          address: true,
          items: { include: { product: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(deliveries.map(formatDelivery));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = generateDeliveriesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid delivery generation request" }, { status: 400 });
  }

  const deliveryDate = parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : new Date();
  const { start, end } = dayWindow(deliveryDate);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      ...(parsed.data.subscriptionIds?.length ? { id: { in: parsed.data.subscriptionIds } } : {})
    },
    include: {
      customer: true,
      address: true,
      product: true,
      schedules: true
    }
  });

  const created = [];

  for (const subscription of subscriptions) {
    if (!shouldGenerateDelivery(subscription, deliveryDate)) continue;

    const existingOrder = await prisma.order.findFirst({
      where: {
        subscriptionId: subscription.id,
        deliveryDate: { gte: start, lt: end }
      },
      select: { id: true }
    });

    if (existingOrder) continue;

    const quantity = decimal(subscription.quantity, "1");
    const rate = decimal(subscription.rate, subscription.product.price.toString());
    const total = quantity.mul(rate);

    const order = await prisma.order.create({
      data: {
        customerId: subscription.customerId,
        addressId: subscription.addressId,
        subscriptionId: subscription.id,
        deliveryDate,
        status: DeliveryStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        subtotal: total,
        discount: new Prisma.Decimal(0),
        totalAmount: total,
        items: {
          create: {
            productId: subscription.productId,
            quantity,
            rate,
            total
          }
        },
        delivery: {
          create: {
            routeId: parsed.data.routeId,
            riderId: parsed.data.riderId,
            addressId: subscription.addressId,
            area: subscription.address.area,
            status: DeliveryStatus.PENDING,
            scheduledAt: atHour(deliveryDate, 8)
          }
        }
      },
      include: {
        delivery: {
          include: {
            address: true,
            route: true,
            rider: true,
            order: {
              include: {
                customer: true,
                address: true,
                items: { include: { product: true } }
              }
            }
          }
        }
      }
    });

    if (order.delivery) created.push(formatDelivery(order.delivery));
  }

  return NextResponse.json(created, { status: 201 });
}
