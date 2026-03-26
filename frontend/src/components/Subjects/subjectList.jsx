import React from "react";
import SubjectPill from "./subjectPill";
import AddSubjectBtn from "./addSubjectBtn";

function SubjectList() {
  // A list with the user's subjects to be displayed.
  // Should also contain the color for the subject
  const subjectList = ["math", "lengua", "sociales"];
  return (
    <div className="pt-3">
      <div className="text-zinc-300">Subjects</div>
      <div>
        {subjectList.map((element) => (
          <SubjectPill key={element} subject={element} />
        ))}
      </div>
      <div>
        <AddSubjectBtn />
      </div>
    </div>
  );
}

export default SubjectList;
