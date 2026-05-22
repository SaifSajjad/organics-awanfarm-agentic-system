import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subscriptions = await prisma.subscription.findMany({
    include: { customer: true, product: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const subscription = await prisma.subscription.create({
    data: {
      customerId: body.customerId,
      productId: body.productId,
      type: body.type ?? "DAILY",
      status: body.status ?? "ACTIVE",
      quantity: Number(body.quantity) || 1,
      rate: Number(body.rate) || 330,
      days: body.days
    }
  });
  return NextResponse.json(subscription, { status: 201 });
}
