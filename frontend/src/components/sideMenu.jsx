import React from "react";
import SubjectPill from "./subjectPill";

function SideMenu() {
  return (
    <div>
      <div className="flex flex-col justify-between ps-5 pb-5 pe-5 h-screen w-70 pt-1 bg-zinc-700 ">
        <div className="h-90 overflow-y-auto">
          {/* Subjects */}
          <SubjectPill subject="Subject 1" />
          <SubjectPill subject="Subject 2" />
          <SubjectPill subject="Subject 3" />
          <SubjectPill subject="Subject 4" />
          <SubjectPill subject="Subject 5" />
          <SubjectPill subject="Subject 6" />
        </div>
        <div>
          {/* Friends */}
          Friends
        </div>
        <div>
          {/* Settings */}
          Settings
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
