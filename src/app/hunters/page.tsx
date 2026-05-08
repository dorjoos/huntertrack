import { prisma } from "@/lib/db";
import HunterCard from "@/components/HunterCard";
import AddHunterForm from "@/components/AddHunterForm";
import { UserSearch, Target } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight">Hunters</h1>
          <p className="text-sm text-zinc-600 mt-1">
            {hunters.length > 0
              ? `Tracking ${hunters.length} hunter${hunters.length === 1 ? "" : "s"}`
              : "Manage your watchlist"}
          </p>
        </div>
        <AddHunterForm />
      </div>

      {hunters.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-5 animate-float">
            <UserSearch className="w-8 h-8 text-purple-400/50" />
          </div>
          <p className="text-base font-medium text-zinc-400">No hunters tracked yet</p>
          <p className="text-sm text-zinc-600 mt-2 max-w-xs">Add a YesWeHack username above to start monitoring their hacktivity.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hunters.map((h, i) => (
            <div key={h.id} style={{ animationDelay: `${i * 60}ms` }}>
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
