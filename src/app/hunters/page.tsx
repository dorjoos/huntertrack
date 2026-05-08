import { prisma } from "@/lib/db";
import HunterCard from "@/components/HunterCard";
import AddHunterForm from "@/components/AddHunterForm";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hunters</h1>
        <AddHunterForm />
      </div>
      {hunters.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No hunters tracked yet. Add a YesWeHack username above.
        </p>
      ) : (
        <div className="space-y-3">
          {hunters.map((h) => (
            <HunterCard
              key={h.id}
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
          ))}
        </div>
      )}
    </div>
  );
}
