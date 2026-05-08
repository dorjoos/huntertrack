"use client";

import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { Bug, ExternalLink } from "lucide-react";

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
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        isNew
          ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showHunter && hunter && (
          <span className="text-sm font-medium text-gray-900 shrink-0">
            {hunter.username}
          </span>
        )}
        <Bug className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="text-sm text-gray-700 truncate">{bugTypeName}</span>
        {bugTypeLink && (
          <a
            href={bugTypeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-gray-600"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isNew && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
            NEW
          </span>
        )}
        <StatusBadge state={workflowState} />
        <span className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
