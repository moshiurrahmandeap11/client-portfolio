// app/privacy-policy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Moshiur Rahman",
  description:
    "Read the privacy policy of moshiurrahman.online to understand how user data is collected, used, and protected.",
  keywords: [
    "Privacy Policy",
    "moshiurrahman.online",
    "data protection",
    "user privacy",
    "website policy",
  ],
  alternates: {
    canonical: "https://moshiurrahman.online/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Moshiur Rahman",
    description:
      "Learn how moshiurrahman.online handles user privacy and data protection.",
    url: "https://moshiurrahman.online/privacy-policy",
    siteName: "Moshiur Rahman",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">
            Last Updated: May 15, 2026
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Information We Collect
          </h2>
          <p className="text-zinc-300 leading-8">
            We may collect personal information such as your name,
            email address, browser details, IP address, and usage
            analytics when you interact with our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            How We Use Your Information
          </h2>

          <ul className="list-disc pl-6 text-zinc-300 leading-8">
            <li>Improve website functionality and performance</li>
            <li>Respond to messages and inquiries</li>
            <li>Analyze website traffic and engagement</li>
            <li>Prevent spam and unauthorized activities</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Cookies
          </h2>

          <p className="text-zinc-300 leading-8">
            Our website may use cookies and similar technologies to
            improve user experience and analyze website traffic.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Third-Party Services
          </h2>

          <p className="text-zinc-300 leading-8">
            We may use third-party tools and services such as Google
            Analytics and Google AdSense which may collect data based
            on their own privacy policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Data Protection
          </h2>

          <p className="text-zinc-300 leading-8">
            We take reasonable measures to protect user information
            from unauthorized access, disclosure, or misuse.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            External Links
          </h2>

          <p className="text-zinc-300 leading-8">
            Our website may contain links to third-party websites.
            We are not responsible for their privacy practices or
            content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Contact
          </h2>

          <p className="text-zinc-300 leading-8">
            If you have questions regarding this Privacy Policy,
            please contact us through the contact page.
          </p>
        </section>
      </div>
    </main>
  );
}