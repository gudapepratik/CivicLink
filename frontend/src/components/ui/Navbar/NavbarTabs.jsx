import { RiArrowRightSLine } from "@remixicon/react";
import React from "react";
import { NavLink } from "react-router";

function NavbarTabs({ tabs }) {
  return (
    <>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className="w-full font-outfit p-4 bg-white hover:bg-zinc-100 duration-75 flex justify-between"
        >
          <NavLink to={`/${tab.link}`} className={"w-full flex justify-between"}>
              <h2>{tab.title}</h2> 
              <RiArrowRightSLine className="text-zinc-400"/>
          </NavLink>
        </div>
      ))}
    </>
  );
}

export default NavbarTabs;
