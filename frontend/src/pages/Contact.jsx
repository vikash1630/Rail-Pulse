import React, { useState } from 'react'
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
  phone:      "+91 9573696792",
  github:     "https://github.com/vikash1630",
  linkedin:   "https://linkedin.com/in/vikash-mundakar",
  portfolio:  "https://www.pichu.site/",
}

const SKILLS = {
  "Frontend":  ["React", "Vite", "Tailwind CSS", "Bootstrap", "UI/UX Design"],
  "Backend":   ["Node.js", "Express.js", "Flask", "REST APIs", "WebSockets", "Socket.IO"],
  "Languages": ["JavaScript", "Python", "C", "C++", "Java"],
  "Database":  ["MongoDB"],
  "Tools":     ["GitHub", "Postman", "Vercel", "Google Colab"],
  "Analytics": ["Data Analysis", "Big Data Analytics"],
}

const PROJECTS = [
  {
    name: "Local Lynk",
    tag:  "E-Commerce Platform",
    desc: "Community-driven marketplace connecting local sellers and buyers with scalable backend and responsive UI.",
    live: "https://local-lynk.vercel.app/",
    icon: "🛒",
  },
  {
    name: "IPL Analytics",
    tag:  "Dashboard",
    desc: "Flask-based analytics dashboard visualizing IPL match and player statistics through interactive charts.",
    live: "https://ipl-analytics-dashboard-htof.onrender.com",
    icon: "📊",
  },
  {
    name: "Solo Levelling",
    tag:  "Fitness Tracker",
    desc: "Full-stack fitness tracking application with workout tracking, progress leveling, and gamification.",
    live: "https://solo-levelling-fitness-model-app.onrender.com",
    icon: "⚡",
  },
  {
    name: "Advanced Notes",
    tag:  "Notes App",
    desc: "Secure full-stack notes management system with authentication and real-time updates.",
    live: "https://notes-app-mwwd.onrender.com/",
    icon: "📝",
  },
]

const LINKS = [
  { label: "GitHub",    href: ME.github,               icon: "⌥", color: "#e8b454" },
  { label: "LinkedIn",  href: ME.linkedin,              icon: "in", color: "#60a5fa" },
  { label: "Portfolio", href: ME.portfolio,             icon: "◈",  color: "#3db87a" },
  { label: "Email",     href: `mailto:${ME.email}`,     icon: "✉",  color: "#e05252" },
]

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
  .ct-page {
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--text-1);
    position: relative;
    overflow-x: hidden;
  }

  /* grid bg */
  .ct-page::before {
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

  .ct-shell {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.25rem 6rem;
  }

  /* ── HERO ── */
  .ct-hero {
    position: relative;
    margin-bottom: 2.5rem;
    padding: 3rem 2.5rem 2.5rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    overflow: hidden;
  }
  .ct-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ct-hero::after {
    content: 'CONTACT';
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
  .ct-scanner {
    position: absolute;
    left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, rgba(201,151,58,0.04), transparent);
    animation: hero-scan 5s ease-in-out infinite;
    pointer-events: none;
  }

  .ct-track-deco {
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

  .ct-hero-inner { padding-left: 1rem; }

  .ct-eyebrow {
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
  .ct-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
  }

  .ct-name {
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

  .ct-titles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .ct-badge {
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
  .ct-badge.blue  { border-color: rgba(96,165,250,0.3);  background: rgba(96,165,250,0.08);  color: #93c5fd; }
  .ct-badge.green { border-color: rgba(61,184,122,0.3);  background: rgba(61,184,122,0.08);  color: #6ee7b7; }

  .ct-bio {
    font-size: 0.95rem;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 640px;
    margin-bottom: 1.6rem;
  }

  .ct-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .ct-meta-item { display: flex; align-items: center; gap: 0.4rem; }
  .ct-meta-dot  {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 6px var(--gold);
  }

  /* ── SECTION LABEL ── */
  .ct-section-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 2.5rem 0 1.2rem;
  }
  .ct-section-label span {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--gold);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .ct-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--gold-glow), transparent);
  }

  /* ── QUICK LINKS ── */
  .ct-links-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem;
    margin-bottom: 0.5rem;
  }
  @media (min-width: 600px) { .ct-links-grid { grid-template-columns: repeat(4, 1fr); } }

  .ct-link-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.2rem 1rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    text-decoration: none;
    color: var(--text-2);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, color 0.22s;
  }
  .ct-link-card:hover { transform: translateY(-5px) scale(1.02); color: var(--text-1); }

  .ct-link-icon {
    font-family: var(--font-display);
    font-size: 1.5rem;
    line-height: 1;
    width: 44px; height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    transition: transform 0.25s;
  }
  .ct-link-card:hover .ct-link-icon { transform: scale(1.15) rotate(-6deg); }

  /* ── DIRECT CONTACT ── */
  .ct-contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  @media (max-width: 560px) { .ct-contact-grid { grid-template-columns: 1fr; } }

  .ct-contact-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem 1.6rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: var(--text-1);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .ct-contact-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ct-contact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px var(--gold-glow);
    border-color: rgba(201,151,58,0.25);
  }
  .ct-contact-card:hover::before { opacity: 1; }

  .ct-contact-icon-wrap {
    width: 46px; height: 46px;
    border-radius: 14px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .ct-contact-card:hover .ct-contact-icon-wrap { transform: scale(1.1) rotate(-5deg); }

  .ct-contact-label {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--text-3);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
  }
  .ct-contact-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--gold-light);
    word-break: break-all;
  }

  /* ── EDUCATION ── */
  .ct-edu-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 1.8rem 2rem;
    position: relative;
    overflow: hidden;
  }
  .ct-edu-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ct-edu-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }
  .ct-edu-icon {
    width: 60px; height: 60px;
    border-radius: 16px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    flex-shrink: 0;
  }
  .ct-edu-degree {
    font-family: var(--font-display);
    font-size: 1.5rem;
    letter-spacing: 0.04em;
    color: var(--gold-light);
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .ct-edu-uni {
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 0.2rem;
  }
  .ct-edu-meta {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-3);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* ── SKILLS ── */
  .ct-skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 700px) { .ct-skills-grid { grid-template-columns: repeat(3, 1fr); } }

  .ct-skill-block {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.2rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ct-skill-block:hover {
    border-color: rgba(201,151,58,0.2);
    box-shadow: 0 4px 20px rgba(201,151,58,0.06);
  }
  .ct-skill-block-label {
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
  .ct-skill-block-label::before {
    content: '';
    width: 12px; height: 1px;
    background: var(--gold);
  }
  .ct-skill-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .ct-skill-tag {
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
  .ct-skill-tag:hover {
    color: var(--gold-light);
    border-color: rgba(201,151,58,0.3);
    background: var(--gold-pale);
  }

  /* ── PROJECTS ── */
  .ct-projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 640px) { .ct-projects-grid { grid-template-columns: 1fr; } }

  .ct-proj-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--text-1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .ct-proj-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ct-proj-card::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
    transition: left 0.55s ease;
    pointer-events: none;
  }
  .ct-proj-card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 12px 36px rgba(0,0,0,0.4), 0 0 30px var(--gold-glow);
    border-color: rgba(201,151,58,0.25);
  }
  .ct-proj-card:hover::before { opacity: 1; }
  .ct-proj-card:hover::after  { left: 150%; }

  .ct-proj-top { display: flex; align-items: flex-start; gap: 0.85rem; }
  .ct-proj-emoji {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .ct-proj-card:hover .ct-proj-emoji { transform: scale(1.1) rotate(-8deg); }
  .ct-proj-titles { flex: 1; }
  .ct-proj-name {
    font-family: var(--font-display);
    font-size: 1.4rem;
    line-height: 1;
    letter-spacing: 0.04em;
    color: var(--gold-light);
  }
  .ct-proj-tag {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: 0.2rem;
  }
  .ct-proj-desc {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.6;
  }
  .ct-proj-link {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: auto;
  }
  .ct-proj-link::after { content: '→'; transition: transform 0.2s; }
  .ct-proj-card:hover .ct-proj-link::after { transform: translateX(4px); }

  /* ── FORM ── */
  .ct-form-wrap {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .ct-form-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ct-form-title {
    font-family: var(--font-display);
    font-size: 2rem;
    letter-spacing: 0.05em;
    color: var(--gold-light);
    margin-bottom: 0.3rem;
  }
  .ct-form-sub {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-3);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 1.8rem;
  }
  .ct-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 580px) { .ct-form-grid { grid-template-columns: 1fr; } }

  .ct-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .ct-field.full { grid-column: 1 / -1; }
  .ct-field label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-3);
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .ct-field input,
  .ct-field textarea {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    color: var(--text-1);
    font-family: var(--font-body);
    font-size: 0.88rem;
    padding: 0.7rem 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: none;
    width: 100%;
  }
  .ct-field input::placeholder,
  .ct-field textarea::placeholder { color: var(--text-3); font-size: 0.82rem; }
  .ct-field input:focus,
  .ct-field textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
  }
  .ct-field textarea { min-height: 120px; }

  .ct-submit-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.2rem;
    flex-wrap: wrap;
  }
  .ct-submit-btn {
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
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ct-submit-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.4s;
  }
  .ct-submit-btn:hover::after { left: 150%; }
  .ct-submit-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 24px var(--gold-glow);
  }
  .ct-submit-note {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-3);
    letter-spacing: 0.1em;
  }
  .ct-success-msg {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--sig-green);
    letter-spacing: 0.12em;
    animation: ct-rise 0.4s ease;
  }

  /* ── RAIL FOOTER ── */
  .ct-rail-footer {
    margin-top: 3.5rem;
    height: 20px;
    position: relative;
  }
  .ct-rail-footer::before,
  .ct-rail-footer::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-glow), transparent);
  }
  .ct-rail-footer::before { top: 4px; }
  .ct-rail-footer::after  { bottom: 4px; }
  .ct-rail-ties {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent, transparent 20px,
      var(--glass-border) 20px, var(--glass-border) 22px
    );
  }

  /* ── ENTRANCE ANIMATIONS ── */
  @keyframes ct-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  .ct-anim   { animation: ct-rise 0.55s cubic-bezier(.22,1,.36,1) both; }
  .ct-a1 { animation-delay: 0.04s; }
  .ct-a2 { animation-delay: 0.12s; }
  .ct-a3 { animation-delay: 0.20s; }
  .ct-a4 { animation-delay: 0.28s; }
  .ct-a5 { animation-delay: 0.36s; }
  .ct-a6 { animation-delay: 0.44s; }
  .ct-a7 { animation-delay: 0.52s; }
`

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const mailto = `mailto:${ME.email}?subject=${encodeURIComponent(form.subject || 'Message from ' + form.name)}&body=${encodeURIComponent(form.message)}`
    window.open(mailto)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="ct-page">
        <div className="ct-shell">

          {/* ══ HERO ══ */}
          <div className="ct-hero ct-anim ct-a1">
            <div className="ct-scanner" />
            <div className="ct-track-deco" />
            <div className="ct-hero-inner">
              <div className="ct-eyebrow">Railway Intelligence System · Contact Module</div>
              <h1 className="ct-name">{ME.name}</h1>
              <div className="ct-titles">
                <span className="ct-badge">Full Stack Developer</span>
                <span className="ct-badge blue">ML / AI Engineer</span>
                <span className="ct-badge green">2nd Year · CSE · 2024–2028</span>
              </div>
              <p className="ct-bio">{ME.bio}</p>
              <div className="ct-meta-row">
                <span className="ct-meta-item"><span className="ct-meta-dot" />{ME.location}</span>
                <span className="ct-meta-item"><span className="ct-meta-dot" />{ME.university}</span>
                <span className="ct-meta-item"><span className="ct-meta-dot" />Open to Internships</span>
              </div>
            </div>
          </div>

          {/* ══ QUICK LINKS ══ */}
          <div className="ct-section-label ct-anim ct-a2"><span>Connect With Me</span></div>
          <div className="ct-links-grid ct-anim ct-a2">
            {LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-link-card"
                style={{ borderColor: `${l.color}22` }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 28px ${l.color}33`
                  e.currentTarget.style.borderColor = `${l.color}55`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.borderColor = `${l.color}22`
                }}
              >
                <div
                  className="ct-link-icon"
                  style={{ color: l.color, borderColor: `${l.color}33`, background: `${l.color}11` }}
                >
                  {l.icon}
                </div>
                <span style={{ color: l.color }}>{l.label}</span>
              </a>
            ))}
          </div>

          {/* ══ DIRECT CONTACT ══ */}
          <div className="ct-section-label ct-anim ct-a3"><span>Direct Contact</span></div>
          <div className="ct-contact-grid ct-anim ct-a3">
            <a href={`mailto:${ME.email}`} className="ct-contact-card">
              <div className="ct-contact-icon-wrap">✉️</div>
              <div>
                <div className="ct-contact-label">Email</div>
                <div className="ct-contact-value">{ME.email}</div>
              </div>
            </a>
            <a href={`tel:${ME.phone.replace(/\s/g,'')}`} className="ct-contact-card">
              <div className="ct-contact-icon-wrap">📞</div>
              <div>
                <div className="ct-contact-label">Phone</div>
                <div className="ct-contact-value">{ME.phone}</div>
              </div>
            </a>
          </div>

          {/* ══ EDUCATION ══ */}
          <div className="ct-section-label ct-anim ct-a3"><span>Education</span></div>
          <div className="ct-edu-card ct-anim ct-a3">
            <div className="ct-edu-inner">
              <div className="ct-edu-icon">🎓</div>
              <div>
                <div className="ct-edu-degree">B.Tech Computer Science & Engineering</div>
                <div className="ct-edu-uni">{ME.university}</div>
                <div className="ct-edu-meta">Hyderabad, India · 2024 – 2028 · Currently 2nd Year</div>
              </div>
            </div>
          </div>

          {/* ══ SKILLS ══ */}
          <div className="ct-section-label ct-anim ct-a4"><span>Tech Stack</span></div>
          <div className="ct-skills-grid ct-anim ct-a4">
            {Object.entries(SKILLS).map(([cat, tags]) => (
              <div className="ct-skill-block" key={cat}>
                <div className="ct-skill-block-label">{cat}</div>
                <div className="ct-skill-tags">
                  {tags.map(t => <span className="ct-skill-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* ══ PROJECTS ══ */}
          <div className="ct-section-label ct-anim ct-a5"><span>Featured Projects</span></div>
          <div className="ct-projects-grid ct-anim ct-a5">
            {PROJECTS.map(p => (
              <a key={p.name} href={p.live} target="_blank" rel="noopener noreferrer" className="ct-proj-card">
                <div className="ct-proj-top">
                  <div className="ct-proj-emoji">{p.icon}</div>
                  <div className="ct-proj-titles">
                    <div className="ct-proj-name">{p.name}</div>
                    <div className="ct-proj-tag">{p.tag}</div>
                  </div>
                </div>
                <p className="ct-proj-desc">{p.desc}</p>
                <span className="ct-proj-link">View Live</span>
              </a>
            ))}
          </div>

          {/* ══ CONTACT FORM ══ */}
          <div className="ct-section-label ct-anim ct-a6"><span>Send a Message</span></div>
          <div className="ct-form-wrap ct-anim ct-a6">
            <div className="ct-form-title">Let's Connect</div>
            <div className="ct-form-sub">Recruiters · Collaborators · Open Source Contributors — all welcome</div>
            <form onSubmit={handleSubmit}>
              <div className="ct-form-grid">
                <div className="ct-field">
                  <label>Your Name</label>
                  <input type="text" name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
                </div>
                <div className="ct-field">
                  <label>Your Email</label>
                  <input type="email" name="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="ct-field full">
                  <label>Subject</label>
                  <input type="text" name="subject" placeholder="Internship Opportunity · Collaboration · Hiring" value={form.subject} onChange={handleChange} />
                </div>
                <div className="ct-field full">
                  <label>Message</label>
                  <textarea
                    name="message"
                    placeholder="Hi Vikash, I came across your Railway Analytics project and would love to discuss..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="ct-submit-row">
                <button type="submit" className="ct-submit-btn">Send Message →</button>
                {sent
                  ? <span className="ct-success-msg">✓ Opening your mail client…</span>
                  : <span className="ct-submit-note">Opens your mail client with pre-filled details</span>
                }
              </div>
            </form>
          </div>

          {/* ══ RAIL FOOTER ══ */}
          <div className="ct-rail-footer ct-anim ct-a7">
            <div className="ct-rail-ties" />
          </div>

        </div>
      </div>
    </Navbar>
  )
}