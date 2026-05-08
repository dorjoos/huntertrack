import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchHacktivityPage, filterForWatchlist } from "@/lib/crawler";
import type { YwhHacktivityItem } from "@/lib/types";

const mockItem = (username: string, bugSlug: string): YwhHacktivityItem => ({
  date: "2026-05-08",
  report: {
    hunter: {
      username,
      slug: username.toLowerCase(),
      kyc_status: "V",
      avatar: { url: "https://example.com/avatar.png" },
    },
    bug_type: {
      name: `Bug (${bugSlug})`,
      short_name: `Bug (${bugSlug})`,
      slug: bugSlug,
      description: "A bug",
      link: "https://cwe.mitre.org",
      remediation_link: null,
    },
    status: { workflow_state: "accepted" },
  },
});

describe("filterForWatchlist", () => {
  it("returns only items matching watchlisted usernames", () => {
    const items = [
      mockItem("alice", "xss"),
      mockItem("bob", "sqli"),
      mockItem("charlie", "csrf"),
    ];
    const watchlist = new Set(["alice", "charlie"]);
    const result = filterForWatchlist(items, watchlist);
    expect(result).toHaveLength(2);
    expect(result[0].report.hunter.username).toBe("alice");
    expect(result[1].report.hunter.username).toBe("charlie");
  });

  it("returns empty array when no matches", () => {
    const items = [mockItem("bob", "xss")];
    const watchlist = new Set(["alice"]);
    expect(filterForWatchlist(items, watchlist)).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const items = [mockItem("Alice", "xss")];
    const watchlist = new Set(["alice"]);
    expect(filterForWatchlist(items, watchlist)).toHaveLength(1);
  });
});

describe("fetchHacktivityPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses a page of hacktivity", async () => {
    const mockResponse = { items: [mockItem("alice", "xss")] };
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchHacktivityPage(1);
    expect(result).toHaveLength(1);
    expect(result[0].report.hunter.username).toBe("alice");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.yeswehack.com/hacktivity?page=1"
    );
  });

  it("returns empty array on fetch error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const result = await fetchHacktivityPage(1);
    expect(result).toHaveLength(0);
  });
});
