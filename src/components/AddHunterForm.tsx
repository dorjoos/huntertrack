"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, Search } from "lucide-react";

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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          className="w-56 pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="btn-gradient flex items-center gap-1.5 px-4 py-2.5 text-white text-sm font-semibold rounded-xl disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        Add
      </button>
      {error && (
        <span className="text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-xl">{error}</span>
      )}
    </form>
  );
}
