import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "YWH Tracker",
  description: "YesWeHack Hacktivity Tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
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
