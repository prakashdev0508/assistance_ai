import React from "react";

export default function Features() {
  return (
    <section id="solution" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              Solution
            </span>
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            A System Built to Plan, Remember, and Act
          </h2>
          <p className="mt-3 text-base text-black/70">
            Your AI assistant organizes tasks, plans your day, tracks goals, and executes
            routines—integrated with calendar, email, and files.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3">
          {/* Card 1: Plan & Schedule */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-inner">
              <div className="h-3 w-32 rounded bg-black/10" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded bg-black/10" />
                <div className="h-2 w-5/6 rounded bg-black/10" />
                <div className="h-2 w-2/3 rounded bg-black/10" />
              </div>
              <div className="mt-4">
                <button className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                  Schedule
                </button>
              </div>
            </div>
            <h3 className="mt-5 text-sm font-semibold">Plan & Schedule with Ease</h3>
            <p className="mt-1 text-xs text-black/70">
              Smart daily and weekly plans based on deadlines, priorities, and energy.
            </p>
          </div>

          {/* Card 2: Productivity Analytics (span 2) */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] md:col-span-2">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-black/10" />
                <div className="text-xs text-emerald-600">↑ 100% vs last month</div>
              </div>
              <svg viewBox="0 0 400 120" className="mt-4 h-28 w-full">
                <path
                  d="M0 80 L60 50 L120 65 L180 55 L240 85 L300 60 L360 40"
                  fill="none"
                  stroke="url(#g)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#1068ff" />
                    <stop offset="100%" stopColor="#1e90ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="mt-5 text-sm font-semibold">Data‑Driven Decisions</h3>
            <p className="mt-1 text-xs text-black/70">
              Track productivity metrics to optimize plans, habits, and goals.
            </p>
          </div>

          {/* Card 3: Calendar & Email Automation */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <div className="flex h-28 items-center justify-center rounded-2xl border border-black/10 bg-[radial-gradient(20rem_12rem_at_50%_50%,rgba(16,104,255,0.08),transparent_60%)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#2d6bff_0%,#1048ff_100%)] text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path d="M20 7v10a2 2 0 0 1-2 2H6l-4 3V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <h3 className="mt-5 text-sm font-semibold">Calendar & Email Automation</h3>
            <p className="mt-1 text-xs text-black/70">
              Proposes times, drafts emails, and sets reminders—hands‑free.
            </p>
          </div>

          {/* Card 4: Smarter Suggestions */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center gap-2 text-xs text-black/70">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <div>
                  <div className="h-2 w-28 rounded bg-black/10" />
                  <div className="mt-1 h-2 w-20 rounded bg-black/10" />
                </div>
              </div>
              <div className="mt-3 h-2 w-5/6 rounded bg-black/10" />
              <div className="mt-2 h-2 w-2/3 rounded bg-black/10" />
            </div>
            <h3 className="mt-5 text-sm font-semibold">Get Smarter Suggestions</h3>
            <p className="mt-1 text-xs text-black/70">
              Long‑term memory personalizes recommendations across tasks and habits.
            </p>
          </div>

          {/* Card 5: Instant Insights */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="rounded-xl border border-black/10 bg-white p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/90" />
                  <span className="h-2 w-24 rounded bg-black/10" />
                </div>
                <div className="mt-2 h-2 w-3/4 rounded bg-black/10" />
              </div>
              <div className="mt-3 rounded-xl border border-black/10 bg-white p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-amber-400/90" />
                  <span className="h-2 w-24 rounded bg-black/10" />
                </div>
                <div className="mt-2 h-2 w-3/5 rounded bg-black/10" />
              </div>
            </div>
            <h3 className="mt-5 text-sm font-semibold">Gather Instant Insights</h3>
            <p className="mt-1 text-xs text-black/70">
              Capture reflections and feedback to refine plans automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


