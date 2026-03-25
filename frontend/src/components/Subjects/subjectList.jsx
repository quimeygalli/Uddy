import React from "react";
import SubjectPill from "./subjectPill";

function SubjectList() {
  // A list with the user's subjects to be displayed.
  // Should also contain the color for the subject
  const subjectList = ["math", "lengua", "sociales"];
  return (
    <div>
      {subjectList.map((element) => (
        <SubjectPill key={element} subject={element} />
      ))}
    </div>
  );
}

export default SubjectList;
