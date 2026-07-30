import React, { useState } from "react";
import FriendPopup from "./FriendPopup";

function FriendItem({ name, id, friendUserId, hasPendingChallenge, onClose }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setShowPopup(true)}
        className="flex items-center justify-between bg-zinc-600 hover:bg-zinc-500 text-zinc-100 mt-1 px-3 py-2 rounded-xl cursor-pointer transition-colors w-full border border-zinc-500/50"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
          <span className="font-medium text-sm truncate">{name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasPendingChallenge && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          )}
          {id && (
            <span className="text-xs font-mono text-zinc-300 bg-zinc-700 px-1.5 py-0.5 rounded">
              #{id}
            </span>
          )}
        </div>
      </div>

      {showPopup && (
        <FriendPopup
          friendName={name}
          friendUserId={friendUserId}
          onClose={() => setShowPopup(false)}
          onSideMenuClose={onClose}
        />
      )}
    </div>
  );
}

export default FriendItem;
