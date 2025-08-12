# MERN Weather App

A small weather forecasting app built with MongoDB, Express, React, and Node.js. Uses the Open-Meteo API (no key required) and optionally MongoDB for saving favorites.

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (optional). If `MONGODB_URI` is provided, favorites will be persisted; otherwise, the app runs without persistence.

## Quickstart

```bash
# In the project root
npm run setup
npm run dev
```

- Server will run on http://localhost:5000
- Client will run on http://localhost:5173

## Environment
Create `server/.env` (or copy from `.env.example`):

```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/mern_weather
```

MongoDB is optional. If not set, the app will still run, but favorites are stored in memory for the session.

## Root Scripts
- `npm run setup` - installs dependencies in both server and client
- `npm run dev` - runs server and client concurrently
- `npm run server` - runs the backend only
- `npm run client` - runs the frontend only

## Notes
- Weather and geocoding data are provided by Open-Meteo.
- No API key is required.