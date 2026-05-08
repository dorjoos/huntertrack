"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      title="Remove hunter"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
