import { NextResponse } from "next/server";
import { formatExpense } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const expenses = await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(expenses.map(formatExpense));
}

export async function POST(request: Request) {
  const body = await request.json();
  const expense = await prisma.expense.create({
    data: {
      type: body.type,
      amount: Number(body.amount) || 0,
      description: body.note ?? body.description ?? ""
    }
  });
  return NextResponse.json(formatExpense(expense), { status: 201 });
}
