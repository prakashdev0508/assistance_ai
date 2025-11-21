import React from "react";
import SignOutButton from "~/components/auth/SignOutButton";

export default function Topbar() {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/50 bg-white/70 px-4 py-3 text-sm text-black/70 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            placeholder="Search tasks, notes, automations..."
            className="w-full rounded-2xl border border-transparent bg-black/5 px-4 py-2 text-sm text-black outline-none placeholder:text-black/40 focus:border-black/20"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-black/60 shadow">
            /
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-2xl bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-black/90">
            Quick Action
          </button>
          <button className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-xs font-medium text-black hover:bg-black/5">
            Add Memory
          </button>
          <SignOutButton />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-full bg-black/5 px-3 py-1 font-medium text-black/70">
          Sync status: Live
        </span>
        <span className="rounded-full bg-black/5 px-3 py-1 text-black/60">
          Next automation run in 12m
        </span>
      </div>
    </div>
  );
}


