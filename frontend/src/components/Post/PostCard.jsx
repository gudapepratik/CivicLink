import { RiCheckboxCircleFill, RiErrorWarningFill, RiMessage2Fill, RiMessage2Line, RiMoreFill, RiProgress2Fill, RiProgress4Fill, RiThumbUpFill, RiThumbUpLine } from "@remixicon/react";
import React, { useEffect } from "react";
import PostCardSkeleton from "./PostCardSkeleton";
import { useNavigate } from "react-router";
import { getTimeAgo, parseDateToReadableFormat } from "@/utils/DateParsers/DateParser";
import { useLocationContext } from "@/utils/Context/LocationContext";

function PostCard({ postDetails , CurrentLocation}) {
  // const dummy = {
  //   _id: "67a839d57024c20102ca3936",
  //   address: "WHFH+R6C, Somewhere chowk, Pune, Maharashtra 445204, India",
  //   commentCount: 0,
  //   createdAt: "2025-02-09T05:15:01.568Z",
  //   departmentDetails: [
  //     {
  //       address: "789 Civic Center, Urban Area, Pune, Maharashtra - 411003",
  //       description:
  //         "The Municipal Corporation oversees urban development, waste management, road maintenance, and overall civic amenities. It also takes care of public hygiene, drainage systems, and city planning.",
  //       name: "Pune Municipal Corporation",
  //       __v: 0,
  //     },
  //   ],
  //   departmentId: "67a7834ff799ce4ca8c59e9e",
  //   description:
  //     "This issue is regarding the pothole that I see every day near my locality.\r\nasfa\r\nas",
  //   distance: 0,
  //   imageUrls: [
  //     {
  //       publicUrl:
  //         "https://res.cloudinary.com/dm5u6twkl/image/upload/v1739078100/x427owewcnnwhx817wk9.jpg",
  //       public_id: "x427owewcnnwhx817wk9",
  //       _id: "67a839d57024c20102ca3937",
  //     },
  //     {
  //       publicUrl:
  //         "https://res.cloudinary.com/dm5u6twkl/image/upload/v1739078099/cmilfvkoghhbwvgerlwb.jpg",
  //       public_id: "cmilfvkoghhbwvgerlwb",
  //       _id: "67a839d57024c20102ca3938",
  //     },
  //     {
  //       publicUrl:
  //         "https://res.cloudinary.com/dm5u6twkl/image/upload/v1739078100/uguam8uexuct5vc7tgme.jpg",
  //       public_id: "uguam8uexuct5vc7tgme",
  //       _id: "67a839d57024c20102ca3939",
  //     },
  //   ],
  //   location: {
  //     type: "Point",
  //     coordinates: [73.8567, 18.5204], // Longitude, Latitude
  //   },
  //   status: "pending",
  //   title: "New issue is reported",
  //   updatedAt: "2025-02-09T05:15:01.568Z",
  //   upvoteCount: 0,
  //   userDetails: [
  //     {
  //       avatar: {
  //         publicUrl:
  //           "https://res.cloudinary.com/dm5u6twkl/image/upload/v1738952579/bt7gt5ybqswwbyu1gsnc.jpg",
  //         public_id: "bt7gt5ybqswwbyu1gsnc",
  //       },
  //       email: "pratikgudape9825@gmail.com",
  //       location: {
  //         type: "Point",
  //         coordinates: [73.8567, 18.5204], // Longitude, Latitude
  //       },
  //       name: "pratik gudape",
  //       role: "citizen",
  //       __v: 0,
  //     },
  //   ],
  //   userId: "67a64f836b07f4c7295cf9da",
  // };

  const {location, setLocation} = useLocationContext()

  // upvote toggle handler
  const handleUpvoteUpdate = () => {
    
  };

  const navigate = useNavigate()
  // handle navigation to post page
  const handleNavigate = () => {
    navigate(`/explore-posts/${postDetails._id}?location=${encodeURIComponent(location)}`)
  }

  return (
    <>
      {!postDetails ? (
        <PostCardSkeleton />
      ) : (
        <div className="w-full p-3 flex flex-col gap-2 border bg-zinc-50  shadow-inner rounded-xl font-outfit">
          {/* profile section  */}
          <div className="w-full mb-1 flex gap-2 items-center justify-between rounded-lg">
            {/* avatar  */}
            <div className="w-full flex  gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  src={postDetails.userDetails[0].avatar.publicUrl}
                  alt=""
                  className="object-cover"
                />
              </div>
              <div className="h-10 flex items-start flex-col">
                <h2 className="font-semibold text-zinc-800">
                  {postDetails.userDetails[0].name}
                </h2>
                <h3 className="text-xs text-zinc-600">
                  {getTimeAgo(postDetails.createdAt)}
                </h3>
              </div>
            </div>
            <RiMoreFill />
          </div>

          {/* Title section  */}
          <div className="w-full">
            <h2 className="text-wrap text-lg leading-4">
              {postDetails.title}
            </h2>
          </div>

          {/* image section  */}
          <div className="w-full h-40 flex rounded-xl">
            <img
              src={postDetails.imageUrls[0].publicUrl}
              alt=""
              className="w-full object-cover rounded-xl"
              onClick={handleNavigate}
            />
          </div>

          {/* statistics section  */}
          <div className="w-full flex gap-3  items-center justify-between">
            <div className="w-1/2 flex gap-4">
              {/* commentts section  */}
              <div className="flex gap-2 items-center border rounded-md shadow-inner p-2">
                <RiMessage2Line size={18} className="text-blue-600" />
                <h4 className="text-xs text-blue-600">
                  {postDetails.commentCount}
                </h4>
              </div>
              {/* votes section  */}
              <div
                className="flex gap-2 items-center border rounded-md shadow-inner p-2"
                onClick={handleUpvoteUpdate}
              >
                <RiThumbUpLine size={18} className="text-red-600" />
                <h4 className="text-xs text-red-600">
                  {postDetails.upvoteCount}
                </h4>
              </div>
            </div>

            {/* status  */}
              {/* <RiCheckboxCircleFill/>
              <RiErrorWarningFill/>
              <RiProgress4Fill/>
              <RiProgress2Fill/> */}
            <div>
              {postDetails.status === 'pending' && (
                <div className="flex gap-2 text-yellow-500 font-poppins text-xs items-center border bg-yellow-50 border-yellow-500 p-1 rounded-md">
                  <RiProgress2Fill size={15}/>
                  <h2>Pending</h2>
                </div>
              )}
              {postDetails.status === 'inprogress' && (
                <div className="flex gap-2 text-orange-500 font-poppins text-xs items-center border bg-orange-50 border-orange-500 p-1 rounded-md">
                  <RiProgress4Fill size={15}/>
                  <h2>In Progress</h2>
                </div>
              )}
              {postDetails.status === 'resolved' && (
                <div className="flex gap-2 text-green-500 font-poppins text-xs items-center border bg-green-50 border-green-500-500 p-1 rounded-md">
                  <RiCheckboxCircleFill size={15}/>
                  <h2>Resolved</h2>
                </div>
              )}
              {postDetails.status === 'rejected' && (
                <div className="flex gap-2 text-red-600 font-poppins text-xs items-center border bg-red-50 border-red-600 p-1 rounded-md">
                  <RiErrorWarningFill size={15}/>
                  <h2>Rejected</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export default PostCard;
