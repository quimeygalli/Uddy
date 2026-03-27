import React from "react";
import SideMenu from "../components/SideMenu";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <SideMenu />
      <main>
        {/* An outlet acts as a placeholder for nested, children routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
