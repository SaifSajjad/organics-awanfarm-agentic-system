export const TRACKING_STATES = [
  "loading",
  "scheduled",
  "rider-assigned",
  "on-route",
  "arriving-soon",
  "delivered",
  "missed",
  "expired",
  "invalid",
  "error"
] as const;

export type TrackingState = (typeof TRACKING_STATES)[number];

export type TimelineTone = "neutral" | "active" | "amber" | "success" | "missed";

export type TrackingStatusCopy = {
  badge: string;
  headline: string;
  body: string;
  eta?: string;
  zone?: string;
  statusLine?: string;
  secondary?: string;
  romanUrdu?: string;
  reason?: string;
};

export const DEFAULT_TRACKING_STATE: TrackingState = "on-route";

export const trackingDemoData = {
  customer: {
    displayName: "Sarah J."
  },
  delivery: {
    product: "Fresh Cow Milk",
    quantity: "2 Litres",
    timing: "Morning delivery",
    subscriptionStatus: "Subscription active"
  },
  rider: {
    firstName: "Ali",
    initials: "A",
    role: "Organics by Awan Farms delivery rider",
    label: "Verified team member"
  },
  etaWindow: "6:00 AM - 7:30 AM",
  lastUpdated: "Updated 2 minutes ago",
  supportNumber: "0339-5235323",
  whatsappUrl:
    "https://wa.me/923395235323?text=Assalam-o-Alaikum%2C%20I%20need%20help%20with%20today%27s%20milk%20delivery.",
  dashboardUrl: "/dashboard/customer"
} as const;

export const trackingStatusCopy: Record<TrackingState, TrackingStatusCopy> = {
  loading: {
    badge: "Loading",
    headline: "Loading your delivery status.",
    body: "Please wait while we prepare the latest delivery update."
  },
  scheduled: {
    badge: "Scheduled",
    headline: "Your delivery is scheduled for this morning.",
    body: "We're preparing your route. You'll be notified when your rider is on the way."
  },
  "rider-assigned": {
    badge: "Rider Assigned",
    headline: "Ali will deliver your milk today.",
    body: "Your delivery is on schedule. Ali will start the route soon.",
    eta: `Expected between ${trackingDemoData.etaWindow}`
  },
  "on-route": {
    badge: "On Route",
    headline: "Ali is on the way.",
    body: `Your delivery is expected between ${trackingDemoData.etaWindow}.`,
    eta: `Expected between ${trackingDemoData.etaWindow}`,
    zone: "Delivering in your area now",
    romanUrdu: "Ali raste mein hai."
  },
  "arriving-soon": {
    badge: "Arriving Soon",
    headline: "Ali is almost at your door.",
    body: "Please be ready to receive your delivery.",
    statusLine: "Arriving soon - please be available.",
    romanUrdu: "Tayyar ho jayen - rider pahunch raha hai."
  },
  delivered: {
    badge: "Delivered",
    headline: "Your milk has been delivered.",
    body: "Delivered at 7:08 AM - Saturday, 31 May.",
    secondary: "Enjoy your morning. See you tomorrow.",
    romanUrdu: "Doodh pohonch gaya. Shukria!"
  },
  missed: {
    badge: "Missed Delivery",
    headline: "We weren't able to complete your delivery today.",
    body: "It looks like no one was available at the time of delivery. Please contact us and we'll arrange the next step.",
    reason: "Customer unavailable"
  },
  expired: {
    badge: "Link Expired",
    headline: "This tracking link has expired.",
    body: "Delivery-tracking links are only active for a limited time. Your delivery may already be complete."
  },
  invalid: {
    badge: "Tracking Unavailable",
    headline: "We couldn't find this delivery.",
    body: "This tracking link may have been copied incorrectly or is no longer active."
  },
  error: {
    badge: "Connection Issue",
    headline: "Something went wrong on our end.",
    body: "We're having trouble loading your delivery status. Please try again in a moment."
  }
};

export function getFirstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function normalizeTrackingState(value: string | string[] | undefined): TrackingState {
  const raw = getFirstParam(value)?.trim().toLowerCase();

  if (!raw) return DEFAULT_TRACKING_STATE;
  if (raw === "assigned") return "rider-assigned";
  if (raw === "on_route") return "on-route";

  return (TRACKING_STATES as readonly string[]).includes(raw) ? (raw as TrackingState) : DEFAULT_TRACKING_STATE;
}

export function shouldShowTrackingControls(value: string | string[] | undefined) {
  return getFirstParam(value) === "1";
}

export function isFullTrackingState(state: TrackingState) {
  return state === "loading" || state === "expired" || state === "invalid" || state === "error";
}

export function canShowRiderCard(state: TrackingState) {
  return state === "rider-assigned" || state === "on-route" || state === "arriving-soon" || state === "delivered";
}
