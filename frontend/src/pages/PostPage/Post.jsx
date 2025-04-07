import PostService from "@/api/services/post.services";
import {
  getTimeAgo,
  parseDateToReadableFormat,
} from "@/utils/DateParsers/DateParser";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationFill,
  RiLoaderLine,
  RiMapPin2Line,
  RiMessage2Line,
  RiMoreFill,
  RiPinDistanceLine,
  RiProgress2Line,
  RiProgress4Line,
  RiProhibitedLine,
  RiSendPlane2Line,
  RiSendPlaneLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { useLocationContext } from "@/utils/Context/LocationContext";
import MakeComment from "@/components/Comment/MakeComment";
import CommentService from "@/api/services/comment.services";
import Comment from "@/components/Comment/Comment";
import Dialog from "@/components/Dialog/Dialog";
import Loader from "@/components/Loader/Loader";
import postServices from "@/api/services/post.services";
import UpvoteService from "@/api/services/upvote.services";
import ActionDialog from "@/components/AuthorityActionDialog/ActionDialog";
import departmentUpdateServices from "@/api/services/departmentUpdate.services";
import DepartmentUpdate from "@/components/DepartmentUpdate/DepartmentUpdate";
import StatusButton from "@/components/StatusButtons/StatusButton";
import { Button } from "@chakra-ui/react";
import PostTabs from "@/components/Post/PostTabs";
import PostTabDetails from "@/components/Post/PostTabDetails";
import adminServices, { adminService}  from "@/api/services/admin.services.js";

const tabs = ["Details", "Updates", "Comments", "Location"]

function Post() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // const {location, setLocation} = useLocationContext()

  const user = useSelector((state) => state.authSlice.user);
  const [postDetails, setPostDetails] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [departmentComments, setDepartmentComments] = useState([]);
  const [refreshCommentTrigger, setRefreshCommentTrigger] = useState(false);
  const [departmentUpdates, setDepartmentUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const [reloadTrigger, setReloadTrigger] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await PostService.getPostByID({
        postId: id,
        userId: user?._id,
      });
      console.log(response);
      // console.log(response.data.data[0].userDetails)
      setPostDetails(response.data.data[0]);

      // fetch comments after that
      fetchComments(response.data.data[0]._id);
      fetchDepartmentUpdates(response.data.data[0]._id);
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
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])

  const fetchComments = async (postId) => {
    try {
      console.log("here");
      setDepartmentComments([]);
      setPostComments([]);

      const commentsResponse = await CommentService.getCommentsOnPost({
        postId: postId,
      });

      const comments = commentsResponse.data.data;

      comments.map((comment) => {
        if (comment.isDepartmentUpdate) {
          setDepartmentComments((prev) => [...prev, comment]);
        } else {
          setPostComments((prev) => [...prev, comment]);
        }
      });
    } catch (error) {
      ToasterNotification({
        type: "warning",
        title: "",
        description: "Error while fetching comments",
      });
    }
  };

  const fetchDepartmentUpdates = async (postId) => {
    try {
      setDepartmentUpdates([]);

      const departmentUpdateResponse =
        await departmentUpdateServices.getDepartmentUpdatesOnPost(postId);

      console.log(departmentUpdateResponse.data.data);

      setDepartmentUpdates(departmentUpdateResponse.data.data);
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "",
        description: "Error while fetching department updates",
      });
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);

      await PostService.deletePost({ postId: postDetails._id });

      ToasterNotification({
        type: "success",
        title: "Post deleted",
        description: `Your post has been deleted successfully`,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "error",
        title: "Error Occurred",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      if (!user) throw new Error("User not Logged in");

      if (postDetails.isUserVoted) {
        // remove the vote
        setPostDetails((prev) => ({
          ...prev,
          isUserVoted: false,
          upvoteCount: prev.upvoteCount - 1,
        }));

        await UpvoteService.removeUpvoteFromPost({ postId: postDetails._id });
      } else {
        // add the vote
        setPostDetails((prev) => ({
          ...prev,
          isUserVoted: true,
          upvoteCount: prev.upvoteCount + 1,
        }));

        await UpvoteService.addNewUpvote({ postId: postDetails._id });
      }
    } catch (error) {
      console.log(error);

      if (user) {
        // Rollback the state changes if an error occurs
        setPostDetails((prev) => ({
          ...prev,
          isUserVoted: !prev.isUserVoted,
          upvoteCount: prev.isUserVoted
            ? prev.upvoteCount + 1
            : prev.upvoteCount - 1,
        }));
      }

      ToasterNotification({
        type: "error",
        description: `${error.message}`,
      });
    }
  };

  const handleDeleteComment = async (comment) => {
    const isDepartmentComment = comment.isDepartmentUpdate;
    // console.log("deleting..");

    await CommentService.removeCommentFromPost({ commentId: comment._id });

    try {
      // if the comment is authority comment , remove the comment from there, else remove from the postComments
      console.log(departmentComments);
      if (isDepartmentComment) {
        setDepartmentComments((prev) =>
          prev.filter((item) => item._id !== comment._id)
        );
      } else {
        setPostComments((prev) =>
          prev.filter((item) => item._id !== comment._id)
        );
      }

      ToasterNotification({
        type: "success",
        title: "Comment has been removed successfully",
      });

    } catch (error) {
      console.log(error);

      if (isDepartmentComment) {
        departmentComments.push(comment);
      } else {
        postComments.push(comment);
      }

      // if any error occurrs, add the comment again
      ToasterNotification({
        type: "error",
        title: "Error Occurred while deleting comment",
      });
    }
  };

  const newDepartmentUpdate = async ({
    remark,
    docs,
    updatedStatus,
    expectedResolutionDate,
  }) => {
    try {
      setIsLoading(true)
      // console.log(remark, docs, updatedStatus, expectedResolutionDate, postDetails._id)
      const response = await departmentUpdateServices.addNewDepartmentUpdate({
        postId: postDetails?._id,
        docs,
        remark,
        updatedStatus,
        expectedResolutionDate,
        recipient_email: postDetails.userDetails[0].email,
        recipient_name: postDetails.userDetails[0].name, 
        report_title: postDetails.title
      });
      console.log(response.data.data);
      setDepartmentUpdates((prev) => [response.data.data[0], ...prev]);
      setPostDetails((prev) => ({ ...prev, status: updatedStatus }));
      ToasterNotification({
        type: "success",
        description: "Update done successfully",
      });
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        description: `${error.message}`,
      });
    } finally{
      setIsLoading(false)
    }
  };

  const addNewComment = async ({commentInput}) => {
    if (!user) throw new Error("User must be logged in to comment");

    if (!commentInput || commentInput.length < 10)
      throw new Error("Comment must be atleast 10 characters long");

    if (
      user.role === "authority" &&
      user.departmentId !== postDetails.departmentId
    )
      throw new Error("User not authorized to comment on current post");

    const isDepartmentUpdate = user.role === "authority" ? true : false;

    const response = await CommentService.addNewComment({
      postId: postDetails._id,
      comment: commentInput,
      isDepartmentUpdate,
      recipient_email: postDetails.userDetails[0].email,
      recipient_name: postDetails.userDetails[0].name, 
      report_title: postDetails.title
    });

    if(isDepartmentUpdate) {
      setDepartmentComments(prev => [response.data.data[0], ...prev])
    } else{
      setPostComments(prev => [response.data.data[0], ...prev])
    }
  };

  const handleRejectPost = async () => {
    try {
      setIsLoading(true)
      if(!user) throw new Error("Admin not logged in !")
      const response = await adminServices.rejectReport({
        postId: postDetails._id,
        recipient_email: postDetails.userDetails[0].email,
        recipient_name: postDetails.userDetails[0].name,
        rejectionReason: ""
      })

      // update the postdetails
      setPostDetails(prev => ({
        ...prev,
        isApproved: false,
        rejectedBy: user._id,
        status: "dismissed"
      }))

      ToasterNotification({
        type: "success",
        description: "Report has been rejected succesfully"
      })
    } catch (error) {
      console.log(error)
      ToasterNotification({
        type: "warning",
        description: `${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprovePost = async () => {
    try {
      setIsLoading(true)
      if(!user) throw new Error("Admin not logged in !")
      const response = await adminServices.approveReport({
        postId: postDetails._id,
        recipient_email: postDetails.userDetails[0].email,
        recipient_name: postDetails.userDetails[0].name,
      })

      // update the postdetails
      setPostDetails(prev => ({
        ...prev,
        isApproved: true,
        approvedBy: user._id,
        status: "pending"
      }))

      ToasterNotification({
        type: "success",
        description: "Report has been approved succesfully"
      })
    } catch (error) {
      console.log(error)
      ToasterNotification({
        type: "warning",
        description: `${error.message}`
      })
    } finally{ 
      setIsLoading(false)
    }
  }

  const [expandDesc, setExpandDesc] = useState(false)
  const [activeTab, setActiveTab] = useState("Details")

  return (
    <>
      {isLoading && <Loader />}
      {postDetails ? (
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
          <div className="w-full p-3 flex flex-col gap-4">
            {/* title  */}
            <h1 className="font-outfit font-bold leading-6 text-xl">
              {postDetails.title || "No title"}
            </h1>

            {/* Status, comment and upvote counts  */}
            <div className="w-full flex justify-between items-center">
              <div className="mr-3">
                <StatusButton key={postDetails.status} status={postDetails.status} isApproved={postDetails.isApproved} rejectedBy={postDetails.rejectedBy}/>
              </div>
              <div className="flex gap-3 items-center">

                <div className="flex items-center gap-2" onClick={handleUpvote}>
                  {postDetails.isUserVoted ? (
                    <RiThumbUpFill size={20} className="text-red-500 " />
                  ) : (
                    <RiThumbUpLine size={20} className="text-red-500" />
                  )}
                  <h4 className="text-sm text-red-500">
                    {postDetails.upvoteCount}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <RiMessage2Line size={20} className="text-blue-600" />
                  <h4 className="text-sm text-blue-600">
                    {postDetails.commentCount}
                  </h4>
                </div>

              </div>
            </div>

            {/* calender and location  */}
            <div className="w-full flex flex-col px-2">
              <div className="flex gap-2 mx-1 items-center">
                <RiCalendarLine size={20} className="text-zinc-600"/>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 text-nowrap">
                  {parseDateToReadableFormat(postDetails.createdAt)}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <RiMapPin2Line size={28} className="text-zinc-600"/>
                <p className="text-xs text-zinc-600 dark:text-zinc-500">
                  {postDetails.address}
                </p>
              </div>
            </div>
          </div>

          {user && postDetails && user._id === postDetails.userId && !postDetails.isApproved && !postDetails.rejectedBy && (
            <div className="w-full flex flex-col gap-1 px-4 justify-center">
              <div className="flex gap-2 text-orange-600 justify-center py-2 dark:bg-orange-800 font-outfit text-sm dark:text-orange-700 dark:bg-opacity-20 dark:border-orange-950 items-center border bg-orange-50 border-orange-600  p-1 rounded-md">
                <RiLoaderLine size={15} className="animate-spin duration-1000"/>
                <h2>Awaiting Approval</h2>
              </div>

              <div className="p-4 bg-orange-50 my-2 dark:bg-orange-800 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationFill className="text-orange-500 dark:text-orange-700 dark:text-opacity-80 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-orange-600 dark:text-orange-700 dark:text-opacity-80">
                      <p>
                      Your report is currently being reviewed by the admin. Once a decision is made, you will be notified. Thank you for your patience.
                      </p>
                    </div>
              </div>
            </div>
          )}

          {user && postDetails && user._id === postDetails.userId && !postDetails.isApproved && postDetails.rejectedBy && (
            <div className="w-full flex flex-col gap-1 px-4 justify-center">
              <div className="flex gap-2 text-rose-600 justify-center py-2 dark:bg-rose-800 font-outfit text-sm dark:text-rose-700 dark:bg-opacity-20 dark:border-rose-950 items-center border bg-rose-50 border-rose-600  p-1 rounded-md">
                <RiProhibitedLine size={15} />
                <h2>Dismissed</h2>
              </div>

              <div className="p-4 bg-rose-50 my-2 dark:bg-rose-800 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationFill className="text-rose-500 dark:text-rose-700 dark:text-opacity-80 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-rose-600 dark:text-rose-700 dark:text-opacity-80">
                      <p>
                        Your report has been dismissed by the admin and will not be visible on the platform. If you have any concerns, please reach out to support.
                      </p>
                    </div>
              </div>
            </div>
          )}

          {postDetails && postDetails.status === "resolved" && postDetails.isApproved && (
            <div className="w-full flex flex-col gap-1 px-4 justify-center">
              <div className="flex gap-2 text-green-600 justify-center py-2 dark:bg-green-800 font-outfit text-sm dark:text-green-700 dark:bg-opacity-20 dark:border-green-950 items-center border bg-green-50 border-green-600  p-1 rounded-md">
                <RiCheckboxCircleLine size={15} />
                <h2>Resolved</h2>
              </div>

              <div className="p-4 bg-green-50 my-2 dark:bg-green-800 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationFill className="text-green-500 dark:text-green-700 dark:text-opacity-80 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-green-600 dark:text-green-700 dark:text-opacity-80">
                      <p>
                      The reported issue has been resolved by the authorities. More details by Department are available in the Updates tab below.
                      </p>
                    </div>
              </div>
            </div>
          )}


          {postDetails && postDetails.status === "rejected" && postDetails.isApproved && (
              <div className="w-full flex flex-col gap-1 px-4 justify-center">
              <div className="flex gap-2 text-rose-600 justify-center py-2 dark:bg-rose-800 font-outfit text-sm dark:text-rose-700 dark:bg-opacity-20 dark:border-rose-950 items-center border bg-rose-50 border-rose-600  p-1 rounded-md">
                <RiProhibitedLine size={15} />
                <h2>Rejected</h2>
              </div>

              <div className="p-4 bg-rose-50 my-2 dark:bg-rose-800 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationFill className="text-rose-500 dark:text-rose-700 dark:text-opacity-80 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-rose-600 dark:text-rose-700 dark:text-opacity-80">
                      <p>
                        After review, the authorities have decided not to proceed with this report. More details by Department are available in the Updates tab below.
                      </p>
                    </div>
              </div>
            </div>
          )}


          {postDetails && postDetails.status === "pending" && postDetails.isApproved && (
              <div className="w-full flex flex-col gap-1 px-4 justify-center">
              <div className="flex gap-2 text-yellow-500 justify-center py-2 dark:bg-yellow-700 font-outfit text-sm dark:text-yellow-600 dark:bg-opacity-20 dark:border-yellow-950 items-center border bg-yellow-50 border-yellow-500  p-1 rounded-md">
                <RiProgress2Line size={15} />
                <h2>Pending</h2>
              </div>

              <div className="p-4 bg-yellow-50 my-2 dark:bg-yellow-700 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationFill className="text-yellow-500 dark:text-yellow-600 dark:text-opacity-80 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-yellow-500 dark:text-yellow-600 dark:text-opacity-80">
                      <p>
                      This report is currently under review by the authorities. They’re assessing the situation and will take action soon. For updates, check the Updates tab below.
                      </p>
                    </div>
              </div>
            </div>
          )}

          {user && postDetails && user.role === "admin" && !postDetails.isApproved ? (
            <div className="w-full px-4">
              {!postDetails.rejectedBy ? (
                <div className="w-full flex gap-1">
                  <button onClick={handleRejectPost} className={`flex items-center w-1/2 gap-1 py-2 justify-center  dark:bg-red-800 dark:bg-opacity-25 dark:hover:bg-red-500 dark:hover:text-white dark:text-red-500 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white duration-300  rounded-lg`}>
                      Reject
                  </button>
                  <button onClick={handleApprovePost} className={`flex items-center w-1/2 gap-1 py-2 justify-center bg-green-500 dark:bg-green-500 dark:bg-opacity-25 dark:border-green-500 dark:border dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-white text-white  hover:bg-white hover:text-green-500 hover:border hover:border-green-500 duration-300  rounded-lg`}>
                      Approve Report
                  </button>
                </div>
              ): (
                <div className="w-full px-4">
                  <div className={`w-full flex justify-center items-center py-2  bg-red-500 dark:bg-red-800 dark:bg-opacity-25 dark:border-red-500 dark:border dark:text-red-500  text-white  duration-300  rounded-lg`}>
                    Rejected
                  </div>
                </div>
              )}  
            </div>
          ): user && user.role === "admin" ? (
            <div className="w-full px-4">
              <div className="w-full flex justify-center items-center py-2 bg-green-500 dark:bg-green-500 dark:bg-opacity-25 dark:border-green-500 dark:border dark:text-green-500 text-white duration-300 rounded-lg">
                Approved
              </div>
            </div>
          ) : null}

          <PostTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <PostTabDetails triggerUpdate={newDepartmentUpdate} setReloadTrigger={setReloadTrigger} addCommentHandler={addNewComment} postComments={postComments} handleDeleteComment={handleDeleteComment} departmentComments={departmentComments} departmentUpdates={departmentUpdates} activeTab={activeTab} postDetails={postDetails}/>

        </div>
      ) : (
        <div className='w-full h-[calc(100vh-15vh)]  flex items-center justify-center'><RiLoaderLine size={30} className='animate-spin duration-5000'/></div>
      )}
    </>
  );
}

export default Post;
