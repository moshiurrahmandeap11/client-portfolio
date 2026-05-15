// app/terms-and-conditions/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Moshiur Rahman",
  description:
    "Read the terms and conditions for using moshiurrahman.online.",
  keywords: [
    "Terms and Conditions",
    "Website Terms",
    "moshiurrahman.online",
    "User Agreement",
  ],
  alternates: {
    canonical: "https://moshiurrahman.online/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Moshiur Rahman",
    description:
      "Review the terms and conditions for using moshiurrahman.online.",
    url: "https://moshiurrahman.online/terms-and-conditions",
    siteName: "Moshiur Rahman",
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>

          <p className="text-zinc-400">
            Last Updated: May 15, 2026
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Acceptance of Terms
          </h2>

          <p className="text-zinc-300 leading-8">
            By accessing and using this website, you agree to comply
            with these terms and conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Website Usage
          </h2>

          <p className="text-zinc-300 leading-8">
            You agree not to misuse the website, attempt unauthorized
            access, or perform activities that may damage the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Intellectual Property
          </h2>

          <p className="text-zinc-300 leading-8">
            All website content including text, branding, code, and
            design remains the property of moshiurrahman.online unless
            otherwise stated.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Third-Party Links
          </h2>

          <p className="text-zinc-300 leading-8">
            We may include links to external websites. We are not
            responsible for the content or services provided by those
            websites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Limitation of Liability
          </h2>

          <p className="text-zinc-300 leading-8">
            We are not liable for any direct or indirect damages
            resulting from the use of this website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Changes to Terms
          </h2>

          <p className="text-zinc-300 leading-8">
            We reserve the right to update or modify these terms at
            any time without prior notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Contact
          </h2>

          <p className="text-zinc-300 leading-8">
            If you have any questions regarding these terms, please
            contact us through the website contact page.
          </p>
        </section>
      </div>
    </main>
  );
}