import { RiExternalLinkLine } from "@remixicon/react";
import React from "react";

function ReportSuccess() {
  return (
    <div className="text-center w-full p-8 flex flex-col font-outfit h-screen absolute -top-8  justify-center items-center">
      <div className="m flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
        <svg
          className="h-6 w-6 text-green-600 dark:text-green-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
        Report Submitted Successfully!
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Your report has been sent to the admins for review. You will receive a
        notification once it's approved.
      </p>
      <div className="mt-6">
      <a href={"/user-posts"}  target='_self' rel="noopener noreferrer" className='w-full flex items-center justify-center gap-3 bg-blue-800 dark:bg-blue-700 dark:bg-opacity-45 rounded-lg py-3 px-3 text-sm text-white border-none'>
        <p>View your reports</p>
        <RiExternalLinkLine size={18}/> 
    </a>
      </div>
    </div>
  );
}

export default ReportSuccess;
