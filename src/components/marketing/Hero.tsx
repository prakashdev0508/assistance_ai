import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section id="about" className="relative scroll-mt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-2 py-1 pr-2 text-xs text-black/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
              <div className="flex -space-x-2">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-2 ring-white" />
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-2 ring-white" />
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-white" />
              </div>
              <span className="pl-1 pr-2 text-black/70">Join 3k+ members</span>
              <Link
                href="#"
                className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(180deg,#ffd84d_0%,#ffc738_100%)] px-3 py-1 font-medium text-black hover:brightness-105"
              >
                Join Waitlist
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                  <path d="M5 12h12m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl">
          Your all-in-one AI life manager 
          </h1>
          <p className="mt-5 text-pretty text-base text-black/70 md:text-lg">
          An intelligent personal AI assistant that plans your day, manages your tasks, remembers everything, and automates your life.          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#"
              className="w-full rounded-full bg-[linear-gradient(180deg,#1e90ff_0%,#1068ff_100%)] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_18px_50px_-18px_rgba(16,104,255,0.8)] ring-1 ring-blue-500/40 hover:brightness-110 sm:w-auto"
            >
              Buy Template
            </Link>
            <Link
              href="#"
              className="w-full rounded-full border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-semibold text-black hover:bg-black/5 sm:w-auto"
            >
              See Solution
            </Link>
          </div>
          <p className="mt-3 text-xs text-black/50">
            No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}


