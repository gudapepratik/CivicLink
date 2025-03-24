import  departmentService  from '@/api/services/department.services'
import { electricityDeptimg } from '@/assets/assets.config'
import Button_Border from '@/components/CustomButtons/Button_border'
import Button_Fill from '@/components/CustomButtons/Button_Fill'
import DepartmentTabDetails from '@/components/DepartmentComponents/DepartmentTabDetails'
import DepartmentTabs from '@/components/DepartmentComponents/DepartmentTabs'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import { RiLoaderLine, RiMailLine, RiMessage2Line } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'

function DepartmentPage() {
    const {id} = useParams()
    const [department, setDepartment] = useState(null)
    const tabs = ["Overview", "Services", "Report","Location"]
    const [activeTab, setActiveTab] = useState("Overview")

    useEffect(() => {
        fetchDepartment()
    },[])

    const fetchDepartment = async () => {
        try {
            const response = await departmentService.getDepartmentById(id)
            setDepartment(response.data.data)
        } catch (error) {
            ToasterNotification({
                type: "warning",
                description: "An Error Occurred while fethcing department details"
            })
        }
    }

  return (
    <>
        {!department &&
        <div className='w-full h-[calc(100vh-15vh)]  flex items-center justify-center'><RiLoaderLine size={30} className='animate-spin duration-5000'/></div>
        }
        {department && 
            <div className='w-full flex gap-2  flex-col'>
                {/* image section  */}
                <div className="relative h-56 w-full overflow-hidden">
                    <img src={department.heroImage} alt={department.name} className='object-cover -top-12 relative'/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <div className="flex items-center gap-2 mb-2">
                        <p className='text-xs bg-zinc-50 dark:bg-zinc-800 px-2 text-zinc-700 dark:text-zinc-400 rounded-full'>{department.category}</p>
                        </div>
                        <h1 className="text-xl font-bold text-white">{department.name}</h1>
                        <p className="text-sm text-white/80">{department.shortDescription}</p>
                    </div>
                </div>

                {/* Action Buttons  */}
                <div className='w-full p-3 flex items-center justify-evenly'>
                    <a className='px-6 flex items-center gap-3 justify-between dark:border-zinc-100 border-zinc-800 rounded-lg py-3 text-sm dark:text-white text-zinc-800 border'>
                        <RiMailLine size={18}/> 
                        <p>Email</p>
                    </a>
                    <a href='/new-post' className='px-6 flex items-center gap-3 justify-between bg-zinc-800 rounded-lg py-3 text-sm text-white border-none'>
                        <RiMessage2Line size={20}/> 
                        <p>Report</p>
                    </a>
                </div>

                {/* Tabs section  */}
                <DepartmentTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>

                {/* tab section  */}
                <DepartmentTabDetails activeTab={activeTab} department={department}/>
            </div>
        }
    </>
  )
}

export default DepartmentPage