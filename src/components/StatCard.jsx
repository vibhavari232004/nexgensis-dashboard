import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between">
        
        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={23} className={iconColor} />
        </div>

        {/* Arrow */}
        <div className="rounded-lg bg-slate-50 p-2 text-slate-400 transition group-hover:bg-violet-50 group-hover:text-violet-600">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {value}
        </h3>

        <p className="mt-2 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default StatCard;