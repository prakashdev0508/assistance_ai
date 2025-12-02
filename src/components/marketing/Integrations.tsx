import React from "react";

const integrations = [
  {
    name: "Google Calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
        <path d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
      </svg>
    ),
    color: "#4285F4",
  },
  {
    name: "Gmail",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
    color: "#EA4335",
  },
  {
    name: "Google Meet",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        <path d="M9.5 7.5v9l6-4.5-6-4.5z" fill="white"/>
      </svg>
    ),
    color: "#00832D",
  },
  {
    name: "Tasks & Goals",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    color: "#9334E6",
  },
];

export default function Integrations() {
  return (
    <section id="integrations" className="bg-[#f5f5f5] py-12 md:py-16 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-base md:text-lg font-medium text-black/60 mb-10 md:mb-12">
            Integrations
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="text-black/60" style={{ color: integration.color }}>
                  {integration.icon}
                </div>
                <div className="text-sm md:text-base font-medium text-black/60">
                  {integration.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

