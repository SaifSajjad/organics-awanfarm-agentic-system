import { Prisma, SubscriptionFrequency, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const scheduleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  specificDate: z.string().optional(),
  quantityOverride: z.coerce.number().positive().optional()
});

type ScheduleInput = z.infer<typeof scheduleSchema>;

const createSubscriptionSchema = z.object({
  customerId: z.string().min(1),
  productId: z.string().min(1),
  addressId: z.string().min(1).optional(),
  frequency: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  rate: z.coerce.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  days: z.array(z.coerce.number().int().min(0).max(6)).optional(),
  schedules: z.array(scheduleSchema).optional()
});

function parseFrequency(value?: string) {
  const frequency = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "DAILY";
  if (Object.values(SubscriptionFrequency).includes(frequency as SubscriptionFrequency)) {
    return frequency as SubscriptionFrequency;
  }
  return SubscriptionFrequency.DAILY;
}

function parseStatus(value?: string) {
  const status = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "ACTIVE";
  if (Object.values(SubscriptionStatus).includes(status as SubscriptionStatus)) {
    return status as SubscriptionStatus;
  }
  return SubscriptionStatus.ACTIVE;
}

export async function GET() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      customer: true,
      address: true,
      product: true,
      schedules: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSubscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription request" }, { status: 400 });
  }

  const data = parsed.data;
  const [customer, product] = await Promise.all([
    prisma.customerProfile.findUnique({ where: { id: data.customerId }, include: { addresses: true } }),
    prisma.product.findUnique({ where: { id: data.productId } })
  ]);

  if (!customer || !product) {
    return NextResponse.json({ error: "Customer or product not found" }, { status: 400 });
  }

  const addressId = data.addressId ?? customer.addresses.find((address) => address.isDefault)?.id ?? customer.addresses[0]?.id;

  if (!addressId || !customer.addresses.some((address) => address.id === addressId)) {
    return NextResponse.json({ error: "Valid customer address is required" }, { status: 400 });
  }

  const frequency = parseFrequency(data.frequency ?? data.type);
  const schedules: ScheduleInput[] = data.schedules?.length
    ? data.schedules
    : data.days?.map((dayOfWeek) => ({ dayOfWeek })) ?? [];

  if (frequency === SubscriptionFrequency.CUSTOM_DAYS && schedules.length === 0) {
    return NextResponse.json({ error: "Custom day subscriptions require schedules" }, { status: 400 });
  }

  const subscription = await prisma.subscription.create({
    data: {
      customerId: customer.id,
      productId: product.id,
      addressId,
      frequency,
      status: parseStatus(data.status),
      quantity: new Prisma.Decimal(String(data.quantity ?? 1)),
      rate: new Prisma.Decimal(String(data.rate ?? product.price)),
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      notes: data.notes,
      schedules: schedules.length
        ? {
            create: schedules.map((schedule) => ({
              dayOfWeek: schedule.dayOfWeek,
              specificDate: schedule.specificDate ? new Date(schedule.specificDate) : undefined,
              quantityOverride:
                schedule.quantityOverride === undefined
                  ? undefined
                  : new Prisma.Decimal(String(schedule.quantityOverride))
            }))
          }
        : undefined
    },
    include: {
      customer: true,
      address: true,
      product: true,
      schedules: true
    }
  });

  return NextResponse.json(subscription, { status: 201 });
}
