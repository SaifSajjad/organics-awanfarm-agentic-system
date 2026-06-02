import { CheckCircle2 } from "lucide-react";

type RiderDeliveredSuccessProps = {
  onContinueRoute: () => void;
};

export function RiderDeliveredSuccess({ onContinueRoute }: RiderDeliveredSuccessProps) {
  return (
    <section className="mx-auto grid max-w-xl gap-5 rounded-2xl border border-[#d8d5ca] bg-white p-6 text-center shadow-[0_4px_18px_rgba(27,67,50,0.05)] sm:p-7">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-[#1b4332] text-[#1b4332] sm:h-24 sm:w-24">
        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-black tracking-[0.16em] text-[#924c00]">Delivery Complete</p>
        <h2 className="mt-2 font-display text-3xl font-black text-[#012d1d]">Delivered Successfully</h2>
        <p className="mt-4 text-2xl font-black text-[#1b1c19]">Fatima B.</p>
        <p className="mt-1 text-lg text-[#414844]">Johar Town</p>
        <p className="mt-4 text-base leading-7 text-[#414844]">
          This demo delivery has been marked as delivered.
        </p>
      </div>
      <button
        type="button"
        onClick={onContinueRoute}
        className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#1b4332] px-4 text-base font-black text-white"
      >
        Continue Route
      </button>
    </section>
  );
}
