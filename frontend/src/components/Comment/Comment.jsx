import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../MenuList/MenuList'
import { RiEdit2Line } from '@remixicon/react'
import  CommentService  from '@/api/services/comment.services'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { useSelector } from 'react-redux'

function Comment({isAuthorityComment,onDeleteComment, commentDetails, setReloadTrigger}) {

  const user = useSelector(state => state.authSlice.user)

  const editCommentHandler =async () => {
    console.log("editing")
    ToasterNotification({
      type: "info",
      title: "yet to be implemented"
    })
  }


  const MenuItems = [
    {
      label: "Edit",
      onClickHandler: editCommentHandler
    },
    {
      label: "Delete",
      onClickHandler: onDeleteComment
    }
  ]

  return (
    <div  className={`w-full flex flex-col gap-2 p-2 items-end border ${isAuthorityComment? "bg-zinc-200 border-zinc-300 dark:border-zinc-400" : "bg-zinc-50 border-zinc-100 dark:border-zinc-500"}  dark:bg-zinc-900 rounded-lg`}>
        {/* user details  */}
            <div className="w-full flex items-center justify-between rounded-lg">
            {/* avatar  */}
            <div className="w-full flex gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full">
                <img
                src={commentDetails.userDetails[0].avatar.publicUrl}
                alt=""
                className="object-contain"
                />
            </div>

            <div className='flex justify-between w-[calc(100%-10%)]'>
              <div className="h-8 flex items-start flex-col">
                  <h2 className="font-semibold text-xs text-zinc-800 dark:text-white">
                  {commentDetails.userDetails[0].name}
                  </h2>
                  <h3 className="text-xs text-zinc-500">
                  {commentDetails.userDetails[0].email}
                  </h3>
              </div>

              {user && user._id === commentDetails.userId && (
                <div className='dark:bg-zinc-800'>
                <Tooltip triggerTitle={<RiEdit2Line/>} triggerButtonStyles={"bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 border border-zinc-200"} menuItems={MenuItems}/>
                </div>
              )}
            </div>
            </div>
        </div>

        {/* Comment form  */}
      <h3 className='w-full text-sm pl-2 dark:text-zinc-300'>
        {commentDetails.comment}  
      </h3>
    </div>
  );
}
Comment.propTypes = {
  isAuthorityComment: PropTypes.bool.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  commentDetails: PropTypes.object.isRequired,
  setReloadTrigger: PropTypes.func.isRequired,
}

export default Comment