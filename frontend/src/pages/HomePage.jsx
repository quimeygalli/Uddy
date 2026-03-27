import React, { useState } from "react";
import "../index.css";
import SideMenu from "../components/SideMenu";

function Homepage() {
  const [screen, setScreen] = useState("home");
  return (
    <div id="side-menu" className="flex h-screen">
      <div
        id="main-screen"
        className="flex w-screen h-screen container bg-blue-300"
      >
        <div className="m-auto">
          <h1>{screen}</h1>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
