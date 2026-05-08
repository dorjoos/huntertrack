import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ShieldCheck, User } from "lucide-react";
import ActivityEntry from "@/components/ActivityEntry";
import FilterBar from "@/components/FilterBar";
import MarkAllReadButton from "@/components/MarkAllReadButton";

export const dynamic = "force-dynamic";

export default async function HunterDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bugType?: string; state?: string }>;
}) {
  const { slug } = await params;
  const { bugType, state } = await searchParams;

  const hunter = await prisma.hunter.findFirst({ where: { slug } });
  if (!hunter) notFound();

  const where: Record<string, unknown> = { hunterId: hunter.id };
  if (bugType) where.bugTypeSlug = bugType;
  if (state) where.workflowState = state;

  const [activities, unreadCount, bugTypes, states] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { date: "desc" },
    }),
    prisma.activity.count({ where: { hunterId: hunter.id, isNew: true } }),
    prisma.activity.findMany({
      where: { hunterId: hunter.id },
      distinct: ["bugTypeSlug"],
      select: { bugTypeSlug: true, bugTypeName: true },
    }),
    prisma.activity.findMany({
      where: { hunterId: hunter.id },
      distinct: ["workflowState"],
      select: { workflowState: true },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        {hunter.avatarUrl ? (
          <img src={hunter.avatarUrl} alt={hunter.username} className="w-16 h-16 rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{hunter.username}</h1>
            {hunter.kycVerified && <ShieldCheck className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-sm text-gray-500">
            Tracked since {hunter.addedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <FilterBar bugTypes={bugTypes} states={states} />
        {unreadCount > 0 && <MarkAllReadButton hunterId={hunter.id} />}
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No activities recorded yet for this hunter.</p>
      ) : (
        <div className="space-y-2">
          {activities.map((a) => (
            <ActivityEntry
              key={a.id}
              id={a.id}
              date={a.date.toISOString()}
              bugTypeName={a.bugTypeName}
              bugTypeLink={a.bugTypeLink}
              workflowState={a.workflowState}
              isNew={a.isNew}
            />
          ))}
        </div>
      )}
    </div>
  );
}
