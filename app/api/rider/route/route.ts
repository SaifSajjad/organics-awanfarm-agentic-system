import { NextResponse } from "next/server";

import { AuthzError, requireRider } from "@/lib/rbac";
import { getCurrentRiderRoute } from "@/lib/rider-route-service";

export const runtime = "nodejs";

const noStoreHeaders = {
  "Cache-Control": "no-store"
};

export async function GET() {
  try {
    const rider = await requireRider();
    const payload = await getCurrentRiderRoute(rider.riderId);

    return NextResponse.json(payload, {
      headers: noStoreHeaders
    });
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: error.status,
          headers: noStoreHeaders
        }
      );
    }

    return NextResponse.json(
      { error: "Unable to load rider route." },
      {
        status: 500,
        headers: noStoreHeaders
      }
    );
  }
}
