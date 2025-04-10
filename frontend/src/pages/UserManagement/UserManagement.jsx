import  AuthService  from '@/api/services/auth.services'
import { NotResultImg1 } from '@/assets/assets.config'
import Error from '@/components/Error/Error'
import PostTabs from '@/components/Post/PostTabs'
import UserDetailsModal from '@/components/UserManagement/UserDetailsModal'
import UserManagementSearchBar from '@/components/UserManagement/UserManagementSearchBar'
import UserManagementTabUserList from '@/components/UserManagement/UserManagementTabUserList'
import UsetManagementTab from '@/components/UserManagement/UsetManagementTab'
import { ToasterNotification } from '@/utils/ToastNotification/ToastNotification'
import React, { useEffect, useState } from 'react'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [userCopy, setUsersCopy] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
//   const tabs = ["Pending Approval", "All Users"]

    const handleUserClick = (user) => {
      setSelectedUser(user)
      setIsModalOpen(true)
    }

    useEffect(() => {
      fetchUsers()
    },[activeTab])

    const fetchUsers = async () => {
      try {
        const response = await AuthService.getUsers({
            getAllUsers: activeTab === "pending" ? false : true
        })
        // console.log(response)
  
        setUsers(response)
        setUsersCopy(response)
      } catch (error) {
        // console.log(error)
        ToasterNotification({
          type: "warning",
          description: "Error Occurred while fetching users"
        })
      }
    }

  return (
    <>
      <div className='w-full p-3 font-outfit gap-4 mb-2 flex flex-col'>
        {/* heading  */}
        {/* <div className='w-full flex-col flex gap-1'>
          <h1 className='text-2xl text-zinc-800 dark:text-white font-bold'>users</h1>
          <h2 className='text-base text-zinc-500 dark:text-zinc-400'>Find the right department for your concerns</h2>
        </div> */}

        {/* Search bar  */}
        <UserManagementSearchBar userCopy={userCopy} setUsers={setUsers}/>

        <UsetManagementTab  activeTab={activeTab} setActiveTab={setActiveTab}/>

        {/* Department Listing  */}
        {users && users.length > 0 && (
          <UserManagementTabUserList users={users} onClick={handleUserClick}/>
        )}
        {users && users.length === 0 && (
          <Error 
            image={NotResultImg1} 
            hoffset={300}
            title={"No users Available !"} 
            message={"There are no users available for this query at the moment."} 
          />
        )}

        {/* User Detail Modal */}
        {selectedUser && isModalOpen && (
          <UserDetailsModal user={selectedUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </>
  )
}

export default UserManagement