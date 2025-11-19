import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-black/60 md:flex-row">
        <p>© {new Date().getFullYear()} Assistant AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-black">
            Privacy
          </Link>
          <Link href="#" className="hover:text-black">
            Terms
          </Link>
          <Link href="#" className="hover:text-black">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}


