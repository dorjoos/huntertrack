import Link from "next/link";
import { ShieldCheck, User } from "lucide-react";
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
    <div className="relative flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <Link href={`/hunters/${slug}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">{username}</span>
            {kycVerified && <ShieldCheck className="w-4 h-4 text-green-500" />}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {activityCount} activities &middot; tracked since{" "}
            {new Date(addedAt).toLocaleDateString()}
          </div>
          {lastSeenAt && (
            <div className="text-xs text-gray-400">
              Last seen: {new Date(lastSeenAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </Link>
      <DeleteHunterButton hunterId={id} hunterName={username} />
    </div>
  );
}
