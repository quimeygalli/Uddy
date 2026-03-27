import React from "react";
import SideMenu from "../components/SideMenu";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <SideMenu />
      {/* flex-1 makes it so it fills the whole screen */}
      <main className="flex-1">
        {/* An outlet acts as a placeholder for nested, children routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
