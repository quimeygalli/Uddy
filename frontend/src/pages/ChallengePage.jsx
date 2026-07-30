import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ChallengePage = () => {
  const { friendId } = useParams();
  const [searchParams] = useSearchParams();
  const friendName = searchParams.get("name") || "Friend";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSendChallenge = async (categoryId) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/send-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient_id: parseInt(friendId, 10),
          category_id: categoryId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error || "Failed to send challenge.");
      }
    } catch (err) {
      console.error("Error sending challenge:", err);
      setError("An unexpected error occurred.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-zinc-800 text-zinc-100 p-4 sm:p-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-700">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="bg-zinc-700 border border-zinc-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">
              Challenge Sent
            </h2>
            <p className="text-sm text-zinc-300 mb-6">
              Your challenge has been sent to {friendName}. They will see it the next time they open the app.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-bold py-2.5 px-6 rounded-xl transition-colors cursor-pointer text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Challenge {friendName}
          </h1>
          <p className="text-sm text-zinc-400">
            Pick a category to challenge them on. They will receive a notification in their friend menu.
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Category Grid */}
        {loading ? (
          <div className="text-sm text-zinc-400 py-4">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const bg = colorMap[category.name] || "bg-slate-200";
              return (
                <button
                  key={category.id}
                  onClick={() => handleSendChallenge(category.id)}
                  disabled={sending}
                  className={`${bg} text-slate-900 font-bold py-4 px-4 rounded-2xl transition-colors cursor-pointer text-sm disabled:opacity-50 border border-black/10`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
