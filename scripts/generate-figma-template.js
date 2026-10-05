const fs = require('fs');

const roadD = `
    M 500,40
    C 520,130 680,190 670,300
    C 650,410 320,330 220,440
    C 130,540 210,680 460,750
    C 710,810 860,830 780,960
    C 710,1080 470,1130 320,1250
    C 170,1350 130,1430 220,1500
    C 300,1580 620,1650 760,1780
    C 850,1880 840,1950 760,1980
    C 640,2050 510,2120 500,2320
`;

const waypoints = [
  { step: '01', x: 220, y: 440, label: 'Base Camp' },
  { step: '02', x: 780, y: 960, label: 'Launchpad' },
  { step: '03', x: 220, y: 1500, label: 'First Orbit' },
  { step: '04', x: 760, y: 1980, label: 'Alpine Ridge' },
  { step: '05', x: 500, y: 2320, label: 'Summit Peak' },
];

const cards = [
  {
    step: '01',
    id: 'Card_01_The_Detour',
    x: 320,
    y: 420,
    w: 320,
    h: 210,
    badge: '01 • 2024',
    category: 'Foundations & Resilience',
    title: 'The Detour',
    desc: 'Chased IIT JEE for a year. The grind built stamina and self-reliance.',
  },
  {
    step: '02',
    id: 'Card_02_Touchdown_FISAT',
    x: 670,
    y: 1090,
    w: 320,
    h: 210,
    badge: '02 • 2025',
    category: 'CS Core & Fundamentals',
    title: 'Touchdown at FISAT',
    desc: 'Mastered C, discrete math, data structures, and Linux.',
  },
  {
    step: '03',
    id: 'Card_03_First_Orbit',
    x: 10,
    y: 1600,
    w: 320,
    h: 230,
    badge: '03 • EARLY 2026',
    category: 'Hackfit 4.0 & Hack Horizon',
    title: 'First Orbit: Hackathons',
    desc: 'Shipped CivicPulse at Hackfit 4.0. Followed up with PixelForge AI.',
  },
  {
    step: '04',
    id: 'Card_04_Engines_AI',
    x: 665,
    y: 2060,
    w: 320,
    h: 300,
    badge: '04 • MID 2026',
    category: 'Deep Engineering & Architecture',
    title: 'Engines & Full-Stack AI',
    desc: 'Bone Runner 2D engine, Cineforge Gemini AI, and RAG Chatbot.',
  },
  {
    step: '05',
    id: 'Card_05_Current_Orbit',
    x: 335,
    y: 2440,
    w: 330,
    h: 220,
    badge: '05 • NOW & HORIZON',
    category: 'Semester 2 & Beyond',
    title: 'Current Orbit',
    desc: 'Semester 2, GATE CS prep, distributed systems & autonomous AI.',
  }
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 2750" width="1000" height="2750" style="background:#0c0b0a;">
  <!-- Dark Mountain Canvas -->
  <rect width="1000" height="2750" fill="#0c0b0a" />

  <!-- Road Layer (Locked Reference) -->
  <g id="Road_Layer_Locked">
    <path d="${roadD.trim()}" stroke="#3c3834" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6" />
    <path d="${roadD.trim()}" stroke="#161514" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <path d="${roadD.trim()}" stroke="#dcd8d4" stroke-width="2.5" stroke-dasharray="12 16" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.75" />
  </g>

  <!-- Waypoint Checkpoints -->
  <g id="Checkpoints_Locked">
${waypoints.map(wp => `    <g id="WP_${wp.step}_${wp.label.replace(/\\s+/g, '_')}">
      <circle cx="${wp.x}" cy="${wp.y}" r="26" fill="none" stroke="#c4b5a4" stroke-width="2" opacity="0.4" />
      <circle cx="${wp.x}" cy="${wp.y}" r="15" fill="#141414" stroke="#c4b5a4" stroke-width="2" />
      <text x="${wp.x}" y="${wp.y + 1}" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="central">${wp.step}</text>
    </g>`).join('\n')}
  </g>

  <!-- Moveable Milestone Cards (Select & Move in Figma) -->
  <g id="Milestone_Cards_Draggable">
${cards.map(c => `    <g id="${c.id}" transform="translate(${c.x}, ${c.y})">
      <rect width="${c.w}" height="${c.h}" rx="6" fill="#181615" stroke="#c4b5a4" stroke-width="1.5" stroke-opacity="0.35" />
      <rect x="16" y="16" width="100" height="18" rx="3" fill="#c4b5a4" fill-opacity="0.12" stroke="#c4b5a4" stroke-width="1" stroke-opacity="0.25" />
      <text x="24" y="29" fill="#c4b5a4" font-family="sans-serif" font-size="9" font-weight="bold">${c.badge}</text>
      <text x="126" y="29" fill="#888888" font-family="sans-serif" font-size="8.5" font-weight="600" letter-spacing="1">${c.category.toUpperCase()}</text>
      <text x="16" y="64" fill="#ffffff" font-family="sans-serif" font-size="17" font-weight="bold">${c.title}</text>
      <text x="16" y="92" fill="#aaaaaa" font-family="sans-serif" font-size="11">${c.desc}</text>
    </g>`).join('\n')}
  </g>
</svg>`;

fs.writeFileSync('public/journey-figma-template.svg', svg);
console.log('Successfully generated public/journey-figma-template.svg');
