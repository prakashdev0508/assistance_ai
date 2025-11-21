import React from "react";

export default function PlanPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const blocks = [
    { day: 0, time: "09:00", title: "Deep work — Research" },
    { day: 0, time: "13:00", title: "Workout" },
    { day: 2, time: "10:00", title: "Team sync" },
    { day: 4, time: "16:00", title: "Weekly review" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-black/50">Assistant automations</p>
          <h1 className="text-3xl font-semibold">Planner</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-black shadow">
            Previous
          </button>
          <button className="rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs text-black/70">
            Today
          </button>
          <button className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
            Auto-plan week
          </button>
        </div>
      </div>

      <div className="rounded-[34px] border border-white/60 bg-white/80 p-4 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-black/60">
          {days.map((d) => (
            <div key={d} className="rounded-2xl bg-black/5 py-2 font-semibold text-black/80">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="min-h-[360px] rounded-2xl border border-white/60 bg-white/90 p-2 shadow-inner"
            >
              <div className="space-y-3">
                {blocks
                  .filter((b) => b.day === dayIndex)
                  .map((b) => (
                    <div
                      key={b.time + b.title}
                      className="rounded-2xl bg-gradient-to-r from-black/80 to-black/60 p-3 text-left text-xs text-white shadow"
                    >
                      <div className="font-medium">{b.title}</div>
                      <div className="text-white/70">{b.time}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


