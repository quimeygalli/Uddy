import { React, useEffect } from "react";
import { data } from "react-router-dom";

const RecapPage = () => {
  const token = localStorage.getItem("access");
  const name = "Quimey";

  const fetchData = async () => {
    const response = await fetch("http://localhost:8000/api/weekly-recap", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center bg-amber-200">
      <div>Welcome, {name}</div>
    </div>
  );
};

export default RecapPage;
