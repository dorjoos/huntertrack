import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
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
    <div className="space-y-6">
      <Link
        href="/hunters"
        className="inline-block text-[11px] font-bold tracking-widest text-term-dim hover:text-term-accent2 transition-colors"
      >
        &lt;&lt; BACK TO HUNTERS
      </Link>

      <div className="term-panel p-5 md:p-6">
        <div className="flex items-start gap-5">
          {hunter.avatarUrl ? (
            <img
              src={hunter.avatarUrl}
              alt={hunter.username}
              className="w-20 h-20 border border-term-border object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 border border-term-border bg-term-raised flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-term-accent2">{hunter.username[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-term-bright term-glow">@{hunter.username}</h1>
              {hunter.nationality && (
                <span className="text-lg" title={hunter.nationality}>{flagEmoji(hunter.nationality)}</span>
              )}
              {hunter.kycVerified && (
                <span className="text-[11px] font-bold text-term-accent2">[KYC✓ VERIFIED]</span>
              )}
            </div>
            {fullName && <p className="text-[12px] text-term-mid mb-3">{fullName}</p>}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] tabular-nums mb-3 text-term-dim">
              <span>PTS:<span className="text-term-amber font-bold">{hunter.points}</span></span>
              {hunter.rank && (
                <span>RANK:<span className="text-term-text font-bold">#{hunter.rank.toLocaleString()}</span></span>
              )}
              <span>REPORTS:<span className="text-term-text font-bold">{hunter.nbReports}</span></span>
              <span>LOGGED:<span className="text-term-text font-bold">{totalCount}</span></span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-term-dim">
              {hunter.github && (
                <a
                  href={`https://github.com/${hunter.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-term-accent2 transition-colors"
                >
                  [GH:{hunter.github}]
                </a>
              )}
              {hunter.twitter && (
                <a
                  href={`https://x.com/${hunter.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-term-accent2 transition-colors"
                >
                  [X:{hunter.twitter}]
                </a>
              )}
              {hunter.website && (
                <a
                  href={`https://${hunter.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-term-accent2 transition-colors"
                >
                  [WWW:{hunter.website}]
                </a>
              )}
              <span>SINCE:{hunter.addedAt.toISOString().slice(0, 10)}</span>
              {unreadCount > 0 && (
                <span className="text-term-amber term-glow-amber font-bold">!! {unreadCount} UNREAD</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar bugTypes={bugTypes} states={states} />
        {unreadCount > 0 && <MarkAllReadButton hunterId={hunter.id} />}
      </div>

      {activities.length === 0 ? (
        <div className="term-panel p-14 text-center">
          <p className="text-[13px] text-term-mid">
            &gt; NO RECORDS MATCH QUERY<span className="term-blink">_</span>
          </p>
          <p className="text-[11px] text-term-dim mt-2">
            {bugType || state
              ? "TRY ADJUSTING THE FILTERS."
              : "ACTIVITIES WILL APPEAR AFTER THE NEXT POLL."}
          </p>
        </div>
      ) : (
        <div className="term-panel [&>div:last-child]:border-b-0">
          {activities.map((a) => (
            <ActivityEntry
              key={a.id}
              id={a.id}
              date={a.date.toISOString()}
              bugTypeName={a.bugTypeName}
              bugTypeLink={a.bugTypeLink}
              workflowState={a.workflowState}
              isNew={a.isNew}
            />
          ))}
        </div>
      )}
    </div>
  );
}
