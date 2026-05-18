# Shakti Dairy Billing — Client

Vite + React 18 + Tailwind. SPA that talks to an Express API (Supabase-backed).

## Run locally

```bash
npm install
cp .env.example .env        # then edit VITE_API_URL
npm run dev                 # http://localhost:5173
```

## Build

```bash
npm run build               # outputs to ./dist
npm run preview             # serve the build locally
```

## Deploy to Vercel

1. Push this folder to a GitHub/GitLab repo.
2. On https://vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Leave build command (`npm run build`) and output directory (`dist`) as-is.
4. **Environment Variables** → add:
   - `VITE_API_URL` = `https://your-api.example.com`  (your deployed Express backend URL — no trailing slash)
5. Click **Deploy**.

The included `vercel.json` adds the SPA rewrite so deep links like `/invoices/123` work after refresh.

### Why the previous deploy showed a blank white screen

Two things were missing:

1. **No SPA fallback** — Vercel returned 404 for any route other than `/`, and on first paint the bundle couldn't hydrate the route. Fixed by `vercel.json` rewrites → `/index.html`.
2. **`VITE_API_URL` not set** — `src/lib/supabase.js` fell back to `http://localhost:4000`, so every auth/data request failed on the deployed site (browser can't reach your laptop). Fixed by setting the env var in Vercel.

Also make sure the backend's CORS allows your Vercel domain (e.g. `https://your-app.vercel.app`).

## Deploy via CLI (alternative)

```bash
npm i -g vercel
vercel              # first deploy (preview)
vercel --prod       # production
```

Set the env var with: `vercel env add VITE_API_URL`
