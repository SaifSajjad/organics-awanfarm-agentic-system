import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCustomer } from "@/lib/db-formatters";

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: { subscriptions: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(customers.map(formatCustomer));
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.findFirst({
    where: { name: body.product ?? "Cow Milk" }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 400 });
  }

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      phone: body.phone ?? "0339-5235323",
      area: body.area,
      address: body.address ?? `${body.name}, ${body.area}, Lahore`,
      subscriptions: {
        create: {
          productId: product.id,
          type: body.frequency ?? "Daily",
          status: "ACTIVE",
          quantity: Number(body.quantity) || 1,
          rate: Number(body.rate) || product.price
        }
      }
    },
    include: { subscriptions: { include: { product: true } } }
  });

  return NextResponse.json(formatCustomer(customer), { status: 201 });
}
