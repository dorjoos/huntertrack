interface StatsBarProps {
  totalHunters: number;
  totalActivities: number;
  unreadCount: number;
}

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default function StatsBar({ totalHunters, totalActivities, unreadCount }: StatsBarProps) {
  const stats = [
    { label: "HUNTERS_TRACKED", value: pad(totalHunters), note: "WATCHLIST SIZE", alert: false },
    { label: "TOTAL_REPORTS", value: pad(totalActivities), note: "ALL TIME", alert: false },
    {
      label: "UNREAD_ALERTS",
      value: pad(unreadCount),
      note: unreadCount > 0 ? "!! ATTENTION REQUIRED" : "ALL CLEAR",
      alert: unreadCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`p-4 border animate-fade-up ${
            stat.alert ? "bg-[#0d0a03] border-term-amber-dim" : "bg-term-panel border-term-line"
          }`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <p className={`term-label ${stat.alert ? "text-term-amber-mid" : ""}`}>{stat.label}</p>
          <p
            className={`text-3xl font-bold tabular-nums mt-1 ${
              stat.alert ? "text-term-amber term-glow-amber" : "text-term-bright term-glow"
            }`}
          >
            {stat.value}
          </p>
          <p className={`text-[10px] mt-1 ${stat.alert ? "text-term-amber-mid" : "text-term-dim"}`}>
            {stat.note}
          </p>
        </div>
      ))}
    </div>
  );
}
