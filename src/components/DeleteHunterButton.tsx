"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteHunterButton({
  hunterId,
  hunterName,
}: {
  hunterId: number;
  hunterName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Remove "${hunterName}" and all their tracked activities?`)) return;
    setLoading(true);
    await fetch(`/api/hunters?id=${hunterId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
      disabled={loading}
      className="text-[11px] font-bold text-term-dim hover:text-term-red transition-colors opacity-0 group-hover:opacity-100"
      title="Remove hunter"
    >
      {loading ? "[..]" : "[x]"}
    </button>
  );
}
