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

function Navbar() {
  const { toggleColorMode } = useColorMode();

  // sidebar toggle state
  const [sidebar, setSidebar] = useState(false);
  // user state from redux store
  const user = useSelector((state) => state.authSlice.user);
  // dispatch instance to handle store
  const dispatch = useDispatch();

  const citizenTabs = [
    {
      title: "Home",
      link: "",
    },
    {
      title: "My Reports",
      link: "myreports",
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
      link: "helpandsupport",
    },
    {
      title: "Community Guidelines",
      link: "guidelines",
    },
  ];

  const authorityTabs = [
    {
      title: "Dashboard",
      link: "dashboard",
    },
    {
      title: "New Reports",
      link: "reports",
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
      link: "helpandsupport",
    },
    {
      title: "Community Guidelines",
      link: "guidelines",
    },
  ];

  // logout handler
  const handleLogout = async () => {
    try {
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
    }
  };

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  return (
    <>
      <div className="bg-[#001044] shadow-inner sticky top-0 w-full h-20  z-50 ">
        <div className="flex w-full items-center justify-between h-full px-4">
          {!sidebar && (
            <RiSidebarUnfoldFill
              onClick={toggleSidebar}
              size={28}
              className="text-white"
            />
          )}
          <h1 className="font-outfit font-bold text-2xl text-white">
            CivicLink
          </h1>
          {!user ? (
            <RiUser3Fill
              size={36}
              className="bg-zinc-600 p-2 font-heebo text-white rounded-full"
            />
          ) : (
            <img
              src={user.avatar.publicUrl}
              alt="profile"
              className="bg-zinc-600 w-10 h-10 font-heebo text-white rounded-full"
            />
          )}
        </div>

        <div
          className={`min-h-screen w-[80vw] shadow-lg absolute flex flex-col z-50 top-0  ${
            sidebar ? "translate-x-0" : "-translate-x-full"
          } duration-100 bg-white`}
        >
          <div className="w-full h-20 p-4 flex gap-3 items-center bg-[#001044]">
            <RiSidebarFoldFill
              onClick={toggleSidebar}
              size={28}
              className="text-white"
            />
            <div className="w-full shadow-inner p-2 rounded-md font-outfit bg-zinc-100">
              <h1 className="text-sm text-zinc-600">
                {user ? user.name : "Username"}
              </h1>
            </div>
          </div>

          {/* User location map  */}
          <div className="w-full p-3 h-36">
            <div className="flex w-full  rounded-2xl shadow-inner bg-zinc-400 h-full">
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
            />
          </div>

          {/* Login/Logout buttons  */}
          <div className="flex-1 flex w-full flex-col items-center justify-center">
            {!user ? (
              <NavLink
                to={"/login"}
                className="px-6 py-3 flex items-center gap-3 rounded-xl text-white font-outfit text-lg  bg-zinc-700 "
              >
                Login <RiArrowRightLine />
              </NavLink>
            ) : (
              <button
                className="px-6 py-3 flex items-center gap-3 rounded-xl text-white font-outfit text-lg  bg-zinc-700 "
                onClick={handleLogout}
              >
                Logout <RiArrowRightLine />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
