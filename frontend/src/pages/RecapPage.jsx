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
    <div className="flex min-h-screen p-4 sm:p-8 md:p-20 items-center justify-center bg-amber-200">
      <div className="flex flex-col justify-center items-center w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-yellow-600 pb-8 md:pb-20 text-center">
          Welcome back! Here is your weekly recap:
        </h1>
        <div className="w-full overflow-x-auto flex justify-center">
          <table className="table text-lg sm:text-2xl md:text-4xl font-bold border-separate border-spacing-4 sm:border-spacing-6 text-yellow-700">
            <thead>
              <tr>
                <th className="text-left px-2">Subject</th>
                <th className="text-left px-2">Goal</th>
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
                <tr key={element.id || element.name}>
                  <td className="px-2">
                    <span>{element.name}</span>
                  </td>
                  <td className="px-2 whitespace-nowrap">
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
    </div>
  );
};

export default RecapPage;
