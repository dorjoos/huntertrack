"use client";

import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { Bug, ExternalLink, Sparkles } from "lucide-react";

interface ActivityEntryProps {
  id: number;
  date: string;
  bugTypeName: string;
  bugTypeLink: string | null;
  workflowState: string;
  isNew: boolean;
  hunter?: { username: string; slug: string; avatarUrl: string | null };
  showHunter?: boolean;
}

export default function ActivityEntry({
  id,
  date,
  bugTypeName,
  bugTypeLink,
  workflowState,
  isNew,
  hunter,
  showHunter = false,
}: ActivityEntryProps) {
  const router = useRouter();

  async function markAsRead() {
    if (!isNew) return;
    await fetch("/api/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    router.refresh();
  }

  return (
    <div
      onClick={markAsRead}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isNew
          ? "bg-gradient-to-r from-purple-500/[0.06] via-blue-500/[0.04] to-transparent border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
          : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]"
      }`}
    >
      {isNew && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
      <div className="flex items-center gap-3.5 min-w-0 relative">
        {showHunter && hunter && (
          <div className="flex items-center gap-2.5 shrink-0 pr-3 border-r border-white/[0.06]">
            {hunter.avatarUrl ? (
              <img src={hunter.avatarUrl} alt="" className="w-7 h-7 rounded-full ring-2 ring-purple-500/20" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300">
                {hunter.username[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-zinc-300">{hunter.username}</span>
          </div>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center shrink-0">
          <Bug className="w-4 h-4 text-purple-400" />
        </div>
        <span className="text-sm text-zinc-300 truncate font-medium">{bugTypeName}</span>
        {bugTypeLink && (
          <a
            href={bugTypeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-zinc-700 hover:text-purple-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0 relative">
        {isNew && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/20">
            <Sparkles className="w-3 h-3" />
            NEW
          </span>
        )}
        <StatusBadge state={workflowState} />
        <time className="text-[11px] text-zinc-600 tabular-nums font-medium">{date.slice(0, 10)}</time>
      </div>
    </div>
  );
}
