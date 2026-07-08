import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const termFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-term" });

export const metadata: Metadata = {
  title: "HUNTERTRACK",
  description: "YesWeHack Hacktivity Monitor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${termFont.variable}`}>
      <body className="antialiased">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
