import React from "react";

function FriendItem({ name }) {
  return (
    <button className="flex container bg-zinc-500 mt-2 p-1 rounded-md cursor-pointer hover:bg-zinc-400">
      <span>●</span>
      <span>{name}</span>
    </button>
  );
}

export default FriendItem;
