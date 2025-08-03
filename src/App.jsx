import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import Login from './Login';
import Signup from './Signup';
import LandingPage from './LandingPage';
import ChatRoomSelect from './ChatRoomSelect';
import ChatRoomGeneral from './ChatRoomGeneral';
import ProblemSelect from "./ProblemSelect";
import './App.css';

function Header() {
  const location = useLocation();
  // Show header on all /chat routes
  if (!location.pathname.startsWith('/chat')) return null;
  return (
    <header className="chat-header">
      <h1>Disaster Management Chat Room</h1>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chatroom-select" element={<ChatRoomSelect />} />
          <Route path="/select-problem/:room" element={<ProblemSelect />} />
          {/* Only allow chat if user is logged in */}
          <Route
            path="/chat/:room"
            element={user ? <ChatRoomGeneral username={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

