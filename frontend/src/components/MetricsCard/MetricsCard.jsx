export default function MetricCard({ title, value, change }) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 font-outfit rounded-lg shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      {change && (
        <div className={`mt-2 text-xs ${change.isPositive ? "text-green-600" : "text-red-600"}`}>{change.value}</div>
      )}
    </div>
  )
}

