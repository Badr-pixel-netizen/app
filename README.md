# CinemaHub

The frontend lives in [web/](./web). It uses Next.js 15 App Router and connects to the real backend through `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api/v1`).

Run `npm install` and `npm run dev` from `web/`. Deployment needs a Node.js host such as Vercel plus the real API. GitHub Pages cannot run Next.js server components or httpOnly session handling.
