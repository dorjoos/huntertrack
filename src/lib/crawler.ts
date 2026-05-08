import type { YwhHacktivityItem, YwhHacktivityResponse } from "./types";

const YWH_API = "https://api.yeswehack.com/hacktivity";

export async function fetchHacktivityPage(
  page: number
): Promise<YwhHacktivityItem[]> {
  try {
    const res = await fetch(`${YWH_API}?page=${page}`);
    if (!res.ok) return [];
    const data: YwhHacktivityResponse = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export function filterForWatchlist(
  items: YwhHacktivityItem[],
  watchlist: Set<string>
): YwhHacktivityItem[] {
  const lower = new Set([...watchlist].map((u) => u.toLowerCase()));
  return items.filter((item) =>
    lower.has(item.report.hunter.username.toLowerCase())
  );
}
