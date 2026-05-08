const stateStyles: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

export default function StatusBadge({ state }: { state: string }) {
  const style = stateStyles[state] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {state}
    </span>
  );
}
