import { Users, Activity, Bell, TrendingUp } from "lucide-react";

interface StatsBarProps {
  totalHunters: number;
  totalActivities: number;
  unreadCount: number;
}

export default function StatsBar({ totalHunters, totalActivities, unreadCount }: StatsBarProps) {
  const stats = [
    {
      label: "Tracked Hunters",
      value: totalHunters,
      icon: Users,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      label: "Total Activities",
      value: totalActivities,
      icon: Activity,
      gradient: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      label: "Unread",
      value: unreadCount,
      icon: Bell,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`card p-5 animate-fade-in ${stat.border}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-zinc-100 mt-1.5 tabular-nums">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
