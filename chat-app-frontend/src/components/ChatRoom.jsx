import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function ChatRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const username = query.get("username") || "Guest";
  const roomId = query.get("roomId") || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const clientRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // 1️⃣ Fetch old messages & connect WebSocket
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:8080/api/v1/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/chat",
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/rooms/${roomId}`, (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [roomId]);

  // 2️⃣ Send message
  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify({
        roomId,
        sender: username,
        content: input,
      }),
    });

    setInput("");
  };

  // 3️⃣ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <span className="font-semibold text-gray-700">
          Room: <b>{roomId}</b>
        </span>

        <span className="text-gray-700">
          User: <b className="text-emerald-600">{username}</b>
        </span>

        <span>
          {connected ? (
            <b className="text-emerald-600">Connected</b>
          ) : (
            <b className="text-red-500">Disconnected</b>
          )}
        </span>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:opacity-90 transition"
        >
          Leave
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.sender === username;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-sm shadow-md ${
                  isMe
                    ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {!isMe && (
                  <div className="text-xs font-semibold text-gray-500 mb-1">
                    {msg.sender}
                  </div>
                )}

                <div className="break-words">{msg.content}</div>

                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.timeStamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 px-4 py-3 bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-md">
        <input
          ref={inputRef}
          className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={connected ? "Type a message..." : "Disconnected"}
          disabled={!connected}
        />

        <button
          onClick={sendMessage}
          disabled={!connected}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            connected
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:shadow-lg"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
