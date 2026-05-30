"use client";

import { Bot, Headphones, Loader2, MessageCircle, Minus, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type FarmSupportAssistantProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "customer";
  content: string;
};

type AgentResult = {
  title?: string;
  response?: string;
  actions?: string[];
};

const promptChips = [
  "Pause my delivery for 3 days",
  "Request extra 2 liters tomorrow",
  "Download latest invoice",
  "Is Model Town covered?",
  "Why is my bill pending?",
  "My delivery is late"
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Good morning, Sarah. How can I help with your milk subscription today?"
  }
];

const whatsappUrl = "https://wa.me/923395235323";

export function FarmSupportAssistant({ isOpen, onOpenChange }: FarmSupportAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastActions, setLastActions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onOpenChange]);

  async function sendPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    const customerMessage: ChatMessage = {
      id: `customer-${Date.now()}`,
      role: "customer",
      content: trimmed
    };
    setMessages((current) => [...current, customerMessage]);
    setInput("");
    setLoading(true);
    setLastActions([]);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "support",
          prompt: trimmed,
          demoData: {
            deliveries: [
              {
                id: "customer-dashboard-demo",
                customer: "Sarah J.",
                area: "Model Town",
                product: "Cow Milk",
                quantity: 2,
                status: "Pending"
              }
            ],
            orders: [],
            expenses: []
          }
        })
      });

      if (!response.ok) throw new Error("Agent request failed");

      const result = (await response.json()) as AgentResult;
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            result.response ??
            "I can help with subscriptions, deliveries, billing, and support. This is a deterministic demo response."
        }
      ]);
      setLastActions(result.actions ?? []);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I can help with this request in demo mode. For live account changes, please use WhatsApp support until secure account-aware support is enabled."
        }
      ]);
      setLastActions(["Open WhatsApp support", "Keep request as demo", "Try another prompt"]);
    } finally {
      setLoading(false);
    }
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendPrompt(input);
  }

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Farm Support Assistant is open" : "Open Farm Support Assistant"}
        onClick={() => onOpenChange(true)}
        className={`fixed bottom-6 right-5 z-[70] grid h-16 w-16 place-items-center rounded-full bg-farm-heritage text-farm-milk shadow-premium transition-transform hover:-translate-y-1 md:bottom-8 md:right-8 ${
          isOpen ? "scale-0 opacity-0" : "animate-ai-pulse"
        }`}
      >
        <Bot className="h-7 w-7" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[90]" role="presentation">
          <button
            type="button"
            aria-label="Close Farm Support Assistant"
            className="absolute inset-0 bg-farm-heritage/20 backdrop-blur-[2px]"
            onClick={() => onOpenChange(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="farm-support-title"
            className="customer-support-panel"
          >
            <div className="flex items-center justify-between gap-4 bg-farm-heritage p-5 text-white sm:p-6">
              <div className="flex items-center gap-4">
                <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-farm-gold text-farm-heritage">
                  <Bot className="h-7 w-7" />
                  <span className="absolute -right-1 bottom-1 h-4 w-4 rounded-full border-2 border-farm-heritage bg-farm-success" />
                </div>
                <div>
                  <h2 id="farm-support-title" className="font-display text-2xl font-bold text-farm-gold">
                    Farm Support Assistant
                  </h2>
                  <p className="mt-1 text-sm text-white/75">Help with deliveries, billing, and your subscription.</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-farm-success">
                    <span className="h-2 w-2 rounded-full bg-farm-success" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Minimize Farm Support Assistant"
                  className="hidden h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:grid"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close Farm Support Assistant"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-5 overflow-y-auto bg-farm-meadow p-5 sm:p-6">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                {loading ? (
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-farm-heritage text-white">
                      <Bot className="h-4 w-4" />
                    </span>
                    <div className="customer-typing-dots rounded-2xl border border-farm-heritage/10 bg-white px-4 py-3 shadow-soft-card">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-farm-heritage/10 bg-white p-4 sm:p-5">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1" aria-label="Suggested support prompts">
                  {promptChips.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendPrompt(prompt)}
                      className="shrink-0 rounded-full border border-farm-heritage/15 bg-farm-cream px-3 py-2 text-xs font-bold text-farm-heritage transition-colors hover:bg-farm-heritage hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form onSubmit={submitMessage} className="relative">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask your farm assistant..."
                    className="min-h-14 w-full rounded-2xl border border-farm-heritage/10 bg-farm-cream px-4 pr-14 text-sm text-farm-ink outline-none ring-farm-gold/40 transition focus:ring-2"
                    aria-label="Message Farm Support Assistant"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-xl bg-farm-heritage text-white disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </form>

                {lastActions.length ? (
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested assistant actions">
                    {lastActions.map((action) => (
                      <span key={action} className="rounded-full bg-farm-gold/15 px-3 py-1 text-xs font-bold text-farm-heritage">
                        {action}
                      </span>
                    ))}
                  </div>
                ) : null}

                <a
                  href={whatsappUrl}
                  className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-farm-gold bg-white px-4 font-bold text-farm-heritage transition-colors hover:bg-farm-gold/10"
                >
                  <Headphones className="h-5 w-5" />
                  Chat with Human Support
                </a>
                <p className="mt-3 text-center text-xs text-farm-ink/50">
                  Demo assistant — secure account-aware support coming next.
                </p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const assistant = message.role === "assistant";
  return (
    <div className={`customer-message-fade flex items-start gap-3 ${assistant ? "" : "justify-end"}`}>
      {assistant ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-farm-heritage text-white">
          <Bot className="h-4 w-4" />
        </span>
      ) : null}
      <div
        className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-soft-card ${
          assistant ? "border border-farm-heritage/10 bg-white text-farm-ink" : "bg-farm-heritage text-white"
        }`}
      >
        {message.content}
      </div>
      {!assistant ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-farm-gold text-farm-heritage">
          <MessageCircle className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
}
