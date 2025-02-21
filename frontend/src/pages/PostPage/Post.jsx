import PostService from "@/api/services/post.services";
import { getTimeAgo, parseDateToReadableFormat } from "@/utils/DateParsers/DateParser";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import { RiCalendarLine, RiCheckboxCircleLine, RiErrorWarningLine, RiMapPin2Line, RiMessage2Line, RiMoreFill, RiPinDistanceLine, RiProgress2Line, RiProgress4Line, RiSendPlane2Line, RiSendPlaneLine, RiThumbUpFill, RiThumbUpLine } from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { useLocationContext } from "@/utils/Context/LocationContext";
import MakeComment from "@/components/Comment/MakeComment";
import  CommentService  from "@/api/services/comment.services";
import Comment from "@/components/Comment/Comment";
import Dialog from "@/components/Dialog/Dialog";
import Loader from "@/components/Loader/Loader";
import postServices from "@/api/services/post.services";

function Post() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // const {location, setLocation} = useLocationContext()

  const user = useSelector((state) => state.authSlice.user);
  const [postDetails, setPostDetails] = useState(null);
  const [postComments, setPostComments] = useState([])
  const [departmentComments, setDepartmentComments] = useState([])
  const [refreshCommentTrigger, setRefreshCommentTrigger] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // const dummy = {
  //   address: "WHFH+R6C, Somewhere chowk, Pune, Maharashtra 445204, India",
  //   commentCount: 0,
  //   createdAt: "2025-02-09T05:15:01.568Z",
  //   departmentDetails: [
  //     {
  //       address: " 789 Civic Center, Urban Area, Pune, Maharashtra - 411003",
  //       description:
  //         "The Municipal Corporation oversees urban development, waste management, road maintenance, and overall civic amenities. It also takes care of public hygiene, drainage systems, and city planning.",
  //       name: "Pune Municipal Corporation",
  //       __v: 0,
  //     },
  //   ],
  //   departmentId: "67a7834ff799ce4ca8c59e9e",
  //   description:
  //     "A large pothole has developed near my locality at Somewhere Chowk, Pune. This issue poses a serious risk to pedestrians and vehicles, especially during peak traffic hours. The pothole is getting worse over time and needs urgent attention from the municipal authorities to prevent accidents and improve road safety.",
  //   imageUrls: [
  //   //   {
  //   //     publicUrl:
  //   //       "https://res.cloudinary.com/dm5u6twkl/image/upload/v1739078100/x427owewcnnwhx817wk9.jpg",
  //   //     public_id: "x427owewcnnwhx817wk9",
  //   //     _id: "67a839d57024c20102ca3937",
  //   //   },
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
  //     coordinates: [18.521432806997094, 73.85769665098046],
  //     type: "Point",
  //   },
  //   status: "pending",
  //   title: "🚧 Major Pothole Reported at Somewhere Chowk, Pune",
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
  //         coordinates: [],
  //       },
  //       name: "pratik gudape",
  //       role: "citizen",
  //       __v: 0,
  //     },
  //   ],
  //   userId: "67a64f836b07f4c7295cf9da",
  //   __v: 0,
  //   _id: "67a839d57024c20102ca3936",
  // };

  // set the location so as to get back to the explore page with the same location
    // useEffect(() => {
    //   setLocation(searchParams.get("location") || null)
    // })

  // fetch post from backend

  const [reloadTrigger, setReloadTrigger] = useState(false)
  
  const fetchPost = async () => {
    try {
      const response = await PostService.getPostByID({
        postId: id,
        userId: user?._id,
      });
      console.log(response)
      // console.log(response.data.data[0].userDetails)
      setPostDetails(response.data.data[0])

      // fetch comments after that
      fetchComments(response.data.data[0]._id)
  
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "Error Occurred",
        message: `${error.message}`,
      });
    }
  };

    useEffect(() => {
      fetchPost();
    }, [id]);

    useEffect(() => {
      if(postDetails) {
        fetchComments(postDetails._id)
      }
    },[reloadTrigger])

    const fetchComments = async (postId) => {
      try {
        console.log("here")
        setDepartmentComments([])
        setPostComments([])

        const commentsResponse = await CommentService.getCommentsOnPost({
          postId: postId
        })

        const comments = commentsResponse.data.data

        comments.map((comment) => {
          if(comment.isDepartmentUpdate) {
            setDepartmentComments(prev => [...prev,comment])
          } else{
            setPostComments(prev => [...prev, comment])
          }
        })
      } catch (error) {
        ToasterNotification({
          type: "warning",
          title: "",
          description: "Error while fetching comments"
        })
      }
    }

    const handleDeletePost =async () => {
      try {
        setIsLoading(true)

        await PostService.deletePost({postId: postDetails._id});

        ToasterNotification({
          type: "success",
          title: "Post deleted",
          description: `Your post has been deleted successfully`
        })

        setTimeout(() => {
          navigate('/')
        },2000)
        
      } catch (error) {
        console.log(error)
        ToasterNotification({
          type: "error",
          title: "Error Occurred",
          description: `${error.message}`
        })
      } finally {
        setIsLoading(false)
      }
    }


  return (
    <>
    {isLoading && <Loader/>}
    {postDetails? 
    
    <div className="w-full h-[calc(100vh-80px)] dark:bg-zinc-950 dark:text-white font-outfit flex gap-2 flex-col items-center">
      {/* image slider  */}
      <div className="h-[31vh] w-full scrollbar-hide ">
        <Swiper
          style={{
            "--swiper-pagination-color": "#2f59cc",
          }}
          spaceBetween={10}
          slidesPerView={1}
          className="w-full h-full"
          pagination={{
            clickable: true,
          }}
          zoom={{
            maxRatio: 2,
          }}
          modules={[Zoom, Pagination]}
        >
          {postDetails.imageUrls &&
            postDetails.imageUrls.map((imageFile, index) => (
              <SwiperSlide key={index} className="w-full">
                <div className="swiper-zoom-container">
                  <img
                    src={imageFile.publicUrl}
                    alt="image"
                    className="w-full object-fill"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Post title  */}
      <div className="w-full p-3 flex flex-col gap-5">
          {/* title  */}
          <h1 className="text-pretty font-outfit font-bold text-lg">
              {postDetails.title || "No title"}
          </h1>

          {/* description  */}
          <h2 className="text-zinc-800 dark:text-zinc-500 leading-5">
              {postDetails.description || "No description available"}
          </h2>

          {/* calender and location  */}
          <div className="w-full flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                  <RiCalendarLine size={20}/>
                  <p className="text-xs text-zinc-600 dark:text-zinc-500 text-nowrap">{parseDateToReadableFormat(postDetails.createdAt)}</p>
              </div>
              <div className="flex gap-2 items-center">
                  <RiMapPin2Line size={30}/>
                  <p className="text-xs text-zinc-600 dark:text-zinc-500">{postDetails.address}</p>
              </div>
          </div>

          {/* comment and upvote counts  */}
          <div className="w-full flex justify-between">
              <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                      <RiMessage2Line size={18} className="text-blue-600" />
                      <h4 className="text-xs text-blue-600">
                          {postDetails.commentCount || 115} <span>Comments</span>
                      </h4>
                  </div>

                  <div className="flex items-center gap-2">
                      {postDetails.isUserVoted?
                      <RiThumbUpFill size={18} className="text-red-500" />
                      :
                      <RiThumbUpLine size={18} className="text-red-500" />
                      }
                      <h4 className="text-xs text-red-500">
                          {postDetails.upvoteCount} <span>Upvotes</span>
                      </h4>
                  </div>
              </div>

              <div className="mr-3">
              {postDetails.status === 'pending' && (
              <div className="flex gap-2 text-yellow-500 font-poppins text-xs items-center border bg-yellow-50 border-yellow-500 p-1 rounded-md">
                <RiProgress2Line size={15}/>
                <h2>Pending</h2>
              </div>
            )}
            {postDetails.status === 'inprogress' && (
              <div className="flex gap-2 text-orange-500 font-poppins text-xs items-center border bg-orange-50 border-orange-500 p-1 rounded-md">
                <RiProgress4Line size={15}/>
                <h2>In Progress</h2>
              </div>
            )}
            {postDetails.status === 'resolved' && (
              <div className="flex gap-2 text-green-500 font-poppins text-xs items-center border bg-green-50 border-green-500-500 p-1 rounded-md">
                <RiCheckboxCircleLine size={15}/>
                <h2>Resolved</h2>
              </div>
            )}
            {postDetails.status === 'rejected' && (
              <div className="flex gap-2 text-red-600 font-poppins text-xs items-center border bg-red-50 border-red-600 p-1 rounded-md">
                <RiErrorWarningLine size={15}/>
                <h2>Rejected</h2>
              </div>
            )}
              </div>
          </div>

      </div>

      {/* <div className="w-full flex justify-center items-center"> */}
        {postDetails && postDetails.userId === user?._id && 
          <Dialog ToDelete={handleDeletePost} actionTitle={"Delete Post"} title={"Are you sure?"} message={"This post will be permanently deleted. Do you want to proceed?"}/>
        } 
      {/* </div> */}

      {/* seperator  */}
      <div className="w-[calc(100vw-14px)] flex justify-center h-[1px] border-t-[1px] dark:border-zinc-500"></div>
      {/* User details (post owner) */}
      <div className="w-full flex gap-2 items-center justify-between rounded-lg p-3">
        {/* avatar  */}
        <div className="w-full flex gap-5">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={postDetails.userDetails[0].avatar.publicUrl}
              alt=""
              className="object-contain"
            />
          </div>
          <div className="h-12 flex items-start flex-col">
            <h2 className="font-semibold text-zinc-800 dark:text-white">
              {postDetails.userDetails[0].name}
            </h2>
            <h3 className="text-xs text-zinc-500">
              {postDetails.userDetails[0].email}
            </h3>
          </div>
        </div>
      </div>

      {/* seperator  */}
      <div className="w-[calc(100vw-14px)] flex justify-center h-[1px] border-t-[1px] dark:border-zinc-500"></div>
      
      {/* department details  */}
      <div className="w-[calc(100vw-10vw)] bg-zinc-100 dark:bg-zinc-800 rounded-lg flex flex-col gap-1 p-2">
          <h3 className="">Department details</h3>
          <h4>{postDetails.departmentDetails[0].name}</h4>
          <h3 className="text-zinc-500 text-xs">{postDetails.departmentDetails[0].description}</h3>
          <h4 className="text-zinc-500 text-xs flex items-start gap-2">
              <RiMapPin2Line size={12}/>
              {postDetails.departmentDetails[0].address}
          </h4>
      </div>

      {/* seperator  */}
      <div className="w-[calc(100vw-14px)] flex justify-center h-[1px] border-t-[1px] dark:border-zinc-500"></div>
      
      {/* department comment section  */}
      <div className="w-full p-3 flex flex-col gap-1">
        <h2 >Department Update</h2>
        {departmentComments.length !== 0 ?
          <div className="w-full flex flex-col gap-2">
            {departmentComments.map((comment, index) => (
              <Comment key={index} commentDetails={comment}/>
            ))}
          </div>
        :
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm text-zinc-500">No Updates</h4>
          </div>
        }
      </div>


      {/* seperator  */}
      <div className="w-[calc(100vw-14px)] flex justify-center h-[1px] border-t-[1px]"></div>

      <div className="w-full p-3 flex flex-col gap-2 dark:bg-zinc-950">
          <h2>Comments</h2>
          
          {/* make comment section  */}
          <MakeComment postDetails={postDetails} setReloadTrigger={setReloadTrigger}/>

          {/* All comments  */}
          {postComments ?
              <div className="w-full flex flex-col gap-2">
                {postComments.map((comment, index) => (
                  <Comment key={index} commentDetails={comment}/>
                ))}
              </div>
            :
              <div className="w-full flex flex-col gap-2">
                <h4>No Updates</h4>
              </div>
        }
      </div>
    </div>
    :
    <div>loading....</div>

    }
    </>
  );
}

export default Post;
