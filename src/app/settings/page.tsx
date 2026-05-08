import { prisma } from "@/lib/db";
import PollNowButton from "@/components/PollNowButton";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const pollLogs = await prisma.pollLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
        <h2 className="text-lg font-semibold">Polling</h2>
        <p className="text-sm text-gray-500">
          Auto-polling runs every 30 minutes via the background server. Use the
          button below for an on-demand poll.
        </p>
        <PollNowButton />
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Poll History</h2>
        {pollLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No polls have run yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Time</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">New Activities</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Error</th>
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
                  <tr key={log.id} className="border-b border-gray-100">
                    <td className="py-2">
                      {log.startedAt.toLocaleString()}
                    </td>
                    <td className="py-2">
                      <StatusBadge
                        state={
                          log.status === "success"
                            ? "resolved"
                            : log.status === "error"
                            ? "new"
                            : "accepted"
                        }
                      />
                    </td>
                    <td className="py-2">{log.newActivities}</td>
                    <td className="py-2">
                      {duration !== null ? `${duration}s` : "—"}
                    </td>
                    <td className="py-2 text-red-500 text-xs truncate max-w-[200px]">
                      {log.error || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
