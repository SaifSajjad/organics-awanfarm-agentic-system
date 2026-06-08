import { NextResponse } from "next/server";

import { createRiderAccount } from "@/lib/account-service";
import { AuthzError, requireRole } from "@/lib/rbac";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN");
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unable to create rider account." },
      { status: 500 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Unable to create rider account." },
      { status: 400 }
    );
  }

  const result = await createRiderAccount(
    typeof payload === "object" && payload ? payload : {}
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
