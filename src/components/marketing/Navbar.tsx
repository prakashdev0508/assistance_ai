import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-6xl rounded-full border border-black/5 bg-white/80 px-4 py-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md ring-1 ring-black/5">
        <nav aria-label="Primary" className="flex items-center gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#2d6bff_0%,#1048ff_100%)] text-white shadow-[0_10px_30px_-10px_rgba(16,72,255,0.6)]">
              <span className="text-base font-semibold">M</span>
            </div>
            <Link href="/" className="text-base font-semibold">
              MyAssistant
            </Link>
          </div>

          {/* Center: Nav links */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link href="#about" className="text-sm font-medium text-black hover:text-black/80">
              About
            </Link>
            <Link href="#solution" className="text-sm font-medium text-black hover:text-black/80">
              Solution
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-black hover:text-black/80">
              Pricing
            </Link>
          </div>

          {/* Right: CTA */}
          <div className="ml-auto flex items-center">
            {session ? (
              <Link href="/dashboard" className=" text-sm font-medium text-black/90 hover:text-black/80 hover:underline underline-offset-2 ">Dashboard <span className=" " >&rarr;</span></Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[linear-gradient(180deg,#1e90ff_0%,#1068ff_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_50px_-18px_rgba(16,104,255,0.9)] ring-1 ring-blue-500/40 hover:brightness-110"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}


