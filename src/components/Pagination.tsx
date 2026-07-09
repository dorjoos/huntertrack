import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkClass =
    "text-term-mid hover:text-term-bright hover:bg-white/[0.03] px-1 transition-colors";
  const disabledClass = "text-term-dim/50 px-1 select-none";

  return (
    <div className="flex items-center justify-center gap-6 mt-3 text-[11px] font-bold tracking-widest">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className={linkClass}>
          [ &lt; PREV ]
        </Link>
      ) : (
        <span className={disabledClass}>[ &lt; PREV ]</span>
      )}
      <span className="text-term-dim">
        PAGE {page}/{totalPages}
      </span>
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className={linkClass}>
          [ NEXT &gt; ]
        </Link>
      ) : (
        <span className={disabledClass}>[ NEXT &gt; ]</span>
      )}
    </div>
  );
}
