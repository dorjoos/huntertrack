"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "DASHBOARD" },
  { href: "/hunters", label: "HUNTERS" },
  { href: "/settings", label: "SETTINGS" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="w-[230px] flex flex-col shrink-0 bg-term-panel border-r border-term-line max-md:hidden">
      <div className="p-5 pb-8">
        <Link href="/" className="block">
          <span className="block text-[15px] font-bold text-term-bright term-glow">▛▚ HUNTERTRACK</span>
          <span className="block text-[10px] text-term-dim mt-1 tracking-widest">v0.1.0 // SECURE</span>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-[12px] font-bold tracking-widest transition-colors ${
                active
                  ? "bg-term-accent text-term-bg"
                  : "text-term-mid hover:text-term-text hover:bg-white/[0.03]"
              }`}
            >
              {active ? "> " : "  "}
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mx-4 mb-4">
        <pre className="text-[10px] leading-[1.6] text-term-dim select-none">{`┌─ SYS STATUS ─────┐
│ POLL   : ACTIVE  │
│ CYCLE  : 30 MIN  │
│ SOURCE : YWH API │
└──────────────────┘`}</pre>
        <p className="mt-2 text-[10px] font-bold tracking-widest text-term-accent2">
          <span className="term-blink">●</span> MONITORING
        </p>
      </div>
    </nav>
  );
}
