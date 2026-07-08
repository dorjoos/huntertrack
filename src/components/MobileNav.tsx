"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "DASH" },
  { href: "/hunters", label: "HUNTERS" },
  { href: "/settings", label: "CONFIG" },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-term-panel border-t border-term-line">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] font-bold tracking-widest px-2.5 py-1.5 transition-colors ${
                active ? "bg-term-accent text-term-bg" : "text-term-mid"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
