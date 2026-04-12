import React from "react";
import { useNavigate } from "react-router-dom";

const GoToHomepageBtn = () => {
  const goToHomepage = useNavigate();
  return (
    <button
      onClick={() => goToHomepage("/")}
      className={`group flex justify-between w-full mt-4 ps-3 pe-7 pt-3 pb-3 rounded-2xl bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-800 cursor-pointer`}
    >
      <span className="ps-3 text-sm text-zinc-400 group-hover:text-zinc-800">
        Homepage
      </span>
    </button>
  );
};

export default GoToHomepageBtn;
