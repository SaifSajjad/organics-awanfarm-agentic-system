import { NextResponse } from "next/server";
import { dbStatus, formatOrder } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data: { paymentStatus?: string; status?: string } = {};

  if (body.paymentStatus) data.paymentStatus = dbStatus(body.paymentStatus);
  if (body.deliveryStatus) data.status = dbStatus(body.deliveryStatus);

  const order = await prisma.order.update({
    where: { id },
    data,
    include: { customer: true, items: { include: { product: true } } }
  });

  if (data.status) {
    await prisma.delivery.updateMany({ where: { orderId: id }, data: { status: data.status } });
  }

  return NextResponse.json(formatOrder(order));
}
