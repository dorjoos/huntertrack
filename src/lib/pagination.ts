export const PAGE_SIZE = 30;

export interface ResolvedPage {
  page: number;
  totalPages: number;
  skip: number;
}

export function resolvePage(
  raw: string | string[] | undefined,
  totalItems: number,
  pageSize = PAGE_SIZE
): ResolvedPage {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const parsed = Number.parseInt(Array.isArray(raw) ? raw[0] : raw ?? "1", 10);
  const page = Number.isNaN(parsed)
    ? 1
    : Math.min(Math.max(1, parsed), totalPages);
  return { page, totalPages, skip: (page - 1) * pageSize };
}
