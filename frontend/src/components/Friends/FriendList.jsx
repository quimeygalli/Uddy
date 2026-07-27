import React, { useEffect, useState, useCallback } from "react";
import FriendItem from "./FriendItem";
import AddFriendModal from "./AddFriendModal";
import { FaPlus, FaCheck, FaXmark } from "react-icons/fa6";

function FriendList() {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFriendsData = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      // Get current user id if we haven't yet
      let myId = currentUserId;
      if (!myId) {
        const meRes = await fetch("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          myId = meData.id;
          setCurrentUserId(myId);
        }
      }

      const res = await fetch("http://localhost:8000/api/friends-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
        setIncomingRequests(data.incoming_requests || []);
      }
    } catch (err) {
      console.error("Error fetching friends data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]);

  const handleRespond = async (requestId, action) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/respond-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: requestId, action }),
      });
      if (res.ok) {
        fetchFriendsData();
      }
    } catch (err) {
      console.error(`Failed to ${action} friend request:`, err);
    }
  };

  return (
    <div className="pt-4 space-y-4">
      {/* Incoming Friend Requests */}
      {incomingRequests.length > 0 && (
        <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-600/50">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Incoming Requests</span>
            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full text-[10px]">
              {incomingRequests.length}
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-zinc-700/70 p-2 rounded-lg text-sm border border-zinc-600"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-zinc-100 truncate">
                    {req.sender?.username}
                  </p>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    #{req.sender?.id}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleRespond(req.id, "accept")}
                    title="Accept"
                    className="p-1.5 bg-green-600/30 hover:bg-green-600 text-green-300 hover:text-white rounded-md transition-colors cursor-pointer"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, "decline")}
                    title="Decline"
                    className="p-1.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-md transition-colors cursor-pointer"
                  >
                    <FaXmark className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <div className="text-zinc-300 font-semibold mb-2 flex items-center justify-between">
          <span>Friends</span>
          <span className="text-xs text-zinc-400 font-normal">
            {friends.length}
          </span>
        </div>
        {loading ? (
          <div className="text-xs text-zinc-400 py-2">Loading friends...</div>
        ) : friends.length === 0 ? (
          <div className="text-xs text-zinc-400 py-2 italic">
            No friends yet. Add some below.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {friends.map((item) => {
              const friendUser =
                item.sender?.id === currentUserId ? item.recipient : item.sender;
              return (
                <FriendItem
                  key={item.id}
                  name={friendUser?.username || "Unknown"}
                  id={friendUser?.id}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add Friend Button */}
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-between w-full mt-2 ps-3 pe-4 pt-2.5 pb-2.5 rounded-2xl bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-800 text-zinc-300 cursor-pointer transition-colors"
        >
          <span className="text-sm font-medium group-hover:text-zinc-800">
            Add friend...
          </span>
          <FaPlus className="text-sm group-hover:text-zinc-800" />
        </button>
      </div>

      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFriendsData}
      />
    </div>
  );
}

export default FriendList;
