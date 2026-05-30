import type { Metadata } from "next";
import { TrackingPageClient } from "@/components/tracking/tracking-page-client";
import { normalizeTrackingState, shouldShowTrackingControls } from "@/components/tracking/tracking-types";

export const metadata: Metadata = {
  title: "Secure Delivery Tracking | Organics by Awan Farms",
  description: "Check the latest status of your Organics by Awan Farms delivery.",
  openGraph: {
    title: "Secure Delivery Tracking | Organics by Awan Farms",
    description: "Check the latest status of your Organics by Awan Farms delivery.",
    siteName: "Organics by Awan Farms",
    type: "website"
  }
};

type TrackDemoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrackDemoPage({ searchParams }: TrackDemoPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialState = normalizeTrackingState(params.state);
  const controlsEnabled = shouldShowTrackingControls(params.controls);

  return <TrackingPageClient controlsEnabled={controlsEnabled} initialState={initialState} />;
}
