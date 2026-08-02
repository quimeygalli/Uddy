import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaXmark } from "react-icons/fa6";

function FriendPopup({ friendName, friendUserId, onClose, onSideMenuClose }) {
  const navigate = useNavigate();
  const [incomingChallenges, setIncomingChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/challenges-list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const fromFriend = (data.incoming || []).filter(
            (c) => c.sender?.id === friendUserId
          );
          setIncomingChallenges(fromFriend);

          // Active challenges involving this friend where it is my turn
          const myActive = (data.active || []).filter(
            (c) => c.sender?.id === friendUserId || c.recipient?.id === friendUserId
          );
          setActiveChallenges(myActive);
        }
      } catch (err) {
        console.error("Error fetching challenges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [friendUserId]);

  const handleChallenge = () => {
    onClose();
    if (onSideMenuClose) onSideMenuClose();
    navigate(`/challenge/${friendUserId}?name=${encodeURIComponent(friendName)}`);
  };

  const handleHistory = () => {
    onClose();
    if (onSideMenuClose) onSideMenuClose();
    navigate(`/challenge-history/${friendUserId}?name=${encodeURIComponent(friendName)}`);
  };

  const handleRespond = async (challengeId, action) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/respond-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challenge_id: challengeId, action }),
      });
      if (res.ok) {
        const data = await res.json();
        if (action === "accept" && data.challenge) {
          // Accepted - go study right away
          onClose();
          if (onSideMenuClose) onSideMenuClose();
          navigate(`/challenge-study/${data.challenge.id}`);
        } else {
          setIncomingChallenges((prev) =>
            prev.filter((c) => c.id !== challengeId)
          );
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} challenge:`, err);
    }
  };

  const handleStudyActive = (challengeId) => {
    onClose();
    if (onSideMenuClose) onSideMenuClose();
    navigate(`/challenge-study/${challengeId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative bg-zinc-700 border border-zinc-600 rounded-2xl p-5 w-full max-w-xs shadow-2xl z-50">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-600 mb-4">
          <h3 className="text-lg font-bold text-zinc-100">{friendName}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-600 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <FaXmark />
          </button>
        </div>

        {/* Active challenges (my turn to study) */}
        {!loading && activeChallenges.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-bold text-green-300 uppercase tracking-wider mb-1">
              Your Turn to Study
            </p>
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between bg-zinc-800 p-2.5 rounded-xl border border-zinc-600"
              >
                <p className="text-sm font-semibold text-zinc-100 truncate">
                  {challenge.category?.name}
                </p>
                <button
                  onClick={() => handleStudyActive(challenge.id)}
                  className="text-xs font-bold bg-zinc-600 hover:bg-zinc-500 text-zinc-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Study Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Incoming Challenges from this friend */}
        {!loading && incomingChallenges.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              Pending Challenges
            </p>
            {incomingChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between bg-zinc-800 p-2.5 rounded-xl border border-zinc-600"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-semibold text-zinc-100 truncate">
                    {challenge.category?.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleRespond(challenge.id, "accept")}
                    title="Accept"
                    className="p-1.5 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleRespond(challenge.id, "decline")}
                    title="Decline"
                    className="p-1.5 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors cursor-pointer"
                  >
                    <FaXmark className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleChallenge}
            className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Challenge
          </button>
          <button
            onClick={handleHistory}
            className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
          >
            History
          </button>
          <button
            onClick={onClose}
            className="w-full bg-zinc-800 hover:bg-zinc-600 text-zinc-300 font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendPopup;
