import React from "react";

const features = [
  {
    title: "Calendar via Chat",
    description: "Type 'Schedule a meeting with John tomorrow at 2pm' and it's done instantly. No calendar app needed. Ask 'What's on my calendar today?' or 'Move my 3pm meeting to 4pm'—your AI handles everything through conversation.",
  },
  {
    title: "Email Management in Chat",
    description: "Say 'Show me unread emails from Sarah' or 'Draft a reply saying I'll be there'—your AI reads Gmail, searches conversations, and manages your inbox. Never open Gmail again. Just chat.",
  },
  {
    title: "Meet Links from Chat",
    description: "Type 'Create a Google Meet for the team standup' and get an instant link. Your AI generates Meet codes, creates spaces, and shares links—all in one message. No manual setup required.",
  },
  {
    title: "Tasks Through Conversation",
    description: "Tell your AI 'Add a task to finish the report by Friday with subtasks for research, writing, and review'—it creates everything automatically. Ask 'What tasks are due this week?' and get instant answers. No task app needed.",
  },
  {
    title: "Smart Planning via AI",
    description: "Ask 'What should I focus on today?' and your AI analyzes your calendar, deadlines, and priorities to suggest an optimal plan—all through chat. It considers your energy levels, meeting times, and task dependencies automatically.",
  },
  {
    title: "Context-Aware Memory",
    description: "Your AI remembers everything from past conversations—preferences, important dates, recurring tasks, and context. Ask 'What did we discuss about the project last week?' and it recalls instantly. Every chat gets smarter.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              Features
            </span>
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything You Need, One AI Chat
          </h2>
          <p className="mt-3 text-base text-black/70">
            Replace all your productivity apps with one conversation. Just type what you need—your AI handles email, calendar, meetings, and tasks instantly. No apps to open, no interfaces to learn.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-black/10 bg-gradient-to-br from-white to-gray-50/50 p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-black/20"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-sm leading-7 text-black/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


