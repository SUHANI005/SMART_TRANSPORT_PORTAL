import { Check, Bus } from "lucide-react";

export function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center w-full overflow-x-auto pb-1">
        {steps.map((label, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={label} className="flex items-center flex-1 min-w-[90px]">
              <div className="flex flex-col items-center gap-2 shrink-0 relative">
                {active && (
                  <span className="absolute -top-7 text-ink-700">
                    <Bus size={16} />
                  </span>
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold shrink-0 transition-colors border-2 ${
                    done
                      ? "bg-route-500 border-route-500 text-white"
                      : active
                      ? "bg-signal-400 border-signal-500 text-ink-800"
                      : "bg-white border-ink-200 text-ink-300"
                  }`}
                >
                  {done ? <Check size={15} /> : idx}
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide text-center leading-tight ${active ? "text-ink-700" : "text-ink-300"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-[3px] flex-1 mx-1 rounded route-dash ${done ? "text-route-500" : "text-ink-200"}`} style={{ marginBottom: "18px" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
