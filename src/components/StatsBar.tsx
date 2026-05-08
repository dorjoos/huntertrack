import { Users, Activity, Bell } from "lucide-react";

interface StatsBarProps {
  totalHunters: number;
  totalActivities: number;
  unreadCount: number;
}

export default function StatsBar({ totalHunters, totalActivities, unreadCount }: StatsBarProps) {
  const stats = [
    { label: "Tracked Hunters", value: totalHunters, icon: Users, color: "text-blue-600" },
    { label: "Total Activities", value: totalActivities, icon: Activity, color: "text-green-600" },
    { label: "Unread", value: unreadCount, icon: Bell, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-sm text-gray-500">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
