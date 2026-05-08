"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle, Zap } from "lucide-react";

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
        ? { ok: true, text: `${data.newActivities} new activities found` }
        : { ok: false, text: data.error || "Poll failed" }
    );
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePoll}
        disabled={loading}
        className="btn-gradient flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl disabled:cursor-not-allowed"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {loading ? "Scanning..." : "Poll Now"}
      </button>
      {result && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
          result.ok
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
        }`}>
          {result.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {result.text}
        </div>
      )}
    </div>
  );
}
