import React from "react";

const integrations = [
  {
    name: "Google Calendar",
    desc: "Sync events, availability, and reminders.",
    status: "Not connected",
    action: "Connect",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4285F4] text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            d="M7 4h10v4H7zM5 8h14v12H5z"
            fill="white"
          />
        </svg>
      </div>
    ),
  },
  {
    name: "Gmail",
    desc: "Draft and send emails, summarize threads.",
    status: "Not connected",
    action: "Connect",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#ea4335] via-[#fbbc05] to-[#34a853] text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            d="M3 7l9 6 9-6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
            fill="white"
          />
          <path d="M3 7l9 6 9-6-9-5-9 5Z" fill="white" opacity="0.6" />
        </svg>
      </div>
    ),
  },
  {
    name: "Google Drive",
    desc: "Search and understand files across folders.",
    status: "Not connected",
    action: "Connect",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            d="M7 4h6l4 7h-6z"
            fill="#34a853"
          />
          <path
            d="M13 4h4l5 9h-4z"
            fill="#4285f4"
          />
          <path
            d="M2 13h6l4 7H6z"
            fill="#fbbc05"
          />
        </svg>
      </div>
    ),
  },
  {
    name: "Google Meet",
    desc: "Join calls, send recaps, auto-schedule follow-ups.",
    status: "Not connected",
    action: "Connect",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f9d58] text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M5 6h8l4 4v8H5z"
            fill="white"
          />
          <path d="M17 10v5l3 2v-9z" fill="white" opacity="0.6" />
        </svg>
      </div>
    ),
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-black/50">Connect services</p>
        <h1 className="text-3xl font-semibold text-black">Integrations</h1>
        <p className="text-sm text-black/60">
          Enable Google-powered automations for planning, communication, and files.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => (
          <div
            key={i.name}
            className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {i.icon}
                <div>
                  <div className="text-sm font-semibold text-black">{i.name}</div>
                  <div className="text-xs text-black/60">{i.desc}</div>
                </div>
              </div>
              <span className="text-xs text-black/60">{i.status}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-black/50">
              <span>Scope: minimal, user approved</span>
              <button className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                {i.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


