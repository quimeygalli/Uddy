import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LogStudyTimeModal from "../components/Subjects/LogStudyTimeModal";
import EditGoalModal from "../components/Subjects/EditGoalModal";
import { FaPlus, FaClock, FaBullseye, FaTrash } from "react-icons/fa6";

const RecapPage = () => {
  const [recapSubjects, setRecapSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForLog, setSelectedForLog] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);

  const token = localStorage.getItem("access");

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/weekly-recap", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecapSubjects(data);
      }
    } catch (err) {
      console.error("Error fetching recap data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete ${subjectName}?`)) return;
    try {
      const res = await fetch(`http://localhost:8000/api/delete-subject/${subjectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  return (
    <div className="flex min-h-screen p-4 sm:p-8 md:p-12 justify-center bg-amber-200">
      <div className="w-full max-w-4xl py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 md:pb-12 border-b border-yellow-500/30">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-700 text-center sm:text-left">
            Welcome back. Here is your weekly recap.
          </h1>
          <Link
            to="/add-subject"
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            <FaPlus />
            <span>Create Study Goal</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-yellow-800 font-medium">
            Loading study goals...
          </div>
        ) : recapSubjects.length === 0 ? (
          <div className="text-center py-16 bg-amber-100/60 rounded-2xl mt-8 border border-yellow-600/20 p-6">
            <p className="text-xl font-bold text-yellow-800 mb-2">
              You have no study goals yet.
            </p>
            <p className="text-sm text-yellow-700 mb-6">
              Create a subject and set a weekly target study time to start tracking your progress.
            </p>
            <Link
              to="/add-subject"
              className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow transition-colors"
            >
              <FaPlus />
              <span>Create Your First Goal</span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {recapSubjects.map((element) => {
              const studiedHours = (element.studied_minutes / 60).toFixed(1);
              const targetHours = (element.weekly_study_time / 60).toFixed(1);
              const percentage = Math.min(
                100,
                Math.round((element.studied_minutes / (element.weekly_study_time || 1)) * 100)
              );

              return (
                <div
                  key={element.id || element.name}
                  className="bg-amber-100/80 hover:bg-amber-100 rounded-2xl p-5 border border-yellow-600/20 shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-extrabold text-yellow-900">
                        {element.name}
                      </h3>
                      {element.category && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full border border-black/10 shadow-2xs"
                          style={{
                            backgroundColor: element.category.color || "#e2e8f0",
                            color: "#1e293b",
                          }}
                        >
                          {element.category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setSelectedForLog(element)}
                        className="flex items-center gap-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <FaClock />
                        <span>Log Time</span>
                      </button>
                      <button
                        onClick={() => setSelectedForEdit(element)}
                        className="flex items-center gap-1.5 bg-yellow-700/10 hover:bg-yellow-700/20 text-yellow-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaBullseye />
                        <span>Edit Goal</span>
                      </button>
                      <button
                        onClick={() => handleDelete(element.id, element.name)}
                        title="Delete subject"
                        className="p-2 text-red-600/70 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-yellow-800">
                      <span>Progress</span>
                      <span>
                        {studiedHours} / {targetHours} hours ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-yellow-600/20 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="bg-yellow-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <LogStudyTimeModal
          isOpen={!!selectedForLog}
          onClose={() => setSelectedForLog(null)}
          subject={selectedForLog}
          onSuccess={fetchData}
        />

        <EditGoalModal
          isOpen={!!selectedForEdit}
          onClose={() => setSelectedForEdit(null)}
          subject={selectedForEdit}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
};

export default RecapPage;
