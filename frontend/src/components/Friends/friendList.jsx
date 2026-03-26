import React from "react";
import FriendItem from "./friendItem";

function FriendList() {
  // A list with the user's friends to be displayed.
  const friendList = ["papu", "nehu", "mamu", "marga", "abu", "abu"];
  return (
    <div>
      <div className="text-zinc-300">Friends</div>
      <div>
        {friendList.map((element) => (
          <FriendItem key={element} name={element} />
        ))}
      </div>
    </div>
  );
}

export default FriendList;
