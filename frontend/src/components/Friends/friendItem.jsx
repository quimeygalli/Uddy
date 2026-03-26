import React from "react";

function FriendItem({ name }) {
  return (
    <div className="flex container bg-zinc-500 mt-2 p-1 rounded-md cursor-pointer hover:bg-zinc-400">
      <div>●</div>
      <div>{name}</div>
    </div>
  );
}

export default FriendItem;
