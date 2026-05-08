"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";

export default function MarkAllReadButton({ hunterId }: { hunterId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMarkAll() {
    setLoading(true);
    await fetch("/api/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true, hunterId }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkAll}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 border border-border-subtle text-sm font-medium text-zinc-400 rounded-xl hover:bg-white/[0.04] hover:text-zinc-200 disabled:opacity-50 transition-all"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
      {loading ? "Marking..." : "Mark All Read"}
    </button>
  );
}
