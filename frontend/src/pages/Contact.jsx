import React, { useState } from 'react'
import Navbar from './Navbar'  // Adjusted import path to match your project structure

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const ME = {
  name:      "Vikash Mundakar",
  email:     "m.vikash1630@gmail.com",
  phone:     "+91 9573696792",
  github:    "https://github.com/vikash1630",
  linkedin:  "https://linkedin.com/in/vikash-mundakar",
  portfolio: "https://www.pichu.site/",
}

const PROJECTS = [
  { name: "Local Lynk",     tag: "E-Commerce",       icon: "🛒", color: "#D4AF37", live: "https://local-lynk.vercel.app/" },
  { name: "IPL Analytics",  tag: "Dashboard",        icon: "📊", color: "#60a5fa", live: "https://ipl-analytics-dashboard-htof.onrender.com" },
  { name: "Solo Levelling", tag: "Fitness Tracker",  icon: "⚡", color: "#3CB371", live: "https://solo-levelling-fitness-model-app.onrender.com" },
  { name: "Advanced Notes", tag: "Notes App",        icon: "📝", color: "#a78bfa", live: "https://notes-app-mwwd.onrender.com/" },
]

const SOCIALS = [
  { name: "GitHub",    sub: "View my code",      icon: "⌥",  color: "#D4AF37", href: ME.github,    bg: "rgba(212,175,55,0.1)",  border: "rgba(212,175,55,0.3)" },
  { name: "LinkedIn",  sub: "Connect with me",   icon: "in", color: "#60a5fa", href: ME.linkedin,  bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)" },
  { name: "Portfolio", sub: "See my work",       icon: "◈",  color: "#3CB371", href: ME.portfolio, bg: "rgba(60,179,113,0.1)",  border: "rgba(60,179,113,0.3)" },
]

/* ═══════════════════════════════════════════════
   CSS (YUGA THEME SYNCED)
═══════════════════════════════════════════════ */
const CSS = `
  /* ── Structural ── */
  .ct-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
    min-height: 100vh;
    padding-bottom: 5rem;
    overflow-x: hidden;
  }

  .ct-shell {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── Typography Utilities ── */
  .ct-font-mythic   { font-family: var(--font-mythic);   font-weight: 400; }
  .ct-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .ct-font-body     { font-family: var(--font-body); }

  /* ── Train Track Animation (Synced) ── */
  .ct-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
  }
  .ct-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    animation: ct-train-rtl 15s linear infinite;
  }
  .ct-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .ct-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }

  @keyframes ct-train-rtl { 0%{transform:translateX(0)} 100%{transform:translateX(-100vw)} }

  /* ── Live Dot ── */
  .ct-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3CB371; position: relative; flex-shrink: 0;
  }
  .ct-live-dot::after {
    content: ''; position: absolute; inset: -2px; border-radius: 50%;
    background: #3CB371; opacity: 0.4;
    animation: ct-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }
  @keyframes ct-ping { 75%,100%{transform:scale(2);opacity:0} }

  /* ── Status Bar ── */
  .ct-status-bar {
    display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
    padding: 1rem 1.5rem; margin-bottom: -1rem;
    background: var(--stone-1); border: 1px solid var(--stone-2);
    box-shadow: var(--shadow-inset); border-radius: 12px;
    border-left: 4px solid var(--swarna-gold);
  }

  /* ── HERO ── */
  .ct-hero {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 24px;
    padding: 3.5rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .ct-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }

  .ct-chip {
    display: inline-block;
    font-family: var(--font-historic);
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--swarna-gold);
    border: 1px solid rgba(212,175,55,0.25);
    background: rgba(212,175,55,0.1);
    padding: 0.35rem 1rem;
    border-radius: 99px;
    margin-bottom: 1.2rem;
  }

  .ct-name {
    font-family: var(--font-mythic);
    font-size: clamp(2.5rem, 5vw, 2.5rem);
    line-height: 1.1;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-shadow: var(--shadow-outset);
  }

  .ct-tagline {
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 2.5vw, 1.35rem);
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 700px;
    margin-bottom: 0;
  }
  .ct-tagline strong { color: var(--swarna-gold); font-weight: 700; }

  /* ── SECTION LABEL ── */
  .ct-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .ct-label span {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--kansa-light); white-space: nowrap;
  }
  .ct-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }

  /* ── CONTACT ROW ── */
  .ct-contact-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ct-contact-row { grid-template-columns: 1fr; } }

  .ct-contact-card {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.6rem 1.8rem;
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    text-decoration: none;
    color: var(--text-primary);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ct-contact-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ct-contact-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
  }
  .ct-contact-card:hover::before { opacity: 1; }

  .ct-cc-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(205,127,50,0.1);
    border: 1px solid rgba(205,127,50,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ct-contact-card:hover .ct-cc-icon { transform: scale(1.1) rotate(-5deg); box-shadow: var(--diya-glow); }
  
  .ct-cc-label {
    font-family: var(--font-historic);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }
  .ct-cc-val {
    font-family: var(--font-body);
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: var(--text-primary);
    font-weight: 700;
    word-break: break-all;
  }

  /* ── SOCIAL ROW ── */
  .ct-social-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ct-social-row { grid-template-columns: 1fr; } }

  .ct-social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 1.8rem 1rem;
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    text-decoration: none;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.22s, box-shadow 0.22s;
  }
  .ct-social-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-outset), var(--diya-glow); }

  .ct-social-icon {
    font-family: var(--font-mythic);
    font-size: 1.6rem;
    width: 54px; height: 54px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ct-social-card:hover .ct-social-icon { transform: scale(1.12) rotate(-6deg); }
  
  .ct-social-name {
    font-family: var(--font-mythic);
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .ct-social-sub {
    font-family: var(--font-historic);
    font-size: 0.55rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── PROJECTS ── */
  .ct-projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ct-projects-grid { grid-template-columns: 1fr; } }

  .ct-proj-card {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.5rem 1.8rem;
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    text-decoration: none;
    color: var(--text-primary);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ct-proj-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ct-proj-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-outset), var(--diya-glow); }
  .ct-proj-card:hover::before { opacity: 1; }

  .ct-proj-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    border: 1px solid transparent;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ct-proj-card:hover .ct-proj-icon { transform: scale(1.1) rotate(-7deg); }

  .ct-proj-name {
    font-family: var(--font-mythic);
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .ct-proj-tag {
    font-family: var(--font-historic);
    font-size: 0.55rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .ct-proj-arrow {
    margin-left: auto;
    font-size: 1.4rem;
    color: var(--text-muted);
    transition: transform 0.3s, color 0.3s;
    flex-shrink: 0;
  }
  .ct-proj-card:hover .ct-proj-arrow { transform: translateX(4px); color: var(--kansa-light); }

  /* ── FORM ── */
  .ct-form-wrap {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    position: relative;
    overflow: hidden;
  }
  .ct-form-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .ct-form-heading {
    font-family: var(--font-mythic);
    font-size: clamp(2.5rem, 6vw, 4rem);
    line-height: 1.1;
    color: var(--swarna-gold);
    margin-bottom: 0.4rem;
  }
  .ct-form-sub {
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
  .ct-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }
  @media(max-width:600px){ .ct-form-grid { grid-template-columns: 1fr; } }

  .ct-field { display: flex; flex-direction: column; gap: 0.5rem; }
  .ct-field.full { grid-column: 1 / -1; }
  .ct-field label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .ct-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%; background: var(--swarna-gold);
    box-shadow: 0 0 7px var(--swarna-gold); flex-shrink: 0;
  }
  .ct-field input, .ct-field textarea {
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 12px;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 1.05rem; font-weight: 600;
    padding: 0.9rem 1.1rem;
    outline: none;
    resize: none;
    width: 100%;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .ct-field input::placeholder, .ct-field textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
  .ct-field input:focus, .ct-field textarea:focus {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow);
  }
  .ct-field textarea { min-height: 140px; }

  .ct-submit-row {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .ct-submit-btn {
    padding: 1rem 2rem;
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    color: var(--stone-1);
    border: none; border-radius: 10px;
    font-family: var(--font-historic);
    font-size: 0.85rem; font-weight: 800;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), var(--shadow-outset);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  .ct-submit-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .ct-submit-btn:hover { background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light)); box-shadow: var(--diya-glow); transform: translateY(-2px); }
  .ct-submit-btn:hover::after { left: 160%; }
  .ct-submit-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }

  .ct-submit-note {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  .ct-success {
    font-family: var(--font-historic);
    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #3CB371; font-weight: 800;
  }

  /* ── ANIMATIONS ── */
  @keyframes ct-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ct-anim { animation: ct-fade-up 0.6s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .ct-d1 { animation-delay: 0.05s; }
  .ct-d2 { animation-delay: 0.15s; }
  .ct-d3 { animation-delay: 0.25s; }
  .ct-d4 { animation-delay: 0.35s; }
  .ct-d5 { animation-delay: 0.45s; }
`

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
        
        {/* ── Train Track Animation ── */}
        <div className="ct-train-track">
          <div className="ct-train-loop-container">
            <div className="ct-train-set">
              <div className="ct-bogie">🚂</div>
              <div className="ct-bogie">🚃</div>
              <div className="ct-bogie">🚃</div>
              <div className="ct-bogie">🚃</div>
            </div>
            <div className="ct-train-set">
              <div className="ct-bogie">🚂</div>
              <div className="ct-bogie">🚃</div>
              <div className="ct-bogie">🚃</div>
              <div className="ct-bogie">🚃</div>
            </div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--swarna-gold)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--kansa-bronze)" }} />
        </div>

        <div className="ct-shell">
          
          {/* Status Bar */}
          <div className="ct-status-bar ct-anim ct-d1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
              <div className="ct-live-dot" />
              <span className="ct-font-historic" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Contact Network <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>Active</span></span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-historic)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              <span style={{ color: 'var(--kansa-bronze)' }}>•</span>
              <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* ── HERO ── */}
          <div className="ct-hero ct-anim ct-d1">
            <div className="ct-chip">Open to Internships · Full Stack · Data Analytics</div>
            <h6 className="ct-name">{ME.name}</h6>
            <p className="ct-tagline">
              <strong>Full Stack Developer</strong> · B.Tech CSE 2024–28 · MGIT Hyderabad<br />
              Building <strong>scalable web apps</strong> & <strong>analytics platforms</strong> — reach out to collaborate.
            </p>
          </div>

          {/* ── DIRECT CONTACT ── */}
          <div className="ct-label ct-anim ct-d2"><span>Direct Contact</span></div>
          <div className="ct-contact-row ct-anim ct-d2">
            <a href={`mailto:${ME.email}`} className="ct-contact-card"
              style={{ '--bar': 'linear-gradient(90deg, var(--swarna-gold), transparent)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.4)'; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='0' }}
            >
              <div className="ct-contact-card-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, var(--swarna-gold), transparent)', opacity:0, transition:'opacity 0.3s' }} />
              <div className="ct-cc-icon" style={{ color: 'var(--swarna-gold)' }}>✉️</div>
              <div>
                <div className="ct-cc-label">Email</div>
                <div className="ct-cc-val">{ME.email}</div>
              </div>
            </a>
            <a href={`tel:${ME.phone.replace(/\s/g,'')}`} className="ct-contact-card"
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(96,165,250,0.4)'; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='0' }}
            >
              <div className="ct-contact-card-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, #60a5fa, transparent)', opacity:0, transition:'opacity 0.3s' }} />
              <div className="ct-cc-icon" style={{ background:'rgba(96,165,250,0.1)', borderColor:'rgba(96,165,250,0.25)', color: '#60a5fa' }}>📞</div>
              <div>
                <div className="ct-cc-label">Phone</div>
                <div className="ct-cc-val">{ME.phone}</div>
              </div>
            </a>
          </div>

          {/* ── SOCIALS ── */}
          <div className="ct-label ct-anim ct-d3"><span>Find Me Online</span></div>
          <div className="ct-social-row ct-anim ct-d3">
            {SOCIALS.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor=s.border; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; }}
              >
                <div className="ct-social-icon" style={{ background: s.bg, borderColor: s.border, color: s.color }}>{s.icon}</div>
                <div className="ct-social-name" style={{ color: s.color }}>{s.name}</div>
                <div className="ct-social-sub">{s.sub}</div>
              </a>
            ))}
          </div>

          {/* ── PROJECTS ── */}
          <div className="ct-label ct-anim ct-d4"><span>Live Projects</span></div>
          <div className="ct-projects-grid ct-anim ct-d4">
            {PROJECTS.map(p => (
              <a key={p.name} href={p.live} target="_blank" rel="noopener noreferrer" className="ct-proj-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${p.color}55`; e.currentTarget.querySelector('.ct-proj-bar').style.opacity='1'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.querySelector('.ct-proj-bar').style.opacity='0'; }}
              >
                <div className="ct-proj-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${p.color}, transparent)`, opacity:0, transition:'opacity 0.3s' }} />
                <div className="ct-proj-icon" style={{ background:`${p.color}18`, borderColor:`${p.color}30` }}>{p.icon}</div>
                <div>
                  <div className="ct-proj-name" style={{ color: p.color }}>{p.name}</div>
                  <div className="ct-proj-tag">{p.tag}</div>
                </div>
                <div className="ct-proj-arrow">→</div>
              </a>
            ))}
          </div>

          {/* ── FORM ── */}
          <div className="ct-form-wrap ct-anim ct-d5">
            <div className="ct-form-heading">Send a Message</div>
            <p className="ct-form-sub">Recruiters · Collaborators · Contributors — all welcome</p>
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
                  <textarea name="message" placeholder="Hi Vikash, I'd love to discuss..." value={form.message} onChange={handleChange} required />
                </div>
              </div>
              <div className="ct-submit-row">
                <button type="submit" className="ct-submit-btn">Send Message →</button>
                {sent
                  ? <span className="ct-success">✓ Opening mail client…</span>
                  : <span className="ct-submit-note">Opens your mail client with pre-filled details</span>
                }
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--stone-3)] text-center ct-font-historic text-[var(--text-muted)] space-y-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p style={{ color: 'var(--swarna-gold)' }}>▶ CONTACT MODULE OPERATIONAL</p>
          </div>

        </div>
      </div>
    </Navbar>
  )
}