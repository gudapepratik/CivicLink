import { parseDateToReadableFormat } from "@/utils/DateParsers/DateParser"
import { RiArrowRightSLine } from "@remixicon/react"

export default function DashboardReportItem({ title, address, status, createdAt, onClick }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "inprogress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 flex items-center justify-between" onClick={onClick}>
      <div>
      <p className="font-medium text-gray-800 dark:text-white line-clamp-1">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{address}</p>
        <div className="flex items-center mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyles(status)}`}>{status}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{parseDateToReadableFormat(createdAt)}</span>
        </div>
      </div>
      <RiArrowRightSLine className="h-5 w-5 text-gray-400"/>
    </div>
  )
}

