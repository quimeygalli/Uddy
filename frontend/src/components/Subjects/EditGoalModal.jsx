import React, { useState, useEffect } from "react";
import { FaBullseye, FaXmark } from "react-icons/fa6";

function EditGoalModal({ isOpen, onClose, subject, onSuccess }) {
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject && subject.weekly_study_time !== undefined) {
      setHours((subject.weekly_study_time / 60).toString());
    }
  }, [subject]);

  if (!isOpen || !subject) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours < 0) {
      setError("Please enter a valid number of hours.");
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
      const res = await fetch("http://localhost:8000/api/update-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject_id: subject.id,
          weekly_study_time: parsedHours,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to update goal.");
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
            <FaBullseye className="text-cyan-400" />
            <h2 className="text-xl font-bold">Edit Study Goal</h2>
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
            Update your weekly target study time for <span className="font-semibold text-white">{subject.name}</span>.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Weekly Goal (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              required
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 4"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 px-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
            />
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
              {loading ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGoalModal;
