import Navbar from "~/components/marketing/Navbar";
import Footer from "~/components/marketing/Footer";
import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Contact us</h1>
        <p className="mt-2 text-black/70">
          We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
        </p>
        <form className="mt-8 grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Your name"
            className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-black/50 focus:ring-2 focus:ring-black/10"
          />
          <input
            type="email"
            placeholder="Email address"
            className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-black/50 focus:ring-2 focus:ring-black/10"
          />
          <textarea
            placeholder="Message"
            rows={5}
            className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-black/50 focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            className="w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            Send message
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}


