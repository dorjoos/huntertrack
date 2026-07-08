import { describe, it, expect, vi, beforeEach } from "vitest";
import type { YwhHacktivityItem, YwhHunterProfile } from "@/lib/types";

vi.mock("@/lib/db", () => ({
  prisma: {
    hunter: { findMany: vi.fn(), update: vi.fn() },
    activity: { create: vi.fn() },
    pollLog: { create: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/crawler", () => ({
  fetchHacktivity: vi.fn(),
  fetchHunterProfile: vi.fn(),
  filterForWatchlist: vi.fn(),
}));

import { runPoll } from "@/lib/poller";
import { prisma } from "@/lib/db";
import { fetchHacktivity, fetchHunterProfile, filterForWatchlist } from "@/lib/crawler";

type MockResult = never;

const mockProfile: YwhHunterProfile = {
  username: "alice",
  slug: "alice",
  public_firstname: null,
  public_lastname: null,
  hunter_profile: { public: true, website: null, website_url: null, github: null, twitter: null, skills: [], supported_languages: [] },
  points: 50,
  nb_reports: 3,
  rank: 1000,
  impact: null,
  kyc_status: "V",
  avatar: null,
  nationality: null,
  joined_on: "2026",
};

const mockItem: YwhHacktivityItem = {
  date: "2026-07-08",
  status: "accepted",
  bug_type: {
    name: "XSS",
    slug: "xss",
    description: "Cross-site scripting",
    link: "https://cwe.mitre.org",
    remediation_link: null,
  },
  hunter: { username: "alice", slug: "alice", kyc_status: "V", avatar: null },
};

describe("runPoll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a PollLog, refreshes profiles, crawls the feed, stores results, and finalizes", async () => {
    vi.mocked(prisma.pollLog.create).mockResolvedValue({ id: 1 } as MockResult);
    vi.mocked(prisma.pollLog.update).mockResolvedValue({} as MockResult);
    vi.mocked(prisma.hunter.findMany).mockResolvedValue([
      { id: 1, username: "alice", slug: "alice", points: 0, nbReports: 0 },
    ] as MockResult);
    vi.mocked(prisma.hunter.update).mockResolvedValue({} as MockResult);
    vi.mocked(fetchHunterProfile).mockResolvedValue(mockProfile);
    vi.mocked(fetchHacktivity).mockResolvedValue([mockItem]);
    vi.mocked(filterForWatchlist).mockReturnValue([mockItem]);
    vi.mocked(prisma.activity.create).mockResolvedValue({ id: 1 } as MockResult);

    const result = await runPoll();

    expect(prisma.pollLog.create).toHaveBeenCalled();
    expect(fetchHunterProfile).toHaveBeenCalledWith("alice");
    expect(fetchHacktivity).toHaveBeenCalledTimes(1);
    expect(prisma.activity.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        hunterId: 1,
        bugTypeName: "XSS",
        bugTypeSlug: "xss",
        workflowState: "accepted",
      }),
    });
    expect(result.status).toBe("success");
    expect(result.newActivities).toBe(1);
    expect(prisma.pollLog.update).toHaveBeenCalled();
  });

  it("marks PollLog as error when the hacktivity fetch fails", async () => {
    vi.mocked(prisma.pollLog.create).mockResolvedValue({ id: 3 } as MockResult);
    vi.mocked(prisma.pollLog.update).mockResolvedValue({} as MockResult);
    vi.mocked(prisma.hunter.findMany).mockResolvedValue([
      { id: 1, username: "alice", slug: "alice", points: 0, nbReports: 0 },
    ] as MockResult);
    vi.mocked(prisma.hunter.update).mockResolvedValue({} as MockResult);
    vi.mocked(fetchHunterProfile).mockResolvedValue(null);
    vi.mocked(fetchHacktivity).mockResolvedValue(null);

    const result = await runPoll();

    expect(result.status).toBe("error");
    expect(prisma.pollLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 3 },
        data: expect.objectContaining({ status: "error" }),
      })
    );
  });

  it("handles errors and marks PollLog as error", async () => {
    vi.mocked(prisma.pollLog.create).mockResolvedValue({ id: 2 } as MockResult);
    vi.mocked(prisma.pollLog.update).mockResolvedValue({} as MockResult);
    vi.mocked(prisma.hunter.findMany).mockRejectedValue(new Error("DB down"));

    const result = await runPoll();
    expect(result.status).toBe("error");
    expect(prisma.pollLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 2 },
        data: expect.objectContaining({ status: "error" }),
      })
    );
  });
});
