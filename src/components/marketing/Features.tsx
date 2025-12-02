import React from "react";

const features = [
  {
    title: "Universal Integration",
    description: "Connects seamlessly with Jira, Slack, Linear, and 50+ other enterprise tools.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground">
        <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"></path>
      </svg>
    ),
    color: "blue",
    span: "md:col-span-2"
  },
  {
    title: "Real-time Analysis",
    description: "Visualize complex datasets with simple natural language queries.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground">
        <path d="M5 21v-6"></path>
        <path d="M12 21V9"></path>
        <path d="M19 21V3"></path>
      </svg>
    ),
    color: "emerald",
    span: "md:col-span-1"
  },
  {
    title: "Smart Automation",
    description: "Trigger multi-step workflows across different platforms automatically.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
      </svg>
    ),
    color: "amber",
    span: "md:col-span-1"
  },
  {
    title: "Enterprise Security",
    description: "SOC2 Type II compliant with end-to-end encryption for all your data.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
    color: "purple",
    span: "md:col-span-2"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful features for <br />
            <span className="text-muted-foreground">modern teams.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to automate your work, all in one place. Built for speed and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-background p-8 hover:border-foreground/20 transition-colors ${feature.span}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-${feature.color}-500/5`}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg border border-border bg-background/50 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


