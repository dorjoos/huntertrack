import type { YwhHacktivityItem, YwhHacktivityResponse, YwhHunterProfile } from "./types";

const YWH_API = "https://api.yeswehack.com/v2/hacktivity";
const YWH_HUNTER_API = "https://api.yeswehack.com/hunters";

// The v2 endpoint has no pagination: it always returns the latest ~50 items.
// Returns null on failure (as opposed to an empty feed) so callers can
// distinguish "API broken" from "nothing new".
export async function fetchHacktivity(): Promise<YwhHacktivityItem[] | null> {
  try {
    const res = await fetch(YWH_API);
    if (!res.ok) return null;
    const data: YwhHacktivityResponse = await res.json();
    return data.items ?? [];
  } catch {
    return null;
  }
}

export async function fetchHunterProfile(
  username: string
): Promise<YwhHunterProfile | null> {
  try {
    const res = await fetch(`${YWH_HUNTER_API}/${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function filterForWatchlist(
  items: YwhHacktivityItem[],
  watchlist: Set<string>
): YwhHacktivityItem[] {
  const lower = new Set([...watchlist].map((u) => u.toLowerCase()));
  return items.filter((item) => lower.has(item.hunter.username.toLowerCase()));
}
