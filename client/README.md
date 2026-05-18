# Shakti Bill — Client (Vercel-ready)

This is the React + Vite frontend for Shakti Dairy Billing.

## Why your previous deploy was a white screen

Two things must be true on Vercel:

1. **SPA fallback** — any non-root URL (e.g. `/login`, `/invoice/123`) must serve `index.html`. Fixed by `vercel.json` in this folder.
2. **API URL env var** — `src/lib/supabase.js` reads `VITE_API_URL`. If it's not set in Vercel, the deployed site calls `http://localhost:4000` and every request fails → blank screen after login attempt.
3. **The build must actually produce `dist/`** — if Vercel can't find your build output, you get 404s on `/assets/*.js` (exactly the error you saw). The `vercel.json` here pins `outputDirectory: "dist"` and `buildCommand: "npm run build"`.

The favicon reference to `/vite.svg` was also removed (was causing a harmless 404).

---

## Deploy — Option A (recommended: let Vercel build from source)

1. Unzip this folder.
2. Push to a new GitHub repo:
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. Go to https://vercel.com/new → **Import** the repo.
   - Framework: **Vite** (auto-detected — do NOT override)
   - Build command: `npm run build` (auto)
   - Output directory: `dist` (auto)
4. **Before clicking Deploy**, open **Environment Variables** and add:
   - Key: `VITE_API_URL`
   - Value: your backend URL, e.g. `https://shakti-bill-api.onrender.com`
   (No trailing slash. Must start with `https://`.)
5. Click **Deploy**.

If you later change `VITE_API_URL`, you must **Redeploy** — Vite bakes env vars at build time.

## Deploy — Option B (drag & drop the pre-built `dist/`)

If the Vercel build keeps failing, build locally then upload the output:

```bash
npm install
# edit src/lib/supabase.js OR create a .env file with:
#   VITE_API_URL=https://your-api.example.com
npm run build
```

Then on https://vercel.com/new → **"Deploy without Git"** → drag the `dist/` folder.
(With this path you still need `vercel.json` next to `dist/`, or just rely on Vercel's Vite preset for SPA fallback.)

---

## Backend (Express + MongoDB)

Vercel is for the frontend. Host the `server/` folder separately:

- **Render.com** (free tier, easiest): New → Web Service → connect repo → root `server/` → build `npm install` → start `npm start`.
- **Railway.app**: similar flow.

Set these env vars on the backend host:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `PORT` — usually set automatically by the host
- `CORS_ORIGIN` — your Vercel URL, e.g. `https://shakti-bill.vercel.app`

Make sure the backend's CORS allows your Vercel domain. In `server/index.js`:
```js
app.use(cors({ origin: [/\.vercel\.app$/, 'http://localhost:5173'], credentials: true }));
```

Then copy the live backend URL into Vercel's `VITE_API_URL` env var and redeploy the frontend.

---

## Local development

```bash
npm install
echo "VITE_API_URL=http://localhost:4000" > .env
npm run dev
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| White screen, 404 on `/assets/*.js` | Vercel didn't build, or output dir wrong | Keep `vercel.json` as shipped; check Vercel build logs |
| White screen, no console errors | `VITE_API_URL` missing → app crashes on first API call | Add env var in Vercel, redeploy |
| 404 on page refresh / deep links | SPA fallback missing | Keep `vercel.json` rewrites rule |
| CORS errors | Backend doesn't allow Vercel domain | Update `cors()` config on backend |
| Login works locally but not in prod | env var not redeployed | Vercel → Deployments → Redeploy |
