"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={handlePoll}
        disabled={loading}
        className="term-btn px-4 py-2 text-[12px] font-bold"
      >
        {loading ? (
          <>
            [ SCANNING<span className="term-blink">█</span> ]
          </>
        ) : (
          "[ RUN POLL ]"
        )}
      </button>
      {result && (
        <span className={`text-[12px] font-medium ${result.ok ? "text-term-accent2" : "text-term-red"}`}>
          {result.ok ? `> ${result.text.toUpperCase()}` : `!! ${result.text.toUpperCase()}`}
        </span>
      )}
    </div>
  );
}
