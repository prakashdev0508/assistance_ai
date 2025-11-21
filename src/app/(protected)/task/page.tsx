import React from "react";

export default function TaskPage() {
  const filters = ["All", "Today", "Upcoming", "Overdue", "Completed"];
  const labels = ["Work", "Personal", "Health", "Admin"];
  const tasks = [
    {
      title: "Outline LangChain tool functions",
      label: "Work",
      due: "Today",
      priority: "High",
    },
    {
      title: "Plan weekly schedule",
      label: "Personal",
      due: "Today",
      priority: "Medium",
    },
    {
      title: "Reply to calendar invites",
      label: "Admin",
      due: "Tomorrow",
      priority: "Low",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-black/50">Agent workspace</p>
          <h1 className="text-3xl font-semibold text-black">Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Quick add task..."
            className="w-72 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm outline-none placeholder:text-black/40 focus:border-black/20"
          />
          <button className="rounded-2xl bg-black px-4 py-2 text-xs font-semibold text-white shadow">
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]">
            <div className="text-sm font-semibold text-black">Filters</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {filters.map((f) => (
                <button
                  key={f}
                  className="rounded-2xl border border-black/5 bg-black/5 px-4 py-2 text-black/70 hover:bg-black/10"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]">
            <div className="text-sm font-semibold text-black">Labels</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {labels.map((l) => (
                <span
                  key={l}
                  className="rounded-2xl border border-black/5 bg-white px-4 py-2 text-black/70 shadow-sm"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">My Tasks</p>
              <p className="text-xs text-black/60">Organized by the assistant</p>
            </div>
            <button className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
              Focus view
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {tasks.map((t) => (
              <li
                key={t.title}
                className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="size-4 rounded border-black/20" />
                    <span className="text-sm font-medium text-black">{t.title}</span>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      {t.label}
                    </span>
                  </div>
                  <div className="text-xs text-black/60">
                    {t.due} · {t.priority} priority
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


