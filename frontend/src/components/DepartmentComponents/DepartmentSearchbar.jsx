import { RiFilterLine, RiSearchLine } from '@remixicon/react'
import React, { useState } from 'react'

function DepartmentSearchbar({departmentsCopy, setDepartments}) {
    const [query, setQuery] = useState("")

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setDepartments(prev => {
            return departmentsCopy.filter((item) => 
                item.name.toLowerCase().includes(query.toLowerCase()) || 
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.shortDescription.toLowerCase().includes(query.toLowerCase()) 
            )
        })
    }

    const handleSearchInput = (e) => {
        setQuery(e.target.value)
        setDepartments(prev => {
            return departmentsCopy.filter((item) => 
                item.name.toLowerCase().includes(query.toLowerCase()) || 
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.shortDescription.toLowerCase().includes(query.toLowerCase()) 
            )
        })
    }
  return (
    <>
        <div className="w-full relative font-outfit  bg-white dark:bg-zinc-800 rounded-lg flex items-center gap-3 ">
        <form onSubmit={handleSearchSubmit} className="flex items-center  w-full border dark:border-zinc-700 rounded-lg dark:bg-zinc-800">
            <div className="w-full">
            <input
                type="text"
                id="searh"
                value={query}
                list="search"
                autoComplete="billing street-address"
                className=" dark:bg-zinc-800 rounded-l-lg placeholder:dark:text-zinc-400 focus:outline-none p-2"
                placeholder="Search departments..."
                onChange={(e) => handleSearchInput(e)}
            />
            </div>
            <button 
            className="w-12 bg-zinc-100 dark:bg-zinc-700 p-2 flex items-center justify-center rounded-r-lg"
            type="submit"
            >
            <RiSearchLine className=""/>
            </button>
        </form>

        {/* <div className="p-2 rounded-lg border">
            <RiFilterLine size={23}/>
        </div> */}
        
        
        {/* <Filter status={status} setStatus={setStatus} showFilter={showFilter} trigger={trigger} setShowFilter={setShowFilter}/> */}
    </div>
    </>
  )
}

export default DepartmentSearchbar