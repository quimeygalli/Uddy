import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlay, FaPause, FaStop, FaRotateRight, FaClock, FaArrowLeft, FaCheck } from "react-icons/fa6";
import LogStudyTimeModal from "../components/Subjects/LogStudyTimeModal";

const SubjectPage = () => {
  const token = localStorage.getItem("access");
  const { id } = useParams();

  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chronometer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const storageKey = `chronometer_state_${id}`;
  const timerRef = useRef(null);

  const colorMap = {
    Accounting: "bg-red-200",
    Biology: "bg-green-200",
    "Computer Science": "bg-blue-200",
    Engineering: "bg-orange-200",
    History: "bg-yellow-200",
    Humanities: "bg-purple-200",
    Literature: "bg-pink-200",
    Marketing: "bg-cyan-200",
    Math: "bg-indigo-200",
    Psychology: "bg-lime-200",
    Science: "bg-slate-200",
  };

  const fetchSubjectData = useCallback(async () => {
    if (!token || !id) return;
    try {
      const response = await fetch(`http://localhost:8000/api/get-subject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubjectData(data);
      }
    } catch (err) {
      console.error("Error fetching subject:", err);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchSubjectData();
    setSaveSuccess(false);
    setShowLogDialog(false);

    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (typeof parsed.elapsedSeconds === "number") {
          setElapsedSeconds(parsed.elapsedSeconds);
        }
        if (parsed.isRunning) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } catch (e) {
        console.error("Error parsing saved timer state:", e);
      }
    } else {
      setElapsedSeconds(0);
      setIsRunning(false);
    }
  }, [id, fetchSubjectData, storageKey]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          localStorage.setItem(
            storageKey,
            JSON.stringify({ elapsedSeconds: next, isRunning: true })
          );
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedSeconds > 0) {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ elapsedSeconds, isRunning: false })
        );
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, storageKey, elapsedSeconds]);

  const handleStartResume = () => {
    setIsRunning(true);
    setSaveSuccess(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (elapsedSeconds === 0) return;
    if (window.confirm("Are you sure you want to reset the chronometer? This will discard current elapsed time.")) {
      setIsRunning(false);
      setElapsedSeconds(0);
      localStorage.removeItem(storageKey);
      setSaveSuccess(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowLogDialog(true);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  const calculatedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  const handleSaveSession = async () => {
    if (elapsedSeconds === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/add-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject_id: parseInt(id, 10),
          minutes: calculatedMinutes,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setShowLogDialog(false);
        setElapsedSeconds(0);
        setIsRunning(false);
        localStorage.removeItem(storageKey);
        fetchSubjectData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to log session.");
      }
    } catch (err) {
      console.error("Error logging session:", err);
      alert("An unexpected error occurred while logging.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardSession = () => {
    setShowLogDialog(false);
    setElapsedSeconds(0);
    localStorage.removeItem(storageKey);
  };

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-slate-200 text-slate-700 flex items-center justify-center">
        <p className="text-lg font-mono">Loading chronometer...</p>
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="p-12 min-h-screen bg-slate-200 text-slate-700 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Subject not found.</p>
        <Link
          to="/"
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const categoryName = subjectData.category?.name;
  const bgColor = colorMap[categoryName] || "bg-slate-200";
  const targetHours = ((subjectData.weekly_study_time || 0) / 60).toFixed(1);

  return (
    <div className={`min-h-screen ${bgColor} text-slate-800 p-4 sm:p-8 md:p-12 flex flex-col items-center`}>
      <div className="w-full max-w-2xl">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors text-sm font-bold"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow"
          >
            <FaClock />
            <span>Log Time Manually</span>
          </button>
        </div>

        {/* Subject Card Info */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {subjectData.name}
              </h1>
              {categoryName && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-800">
                  {categoryName}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600">
              Weekly Target: <span className="font-bold text-slate-900">{targetHours} hours</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Status
            </span>
            <span className="text-sm font-bold text-slate-800">
              {isRunning ? "Session Active" : elapsedSeconds > 0 ? "Paused" : "Ready"}
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="bg-white border border-emerald-500 text-emerald-800 px-4 py-3 rounded-xl mb-8 flex items-center justify-between text-sm shadow">
            <div className="flex items-center gap-2 font-bold">
              <FaCheck className="text-emerald-600" />
              <span>Study session logged successfully to your weekly recap.</span>
            </div>
          </div>
        )}

        {/* Chronometer Studio Display */}
        <div className="bg-white border border-slate-300 rounded-3xl p-8 sm:p-12 shadow-md flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">
            Elapsed Study Time
          </span>

          <div className="text-5xl sm:text-7xl md:text-8xl font-black font-mono tracking-wider text-slate-900 py-4 my-2 select-none">
            {formatTime(elapsedSeconds)}
          </div>

          <p className="text-xs text-slate-500 font-mono mb-8">
            {elapsedSeconds > 0
              ? `Estimated log: ~${calculatedMinutes} minute${calculatedMinutes !== 1 ? "s" : ""} (${(elapsedSeconds / 3600).toFixed(2)} hrs)`
              : "Click Start to begin timing your session"}
          </p>

          {/* Control Buttons */}
          <div className="flex items-center gap-4 sm:gap-6 w-full justify-center">
            {!isRunning ? (
              <button
                onClick={handleStartResume}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg min-w-40"
              >
                <FaPlay className="text-sm" />
                <span>{elapsedSeconds > 0 ? "Resume" : "Start Session"}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg min-w-40"
              >
                <FaPause className="text-sm" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={elapsedSeconds === 0 && !isRunning}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold px-6 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg"
              title="Stop and save session"
            >
              <FaStop className="text-sm" />
              <span>Stop & Log</span>
            </button>

            <button
              onClick={handleReset}
              disabled={elapsedSeconds === 0}
              className="p-4 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 rounded-xl border border-slate-300 transition-colors cursor-pointer"
              title="Reset timer"
            >
              <FaRotateRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* Stop & Log Confirmation Dialog */}
        {showLogDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowLogDialog(false)} />
            <div className="relative bg-white border border-slate-300 rounded-2xl p-6 w-full max-w-md shadow-2xl z-50">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Save Study Session</h3>
              <p className="text-sm text-slate-600 mb-6">
                You recorded <span className="font-mono font-bold text-slate-900">{formatTime(elapsedSeconds)}</span> of study time for <span className="font-bold text-slate-900">{subjectData.name}</span>.
                This will log <span className="font-bold text-slate-900">{calculatedMinutes} minute{calculatedMinutes !== 1 ? "s" : ""}</span> to your weekly recap.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogDialog(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Continue Timing
                </button>
                <button
                  type="button"
                  onClick={handleDiscardSession}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveSession}
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? "Saving..." : "Save to Recap"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Log Modal */}
        <LogStudyTimeModal
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          subject={subjectData}
          onSuccess={() => {
            fetchSubjectData();
            setSaveSuccess(true);
          }}
        />
      </div>
    </div>
  );
};

export default SubjectPage;
