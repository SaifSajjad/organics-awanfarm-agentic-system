import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { customer: true, order: true },
    orderBy: { paidAt: "desc" }
  });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const payment = await prisma.payment.create({
    data: {
      customerId: body.customerId,
      orderId: body.orderId,
      amount: Number(body.amount) || 0,
      status: body.status ?? "PAID",
      method: body.method ?? "Cash",
      notes: body.notes
    }
  });

  if (body.orderId) {
    await prisma.order.update({
      where: { id: body.orderId },
      data: { paymentStatus: "PAID" }
    });
  }

  return NextResponse.json(payment, { status: 201 });
}
