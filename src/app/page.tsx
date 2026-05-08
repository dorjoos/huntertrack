import { prisma } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import ActivityEntry from "@/components/ActivityEntry";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalHunters, totalActivities, unreadCount, recentActivities] =
    await Promise.all([
      prisma.hunter.count(),
      prisma.activity.count(),
      prisma.activity.count({ where: { isNew: true } }),
      prisma.activity.findMany({
        orderBy: { date: "desc" },
        take: 30,
        include: {
          hunter: { select: { username: true, slug: true, avatarUrl: true } },
        },
      }),
    ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <StatsBar
        totalHunters={totalHunters}
        totalActivities={totalActivities}
        unreadCount={unreadCount}
      />
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No activity yet. Add hunters to your watchlist and run a poll.
          </p>
        ) : (
          <div className="space-y-2">
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
        )}
      </div>
    </div>
  );
}
