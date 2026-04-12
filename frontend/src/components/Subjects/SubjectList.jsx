import React, { useEffect, useState } from "react";
import SubjectPill from "./SubjectItem";
import AddSubjectBtn from "./AddSubjectBtn";
import { useNavigate } from "react-router-dom";
import GoToHomepageBtn from "./GoToHomepageBtn";

function SubjectList() {
  const [subjects, setSubjects] = useState([]); // useState is very useful
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/signin");
      return;
    }

    const getSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/subject-list", {
          method: "GET",
          // Request subject list from user
          headers: {
            Authorization: `Bearer ${token}`, // For backend auth.
          },
        });

        if (response.status === 401) {
          navigate("/signin");
          return;
        }

        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };
    getSubjects();
  }, [navigate]);

  return (
    <div className="pt-3">
      <div className="text-zinc-300">Subjects</div>
      <div>
        <GoToHomepageBtn />
      </div>
      <div>
        {subjects.map((element) => (
          <SubjectPill key={element.id} subject={element} />
        ))}
      </div>
      <div>
        <AddSubjectBtn />
      </div>
    </div>
  );
}

export default SubjectList;
