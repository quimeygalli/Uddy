import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaCheck, FaXmark, FaRightFromBracket } from "react-icons/fa6";

function SettingsBtn({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const res = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (userData?.id) {
      navigator.clipboard.writeText(userData.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsOpen(false);
    if (onClose) onClose();
    navigate("/signin");
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="bg-zinc-400 rounded-md p-1.5 cursor-pointer hover:bg-zinc-300 w-full text-zinc-900 font-medium transition-colors"
      >
        Settings
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-zinc-800 text-zinc-100 rounded-2xl p-6 w-full max-w-md shadow-2xl z-50 border border-zinc-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-amber-50">User Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              {loading ? (
                <p className="text-center text-zinc-400">Loading user info...</p>
              ) : userData ? (
                <>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Username</p>
                    <p className="text-lg font-medium text-zinc-100">{userData.username}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</p>
                    <p className="text-base text-zinc-300">{userData.email}</p>
                  </div>
                  <div className="bg-zinc-700/60 p-4 rounded-xl border border-zinc-600">
                    <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">Your Personal ID</p>
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50">
                      <span className="text-2xl font-mono font-bold text-cyan-300">
                        #{userData.id}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
                      >
                        {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                        <span>{copied ? "Copied" : "Copy ID"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      Share this ID with your friends so they can add you on Uddy.
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-center text-red-400">Could not load user profile.</p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-700 flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <FaRightFromBracket />
                <span>Log out</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsBtn;
