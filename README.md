# ✦ Vartika — A Universe Built Just For You

A cinematic, magical 3D web experience built with React + Three.js + Framer Motion.

## Setup

```bash
cd vartika-universe
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Adding Photos

Place her photos in `public/photos/`:
- `photo1.jpg` through `photo10.jpg` (or more)

The 10 WhatsApp photos have already been copied automatically.

## Sections

1. **Starfield Landing** — 3000 star particles + name reveal
2. **Constellation Gallery** — Interactive 3D star map with polaroid photos
3. **Cinematic Timeline** — GSAP horizontal scroll with flip cards
4. **Floating Objects** — 3D rose, orb, hearts + reason flip cards
5. **Easter Egg** — Type "vartika" anywhere → rose petal rain
6. **Message In A Bottle** — Animated letter with word-by-word reveal

## Easter Egg

- **Desktop**: Type `vartika` anywhere on the page
- **Mobile**: Tap the site title (footer) 5 times

## Customization

- Edit captions in `ConstellationGallery.jsx`
- Edit moment messages in `CinematicTimeline.jsx`
- Edit the letter in `MessageInABottle.jsx`
- Edit flip card reasons in `FloatingObjects.jsx`

## Deploy to Vercel

```bash
npm run build
# then drag the `dist/` folder to vercel.com/new
# or connect your GitHub repo
```
