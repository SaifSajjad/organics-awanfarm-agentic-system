"use client";

import { useState } from "react";
import { TrackingDemoSwitcher } from "@/components/tracking/tracking-demo-switcher";
import { TrackingFullStateScreen } from "@/components/tracking/tracking-full-state-screen";
import { TrackingHeader } from "@/components/tracking/tracking-header";
import { TrackingSidePanels, TrackingMobileSupportBar } from "@/components/tracking/tracking-side-panels";
import { TrackingStatusCard } from "@/components/tracking/tracking-status-card";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import type { TrackingState } from "@/components/tracking/tracking-types";
import { isFullTrackingState } from "@/components/tracking/tracking-types";

type TrackingPageClientProps = {
  initialState: TrackingState;
  controlsEnabled: boolean;
};

export function TrackingPageClient({ initialState, controlsEnabled }: TrackingPageClientProps) {
  const [state, setState] = useState<TrackingState>(initialState);
  const fullState = isFullTrackingState(state);

  return (
    <div className="min-h-screen overflow-x-hidden bg-farm-meadow text-farm-ink">
      <TrackingHeader />

      <main className="mx-auto max-w-5xl px-4 pb-36 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
        {fullState ? (
          <div className="grid min-h-[calc(100vh-9rem)] items-center py-6">
            <TrackingFullStateScreen
              state={state as "loading" | "expired" | "invalid" | "error"}
              onRetry={() => setState("on-route")}
            />
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] lg:items-start lg:gap-6">
            <div className="space-y-5">
              <TrackingStatusCard state={state} />
              <TrackingTimeline state={state} />
            </div>
            <TrackingSidePanels state={state} />
          </div>
        )}
      </main>

      <TrackingMobileSupportBar state={state} />
      <TrackingDemoSwitcher controlsEnabled={controlsEnabled} state={state} onStateChange={setState} />
    </div>
  );
}
