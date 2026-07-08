import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchHacktivity, filterForWatchlist } from "@/lib/crawler";
import type { YwhHacktivityItem } from "@/lib/types";

const mockItem = (username: string, bugSlug: string): YwhHacktivityItem => ({
  date: "2026-07-08",
  status: "accepted",
  bug_type: {
    name: `Bug (${bugSlug})`,
    slug: bugSlug,
    description: "A bug",
    link: "https://cwe.mitre.org",
    remediation_link: null,
  },
  hunter: {
    username,
    slug: username.toLowerCase(),
    kyc_status: "V",
    avatar: { url: "https://example.com/avatar.png" },
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
    expect(result[0].hunter.username).toBe("alice");
    expect(result[1].hunter.username).toBe("charlie");
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

describe("fetchHacktivity", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses the hacktivity feed", async () => {
    const mockResponse = { items: [mockItem("alice", "xss")] };
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchHacktivity();
    expect(result).toHaveLength(1);
    expect(result![0].hunter.username).toBe("alice");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.yeswehack.com/v2/hacktivity"
    );
  });

  it("returns null on HTTP error so the poller can flag it", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    expect(await fetchHacktivity()).toBeNull();
  });

  it("returns null on network error", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("ECONNRESET"));

    expect(await fetchHacktivity()).toBeNull();
  });

  it("returns empty array when response has no items", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    expect(await fetchHacktivity()).toEqual([]);
  });
});
