import React from "react";
import SignInButton from "~/components/auth/SignInButton";
import Navbar from "~/components/marketing/Navbar";
import Footer from "~/components/marketing/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <Navbar />
      <main className="relative">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade-bottom-lg" />
        <div className="relative mx-auto flex min-h-[70dvh] max-w-5xl flex-col items-center justify-center px-6 py-12 md:flex-row md:gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 text-black/70 md:text-lg">
              Sign in to your personal AI assistant to access tasks, plans, and
              memories synchronized across your devices.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-black/70 md:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                Secure by design
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                One tap Google sign-in
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                No password to remember
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                Fast account switching
              </li>
            </ul>
          </div>
          <div className="mt-10 w-full max-w-md md:mt-0">
            <div className="rounded-3xl border border-black/10 bg-gradient-to-b from-white to-white/70 p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#2d6bff_0%,#1048ff_100%)] text-white shadow-[0_10px_30px_-10px_rgba(16,72,255,0.6)]">
                <span className="text-base font-semibold">AI</span>
              </div>
              <h2 className="text-center text-xl font-semibold">Sign in</h2>
              <p className="mt-2 text-center text-sm text-black/70">
                Continue with your Google account.
              </p>
              <div className="mt-6 flex justify-center">
                <SignInButton  />
              </div>
              <p className="mt-4 text-center text-xs text-black/50">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:no-underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:no-underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


