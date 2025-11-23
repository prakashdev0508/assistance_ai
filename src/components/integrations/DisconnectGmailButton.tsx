"use client";

import { useRouter } from "next/navigation";

export default function DisconnectGmailButton() {
  const router = useRouter();

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/integrations/google/gmail/disconnect", {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to disconnect Gmail");
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDisconnect}
      className="rounded-full bg-black/10 px-4 py-1.5 text-xs font-semibold text-black hover:bg-black/20 transition-colors"
    >
      Disconnect
    </button>
  );
}

