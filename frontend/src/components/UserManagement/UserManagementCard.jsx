import React from 'react'

function UserManagementCard({user, onClick}) {
  return (
    <div
      className="cursor-pointer rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-900 duration-300 font-outfit border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50"
      onClick={() => onClick(user)}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          <img
            src={user.avatar.publicUrl || "/placeholder.svg"}
            alt={user.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none"
              e.target.nextSibling.style.display = "flex"
            }}
          />
          <div
            className="absolute inset-0 hidden items-center justify-center bg-emerald-100 text-emerald-600"
            style={{ display: "none" }}
          >
            {user.name.charAt(0)}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{user.name}</h3>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                user.role === "admin" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-sm text-gray-500">{user.departmentDetails[0]?.name}</p>
          <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default UserManagementCard
