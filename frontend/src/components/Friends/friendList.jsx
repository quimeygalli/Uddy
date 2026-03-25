import React from "react";
import FriendItem from "./friendItem";

function FriendList() {
  // A list with the user's friends to be displayed.
  const friendList = ["papu", "nehu", "mamu"];
  return (
    <div>
      {friendList.map((element) => (
        <FriendItem key={element} name={element} />
      ))}
    </div>
  );
}

export default FriendList;
