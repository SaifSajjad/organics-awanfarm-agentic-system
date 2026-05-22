import { NextResponse } from "next/server";
import { z } from "zod";
import { runDemoAgent, type AgentType } from "@/lib/agents/agent-service";

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

  const result = runDemoAgent(parsed.data.agent as AgentType, parsed.data.prompt, parsed.data.demoData);

  return NextResponse.json(result);
}
