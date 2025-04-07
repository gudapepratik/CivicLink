import React, { useEffect, useState } from 'react'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { RiLoaderLine } from '@remixicon/react'
// import DepartmentCardSkeleton from './DepartmentCardSkeleton'
import UserManagementCard from './UserManagementCard'

function UserManagementTabUserList({users, onClick}) {

  return (
    <div className='w-full flex flex-col  gap-2 justify-center'>
        {users && users.map((list, index) => (
            <UserManagementCard key={list?._id} user={list} onClick={onClick}/>
        ))}
        {!users && 
            <>
                {/* <DepartmentCardSkeleton/>
                <DepartmentCardSkeleton/>
                <DepartmentCardSkeleton/>
                <DepartmentCardSkeleton/> */}
            </>
        }
    </div>
  )
}

export default UserManagementTabUserList