import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-black/60 md:flex-row">
        <p>© {new Date().getFullYear()} myassistant. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-black">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-black">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}


