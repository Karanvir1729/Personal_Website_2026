# Deployment Guide

Deploy your Personal Website to the web.

## Quick Deploy (Recommended)

### Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```
That's it! Vercel auto-detects Vite and handles everything.

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## Manual Build

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview
```

Output: `dist/` folder with static files.

---

## Hosting Options

| Platform | Cost | Setup |
|----------|------|-------|
| [Vercel](https://vercel.com) | Free | Connect GitHub → Auto-deploy |
| [Netlify](https://netlify.com) | Free | Connect GitHub → Auto-deploy |
| [GitHub Pages](https://pages.github.com) | Free | See below |
| [Cloudflare Pages](https://pages.cloudflare.com) | Free | Connect GitHub → Auto-deploy |

---

## GitHub Pages Setup

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/'  // Add this
})
```

2. Build: `npm run build`
3. Push `dist/` to `gh-pages` branch

---

## Firebase Setup (for Chess Multiplayer)

To enable real multiplayer, add `.env`:
```bash
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Add these as environment variables in Vercel/Netlify dashboard.

---

## Custom Domain

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Vercel/Netlify: Settings → Domains → Add
3. Update DNS records as instructed
