# Spotify Clone — Frontend

React + Vite + Tailwind CSS frontend for the Spotify Clone MERN backend.

## Setup

### 1. Backend — add CORS support
Open `Spotify-Clone-main/src/app.js` and add BEFORE your routes:

```js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

Install cors in your backend: `npm install cors`

### 2. Place this frontend folder
Put the `frontend` folder inside your main project:
```
Spotify-Clone-main/   ← backend
frontend/             ← this folder
```

### 3. Install & run frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — backend must be running on http://localhost:3000

## Features
- Register as Listener or Artist
- Listener: browse songs, albums, play music with player controls
- Artist: upload tracks, create albums
- JWT cookie auth, mobile responsive
