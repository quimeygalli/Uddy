import React from "react";
import SubjectList from "./Subjects/SubjectList";
import FriendList from "./Friends/FriendList";
import SettingsBtn from "./Settings/SettingsBtn";

function SideMenu({ onClose, isMobile = false }) {
  return (
    <div className={isMobile ? "w-full h-full" : ""}>
      <div
        className={`flex flex-col justify-between ps-5 pb-5 pe-5 ${
          isMobile ? "w-full min-h-[calc(100vh-60px)]" : "h-screen w-70"
        } pt-1 bg-zinc-700`}
      >
        <div className="max-h-90 overflow-y-auto">
          {/* Subjects */}
          <SubjectList onClose={onClose} />
        </div>
        <div className="overflow-y-auto">
          {/* Friends */}
          <FriendList onClose={onClose} />
        </div>
        <div className="pt-3">
          {/* Settings */}
          <SettingsBtn onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
