import React from "react";

function SubjectPill({ subject }) {
  // Fixed problem from DB. Note to self, tailwindcss only renders static stuff.

  const colorMap = {
    Accounting: "bg-red-200",
    Biology: "bg-green-200",
    "Computer Science": "bg-blue-200",
    Engineering: "bg-orange-200",
    History: "bg-yellow-200",
    Humanities: "bg-purple-200",
    Literature: "bg-pink-200",
    Marketing: "bg-cyan-200",
    Math: "bg-indigo-200",
    Psychology: "bg-lime-200",
    Science: "bg-slate-200",
  };

  const color = colorMap[subject.category.name];

  return (
    <div
      className={`flex justify-between mt-4 ps-7 pe-7 pt-3 pb-3 rounded-2xl ${color} hover:bg-amber-100 cursor-pointer`}
    >
      <p>{subject.name}</p> {/* Subject name */}
      <button>•••</button> {/* Button to edit */}
    </div>
  );
}

export default SubjectPill;
