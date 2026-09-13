export default function StatsCard({
  label,
  value,
  color,
  icon: Icon,
  onClick,
  isActive = false,
  helperText,
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`text-left w-full bg-slate-900 border rounded-xl p-4 sm:p-5 transition-all relative overflow-hidden ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-800/80 shadow-lg shadow-indigo-500/10"
          : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
      } ${onClick ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs sm:text-sm font-medium">{label}</span>
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${color} shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</div>
        {helperText && (
          <span className="text-xs text-slate-500 hidden sm:inline">{helperText}</span>
        )}
      </div>
    </Component>
  );
}