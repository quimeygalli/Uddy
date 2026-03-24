import React from "react";

function SubjectPill({ subject }) {
  return (
    <div className="flex justify-between mt-4 ps-7 pe-7 pt-3 pb-3 rounded-2xl bg-amber-200 hover:bg-amber-100 cursor-pointer">
      <p>{subject}</p> {/* Subject name */}
      <p>...</p> {/* Button to edit */}
    </div>
  );
}

export default SubjectPill;
