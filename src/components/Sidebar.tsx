"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Crosshair, Radio } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hunters", label: "Hunters", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="w-[240px] flex flex-col shrink-0 glass max-md:hidden">
      <div className="p-6 pb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Crosshair className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#06060a] animate-glow-pulse" />
          </div>
          <div>
            <span className="font-bold text-[15px] gradient-text tracking-tight">YWH Tracker</span>
            <span className="block text-[10px] text-zinc-600 font-medium tracking-widest uppercase">Hacktivity</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                active
                  ? "text-white bg-gradient-to-r from-purple-500/15 to-blue-500/10 shadow-sm shadow-purple-500/5"
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] transition-colors ${active ? "text-purple-400" : ""}`} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </Link>
          );
        })}
      </div>

      <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-green-400" />
            <span className="absolute w-6 h-6 rounded-full bg-green-400/20 animate-ping" />
          </div>
          <span className="text-xs font-semibold text-green-400">Live Polling</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Auto-sync every 30 min</p>
        <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-glow-pulse" />
        </div>
      </div>
    </nav>
  );
}
