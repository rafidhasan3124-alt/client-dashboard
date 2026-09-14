const styles = {
  Active: {
    container: "bg-success-950/30 text-success-400 border-success-500/30",
    dot: "bg-success-400",
  },
  Pending: {
    container: "bg-warning-950/30 text-warning-400 border-warning-500/30",
    dot: "bg-warning-400",
  },
  Inactive: {
    container: "bg-danger-950/30 text-danger-400 border-danger-500/30",
    dot: "bg-danger-400",
  },
};

export default function StatusBadge({ status = "Active" }) {
  const currentStyle = styles[status] || styles.Active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle.container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`} />
      <span>{status}</span>
    </span>
  );
}