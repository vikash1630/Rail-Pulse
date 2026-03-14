import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const ME = {
  name:       "Vikash Mundakar",
  title:      "Full Stack Developer",
  subtitle:   "Data Analytics Systems Builder",
  location:   "Hyderabad, India",
  year:       "2nd Year · B.Tech CSE · 2024–2028",
  university: "Mahatma Gandhi Institute of Technology",
  bio:        "Full Stack Developer passionate about building scalable web applications, analytics dashboards, and data-driven platforms that transform raw data into meaningful insights.",
  email:      "m.vikash1630@gmail.com",
  github:     "https://github.com/vikash1630",
  linkedin:   "https://linkedin.com/in/vikash-mundakar",
  portfolio:  "https://www.pichu.site/",
}

const STATS = [
  { value: "49,000+", label: "Dataset Records",    icon: "📊", color: "#e8b454" },
  { value: "4+",      label: "Live Projects",       icon: "🚀", color: "#3db87a" },
  { value: "10+",     label: "Technologies",        icon: "⚡", color: "#60a5fa" },
  { value: "2024–28", label: "B.Tech CSE",          icon: "🎓", color: "#c9973a" },
]

const PROJECT_FEATURES = [
  {
    icon:  "📊",
    title: "Revenue Analytics",
    desc:  "Deep-dive revenue breakdowns by zone, train category, and route. Tracks crore-scale earnings with trend analysis and seasonal multipliers.",
    color: "#e8b454",
    tags:  ["React Charts", "Aggregation", "Zone-wise"],
  },
  {
    icon:  "📈",
    title: "Demand Forecasting",
    desc:  "Occupancy rate modeling across 49,000+ records. Visualizes peak season demand, delay probability, and infrastructure pressure points.",
    color: "#60a5fa",
    tags:  ["Occupancy %", "Delay Probability", "Heatmaps"],
  },
  {
    icon:  "🚂",
    title: "Train Intelligence",
    desc:  "Comprehensive train-level analytics covering speed, punctuality scores, coach count, AC ratio, and route classification.",
    color: "#3db87a",
    tags:  ["Punctuality Score", "Speed Analytics", "Coach Data"],
  },
  {
    icon:  "🗺",
    title: "Route & Zone Mapping",
    desc:  "Pan-India route intelligence across Northern, Southern, Eastern, Western, South Central, and more railway zones with stop-level granularity.",
    color: "#c9973a",
    tags:  ["7 Zones", "Pan-India", "Stop Mapping"],
  },
  {
    icon:  "⚡",
    title: "Real-Time Dashboard",
    desc:  "Live-feeling dashboard with animated KPIs, filterable train tables, and drill-down views — all powered by the 49,011-record dataset.",
    color: "#e05252",
    tags:  ["React", "Vite", "Live Filters"],
  },
  {
    icon:  "🔐",
    title: "Auth & User System",
    desc:  "JWT-based authentication with secure login, session management, and role-aware views built on Node.js + Express + MongoDB.",
    color: "#a78bfa",
    tags:  ["JWT Auth", "MongoDB", "Express.js"],
  },
]

const TECH_PILLARS = [
  { label: "Frontend",  value: "React + Vite",       icon: "⚛",  color: "#60a5fa" },
  { label: "Backend",   value: "Node + Express",      icon: "🟢",  color: "#3db87a" },
  { label: "Database",  value: "MongoDB",             icon: "🍃",  color: "#e8b454" },
  { label: "Analytics", value: "Flask + Python",      icon: "🐍",  color: "#c9973a" },
  { label: "Dataset",   value: "49,011 Records",      icon: "🗄",  color: "#e05252" },
  { label: "Deploy",    value: "Vercel + Render",     icon: "🚀",  color: "#a78bfa" },
]

const SKILLS = {
  "Frontend":  ["React", "Vite", "Tailwind CSS", "Bootstrap", "UI/UX Design"],
  "Backend":   ["Node.js", "Express.js", "Flask", "REST APIs", "WebSockets", "Socket.IO"],
  "Languages": ["JavaScript", "Python", "C", "C++", "Java"],
  "Database":  ["MongoDB"],
  "Tools":     ["GitHub", "Postman", "Vercel", "Google Colab"],
  "Analytics": ["Data Analysis", "Big Data Analytics"],
}

const DATASET_HIGHLIGHTS = [
  { label: "Total Records",       value: "49,011",        icon: "🗄" },
  { label: "Railway Zones",       value: "7 Zones",       icon: "🗺" },
  { label: "Train Categories",    value: "12 Types",      icon: "🚂" },
  { label: "Avg Occupancy",       value: "~72%",          icon: "📈" },
  { label: "Routes Covered",      value: "Pan-India",     icon: "🛤" },
  { label: "Revenue Tracked",     value: "₹ Crores",     icon: "💰" },
]

const VALUES = [
  {
    icon:  "🔍",
    title: "Data-Driven",
    desc:  "Every decision backed by analytics. I build systems that turn raw numbers into actionable intelligence.",
    color: "#e8b454",
  },
  {
    icon:  "⚙",
    title: "Full-Stack Mindset",
    desc:  "From database schema to pixel-perfect UI — I own the entire product, end to end.",
    color: "#3db87a",
  },
  {
    icon:  "🚀",
    title: "Ship Fast",
    desc:  "I bias toward building and deploying. Live projects beat polished prototypes that never launch.",
    color: "#60a5fa",
  },
  {
    icon:  "📐",
    title: "Systems Thinking",
    desc:  "I design for scale from day one — modular, maintainable, and built to grow.",
    color: "#c9973a",
  },
]

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
  .ab-page {
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--text-1);
    position: relative;
    overflow-x: hidden;
  }

  /* Grid background */
  .ab-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--glass-border) 1px, transparent 1px),
      linear-gradient(90deg, var(--glass-border) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.45;
  }

  .ab-shell {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.25rem 6rem;
  }

  /* ── HERO ── */
  .ab-hero {
    position: relative;
    margin-bottom: 2.5rem;
    padding: 3rem 2.5rem 2.5rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    overflow: hidden;
  }
  .ab-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ab-hero::after {
    content: 'ABOUT';
    position: absolute;
    right: -1.5rem;
    bottom: -1.5rem;
    font-family: var(--font-display);
    font-size: clamp(5rem, 18vw, 10rem);
    color: rgba(201,151,58,0.04);
    pointer-events: none;
    line-height: 1;
    letter-spacing: 0.06em;
    user-select: none;
  }

  @keyframes hero-scan {
    0%   { top: -30%; opacity: 0.5; }
    100% { top: 110%;  opacity: 0; }
  }
  .ab-scanner {
    position: absolute;
    left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, rgba(201,151,58,0.04), transparent);
    animation: hero-scan 5s ease-in-out infinite;
    pointer-events: none;
  }

  .ab-track-deco {
    position: absolute;
    left: 1.8rem;
    top: 4.5rem;
    bottom: 1.5rem;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      rgba(201,151,58,0.18) 0px, rgba(201,151,58,0.18) 10px,
      transparent 10px, transparent 18px
    );
    pointer-events: none;
  }

  .ab-hero-inner { padding-left: 1rem; }

  .ab-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--gold);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .ab-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
  }

  .ab-name {
    font-family: var(--font-display);
    font-size: clamp(3rem, 10vw, 5.5rem);
    line-height: 0.92;
    letter-spacing: 0.05em;
    background: linear-gradient(130deg, var(--text-1) 0%, var(--gold-light) 55%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.6rem;
  }

  .ab-titles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .ab-badge {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.3rem 0.85rem;
    border-radius: 99px;
    border: 1px solid var(--gold-glow);
    background: var(--gold-pale);
    color: var(--gold-light);
  }
  .ab-badge.blue  { border-color: rgba(96,165,250,0.3);  background: rgba(96,165,250,0.08);  color: #93c5fd; }
  .ab-badge.green { border-color: rgba(61,184,122,0.3);  background: rgba(61,184,122,0.08);  color: #6ee7b7; }
  .ab-badge.red   { border-color: rgba(224,82,82,0.3);   background: rgba(224,82,82,0.08);   color: #fca5a5; }

  .ab-bio {
    font-size: 0.95rem;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 640px;
    margin-bottom: 1.6rem;
  }

  .ab-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .ab-meta-item { display: flex; align-items: center; gap: 0.4rem; }
  .ab-meta-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 6px var(--gold);
  }

  /* ── SECTION LABEL ── */
  .ab-section-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 2.5rem 0 1.2rem;
  }
  .ab-section-label span {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--gold);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .ab-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--gold-glow), transparent);
  }

  /* ── STATS GRID ── */
  .ab-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  @media (min-width: 600px) { .ab-stats-grid { grid-template-columns: repeat(4, 1fr); } }

  .ab-stat-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
    text-align: center;
  }
  .ab-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-stat-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 24px var(--gold-glow);
    border-color: rgba(201,151,58,0.25);
  }
  .ab-stat-card:hover::before { opacity: 1; }

  .ab-stat-icon {
    font-size: 1.6rem;
    width: 48px; height: 48px;
    border-radius: 14px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s;
  }
  .ab-stat-card:hover .ab-stat-icon { transform: scale(1.12) rotate(-6deg); }

  .ab-stat-value {
    font-family: var(--font-display);
    font-size: 2rem;
    letter-spacing: 0.06em;
    line-height: 1;
    color: var(--gold-light);
  }
  .ab-stat-label {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--text-3);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  /* ── STORY / BIO CARD ── */
  .ab-story-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .ab-story-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ab-story-title {
    font-family: var(--font-display);
    font-size: 2rem;
    letter-spacing: 0.05em;
    color: var(--gold-light);
    margin-bottom: 0.3rem;
  }
  .ab-story-sub {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-3);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }
  .ab-story-text {
    font-size: 0.92rem;
    color: var(--text-2);
    line-height: 1.8;
  }
  .ab-story-text + .ab-story-text { margin-top: 0.9rem; }
  .ab-story-highlight {
    color: var(--gold-light);
    font-weight: 600;
  }

  /* ── PROJECT FEATURES GRID ── */
  .ab-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 800px) { .ab-features-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 560px) { .ab-features-grid { grid-template-columns: 1fr; } }

  .ab-feat-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s, border-color 0.28s;
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  .ab-feat-card.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .ab-feat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-feat-card::after {
    content: '';
    position: absolute;
    top: 0; left: -80%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
    transition: left 0.55s ease;
    pointer-events: none;
  }
  .ab-feat-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(201,151,58,0.25);
  }
  .ab-feat-card:hover::before { opacity: 1; }
  .ab-feat-card:hover::after  { left: 150%; }

  .ab-feat-top {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    margin-bottom: 0.8rem;
  }
  .ab-feat-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    border: 1px solid transparent;
    transition: transform 0.28s;
  }
  .ab-feat-card:hover .ab-feat-icon { transform: scale(1.12) rotate(-8deg); }
  .ab-feat-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 0.2rem;
  }
  .ab-feat-desc {
    font-size: 0.82rem;
    color: var(--text-2);
    line-height: 1.65;
    margin-bottom: 0.9rem;
  }
  .ab-feat-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .ab-feat-tag {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    padding: 0.22rem 0.55rem;
    border-radius: 6px;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    color: var(--text-3);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .ab-feat-card:hover .ab-feat-tag {
    border-color: rgba(201,151,58,0.2);
    color: var(--text-2);
  }

  /* ── TECH PILLARS ── */
  .ab-pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem;
  }
  @media (max-width: 600px) { .ab-pillars-grid { grid-template-columns: repeat(2, 1fr); } }

  .ab-pillar {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    padding: 1rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    opacity: 0;
    transform: translateX(-10px);
  }
  .ab-pillar.visible {
    opacity: 1;
    transform: none;
  }
  .ab-pillar:hover {
    transform: translateX(4px);
    border-color: rgba(201,151,58,0.2);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .ab-pillar-icon {
    font-size: 1.3rem;
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.15);
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .ab-pillar:hover .ab-pillar-icon { transform: scale(1.1) rotate(-5deg); }
  .ab-pillar-label {
    font-family: var(--font-mono);
    font-size: 0.56rem;
    color: var(--text-3);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }
  .ab-pillar-value {
    font-family: var(--font-display);
    font-size: 1.05rem;
    letter-spacing: 0.04em;
    line-height: 1;
  }

  /* ── DATASET SPOTLIGHT ── */
  .ab-dataset-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .ab-dataset-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ab-dataset-card::after {
    content: '🚂';
    position: absolute;
    right: 1.5rem;
    bottom: 1rem;
    font-size: 6rem;
    opacity: 0.04;
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  .ab-dataset-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }
  .ab-dataset-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    flex-shrink: 0;
  }
  .ab-dataset-title {
    font-family: var(--font-display);
    font-size: 1.8rem;
    letter-spacing: 0.04em;
    color: var(--gold-light);
    line-height: 1;
    margin-bottom: 0.2rem;
  }
  .ab-dataset-sub {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .ab-dataset-desc {
    font-size: 0.88rem;
    color: var(--text-2);
    line-height: 1.7;
    margin-bottom: 1.4rem;
    max-width: 700px;
  }
  .ab-dataset-pills {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }
  @media (max-width: 600px) { .ab-dataset-pills { grid-template-columns: repeat(2, 1fr); } }

  .ab-dataset-pill {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 0.9rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .ab-dataset-pill:hover {
    border-color: rgba(201,151,58,0.2);
    background: var(--gold-pale);
  }
  .ab-dataset-pill-icon { font-size: 1.1rem; }
  .ab-dataset-pill-info {}
  .ab-dataset-pill-val {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.04em;
    color: var(--gold-light);
    line-height: 1;
  }
  .ab-dataset-pill-label {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    color: var(--text-3);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 0.1rem;
  }

  /* ── VALUES GRID ── */
  .ab-values-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (max-width: 600px) { .ab-values-grid { grid-template-columns: 1fr; } }

  .ab-value-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
  }
  .ab-value-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-value-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201,151,58,0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 24px var(--gold-glow);
  }
  .ab-value-card:hover::before { opacity: 1; }
  .ab-value-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 0.9rem;
    transition: transform 0.25s;
  }
  .ab-value-card:hover .ab-value-icon { transform: scale(1.1) rotate(-6deg); }
  .ab-value-title {
    font-family: var(--font-display);
    font-size: 1.35rem;
    letter-spacing: 0.04em;
    color: var(--gold-light);
    margin-bottom: 0.4rem;
    line-height: 1;
  }
  .ab-value-desc {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.65;
  }

  /* ── SKILLS ── */
  .ab-skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 700px) { .ab-skills-grid { grid-template-columns: repeat(3, 1fr); } }

  .ab-skill-block {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.2rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ab-skill-block:hover {
    border-color: rgba(201,151,58,0.2);
    box-shadow: 0 4px 20px rgba(201,151,58,0.06);
  }
  .ab-skill-block-label {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--gold);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .ab-skill-block-label::before {
    content: '';
    width: 12px; height: 1px;
    background: var(--gold);
  }
  .ab-skill-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .ab-skill-tag {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    padding: 0.28rem 0.6rem;
    border-radius: 8px;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    color: var(--text-2);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .ab-skill-tag:hover {
    color: var(--gold-light);
    border-color: rgba(201,151,58,0.3);
    background: var(--gold-pale);
  }

  /* ── CTA CARD ── */
  .ab-cta-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ab-cta-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ab-cta-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 6vw, 3.5rem);
    letter-spacing: 0.06em;
    background: linear-gradient(130deg, var(--text-1) 0%, var(--gold-light) 55%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.6rem;
    line-height: 1;
  }
  .ab-cta-sub {
    font-size: 0.92rem;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 540px;
    margin: 0 auto 1.8rem;
  }
  .ab-cta-btns {
    display: flex;
    gap: 0.85rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ab-cta-btn-primary {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: none;
    border-radius: 12px;
    padding: 0.85rem 2rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ab-cta-btn-primary::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.4s;
  }
  .ab-cta-btn-primary:hover::after { left: 150%; }
  .ab-cta-btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 24px var(--gold-glow);
  }
  .ab-cta-btn-secondary {
    background: transparent;
    color: var(--text-2);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 0.85rem 2rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .ab-cta-btn-secondary:hover {
    transform: translateY(-2px);
    border-color: rgba(201,151,58,0.35);
    color: var(--gold-light);
    box-shadow: 0 4px 16px var(--gold-glow);
  }

  /* ── RAIL FOOTER ── */
  .ab-rail-footer {
    margin-top: 3.5rem;
    height: 20px;
    position: relative;
  }
  .ab-rail-footer::before,
  .ab-rail-footer::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-glow), transparent);
  }
  .ab-rail-footer::before { top: 4px; }
  .ab-rail-footer::after  { bottom: 4px; }
  .ab-rail-ties {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent, transparent 20px,
      var(--glass-border) 20px, var(--glass-border) 22px
    );
  }

  /* ── ENTRANCE ANIMATIONS ── */
  @keyframes ab-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  .ab-anim   { animation: ab-rise 0.55s cubic-bezier(.22,1,.36,1) both; }
  .ab-a1 { animation-delay: 0.04s; }
  .ab-a2 { animation-delay: 0.12s; }
  .ab-a3 { animation-delay: 0.20s; }
  .ab-a4 { animation-delay: 0.28s; }
  .ab-a5 { animation-delay: 0.36s; }
  .ab-a6 { animation-delay: 0.44s; }
  .ab-a7 { animation-delay: 0.52s; }
  .ab-a8 { animation-delay: 0.60s; }
`

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function About() {
  const [visibleItems, setVisibleItems] = useState(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.dataset.idx]))
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.ab-feat-card, .ab-pillar').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="ab-page">
        <div className="ab-shell">

          {/* ══ HERO ══ */}
          <div className="ab-hero ab-anim ab-a1">
            <div className="ab-scanner" />
            <div className="ab-track-deco" />
            <div className="ab-hero-inner">
              <div className="ab-eyebrow">Railway Intelligence System · About Module</div>
              <h1 className="ab-name">{ME.name}</h1>
              <div className="ab-titles">
                <span className="ab-badge">Full Stack Developer</span>
                <span className="ab-badge blue">Data Analytics Builder</span>
                <span className="ab-badge green">B.Tech CSE · 2024–2028</span>
                <span className="ab-badge red">Open to Internships</span>
              </div>
              <p className="ab-bio">{ME.bio}</p>
              <div className="ab-meta-row">
                <span className="ab-meta-item"><span className="ab-meta-dot" />{ME.location}</span>
                <span className="ab-meta-item"><span className="ab-meta-dot" />{ME.university}</span>
                <span className="ab-meta-item"><span className="ab-meta-dot" />MGIT · B.Tech CSE</span>
              </div>
            </div>
          </div>

          {/* ══ STATS ══ */}
          <div className="ab-section-label ab-anim ab-a2"><span>At a Glance</span></div>
          <div className="ab-stats-grid ab-anim ab-a2">
            {STATS.map(s => (
              <div className="ab-stat-card" key={s.label} style={{ '--stat-color': s.color }}>
                <div className="ab-stat-icon">{s.icon}</div>
                <div className="ab-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="ab-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ══ MY STORY ══ */}
          <div className="ab-section-label ab-anim ab-a3"><span>My Story</span></div>
          <div className="ab-story-card ab-anim ab-a3">
            <div className="ab-story-title">Who I Am</div>
            <div className="ab-story-sub">Builder · Analyst · Student</div>
            <p className="ab-story-text">
              I'm <span className="ab-story-highlight">Vikash Mundakar</span>, a B.Tech CSE student (2024–2028) at{' '}
              <span className="ab-story-highlight">Mahatma Gandhi Institute of Technology, Hyderabad</span>.
              I build full-stack web applications and data analytics platforms — things that are actually useful,
              not just demo projects. My work lives at the intersection of clean engineering and data storytelling.
            </p>
            <p className="ab-story-text">
              The <span className="ab-story-highlight">Railway Intelligence System</span> is my flagship project —
              a complete, production-grade analytics platform built on top of a{' '}
              <span className="ab-story-highlight">49,011-record Indian Railways dataset</span>. It covers
              revenue analytics, demand forecasting, route intelligence, punctuality scoring, and real-time dashboards
              across all major railway zones in India.
            </p>
            <p className="ab-story-text">
              Every module of this system — from the authenticated backend to the animated React dashboards —
              was designed, built, and deployed by me. I'm currently looking for{' '}
              <span className="ab-story-highlight">internship opportunities</span> where I can contribute to
              real products, ship fast, and grow with strong engineering teams.
            </p>
          </div>

          {/* ══ DATASET SPOTLIGHT ══ */}
          <div className="ab-section-label ab-anim ab-a4"><span>Featured Dataset</span></div>
          <div className="ab-dataset-card ab-anim ab-a4">
            <div className="ab-dataset-header">
              <div className="ab-dataset-icon">🚂</div>
              <div>
                <div className="ab-dataset-title">Indian Railways Dataset</div>
                <div className="ab-dataset-sub">Pan-India · Real-World Analytics · 49,000+ Records</div>
              </div>
            </div>
            <p className="ab-dataset-desc">
              The backbone of this platform is a comprehensive dataset covering Indian Railways operations —
              train categories, zone-wise distribution, occupancy rates, delay probabilities, revenue figures,
              punctuality scores, fare ranges, electrification status, and seasonal demand multipliers. This
              powers every dashboard, chart, and insight you see across the platform.
            </p>
            <div className="ab-dataset-pills">
              {DATASET_HIGHLIGHTS.map(d => (
                <div className="ab-dataset-pill" key={d.label}>
                  <span className="ab-dataset-pill-icon">{d.icon}</span>
                  <div className="ab-dataset-pill-info">
                    <div className="ab-dataset-pill-val">{d.value}</div>
                    <div className="ab-dataset-pill-label">{d.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ PROJECT FEATURES ══ */}
          <div className="ab-section-label ab-anim ab-a5"><span>What This System Does</span></div>
          <div className="ab-features-grid">
            {PROJECT_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`ab-feat-card${visibleItems.has(`feat-${i}`) ? ' visible' : ''}`}
                data-idx={`feat-${i}`}
                style={{ transitionDelay: `${i * 0.07}s` }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 14px 40px rgba(0,0,0,0.5), 0 0 32px ${f.color}30`
                  e.currentTarget.style.borderColor = `${f.color}40`
                  e.currentTarget.querySelector('.ab-feat-bar').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.querySelector('.ab-feat-bar').style.opacity = '0'
                }}
              >
                <div
                  className="ab-feat-bar"
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, ${f.color}, ${f.color}88, transparent)`,
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                />
                <div className="ab-feat-top">
                  <div
                    className="ab-feat-icon"
                    style={{ background: `${f.color}18`, borderColor: `${f.color}30` }}
                  >
                    {f.icon}
                  </div>
                  <div className="ab-feat-title" style={{ color: f.color }}>{f.title}</div>
                </div>
                <p className="ab-feat-desc">{f.desc}</p>
                <div className="ab-feat-tags">
                  {f.tags.map(t => <span key={t} className="ab-feat-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* ══ TECH PILLARS ══ */}
          <div className="ab-section-label ab-anim ab-a6"><span>Built With</span></div>
          <div className="ab-pillars-grid">
            {TECH_PILLARS.map((p, i) => (
              <div
                key={p.label}
                className={`ab-pillar${visibleItems.has(`pillar-${i}`) ? ' visible' : ''}`}
                data-idx={`pillar-${i}`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="ab-pillar-icon">{p.icon}</div>
                <div>
                  <div className="ab-pillar-label">{p.label}</div>
                  <div className="ab-pillar-value" style={{ color: p.color }}>{p.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ══ VALUES ══ */}
          <div className="ab-section-label ab-anim ab-a7"><span>How I Work</span></div>
          <div className="ab-values-grid ab-anim ab-a7">
            {VALUES.map(v => (
              <div className="ab-value-card" key={v.title}>
                <div className="ab-value-icon" style={{ background: `${v.color}18`, borderColor: `${v.color}30` }}>
                  {v.icon}
                </div>
                <div className="ab-value-title" style={{ color: v.color }}>{v.title}</div>
                <p className="ab-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* ══ TECH STACK ══ */}
          <div className="ab-section-label ab-anim ab-a8"><span>Tech Stack</span></div>
          <div className="ab-skills-grid ab-anim ab-a8">
            {Object.entries(SKILLS).map(([cat, tags]) => (
              <div className="ab-skill-block" key={cat}>
                <div className="ab-skill-block-label">{cat}</div>
                <div className="ab-skill-tags">
                  {tags.map(t => <span className="ab-skill-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* ══ CTA ══ */}
          <div className="ab-section-label ab-anim ab-a8"><span>Let's Build Together</span></div>
          <div className="ab-cta-card ab-anim ab-a8">
            <div className="ab-cta-title">Open to Opportunities</div>
            <p className="ab-cta-sub">
              I'm actively seeking internships in full-stack development, data engineering, or product analytics.
              If you're building something meaningful and need someone who ships — let's talk.
            </p>
            <div className="ab-cta-btns">
              <a href={`mailto:${ME.email}`} className="ab-cta-btn-primary">
                ✉ Get In Touch
              </a>
              <a href={ME.github} target="_blank" rel="noopener noreferrer" className="ab-cta-btn-secondary">
                ⌥ GitHub
              </a>
              <a href={ME.linkedin} target="_blank" rel="noopener noreferrer" className="ab-cta-btn-secondary">
                in LinkedIn
              </a>
            </div>
          </div>

          {/* ══ RAIL FOOTER ══ */}
          <div className="ab-rail-footer ab-anim ab-a8">
            <div className="ab-rail-ties" />
          </div>

        </div>
      </div>
    </Navbar>
  )
}