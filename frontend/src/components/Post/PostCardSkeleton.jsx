import React from 'react'

function PostCardSkeleton() {
  return (
    <div className="w-full max-w-xl border rounded-lg p-3 space-y-3">
      {/* Header with avatar and name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Post content */}
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Image placeholder */}
      <div className="h-28 w-full rounded-lg bg-gray-300 animate-pulse" />

      {/* Engagement metrics */}
      <div className="flex items-center space-x-2">
        <div className="h-5 w-12 bg-gray-300 rounded animate-pulse" />
        <div className="h-5 w-12 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default PostCardSkeleton