"use client";

import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";

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

function formatType(name: string) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
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
      className={`flex items-center justify-between gap-3 px-3 py-2.5 border-b border-dashed border-term-line cursor-pointer transition-colors hover:bg-term-accent/5 ${
        isNew ? "bg-term-amber/[0.03] shadow-[inset_2px_0_0_#fde047]" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 text-[13px]">
        <time className="text-term-dim tabular-nums shrink-0 text-[11px]">
          [{date.slice(5, 10)} {date.slice(11, 16)}]
        </time>
        <span className="text-term-text truncate font-medium">{formatType(bugTypeName)}</span>
        {showHunter && hunter && (
          <span className="flex items-center gap-1.5 shrink-0">
            {hunter.avatarUrl ? (
              <img
                src={hunter.avatarUrl}
                alt=""
                className="w-5 h-5 border border-term-line object-cover"
              />
            ) : (
              <span className="w-5 h-5 border border-term-line bg-term-raised flex items-center justify-center text-[9px] font-bold text-term-accent2">
                {hunter.username[0]?.toUpperCase()}
              </span>
            )}
            <span className="text-term-accent2 text-[12px]">@{hunter.username}</span>
          </span>
        )}
        {bugTypeLink && (
          <a
            href={bugTypeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-term-dim hover:text-term-accent2 shrink-0 text-[11px] transition-colors"
          >
            [↗]
          </a>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isNew && (
          <span className="text-[10px] font-bold text-term-amber term-glow-amber">
            <span className="term-blink">●</span>UNREAD
          </span>
        )}
        <StatusBadge state={workflowState} />
      </div>
    </div>
  );
}
