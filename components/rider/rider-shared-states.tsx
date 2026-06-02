type RiderSharedStateProps = {
  onRetry?: () => void;
  onReturnHome?: () => void;
};

export function RiderLoadingState() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-[#d8d5ca] bg-white p-5 sm:p-6">
      <p className="text-xl font-black text-[#012d1d]">Preparing demo route...</p>
      <div className="mt-5 grid gap-3" aria-hidden="true">
        <div className="h-16 rounded-xl bg-[#f0eee9]" />
        <div className="h-24 rounded-xl bg-[#f5f3ee]" />
        <div className="h-16 rounded-xl bg-[#f0eee9]" />
      </div>
    </section>
  );
}

export function RiderEmptyState({ onReturnHome }: RiderSharedStateProps) {
  return (
    <section className="mx-auto grid max-w-xl gap-4 rounded-2xl border border-[#d8d5ca] bg-white p-5 text-center sm:p-6">
      <p className="text-xl font-black text-[#012d1d]">No route assigned for this demo.</p>
      <button
        type="button"
        onClick={onReturnHome}
        className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#1b4332] px-4 text-base font-black text-white"
      >
        Return to Rider Home
      </button>
    </section>
  );
}

export function RiderErrorState({ onRetry, onReturnHome }: RiderSharedStateProps) {
  return (
    <section className="mx-auto grid max-w-xl gap-4 rounded-2xl border border-[#ffb4ab] bg-white p-5 text-center sm:p-6">
      <p className="text-xl font-black text-[#93000a]">Demo route could not load.</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#1b4332] px-4 text-base font-black text-white"
      >
        Retry
      </button>
      <button
        type="button"
        onClick={onReturnHome}
        className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[#012d1d] bg-white px-4 text-base font-black text-[#012d1d]"
      >
        Return to Rider Home
      </button>
    </section>
  );
}

export function RiderOfflineDemoState() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-[#d8d5ca] bg-white p-5 text-center sm:p-6">
      <p className="text-xl font-black text-[#012d1d]">Offline demo state.</p>
      <p className="mt-2 text-lg text-[#414844]">Visual reference only.</p>
    </section>
  );
}
