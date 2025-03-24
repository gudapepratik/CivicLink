import { RiAlertLine, RiExternalLinkLine, RiMailFill, RiMailLine, RiMapPinLine, RiMessage2Line, RiPhoneFill, RiPhoneLine, RiTimeLine } from '@remixicon/react'
import React from 'react'
import GoogleMapComponent from '../GoogleMap/GoogleMapComponent'
import GoogleMapsViewLocation from '../GoogleMap/GoogleMapsViewLocation';
import { useNavigate } from 'react-router';

function DepartmentTabDetails({department, activeTab}) {

    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent("Bajirao Road, Shaniwar Peth, Pune, Maharashtra 411030, India")}`;
  return (
    <>
        {/* Overview Tab */}
        {activeTab === "Overview" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                {/* Description  */}
                <div className='w-full flex gap-1 justify-start flex-col'>
                    <h2 className='text-zinc-800 dark:text-white text-lg font-[600]'>About</h2>
                    <p className='text-zinc-500 dark:text-zinc-400 text-sm font-[300]'>{department.description}</p>
                </div>

                {/* Mission  */}
                <div className='w-full flex gap-1 justify-start flex-col'>
                    <h2 className='text-zinc-800 dark:text-white text-[16px] font-[600]'>Mission</h2>
                    <p className='text-zinc-500 dark:text-zinc-400 text-sm font-[300]'>{department.mission}</p>
                </div>

                {/* Responsibilities  */}
                <div className='w-full flex gap-1 justify-start flex-col'>
                    <h2 className='text-zinc-800 dark:text-white text-[16px] font-[600]'>Key Responsibilities</h2>
                    <ul className='list-disc px-4'>
                        {department.responsibilities && department.responsibilities.map((item,index) => (
                            <li key={index} className='text-zinc-500 dark:text-zinc-400 text-sm font-[300]'>{item}</li>
                        ))}
                    </ul>
                </div>
                {/* seperator  */}
                <div className='w-full px-3 h-2 border-b border-zinc-200'></div>
                
                {/* contact info  */}
                <div className='w-full flex gap-1 justify-start flex-col'>
                    <h2 className='text-zinc-800 dark:text-white text-[16px] font-[600]'>Contact Information</h2>
                    <div className='w-full flex flex-col gap-2'>
                        <div className='flex w-full justify-start items-center gap-3'>
                            <RiPhoneLine size={20} className='text-zinc-500'/>
                            <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{department.phone}</p>
                        </div>
                        <div className='flex w-full justify-start items-center gap-3'>
                            <RiMailLine size={20} className='text-zinc-500'/>
                            <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{department.email}</p>
                        </div>
                        <div className='flex w-full justify-start items-center gap-3'>
                            <RiTimeLine size={20} className='text-zinc-500'/>
                            <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{department.hours}</p>
                        </div>
                        <div className='flex w-full justify-start items-center gap-3'>
                            <RiMapPinLine size={20} className='text-zinc-500'/>
                            <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{department.phone}</p>
                        </div>
                    </div>
                </div>

                {/* seperator  */}
                <div className='w-full px-3 h-2 border-b border-zinc-200'></div>

                {/* FAQ section  */}
                <div className='w-full flex gap-2 justify-start flex-col'>
                    <h2 className='text-zinc-800 dark:text-white text-[16px] font-[600]'>Frequently asked questions</h2>
                    {department.faqs && department.faqs.map((item, index) => (
                        <div key={index} className='w-full flex flex-col '>
                            <h3 className='text-zinc-800 dark:text-zinc-300 text-[14px] font-[600]'>{item.question}</h3>
                            <h3 className='text-zinc-500 dark:text-zinc-400 text-sm font-[300]'>{item.answer}</h3>
                        </div>
                    ))}
                </div>
            </div>
        }

        {/* Services Tab */}
        {activeTab === "Services" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-lg font-[600]'>Services Provided</h2>
                <div className='w-full flex flex-col gap-2'>
                    {department.services && department.services.map((item, index) => (
                        <div key={index} className='w-full border border-zinc-300 border-zinc-600 rounded-lg p-3 flex flex-col gap-2 justify-start'>
                            <h2 className='text-zinc-800 dark:text-white text-[16px] font-[600]'>{item.name}</h2>
                            <h2 className='text-zinc-500 dark:text-zinc-400 text-[14px] font-[300]'>{item.description}</h2>
                            <div className='w-full'>
                                <h2 className='text-zinc-800 dark:text-white text-[15px] font-[600]'>Includes:</h2>
                                <ul className='list-disc px-4'>
                                    {item.details && item.details.map((detail,index) => (
                                        <li key={index} className='text-zinc-500 dark:text-zinc-400 text-[14px] font-[300]'>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        }

        {/* Report Tab */}
        {activeTab === "Report" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-lg font-[600]'>Report Issues</h2>
                <h2 className='w-[80%] text-zinc-500 dark:text-zinc-400 text-[14px] font-[300]'>The following issues can be reported to this department:</h2>
                <div className='w-full flex flex-col gap-2'>
                    {department.commonIssues && department.commonIssues.map((item, index) => (
                        <div key={index} className='w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-4 flex gap-4 items-start'>
                            <div className='min-w-10 flex items-center justify-center'>
                                <RiAlertLine size={28} className='text-orange-500'/>
                            </div>
                            <div className='w-fit flex flex-col'>
                                <h2 className='text-zinc-800 dark:text-white text-[14px] font-[600]'>{item.title}</h2>
                                <h2 className='text-zinc-500 dark:text-zinc-400 text-[14px] font-[300]'>{item.description}</h2>
                            </div>
                        </div>
                    ))}
                </div>
                <a href='/new-post' className='w-full flex items-center justify-center gap-3 bg-zinc-800 rounded-lg py-3 text-sm text-white border-none'>
                    <RiMessage2Line size={20}/> 
                    <p>Report an Issue Now</p>
                </a>
            </div>
        }

        {/* Location Tab */}
        {activeTab === "Location" && 
            <div className='w-full font-outfit duration-300 p-3 mb-2 flex flex-col gap-3'>
                <h2 className='text-zinc-800 dark:text-white text-lg font-[600]'>Department Location</h2>
                <div className='flex w-full justify-start items-center gap-3'>
                    <RiMapPinLine size={20} className='text-zinc-500'/>
                    <p className='text-zinc-700 dark:text-zinc-400 text-sm font-[300]'>{department.address}</p>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <GoogleMapsViewLocation/>
                </div>
                <a href={googleMapsUrl}  target='_blank' rel="noopener noreferrer" className='w-full flex items-center justify-center gap-3 bg-zinc-800 rounded-lg py-3 text-sm text-white border-none'>
                    <p>Open in Google Maps</p>
                    <RiExternalLinkLine size={20}/> 
                </a>
            </div>
        }
    
    </>
  )
}

export default DepartmentTabDetails