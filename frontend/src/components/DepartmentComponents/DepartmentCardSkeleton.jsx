import React from 'react'

function DepartmentCardSkeleton() {
  return (
    <div className="w-full max-w-xl border rounded-lg p-0 space-y-3">

      {/* Image placeholder */}
      <div className="h-28 w-full rounded-t-lg bg-gray-300 animate-pulse" />

      {/* Header with avatar and name */}
      <div className="w-full flex items-center space-x-3 px-4 pb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        <div className="w-[80%] space-y-2">
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-[60%] bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default DepartmentCardSkeleton