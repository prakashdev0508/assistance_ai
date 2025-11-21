import React from "react";

const statPills = [
  { label: "Agent loops today", value: "14", sub: "Multi-step runs" },
  { label: "Tasks closed", value: "32", sub: "+6 vs yesterday" },
  { label: "Goals on track", value: "5 / 6", sub: "84% trajectory" },
];

const tasks = [
  { title: "Plan Tuesday focus blocks", due: "Due 10:00", type: "Planner" },
  { title: "Respond to investor emails", due: "Due 11:30", type: "Email" },
  { title: "Weekly habits recap", due: "Due 18:00", type: "Habits" },
];

const goals = [
  { label: "Ship AI automations", pct: 72 },
  { label: "Inbox zero streak", pct: 58 },
  { label: "Workout 4x / week", pct: 50 },
];

const habits = [
  { label: "Morning routine", progress: ["done", "done", "todo", "todo", "todo", "skip", "todo"] },
  { label: "Deep work block", progress: ["done", "done", "done", "todo", "todo", "skip", "skip"] },
];

const memories = [
  { time: "09:12", text: "Prefers standups after 11 AM to protect focus hours." },
  { time: "08:40", text: "New priority: finalize LangChain toolset doc by Friday." },
  { time: "Yesterday", text: "Reminder: send habit tracker PDF every Sunday 6 PM." },
];

const automations = [
  { name: "Autoplan afternoon", status: "Ready", eta: "Runs in 12m" },
  { name: "Summarize inbox + draft replies", status: "Scheduled", eta: "14:00" },
  { name: "Sync goals with Notion", status: "Complete", eta: "07:15" },
];

const files = ["Weekly-plan.pdf", "OKRs.q2.md", "Habit-tracker.csv", "Clients-notes.docx"];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-black/50">Today · Tuesday</p>
          <h1 className="text-4xl font-semibold text-black">Personal AI Command Center</h1>
          <p className="text-sm text-black/60">
            Autonomous planning, reminders, goals, and memory synced for your life.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {statPills.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-black/5 bg-white px-4 py-2 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.4)]"
            >
              <div className="text-xs uppercase tracking-wide text-black/50">
                {stat.label}
              </div>
              <div className="text-xl font-semibold text-black">{stat.value}</div>
              <div className="text-xs text-black/60">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.4)] xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/50">Autopilot overview</p>
              <p className="text-2xl font-semibold text-black">Day orchestrated</p>
              <p className="text-xs text-black/50">
                Assistant has scheduled 7 focus blocks, 3 reminders, 2 habit nudges.
              </p>
            </div>
            <button className="rounded-full bg-black px-4 py-1 text-xs font-semibold text-white">
              Pause autopilot
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <svg viewBox="0 0 220 120" className="h-36 w-full">
              <defs>
                <linearGradient id="autopilot" x1="0" x2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path
                d="M20 100 A90 90 0 0 1 200 100"
                stroke="url(#autopilot)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="110" cy="100" r="12" fill="#0f172a" />
              <text
                x="110"
                y="100"
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="10"
                fontWeight="600"
              >
                88%
              </text>
            </svg>
            <div className="rounded-2xl bg-black/5 p-4 text-xs text-black/70">
              <p className="text-sm font-semibold text-black">Assistant notes</p>
              <p className="mt-2">
                Energy is highest 9–12am, so deep work blocks queued early. Goals behind schedule
                will trigger habit nudges at 18:00 and email summary at 20:30.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">Schedule heatmap</p>
            <span className="text-xs text-black/60">Focus density</span>
          </div>
          <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-emerald-200 via-amber-200 to-rose-200" />
          <p className="mt-3 text-xs text-black/60">Green = flow, amber = meetings, red = admin.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">Tasks & reminders</p>
            <button className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
              View all
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {tasks.map((task) => (
              <li key={task.title} className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-black">{task.title}</div>
                  <span className="text-xs text-black/50">{task.type}</span>
                </div>
                <p className="text-xs text-black/60">{task.due}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow">
          <p className="text-sm font-semibold text-black">Goal trajectories</p>
          <div className="mt-4 space-y-3">
            {goals.map((goal) => (
              <div key={goal.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-black/60">
                  <span>{goal.label}</span>
                  <span>{goal.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/5">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#22c55e,#0ea5e9)]"
                    style={{ width: `${goal.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow">
          <p className="text-sm font-semibold text-black">Habit tracker</p>
          <div className="mt-4 space-y-4">
            {habits.map((habit) => (
              <div key={habit.label}>
                <div className="text-xs text-black/60">{habit.label}</div>
                <div className="mt-2 flex gap-1">
                  {habit.progress.map((state, idx) => (
                    <span
                      key={idx}
                      className={`h-7 w-7 rounded-xl ${
                        state === "done"
                          ? "bg-black text-white"
                          : state === "skip"
                            ? "bg-black/5 text-black/30"
                            : "bg-white text-black/40"
                      } flex items-center justify-center text-[10px]`}
                    >
                      {["M", "T", "W", "T", "F", "S", "S"][idx]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">Long-term memory</p>
            <button className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
              Add memory
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {memories.map((memory) => (
              <li key={memory.time} className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
                <span className="text-[11px] uppercase tracking-wide text-black/50">{memory.time}</span>
                <p className="text-sm text-black/80">{memory.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow">
          <p className="text-sm font-semibold text-black">Automation queue</p>
          <div className="mt-4 space-y-3 text-sm text-black/70">
            {automations.map((automation) => (
              <div key={automation.name} className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{automation.name}</span>
                  <span className="text-xs text-black/50">{automation.status}</span>
                </div>
                <p className="text-xs text-black/50">{automation.eta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">Files understood today</p>
            <span className="text-xs text-black/60">Agent parsed {files.length} files</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {files.map((file) => (
              <div key={file} className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm shadow-sm">
                {file}
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}


