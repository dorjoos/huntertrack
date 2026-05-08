const stateConfig: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  new: { bg: "bg-amber-500/10", text: "text-amber-300", dot: "bg-amber-400", glow: "shadow-amber-500/20" },
  accepted: { bg: "bg-blue-500/10", text: "text-blue-300", dot: "bg-blue-400", glow: "shadow-blue-500/20" },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-300", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
  informative: { bg: "bg-purple-500/10", text: "text-purple-300", dot: "bg-purple-400", glow: "shadow-purple-500/20" },
  not_applicable: { bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-500", glow: "" },
};

export default function StatusBadge({ state }: { state: string }) {
  const c = stateConfig[state] || { bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-500", glow: "" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.bg} ${c.text} shadow-sm ${c.glow}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {state}
    </span>
  );
}
