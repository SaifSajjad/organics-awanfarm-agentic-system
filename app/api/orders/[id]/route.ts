import { DeliveryStatus, PaymentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { dbStatus, formatOrder } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

function parseDeliveryStatus(value: unknown) {
  if (typeof value !== "string") return undefined;
  const status = dbStatus(value);
  if (Object.values(DeliveryStatus).includes(status as DeliveryStatus)) {
    return status as DeliveryStatus;
  }
  return undefined;
}

function parsePaymentStatus(value: unknown) {
  if (typeof value !== "string") return undefined;
  const status = dbStatus(value);
  if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    return status as PaymentStatus;
  }
  return undefined;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const paymentStatus = parsePaymentStatus(body.paymentStatus);
  const deliveryStatus = parseDeliveryStatus(body.deliveryStatus);
  const data: Prisma.OrderUpdateInput = {};

  if (paymentStatus) data.paymentStatus = paymentStatus;
  if (deliveryStatus) data.status = deliveryStatus;

  if (!paymentStatus && !deliveryStatus) {
    return NextResponse.json({ error: "No valid order update fields provided" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data,
    include: {
      customer: true,
      address: true,
      items: { include: { product: true } },
      delivery: true,
      payments: true
    }
  });

  if (deliveryStatus) {
    await prisma.delivery.updateMany({
      where: { orderId: id },
      data: { status: deliveryStatus }
    });
  }

  return NextResponse.json(formatOrder(order));
}
