export default function TermTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-term-bright term-glow tracking-tight whitespace-nowrap">
        <span className="text-term-dim font-normal">┌─[ </span>
        {title}
        <span className="text-term-dim font-normal"> ]</span>
        <span className="term-blink text-term-accent2 ml-1">█</span>
      </h1>
      {sub && <p className="text-[11px] text-term-mid mt-1.5">{sub}</p>}
    </div>
  );
}
