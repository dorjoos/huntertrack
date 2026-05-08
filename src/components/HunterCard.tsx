import Link from "next/link";
import { ShieldCheck, User, ChevronRight, Activity } from "lucide-react";
import DeleteHunterButton from "./DeleteHunterButton";

interface HunterCardProps {
  id: number;
  username: string;
  slug: string;
  avatarUrl: string | null;
  kycVerified: boolean;
  addedAt: string;
  lastSeenAt: string | null;
  activityCount: number;
  unreadCount: number;
}

export default function HunterCard({
  id, username, slug, avatarUrl, kycVerified,
  addedAt, lastSeenAt, activityCount, unreadCount,
}: HunterCardProps) {
  return (
    <div className="card card-glow group animate-fade-in">
      <Link href={`/hunters/${slug}`} className="flex items-center gap-4 p-4">
        <div className="relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-11 h-11 rounded-full ring-2 ring-white/5 group-hover:ring-accent/30 transition-all" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-white/5 group-hover:ring-accent/30 transition-all">
              <span className="text-sm font-bold text-zinc-400">{username[0]?.toUpperCase()}</span>
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface-raised animate-pulse-glow">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-100 text-[15px]">{username}</span>
            {kycVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {activityCount} activities
            </span>
            <span>&middot;</span>
            <span>Since {new Date(addedAt).toLocaleDateString()}</span>
            {lastSeenAt && (
              <>
                <span>&middot;</span>
                <span>Last seen {new Date(lastSeenAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
      <div className="absolute top-3 right-3">
        <DeleteHunterButton hunterId={id} hunterName={username} />
      </div>
    </div>
  );
}
