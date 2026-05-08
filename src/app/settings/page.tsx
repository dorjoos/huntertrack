import { prisma } from "@/lib/db";
import PollNowButton from "@/components/PollNowButton";
import { Clock, Wifi, History, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function PollStatusIcon({ status }: { status: string }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "error") return <AlertCircle className="w-4 h-4 text-red-400" />;
  return <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />;
}

export default async function SettingsPage() {
  const pollLogs = await prisma.pollLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure polling and view run history</p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Polling Configuration</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Auto-polling runs every 30 minutes via the background server.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-2 border-t border-border-subtle">
          <PollNowButton />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-border-subtle">
          <History className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">Poll History</h2>
          <span className="ml-auto text-xs text-zinc-600">{pollLogs.length} entries</span>
        </div>
        {pollLogs.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">No polls have run yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-600">
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">New</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {pollLogs.map((log) => {
                  const duration =
                    log.finishedAt && log.startedAt
                      ? Math.round(
                          (log.finishedAt.getTime() - log.startedAt.getTime()) / 1000
                        )
                      : null;
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-zinc-400 tabular-nums text-xs">
                        {log.startedAt.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <PollStatusIcon status={log.status} />
                          <span className={`text-xs font-medium ${
                            log.status === "success" ? "text-emerald-400" :
                            log.status === "error" ? "text-red-400" : "text-zinc-500"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-zinc-300 tabular-nums text-xs">
                        {log.newActivities > 0 ? (
                          <span className="text-accent font-medium">+{log.newActivities}</span>
                        ) : (
                          <span className="text-zinc-600">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-zinc-500 tabular-nums text-xs">
                        {duration !== null ? `${duration}s` : "—"}
                      </td>
                      <td className="px-5 py-3 text-red-400/70 text-xs truncate max-w-[200px]">
                        {log.error || "—"}
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
