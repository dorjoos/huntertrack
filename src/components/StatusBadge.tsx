const stateColors: Record<string, string> = {
  new: "text-term-bright",
  accepted: "text-term-accent2",
  resolved: "text-term-amber",
  informative: "text-term-mid",
  closed: "text-term-dim",
  not_applicable: "text-term-dim",
};

export default function StatusBadge({ state }: { state: string }) {
  const color = stateColors[state] || "text-term-mid";
  return (
    <span className={`text-[11px] font-bold tracking-wide ${color}`}>
      [{state.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}]
    </span>
  );
}
