import React from "react";
import SubjectList from "./Subjects/subjectList";
import FriendList from "./Friends/friendList";
import SettingsBtn from "./Settings/settingsBtn";

function SideMenu() {
  return (
    <div>
      <div className="flex flex-col justify-between ps-5 pb-5 pe-5 h-screen w-70 pt-1 bg-zinc-700 ">
        <div className="h-90 overflow-y-auto">
          {/* Subjects */}
          <SubjectList />
        </div>
        <div className="overflow-y-auto">
          {/* Friends */}
          <FriendList />
        </div>
        <div className="pt-3">
          {/* Settings */}
          <SettingsBtn />
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
