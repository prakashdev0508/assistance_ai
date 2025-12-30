import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-50 px-4">
      <nav className="rounded-full px-6 py-3 flex items-center gap-8 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-md border border-black/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </div>
          MyAssistant
        </Link>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mx-12">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#testimonials" className="hover:text-foreground transition-colors">
            Customers
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-foreground/80 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium hover:text-foreground/80 transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground border border-primary-border min-h-8 text-xs rounded-full px-4 h-9 font-medium hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}


