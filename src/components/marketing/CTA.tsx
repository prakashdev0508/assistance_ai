import Link from "next/link";
import React from "react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_40rem_at_80%_20%,rgba(0,0,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-black/10 bg-linear-to-br from-white to-white/60 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-semibold md:text-3xl">
              Make your life run on autopilot
            </h3>
            <p className="mt-3 text-base text-black/70">
              Join the private beta and get early access to your AI life manager.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#"
                className="w-full rounded-md bg-black px-5 py-3.5 text-center text-sm font-medium text-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)] hover:bg-black/90 sm:w-auto"
              >
                Request access
              </Link>
              <Link
                href="#"
                className="w-full rounded-md border border-black/10 bg-white px-5 py-3.5 text-center text-sm font-medium text-black hover:bg-black/5 sm:w-auto"
              >
                View roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


