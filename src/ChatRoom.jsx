import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatRoom.css';
import MapView from './MapView';

const socket = io('http://localhost:5000');

function getInitials(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

const REGIONS = [
  'All',
  'Delhi',
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Guntur',
  'Vijayawada',
  'Visakhapatnam',
  'Tirupati',
  'Nellore',
  'Kurnool',
  'Rajahmundry',
  'Kadapa',
];

// Helper: get distance between two lat/lng points (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Demo: city coordinates
const REGION_COORDS = {
  'Delhi': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Guntur': [16.3067, 80.4365],
  'Vijayawada': [16.5062, 80.6480],
  'Visakhapatnam': [17.6868, 83.2185],
  'Tirupati': [13.6288, 79.4192],
  'Nellore': [14.4426, 79.9865],
  'Kurnool': [15.8281, 78.0373],
  'Rajahmundry': [17.0005, 81.8040],
  'Kadapa': [14.4674, 78.8241],
};

const ROOM_LABELS = {
  general: "General Chatroom",
  ngo: "NGO Chatroom",
  rescuers: "Rescuers Chatroom"
};

const ChatRoom = ({ username, room = "general" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]); // Array of images
  const [imagePreviews, setImagePreviews] = useState([]); // Array of previews
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [userRegion, setUserRegion] = useState(REGIONS[1]); // Default to Delhi
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const fileInputRef = useRef();

  useEffect(() => {
    // Listen for chat history from server
    socket.on('chat history', (history) => {
      setMessages(history);
    });
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('chat history');
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!username || !username.trim()) return;
    if (input.trim() || images.length > 0 || selectedLocation) {
      const msg = {
        text: input,
        user: username,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        images: images.length > 0 ? images : null,
        location: selectedLocation ? selectedLocation.position : null,
        region: userRegion,
      };
      socket.emit('chat message', msg);
      setInput('');
      setImages([]);
      setImagePreviews([]);
      setSelectedLocation(null);
      // Clear the file input value so a new image can be selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let newImages = [];
    let newPreviews = [];
    for (let file of files) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        setError('Each image must be less than 1MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
    setError('');
    let filesProcessed = 0;
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages[idx] = ev.target.result;
        newPreviews[idx] = ev.target.result;
        filesProcessed++;
        if (filesProcessed === files.length) {
          setImages(newImages);
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMapClick = (e) => {
    setSelectedLocation({ position: [e.latlng.lat, e.latlng.lng], label: 'Selected Location' });
  };

  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find nearest region
        let nearest = 'Delhi';
        let minDist = Infinity;
        Object.entries(REGION_COORDS).forEach(([region, [lat, lng]]) => {
          const dist = getDistanceFromLatLonInKm(latitude, longitude, lat, lng);
          if (dist < minDist) {
            minDist = dist;
            nearest = region;
          }
        });
        setUserRegion(nearest);
        setSelectedRegion(nearest);
      },
      () => alert('Unable to retrieve your location.')
    );
  };

  const filteredMessages = selectedRegion === 'All'
    ? messages
    : messages.filter(m => m.region === selectedRegion);

  return (
    <>
      <div className="chat-room-bg-illustration"></div>
      <div className="main-chat-content">
        <h2 style={{textAlign: 'center', color: '#1976d2', margin: '24px 0 0 0', fontWeight: 800, fontSize: '2rem', letterSpacing: '1px'}}>{ROOM_LABELS[room] || "Chatroom"}</h2>
        <div className="chat-messages" ref={chatMessagesRef}>
          {filteredMessages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <div className="chat-meta">
                <span className="avatar" style={{background: '#1976d2', color: '#fff'}}>{getInitials(msg.user)}</span>
                <span className="chat-username">{msg.user}</span>
                <span className="chat-time">{msg.time}</span>
                {msg.region && <span style={{ marginLeft: 12, color: '#00bcd4', fontWeight: 600, fontSize: '0.98em' }}>🏙️ {msg.region}</span>}
              </div>
              <div className="chat-text">{msg.text}</div>
              {/* Show all images if present */}
              {msg.images && Array.isArray(msg.images) && msg.images.map((img, i) => (
                <img key={i} src={img} alt="chat-img" className="chat-img" />
              ))}
              {/* For backward compatibility with old messages */}
              {msg.image && !msg.images && <img src={msg.image} alt="chat-img" className="chat-img" />}
              {/* Show location info if present */}
              {msg.location && (
                <div className="chat-location-info" style={{ color: '#1976d2', fontSize: '0.95em', marginTop: 4 }}>
                  📍 Location: [{msg.location[0].toFixed(4)}, {msg.location[1].toFixed(4)}]
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form full-window-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <label className="file-upload-label">
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} />
            <span>📷</span>
          </label>
          <button type="submit">Send</button>
        </form>
        {imagePreviews.length > 0 && (
          <div className="image-preview-container">
            {imagePreviews.map((img, i) => (
              <div key={i} style={{display: 'inline-block', position: 'relative', marginRight: 8}}>
                <img src={img} alt="preview" className="image-preview" />
                <button className="remove-image-btn" onClick={() => {
                  setImages(images.filter((_, idx) => idx !== i));
                  setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
                }}>Remove</button>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', margin: '8px 0' }}>{error}</div>
        )}
        <div style={{ padding: '16px 32px 0 32px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label htmlFor="region-filter" style={{ fontWeight: 600, color: '#1976d2' }}>Filter by region/city:</label>
          <select id="region-filter" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #4dd0e1', fontSize: '1rem' }}>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <button type="button" onClick={detectMyLocation} style={{ marginLeft: 8, padding: '6px 14px', borderRadius: 8, border: '1.5px solid #4dd0e1', background: '#e3f2fd', color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>
            Detect My Location
          </button>
          <span style={{ marginLeft: 'auto', color: '#888', fontSize: '0.98rem' }}>
            Your region/city:
            <select value={userRegion} onChange={e => setUserRegion(e.target.value)} style={{ marginLeft: 8, padding: '4px 10px', borderRadius: 8, border: '1.5px solid #4dd0e1', fontSize: '1rem' }}>
              {REGIONS.filter(r => r !== 'All').map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </span>
        </div>
        <div className="map-section">
          <MapView
            markers={[
              ...filteredMessages.filter(m => m.location).map(m => ({ position: m.location, label: m.user + (m.text ? ': ' + m.text : '') })),
              ...(selectedLocation ? [selectedLocation] : [])
            ]}
            onMapClick={handleMapClick}
          />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
