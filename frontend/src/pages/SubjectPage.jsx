import React, { useState } from "react";
import { useParams } from "react-router-dom";

const SubjectPage = (subject) => {
  // Will display a subject's screen. A subject must be clicked for it to be displayed
  const { id } = useParams; // For router
  const name = "display.name";
  return (
    <div>
      <div>{name}</div>
    </div>
  );
};

export default SubjectPage;
