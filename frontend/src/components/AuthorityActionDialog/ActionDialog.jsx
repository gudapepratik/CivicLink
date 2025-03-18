import { RiCloseLine } from "@remixicon/react";
import React, { useEffect, useState } from "react";

function ActionDialog({triggerUpdate, actionTitle}) {
    const [toOpen, setToOpen] = useState(false);

    const [data, setData] = useState({
      updatedStatus: "",
      remark: "",
      expectedResolutionDate: undefined
    })

    const statusOptions = [
        {
            label: "Pending",
            value: "pending"
        },
        {
            label: "In Progress",
            value: "inprogress"
        },
        {
            label: "Resolved",
            value: "resolved"
        },
        {
            label: "Rejected",
            value: "rejected"
        },
    ]

    const [files, setFiles] = useState([])

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Filter only PDFs
        const pdfFiles = selectedFiles.filter(file => file.type === "application/pdf");

        if (pdfFiles.length === 0) {
            alert("Only PDF files are allowed.");
            return;
        }

        if (files.length + pdfFiles.length > 2) {
            alert("You can upload a maximum of 2 PDFs.");
            return;
        }

        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleFieldInput = (field, value) => {
      setData(prev => ({...prev, [field]: value}))
    }

    useEffect(() => {
        if(toOpen == true) {
            document.body.style.overflowY = 'hidden';
        } else{
            document.body.style.overflowY = 'visible';
        }
    },[toOpen])

  return (
    <>
      <div className="">
        <button onClick={() => setToOpen(prev => !prev)} className="bg-red-100 dark:bg-zinc-800 px-4 py-1 text-red-600 rounded-md">{actionTitle}</button>
        <div
        className={`fixed inset-0 flex items-center z-10 justify-center p-2 bg-black bg-opacity-50 
        transition-opacity duration-300 ${toOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setToOpen(false)}
      >
        {/* Dialog Box */}
        <div
          className={`bg-white flex flex-col gap-1 p-4 rounded-lg shadow-lg w-96 dark:bg-zinc-900 dark:border dark:border-zinc-800 dark:text-white 
          transform transition-all duration-300 ${toOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-5"}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <h2 className="text-center font-bold p-3 text-xl text-zinc-800 dark:text-white">Update Report Status</h2>
            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between p-3 border-b-[1px] border-b-zinc-200 dark:border-b-zinc-700 items-center">
                    <h1 className="text-zinc-500 dark:text-zinc-400">Current Status</h1>
                    <h1 className="w-1/3 text-left">Pending</h1>
                </div>

                <div className="w-full flex justify-between p-3 border-b-[1px] border-b-zinc-300 dark:border-b-zinc-700 items-center">
                    <label htmlFor="updateStatus" className="text-zinc-500 dark:text-zinc-400">Updated Status</label>
                    {/* <h1 className="w-1/3 text-left">pending</h1> */}
                    <select id="updateStatus" defaultValue={"pending"} onChange={(e) => handleFieldInput("updatedStatus", e.target.value)} className="w-1/3 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                        {statusOptions.map((item,key) => (
                            <option key={key} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full flex flex-col items-start p-3 border-b-[1px] border-b-zinc-300 dark:border-b-zinc-700 ">
                    <label htmlFor="remarks" className="text-zinc-500 dark:text-zinc-400">Remarks</label>
                    <textarea id="remarks" onChange={(e) => handleFieldInput("remark", e.target.value)} className="focus:outline-zinc-200 text-zinc-800 w-full p-2 bg-zinc-100 dark:bg-zinc-800 min-h-12 max-h-40" placeholder="Enter remarks"></textarea>
                </div>

                <div className="w-full flex justify-between p-3 border-b-[1px] border-b-zinc-200 dark:border-b-zinc-700 items-center">
                    <label htmlFor="expectedDate" className="text-zinc-500 dark:text-zinc-400">Expected Resolution Date</label>
                    <input type="date" id="expectedDate" onChange={(e) => handleFieldInput("expectedResolutionDate", e.target.valueAsDate)} className="bg-zinc-100 dark:bg-zinc-800 p-2" />
                </div>

                <div className="w-full flex flex-col items-start p-3  dark:border-b-zinc-700 ">
                    <label htmlFor="attachments" className="text-zinc-500 dark:text-zinc-400">Attachments <span className="text-xs">(optional)</span></label>
                    {/* <h1 className="w-1/3 text-left">pending</h1> */}
                    <input type="file" accept="application/pdf" multiple onChange={handleFileChange} id="attachments" className="hidden"/>
                    <label htmlFor="attachments"  className="w-full text-center p-4 bg-zinc-100 rounded-lg text-zinc-800">Upload documents (pdf)</label>
                    {files.length > 0 && (
                <div className="mt-2 w-full">
                    {files.map((file, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-zinc-200 rounded-md mt-1">
                            <span className="text-sm text-zinc-800">{file.name}</span>
                            <button onClick={() => removeFile(index)} className="text-zinc-400 text-sm font-bold">
                                <RiCloseLine/>
                            </button>
                        </div>
                    ))}
                </div>
            )}  
                </div>
            </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setToOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-md dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                triggerUpdate({...data, docs: files})
                setToOpen(false);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default ActionDialog;