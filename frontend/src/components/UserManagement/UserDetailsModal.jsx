import AuthService from "@/api/services/auth.services"
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification"
import { useEffect, useState } from "react"
import { RiCloseLine, RiCheckLine, RiUser3Line, RiShieldUserLine, RiGovernmentLine } from "react-icons/ri"

function UserDetailsModal({ user, isOpen, onClose }) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        document.body.style.overflow = "auto"
      }, 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleVerify = async () => {
    try {
      setIsVerifying(true)
      await AuthService.verifyAccountByAdmin({ userId: user._id })
      ToasterNotification({
        type: "success",
        description: "Account has been verified successfully",
      })
    } catch (error) {
      // console.log(error)
      ToasterNotification({
        type: "error",
        description: `${error.message}`,
      })
    } finally {
      setIsVerifying(false)
      onClose()
    }
  }

  const handleReject = async () => {
    try {
      setIsRejecting(true)
      await AuthService.rejectAccountByAdmin({ userId: user._id })
      ToasterNotification({
        type: "success",
        description: "Account has been rejected successfully",
      })
    } catch (error) {
      // console.log(error)
      ToasterNotification({
        type: "error",
        description: `${error.message}`,
      })
    } finally {
      setIsRejecting(false)
      onClose()
    }
  }

  // Get role icon
  const getRoleIcon = () => {
    switch (user?.role?.toLowerCase()) {
      case "admin":
        return <RiShieldUserLine className="text-red-500 dark:text-red-400" size={18} />
      case "authority":
        return <RiGovernmentLine className="text-blue-500 dark:text-blue-400" size={18} />
      default:
        return <RiUser3Line className="text-emerald-500 dark:text-emerald-400" size={18} />
    }
  }

  // Get role badge color
  const getRoleBadgeClasses = () => {
    switch (user?.role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "authority":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/0 backdrop-blur-none transition-all duration-300 ${
        isVisible ? "bg-black/50 backdrop-blur-sm" : ""
      }`}
      onClick={onClose}
    >
      <div
        className={`relative mx-4 top-6 w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-2xl transition-all duration-300 transform ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex items-center gap-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <RiCloseLine size={20} />
          <span className="text-sm">Close</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">User Details</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review user information and approve or reject their request.
          </p>
        </div>

        {/* User profile */}
        <div className="flex flex-col items-center py-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700 border-4 border-white dark:border-zinc-600 shadow-md">
            <img
              src={user?.avatar?.publicUrl || "/placeholder.svg"}
              alt={user?.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = "none"
                e.target.nextSibling.style.display = "flex"
              }}
            />
            <div
              className="absolute inset-0 hidden items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-xl font-medium text-emerald-600 dark:text-emerald-300"
              style={{ display: "none" }}
            >
              {user?.name?.charAt(0)}
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold dark:text-white">{user?.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 ${getRoleBadgeClasses()}`}
            >
              {getRoleIcon()}
              {user?.role}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-zinc-200 dark:bg-zinc-700"></div>

        {/* User details */}
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 items-center">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</span>
            <span className="col-span-2 text-sm dark:text-zinc-300 break-all">{user?.email}</span>
          </div>

          <div className="grid grid-cols-3 items-center">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Age</span>
            <span className="col-span-2 text-sm dark:text-zinc-300">{user?.age || "N/A"}</span>
          </div>

          <div className="grid grid-cols-3 items-center">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gender</span>
            <span className="col-span-2 text-sm dark:text-zinc-300">{user?.gender || "N/A"}</span>
          </div>

          {user?.role?.toLowerCase() === "authority" && (
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Department</span>
              <span className="col-span-2 text-sm dark:text-zinc-300">
                {user?.departmentDetails?.[0]?.name || "N/A"}
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 items-center">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Join Date</span>
            <span className="col-span-2 text-sm dark:text-zinc-300">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</span>
            <span className="col-span-2 text-sm capitalize dark:text-zinc-300">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  (((user.role === "authority" || user.role === "admin") &&  user?.isAdminVerified) || (user.role === "citizen" && user?.isVerified))
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {(((user.role === "authority" || user.role === "admin") &&  user?.isAdminVerified) || (user.role === "citizen" && user?.isVerified)) ? "Verified" : "Pending"}
              </span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex gap-3 sm:justify-end">
          <button
            onClick={handleReject}
            disabled={isRejecting || isVerifying || (user.isAdminVerified || user.isVerified)}
            className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all ${
              isRejecting || isVerifying
                ? "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700"
                : "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 shadow-sm hover:shadow"
            }`}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
            <RiCloseLine className="ml-2" size={18} />
          </button>
          <button
            onClick={handleVerify}
            disabled={(isVerifying || isRejecting) || (user.isAdminVerified || user.isVerified)}
            className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all ${
              isVerifying || isRejecting
                ? "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700"
                : "bg-blue-800 bg-opacity-90 hover:bg-blue-800 dark:bg-blue-900 dark:hover:bg-blue-950 shadow-sm hover:shadow"
            }`}
          >
            {isVerifying ? "Verifying..." : "Verify User"}
            <RiCheckLine className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal