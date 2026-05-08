import { prisma } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import ActivityEntry from "@/components/ActivityEntry";
import { Inbox, Radar } from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Monitor your YesWeHack hacktivity feed</p>
      </div>

      <StatsBar
        totalHunters={totalHunters}
        totalActivities={totalActivities}
        unreadCount={unreadCount}
      />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Radar className="w-4 h-4 text-accent" />
          <h2 className="text-base font-semibold text-zinc-200">Recent Activity</h2>
        </div>
        {recentActivities.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-400">No activity yet</p>
            <p className="text-xs text-zinc-600 mt-1">Add hunters to your watchlist and run a poll to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((a, i) => (
              <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                <ActivityEntry
                  id={a.id}
                  date={a.date.toISOString()}
                  bugTypeName={a.bugTypeName}
                  bugTypeLink={a.bugTypeLink}
                  workflowState={a.workflowState}
                  isNew={a.isNew}
                  hunter={a.hunter}
                  showHunter
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
