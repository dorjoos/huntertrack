import { prisma } from "@/lib/db";
import { resolvePage, PAGE_SIZE } from "@/lib/pagination";
import StatsBar from "@/components/StatsBar";
import ActivityEntry from "@/components/ActivityEntry";
import Pagination from "@/components/Pagination";
import TermTitle from "@/components/TermTitle";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const [{ page: rawPage }, totalHunters, totalActivities, unreadCount] =
    await Promise.all([
      searchParams,
      prisma.hunter.count(),
      prisma.activity.count(),
      prisma.activity.count({ where: { isNew: true } }),
    ]);

  const { page, totalPages, skip } = resolvePage(rawPage, totalActivities);

  // crawledAt first so the most recently fetched reports surface on top;
  // id breaks ties within a single poll batch.
  const recentActivities = await prisma.activity.findMany({
    orderBy: [{ crawledAt: "desc" }, { id: "desc" }],
    skip,
    take: PAGE_SIZE,
    include: {
      hunter: { select: { username: true, slug: true, avatarUrl: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <TermTitle title="DASHBOARD" sub="// YESWEHACK HACKTIVITY OVERVIEW" />
        <div className="flex items-center gap-2 px-3 py-1.5 border border-term-line bg-term-panel shrink-0">
          <span className="term-blink text-term-accent2 text-[10px]">●</span>
          <span className="text-[10px] font-bold tracking-widest text-term-accent2">MONITORING</span>
        </div>
      </div>

      <StatsBar
        totalHunters={totalHunters}
        totalActivities={totalActivities}
        unreadCount={unreadCount}
      />

      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-[13px] font-bold text-term-bright tracking-widest">
            <span className="text-term-dim">──[ </span>RECENT ACTIVITY<span className="text-term-dim"> ]──</span>
          </h2>
          <span className="text-[10px] text-term-dim">{totalActivities} ENTRIES</span>
        </div>
        {recentActivities.length === 0 ? (
          <div className="term-panel p-14 text-center">
            <p className="text-[13px] text-term-mid">
              &gt; NO DATA IN BUFFER<span className="term-blink">_</span>
            </p>
            <p className="text-[11px] text-term-dim mt-2">
              ADD HUNTERS TO WATCHLIST AND RUN A POLL TO START TRACKING.
            </p>
          </div>
        ) : (
          <>
            <div className="term-panel [&>div:last-child]:border-b-0">
              {recentActivities.map((a) => (
                <ActivityEntry
                  key={a.id}
                  id={a.id}
                  date={a.date.toISOString()}
                  bugTypeName={a.bugTypeName}
                  bugTypeLink={a.bugTypeLink}
                  workflowState={a.workflowState}
                  isNew={a.isNew}
                  hunter={a.hunter}
                  showHunter
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath="/" />
          </>
        )}
      </div>
    </div>
  );
}
