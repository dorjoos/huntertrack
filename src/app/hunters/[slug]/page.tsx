import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ShieldCheck, ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import ActivityEntry from "@/components/ActivityEntry";
import FilterBar from "@/components/FilterBar";
import MarkAllReadButton from "@/components/MarkAllReadButton";

export const dynamic = "force-dynamic";

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

  const [activities, unreadCount, bugTypes, states] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { date: "desc" },
    }),
    prisma.activity.count({ where: { hunterId: hunter.id, isNew: true } }),
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href="/hunters"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Hunters
      </Link>

      <div className="card p-6">
        <div className="flex items-center gap-5">
          {hunter.avatarUrl ? (
            <img src={hunter.avatarUrl} alt={hunter.username} className="w-16 h-16 rounded-2xl ring-2 ring-white/5" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center ring-2 ring-white/5">
              <span className="text-xl font-bold text-zinc-500">{hunter.username[0]?.toUpperCase()}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-100">{hunter.username}</h1>
              {hunter.kycVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KYC Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
              <span>Tracked since {hunter.addedAt.toLocaleDateString()}</span>
              <span>&middot;</span>
              <span>{activities.length} activities</span>
              {unreadCount > 0 && (
                <>
                  <span>&middot;</span>
                  <span className="text-amber-400">{unreadCount} unread</span>
                </>
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
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-400">No activities found</p>
          <p className="text-xs text-zinc-600 mt-1">
            {bugType || state ? "Try adjusting the filters." : "Activities will appear after the next poll."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((a, i) => (
            <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
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
