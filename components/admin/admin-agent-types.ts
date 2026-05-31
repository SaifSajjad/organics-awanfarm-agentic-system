export type AdminAgentMode = "support" | "delivery" | "finance";

export type AdminAgentState = "ready" | "loading" | "empty" | "error" | "unavailable";

export type AdminWorkflowType = "new-subscription" | "extra-milk" | "missed-delivery";

export type AdminSectionId =
  | "home"
  | "priority"
  | "dispatch"
  | "agents"
  | "finance"
  | "inventory"
  | "support";

export const agentModes: AdminAgentMode[] = ["support", "delivery", "finance"];

export const agentStates: AdminAgentState[] = ["ready", "loading", "empty", "error", "unavailable"];

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeAdminAgent(value: string | string[] | undefined): AdminAgentMode | null {
  const raw = firstParam(value);
  if (!raw) return null;
  return agentModes.includes(raw as AdminAgentMode) ? (raw as AdminAgentMode) : null;
}

export function normalizeAdminAgentState(value: string | string[] | undefined): AdminAgentState {
  const raw = firstParam(value);
  if (!raw) return "ready";
  return agentStates.includes(raw as AdminAgentState) ? (raw as AdminAgentState) : "ready";
}
