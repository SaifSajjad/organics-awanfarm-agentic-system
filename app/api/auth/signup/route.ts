import { NextResponse } from "next/server";

import { createCustomerAccount } from "@/lib/account-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 400 }
    );
  }

  const result = await createCustomerAccount(
    typeof payload === "object" && payload ? payload : {}
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
