import { RiAddLine, RiAlertLine, RiExternalLinkLine, RiMailFill, RiMailLine, RiMapPinLine, RiMessage2Line, RiPhoneFill, RiPhoneLine, RiTimeLine } from '@remixicon/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import DepartmentUpdate from '../DepartmentUpdate/DepartmentUpdate';
import Comment from '../Comment/Comment';
import { useSelector } from 'react-redux';
import MakeComment from '../Comment/MakeComment';
import GoogleMapsViewLocation from '../GoogleMap/GoogleMapsViewLocation';
import ActionDialog from '../AuthorityActionDialog/ActionDialog';


function PostTabDetails({postDetails, activeTab,newDepartmentUpdate, departmentComments, departmentUpdates,triggerUpdate, postComments, handleDeleteComment, setReloadTrigger, addCommentHandler}) {
    const [expandDesc, setExpandDesc] = useState(false)
    const user = useSelector(state => state.authSlice.user)
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  return (
    <>
        {/* Overview Tab */}
        {activeTab === "Details" && 
            <div className='w-full font-outfit duration-300 p-5 mb-2 flex flex-col gap-5'>
                {/* description  */}
                <div className="w-full flex flex-col gap-2 items-start">
                <h2 className='text-zinc-800 dark:text-white text-[18px] font-[600]'>Description</h2>
                    <h2 className={`text-zinc-800 dark:text-zinc-500 ${!expandDesc ? "h-40" : ""}  overflow-hidden leading-5`}>
                    {postDetails.description || "No description available"}
                    </h2>
                    {!expandDesc && <button className="dark:text-zinc-400" onClick={() => setExpandDesc(true)}>...read more</button>}
                    {expandDesc && <button className="dark:text-zinc-400" onClick={() => setExpandDesc(false)}>...read less</button>}
                </div>

                {/* Reported by */}
                <div className='flex flex-col gap-2 items-start hover:shadow-sm'>
                    <h2 className='text-zinc-800 dark:text-white text-[18px] font-[600]'>Reported By</h2>  
                    <div className="w-full flex gap-2 border dark:border-zinc-700 dark:bg-zinc-900  items-center justify-between rounded-lg p-4">
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
                </div>

                {/* Department Details  */}
                <div className='flex flex-col gap-2 items-start hover:shadow-sm'>
                    <h2 className='text-zinc-800 dark:text-white text-[18px] font-[600]'>Department</h2>  
                    <div className="w-full flex gap-5 border dark:border-zinc-700 dark:bg-zinc-900 flex-col  items-center justify-between rounded-lg p-4">
                        {/* avatar  */}
                        <div className="w-full flex gap-5">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                                <img
                                    src={postDetails.departmentDetails[0].logo}
                                    alt=""
                                    className="object-contain"
                                />
                            </div>
                            <div className="h-12 flex items-start flex-col">
                                <h2 className="font-semibold text-zinc-800 dark:text-white">
                                {postDetails.departmentDetails[0].name}
                                </h2>
                                <h3 className="text-xs text-zinc-500">
                                {postDetails.departmentDetails[0].category}
                                </h3>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <h3 className=' text-zinc-500'>{postDetails.departmentDetails[0].shortDescription}</h3>
                            <a href={`/departments/${postDetails?.departmentId}`}  target='_blank' rel="noopener noreferrer" className='w-full flex items-center justify-center gap-3 bg-white rounded-lg py-3 text-sm text-zinc-800 border border-zinc-700 dark:bg-zinc-800 dark:text-white hover:bg-zinc-800 hover:text-white duration-300'>
                                <p>View Department</p>
                                <RiExternalLinkLine size={20}/> 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        }

        {/* Updates Tab */}
        {activeTab === "Updates" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-[18px] font-[600]'>Department Updates</h2>
                    {user && postDetails.departmentId == user?.departmentId && (postDetails.status !== "resolved" && postDetails.status !== "rejected") && (
                        <>
                        <button onClick={() => setOpenUpdateDialog(prev => !prev)} className='w-full flex items-center justify-center gap-3 bg-white rounded-lg py-3 text-sm text-zinc-800 border border-zinc-400 hover:bg-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-white dark:hover:text-zinc-800 hover:text-white duration-300'>
                            <RiAddLine size={20}/> 
                            <p>Add Department Update</p>
                        </button>
                        <ActionDialog triggerUpdate={triggerUpdate} open={openUpdateDialog} setOpen={setOpenUpdateDialog}/>
                        </>
                    )}
                {departmentUpdates.length !== 0 || departmentComments.length !== 0 ? (
                    <div className="w-full flex flex-col gap-2">
                        {departmentUpdates.length !== 0 &&
                        departmentUpdates.map((update, index) => (
                            <DepartmentUpdate
                            key={index}
                            updateDetails={update}
                            setReloadTrigger={setReloadTrigger}
                            />
                        ))}
                        {departmentComments.length !== 0 &&
                        departmentComments.map((comment, index) => (
                            <Comment
                            key={index}
                            commentDetails={comment}
                            onDeleteComment={() => handleDeleteComment(comment)}
                            isAuthorityComment={true}
                            setReloadTrigger={setReloadTrigger}
                            />
                        ))}
                    </div>
                ): (
                    <div className="w-full flex flex-col gap-2">
                        <h4 className="text-sm text-zinc-500">No Updates</h4>
                    </div>
                )}
            </div>
        }

        {/* Report Tab */}
        {activeTab === "Comments" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-[18px] font-[600]'>Comments</h2>
                <MakeComment
                    postDetails={postDetails}
                    setReloadTrigger={setReloadTrigger}
                    addCommentHandler = {addCommentHandler}
                />
                {postComments ? (
                <div className="w-full flex flex-col gap-2">
                    {postComments.map((comment, index) => (
                    <Comment
                        key={index}
                        commentDetails={comment}
                        isAuthorityComment={false}
                        onDeleteComment={() => handleDeleteComment(comment)}
                        setReloadTrigger={setReloadTrigger}
                    />
                    ))}
                </div>
                ) : (
                <div className="w-full flex flex-col gap-2">
                    <h4>No Updates</h4>
                </div>
                )}
            </div>
        }

        {/* Location Tab */}
        {activeTab === "Location" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-lg font-[600]'>Report Location</h2>
                <div className='flex w-full justify-start items-center gap-3'>
                    <RiMapPinLine size={20} className='text-zinc-500'/>
                    <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{postDetails.address}</p>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <GoogleMapsViewLocation latitude={postDetails.location.coordinates[0]} longitude={postDetails.location.coordinates[1]}/>
                </div>
                <a href={`https://www.google.com/maps?q=${postDetails.location.coordinates[0]},${postDetails.location.coordinates[1]}`}  target='_blank' rel="noopener noreferrer" className='w-full flex items-center justify-center gap-3 bg-zinc-800 rounded-lg py-3 text-sm text-white border-none'>
                    <p>Open in Google Maps</p>
                    <RiExternalLinkLine size={20}/> 
                </a>
            </div>
        }
    
    </>
  )
}

export default PostTabDetails