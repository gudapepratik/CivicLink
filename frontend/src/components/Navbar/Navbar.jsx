import { Button, ButtonGroup } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import {
  RiArrowRightLine,
  RiSidebarFoldFill,
  RiSidebarUnfoldFill,
  RiUser3Fill,
} from "@remixicon/react";
import { NavLink } from "react-router";
import NavbarTabs from "./NavbarTabs";
import GoogleMapComponent from "../GoogleMap/GoogleMapComponent";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "@/api/services/auth.services";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import { logout } from "@/store/authSlice";
import Loader from "../Loader/Loader";

function Navbar() {
  const { toggleColorMode } = useColorMode();

  // sidebar toggle state
  const [sidebar, setSidebar] = useState(false);
  // user state from redux store
  const user = useSelector((state) => state.authSlice.user);
  // dispatch instance to handle store
  const dispatch = useDispatch();
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const citizenTabs = [
    {
      title: "Home",
      link: "",
    },
    {
      title: "My Reports",
      link: "user-posts",
    },
    {
      title: "Departments",
      link: "departments"
    },
    {
      title: "Notifications",
      link: "notifications",
    },
    {
      title: "Account",
      link: "account",
    },
    {
      title: "Help & Support",
      link: "help-and-support",
    },
    {
      title: "Community Guidelines",
      link: "community-guidelines",
    },
  ];

  const authorityTabs = [
    {
      title: "Dashboard",
      link: "authority-dashboard",
    },
    {
      title: "New Reports",
      link: "new-reports",
    },
    {
      title: "Pending Reports",
      link: "reports",
    },
    {
      title: "Resolved Reports",
      link: "reports",
    },
    {
      title: "Account",
      link: "account",
    },
    {
      title: "Setting",
      link: "setting",
    },
    {
      title: "Help & Support",
      link: "help-and-support",
    },
    {
      title: "Community Guidelines",
      link: "community-guidelines",
    },
  ];

  // logout handler
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // logout user
      await AuthService.logoutUser();

      // clear store
      dispatch(logout());

      // success notification
      ToasterNotification({
        type: "success",
        title: "Logout Success",
        description: "User logged out successfully",
      });
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "Logout Failed",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  useEffect(() => {
    if (sidebar == true) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [sidebar]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="bg-[#001044] dark:bg-zinc-950 shadow-inner sticky top-0 w-full h-20  z-50 ">
        <div className="flex w-full items-center justify-between h-full px-4">
          {!sidebar && (
            <RiSidebarUnfoldFill
              onClick={toggleSidebar}
              size={28}
              className="text-white"
            />
          )}
          <NavLink
            to={"/"}
            className="font-outfit font-bold text-2xl text-white"
          >
            CivicLink
          </NavLink>
          {!user ? (
            <RiUser3Fill
              size={36}
              className="bg-zinc-600 p-2 font-heebo text-white rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={user.avatar.publicUrl}
                alt="profile image"
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div
          className={`min-h-screen w-full shadow-lg absolute flex  z-50 top-0  ${
            sidebar ? "translate-x-0" : "-translate-x-full"
          } duration-200`}
        >
          <div className="flex flex-col w-[80%] bg-white dark:bg-zinc-950 dark:text-white">
            <div className="w-full h-20 p-4 flex gap-3 items-center bg-[#001044] dark:bg-zinc-950">
              <RiSidebarFoldFill
                onClick={toggleSidebar}
                size={28}
                className="text-white"
              />
              <div className="w-full shadow-inner p-2 rounded-md font-outfit bg-zinc-100 dark:bg-zinc-800">
                <h1 className="text-sm text-center text-zinc-600 dark:text-white">
                  {user ? user.name : "Username"}
                </h1>
              </div>
            </div>

            {/* User location map  */}
            <div className="w-full p-3 h-36">
              <div className="flex w-full  rounded-2xl shadow-inner bg-zinc-400 dark:bg-zinc-800 h-full">
                {/* <GoogleMapComponent /> */}
              </div>
            </div>

            {/* Tabs suggestions  */}
            <div className="w-full flex flex-col">
              <NavbarTabs
                tabs={
                  user
                    ? user.role === "citizen"
                      ? citizenTabs
                      : authorityTabs
                    : citizenTabs
                }
                toggleSidebar={toggleSidebar}
              />
            </div>

            {/* Login/Logout buttons  */}
            <div className="flex-1 flex w-full flex-col items-center justify-center">
              {!user ? (
                <NavLink
                  to={"/login"}
                  className="px-6 py-3 flex items-center gap-3 rounded-xl text-white dark:text-zinc-900 dark:bg-white font-outfit text-lg  bg-blue-950 "
                >
                  Login <RiArrowRightLine />
                </NavLink>
              ) : (
                <button
                  className="px-6 py-3 flex items-center gap-3 rounded-xl text-white dark:text-zinc-900 dark:bg-white font-outfit text-lg  bg-blue-950  "
                  onClick={handleLogout}
                >
                  Logout <RiArrowRightLine />
                </button>
              )}
            </div>
          </div>
          <div
            className="bg-transparent w-[20%] min-h-screen"
            onClick={toggleSidebar}
          ></div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
