import Link from "next/link";
import React from "react";

const plans = [
  {
    name: "Essential",
    price: "$29",
    period: "/month",
    description:
      "Ideal for individuals getting started with AI-powered productivity.",
    features: [
      "Smart daily planning",
      "Tasks & reminders",
      "Basic long-term memory",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description:
      "For power users who want advanced automation and insights.",
    features: [
      "Everything in Essential",
      "Advanced agent actions",
      "Calendar & email automation",
      "Productivity analytics",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Simple plans for every need
          </h2>
          <p className="mt-3 text-base text-black/70">
            Start small or go all-in — there’s a plan for you.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:mt-14 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] ${p.highlighted ? "ring-2 ring-black" : ""}`}
            >
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-semibold">{p.name}</h3>
              </div>
              <p className="mt-2 text-sm text-black/70">{p.description}</p>
              <div className="mt-4 flex items-end gap-1">
                <div className="text-4xl font-semibold">{p.price}</div>
                <div className="pb-2 text-sm text-black/70">{p.period}</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href="#"
                  className={`block w-full rounded-md px-4 py-3 text-center text-sm font-medium shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)] ${p.highlighted ? "bg-black text-white hover:bg-black/90" : "border border-black/10 bg-white text-black hover:bg-black/5"}`}
                >
                  {p.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


