# manu.space (React SPA)

A cinematic, highly customized portfolio built with React, Vite, and modern CSS.

Designed for Manu, a Computer Science Engineering student obsessed with elegant coding, deep space aesthetics, and intentional restraint over complexity. The site features organic animations, a "dark room exposure" loader, custom hooks for parallax and typewriter effects, and fully fluid typography in a blazing fast Single Page Application (SPA).

## Live Project
🌐 [manu-space-v1.vercel.app](https://manu-space-v1.vercel.app)

## Technologies Used
- **Core**: React 18, React Router v6
- **Build Tool**: Vite
- **Styling**: Vanilla CSS3 Custom Properties & Animations (Variables, Keyframes, Mix-Blend-Mode)
- **Hooks Architecture**: Custom React hooks (`useTypewriter`, `useParallax`) with performance optimization (`requestAnimationFrame`)

## Project Structure
```text
src/
├── assets/          # Media & hero imagery
├── components/      # Reusable UI components (Navbar, Footer, Layout, ProjectCard, TimelineItem)
├── data/            # Data-driven content (projectsData, journeyData)
├── hooks/           # Custom React hooks (useTypewriter, useParallax)
├── pages/           # Route views (Home, About, Journey, Projects, Contact)
├── styles/          # Design system & modular stylesheets (base, layout, hero)
├── App.jsx          # Route definitions & nested layouts
└── main.jsx         # React application entry point
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the local Vite development server:
```bash
npm run dev
```
Then navigate to `http://localhost:5173`.

3. Build for production:
```bash
npm run build
```
The output will be placed in `dist/`.
