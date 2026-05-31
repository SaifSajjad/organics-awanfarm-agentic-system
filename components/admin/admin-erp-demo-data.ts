import type { AdminAgentMode, AdminWorkflowType } from "@/components/admin/admin-agent-types";

export const kpiCards = [
  {
    label: "Today's Dispatch",
    value: "92 L",
    detail: "Cow 58 L \u00b7 Buffalo 34 L"
  },
  {
    label: "Route Readiness",
    value: "2 / 3 active",
    detail: "1 route needs review"
  },
  {
    label: "Pending Actions",
    value: "6 items",
    detail: "4 approvals \u00b7 2 exceptions"
  },
  {
    label: "Collections",
    value: "PKR 18,400",
    detail: "PKR 6,200 pending"
  }
];

export const priorityQueue = [
  {
    id: "new-subscription",
    title: "New Subscription",
    customer: "Sara Ahmed \u00b7 Model Town",
    detail: "2 L Fresh Cow Milk \u00b7 Daily",
    cta: "Review",
    workflow: "new-subscription" as AdminWorkflowType,
    tone: "green"
  },
  {
    id: "extra-milk",
    title: "Extra Milk Request",
    customer: "Sara Ahmed \u00b7 Model Town",
    detail: "+1 L Fresh Cow Milk",
    cta: "Review",
    workflow: "extra-milk" as AdminWorkflowType,
    tone: "gold"
  },
  {
    id: "missed-delivery",
    title: "Urgent \u00b7 Missed Delivery",
    customer: "Zainab Khan \u00b7 Model Town",
    detail: "Customer unavailable \u00b7 18 minutes ago",
    cta: "Resolve",
    workflow: "missed-delivery" as AdminWorkflowType,
    tone: "amber"
  }
];

export const informationalQueue = [
  {
    title: "Buffalo Milk Shortage",
    detail: "8 L shortage in today's demo inventory",
    section: "inventory" as const
  },
  {
    title: "Cash Collection Variance",
    detail: "PKR 1,200 needs manual finance review",
    section: "finance" as const
  }
];

export const routeSummaries = [
  {
    title: "Model Town Morning Route",
    rider: "Ahmed",
    status: "Ready",
    stops: 14,
    note: "Model Town Morning Route \u00b7 Ahmed assigned \u00b7 Ready for admin review."
  },
  {
    title: "Johar Town Morning Route",
    rider: "Bilal",
    status: "Ready",
    stops: 11,
    note: "Johar Town Morning Route \u00b7 Bilal assigned \u00b7 Ready for admin review."
  },
  {
    title: "Bahria Town Morning Route",
    rider: "Not assigned",
    status: "Review required",
    stops: 12,
    note: "Bahria Town Morning Route \u00b7 12 scheduled stops \u00b7 Rider assignment required before dispatch confirmation."
  }
];

export const operationalAgents = [
  {
    id: "support",
    title: "Customer Support Agent",
    summary: "2 open issues \u00b7 1 urgent",
    cta: "Open Assistant",
    mode: "support" as AdminAgentMode
  },
  {
    id: "orders",
    title: "Subscription & Orders Agent",
    summary: "3 approvals pending \u00b7 1 caution",
    cta: "Review Approvals",
    section: "priority" as const
  },
  {
    id: "delivery",
    title: "Delivery Planning Agent",
    summary: "1 route needs review",
    cta: "Open Assistant",
    mode: "delivery" as AdminAgentMode
  },
  {
    id: "finance",
    title: "Finance Agent",
    summary: "1 variance flagged",
    cta: "Open Assistant",
    mode: "finance" as AdminAgentMode
  },
  {
    id: "inventory",
    title: "Inventory Agent",
    summary: "Buffalo milk shortage \u00b7 8 L",
    cta: "Open Inventory",
    section: "inventory" as const
  }
];

export const financeSnapshot = [
  { label: "Today's Collections", value: "PKR 18,400" },
  { label: "Pending Today", value: "PKR 6,200" },
  { label: "Monthly Pending Balance", value: "PKR 63,240" },
  { label: "Expenses This Week", value: "PKR 4,120" }
];

export const inventorySnapshot = [
  {
    label: "Cow Milk",
    available: "64 L available",
    required: "58 L required",
    buffer: "6 L buffer",
    bar: 82,
    tone: "green"
  },
  {
    label: "Buffalo Milk",
    available: "26 L available",
    required: "34 L required",
    buffer: "8 L shortage",
    bar: 58,
    tone: "amber"
  },
  {
    label: "Bottles",
    available: "84 available",
    required: "Morning route packing",
    buffer: "Sufficient",
    bar: 76,
    tone: "gold"
  }
];

export const initialActivity = [
  "Extra-milk request prepared for review",
  "Missed-delivery exception awaiting admin decision",
  "Cash variance flagged for manual review",
  "Buffalo-milk shortage shown in demo snapshot"
];

export const quickActions = [
  { label: "Customer Support", section: "agents" as const },
  { label: "Order Management", section: "priority" as const },
  { label: "Delivery Planning", section: "dispatch" as const },
  { label: "Finance", section: "finance" as const },
  { label: "Inventory", section: "inventory" as const }
];

export const agentContent = {
  support: {
    eyebrow: "Operational Agent",
    title: "Customer Support Agent",
    description: "Customer issues, follow-ups, and manual WhatsApp draft guidance.",
    safety:
      "Recommendations only. No message is sent and no customer record is changed until you review the relevant workflow.",
    summary: [
      ["Open Issues", "2"],
      ["Urgent", "1"],
      ["Callbacks", "1"],
      ["Quality Complaint", "1"]
    ],
    alertTitle: "Follow-up Required",
    alertLines: [
      "Missed Delivery Follow-up",
      "Zainab K.",
      "Model Town",
      "Customer unavailable",
      "Attempted: 7:12 AM",
      "Rider: Ahmed",
      "Contact: 03XX-XXX-7614"
    ],
    chips: [
      "Show urgent support issues",
      "Summarize missed-delivery complaints",
      "Prepare WhatsApp follow-up",
      "Which customers need a callback?",
      "Show quality complaints",
      "Explain this escalation"
    ],
    defaultChip: "Prepare WhatsApp follow-up",
    response:
      "Manual WhatsApp follow-up draft\n\nZainab K. in Model Town has one missed-delivery case. The rider reported that the customer was unavailable at 7:12 AM. Confirm availability before deciding whether to review a retry.\n\nIssue: Missed delivery\nReason: Customer unavailable\nAttempted: 7:12 AM\nPreferred channel: WhatsApp\nManual admin review required\n\nNo message has been sent and no customer record has been changed.",
    preparedTitle: "Prepared draft",
    prepared:
      "Assalam-o-Alaikum. We were unable to complete your milk delivery this morning. Please confirm whether you would like us to review a same-day retry or continue with your next scheduled delivery. \u2014 Organics by Awan Farms",
    secondaryTitle: "Secondary issue",
    secondaryLines: ["Sara A.", "Johar Town", "Quality complaint", "Fresh Buffalo Milk", "Needs clarification"],
    actions: ["Copy Draft", "Open WhatsApp Manually", "Open Missed Delivery Drawer"]
  },
  delivery: {
    eyebrow: "Operational Agent",
    title: "Delivery Planning Agent",
    description: "Route readiness, rider assignment, and delivery-exception guidance.",
    safety:
      "Recommendations only. No route, rider, or delivery record is changed until you review the relevant workflow.",
    summary: [
      ["Ready Routes", "2"],
      ["Needs Review", "1"],
      ["Missed Delivery", "1"],
      ["Retry Capacity", "1"]
    ],
    alertTitle: "Review Required",
    alertLines: [
      "Unassigned Morning Route",
      "Bahria Town Morning Route",
      "12 scheduled",
      "Morning \u00b7 6:30 AM - 8:30 AM",
      "Assigned rider: Not assigned"
    ],
    helper: "Select a rider in Route Dispatch before confirming dispatch.",
    chips: [
      "Which route needs attention?",
      "Show unassigned routes",
      "Explain missed-delivery exception",
      "Can this route accept a retry?",
      "Summarize dispatch readiness",
      "Prepare rider-assignment note"
    ],
    defaultChip: "Summarize dispatch readiness",
    response:
      "Dispatch readiness summary\n\nTwo morning routes are ready. Bahria Town Morning Route requires review because no rider has been assigned. One missed-delivery case in Model Town requires customer follow-up before any retry decision.\n\nModel Town Morning Route \u00b7 Ahmed assigned \u00b7 Ready\nJohar Town Morning Route \u00b7 Bilal assigned \u00b7 Ready\nBahria Town Morning Route \u00b7 Rider not assigned \u00b7 Review required\nModel Town missed-delivery case \u00b7 Customer follow-up required\n\nNo route, rider, or delivery record has been changed.",
    preparedTitle: "Prepared note",
    prepared:
      "Bahria Town Morning Route \u00b7 12 scheduled stops \u00b7 Rider assignment required before dispatch confirmation. No route record has been changed.",
    secondaryTitle: "Delivery exception",
    secondaryLines: [
      "Zainab K.",
      "Model Town",
      "Missed Delivery",
      "Customer unavailable",
      "Attempted: 7:12 AM",
      "Rider: Ahmed",
      "Recommendation: Contact the customer before deciding whether to retry."
    ],
    actions: ["Review Route Dispatch", "Open Missed Delivery Drawer", "Copy Assignment Note"]
  },
  finance: {
    eyebrow: "Operational Agent",
    title: "Finance Agent",
    description: "Collections, balances, and reconciliation guidance.",
    safety: "Recommendations only. No finance records are changed until you review the relevant workflow.",
    summary: [
      ["Today's Collections", "PKR 18,400"],
      ["Pending Today", "PKR 6,200"],
      ["Monthly Pending Balance", "PKR 63,240"],
      ["Expenses This Week", "PKR 4,120"]
    ],
    alertTitle: "Review Required",
    alertLines: [
      "Cash Collection Variance",
      "Model Town Morning Route",
      "Rider: Ahmed",
      "Expected: PKR 5,800",
      "Recorded: PKR 4,600",
      "Variance: PKR 1,200"
    ],
    chips: [
      "Show pending collections",
      "Explain the cash anomaly",
      "Summarize monthly pending balance",
      "Show expenses this week",
      "Which routes need reconciliation?",
      "Prepare a reconciliation note"
    ],
    defaultChip: "Explain the cash anomaly",
    response:
      "Cash anomaly summary\n\nModel Town Morning Route has a PKR 1,200 variance. Expected cash is PKR 5,800 and the recorded handover is PKR 4,600. Review the rider handover before changing any record.\n\nExpected collection: PKR 5,800\nRecorded collection: PKR 4,600\nVariance detected: PKR 1,200\nManual review required\n\nNo finance record has been changed.",
    preparedTitle: "Prepared note",
    prepared:
      "Model Town Morning Route \u00b7 Ahmed \u00b7 Expected PKR 5,800 \u00b7 Recorded PKR 4,600 \u00b7 Variance PKR 1,200 \u00b7 Manual review required. No finance record has been changed.",
    actions: ["Copy Reconciliation Note", "Open Finance Snapshot"]
  }
} satisfies Record<AdminAgentMode, Record<string, unknown>>;
