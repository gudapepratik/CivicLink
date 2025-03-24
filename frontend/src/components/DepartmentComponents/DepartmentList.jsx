import React, { useEffect, useState } from 'react'
import DepartmentCard from './DepartmentCard'
import departmentService  from '@/api/services/department.services'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { RiLoaderLine } from '@remixicon/react'

function DepartmentList({departments}) {
  return (
    <div className='w-full flex flex-col  gap-4 justify-center'>
        {departments && departments.map((list, index) => (
            <DepartmentCard key={index} departmentDetails={list}/>
        ))}
        {!departments && 
          <div className='w-full h-[calc(100% - 80%)] flex items-center justify-center'>
            <RiLoaderLine className='animate-spin duration-200'/>
          </div>
        }
    </div>
  )
}

export default DepartmentList