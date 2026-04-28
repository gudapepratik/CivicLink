import React, { useEffect, useRef, useState } from 'react'
import Tooltip from '../MenuList/MenuList'
import { RiAddLine, RiCalendar2Line, RiDownloadLine, RiEdit2Line, RiFileFill } from '@remixicon/react'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { useSelector } from 'react-redux'
import { parseDateToReadableFormat } from '@/utils/DateParsers/DateParser'
import { useNavigate } from 'react-router'
import StatusButton from '../StatusButtons/StatusButton'

function DepartmentUpdate({onDeleteComment, updateDetails, setReloadTrigger}) {
    // // console.log("asf")
  const user = useSelector(state => state.authSlice.user)

  const [fileDetails, setFileDetails] = useState([])

  const editCommentHandler =async () => {
    // console.log("editing")
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


    useEffect(() => {
      let isActive = true

      const getFileDetails = async () => {
        if (!updateDetails?.docs?.length) {
          if (isActive) {
            setFileDetails([])
          }
          return
        }

        const fileData = await Promise.all(
          updateDetails.docs.map(async (doc) => {
            const response = await fetch(doc.publicUrl, { method: "HEAD" });

            if (!response.ok) {
              console.error("Error fetching file details:", response.statusText);
              return null;
            }
                    
            const fileSize = response.headers.get("content-length");
            const fileName = doc.publicUrl.split("/").pop() || "";

            return {
              url: doc.publicUrl,
              fileName,
              fileSize: fileSize ? (fileSize / 1024).toFixed(2) + " KB" : "Unknown"
            }
          })
        )

        if (isActive) {
          setFileDetails(fileData.filter(Boolean))
        }
      }

      getFileDetails()

      return () => {
        isActive = false
      }
    }, [updateDetails?.docs])

    const navigate = useNavigate()
    const downloadPdf = (fileData) => {
        window.location.href = `${fileData.url}`
    }
  

  return (
    <div  className={`w-full flex flex-col gap-3 items-end border  dark:bg-zinc-900 rounded-lg`}>
        {/* user details  */}
            <div className={`w-full flex items-center justify-between rounded-t-lg pb-4 p-3 ${updateDetails.updatedStatus === "inprogress" && "dark:bg-orange-400 bg-orange-100 dark:bg-opacity-30 text-white"} ${updateDetails.updatedStatus === "resolved" && "dark:bg-green-400 bg-green-100 dark:bg-opacity-30 text-white"} ${updateDetails.updatedStatus === "rejected" && "dark:bg-red-400 bg-red-100 dark:bg-opacity-30 text-white"}`}>
            {/* avatar  */}
            <div className="w-full flex gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full">
                <img
                src={updateDetails.userDetails[0].avatar.publicUrl}
                alt=""
                className="object-contain"
                />
            </div>

            <div className='flex justify-between w-[calc(100%-10%)]'>
              <div className="h-8 flex items-start flex-col">
                  <h2 className="font-semibold text-xs text-zinc-800 dark:text-white">
                  {updateDetails.userDetails[0].name}
                  </h2>
                  <h3 className="text-xs text-zinc-500 dark:text-zinc-400">
                  {updateDetails.userDetails[0].email}
                  </h3>
              </div>

              <div  className="flex items-center scale-75">
                <StatusButton status={updateDetails.updatedStatus} isApproved={true}/>
            </div>
            </div>
            </div>
        </div>

        {/* Comment form  */}
      <h3 className='w-full text-[16px] px-3 leading-5 dark:text-zinc-300'>
        {updateDetails.remark}  
      </h3>

      {/* expectedResolutionDate  */}
      <div className='w-full flex flex-col px-3'>
        <h3 className='w-full text-zinc-500 text-sm dark:text-zinc-300'>
          {parseDateToReadableFormat(updateDetails.createdAt)}  
        </h3>
        <div className='w-full flex gap-2 items-center text-zinc-500 text-sm   dark:text-zinc-300'>
              <RiCalendar2Line size={18}/>
              <h3>Expected Resolution: {parseDateToReadableFormat(updateDetails.expectedResolutionDate)}</h3>
        </div>
      </div>

      <div className='w-full flex flex-col gap-1 text-sm justify-start px-3 pb-3 dark:text-zinc-300'>
            <h2 className='text-zinc-500'>Attachments</h2>
            <div className='w-full flex flex-col justify-center gap-2'>
                {fileDetails.map((file,index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                            <RiFileFill className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.fileName}</span>
                            <span className="text-xs text-muted-foreground">({file.fileSize})</span>
                        </div>
                        <RiDownloadLine size={18} onClick={() => downloadPdf(file)}/>
                  </div>
                ))}
            </div>
      </div>
    </div>
  );
}

export default DepartmentUpdate