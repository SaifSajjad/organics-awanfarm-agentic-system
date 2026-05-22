import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, detail, icon }: StatCardProps) {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-farm-green">{value}</p>
          {detail ? <p className="mt-1 text-sm text-muted-foreground">{detail}</p> : null}
        </div>
        {icon ? <div className="rounded-md bg-secondary p-2 text-farm-green">{icon}</div> : null}
      </div>
    </div>
  );
}
