const styles = {
  Active: {
    container: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  },
  Pending: {
    container: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  },
  Inactive: {
    container: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    dot: "bg-rose-400",
  },
};

export default function StatusBadge({ status = "Active" }) {
  const currentStyle = styles[status] || styles.Active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle.container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`} />
      <span>{status}</span>
    </span>
  );
}