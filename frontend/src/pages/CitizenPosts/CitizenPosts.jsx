import PostService from '@/api/services/post.services'
import { NotLoginImg1, NotResultImg1 } from '@/assets/assets.config'
import Error from '@/components/Error/Error'
import Loader from '@/components/Loader/Loader'
import PostCard from '@/components/Post/PostCard'
import SearchBar from '@/components/SearchBar/SearchBar'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function CitizenPosts() {
    const user = useSelector(state => state.authSlice.user) 
    const [posts,setPosts] = useState(null)
    const [statusFilter, setStatusFilter] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const statusFilterOptions = [
        {
            title: "Pending",
            value: "pending"
        },
        {
            title: "In Progress",
            value: "inprogress"
        },
        {
            title: "Resolved",
            value: "resolved"
        },
        {
            title: "Rejected",
            value: "rejected"
        },
    ]

    const fetchUserPosts = async () => {
        try {
            setIsLoading(true)
            const response = await PostService.getPostsByUser({filter: statusFilter});
            // console.log(response)
            setPosts(response.data.data)
        } catch (error) {
            ToasterNotification({
                type: "warning",
                title: "Error Occurred",
                message: `${error.message}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(user) {
            fetchUserPosts()
        }
    },[statusFilter])

    const [status, setStatus] = useState()
    const [viewType, setViewType] = useState()
    const [filterData, setFilterData] = useState()
    const [trigger, setTrigger] = useState()

  return (
    <>
        {isLoading && <Loader/>}
        {!user ?
            <Error image={NotLoginImg1} hoffset={100} title={'User Not Logged in'} message={"Log in to your account to Create a post"}/>
        :
        <div className='w-full h-[calc(100vh-80px)] flex flex-col gap-2 p-2'>
            {/* filter section  */}
            {/* <div className='w-full min-h-12 flex items-center p-2 bg-zinc-100 border shadow-inner dark:bg-zinc-900 rounded-lg'>
                <div className='w-full flex font-outfit items-center gap-2'>
                    <label htmlFor="status" className=''>Status</label> 
                    <select id="status" className='rounded-lg p-1 dark:bg-zinc-700' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {statusFilterOptions.map((filter, index) => (
                            <option key={index} value={filter.value}>{filter.title}</option>
                        ))}
                    </select>   
                </div>
            </div> */}
            <SearchBar status={status} filterData={filterData} setFilterData={setFilterData} setStatus={setStatus} viewType={viewType} setViewType={setViewType}/>
            {posts && posts.length === 0 ? 
                <div className='w-full flex flex-col gap-2'>
                <Error image={NotResultImg1} title={"No Results"} message={"Sorry, we couldn’t find any results matching your query."}/>
                </div>
            :
                <div className='w-full flex flex-col gap-2'>
                    {posts && (
                        posts.map((post,index) => (
                            <PostCard key={index} postDetails={post}   />
                        ))
                    )}
                </div>
            }

        </div>
        }
    </>
  )
}

export default CitizenPosts