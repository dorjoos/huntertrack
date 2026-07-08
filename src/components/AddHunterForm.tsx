"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddHunterForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/hunters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim() }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add hunter");
      setLoading(false);
      return;
    }
    setUsername("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-term-dim text-sm">@</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username_"
          className="term-input w-52 pl-8 pr-3 py-2 text-[13px]"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="term-btn px-3 py-2 text-[12px] font-bold"
      >
        {loading ? "[ ... ]" : "[ ADD ]"}
      </button>
      {error && <span className="text-[11px] text-term-red">!! {error.toUpperCase()}</span>}
    </form>
  );
}
