import React from 'react'

function DepartmentTabs({tabs, activeTab,setActiveTab}) {
    
  return (
    <>
        <div className='w-full px-3 py-4 flex border-y border-zinc-300 dark:border-zinc-600 justify-between bg-zinc-200 dark:bg-zinc-900'>
            {tabs.map((tab,index) => (
                <button key={index} onClick={() => setActiveTab(tab)} className={`font-outfit text-zinc-800  text-sm text-[400] transition-all px-2 py-1 duration-300 ${activeTab === tab ? "bg-zinc-50 rounded-md dark:text-white dark:bg-zinc-950" : "dark:text-zinc-400"}`}>{tab}</button>
            ))}
        </div>
    </>
  )
}

export default DepartmentTabs