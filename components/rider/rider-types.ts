export const riderDemoStates = [
  "before-route",
  "active-route",
  "stop-detail",
  "missed-delivery",
  "delivered-success",
  "route-complete",
  "loading",
  "empty",
  "error",
  "offline-demo"
] as const;

export type RiderDemoState = (typeof riderDemoStates)[number];

export type RiderStopStatus = "Pending" | "Delivered" | "Missed" | "Active";

export type RiderCue = "Extra Milk" | "Cash Required" | "Bottle Return";

export type RiderRouteStop = {
  stopNumber: number;
  sequence: string;
  initials: string;
  area: string;
  status: RiderStopStatus;
  order: string;
  cues: RiderCue[];
};

export type RiderStopDetail = RiderRouteStop & {
  customerName: string;
  address: string;
  accessNote: string;
};

export type MissedReason =
  | "Customer unavailable"
  | "Access issue"
  | "Address issue"
  | "Customer requested later delivery"
  | "Payment issue"
  | "Other";
