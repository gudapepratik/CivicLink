import React, { useEffect, useState } from "react";

function Dialog({ ToDelete, actionTitle, title, message }) {
  const [toOpen, setToOpen] = useState(false);

  useEffect(() => {
    if (toOpen == true) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [toOpen]);

  
  return (
    <>
      <div className="">
        <button
          onClick={() => setToOpen((prev) => !prev)}
          className="bg-red-100 dark:bg-zinc-800 px-4 py-1 text-red-600 rounded-md"
        >
          {actionTitle}
        </button>

        <div
          className={`fixed inset-0 flex items-center z-10 justify-center p-2 bg-black bg-opacity-50 
        transition-opacity duration-300 ${
          toOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
          onClick={() => setToOpen(false)}
        >
          {/* Dialog Box */}
          <div
            className={`bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-zinc-900 dark:border dark:border-zinc-800 dark:text-white 
          transform transition-all duration-300 ${
            toOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-5"
          }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-lg font-semibold text-red-500">{title}</h2>
            <p className="text-gray-600 dark:text-inherit mt-2">{message}</p>

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
                  ToDelete();
                  setToOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dialog;
