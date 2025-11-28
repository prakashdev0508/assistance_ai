import React from "react";

const painPoints = [
  { title: "Switching between multiple apps", desc: "Jumping between Google Calendar, Gmail, Meet, and task managers for every action. Each tool requires learning its interface and workflow." },
  { title: "No natural way to interact", desc: "You have to navigate menus, fill forms, and click buttons instead of just telling an AI assistant what you need in plain English." },
  { title: "Everything requires manual steps", desc: "Scheduling a meeting? Create event, add attendees, find a time, create Meet link, send invites—all done manually, step by step." },
  { title: "No intelligent help", desc: "Tools don't understand your context, can't suggest better times, or proactively help. You're on your own to figure everything out." },
  { title: "Information scattered everywhere", desc: "Important details live in emails, calendar notes, task descriptions, and chat threads—with no AI to connect the dots and remind you." },
  { title: "Time wasted on simple tasks", desc: "What should be instant—like checking your schedule or finding an email—takes multiple clicks, searches, and mental effort every single time." },
];

export default function PainPoints() {
  return (
    <section id="pain-points" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Stop juggling apps. Just chat with AI.
          </h2>
          <p className="mt-3 text-base text-black/70">
            One conversation interface replaces all your tools. Tell your AI what you need—it handles email, calendar, meetings, and tasks instantly. Zero clicks, zero learning curve.
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


