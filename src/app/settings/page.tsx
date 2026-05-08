import { prisma } from "@/lib/db";
import PollNowButton from "@/components/PollNowButton";
import { Clock, Wifi, History, AlertCircle, CheckCircle2, Loader2, Gauge, Timer } from "lucide-react";

export const dynamic = "force-dynamic";

function PollStatusIcon({ status }: { status: string }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "error") return <AlertCircle className="w-4 h-4 text-pink-400" />;
  return <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />;
}

export default async function SettingsPage() {
  const pollLogs = await prisma.pollLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  const successCount = pollLogs.filter((l) => l.status === "success").length;
  const totalNew = pollLogs.reduce((sum, l) => sum + l.newActivities, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-600 mt-1">Polling configuration and history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-5 stat-glow-purple animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Gauge className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Polls</span>
          </div>
          <p className="text-3xl font-bold text-purple-400 tabular-nums">{pollLogs.length}</p>
        </div>
        <div className="card p-5 stat-glow-green animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Success Rate</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400 tabular-nums">
            {pollLogs.length > 0 ? Math.round((successCount / pollLogs.length) * 100) : 0}%
          </p>
        </div>
        <div className="card p-5 stat-glow-blue animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Timer className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Found</span>
          </div>
          <p className="text-3xl font-bold text-blue-400 tabular-nums">{totalNew}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/15 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Manual Poll</h2>
              <p className="text-xs text-zinc-600 mt-0.5">Scan YesWeHack hacktivity on demand</p>
            </div>
          </div>
        </div>
        <PollNowButton />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-purple-400/50" />
            <h2 className="text-sm font-semibold text-zinc-200">Poll History</h2>
          </div>
          <span className="text-[11px] text-zinc-600 font-medium">{pollLogs.length} runs</span>
        </div>
        {pollLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mx-auto mb-4 animate-float">
              <Clock className="w-6 h-6 text-purple-400/40" />
            </div>
            <p className="text-sm font-medium text-zinc-500">No polls have run yet</p>
            <p className="text-xs text-zinc-600 mt-1">Use the button above to trigger your first poll.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-600 border-b border-white/[0.03]">
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Found</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {pollLogs.map((log, i) => {
                  const duration =
                    log.finishedAt && log.startedAt
                      ? Math.round(
                          (log.finishedAt.getTime() - log.startedAt.getTime()) / 1000
                        )
                      : null;
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors animate-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-5 py-3.5 text-zinc-500 tabular-nums text-xs">
                        {log.startedAt.toISOString().slice(0, 19).replace("T", " ")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <PollStatusIcon status={log.status} />
                          <span className={`text-xs font-semibold ${
                            log.status === "success" ? "text-emerald-400" :
                            log.status === "error" ? "text-pink-400" : "text-zinc-500"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-xs">
                        {log.newActivities > 0 ? (
                          <span className="text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-md">
                            +{log.newActivities}
                          </span>
                        ) : (
                          <span className="text-zinc-700">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-600 tabular-nums text-xs">
                        {duration !== null ? `${duration}s` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-pink-400/60 text-xs truncate max-w-[200px]">
                        {log.error || <span className="text-zinc-800">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
