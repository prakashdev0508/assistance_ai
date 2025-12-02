"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "How does Assistance AI connect to my apps?",
    answer: "We use secure OAuth connections and official APIs to integrate with your tools. You can connect or disconnect apps anytime from your dashboard. All data is encrypted in transit and at rest."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We're SOC2 Type II certified and use end-to-end encryption for all your data. Your information is never shared with third parties, and you maintain full control over what apps we can access."
  },
  {
    question: "Can I build custom workflows?",
    answer: "Yes! Our advanced workflow builder lets you create multi-step automations across all your connected apps. Use our natural language interface to describe what you want, and we'll help build it."
  },
  {
    question: "Do you offer enterprise support?",
    answer: "Yes, we provide dedicated enterprise support with SLA guarantees, priority response times, and a dedicated customer success manager for Enterprise plans."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>
        
        <div className="w-full">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex flex-1 items-center justify-between text-left text-lg font-medium py-6 hover:text-primary transition-colors w-full"
              >
                {faq.question}
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
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              {openIndex === index && (
                <div className="pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


