import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDelivery } from "@/lib/db-formatters";

export async function GET() {
  const deliveries = await prisma.delivery.findMany({
    include: {
      order: {
        include: {
          customer: true,
          items: { include: { product: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(deliveries.map(formatDelivery));
}

export async function POST() {
  const subscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: { customer: true, product: true }
  });

  const created = [];
  for (const subscription of subscriptions) {
    const total = Math.round(subscription.quantity * subscription.rate);
    const order = await prisma.order.create({
      data: {
        customerId: subscription.customerId,
        subscriptionId: subscription.id,
        deliveryDate: new Date(),
        status: "PENDING",
        totalAmount: total,
        paymentStatus: "UNPAID",
        items: {
          create: {
            productId: subscription.productId,
            quantity: subscription.quantity,
            rate: subscription.rate,
            total
          }
        },
        delivery: {
          create: {
            area: subscription.customer.area,
            status: "PENDING"
          }
        }
      },
      include: {
        delivery: {
          include: {
            order: {
              include: {
                customer: true,
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
