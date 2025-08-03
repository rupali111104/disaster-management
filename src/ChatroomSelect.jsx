import React from "react";
import { useNavigate } from "react-router-dom";

const chatrooms = [
  { key: "general", label: "General Chatroom", icon: "💬" },
  { key: "ngo", label: "NGO Chatroom", icon: "🏢" },
  { key: "rescuer", label: "Rescuer Chatroom", icon: "🦺" }
];

const ChatRoomSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (room) => {
    navigate(`/select-problem/${room}`);
  };

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2 style={{ color: "#111", marginBottom: 24 }}>Select a Chat Room</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
        {chatrooms.map((c) => (
          <div
            key={c.key}
            onClick={() => handleSelect(c.key)}
            style={{
              width: 180,
              height: 120,
              background: "#fff",
              border: "2px solid #eee",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              transition: "box-shadow 0.2s, border 0.2s"
            }}
          >
            <span style={{ fontSize: 36, marginBottom: 8 }}>{c.icon}</span>
            <span style={{ color: "#111", fontWeight: 600 }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomSelect;