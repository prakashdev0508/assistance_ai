import Link from "next/link";
import React from "react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for individuals trying out AI-powered productivity.",
    features: [
      "5 AI conversations per day",
      "Basic task management",
      "Email integration",
      "Mobile app access",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For power users who want advanced automation and insights.",
    features: [
      "Unlimited AI conversations",
      "Advanced task & goal tracking",
      "Calendar & email automation",
      "Custom workflows",
      "Priority support",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for teams and organizations.",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security & compliance",
      "Team collaboration tools",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose the perfect plan for your needs. Always know what you&apos;ll pay.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-background p-8 shadow-sm hover:shadow-md transition-all ${
                plan.highlighted
                  ? "border-foreground scale-105 md:scale-110"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-foreground px-4 py-1 text-xs font-medium text-background">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-foreground shrink-0 mt-0.5"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`block w-full text-center py-3 px-4 rounded-full font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/contact" className="text-foreground hover:underline">
              Contact us
            </Link>
            <span className="text-border">•</span>
            <Link href="/pricing#faq" className="text-foreground hover:underline">
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


