import { electricityDeptimg } from '@/assets/assets.config'
import { RiArrowRightLine, RiArrowRightSLine, RiTreeFill } from '@remixicon/react'
import React from 'react'
import { useNavigate } from 'react-router'

function DepartmentDetailsCard({departmentDetails}) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/departments/${departmentDetails._id}`)
  }

  return (
    <button
      className="w-full flex flex-col rounded-xl border bg-card  shadow-sm hover:bg-accent/50 transition-colors overflow-hidden"
      onClick={handleNavigate}
    >
      {/* Card Image */}
      <div className="relative w-full  h-32">
        <img
          src={departmentDetails.heroImage}
          alt={departmentDetails.name}
          className="object-cover -top-28 "
        />
        <div className="absolute top-3 left-3">
          <p className='text-xs bg-zinc-50 dark:bg-zinc-800 px-2 text-zinc-700 dark:text-zinc-400 rounded-full'>{departmentDetails.category}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16" />
      </div>

      {/* Card Content */}
      <div className="p-4 flex gap-3 bg-white dark:bg-zinc-900 z-20 items-start">
        <div className="h-8 w-8">
        <img src={departmentDetails.logo} alt="" className='object-contain'/>
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{departmentDetails.name}</h3>
            <RiArrowRightSLine className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{departmentDetails.shortDescription}</p>
        </div>
      </div>
    </button>
  )
}

export default DepartmentDetailsCard