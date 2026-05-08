import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ShieldCheck, ArrowLeft, Inbox, Activity, Calendar, Eye, Star, Trophy, Globe, ExternalLink, AtSign } from "lucide-react";
import Link from "next/link";
import ActivityEntry from "@/components/ActivityEntry";
import FilterBar from "@/components/FilterBar";
import MarkAllReadButton from "@/components/MarkAllReadButton";

export const dynamic = "force-dynamic";

function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default async function HunterDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bugType?: string; state?: string }>;
}) {
  const { slug } = await params;
  const { bugType, state } = await searchParams;

  const hunter = await prisma.hunter.findFirst({ where: { slug } });
  if (!hunter) notFound();

  const where: Record<string, unknown> = { hunterId: hunter.id };
  if (bugType) where.bugTypeSlug = bugType;
  if (state) where.workflowState = state;

  const [activities, unreadCount, totalCount, bugTypes, states] = await Promise.all([
    prisma.activity.findMany({ where, orderBy: { date: "desc" } }),
    prisma.activity.count({ where: { hunterId: hunter.id, isNew: true } }),
    prisma.activity.count({ where: { hunterId: hunter.id } }),
    prisma.activity.findMany({
      where: { hunterId: hunter.id },
      distinct: ["bugTypeSlug"],
      select: { bugTypeSlug: true, bugTypeName: true },
    }),
    prisma.activity.findMany({
      where: { hunterId: hunter.id },
      distinct: ["workflowState"],
      select: { workflowState: true },
    }),
  ]);

  const fullName = [hunter.firstName, hunter.lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-8">
      <Link
        href="/hunters"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Hunters
      </Link>

      <div className="card p-6">
        <div className="flex items-start gap-6">
          {hunter.avatarUrl ? (
            <img
              src={hunter.avatarUrl}
              alt={hunter.username}
              className="w-20 h-20 rounded-3xl ring-2 ring-purple-500/20 shadow-xl shadow-purple-500/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center ring-2 ring-purple-500/20">
              <span className="text-2xl font-bold gradient-text">{hunter.username[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{hunter.username}</h1>
              {hunter.nationality && (
                <span className="text-lg" title={hunter.nationality}>{flagEmoji(hunter.nationality)}</span>
              )}
              {hunter.kycVerified && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KYC Verified
                </span>
              )}
            </div>
            {fullName && (
              <p className="text-sm text-zinc-400 mb-3">{fullName}</p>
            )}

            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-4 text-[13px]">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/10">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-semibold">{hunter.points}</span>
                  <span className="text-amber-400/50">pts</span>
                </span>
                {hunter.rank && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/10">
                    <Trophy className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">#{hunter.rank.toLocaleString()}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/10">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">{hunter.nbReports}</span>
                  <span className="text-blue-400/50">reports</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {hunter.github && (
                <a
                  href={`https://github.com/${hunter.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] text-zinc-500 hover:text-purple-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {hunter.github}
                </a>
              )}
              {hunter.twitter && (
                <a
                  href={`https://x.com/${hunter.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] text-zinc-500 hover:text-blue-400 transition-colors"
                >
                  <AtSign className="w-3 h-3" />
                  {hunter.twitter}
                </a>
              )}
              {hunter.website && (
                <a
                  href={`https://${hunter.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {hunter.website}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Tracked since {hunter.addedAt.toISOString().slice(0, 10)}
              </span>
              {unreadCount > 0 && (
                <span className="flex items-center gap-1 text-pink-400">
                  <Eye className="w-3.5 h-3.5" />
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <FilterBar bugTypes={bugTypes} states={states} />
        {unreadCount > 0 && <MarkAllReadButton hunterId={hunter.id} />}
      </div>

      {activities.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-5 animate-float">
            <Inbox className="w-8 h-8 text-purple-400/50" />
          </div>
          <p className="text-base font-medium text-zinc-400">No activities found</p>
          <p className="text-sm text-zinc-600 mt-2">
            {bugType || state ? "Try adjusting the filters." : "Activities will appear after the next poll."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((a, i) => (
            <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${i * 25}ms` }}>
              <ActivityEntry
                id={a.id}
                date={a.date.toISOString()}
                bugTypeName={a.bugTypeName}
                bugTypeLink={a.bugTypeLink}
                workflowState={a.workflowState}
                isNew={a.isNew}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
