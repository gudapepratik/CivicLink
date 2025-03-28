import departmentService  from '@/api/services/department.services'
import { NotResultImg1 } from '@/assets/assets.config'
import DepartmentList from '@/components/DepartmentComponents/DepartmentList'
import DepartmentSearchbar from '@/components/DepartmentComponents/DepartmentSearchbar'
import Error from '@/components/Error/Error'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import React, { useEffect, useState } from 'react'

function DepartmentTab() {
  const [departments, setDepartments] = useState([])
  const [departmentsCopy, setDepartmentsCopy] = useState([])

    useEffect(() => {
      fetchDepartments()
    },[])

    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getDepartments()
  
        setDepartments(response.data.data)
        setDepartmentsCopy(response.data.data)
      } catch (error) {
        ToasterNotification({
          type: "warning",
          description: "Error Occurred while fetching departments"
        })
      }
    }

  return (
    <>
      <div className='w-full p-3 font-outfit gap-4 mb-2 flex flex-col'>
        {/* heading  */}
        <div className='w-full flex-col flex gap-1'>
          <h1 className='text-2xl text-zinc-800 dark:text-white font-bold'>Departments</h1>
          <h2 className='text-base text-zinc-500 dark:text-zinc-400'>Find the right department for your concerns</h2>
        </div>

        {/* Search bar  */}
        <DepartmentSearchbar departmentsCopy={departmentsCopy} setDepartments={setDepartments}/>

        {/* Department Listing  */}
        {departments && departments.length > 0 && (
          <DepartmentList departments={departments}/>
        )}
        {departments && departments.length === 0 && (
          <Error 
            image={NotResultImg1} 
            hoffset={300}
            title={"No Departments Available !"} 
            message={"There are no departments available for this query at the moment."} 
          />
        )}
      </div>
    </>
  )
}

export default DepartmentTab