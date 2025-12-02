import { HydrateClient } from "~/trpc/server";
import Navbar from "~/components/marketing/Navbar";
import Pricing from "~/components/marketing/Pricing";
import FAQ from "~/components/marketing/FAQ";
import Footer from "~/components/marketing/Footer";

export default async function PricingPage() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-20">
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}

