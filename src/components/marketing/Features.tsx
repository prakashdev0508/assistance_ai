import React from "react";

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
            Replace all your productivity apps with one conversation. Just type what you need—your AI handles email, calendar, meetings, and tasks instantly.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {/* Large Card - AI-Powered Chat Interface */}
          <div className="group relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1 md:col-span-2">
            <div className="mb-4 rounded-xl border border-black/10 bg-gray-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="ml-auto h-6 w-20 rounded bg-black/5"></div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-black/10"></div>
                    <div className="h-3 w-1/2 rounded bg-black/10"></div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="flex-1 space-y-2 text-right">
                    <div className="ml-auto h-3 w-2/3 rounded bg-blue-500/20"></div>
                    <div className="ml-auto h-3 w-1/3 rounded bg-blue-500/20"></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-black/10 bg-white p-3">
                  <div className="h-4 w-4 rounded bg-black/10"></div>
                  <div className="flex-1 h-4 rounded bg-black/5"></div>
                  <div className="h-6 w-16 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">AI-Powered Chat Interface</h3>
            <p className="text-sm leading-6 text-black/70">
              Get personalized assistance with AI-powered chat that helps you manage your calendar, email, meetings, and tasks effortlessly through natural conversation.
            </p>
          </div>

          {/* Card 1 - Calendar Management */}
          <div className="group relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="mb-4 rounded-xl border border-black/10 bg-gray-50/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-4 w-16 rounded bg-black/10"></div>
                <div className="h-4 w-4 rounded bg-blue-500/20"></div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-6 rounded bg-black/5 text-center text-[8px] text-black/40"></div>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded bg-blue-500/20"></div>
                <div className="h-2 w-3/4 rounded bg-purple-500/20"></div>
                <div className="h-2 w-1/2 rounded bg-green-500/20"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Calendar Management</h3>
            <p className="text-sm leading-6 text-black/70">
              Schedule meetings, view your agenda, and manage events—all through simple chat commands.
            </p>
          </div>

          {/* Card 2 - Email Integration */}
          <div className="group relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="mb-4 rounded-xl border border-black/10 bg-gray-50/50 p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-500/20"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-black/10"></div>
                    <div className="h-2 w-2/3 rounded bg-black/10"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500/20"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-black/10"></div>
                    <div className="h-2 w-3/4 rounded bg-black/10"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-500/20"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-black/10"></div>
                    <div className="h-2 w-1/2 rounded bg-black/10"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Email Integration</h3>
            <p className="text-sm leading-6 text-black/70">
              Read, search, and manage your Gmail inbox without ever leaving the chat interface.
            </p>
          </div>

          {/* Card 3 - Task Management */}
          <div className="group relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="mb-4 rounded-xl border border-black/10 bg-gray-50/50 p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-black/20"></div>
                  <div className="flex-1 h-3 rounded bg-black/10"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-500/20"></div>
                  <div className="flex-1 h-3 rounded bg-black/5"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-black/20"></div>
                  <div className="flex-1 h-3 rounded bg-black/10"></div>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="h-2 w-full rounded bg-black/5"></div>
                  <div className="h-2 w-3/4 rounded bg-black/5"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Task Management</h3>
            <p className="text-sm leading-6 text-black/70">
              Create tasks, set priorities, and track progress with subtasks—all through conversation.
            </p>
          </div>

          {/* Card 4 - Smart Planning */}
          <div className="group relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="mb-4 rounded-xl border border-black/10 bg-gray-50/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-black/10"></div>
                <div className="h-3 w-12 rounded bg-green-500/20 text-[10px] text-green-600"></div>
              </div>
              <div className="relative h-16 w-full">
                <svg viewBox="0 0 200 60" className="h-full w-full">
                  <path
                    d="M0 50 L30 40 L60 45 L90 35 L120 25 L150 30 L180 20 L200 15"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Smart Planning</h3>
            <p className="text-sm leading-6 text-black/70">
              Get intelligent daily plans based on your schedule, deadlines, and priorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


