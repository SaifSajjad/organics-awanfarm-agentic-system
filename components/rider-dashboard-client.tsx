"use client";

import { Play } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  RIDER_ROUTE_META,
  activeRouteStops,
  beforeRouteStops,
  createStopDetail,
  fatimaStopDetail
} from "@/components/rider/rider-demo-data";
import { RiderDeliveredSuccess } from "@/components/rider/rider-delivered-success";
import { RiderHeader } from "@/components/rider/rider-header";
import { RiderMissedDeliverySheet } from "@/components/rider/rider-missed-delivery-sheet";
import { RiderNextStopCard } from "@/components/rider/rider-next-stop-card";
import { RiderRouteComplete } from "@/components/rider/rider-route-complete";
import { RiderRouteList } from "@/components/rider/rider-route-list";
import { RiderRouteSummary } from "@/components/rider/rider-route-summary";
import {
  RiderEmptyState,
  RiderErrorState,
  RiderLoadingState,
  RiderOfflineDemoState
} from "@/components/rider/rider-shared-states";
import { RiderStopDetailSheet } from "@/components/rider/rider-stop-detail-sheet";
import type { RiderDemoState, RiderRouteStop, RiderStopStatus } from "@/components/rider/rider-types";

type RiderDashboardClientProps = {
  initialDemoState: RiderDemoState;
};

function cloneActiveStops() {
  return activeRouteStops.map((stop) => ({ ...stop, cues: [...stop.cues] }));
}

function getRouteStats(stops: RiderRouteStop[]) {
  const delivered = stops.filter((stop) => stop.status === "Delivered").length;
  const missed = stops.filter((stop) => stop.status === "Missed").length;

  return {
    delivered,
    missed,
    remaining: RIDER_ROUTE_META.totalStops - delivered - missed
  };
}

function advanceStopStatus(
  stops: RiderRouteStop[],
  status: Extract<RiderStopStatus, "Delivered" | "Missed">
): RiderRouteStop[] {
  const activeIndex = stops.findIndex((stop) => stop.status === "Active");
  if (activeIndex < 0) return stops;

  const updatedStops = stops.map((stop, index) => (index === activeIndex ? { ...stop, status } : stop));
  const nextPendingIndex = updatedStops.findIndex((stop, index) => index > activeIndex && stop.status === "Pending");

  if (nextPendingIndex < 0) return updatedStops;

  return updatedStops.map((stop, index) => (index === nextPendingIndex ? { ...stop, status: "Active" } : stop));
}

export function RiderDashboardClient({ initialDemoState }: RiderDashboardClientProps) {
  const [demoState, setDemoState] = useState<RiderDemoState>(initialDemoState);
  const [stops, setStops] = useState<RiderRouteStop[]>(cloneActiveStops);
  const routeStats = useMemo(() => getRouteStats(stops), [stops]);
  const activeStop = useMemo(() => stops.find((stop) => stop.status === "Active") ?? fatimaStopDetail, [stops]);
  const activeStopDetail = useMemo(() => createStopDetail(activeStop), [activeStop]);

  const returnHome = useCallback(() => {
    setStops(cloneActiveStops());
    setDemoState("before-route");
  }, []);

  const openActiveRoute = useCallback(() => {
    setDemoState("active-route");
  }, []);

  const openStopDetail = useCallback(() => {
    setDemoState("stop-detail");
  }, []);

  const closeSheet = useCallback(() => {
    setDemoState("active-route");
  }, []);

  const openMissedDelivery = useCallback(() => {
    setDemoState("missed-delivery");
  }, []);

  const markDelivered = useCallback(() => {
    setDemoState("delivered-success");
  }, []);

  const continueAfterDelivered = useCallback(() => {
    setStops((currentStops) => advanceStopStatus(currentStops, "Delivered"));
    setDemoState("active-route");
  }, []);

  const submitMissedAttempt = useCallback(() => {
    setStops((currentStops) => advanceStopStatus(currentStops, "Missed"));
    setDemoState("active-route");
  }, []);

  const renderBeforeRoute = () => (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="grid gap-5">
        <RiderRouteSummary
          mode="before"
          items={[
            { label: "Total Stops", value: "12" },
            { label: "Completed", value: "0" },
            { label: "Remaining", value: "12" },
            { label: "Missed", value: "0" },
            { label: "Cash Required Stops", value: "4", tone: "amber" },
            { label: "Bottle Return Stops", value: "5" }
          ]}
        />
        <button
          type="button"
          onClick={openActiveRoute}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#1b4332] px-4 text-base font-black text-white shadow-[0_14px_34px_rgba(27,67,50,0.15)]"
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          Start Route
        </button>
      </div>
      <RiderRouteList
        title="Route Preview"
        description="12 stops assigned for this demo route"
        stops={beforeRouteStops}
        footer="view-all"
        onViewAll={openActiveRoute}
      />
    </div>
  );

  const renderActiveRoute = () => (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
      <div className="grid gap-5">
        <RiderRouteSummary
          mode="active"
          items={[
            { label: "Total Stops", value: "12" },
            { label: "Completed", value: String(routeStats.delivered) },
            { label: "Remaining", value: String(routeStats.remaining) },
            { label: "Missed", value: String(routeStats.missed), tone: "red" },
            { label: "Cash Required Stops", value: "4", tone: "amber" },
            { label: "Bottle Return Stops", value: "5" }
          ]}
        />
        <RiderNextStopCard
          stop={activeStopDetail}
          onViewDetails={openStopDetail}
          onContinueRoute={() => setDemoState("route-complete")}
        />
      </div>
      <RiderRouteList title="Today’s Stops" stops={stops} footer="more-stops" />
    </div>
  );

  let body;

  if (demoState === "before-route") body = renderBeforeRoute();
  else if (demoState === "active-route" || demoState === "stop-detail" || demoState === "missed-delivery") {
    body = renderActiveRoute();
  } else if (demoState === "delivered-success") {
    body = <RiderDeliveredSuccess onContinueRoute={continueAfterDelivered} />;
  } else if (demoState === "route-complete") {
    body = <RiderRouteComplete onReturnHome={returnHome} />;
  } else if (demoState === "loading") {
    body = <RiderLoadingState />;
  } else if (demoState === "empty") {
    body = <RiderEmptyState onReturnHome={returnHome} />;
  } else if (demoState === "error") {
    body = <RiderErrorState onRetry={returnHome} onReturnHome={returnHome} />;
  } else {
    body = <RiderOfflineDemoState />;
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-7">
      <RiderHeader />
      {body}
      {demoState === "stop-detail" ? (
        <RiderStopDetailSheet
          stop={activeStopDetail}
          onClose={closeSheet}
          onMarkDelivered={markDelivered}
          onMissedDelivery={openMissedDelivery}
        />
      ) : null}
      {demoState === "missed-delivery" ? (
        <RiderMissedDeliverySheet onCancel={openStopDetail} onSubmit={submitMissedAttempt} />
      ) : null}
    </div>
  );
}
