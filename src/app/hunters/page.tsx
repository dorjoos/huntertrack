import { prisma } from "@/lib/db";
import HunterCard from "@/components/HunterCard";
import AddHunterForm from "@/components/AddHunterForm";
import TermTitle from "@/components/TermTitle";

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <TermTitle
          title="HUNTERS"
          sub={
            hunters.length > 0
              ? `// TRACKING ${hunters.length} HUNTER${hunters.length === 1 ? "" : "S"}`
              : "// MANAGE YOUR WATCHLIST"
          }
        />
        <AddHunterForm />
      </div>

      {hunters.length === 0 ? (
        <div className="term-panel p-14 text-center">
          <p className="text-[13px] text-term-mid">
            &gt; NO HUNTERS IN WATCHLIST<span className="term-blink">_</span>
          </p>
          <p className="text-[11px] text-term-dim mt-2">
            ADD A YESWEHACK USERNAME ABOVE TO START MONITORING THEIR HACKTIVITY.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {hunters.map((h) => (
            <HunterCard
              key={h.id}
              id={h.id}
              username={h.username}
              slug={h.slug}
              avatarUrl={h.avatarUrl}
              kycVerified={h.kycVerified}
              points={h.points}
              rank={h.rank}
              nbReports={h.nbReports}
              nationality={h.nationality}
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
