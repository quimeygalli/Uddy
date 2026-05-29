import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SubjectPage = () => {
  const token = localStorage.getItem("access");
  const { id } = useParams(); // Fixed: Added parentheses

  const [subjectData, setSubjectData] = useState(null);

  const fetchSubjectData = () => {
    fetch(`http://localhost:8000/api/get-subject/${id}`, {
      method: "GET", // Changed to GET
      headers: {
        Authorization: `Bearer ${token}`, // Login check
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data); // Check data in console
        setSubjectData(data);
      });
  };

  useEffect(() => {
    if (id) {
      fetchSubjectData();
    }
  }, [id]);

  return (
    <div>
      {/* Show json */}
      <pre>{JSON.stringify(subjectData, null, 2)}</pre>{" "}
      {/*`pre` shows formatted text as received*/}
    </div>
  );
};

export default SubjectPage;
