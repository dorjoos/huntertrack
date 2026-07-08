import Link from "next/link";
import DeleteHunterButton from "./DeleteHunterButton";

interface HunterCardProps {
  id: number;
  username: string;
  slug: string;
  avatarUrl: string | null;
  kycVerified: boolean;
  points: number;
  rank: number | null;
  nbReports: number;
  nationality: string | null;
  addedAt: string;
  lastSeenAt: string | null;
  activityCount: number;
  unreadCount: number;
}

function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default function HunterCard({
  id, username, slug, avatarUrl, kycVerified,
  points, rank, nbReports, nationality,
  activityCount, unreadCount,
}: HunterCardProps) {
  return (
    <div className="term-panel hover:border-term-border group relative animate-fade-up">
      <Link href={`/hunters/${slug}`} className="flex items-center gap-4 p-4">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-12 h-12 border border-term-line object-cover" />
          ) : (
            <div className="w-12 h-12 border border-term-line bg-term-raised flex items-center justify-center">
              <span className="text-lg font-bold text-term-accent2">{username[0]?.toUpperCase()}</span>
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-term-amber text-term-bg text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-term-bright text-[14px]">@{username}</span>
            {nationality && <span className="text-sm" title={nationality}>{flagEmoji(nationality)}</span>}
            {kycVerified && <span className="text-[10px] font-bold text-term-accent2">[KYC✓]</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-term-dim tabular-nums">
            <span>PTS:<span className="text-term-amber">{points}</span></span>
            {rank && <span>RANK:<span className="text-term-text">#{rank.toLocaleString()}</span></span>}
            <span>REPORTS:<span className="text-term-text">{nbReports}</span></span>
            <span>TRACKED:<span className="text-term-text">{activityCount}</span></span>
          </div>
        </div>

        <span className="text-term-dim group-hover:text-term-accent2 text-sm font-bold transition-colors shrink-0">
          {">>"}
        </span>
      </Link>
      <div className="absolute top-2 right-2 z-10">
        <DeleteHunterButton hunterId={id} hunterName={username} />
      </div>
    </div>
  );
}
