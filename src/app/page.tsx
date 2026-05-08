import { prisma } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import ActivityEntry from "@/components/ActivityEntry";
import { Inbox, Radio, Sparkles } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-600 mt-1">YesWeHack hacktivity overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <Radio className="w-3 h-3 text-green-400" />
          <span className="text-[11px] font-medium text-green-400">Monitoring</span>
        </div>
      </div>

      <StatsBar
        totalHunters={totalHunters}
        totalActivities={totalActivities}
        unreadCount={unreadCount}
      />

      <div>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-lg font-semibold text-zinc-200">Recent Activity</h2>
          <span className="text-xs text-zinc-600 ml-1">Last 30 entries</span>
        </div>
        {recentActivities.length === 0 ? (
          <div className="card p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-5 animate-float">
              <Inbox className="w-8 h-8 text-purple-400/50" />
            </div>
            <p className="text-base font-medium text-zinc-400">No activity yet</p>
            <p className="text-sm text-zinc-600 mt-2 max-w-xs">Add hunters to your watchlist and run a poll to start tracking hacktivity.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((a, i) => (
              <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${i * 25}ms` }}>
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
