import React from "react";
import { FaPlus } from "react-icons/fa6";

function AddSubjectBtn() {
  return (
    <button className=" group flex mt-4 ps-3 pe-7 pt-3 pb-3 rounded-2xl bg-zinc-500 hover:bg-zinc-300 hover:text-zinc-800 cursor-pointer">
      <FaPlus className="group-hover:text-zinc-800" />
      <span className="ps-3 text-sm text-zinc-400 group-hover:text-zinc-800">
        Add subject...
      </span>
    </button>
  );
}

export default AddSubjectBtn;
