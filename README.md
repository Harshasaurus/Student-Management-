# Student Information Management System

This project implements the three-tier problem in [PROBLEM.md](PROBLEM.md).

## Run locally

1. Install Node.js 18 or newer.
2. In `backend`, run `npm install`.
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` to a MongoDB Atlas connection string.
4. Start the API with `npm start` from `backend`.
5. Serve the `frontend` directory with any static server, for example VS Code Live Server, and open `index.html`.

The frontend uses `http://localhost:5000/api` by default. For deployment, set `window.API_URL` before `app.js` or replace it with the Render API URL using Netlify environment/configuration.

## Deploy

- Deploy `backend` as a Render Node web service with build command `npm install`, start command `npm start`, and `MONGODB_URI`, `PORT`, and `FRONTEND_URL` environment variables.
- Deploy `frontend` as a Netlify static site. Set the frontend API URL to the Render service URL.
- In MongoDB Atlas, allow the Render service to connect and create the `studentDB` database with the `students` collection.

Never commit `.env` or real database credentials.
