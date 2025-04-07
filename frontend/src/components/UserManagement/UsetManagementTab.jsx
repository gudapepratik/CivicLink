import React from "react";

function UsetManagementTab({ tabs, activeTab, setActiveTab }) {
  return (
    <>
      <div className="grid grid-cols-2 rounded-lg bg-gray-100 dark:bg-zinc-800 p-1">
        <button
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "bg-white text-zinc-800 shadow-sm"
              : "text-gray-500 dark:text-white hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approval
        </button>
        <button
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-zinc-800 shadow-sm"
              : "text-gray-500 dark:text-white hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </button>
      </div>
    </>
  );
}

export default UsetManagementTab;
