import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Crosshair, Zap } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "YWH Tracker",
  description: "YesWeHack Hacktivity Tracker",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hunters", label: "Hunters", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="flex h-screen">
          <nav className="w-[220px] flex flex-col shrink-0 border-r border-border-subtle bg-surface-raised/50">
            <div className="p-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                  <Crosshair className="w-4 h-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-zinc-100 tracking-tight">YWH Tracker</span>
                  <span className="text-[10px] text-zinc-500 leading-none">Hacktivity Monitor</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 px-3 space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-all duration-150"
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="p-4 mx-3 mb-3 rounded-lg bg-accent/[0.06] border border-accent/10">
              <div className="flex items-center gap-2 text-accent text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                Auto-poll active
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Every 30 min</p>
            </div>
          </nav>
          <main className="flex-1 overflow-auto">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
