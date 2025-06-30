import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const ChatroomSelect = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-page-outer">
      <div className="auth-center-wrapper">
        <div className="auth-container" style={{maxWidth: 420}}>
          <h2>Select a Chatroom</h2>
          <div style={{display: "flex", flexDirection: "column", gap: 24, width: "100%"}}>
            <button className="landing-btn primary" onClick={() => navigate("/chat/general")}>General Chatroom</button>
            <button className="landing-btn secondary" onClick={() => navigate("/chat/ngo")}>NGO Chatroom</button>
            <button className="landing-btn secondary" onClick={() => navigate("/chat/rescuers")}>Rescuers Chatroom</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatroomSelect;
