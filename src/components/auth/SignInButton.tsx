"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { useState } from "react";


export default function SignInButton({redirectTo}: {redirectTo?: string}) {
    if (!redirectTo) {
        redirectTo = "/dashboard";
    }
    if (typeof redirectTo !== "string") {
        redirectTo = "/dashboard";
    }
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: redirectTo });
    } finally {
      // If redirect didn't happen (e.g., popup blocked), allow retry
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-blue-500/40 shadow-[0_18px_50px_-18px_rgba(16,104,255,0.9)] ${isLoading ? "bg-blue-500/70 cursor-not-allowed" : "bg-[linear-gradient(180deg,#1e90ff_0%,#1068ff_100%)] hover:brightness-110"}`}
    >
      {isLoading ? (
        <>
          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
          Signing in...
        </>
      ) : (
        "Continue with Google"
      )}
    </button>
  );
}


