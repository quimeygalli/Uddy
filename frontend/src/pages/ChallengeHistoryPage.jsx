import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ChallengeHistoryPage = () => {
  const token = localStorage.getItem("access");
  const { friendId } = useParams();
  const [searchParams] = useSearchParams();
  const friendName = searchParams.get("name") || "Friend";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

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

      const res = await fetch(`http://localhost:8000/api/challenge-history/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, [friendId, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Count wins
  let myWins = 0;
  let theirWins = 0;
  let draws = 0;

  history.forEach((c) => {
    const iAmSender = c.sender?.id === currentUserId;
    const myScore = iAmSender ? c.sender_minutes : c.recipient_minutes;
    const theirScore = iAmSender ? c.recipient_minutes : c.sender_minutes;
    if (myScore > theirScore) myWins++;
    else if (theirScore > myScore) theirWins++;
    else draws++;
  });

  return (
    <div className="min-h-screen bg-zinc-800 text-zinc-100 p-4 sm:p-8 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-lg">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mb-2">
            Challenge History
          </h1>
          <p className="text-sm text-zinc-400">
            Completed challenges vs {friendName}
          </p>
        </div>

        {/* Score Summary */}
        {!loading && history.length > 0 && (
          <div className="bg-zinc-700 border border-zinc-600 rounded-2xl p-5 mb-6 flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-black text-zinc-100">{myWins}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">You</p>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500">-</p>
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-100">{theirWins}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{friendName}</p>
            </div>
            {draws > 0 && (
              <>
                <div>
                  <p className="text-sm font-bold text-zinc-500">|</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-100">{draws}</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Draws</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* History List */}
        {loading ? (
          <div className="text-sm text-zinc-400 py-4">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="bg-zinc-700 border border-zinc-600 rounded-2xl p-8 text-center">
            <p className="text-zinc-400 text-sm">No completed challenges with {friendName} yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((c) => {
              const iAmSender = c.sender?.id === currentUserId;
              const myScore = iAmSender ? c.sender_minutes : c.recipient_minutes;
              const theirScore = iAmSender ? c.recipient_minutes : c.sender_minutes;
              const iWon = myScore > theirScore;
              const isDraw = myScore === theirScore;
              const date = new Date(c.created_at).toLocaleDateString();

              return (
                <div
                  key={c.id}
                  className="bg-zinc-700 border border-zinc-600 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-zinc-100">
                      {c.category?.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{date}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="text-center">
                      <p className="text-lg font-black text-zinc-100">{myScore}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">You</p>
                    </div>
                    <span className="text-xs text-zinc-500 font-bold">vs</span>
                    <div className="text-center">
                      <p className="text-lg font-black text-zinc-100">{theirScore}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">Them</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        isDraw
                          ? "bg-zinc-600 text-zinc-300"
                          : iWon
                          ? "bg-green-800 text-green-200"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {isDraw ? "Draw" : iWon ? "Won" : "Lost"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeHistoryPage;
