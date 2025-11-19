import React from "react";

const painPoints = [
  { title: "Messy workflows", desc: "Too many tools, no single source of truth." },
  { title: "No automation", desc: "Manual follow-ups, repetitive planning, constant context switching." },
  { title: "Low clarity", desc: "Unclear priorities and schedules lead to missed goals." },
  { title: "Fragmented memory", desc: "Important info buried across chats, docs, and emails." },
  { title: "Poor habits", desc: "Hard to build routines and track progress meaningfully." },
  { title: "Time drains", desc: "Tiny decisions and admin work add up daily." },
];

export default function PainPoints() {
  return (
    <section id="pain-points" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Your life should be clear, not confusing
          </h2>
          <p className="mt-3 text-base text-black/70">
            Common pain points that your personal AI assistant resolves instantly.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/70">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


