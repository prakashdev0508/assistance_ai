"use client";

import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            Now Live
            <span className="mx-1 text-border">|</span>
            <span className="text-foreground flex items-center gap-1">
              Join 10,000+ users
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Your unified intelligent <br />
            <span className="text-muted-foreground">workspace.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-balance">
            Connect all your apps, tools, and workflows into one seamless chat interface. Stop switching tabs. Start getting things done.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground border border-primary-border min-h-10 h-12 rounded-full px-8 text-base hover:bg-primary/90"
            >
              Start for free
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 w-4 h-4">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-border min-h-10 h-12 rounded-full px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 w-4 h-4">
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
              </svg>
              View Pricing
            </Link>
          </div>

          {/* Dashboard Preview with Image */}
          <div className="mt-20 relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-background/50">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <img 
              src="/image.jpg" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-mesh -z-10 opacity-40 mask-gradient-b"></div>
    </section>
  );
}


