"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DisconnectGmailButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      const response = await fetch("/api/integrations/google/gmail/disconnect", {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to disconnect Gmail");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDisconnect}
      disabled={isLoading}
      className="rounded-full bg-black/10 px-4 py-1.5 text-xs font-semibold text-black hover:bg-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
          Disconnecting...
        </span>
      ) : (
        "Disconnect"
      )}
    </button>
  );
}

