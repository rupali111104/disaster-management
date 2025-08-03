import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const problems = [
  { key: "food", label: "Food Required", icon: "🍛" },
  { key: "medical", label: "Medical Help", icon: "🩺" },
  { key: "shelter", label: "Shelter Needed", icon: "🏠" },
  { key: "rescue", label: "Rescue Needed", icon: "🚨" },
  { key: "water", label: "Water Supply", icon: "💧" },
  { key: "electricity", label: "Electricity Issue", icon: "💡" },
  { key: "transport", label: "Transport Issue", icon: "🚌" },
  { key: "other", label: "Other", icon: "❓" }
];

const ProblemSelect = () => {
  const navigate = useNavigate();
  const { room } = useParams();

  const handleSelect = (problem) => {
    navigate(`/chat/${room}?problem=${problem}`);
  };

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2 style={{ color: "#111", marginBottom: 24 }}>Select the Problem You Are Facing</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
        {problems.map((p) => (
          <div
            key={p.key}
            onClick={() => handleSelect(p.key)}
            style={{
              width: 160,
              height: 160,
              background: "#fff",
              border: "2px solid #eee",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              transition: "box-shadow 0.2s, border 0.2s"
            }}
          >
            <span style={{ fontSize: 48, marginBottom: 12 }}>{p.icon}</span>
            <span style={{ color: "#111", fontWeight: 600 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSelect;