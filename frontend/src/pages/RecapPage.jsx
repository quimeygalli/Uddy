import { React, useEffect, useState } from "react";
import { data } from "react-router-dom";

const RecapPage = () => {
  const [recapSubject, setRecapSubject] = useState([]);

  const token = localStorage.getItem("access");

  // Get weeklyRecap data
  const fetchData = async () => {
    const response = await fetch("http://localhost:8000/api/weekly-recap", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setRecapSubject(data);
  };

  // Get the data as soon as the page is loaded
  useEffect(() => {
    fetchData();
  }, []);

  console.log(recapSubject);
  return (
    <div className="flex h-screen p-20 items-center justify-center bg-amber-200">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold text-yellow-600 pb-20">
          Welcome back! Here is your weekly recap:
        </h1>
        <table className="* table text-4xl font-bold border-separate border-spacing-6 text-yellow-700">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            {recapSubject.map((element) => (
              // Each object is composed as follows:
              // {
              //  id: 1
              //  name: "Math"
              //  studied_minutes: 0
              //  weekly_study_time: 120
              // }
              <tr>
                <td>
                  <span>{element.name}</span>
                </td>
                <td>
                  <span>
                    {element.studied_minutes / 60} /{" "}
                    {element.weekly_study_time / 60} h
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecapPage;
