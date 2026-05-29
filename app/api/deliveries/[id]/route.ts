import { DeliveryStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { dbStatus, formatDelivery } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

function parseDeliveryStatus(value: unknown) {
  if (typeof value !== "string") return undefined;
  const status = dbStatus(value);
  if (Object.values(DeliveryStatus).includes(status as DeliveryStatus)) {
    return status as DeliveryStatus;
  }
  return undefined;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const status = parseDeliveryStatus(body.status ?? body.deliveryStatus);

  if (!status) {
    return NextResponse.json({ error: "Valid delivery status is required" }, { status: 400 });
  }

  if (status === DeliveryStatus.MISSED && !body.missedReason) {
    return NextResponse.json({ error: "Missed reason is required" }, { status: 400 });
  }

  const data: Prisma.DeliveryUpdateInput = {
    status,
    order: { update: { status } }
  };

  if (status === DeliveryStatus.OUT_FOR_DELIVERY) data.outForDeliveryAt = new Date();
  if (status === DeliveryStatus.DELIVERED) data.deliveredAt = new Date();
  if (status === DeliveryStatus.MISSED) data.missedReason = body.missedReason;
  if (body.proofNote) data.proofNote = body.proofNote;
  if (body.urduTranscript) data.urduTranscript = body.urduTranscript;

  const delivery = await prisma.delivery.update({
    where: { id },
    data,
    include: {
      address: true,
      route: true,
      rider: true,
      order: {
        include: {
          customer: true,
          address: true,
          items: { include: { product: true } }
        }
      }
    }
  });

  return NextResponse.json(formatDelivery(delivery));
}
