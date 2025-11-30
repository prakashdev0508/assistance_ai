import Navbar from "~/components/marketing/Navbar";
import Footer from "~/components/marketing/Footer";
import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-base text-black/60">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p className="text-base leading-relaxed text-black/80">
              Welcome to MyAssistant (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of our AI-powered personal assistant platform and related services (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              If you do not agree to these Terms, please do not use our Service. We may update these Terms from time to time, and your continued use of the Service after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Acceptance of Terms</h2>
            <p className="text-base leading-relaxed text-black/80">
              By creating an account, accessing, or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. You must be at least 18 years old to use our Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">3. Description of Service</h2>
            <p className="text-base leading-relaxed text-black/80">
              MyAssistant is an AI-powered platform that helps you manage your calendar, emails, tasks, and goals through natural language interactions. Our Service integrates with third-party services including Google Calendar, Gmail, and other productivity tools.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Calendar management and event scheduling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Email management and automated responses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Task and goal tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>AI-powered assistance and automation</span>
              </li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">4. User Accounts</h2>
            <p className="text-base leading-relaxed text-black/80">
              To use certain features of our Service, you must create an account. You agree to:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Provide accurate, current, and complete information during registration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Maintain and update your account information to keep it accurate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Maintain the security of your account credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Accept responsibility for all activities that occur under your account</span>
              </li>
            </ul>
          </section>

          {/* Third-Party Integrations */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Third-Party Integrations</h2>
            <p className="text-base leading-relaxed text-black/80">
              Our Service integrates with third-party services such as Google Calendar and Gmail. By connecting these services, you:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Authorize us to access and use your data from these services as necessary to provide our Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Agree to comply with the terms and conditions of these third-party services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Understand that we are not responsible for the availability or functionality of third-party services</span>
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">6. User Responsibilities</h2>
            <p className="text-base leading-relaxed text-black/80">
              You agree not to:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Use the Service for any illegal or unauthorized purpose</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Attempt to gain unauthorized access to any part of the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Interfere with or disrupt the Service or servers connected to the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Transmit any viruses, malware, or other harmful code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Use the Service to violate any applicable laws or regulations</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Intellectual Property</h2>
            <p className="text-base leading-relaxed text-black/80">
              The Service, including its original content, features, and functionality, is owned by MyAssistant and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
            </p>
          </section>

          {/* Privacy and Data */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Privacy and Data</h2>
            <p className="text-base leading-relaxed text-black/80">
              Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              We take data security seriously and implement industry-standard measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-base leading-relaxed text-black/80">
              To the maximum extent permitted by law, MyAssistant shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
            </p>
          </section>

          {/* Termination */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Termination</h2>
            <p className="text-base leading-relaxed text-black/80">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Changes to Terms</h2>
            <p className="text-base leading-relaxed text-black/80">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Contact Information</h2>
            <p className="text-base leading-relaxed text-black/80">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <p>Email: support@myassistant.com</p>
              <p>Website: <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

