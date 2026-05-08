const stateConfig: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  accepted: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  informative: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
};

export default function StatusBadge({ state }: { state: string }) {
  const config = stateConfig[state] || { bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {state}
    </span>
  );
}
