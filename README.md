# Disaster Management Platform

A real-time disaster management coordination platform that enables immediate communication between affected communities, NGOs, rescue workers, and disaster response personnel during crises.

## Features

🌍 **Real-Time Messaging** - Live chat rooms with instant message broadcasting  
📍 **Location-Based Coordination** - Share precise coordinates and filter messages by region  
🖼️ **Rich Media Support** - Send images (up to 1MB) with messages for situation documentation  
🏥 **Disaster Type Triage** - Categorize needs: food, shelter, medical, rescue, water, electricity, transport  
🗺️ **Interactive Maps** - Visualize incident locations using Leaflet with geolocation detection  
💾 **Persistent Chat History** - Messages saved to disk, restored on server restart  
🔐 **User Authentication** - Secure password hashing with bcrypt  

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + Vite |
| Backend | Express.js 4 + Socket.IO 4 |
| Authentication | bcrypt (password hashing) |
| Mapping | Leaflet + react-leaflet |
| Routing | React Router v7 |
| Database | JSON file (messages.json) |
| Containerization | Docker (Node 18) |

## Project Structure

```
disaster-management/
├── src/                          # React frontend
│   ├── App.jsx                  # Router & auth state
│   ├── LandingPage.jsx          # Marketing homepage
│   ├── Login.jsx, Signup.jsx    # Auth forms
│   ├── ChatRoom.jsx             # Core chat + map
│   ├── ProblemSelect.jsx        # Disaster type picker
│   ├── ChatroomSelect.jsx       # Chat room selector
│   ├── MapView.jsx              # Leaflet wrapper
│   ├── App.css, ChatRoom.css    # Styling
│   └── main.jsx                 # React entry point
├── server/                       # Express backend
│   ├── index.js                 # Server & Socket.IO handlers
│   ├── auth.js                  # Login/register routes
│   ├── messages.js              # Message utilities
│   ├── messages.json            # Persisted chat history
│   └── package.json             # Backend dependencies
├── Dockerfile                    # Container config
├── vite.config.js               # Vite build config
└── package.json                 # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rupali111104/disaster-management.git
   cd disaster-management
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Development

**Terminal 1 - Start the backend server:**
```bash
node server/index.js
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Start the frontend dev server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Available Scripts

```bash
# Frontend
npm run dev       # Start dev server with HMR
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint

# Backend
cd server && npm start
```

### Production Build & Deployment

**Using Docker:**
```bash
# Build the image
docker build -t disaster-management .

# Run the container
docker run -p 5000:5000 disaster-management
```

The Docker setup:
- Builds the React frontend with Vite
- Installs backend dependencies
- Serves the static frontend from Express
- Runs the server on port 5000

## Usage Guide

### 1. **Create an Account**
   - Navigate to `/signup`
   - Enter username and password
   - Passwords are hashed with bcrypt for security

### 2. **Login**
   - Navigate to `/login`
   - Enter your credentials
   - On success, redirected to chatroom selection

### 3. **Select Disaster Type**
   - Choose the problem type (Food, Medical, Shelter, Rescue, etc.)
   - Each type groups related requests together

### 4. **Join a Chat Room**
   - Select a chat room: General, NGO, or Rescuers
   - Based on your role in the disaster response

### 5. **Send Messages**
   - Type your message
   - Optionally attach up to multiple images (1MB each)
   - Click the map to pin a location
   - Your region is auto-detected via geolocation
   - Click "Send"

### 6. **Filter by Location**
   - Use the region dropdown to see messages from specific areas
   - Messages show region badges (🏙️ City name)
   - Map displays all message locations as markers

### 7. **Track Locations**
   - Click "Detect My Location" to use geolocation
   - Finds nearest city using Haversine distance formula
   - Click map to manually pin locations

## Key Features Explained

### Real-Time Messaging
- Socket.IO establishes WebSocket connections
- Messages broadcast to all connected clients
- Chat history loaded on connection

### Location Filtering
The app includes coordinates for 17 Indian cities:
- Delhi, Mumbai, Chennai, Kolkata, Bangalore
- Hyderabad, Pune, Jaipur, Lucknow
- Guntur, Vijayawada, Visakhapatnam, Tirupati
- Nellore, Kurnool, Rajahmundry, Kadapa

Haversine formula calculates distance to find nearest city.

### Message Persistence
- All messages saved to `server/messages.json`
- Loaded on server startup
- Survives server restarts

### Authentication
- In-memory user store (development)
- Passwords hashed with bcrypt (salt rounds: 10)
- No JWT/sessions yet (can be added)

## Example Chat Message

```javascript
{
  user: "john_doe",
  text: "Emergency! Need medical help at coordinates...",
  time: "2:45 PM",
  images: ["data:image/png;base64,..."],
  location: [28.6139, 77.2090],        // [latitude, longitude]
  region: "Delhi"
}
```

## API Endpoints

### Authentication
```
POST /api/register
Body: { username, password }
Response: { message: "User registered successfully." }

POST /api/login
Body: { username, password }
Response: { message: "Login successful.", username: "john_doe" }
```

### Socket Events
```
// Client → Server
'chat message' - Send a message
  Data: { text, user, time, images, location, region }

// Server → Client
'chat history' - Receive chat history on connect
'chat message' - Receive new message
```

## Limitations & Future Improvements

### Current Limitations
- In-memory user authentication (lost on restart)
- File-based message storage (not scalable)
- No user roles or permissions system
- Authentication doesn't use JWT or sessions
- Single-threaded (no clustering)

### Suggested Enhancements
- [ ] PostgreSQL/MongoDB for persistent storage
- [ ] JWT tokens for stateless authentication
- [ ] User roles: Admin, NGO, Rescuer, Citizen
- [ ] Database indices for geo-spatial queries
- [ ] Message search and filtering
- [ ] Image upload to cloud storage (AWS S3, Cloudinary)
- [ ] Notifications and alerts
- [ ] Admin dashboard for incident tracking
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## Configuration

### Environment Variables
```
PORT=5000                    # Backend port
NODE_ENV=development|production
```

### Client Configuration
Update `ChatRoom.jsx` to change:
- Socket server URL: `io('http://localhost:5000')`
- Image size limit: `if (file.size > 1 * 1024 * 1024)`
- Supported regions (REGIONS array)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `CORS error` | Ensure frontend and backend URLs match in Socket.IO config |
| `Cannot connect to server` | Check backend is running on port 5000 |
| `Image upload fails` | Ensure images are < 1MB |
| `Location detection fails` | Check browser geolocation permissions |
| `Messages not persisting` | Verify `server/messages.json` is writable |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open a GitHub issue or contact the maintainer at [rupali111104](https://github.com/rupali111104).

## Acknowledgments

- Built with React, Express, and Socket.IO
- Maps powered by Leaflet
- Security features via bcrypt
- Inspired by real-world disaster management needs

---

**Last Updated:** August 2025  
**Status:** Active Development
