import Link from "next/link";
import {
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Database,
  Globe2,
  LayoutDashboard,
  Route,
  ServerCog,
  Sparkles,
  Truck,
  Users
} from "lucide-react";
import { AppHeader } from "@/components/app-header";

const modules = [
  {
    title: "Frontend Website",
    icon: Globe2,
    points: ["Public farm website", "Products and pricing", "Delivery areas", "WhatsApp order CTA"]
  },
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    points: ["KPIs and customer ledger", "Create subscriptions", "Generate deliveries", "AI alerts"]
  },
  {
    title: "Operations",
    icon: ClipboardList,
    points: ["Orders board", "Payments", "Delivery status", "Expense tracking"]
  },
  {
    title: "Rider App",
    icon: Truck,
    points: ["Today route", "Customer details", "Quantity", "Mark delivered"]
  },
  {
    title: "Customer App",
    icon: Users,
    points: ["Subscription view", "Monthly bill", "Pause/request flow", "Support CTA"]
  },
  {
    title: "AI Agents",
    icon: Bot,
    points: ["Customer support", "Delivery planning", "Finance summary", "Action suggestions"]
  }
];

const agents = [
  {
    name: "Customer Support Agent",
    job: "Answers pricing, delivery area, subscription and complaint questions."
  },
  {
    name: "Delivery Planning Agent",
    job: "Groups deliveries by area, calculates liters, and suggests route order."
  },
  {
    name: "Finance Agent",
    job: "Summarizes revenue, expenses, net profit, pending payments, and detects contradictions."
  },
  {
    name: "Future Order Agent",
    job: "Will convert natural language customer messages into structured orders."
  },
  {
    name: "Future Inventory Agent",
    job: "Will compare available milk with today demand and flag shortage or surplus."
  },
  {
    name: "Future Marketing Agent",
    job: "Will generate WhatsApp broadcasts, referral copy, and Instagram captions."
  }
];

const demoSteps = [
  "Open the public website and show cow/buffalo milk pricing.",
  "Go to Admin Dashboard and create a new customer subscription.",
  "Generate today's delivery list from customer subscriptions.",
  "Open Operations and mark an order as paid/delivered.",
  "Add a fuel or rider expense and show live totals changing.",
  "Open AI Agents and ask finance/delivery/customer support questions.",
  "Explain how the system can later connect to database, WhatsApp, and real OpenAI models."
];

export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-farm-cream">
      <AppHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md border bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-farm-leaf">Project Overview</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-farm-green">
            Agentic AI-Based Dairy Farm Delivery & Management System
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            A complete Next.js MVP for Organics by Awan Farms that connects customer subscriptions, delivery
            operations, payments, expenses, dashboards, and AI agents into one working business automation demo.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/admin" className="rounded-md bg-farm-green px-5 py-3 font-semibold text-white">
              Start Demo
            </Link>
            <Link href="/agents" className="rounded-md border bg-white px-5 py-3 font-semibold text-farm-green">
              Show AI Agents
            </Link>
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Frontend", "Next.js App Router", Globe2],
            ["Backend", "API Routes + Services", ServerCog],
            ["Database", "Prisma-ready schema", Database],
            ["Agents", "Support, Delivery, Finance", Sparkles]
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-md border bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-farm-green" />
              <p className="mt-4 text-sm text-muted-foreground">{label as string}</p>
              <p className="mt-1 font-bold text-farm-green">{value as string}</p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black text-farm-green">System Modules</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="rounded-md border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-secondary p-2 text-farm-green">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-farm-green">{module.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {module.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-farm-green" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Route className="h-6 w-6 text-farm-green" />
              <h2 className="text-2xl font-black text-farm-green">Automation Flow</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                "Customer subscription is created",
                "System calculates monthly bill",
                "Admin generates today's deliveries",
                "Rider marks delivered or missed",
                "Payment and expenses update finance totals",
                "AI agents summarize routes, revenue, risks, and next actions"
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-farm-cream p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-farm-green text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-farm-green" />
              <h2 className="text-2xl font-black text-farm-green">Agentic AI Design</h2>
            </div>
            <div className="mt-4 space-y-3">
              {agents.map((agent) => (
                <div key={agent.name} className="rounded-md bg-farm-cream p-3">
                  <p className="font-bold text-farm-green">{agent.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{agent.job}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-md border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6 text-farm-green" />
            <h2 className="text-2xl font-black text-farm-green">Live Demo Script</h2>
          </div>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {demoSteps.map((step, index) => (
              <li key={step} className="rounded-md bg-farm-cream p-4">
                <p className="text-sm font-bold text-farm-green">Step {index + 1}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-md border bg-farm-green p-6 text-white shadow-sm">
          <h2 className="text-2xl font-black">MVP Status</h2>
          <p className="mt-3 max-w-4xl leading-7 text-white/85">
            The current version is a working 3-day MVP demo. It uses local demo data and deterministic AI responses so
            it can be presented reliably. The next upgrade is persistence: connect all forms to Prisma database, then
            connect AI agents to live LLM calls and WhatsApp workflows.
          </p>
        </section>
      </section>
    </main>
  );
}
