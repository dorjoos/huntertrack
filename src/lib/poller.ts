import { prisma } from "./db";
import { fetchHacktivity, fetchHunterProfile, filterForWatchlist } from "./crawler";

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

    for (const h of hunters) {
      const profile = await fetchHunterProfile(h.username);
      if (profile) {
        await prisma.hunter.update({
          where: { id: h.id },
          data: {
            avatarUrl: profile.avatar?.url ?? h.avatarUrl,
            kycVerified: profile.kyc_status === "V",
            points: profile.points ?? h.points,
            rank: profile.rank,
            nbReports: profile.nb_reports ?? h.nbReports,
            nationality: profile.nationality ?? h.nationality,
            firstName: profile.public_firstname ?? h.firstName,
            lastName: profile.public_lastname ?? h.lastName,
            website: profile.hunter_profile?.website ?? h.website,
            github: profile.hunter_profile?.github ?? h.github,
            twitter: profile.hunter_profile?.twitter ?? h.twitter,
          },
        });
      }
      await sleep(DELAY_MS);
    }

    const items = await fetchHacktivity();
    if (items === null) {
      throw new Error("YesWeHack hacktivity API request failed");
    }

    const watchlist = new Set(hunters.map((h) => h.username));
    const hunterByUsername = new Map(
      hunters.map((h) => [h.username.toLowerCase(), h])
    );

    let totalNew = 0;

    const matched = filterForWatchlist(items, watchlist);

    for (const item of matched) {
      const hunter = hunterByUsername.get(item.hunter.username.toLowerCase());
      if (!hunter) continue;

      try {
        await prisma.activity.create({
          data: {
            hunterId: hunter.id,
            date: new Date(item.date),
            bugTypeName: item.bug_type.name,
            bugTypeSlug: item.bug_type.slug,
            bugTypeDescription: item.bug_type.description || null,
            bugTypeLink: item.bug_type.link || null,
            workflowState: item.status,
          },
        });
        totalNew++;

        await prisma.hunter.update({
          where: { id: hunter.id },
          data: {
            avatarUrl: item.hunter.avatar?.url ?? undefined,
            kycVerified: item.hunter.kyc_status === "V",
            lastSeenAt: new Date(item.date),
          },
        });
      } catch {
        // unique constraint violation = duplicate, skip
      }
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
