import { Users, Activity, Bell } from "lucide-react";

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
      glow: "stat-glow-blue",
      iconBg: "from-blue-500/20 to-cyan-500/20",
      valueColor: "text-blue-400",
    },
    {
      label: "Activities",
      value: totalActivities,
      icon: Activity,
      glow: "stat-glow-purple",
      iconBg: "from-purple-500/20 to-pink-500/20",
      valueColor: "text-purple-400",
    },
    {
      label: "Unread",
      value: unreadCount,
      icon: Bell,
      glow: "stat-glow-pink",
      iconBg: "from-pink-500/20 to-orange-500/20",
      valueColor: "text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`card p-5 md:p-6 ${stat.glow} animate-fade-up`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.valueColor}`} />
            </div>
          </div>
          <p className={`text-3xl md:text-4xl font-bold ${stat.valueColor} tabular-nums tracking-tight`}>{stat.value}</p>
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
