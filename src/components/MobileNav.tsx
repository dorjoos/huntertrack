"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hunters", label: "Hunters", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                active ? "text-purple-400" : "text-zinc-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-purple-400" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
