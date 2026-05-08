"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

interface FilterBarProps {
  bugTypes: { bugTypeSlug: string; bugTypeName: string }[];
  states: { workflowState: string }[];
}

export default function FilterBar({ bugTypes, states }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-zinc-600" />
      <select
        value={searchParams.get("bugType") || ""}
        onChange={(e) => updateFilter("bugType", e.target.value)}
        className="text-sm bg-surface-raised border border-border-subtle rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <option value="">All bug types</option>
        {bugTypes.map((bt) => (
          <option key={bt.bugTypeSlug} value={bt.bugTypeSlug}>
            {bt.bugTypeName}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("state") || ""}
        onChange={(e) => updateFilter("state", e.target.value)}
        className="text-sm bg-surface-raised border border-border-subtle rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <option value="">All states</option>
        {states.map((s) => (
          <option key={s.workflowState} value={s.workflowState}>
            {s.workflowState}
          </option>
        ))}
      </select>
    </div>
  );
}
