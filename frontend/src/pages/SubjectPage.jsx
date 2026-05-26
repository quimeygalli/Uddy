import React, { useState } from "react";
import { useParams } from "react-router-dom";

const SubjectPage = (subject) => {
  // Displays a subject's menu.
  // Includes timer start and end.
  // Includes Settings for subject (change weekly goal, delete).

  const fetchSubjectData = async () => {
    const response = await fetch("http://localhost:8000/api/get-subject");
  };

  const { id } = useParams; // For router
  const name = "display.name";
  return (
    <div>
      <div>{name}</div>
    </div>
  );
};

export default SubjectPage;
