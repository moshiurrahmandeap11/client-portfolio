import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moshiur Rahman Deap | Full-Stack Software Engineer",
  description:
    "Moshiur Rahman Deap is a passionate Full-Stack Software Engineer specializing in Next.js, React, Node.js, and MongoDB. Building scalable web applications with modern technologies. Based in Bangladesh, available for freelance and full-time opportunities.",
  keywords: [
    "Moshiur Rahman Deap",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer Bangladesh",
    "Freelance Web Developer",
  ],
  authors: [{ name: "Moshiur Rahman Deap" }],
  creator: "Moshiur Rahman Deap",
  publisher: "Moshiur Rahman Deap",
  openGraph: {
    title: "Moshiur Rahman Deap | Full-Stack Software Engineer",
    description:
      "Passionate Full-Stack Developer specializing in modern web technologies. Building scalable and performant web applications.",
    url: "https://moshiurrahman.online",
    siteName: "Moshiur Rahman Deap Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moshiur Rahman Deap - Full-Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moshiur Rahman Deap | Full-Stack Software Engineer",
    description:
      "Building scalable web applications with Next.js, React, Node.js, and MongoDB.",
    images: ["/og-image.jpg"],
    creator: "@__moshiur",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "wY7C4u67nwFu3q1CQ_23yzd0Y4sIuOMLhW02l-a6UQI",
  },
  alternates: {
    canonical: "https://moshiurrahman.online",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7757119469762225"
          crossOrigin="anonymous"></script>
        <div className="w-full max-w-10/12 mx-auto">
          <main className="min-h-screen flex gap-6">
            {/* Content */}
            <section className="flex-1">{children}</section>
          </main>
        </div>
      </body>
    </html>
  );
}
