export default function ProgressBar({
  title,
  value,
  target,
  additionalInfo,
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium text-gray-800 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{Number(value).toFixed(2)}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        {target && <span>Target: {target}%</span>}
        {additionalInfo && <span>{additionalInfo}</span>}
      </div>
    </div>
  );
}
