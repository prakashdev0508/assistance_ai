import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import Navbar from "~/components/marketing/Navbar";
import Hero from "~/components/marketing/Hero";
import Features from "~/components/marketing/Features";
import Testimonials from "~/components/marketing/Testimonials";
import FAQ from "~/components/marketing/FAQ";
import Footer from "~/components/marketing/Footer";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          
          {/* Trusted by Section */}
          <div className="border-y border-border/50 bg-muted/30 py-10 overflow-hidden">
            <div className="container mx-auto px-6">
              <p className="text-center text-sm font-mono text-muted-foreground mb-8 uppercase tracking-widest">
                Trusted by innovative teams
              </p>
              <div className="flex justify-center gap-12 md:gap-24 opacity-50 grayscale items-center flex-wrap">
                <span className="text-xl font-bold">ACME Corp</span>
                <span className="text-xl font-bold">GlobalBank</span>
                <span className="text-xl font-bold">NEXUS</span>
                <span className="text-xl font-bold">Starlight</span>
                <span className="text-xl font-bold">Vertex</span>
              </div>
            </div>
          </div>
          
          <Features />
          <Testimonials />
          <FAQ />
          
          {/* Final CTA Section */}
          <section className="py-24 md:py-32 border-t border-border relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                  Stop managing apps. <br /> Start managing work.
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Join the waitlist today and get early access to the future of work automation.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Link
                    href="/login"
                    className="h-12 px-8 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                  >
                    Get Started Now
                  </Link>
                  <a
                    href="/contact"
                    className="h-12 px-8 rounded-full border border-border hover:bg-muted transition-colors font-medium flex items-center gap-2"
                  >
                    Contact Sales
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mesh opacity-30 blur-[100px] rounded-full -z-10"></div>
          </section>
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}


