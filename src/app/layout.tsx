import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/theme-provider";
import { TopLoaderProvider } from "~/components/shared/TopLoaderProvider";

export const metadata: Metadata = {
  title: "QuestStack - Mini Q&A Platform",
  description:
    "QuestStack is a mini Q&A platform built with Next.js. Ask questions, give answers, and explore a community-driven collection of knowledge.",
  keywords: [
    "QuestStack",
    "Q&A",
    "Next.js",
    "questions",
    "answers",
    "StackOverflow",
  ],
  authors: [{ name: "VoidFnc" }, { name: "NeoCortexx" }],
  openGraph: {
    title: "QuestStack - Mini Q&A Platform",
    description:
      "Ask questions, give answers, and explore a community-driven collection of knowledge with QuestStack, a lightweight Q&A platform built with Next.js.",
    url: "https://yourwebsite.com",
    siteName: "QuestStack",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestStack - Mini Q&A Platform",
    description:
      "A lightweight Q&A platform built with Next.js. Ask questions, provide answers, and explore community knowledge.",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TRPCReactProvider>
              <Navbar />
              <main className="container mx-auto max-w-4xl py-8">
                <TopLoaderProvider />
                {children}
              </main>
              <Toaster richColors position="top-center" />
            </TRPCReactProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
