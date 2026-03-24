import React from "react";
import "../index.css";
import SideMenu from "../components/sideMenu";

function Homepage() {
  return (
    <div className="flex h-screen">
      <div className="h-full">
        <SideMenu />
      </div>
      <div className="flex w-screen h-screen container bg-blue-300">
        <div className="m-auto">
          <h1>page</h1>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
