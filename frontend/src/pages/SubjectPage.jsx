import React, { useState } from "react";

const SubjectPage = (subject) => {
  // Will display a subject's screen. A subject must be clicked for it to be displayed
  const name = "display.name";
  return (
    <div>
      <div>{name}</div>
    </div>
  );
};

export default SubjectPage;
