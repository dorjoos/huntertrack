import { prisma } from "./db";
import { fetchHacktivityPage, filterForWatchlist } from "./crawler";

const MAX_PAGES = 10;
const DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface PollResult {
  pollLogId: number;
  newActivities: number;
  status: "success" | "error";
  error?: string;
}

export async function runPoll(): Promise<PollResult> {
  const pollLog = await prisma.pollLog.create({ data: {} });

  try {
    const hunters = await prisma.hunter.findMany();
    if (hunters.length === 0) {
      await prisma.pollLog.update({
        where: { id: pollLog.id },
        data: { finishedAt: new Date(), status: "success", newActivities: 0 },
      });
      return { pollLogId: pollLog.id, newActivities: 0, status: "success" };
    }

    const watchlist = new Set(hunters.map((h) => h.username));
    const hunterByUsername = new Map(
      hunters.map((h) => [h.username.toLowerCase(), h])
    );

    let totalNew = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const items = await fetchHacktivityPage(page);
      if (items.length === 0) break;

      const matched = filterForWatchlist(items, watchlist);

      for (const item of matched) {
        const hunter = hunterByUsername.get(
          item.report.hunter.username.toLowerCase()
        );
        if (!hunter) continue;

        try {
          await prisma.activity.create({
            data: {
              hunterId: hunter.id,
              date: new Date(item.date),
              bugTypeName: item.report.bug_type.name,
              bugTypeSlug: item.report.bug_type.slug,
              bugTypeDescription: item.report.bug_type.description || null,
              bugTypeLink: item.report.bug_type.link || null,
              workflowState: item.status.workflow_state,
            },
          });
          totalNew++;

          await prisma.hunter.update({
            where: { id: hunter.id },
            data: {
              avatarUrl: item.report.hunter.avatar?.url ?? undefined,
              kycVerified: item.report.hunter.kyc_status === "V",
              lastSeenAt: new Date(item.date),
            },
          });
        } catch {
          // unique constraint violation = duplicate, skip
        }
      }

      if (page < MAX_PAGES) await sleep(DELAY_MS);
    }

    await prisma.pollLog.update({
      where: { id: pollLog.id },
      data: {
        finishedAt: new Date(),
        status: "success",
        newActivities: totalNew,
      },
    });

    return { pollLogId: pollLog.id, newActivities: totalNew, status: "success" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await prisma.pollLog.update({
      where: { id: pollLog.id },
      data: { finishedAt: new Date(), status: "error", error: message },
    });
    return {
      pollLogId: pollLog.id,
      newActivities: 0,
      status: "error",
      error: message,
    };
  }
}
