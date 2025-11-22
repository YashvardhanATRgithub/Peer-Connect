# PeerConnect

Campus-first meetup platform to create, browse, and join activities. React + Vite frontend, Express + MongoDB backend, JWT auth, and Render/Vercel-friendly.

## Features
- **Auth & Validation**: Signup/login with JWT, college domain validation (e.g., `@nitc.ac.in`), and email verification via OTP.
- **Activities**: Create, edit, delete (creator), join/leave/waitlist (members), capacity tracking.
- **Discovery**: Public activity listing, category filter, search, and landing-page highlights.
- **Immersive UI**: Modern "Meetup-like" styling with background video overlays, responsive cards, and glassmorphism effects.

## Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt, Nodemailer.
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
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
PORT=5000              # optional
```

### Client
```bash
cd client
npm install
echo "VITE_API_BASE=http://localhost:5000/api" > .env.local
npm start
```

Frontend will open at http://localhost:5173 and talk to the local API.

## Deployment
- **API**: Deploy `/server` to a Node host (e.g., Render). Set envs `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`. Use start command `npm start`.
- **Web**: Deploy `/client` to Vercel. Set env `VITE_API_BASE=https://<your-api-domain>/api`. Build command `npm run build`, output `dist`.

## Key Routes
- **API base**: `/api`
  - **Auth**: `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/me`
  - **Activities**: `GET /activities`, `GET /activities/:id`, `POST /activities`, `PUT /activities/:id`, `DELETE /activities/:id`, `POST /activities/:id/join`, `POST /activities/:id/leave`

## Notes/Tips
- Ensure CORS on the server allows your frontend origin.
- Atlas IP allowlist must include your API host.
- Update `VITE_API_BASE` for each environment (local vs deployed).

## Scripts
- **Server**: `npm run dev` (nodemon), `npm start`
- **Client**: `npm start` (Vite dev with open), `npm run build`, `npm run preview`
