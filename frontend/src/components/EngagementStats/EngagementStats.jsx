export function EngagementStats({ title, stats }) {
  return (
    <div className="bg-white p-4 rounded-lg font-outfit dark:bg-zinc-800 dark:text-white shadow-sm">
      <p className="font-medium text-gray-800 mb-3 dark:text-white">{title}</p>
      <div className="flex justify-between mb-4">
        {stats && stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
