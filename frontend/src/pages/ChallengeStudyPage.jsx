import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStop, FaRotateRight, FaArrowLeft } from "react-icons/fa6";

const ChallengeStudyPage = () => {
  const token = localStorage.getItem("access");
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const storageKey = `challenge_timer_${challengeId}`;
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

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const meRes = await fetch("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserId(meData.id);
      }

      const res = await fetch("http://localhost:8000/api/challenges-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const allChallenges = [
          ...(data.incoming || []),
          ...(data.outgoing || []),
          ...(data.active || []),
        ];
        const found = allChallenges.find((c) => c.id === parseInt(challengeId, 10));
        setChallenge(found || null);
      }
    } catch (err) {
      console.error("Error fetching challenge:", err);
    } finally {
      setLoading(false);
    }
  }, [challengeId, token]);

  useEffect(() => {
    fetchData();

    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (typeof parsed.elapsedSeconds === "number") {
          setElapsedSeconds(parsed.elapsedSeconds);
        }
        if (parsed.isRunning) {
          setIsRunning(true);
        }
      } catch (e) {
        console.error("Error parsing saved timer:", e);
      }
    }
  }, [fetchData, storageKey]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          localStorage.setItem(storageKey, JSON.stringify({ elapsedSeconds: next, isRunning: true }));
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedSeconds > 0) {
        localStorage.setItem(storageKey, JSON.stringify({ elapsedSeconds, isRunning: false }));
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, storageKey, elapsedSeconds]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  const calculatedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  const handleSaveSession = async () => {
    if (elapsedSeconds === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/log-challenge-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: parseInt(challengeId, 10),
          minutes: calculatedMinutes,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setElapsedSeconds(0);
        setIsRunning(false);
        setShowLogDialog(false);
        localStorage.removeItem(storageKey);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to log challenge session.");
      }
    } catch (err) {
      console.error("Error logging challenge session:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-zinc-800 text-zinc-100 flex items-center justify-center">
        <p className="text-lg font-mono">Loading challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-12 min-h-screen bg-zinc-800 text-zinc-100 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Challenge not found or it is not your turn.</p>
        <Link to="/" className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (saved) {
    const isRecipient = challenge.recipient?.id === currentUserId;
    return (
      <div className="p-8 min-h-screen bg-zinc-800 text-zinc-100 flex flex-col items-center justify-center">
        <div className="bg-zinc-700 border border-zinc-600 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Session Logged</h2>
          <p className="text-sm text-zinc-300 mb-2">
            You studied for {calculatedMinutes} minute{calculatedMinutes !== 1 ? "s" : ""} in {challenge.category?.name}.
          </p>
          <p className="text-sm text-zinc-400 mb-6">
            {isRecipient
              ? "The challenger will now take their turn."
              : "The challenge is now complete. Check history for results."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-bold py-2.5 px-6 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const categoryName = challenge.category?.name || "Unknown";
  const bgColor = colorMap[categoryName] || "bg-slate-200";
  const opponent =
    challenge.sender?.id === currentUserId
      ? challenge.recipient?.username
      : challenge.sender?.username;

  return (
    <div className={`min-h-screen ${bgColor} text-slate-800 p-4 sm:p-8 md:p-12 flex flex-col items-center`}>
      <div className="w-full max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors text-sm font-bold"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Challenge Info */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            Challenge: {categoryName}
          </h1>
          <p className="text-sm text-slate-600">
            vs <span className="font-bold text-slate-900">{opponent}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Study as long as you can. When you stop, your time will be logged as your score.
          </p>
        </div>

        {/* Timer */}
        <div className="bg-white border border-slate-300 rounded-3xl p-8 sm:p-12 shadow-md flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">
            Challenge Session
          </span>

          <div className="text-5xl sm:text-7xl md:text-8xl font-black font-mono tracking-wider text-slate-900 py-4 my-2 select-none">
            {formatTime(elapsedSeconds)}
          </div>

          <p className="text-xs text-slate-500 font-mono mb-8">
            {elapsedSeconds > 0
              ? `Score: ~${calculatedMinutes} minute${calculatedMinutes !== 1 ? "s" : ""}`
              : "Click Start to begin your challenge session"}
          </p>

          <div className="flex items-center gap-4 sm:gap-6 w-full justify-center">
            {!isRunning ? (
              <button
                onClick={() => { setIsRunning(true); setSaved(false); }}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg min-w-40"
              >
                <FaPlay className="text-sm" />
                <span>{elapsedSeconds > 0 ? "Resume" : "Start"}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg min-w-40"
              >
                <FaPause className="text-sm" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => { setIsRunning(false); setShowLogDialog(true); }}
              disabled={elapsedSeconds === 0 && !isRunning}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold px-6 py-4 rounded-xl shadow transition-colors cursor-pointer text-base sm:text-lg"
            >
              <FaStop className="text-sm" />
              <span>Stop & Log</span>
            </button>

            <button
              onClick={() => {
                if (elapsedSeconds > 0 && window.confirm("Reset the timer? This will discard your current time.")) {
                  setIsRunning(false);
                  setElapsedSeconds(0);
                  localStorage.removeItem(storageKey);
                }
              }}
              disabled={elapsedSeconds === 0}
              className="p-4 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              <FaRotateRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* Log Dialog */}
        {showLogDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowLogDialog(false)} />
            <div className="relative bg-white border border-slate-300 rounded-2xl p-6 w-full max-w-md shadow-2xl z-50">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Challenge Score</h3>
              <p className="text-sm text-slate-600 mb-6">
                You studied for <span className="font-mono font-bold text-slate-900">{formatTime(elapsedSeconds)}</span>.
                Your score will be <span className="font-bold text-slate-900">{calculatedMinutes} minute{calculatedMinutes !== 1 ? "s" : ""}</span>.
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowLogDialog(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Continue Studying
                </button>
                <button
                  onClick={handleSaveSession}
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Submit Score"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeStudyPage;
