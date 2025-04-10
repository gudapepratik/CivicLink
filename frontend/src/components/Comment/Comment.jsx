import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { RiEdit2Line, RiMoreLine, RiDeleteBin6Line, RiThumbUpLine, RiFlag2Line } from "@remixicon/react"
import { useSelector } from "react-redux"
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification"
import { getTimeAgo } from "@/utils/DateParsers/DateParser"
// isAuthorityComment,
function Comment({  onDeleteComment, commentDetails, setReloadTrigger }) {
  const user = useSelector((state) => state.authSlice.user)
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef(null)
  const [isAuthorityComment, setisAuthorityComment] = useState(false)

  useEffect(() => {
    if(commentDetails?.isDepartmentUpdate)
      setisAuthorityComment(true)
  },[])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = commentDetails.userDetails[0].name || ""
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const editCommentHandler = async () => {
    // console.log("editing")
    ToasterNotification({
      type: "info",
      title: "Not available yet",
    })
    setShowMenu(false)
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`w-full mb-2 rounded-lg border shadow-sm ${
        isAuthorityComment ? "border-l-4 border-l-blue-500" : "border-zinc-200 dark:border-zinc-700"
      } bg-white dark:bg-zinc-900`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            {commentDetails.userDetails[0].avatar?.publicUrl ? (
              <img
                src={commentDetails.userDetails[0].avatar.publicUrl || "/placeholder.svg"}
                alt={`${commentDetails.userDetails[0].name}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{getUserInitials()}</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            {/* User info and badge */}
            <div className="flex items-center">
              <div className="flex justify-between w-full">
                <div className="flex flex-col items-start">
                  <div className="">
                    <span className="font-semibold text-sm mr-2 text-zinc-800 dark:text-zinc-100">
                      {commentDetails.userDetails[0].name}
                    </span>
                    {isAuthorityComment && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16H12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Authority
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs text-zinc-500 dark:text-zinc-400">
                    {commentDetails.userDetails[0].email}
                  </h3>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {getTimeAgo(commentDetails?.createdAt) || "Just now"}
                  </span>

                  {/* Menu for owner */}
                  {user && user._id === commentDetails.userId && (
                    <div className="relative ml-2" ref={menuRef}>
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <RiMoreLine className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </button>

                      {showMenu && (
                        <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={editCommentHandler}
                              className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center"
                            >
                              <RiEdit2Line className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={onDeleteComment}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center"
                            >
                              <RiDeleteBin6Line className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment text */}
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{commentDetails.comment}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

Comment.propTypes = {
  isAuthorityComment: PropTypes.bool.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  commentDetails: PropTypes.object.isRequired,
  setReloadTrigger: PropTypes.func.isRequired,
}

export default Comment
