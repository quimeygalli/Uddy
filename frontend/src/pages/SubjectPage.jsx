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
    <div className="p-4 sm:p-8 md:p-12 min-h-screen bg-zinc-800 text-zinc-100 overflow-x-auto">
      <div className="max-w-4xl mx-auto bg-zinc-700 p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto">
        {/* Show json */}
        <pre className="text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words">{JSON.stringify(subjectData, null, 2)}</pre>{" "}
        {/*`pre` shows formatted text as received*/}
      </div>
    </div>
  );
};

export default SubjectPage;
