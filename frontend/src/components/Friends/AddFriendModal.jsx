import React, { useState } from "react";
import { FaUserPlus, FaXmark } from "react-icons/fa6";

function AddFriendModal({ isOpen, onClose, onSuccess }) {
  const [friendId, setFriendId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!friendId.trim()) {
      setError("Please enter a valid User ID.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access");
    if (!token) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/send-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient_id: friendId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Friend request sent successfully.");
        setFriendId("");
        setTimeout(() => {
          setSuccessMsg("");
          if (onSuccess) onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(data.error || "Failed to send friend request.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-800 text-zinc-100 rounded-2xl p-6 w-full max-w-md shadow-2xl z-50 border border-zinc-700 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
          <div className="flex items-center gap-2 text-amber-50">
            <FaUserPlus className="text-cyan-400" />
            <h2 className="text-xl font-bold">Add a Friend</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <FaXmark className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-6 space-y-4">
          <p className="text-sm text-zinc-300">
            Enter your friend's personal ID number (found in their Settings menu) to send them a friend request.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-3 py-2 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Friend's Personal ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono font-bold">
                #
              </span>
              <input
                type="number"
                required
                min="1"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="e.g. 12"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-8 pr-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-200 hover:bg-cyan-100 disabled:opacity-50 text-cyan-950 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFriendModal;
