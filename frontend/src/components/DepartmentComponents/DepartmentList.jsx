import React, { useEffect, useState } from 'react'
import DepartmentCard from './DepartmentCard'
import departmentService  from '@/api/services/department.services'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { RiLoaderLine } from '@remixicon/react'
import DepartmentCardSkeleton from './DepartmentCardSkeleton'

function DepartmentList({departments}) {
  return (
    <div className='w-full flex flex-col  gap-4 justify-center'>
        {departments && departments.map((list, index) => (
            <DepartmentCard key={list?._id} departmentDetails={list}/>
        ))}
        {!departments && 
        <>
          <DepartmentCardSkeleton/>
          <DepartmentCardSkeleton/>
          <DepartmentCardSkeleton/>
          <DepartmentCardSkeleton/>
        </>
        }
    </div>
  )
}

export default DepartmentList