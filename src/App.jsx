import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import Login from './Login';
import Signup from './Signup';
import LandingPage from './LandingPage';
import ChatroomSelect from './ChatroomSelect';
import ChatRoomGeneral from './ChatRoomGeneral';
import ChatRoomNGO from './ChatRoomNGO';
import ChatRoomRescuers from './ChatRoomRescuers';
import './App.css';

function Header() {
  const location = useLocation();
  // Only show header on chat page
  if (location.pathname !== '/chat') return null;
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
          <Route path="/chat" element={user ? <ChatroomSelect /> : <Navigate to="/login" />} />
          <Route path="/chat/general" element={user ? <ChatRoomGeneral username={user} /> : <Navigate to="/login" />} />
          <Route path="/chat/ngo" element={user ? <ChatRoomNGO username={user} /> : <Navigate to="/login" />} />
          <Route path="/chat/rescuers" element={user ? <ChatRoomRescuers username={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
