import React from "react";

function FriendItem({ name, id }) {
  return (
    <div className="flex items-center justify-between bg-zinc-600 hover:bg-zinc-500 text-zinc-100 mt-1 px-3 py-2 rounded-xl cursor-pointer transition-colors w-full border border-zinc-500/50">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
        <span className="font-medium text-sm truncate">{name}</span>
      </div>
      {id && (
        <span className="text-xs font-mono text-zinc-300 shrink-0 bg-zinc-700/60 px-1.5 py-0.5 rounded">
          #{id}
        </span>
      )}
    </div>
  );
}

export default FriendItem;
