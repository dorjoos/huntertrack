"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="YWH username..."
          className="w-52 px-3 py-2 bg-surface-raised border border-border-subtle rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        Add
      </button>
      {error && (
        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">{error}</span>
      )}
    </form>
  );
}
