"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export default function PollNowButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  async function handlePoll() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/poll", { method: "POST" });
    const data = await res.json();
    setResult(
      data.status === "success"
        ? { ok: true, text: `Found ${data.newActivities} new activities` }
        : { ok: false, text: data.error || "Poll failed" }
    );
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePoll}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Polling..." : "Poll Now"}
      </button>
      {result && (
        <span className={`flex items-center gap-1.5 text-sm ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
          {result.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {result.text}
        </span>
      )}
    </div>
  );
}
