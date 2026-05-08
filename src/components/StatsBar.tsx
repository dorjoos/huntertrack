import { Users, Activity, Bell, TrendingUp } from "lucide-react";

interface StatsBarProps {
  totalHunters: number;
  totalActivities: number;
  unreadCount: number;
}

export default function StatsBar({ totalHunters, totalActivities, unreadCount }: StatsBarProps) {
  const stats = [
    {
      label: "Hunters",
      value: totalHunters,
      icon: Users,
      gradient: "from-blue-400 to-cyan-400",
      glow: "stat-glow-blue",
      iconBg: "from-blue-500/20 to-cyan-500/20",
      valueColor: "text-blue-400",
      change: "+2 this week",
      changeColor: "text-blue-400/60",
    },
    {
      label: "Activities",
      value: totalActivities,
      icon: Activity,
      gradient: "from-purple-400 to-pink-400",
      glow: "stat-glow-purple",
      iconBg: "from-purple-500/20 to-pink-500/20",
      valueColor: "text-purple-400",
      change: "All time",
      changeColor: "text-purple-400/60",
    },
    {
      label: "Unread",
      value: unreadCount,
      icon: Bell,
      gradient: "from-pink-400 to-orange-400",
      glow: "stat-glow-pink",
      iconBg: "from-pink-500/20 to-orange-500/20",
      valueColor: "text-pink-400",
      change: unreadCount > 0 ? "Needs attention" : "All caught up",
      changeColor: unreadCount > 0 ? "text-pink-400/60" : "text-green-400/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`card p-6 ${stat.glow} animate-fade-up`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.valueColor}`} />
            </div>
            <TrendingUp className="w-4 h-4 text-zinc-700" />
          </div>
          <p className={`text-4xl font-bold ${stat.valueColor} tabular-nums tracking-tight`}>{stat.value}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-[11px] ${stat.changeColor}`}>{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
