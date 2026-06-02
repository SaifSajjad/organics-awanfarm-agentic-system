import type { MissedReason, RiderDemoState, RiderRouteStop, RiderStopDetail } from "./rider-types";
import { riderDemoStates } from "./rider-types";

export const RIDER_ROUTE_META = {
  brand: "Organics by Awan Farms",
  greeting: "Good morning, Hamza",
  routeName: "Gulberg Morning Route",
  routeDate: "Tuesday, 2 June",
  demoBadge: "Demo data",
  adminSupportHref: "tel:+000000000001",
  customerCallHref: "tel:+000000000000",
  totalStops: 12,
  cashRequiredStops: 4,
  bottleReturnStops: 5
} as const;

export const beforeRouteStops: RiderRouteStop[] = [
  {
    stopNumber: 1,
    sequence: "01",
    initials: "SA",
    area: "Gulberg III",
    status: "Pending",
    order: "Buffalo Milk · 2 L",
    cues: ["Bottle Return"]
  },
  {
    stopNumber: 2,
    sequence: "02",
    initials: "HM",
    area: "Model Town",
    status: "Pending",
    order: "Cow Milk · 1 L",
    cues: []
  },
  {
    stopNumber: 3,
    sequence: "03",
    initials: "AR",
    area: "Garden Town",
    status: "Pending",
    order: "Buffalo Milk · 3 L",
    cues: ["Cash Required"]
  },
  {
    stopNumber: 4,
    sequence: "04",
    initials: "NK",
    area: "Faisal Town",
    status: "Pending",
    order: "Cow Milk · 2 L",
    cues: ["Extra Milk"]
  },
  {
    stopNumber: 5,
    sequence: "05",
    initials: "FB",
    area: "Johar Town",
    status: "Pending",
    order: "Buffalo Milk · 2 L",
    cues: ["Extra Milk", "Cash Required", "Bottle Return"]
  }
];

export const activeRouteStops: RiderRouteStop[] = [
  {
    stopNumber: 1,
    sequence: "01",
    initials: "SA",
    area: "Gulberg III",
    status: "Delivered",
    order: "Buffalo Milk · 2 L",
    cues: []
  },
  {
    stopNumber: 2,
    sequence: "02",
    initials: "HM",
    area: "Model Town",
    status: "Delivered",
    order: "Cow Milk · 1 L",
    cues: []
  },
  {
    stopNumber: 3,
    sequence: "03",
    initials: "AR",
    area: "Garden Town",
    status: "Delivered",
    order: "Buffalo Milk · 3 L",
    cues: ["Cash Required"]
  },
  {
    stopNumber: 4,
    sequence: "04",
    initials: "NK",
    area: "Faisal Town",
    status: "Missed",
    order: "Cow Milk · 2 L",
    cues: []
  },
  {
    stopNumber: 5,
    sequence: "05",
    initials: "FB",
    area: "Johar Town",
    status: "Active",
    order: "Buffalo Milk · 2 L",
    cues: ["Extra Milk", "Cash Required", "Bottle Return"]
  },
  {
    stopNumber: 6,
    sequence: "06",
    initials: "UQ",
    area: "Wapda Town",
    status: "Pending",
    order: "Cow Milk · 1 L",
    cues: []
  },
  {
    stopNumber: 7,
    sequence: "07",
    initials: "RM",
    area: "Valencia",
    status: "Pending",
    order: "Buffalo Milk · 2 L",
    cues: ["Bottle Return"]
  }
];

export const fatimaStopDetail: RiderStopDetail = {
  ...activeRouteStops[4],
  customerName: "Fatima B.",
  address: "House 18, Lane 4, Block G, Johar Town, Lahore",
  accessNote: "Please use the side gate and ring the bell once."
};

export const missedReasonOptions: MissedReason[] = [
  "Customer unavailable",
  "Access issue",
  "Address issue",
  "Customer requested later delivery",
  "Payment issue",
  "Other"
];

export const routeCompleteSummary = [
  ["Total Stops", "12"],
  ["Delivered", "11"],
  ["Missed", "1"],
  ["Extra Milk Stops", "2"],
  ["Cash Required Stops", "4"],
  ["Bottle Return Stops", "5"]
] as const;

export function normalizeRiderDemoState(value?: string | string[]): RiderDemoState {
  const state = Array.isArray(value) ? value[0] : value;

  if (riderDemoStates.includes(state as RiderDemoState)) {
    return state as RiderDemoState;
  }

  return "before-route";
}

export function createStopDetail(stop: RiderRouteStop): RiderStopDetail {
  if (stop.sequence === fatimaStopDetail.sequence) {
    return fatimaStopDetail;
  }

  return {
    ...stop,
    customerName: stop.initials,
    address: `${stop.area}, Lahore`,
    accessNote: "Demo stop detail for this local fixture."
  };
}
