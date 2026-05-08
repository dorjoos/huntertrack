import Link from "next/link";
import { ShieldCheck, ChevronRight, Activity, Clock, Zap } from "lucide-react";
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
    <div className="card card-glow group animate-fade-up relative">
      <Link href={`/hunters/${slug}`} className="flex items-center gap-5 p-5">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-12 h-12 rounded-2xl ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
              <span className="text-lg font-bold gradient-text">{username[0]?.toUpperCase()}</span>
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#06060a] shadow-lg shadow-pink-500/30">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-zinc-100 text-[15px] group-hover:text-white transition-colors">{username}</span>
            {kycVerified && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                KYC
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[12px] text-zinc-600">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-500/50" />
              <span className="text-zinc-400">{activityCount}</span> reports
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500/50" />
              Since {new Date(addedAt).toISOString().slice(0, 10)}
            </span>
            {lastSeenAt && (
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-500/50" />
                Last {new Date(lastSeenAt).toISOString().slice(0, 10)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/[0.03] flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-10">
        <DeleteHunterButton hunterId={id} hunterName={username} />
      </div>
    </div>
  );
}
