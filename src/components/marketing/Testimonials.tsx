import React from "react";

const testimonials = [
  {
    name: "Sarah K.",
    handle: "@sarah_k_designs",
    quote:
      "This assistant helped me prioritize and automate my week. Clean, simple, and powerful.",
  },
  {
    name: "James P.",
    handle: "@jamespaultech",
    quote:
      "The planning and reminders are spot on. It feels like a real executive assistant.",
  },
  {
    name: "Anya L.",
    handle: "@anya_creates",
    quote:
      "Long-term memory is a game changer. It remembers context I’d normally lose.",
  },
  {
    name: "Mike D.",
    handle: "@mikedevstudio",
    quote:
      "Setup took minutes. The daily plan and goals tracking boosted my focus.",
  },
  {
    name: "Elena S.",
    handle: "@elena_smith",
    quote:
      "Email and calendar automation reduced my admin time dramatically.",
  },
  {
    name: "Kevin M.",
    handle: "@kevin_m_web",
    quote:
      "The design is slick and the AI tools are genuinely useful day-to-day.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Trusted by busy professionals
          </h2>
          <p className="mt-3 text-base text-black/70">
            Real feedback from early users who run their lives with AI.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.handle}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]"
            >
              <p className="text-sm leading-6 text-black/80">“{t.quote}”</p>
              <div className="mt-4 text-xs text-black/60">
                <div className="font-semibold text-black/80">{t.name}</div>
                <div>{t.handle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


