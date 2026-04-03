import React, { useState } from "react";
import "../index.css";
import SideMenu from "../components/SideMenu";
import SubjectPage from "./SubjectPage";
import RecapPage from "./RecapPage";

function Homepage() {
  const [screen, setScreen] = useState(RecapPage);
  return (
    <div id="side-menu" className="flex h-screen">
      <div
        id="main-screen"
        className="flex w-full h-full container bg-blue-300"
      >
        <div className="m-auto">
          <h1>{screen}</h1>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
