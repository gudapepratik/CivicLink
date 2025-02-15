import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

function Layout({ children }) {
  const location = useLocation();

  const currentLocation = location.pathname;

  return (
    <>
      {currentLocation !== "/login" && <Navbar />}
      <Toaster />
      <Outlet />
    </>
  );
}

export default Layout;
