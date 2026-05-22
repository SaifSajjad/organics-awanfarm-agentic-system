import { NextResponse } from "next/server";
import { z } from "zod";
import { formatDelivery, formatExpense, formatOrder } from "@/lib/db-formatters";
import { runDemoAgent, type AgentType } from "@/lib/agents/agent-service";
import { prisma } from "@/lib/prisma";

const agentRequestSchema = z.object({
  agent: z.enum(["support", "delivery", "finance"]),
  prompt: z.string().min(1),
  demoData: z
    .object({
      deliveries: z.array(z.any()).optional(),
      orders: z.array(z.any()).optional(),
      expenses: z.array(z.any()).optional()
    })
    .optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = agentRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid agent request" }, { status: 400 });
  }

  let demoData = parsed.data.demoData;

  if (!demoData?.deliveries?.length && !demoData?.orders?.length && !demoData?.expenses?.length) {
    try {
      const [deliveries, orders, expenses] = await Promise.all([
        prisma.delivery.findMany({
          include: {
            order: {
              include: {
                customer: true,
                items: { include: { product: true } }
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.order.findMany({
          include: {
            customer: true,
            items: { include: { product: true } }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.expense.findMany({ orderBy: { createdAt: "desc" } })
      ]);

      demoData = {
        deliveries: deliveries.map(formatDelivery),
        orders: orders.map(formatOrder),
        expenses: expenses.map(formatExpense)
      };
    } catch {
      // Keep seed fallback inside runDemoAgent when database is not ready.
    }
  }

  const result = runDemoAgent(parsed.data.agent as AgentType, parsed.data.prompt, demoData);

  return NextResponse.json(result);
}
