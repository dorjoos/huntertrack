import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    hunter: { findMany: vi.fn() },
    activity: { create: vi.fn() },
    hunter: { findMany: vi.fn(), update: vi.fn() },
    pollLog: { create: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/crawler", () => ({
  fetchHacktivityPage: vi.fn(),
  filterForWatchlist: vi.fn(),
}));

import { runPoll } from "@/lib/poller";
import { prisma } from "@/lib/db";
import { fetchHacktivityPage, filterForWatchlist } from "@/lib/crawler";

describe("runPoll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a PollLog, crawls pages, stores results, and finalizes", async () => {
    const mockPollLog = { id: 1 };
    vi.mocked(prisma.pollLog.create).mockResolvedValue(mockPollLog as any);
    vi.mocked(prisma.pollLog.update).mockResolvedValue({} as any);
    vi.mocked(prisma.hunter.findMany).mockResolvedValue([
      { id: 1, username: "alice", slug: "alice" },
    ] as any);
    vi.mocked(prisma.hunter.update).mockResolvedValue({} as any);

    const mockItem = {
      date: "2026-05-08",
      report: {
        hunter: { username: "alice", slug: "alice", kyc_status: "V", avatar: null },
        bug_type: {
          name: "XSS",
          short_name: "XSS",
          slug: "xss",
          description: "Cross-site scripting",
          link: "https://cwe.mitre.org",
          remediation_link: null,
        },
        status: { workflow_state: "accepted" },
      },
    };

    vi.mocked(fetchHacktivityPage).mockResolvedValueOnce([mockItem]);
    vi.mocked(fetchHacktivityPage).mockResolvedValueOnce([]);
    vi.mocked(filterForWatchlist).mockReturnValueOnce([mockItem]);
    vi.mocked(filterForWatchlist).mockReturnValueOnce([]);

    vi.mocked(prisma.activity.create).mockResolvedValue({ id: 1 } as any);

    const result = await runPoll();
    expect(prisma.pollLog.create).toHaveBeenCalled();
    expect(fetchHacktivityPage).toHaveBeenCalledWith(1);
    expect(result.newActivities).toBeGreaterThanOrEqual(0);
    expect(prisma.pollLog.update).toHaveBeenCalled();
  });

  it("handles errors and marks PollLog as error", async () => {
    const mockPollLog = { id: 2 };
    vi.mocked(prisma.pollLog.create).mockResolvedValue(mockPollLog as any);
    vi.mocked(prisma.pollLog.update).mockResolvedValue({} as any);
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
