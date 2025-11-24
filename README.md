# PeerConnect

Campus-first meetup platform to create, browse, and join activities. React + Vite frontend, Express + MongoDB backend, JWT auth, and Render/Vercel-friendly.

## Features
- **Auth & Validation**: Signup/login with JWT, college domain validation (e.g., `@nitc.ac.in`), and email verification via OTP.
- **Activities**: Create, edit, delete (creator), join/leave/waitlist (members), capacity tracking.
- **Real-time Chat**: Group chat for each activity using Socket.IO, with mention support (`@username`).
- **Notifications**: Email notifications for mentions and important updates via **Resend**.
- **Discovery**: Public activity listing, category filter, search, and landing-page highlights.
- **Immersive UI**: Modern "Meetup-like" styling with background video overlays, responsive cards, and glassmorphism effects.

## Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Axios, React Router, Socket.IO Client.
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt, Resend (Email), Socket.IO (Real-time).
- **DB**: MongoDB Atlas (connection via `MONGO_URI`).

## Getting Started (local)
```bash
git clone <repo-url>
cd PeerConnect
```

### Server
```bash
cd server
npm install
cp .env.example .env   # create and fill if you have an example; otherwise create .env with vars below
npm run dev            # or npm start
```
Env required in `server/.env`:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
RESEND_API_KEY=re_123456789...  # Get from Resend Dashboard
FRONTEND_URL=http://localhost:5173
PORT=5000              # optional
```

### Client
```bash
cd client
npm install
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm start
```

Frontend will open at http://localhost:5173 and talk to the local API.

## Deployment

### Backend (Render)
- Deploy `/server` to a Node host (e.g., Render).
- **Build Command:** `npm install`
- **Start Command:** `npm start` (runs `node local.js`)
- **Environment Variables:**
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A strong secret key.
    - `RESEND_API_KEY`: Your Resend API Key.
    - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://peer-connect.space`).

### Frontend (Vercel)
- Deploy `/client` to Vercel.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://peer-connect-xknd.onrender.com`).
- **Custom Domain:** Add `peer-connect.space` in Vercel Settings -> Domains.

## Key Routes
- **API base**: `/api`
  - **Auth**: `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`, `GET /auth/me`
  - **Activities**: `GET /activities`, `POST /activities`, `POST /activities/:id/join`
  - **Chat**: Socket.IO events (`join_room`, `send_message`, `receive_message`)

## Notes/Tips
- Ensure CORS on the server allows your frontend origin.
- Atlas IP allowlist must include your API host (0.0.0.0/0 for Render).
- Update `VITE_API_URL` for each environment (local vs deployed).

## Scripts
- **Server**: `npm run dev` (nodemon), `npm start`
- **Client**: `npm start` (Vite dev with open), `npm run build`, `npm run preview`
