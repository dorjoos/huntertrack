import { prisma } from "@/lib/db";
import HunterCard from "@/components/HunterCard";
import AddHunterForm from "@/components/AddHunterForm";
import { UserSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HuntersPage() {
  const hunters = await prisma.hunter.findMany({
    orderBy: { addedAt: "desc" },
    include: {
      _count: { select: { activities: true } },
      activities: {
        where: { isNew: true },
        select: { id: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Hunters</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your watchlist of bug bounty hunters</p>
        </div>
        <AddHunterForm />
      </div>
      {hunters.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
            <UserSearch className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-400">No hunters tracked yet</p>
          <p className="text-xs text-zinc-600 mt-1">Add a YesWeHack username above to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hunters.map((h, i) => (
            <div key={h.id} style={{ animationDelay: `${i * 50}ms` }}>
              <HunterCard
                id={h.id}
                username={h.username}
                slug={h.slug}
                avatarUrl={h.avatarUrl}
                kycVerified={h.kycVerified}
                addedAt={h.addedAt.toISOString()}
                lastSeenAt={h.lastSeenAt?.toISOString() ?? null}
                activityCount={h._count.activities}
                unreadCount={h.activities.length}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
