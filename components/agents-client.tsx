"use client";

import { useState } from "react";
import { Bot, CreditCard, Headphones, Loader2, Route, Send } from "lucide-react";

type AgentType = "support" | "delivery" | "finance";

type AgentResult = {
  title: string;
  response: string;
  actions: string[];
};

const agentOptions = [
  {
    id: "support" as const,
    name: "Customer Support",
    icon: Headphones,
    prompt: "Model Town mein daily 2 liter cow milk ka monthly bill?"
  },
  {
    id: "delivery" as const,
    name: "Delivery Planner",
    icon: Route,
    prompt: "Aaj ki deliveries ko area wise route bana do"
  },
  {
    id: "finance" as const,
    name: "Finance Agent",
    icon: CreditCard,
    prompt: "May ka revenue, expense, profit aur pending payments summarize karo"
  }
];

export function AgentsClient() {
  const [agent, setAgent] = useState<AgentType>("support");
  const [prompt, setPrompt] = useState(agentOptions[0].prompt);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);

  function readSavedDemoData() {
    function read<T>(key: string, fallback: T): T {
      try {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
      } catch {
        return fallback;
      }
    }

    return {
      deliveries: read("oaf-admin-deliveries", []),
      orders: read("oaf-operations-orders", []),
      expenses: read("oaf-operations-expenses", [])
    };
  }

  async function runAgent() {
    setLoading(true);
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, prompt, demoData: readSavedDemoData() })
      });
      const data = (await response.json()) as AgentResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  function selectAgent(nextAgent: AgentType) {
    const selected = agentOptions.find((option) => option.id === nextAgent) ?? agentOptions[0];
    setAgent(nextAgent);
    setPrompt(selected.prompt);
    setResult(null);
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-md border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-farm-green" />
          <h2 className="text-xl font-bold text-farm-green">Choose Agent</h2>
        </div>
        <div className="mt-4 space-y-2">
          {agentOptions.map((option) => {
            const Icon = option.icon;
            const active = option.id === agent;
            return (
              <button
                key={option.id}
                onClick={() => selectAgent(option.id)}
                className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left font-semibold ${
                  active ? "border-farm-green bg-secondary text-farm-green" : "bg-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {option.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-md border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-farm-green">Agent Prompt</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Delivery and finance agents read the current saved demo data from this browser before each run.
        </p>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-4 min-h-32 w-full rounded-md border bg-farm-cream px-4 py-3 text-sm leading-6 outline-none ring-farm-green focus:ring-2"
        />
        <button
          onClick={runAgent}
          disabled={loading || !prompt.trim()}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-farm-green px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Run Agent
        </button>

        {result ? (
          <div className="mt-6 rounded-md bg-farm-cream p-5">
            <h3 className="text-lg font-bold text-farm-green">{result.title}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-farm-ink/80">{result.response}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.actions.map((action) => (
                <span key={action} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-farm-green">
                  {action}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-dashed bg-farm-cream p-5 text-sm text-muted-foreground">
            Select an agent and run the prompt to generate a demo response.
          </div>
        )}
      </section>
    </div>
  );
}
