import Navbar from "~/components/marketing/Navbar";
import Footer from "~/components/marketing/Footer";
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Privacy Policy
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
              MyAssistant (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered personal assistant platform and related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              Please read this Privacy Policy carefully. By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="mb-3 mt-6 text-xl font-semibold">2.1 Information You Provide</h3>
            <p className="text-base leading-relaxed text-black/80">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Account Information:</strong> Name, email address, and profile information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Settings:</strong> Email signature, notification preferences, and other user preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Content:</strong> Tasks, goals, calendar events, and other data you create or manage through the Service</span>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold">2.2 Information from Third-Party Services</h3>
            <p className="text-base leading-relaxed text-black/80">
              When you connect third-party services (such as Google Calendar or Gmail), we access and store:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Calendar events and scheduling information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Email messages, threads, and metadata</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Access tokens and authentication credentials (stored securely and encrypted)</span>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-xl font-semibold">2.3 Automatically Collected Information</h3>
            <p className="text-base leading-relaxed text-black/80">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Usage data, including how you interact with the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Device information, browser type, and IP address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Log data and error reports</span>
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-base leading-relaxed text-black/80">
              We use the information we collect to:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Provide, maintain, and improve our Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Process your requests and manage your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Send emails, schedule events, and perform other actions on your behalf</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Personalize your experience and provide AI-powered assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Send you technical notices, updates, and support messages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Detect, prevent, and address technical issues and security threats</span>
              </li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Data Sharing and Disclosure</h2>
            <p className="text-base leading-relaxed text-black/80">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our Service, subject to confidentiality agreements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
            <p className="text-base leading-relaxed text-black/80">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Encryption of data in transit using TLS/SSL protocols</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Encryption of sensitive data at rest</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Secure authentication and access controls</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Regular security audits and monitoring</span>
              </li>
            </ul>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Your Rights and Choices</h2>
            <p className="text-base leading-relaxed text-black/80">
              You have the following rights regarding your personal information:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Access:</strong> Request access to your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Correction:</strong> Update or correct inaccurate information through your account settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Deletion:</strong> Request deletion of your account and associated data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Disconnect:</strong> Disconnect third-party integrations at any time through your settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span><strong>Opt-Out:</strong> Unsubscribe from marketing communications (you may still receive service-related messages)</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
            <p className="text-base leading-relaxed text-black/80">
              We retain your personal information for as long as your account is active or as needed to provide you with our Service. We may retain certain information for longer periods as required by law or for legitimate business purposes, such as:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Compliance with legal obligations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Resolving disputes and enforcing agreements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>Preventing fraud and abuse</span>
              </li>
            </ul>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it by law.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Children&apos;s Privacy</h2>
            <p className="text-base leading-relaxed text-black/80">
              Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">9. International Data Transfers</h2>
            <p className="text-base leading-relaxed text-black/80">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives adequate protection.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Changes to Privacy Policy</h2>
            <p className="text-base leading-relaxed text-black/80">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We may also notify you via email or through the Service.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              Your continued use of the Service after such changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
            <p className="text-base leading-relaxed text-black/80">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 space-y-2 text-base leading-relaxed text-black/80">
              <p><strong>Email:</strong> privacy@myassistant.com</p>
              <p><strong>Support:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

