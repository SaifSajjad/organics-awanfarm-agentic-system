import { NextResponse } from "next/server";
import { dbStatus, formatDelivery } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const status = dbStatus(body.status ?? "PENDING");
  const delivery = await prisma.delivery.update({
    where: { id },
    data: {
      status,
      order: { update: { status } }
    },
    include: {
      order: {
        include: {
          customer: true,
          items: { include: { product: true } }
        }
      }
    }
  });
  return NextResponse.json(formatDelivery(delivery));
}
