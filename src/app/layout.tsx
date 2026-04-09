import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header/Header";
import Footer from "./components/sharedComponents/Footer/Footer";
import NavList from "./components/sharedComponents/NavList/NavList";
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
        <header className="sticky top-0 z-50 w-full max-w-10/12 mx-auto">
          <Header />
        </header>
        <div className="w-full max-w-10/12 mx-auto pt-10">
          {/* Top HR */}
          <div className="h-px bg-gray-700 w-full"></div>

          <main className="min-h-screen flex gap-6">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 relative px-4">
              <div className="absolute left-0 top-0 h-full w-px bg-gray-700"></div>
              <div className="absolute right-0 top-0 h-full w-px bg-gray-700"></div>

              <div className=" top-20">
                <NavList />
              </div>
            </aside>

            {/* Content */}
            <section className="flex-1">{children}</section>
          </main>
        </div>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
