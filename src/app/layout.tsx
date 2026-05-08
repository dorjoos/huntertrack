import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Shield } from "lucide-react";
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
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <nav className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="font-bold text-lg">YWH Tracker</span>
              </div>
            </div>
            <div className="flex-1 p-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
