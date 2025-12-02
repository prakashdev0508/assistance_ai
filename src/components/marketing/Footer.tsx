import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-muted/20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Assistance AI Inc.</div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}


