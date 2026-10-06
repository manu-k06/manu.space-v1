export const journeyMilestones = [
  {
    step: '01',
    id: 'detour',
    summary:
      'A year chasing IIT JEE led me to a different path: learning to code.',
    year: '2024',
    title: 'The Detour',
    category: 'Foundations',
    description:
      'Chased IIT JEE for a year. While the target changed, the grind built intense stamina, self-reliance, and introduced me to coding — realizing that building things from scratch was where I belonged.',
    tags: ['Self-Discipline', 'Algorithms', 'Foundations'],
  },
  {
    step: '02',
    id: 'fisat',
    summary:
      'Joined FISAT to study Computer Science and started shipping my first projects.',
    year: '2025',
    title: 'Touchdown at FISAT',
    category: 'CS fundamentals',
    description:
      'Started B.Tech CS at FISAT, Kerala. Studied computing fundamentals — C, discrete math, data structures, and Linux. Began shipping open-source projects and realized building beats planning.',
    tags: ['C', 'Discrete Math', 'Linux', 'Git'],
  },
  {
    step: '03',
    id: 'first-orbit',
    summary:
      'My first hackathon, a city simulator, and an AI-powered wallpaper project.',
    year: 'EARLY 2026',
    title: 'First Orbit: Hackathons',
    category: 'Hackfit 4.0 & Hack Horizon',
    description:
      'Shipped CivicPulse (city simulation in vanilla JS) live at Hackfit 4.0 with team Hack Horizon. Followed up with PixelForge, an automated wallpaper platform using Gemini AI.',
    tags: ['Hackfit 4.0', 'Vanilla JS', 'Gemini AI'],
    projects: [
      { name: 'CivicPulse', link: 'https://github.com/manu-k06/civic-pulse' },
      { name: 'PixelForge', link: 'https://pixelforge-io.vercel.app/' },
    ],
  },
  {
    step: '04',
    id: 'systems-ai',
    summary:
      'From a Canvas game to full-stack apps and retrieval-augmented AI.',
    year: 'MID 2026',
    title: 'Engines & Full-Stack AI',
    category: 'Full-stack & AI',
    description:
      'Built Bone Runner | Genesis (60 FPS Canvas 2D engine with Supabase anti-cheat). Architected Cineforge (React, FastAPI, Gemini AI streaming) and built RAG Chatbot with ChromaDB.',
    tags: ['Canvas 2D', 'FastAPI', 'Supabase', 'Gemini AI'],
    projects: [
      { name: 'Bone Runner', link: 'https://play-genesis.vercel.app/' },
      { name: 'Cineforge', link: 'https://cineforge-rose.vercel.app' },
      { name: 'RAG Chatbot', link: 'https://github.com/manu-k06/rag-chatbot' },
    ],
  },
  {
    step: '05',
    id: 'current-orbit',
    summary:
      'Studying CS, preparing for GATE, and looking for opportunities to build.',
    year: 'NOW & HORIZON',
    title: 'Current Orbit',
    category: 'Learning & building',
    description:
      'Continuing my Computer Science coursework, preparing for GATE CS, and hunting for software engineering internships. Exploring distributed systems and autonomous AI.',
    tags: ['Computer Science', 'GATE CS', 'Distributed Systems'],
    isCurrent: true,
  },
];
