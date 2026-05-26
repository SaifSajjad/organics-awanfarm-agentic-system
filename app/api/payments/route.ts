import { PaymentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createPaymentSchema = z.object({
  customerId: z.string().min(1),
  orderId: z.string().min(1).optional(),
  amount: z.coerce.number().positive(),
  status: z.string().optional(),
  method: z.string().min(1).optional(),
  reference: z.string().optional(),
  notes: z.string().optional()
});

function parsePaymentStatus(value?: string) {
  const status = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "PAID";
  if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    return status as PaymentStatus;
  }
  return PaymentStatus.PAID;
}

function orderPaymentStatus(paidAmount: Prisma.Decimal, totalAmount: Prisma.Decimal) {
  if (paidAmount.greaterThanOrEqualTo(totalAmount)) return PaymentStatus.PAID;
  if (paidAmount.greaterThan(0)) return PaymentStatus.PARTIAL;
  return PaymentStatus.UNPAID;
}

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { customer: true, order: true },
    orderBy: { paidAt: "desc" }
  });

  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment request" }, { status: 400 });
  }

  const data = parsed.data;
  const order = data.orderId
    ? await prisma.order.findUnique({
        where: { id: data.orderId },
        select: { id: true, customerId: true, totalAmount: true }
      })
    : null;

  if (data.orderId && !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 400 });
  }

  if (order && order.customerId !== data.customerId) {
    return NextResponse.json({ error: "Payment customer does not match order customer" }, { status: 400 });
  }

  const payment = await prisma.$transaction(async (tx) => {
    const createdPayment = await tx.payment.create({
      data: {
        customerId: data.customerId,
        orderId: data.orderId,
        amount: new Prisma.Decimal(String(data.amount)),
        status: parsePaymentStatus(data.status),
        method: data.method ?? "Cash",
        reference: data.reference,
        notes: data.notes
      }
    });

    if (order) {
      const aggregate = await tx.payment.aggregate({
        where: { orderId: order.id },
        _sum: { amount: true }
      });
      const paidAmount = aggregate._sum.amount ?? new Prisma.Decimal(0);

      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: orderPaymentStatus(paidAmount, order.totalAmount) }
      });
    }

    return tx.payment.findUniqueOrThrow({
      where: { id: createdPayment.id },
      include: { customer: true, order: true }
    });
  });

  return NextResponse.json(payment, { status: 201 });
}
