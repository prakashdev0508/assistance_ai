import React from "react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Director at TechFlow",
    quote: "Assistance AI has completely transformed how our team operates. It&apos;s like having a project manager who never sleeps.",
    image: "/api/placeholder/100/100"
  },
  {
    name: "Michael Ross",
    role: "CTO at Nexus Systems",
    quote: "The natural language processing is mind-blowing. I just tell it what I need, and it executes complex workflows across 5 different apps.",
    image: "/api/placeholder/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Operations",
    quote: "Finally, a tool that actually reduces context switching instead of adding to it. I&apos;m saving about 10 hours a week.",
    image: "/api/placeholder/100/100"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what industry leaders are saying about Assistance AI.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background border border-border p-8 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
              {/* Quote Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-6 right-6 w-8 h-8 text-muted/50 rotate-180">
                <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
              </svg>
              
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-amber-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 fill-current">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-lg mb-8 leading-relaxed text-foreground/90">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted"></div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


