<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/55307d30-2c1e-498f-af35-f0e462077c78

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

No API keys or `.env` file needed — see below.

## AI backend: Puter.js (no backend, no API keys)

This project uses [Puter.js](https://docs.puter.com) to call AI models (Claude, GPT,
Gemini, etc.) directly from the browser. There is no server-side API and no
`GEMINI_API_KEY` / `OPENROUTER_API_KEY` / etc. to configure anywhere.

- The `<script src="https://js.puter.com/v2/">` tag is already included in `index.html`.
- All AI calls go through `src/lib/puterAi.ts`, which wraps `window.puter.ai.chat(...)`.
- Puter uses a "User-Pays" model: the first time a visitor uses an AI feature, Puter
  asks them to sign in with a free Puter account, which covers their own usage.
  You (the site owner) are never billed for AI usage.

## Deploy on Vercel

The main site is a static Vite build. Deployment:

1. Push this project to a GitHub repo (or import the folder directly in Vercel).
2. In the Vercel dashboard, import the project. Vercel auto-detects Vite.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Environment Variables
   (see "User accounts & login" below).
4. Deploy.

### Deploying via CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

## User accounts & login (Supabase)

This project uses [Supabase](https://supabase.com) for user registration, login,
and editable site content — no custom backend server needed.

**Quick setup:**
1. Create a free project at [supabase.com](https://supabase.com).
2. In your Supabase project: **SQL Editor → New query**, paste the entire contents
   of [`supabase_schema.sql`](./supabase_schema.sql), and run it once.
3. In Supabase: **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. Put them in `.env` (copy from `.env.example`) locally, and in Vercel's
   Environment Variables for production, as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Register your own account from the site's "حساب جديد" (New account) tab, then in
   Supabase **Table Editor → profiles**, set your row's `is_admin` to `true`.

Full details, architecture, and how to promote a user to admin or subscriber are in
**[DOCUMENTATION_AR.md](./DOCUMENTATION_AR.md)**.

## Full code documentation

For a detailed explanation of every file and component in this project (in Arabic),
see **[DOCUMENTATION_AR.md](./DOCUMENTATION_AR.md)**.
