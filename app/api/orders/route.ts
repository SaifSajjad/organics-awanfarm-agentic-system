import { NextResponse } from "next/server";
import { formatOrder } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(orders.map(formatOrder));
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.findFirst({ where: { name: body.product ?? "Cow Milk" } });
  const customer = await prisma.customer.findFirst({ where: { id: body.customerId } });

  if (!product || !customer) {
    return NextResponse.json({ error: "Customer or product not found" }, { status: 400 });
  }

  const quantity = Number(body.quantity) || 1;
  const total = Math.round(quantity * product.price);
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      deliveryDate: new Date(),
      status: body.deliveryStatus ?? "PENDING",
      totalAmount: total,
      paymentStatus: body.paymentStatus ?? "UNPAID",
      items: {
        create: {
          productId: product.id,
          quantity,
          rate: product.price,
          total
        }
      }
    },
    include: { customer: true, items: { include: { product: true } } }
  });
  return NextResponse.json(formatOrder(order), { status: 201 });
}
