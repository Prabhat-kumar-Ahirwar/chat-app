import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function JoinCreateRoom() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Join existing room
  const handleJoin = async () => {
    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedUsername || !trimmedRoomId) {
      toast.error("Please enter both name and room ID!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/rooms/${trimmedRoomId}`
      );

      if (!res.ok) {
        toast.error("Room does not exist!");
        return;
      }

      toast.success("Joining room...");
      navigate(
        `/chat?username=${encodeURIComponent(
          trimmedUsername
        )}&roomId=${encodeURIComponent(trimmedRoomId)}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Backend connection failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create room
  const handleCreate = async () => {
    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedUsername || !trimmedRoomId) {
      toast.error("Please enter both name and room ID!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: trimmedRoomId }),
      });

      if (res.status === 409) {
        toast.error("Room already exists!");
        return;
      }

      if (!res.ok) {
        toast.error("Failed to create room!");
        return;
      }

      toast.success("Room created!");
      navigate(
        `/chat?username=${encodeURIComponent(
          trimmedUsername
        )}&roomId=${encodeURIComponent(trimmedRoomId)}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Backend connection failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100">
      <Toaster position="top-center" />

      {/* Card */}
      <div className="w-full max-w-md bg-gradient-to-br from-white/90 to-emerald-50 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">💬</span>
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Join or Create Room
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Your name
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Room ID */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="w-full px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            disabled={loading}
            onClick={handleJoin}
            className={`px-5 py-2 rounded-lg font-medium transition transform hover:scale-105 ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            Join Room
          </button>

          <button
            disabled={loading}
            onClick={handleCreate}
            className={`px-5 py-2 rounded-lg font-medium transition transform hover:scale-105 ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
