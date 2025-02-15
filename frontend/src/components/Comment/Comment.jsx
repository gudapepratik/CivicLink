import React from 'react'

function Comment({commentDetails}) {
  return (
    <div className="w-full flex flex-col gap-2 p-2 items-end border border-zinc-100 bg-zinc-50 rounded-lg">
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
            <div className="h-8 flex items-start flex-col">
                <h2 className="font-semibold text-xs text-zinc-800">
                {commentDetails.userDetails[0].name}
                </h2>
                <h3 className="text-xs text-zinc-500">
                {commentDetails.userDetails[0].email}
                </h3>
            </div>
            </div>
        </div>

        {/* Comment form  */}
      <h3 className='w-full text-sm pl-2'>
        {commentDetails.comment}
      </h3>
    </div>
  );
}

export default Comment