import React from "react";

const faqs = [
  {
    q: "How does the assistant plan my day?",
    a: "It considers deadlines, priorities, habits, and energy levels to schedule tasks and breaks intelligently.",
  },
  {
    q: "Is this mobile-responsive?",
    a: "Yes. The marketing site and app UI are responsive and optimized for all major devices.",
  },
  {
    q: "What about privacy?",
    a: "Your data is encrypted in transit and at rest. You control what’s stored and can delete it anytime.",
  },
  {
    q: "Can it connect to my email and calendar?",
    a: "Yes. It can read availability, propose times, draft emails, and set reminders with your permission.",
  },
  {
    q: "Does it remember things long-term?",
    a: "Yes. With long-term memory, it recalls facts, preferences, and routines to personalize suggestions.",
  },
  {
    q: "Can I export my data?",
    a: "You can export tasks, schedules, and memories in standard formats at any time.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            FAQ
          </h2>
          <p className="mt-3 text-base text-black/70">
            Answers to common questions about your personal AI assistant.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-6 md:mt-14">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]"
            >
              <summary className="cursor-pointer list-none text-base font-semibold">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-6 text-black/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


