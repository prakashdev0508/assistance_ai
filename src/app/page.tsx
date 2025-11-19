import { HydrateClient } from "~/trpc/server";
import Navbar from "~/components/marketing/Navbar";
import Hero from "~/components/marketing/Hero";
import Features from "~/components/marketing/Features";
import CTA from "~/components/marketing/CTA";
import Footer from "~/components/marketing/Footer";
import PainPoints from "~/components/marketing/PainPoints";
import Testimonials from "~/components/marketing/Testimonials";
import Pricing from "~/components/marketing/Pricing";
import FAQ from "~/components/marketing/FAQ";

export default async function Home() {

  return (
    <HydrateClient>
      <div className="min-h-dvh bg-white text-black">
        <Navbar />
        <main>
          <Hero />
          <PainPoints />
          <Features />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}
