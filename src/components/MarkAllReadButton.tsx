"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      className="term-btn px-3 py-1.5 text-[11px] font-bold"
    >
      {loading ? "[ MARKING... ]" : "[ MARK ALL READ ]"}
    </button>
  );
}
