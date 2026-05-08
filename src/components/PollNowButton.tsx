"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function PollNowButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  async function handlePoll() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/poll", { method: "POST" });
    const data = await res.json();
    setResult(
      data.status === "success"
        ? `Found ${data.newActivities} new activities`
        : `Error: ${data.error}`
    );
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePoll}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Polling..." : "Poll Now"}
      </button>
      {result && <span className="text-sm text-gray-600">{result}</span>}
    </div>
  );
}
