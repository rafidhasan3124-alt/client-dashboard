export default function StatsCard({
  label,
  value,
  color,
  icon: Icon,
  onClick,
  isActive = false,
  helperText,
  trend,
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`text-left w-full bg-neutral-900 border rounded-xl p-5 card-hover relative overflow-hidden ${
        isActive
          ? "border-primary-500/50 bg-primary-950/10"
          : "border-neutral-800"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide-label">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-2xl font-semibold text-white tabular-nums tracking-tight">
          {value}
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center ${
            trend.type === 'positive' ? 'text-success-400' : 'text-danger-400'
          }`}>
            {trend.type === 'positive' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-neutral-500">{helperText}</p>
      )}
    </Component>
  );
}