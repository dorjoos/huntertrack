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
      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        isNew
          ? "bg-accent/[0.04] border-accent/20 hover:bg-accent/[0.08] hover:border-accent/30"
          : "bg-surface-raised border-border-subtle hover:bg-surface-overlay hover:border-border-default"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showHunter && hunter && (
          <div className="flex items-center gap-2 shrink-0">
            {hunter.avatarUrl ? (
              <img src={hunter.avatarUrl} alt="" className="w-6 h-6 rounded-full ring-1 ring-white/10" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                {hunter.username[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-zinc-200">{hunter.username}</span>
          </div>
        )}
        <div className="w-7 h-7 rounded-lg bg-zinc-800/80 flex items-center justify-center shrink-0">
          <Bug className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        <span className="text-sm text-zinc-300 truncate">{bugTypeName}</span>
        {bugTypeLink && (
          <a
            href={bugTypeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {isNew && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 animate-pulse-glow">
            <Sparkles className="w-2.5 h-2.5" />
            NEW
          </span>
        )}
        <StatusBadge state={workflowState} />
        <time className="text-xs text-zinc-600 tabular-nums">
          {date.slice(0, 10)}
        </time>
      </div>
    </div>
  );
}
