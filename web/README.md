# CinemaHub web

The frontend uses Next.js 15 App Router and the real API at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001/api/v1`). Set that value in the deployment environment and provide a reachable backend. This app requires a Node.js host such as Vercel; GitHub Pages cannot run its server components or httpOnly session handling.

Run `npm install`, then `npm run dev` from `web/`.
