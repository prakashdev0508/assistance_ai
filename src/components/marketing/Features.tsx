import React from "react";

const features = [
  {
    title: "Natural language understanding",
    description:
      "Talk to your assistant like a person. It understands context, intent, and preferences.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M4 12a8 8 0 1 1 16 0c0 2.7-1.3 5-3.4 6.5l.6 2.5-2.7-1.4a8.8 8.8 0 0 1-2.9.5A8 8 0 0 1 4 12Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Intelligent planning",
    description:
      "Plans your day and week automatically with priorities, energy levels, and deadlines.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M7 3h10a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-4 3V5a2 2 0 0 1 2-2h2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Tasks & reminders",
    description:
      "Captures todos anywhere, reminds you at the right time, and closes the loop.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M9 12l2 2 4-4m3-3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6l-4 3V6a2 2 0 0 1 2-2h14Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Long‑term memory",
    description:
      "Securely remembers facts, preferences, and routines to personalize every interaction.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 4a8 8 0 1 0 0 16 6 6 0 0 0 6-6V8a4 4 0 0 0-4-4h-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Autonomous actions",
    description:
      "Agentic reasoning with custom tools to decide and act on your behalf.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 3l2.5 5 5.5.8-4 4 1 5.5L12 16l-5 2.3 1-5.5-4-4 5.5-.8L12 3Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Calendar & email",
    description:
      "Understands your schedule, writes emails, and automates routine communication.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M20 5H4a2 2 0 0 0-2 2v10l6-4h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="solution" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything you need to manage life with an AI copilot
          </h2>
          <p className="mt-3 text-base text-black/70">
            A unified assistant that plans, remembers, and executes — across tasks,
            habits, files, email, and calendar.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition hover:shadow-[0_16px_60px_-24px_rgba(0,0,0,0.6)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


