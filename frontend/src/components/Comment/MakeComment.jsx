import CommentService from "@/api/services/comment.services";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import { RiLoaderLine, RiSendPlane2Fill } from "@remixicon/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function MakeComment({ postDetails, setReloadTrigger, addCommentHandler }) {
  const user = useSelector((state) => state.authSlice.user);
  const [isLoading, setIsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const handleCommentSubmit = async () => {
    try {
      setIsLoading(true);

      await addCommentHandler({ commentInput: commentInput });
      setCommentInput("");
    } catch (error) {
      ToasterNotification({
        type: "warning",
        title: "Error Occurred",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
    // try {
    //     setIsLoading(true)

    //     if(!user) throw new Error("User must be logged in to comment")

    //     if(!commentInput || commentInput.length < 10) throw new Error("Comment must be atleast 10 characters long")

    //     if(user.role === "authority" && user.departmentId !== postDetails.departmentId) throw new Error("User not authorized to comment on current post")

    //     const isDepartmentUpdate = user.role === "authority"? true : false

    //     await CommentService.addNewComment({
    //         postId: postDetails._id,
    //         comment: commentInput,
    //         isDepartmentUpdate
    //     })

    //     setCommentInput("")

    //     // reload the comments
    //     setReloadTrigger(prev => !prev)
    // } catch (error) {
    //     ToasterNotification({
    //         type: "warning",
    //         title: "Error Occurred",
    //         description: `${error.message}`
    //     })
    // } finally{
    //   setIsLoading(false)
    // }
  };

  return (
    <div className="w-full flex  gap-1  items-end rounded-lg">
      {/* user details  */}
      {/* Comment form  */}
      <textarea
        id="comment"
        placeholder="Add your comment..."
        className="w-full p-3 border border-zinc-500 duration-300 rounded-l-md focus:ring-1 focus:ring-zinc-700  focus:outline-none dark:focus:ring-offset-white dark:focus:ring-white leading-4 dark:bg-zinc-800"
        onChange={(e) => setCommentInput(e.target.value)}
        value={commentInput}
      />

      {!isLoading ? (
        <button
          className="flex gap-2 size-fit h-full border  bg-zinc-800 hover:bg-white hover:text-zinc-800 duration-300  rounded-r-md px-4 text-white text-xs items-center"
          onClick={handleCommentSubmit}
        >
          <span>
            <RiSendPlane2Fill size={20} />
          </span>
        </button>
      ) : (
        <button
          className="flex gap-2 size-fit h-full border bg-zinc-800 duration-300  rounded-r-md px-4 text-white text-xs items-center"
          onClick={handleCommentSubmit}
        >
          <span>
            <RiLoaderLine size={20} className="animate-spin" />
          </span>
        </button>
      )}
    </div>
  );
}

export default MakeComment;


// {user && (
//   <div className="w-full flex items-center justify-between rounded-lg">
//     {/* avatar  */}
//     <div className="w-full flex gap-2">
//       <div className="h-8 w-8 overflow-hidden rounded-full">
//         <img
//           src={user.avatar.publicUrl}
//           alt=""
//           className="object-contain"
//         />
//       </div>
//       <div className="h-8 flex items-start flex-col">
//         <h2 className="font-semibold text-xs text-zinc-800 dark:text-white">
//           {user.name}
//         </h2>
//         <h3 className="text-xs text-zinc-500">{user.email}</h3>
//       </div>
//     </div>
//   </div>
// )}
