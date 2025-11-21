"use client";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function cleanupAndSignOut() {
    try {
      setIsLoading(true);
      // Clear client-side caches and storage for a clean logout
      try {
        queryClient.clear();
      } catch {}
      try {
        localStorage.clear();
      } catch {}
      try {
        sessionStorage.clear();
      } catch {}
      try {
        if (typeof caches !== "undefined" && caches.keys) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {}
      // Trigger NextAuth signOut with redirect to home
      await signOut({ callbackUrl: "/", redirect: true });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={cleanupAndSignOut}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black/5 ${isLoading ? "cursor-wait opacity-70" : ""}`}
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}


