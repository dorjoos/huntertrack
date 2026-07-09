import { describe, it, expect } from "vitest";
import { resolvePage, PAGE_SIZE } from "@/lib/pagination";

describe("resolvePage", () => {
  it("defaults to page 1 when param is missing", () => {
    expect(resolvePage(undefined, 90)).toEqual({ page: 1, totalPages: 3, skip: 0 });
  });

  it("resolves a valid page with its skip offset", () => {
    expect(resolvePage("2", 90)).toEqual({ page: 2, totalPages: 3, skip: 30 });
  });

  it("clamps pages past the end to the last page", () => {
    expect(resolvePage("99", 90)).toEqual({ page: 3, totalPages: 3, skip: 60 });
  });

  it("clamps zero and negative pages to 1", () => {
    expect(resolvePage("0", 90).page).toBe(1);
    expect(resolvePage("-5", 90).page).toBe(1);
  });

  it("falls back to page 1 on non-numeric input", () => {
    expect(resolvePage("abc", 90)).toEqual({ page: 1, totalPages: 3, skip: 0 });
  });

  it("uses the first value of a repeated param", () => {
    expect(resolvePage(["2", "5"], 90).page).toBe(2);
  });

  it("treats an empty list as a single page", () => {
    expect(resolvePage("3", 0)).toEqual({ page: 1, totalPages: 1, skip: 0 });
  });

  it("rounds partial pages up", () => {
    expect(resolvePage("1", PAGE_SIZE + 1).totalPages).toBe(2);
  });
});
