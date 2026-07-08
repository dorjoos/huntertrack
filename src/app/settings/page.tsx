import { prisma } from "@/lib/db";
import PollNowButton from "@/components/PollNowButton";
import TermTitle from "@/components/TermTitle";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  success: "text-term-accent2",
  error: "text-term-red",
};

export default async function SettingsPage() {
  const pollLogs = await prisma.pollLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  const successCount = pollLogs.filter((l) => l.status === "success").length;
  const totalNew = pollLogs.reduce((sum, l) => sum + l.newActivities, 0);

  const stats = [
    { label: "TOTAL_POLLS", value: String(pollLogs.length).padStart(3, "0") },
    {
      label: "SUCCESS_RATE",
      value: `${pollLogs.length > 0 ? Math.round((successCount / pollLogs.length) * 100) : 0}%`,
    },
    { label: "ACTIVITIES_FOUND", value: String(totalNew).padStart(3, "0") },
  ];

  return (
    <div className="space-y-8">
      <TermTitle title="SETTINGS" sub="// POLLING CONFIGURATION & HISTORY" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="term-panel p-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="term-label">{stat.label}</p>
            <p className="text-3xl font-bold text-term-bright term-glow tabular-nums mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="term-panel p-5">
        <h2 className="text-[13px] font-bold text-term-bright tracking-widest">&gt; MANUAL POLL</h2>
        <p className="text-[11px] text-term-dim mt-1 mb-4">SCAN YESWEHACK HACKTIVITY ON DEMAND</p>
        <PollNowButton />
      </div>

      <div className="term-panel">
        <div className="flex items-center justify-between px-4 py-3 border-b border-term-line">
          <h2 className="text-[13px] font-bold text-term-bright tracking-widest">
            <span className="text-term-dim">──[ </span>POLL HISTORY<span className="text-term-dim"> ]──</span>
          </h2>
          <span className="text-[10px] text-term-dim">{pollLogs.length} RUNS</span>
        </div>
        {pollLogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[13px] text-term-mid">
              &gt; NO POLL RECORDS<span className="term-blink">_</span>
            </p>
            <p className="text-[11px] text-term-dim mt-2">
              USE THE BUTTON ABOVE TO TRIGGER YOUR FIRST POLL.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left term-label border-b border-term-line">
                  <th className="px-4 py-2.5 font-medium">TIME</th>
                  <th className="px-4 py-2.5 font-medium">STATUS</th>
                  <th className="px-4 py-2.5 font-medium">FOUND</th>
                  <th className="px-4 py-2.5 font-medium">DURATION</th>
                  <th className="px-4 py-2.5 font-medium">ERROR</th>
                </tr>
              </thead>
              <tbody>
                {pollLogs.map((log) => {
                  const duration =
                    log.finishedAt && log.startedAt
                      ? Math.round(
                          (log.finishedAt.getTime() - log.startedAt.getTime()) / 1000
                        )
                      : null;
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-dashed border-term-line last:border-b-0 hover:bg-term-accent/5 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-term-mid tabular-nums text-[11px]">
                        {log.startedAt.toISOString().slice(0, 19).replace("T", " ")}
                      </td>
                      <td className={`px-4 py-2.5 font-bold ${statusColors[log.status] || "text-term-dim"}`}>
                        [{log.status.toUpperCase()}]
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {log.newActivities > 0 ? (
                          <span className="text-term-accent2 font-bold">+{log.newActivities}</span>
                        ) : (
                          <span className="text-term-dim">0</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-term-dim tabular-nums">
                        {duration !== null ? `${duration}s` : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-term-red/80 text-[11px] truncate max-w-[200px]">
                        {log.error || <span className="text-term-faint">—</span>}
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
