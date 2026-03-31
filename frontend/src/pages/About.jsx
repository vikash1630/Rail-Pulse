import React from 'react'
import Navbar from './Navbar'

const ME = {
  name:       "Vikash Mundakar",
  email:      "m.vikash1630@gmail.com",
  github:     "https://github.com/vikash1630",
  linkedin:   "https://linkedin.com/in/vikash-mundakar",
}

const CSS = `
  /* ── Structural ── */
  .ab-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
    min-height: 100vh;
    padding-bottom: 5rem;
    overflow-x: hidden;
  }

  .ab-shell {
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
  .ab-font-mythic   { font-family: var(--font-mythic);   font-weight: 400; }
  .ab-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .ab-font-body     { font-family: var(--font-body); }

  /* ── Train Track Animation (Synced) ── */
  .ab-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
  }
  .ab-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    animation: ab-train-rtl 15s linear infinite;
  }
  .ab-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .ab-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }

  @keyframes ab-train-rtl { 0%{transform:translateX(0)} 100%{transform:translateX(-100vw)} }

  /* ── Live Dot ── */
  .ab-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3CB371; position: relative; flex-shrink: 0;
  }
  .ab-live-dot::after {
    content: ''; position: absolute; inset: -2px; border-radius: 50%;
    background: #3CB371; opacity: 0.4;
    animation: ab-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }
  @keyframes ab-ping { 75%,100%{transform:scale(2);opacity:0} }

  /* ── Status Bar ── */
  .ab-status-bar {
    display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
    padding: 1rem 1.5rem; margin-bottom: -1rem;
    background: var(--stone-1); border: 1px solid var(--stone-2);
    box-shadow: var(--shadow-inset); border-radius: 12px;
    border-left: 4px solid var(--swarna-gold);
  }

  /* ── HERO BLOCK ── */
  .ab-hero {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 24px;
    padding: 3.5rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .ab-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }

  .ab-chip {
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

  .ab-name {
    font-family: var(--font-mythic);
    font-size: clamp(2.5rem, 4vw, 2.5rem);
    line-height: 1.1;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-shadow: var(--shadow-outset);
  }

  .ab-role-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.6rem;
  }
  .ab-role-tag {
    font-family: var(--font-historic);
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 0.45rem 1.1rem;
    border-radius: 99px;
    border: 1px solid;
    white-space: nowrap;
  }
  .ab-role-tag.gold  { border-color: rgba(212,175,55,0.3); color: var(--swarna-gold); background: rgba(212,175,55,0.08); }
  .ab-role-tag.blue  { border-color: rgba(96,165,250,0.3); color: #60a5fa; background: rgba(96,165,250,0.08); }
  .ab-role-tag.green { border-color: rgba(60,179,113,0.3); color: #3CB371; background: rgba(60,179,113,0.08); }
  .ab-role-tag.red   { border-color: rgba(227,66,52,0.3);  color: var(--sindoor-red); background: rgba(227,66,52,0.08); }

  .ab-one-liner {
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 2.5vw, 1.35rem);
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 780px;
    letter-spacing: 0.01em;
  }
  .ab-one-liner strong { color: var(--swarna-gold); font-weight: 700; }

  /* ── NUMBERS ROW ── */
  .ab-numbers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ab-numbers { grid-template-columns: repeat(2,1fr); } }

  .ab-num-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    text-align: center;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ab-num-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ab-num-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
  }
  .ab-num-card:hover::before { opacity: 1; }
  
  .ab-num-val {
    font-family: var(--font-mythic);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    line-height: 1;
    margin-bottom: 0.4rem;
  }
  .ab-num-label {
    font-family: var(--font-historic);
    font-size: 0.55rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── WHAT I BUILD ── */
  .ab-build-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media(max-width:800px){ .ab-build-grid { grid-template-columns: 1fr; } }

  .ab-build-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    padding: 2rem 1.8rem;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ab-build-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ab-build-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-outset), var(--diya-glow); }
  .ab-build-card:hover::before { opacity: 1; }

  .ab-build-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ab-build-card:hover .ab-build-icon { transform: scale(1.1) rotate(-5deg); }

  .ab-build-title {
    font-family: var(--font-mythic);
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    line-height: 1.1;
    margin-bottom: 0.6rem;
  }
  .ab-build-desc {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* ── TECH STRIP ── */
  .ab-tech-strip {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .ab-tech-label {
    font-family: var(--font-historic);
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--kansa-light);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ab-tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex: 1;
  }
  .ab-tech-pill {
    font-family: var(--font-historic);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.4rem 1rem;
    border-radius: 99px;
    border: 1px solid var(--stone-3);
    background: var(--stone-1);
    color: var(--text-muted);
    transition: color 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
    cursor: default;
    box-shadow: var(--shadow-inset);
  }
  .ab-tech-pill:hover {
    color: var(--swarna-gold);
    border-color: var(--kansa-bronze);
    background: rgba(212,175,55,0.08);
    box-shadow: var(--shadow-outset);
  }

  /* ── CTA ── */
  .ab-cta {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ab-cta::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .ab-cta-heading {
    font-family: var(--font-mythic);
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 1.1;
    color: var(--swarna-gold);
    margin-bottom: 0.5rem;
  }
  .ab-cta-sub {
    font-family: var(--font-body);
    font-size: clamp(0.95rem, 2vw, 1.2rem);
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
  .ab-cta-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ab-btn-primary {
    padding: 1rem 2rem;
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    color: var(--stone-1);
    border: none; border-radius: 10px;
    font-family: var(--font-historic);
    font-size: 0.85rem; font-weight: 800;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), var(--shadow-outset);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .ab-btn-primary::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .ab-btn-primary:hover { background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light)); box-shadow: var(--diya-glow); transform: translateY(-2px); }
  .ab-btn-primary:hover::after { left: 160%; }
  .ab-btn-primary:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }

  .ab-btn-secondary {
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-historic);
    font-size: 0.85rem; font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid var(--stone-3);
    border-radius: 10px;
    padding: 1rem 2rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-outset);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ab-btn-secondary:hover {
    transform: translateY(-2px);
    border-color: var(--kansa-bronze);
    color: var(--swarna-gold);
    box-shadow: var(--diya-glow);
  }
  .ab-btn-secondary:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }

  /* ── ANIMATIONS ── */
  @keyframes ab-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ab-anim { animation: ab-fade-up 0.6s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .ab-d1 { animation-delay: 0.05s; }
  .ab-d2 { animation-delay: 0.15s; }
  .ab-d3 { animation-delay: 0.25s; }
  .ab-d4 { animation-delay: 0.35s; }
  .ab-d5 { animation-delay: 0.45s; }
`

const BUILDS = [
  {
    icon: "🚂",
    title: "Railway Intelligence System",
    desc: "49,011-record analytics platform — revenue, occupancy, routes, punctuality across all Indian railway zones.",
    color: "#D4AF37",
    border: "rgba(212,175,55,0.4)",
    bar: "linear-gradient(90deg, #D4AF37, transparent)",
  },
  {
    icon: "📊",
    title: "Analytics Dashboards",
    desc: "Real-time dashboards with animated KPIs, drill-down charts, zone heatmaps, and demand forecasting visuals.",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.4)",
    bar: "linear-gradient(90deg, #60a5fa, transparent)",
  },
  {
    icon: "🔐",
    title: "Full-Stack Auth Systems",
    desc: "JWT authentication, session management, role-aware views — Node.js + Express + MongoDB, production-deployed.",
    color: "#3CB371",
    border: "rgba(60,179,113,0.4)",
    bar: "linear-gradient(90deg, #3CB371, transparent)",
  },
]

const TECH = ["React", "Vite", "Node.js", "Express.js", "MongoDB", "Flask", "Python", "Tailwind CSS", "JWT Auth", "Vercel", "Render"]

const NUMS = [
  { val: "49000+",  label: "Dataset Records", color: "#D4AF37" },
  { val: "4+",      label: "Live Projects",   color: "#3CB371" },
  { val: "10+",     label: "Technologies",    color: "#60a5fa" },
  { val: "2024 - 28", label: "B.Tech CSE",    color: "#CD7F32" },
]

export default function About() {
  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="ab-page">
        
        {/* ── Train Track Animation ── */}
        <div className="ab-train-track">
          <div className="ab-train-loop-container">
            <div className="ab-train-set">
              <div className="ab-bogie">🚂</div>
              <div className="ab-bogie">🚃</div>
              <div className="ab-bogie">🚃</div>
              <div className="ab-bogie">🚃</div>
            </div>
            <div className="ab-train-set">
              <div className="ab-bogie">🚂</div>
              <div className="ab-bogie">🚃</div>
              <div className="ab-bogie">🚃</div>
              <div className="ab-bogie">🚃</div>
            </div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--swarna-gold)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--kansa-bronze)" }} />
        </div>

        <div className="ab-shell">
          
          {/* Status Bar */}
          <div className="ab-status-bar ab-anim ab-d1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
              <div className="ab-live-dot" />
              <span className="ab-font-historic" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Profile Network <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>Active</span></span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-historic)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              <span style={{ color: 'var(--kansa-bronze)' }}>•</span>
              <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* ── HERO ── */}
          <div className="ab-hero ab-anim ab-d1">
            <div className="ab-chip">Full Stack Developer · Open to Internships</div>
            <h1 className="ab-name">{ME.name}</h1>
            <div className="ab-role-row">
              <span className="ab-role-tag gold">Full Stack Developer</span>
              <span className="ab-role-tag blue">Data Analytics Builder</span>
              <span className="ab-role-tag green">MGIT · B.Tech CSE · 2024–28</span>
              <span className="ab-role-tag red">Hyderabad, India</span>
            </div>
            <p className="ab-one-liner">
              I build <strong>scalable web apps</strong> and <strong>analytics platforms</strong> — from database to dashboard.
              Flagship project: a <strong>49,011-record Indian Railways</strong> intelligence system, fully deployed.
            </p>
          </div>

          {/* ── NUMBERS ── */}
          <div className="ab-numbers ab-anim ab-d2">
            {NUMS.map(n => (
              <div className="ab-num-card" key={n.label}
                style={{ '--bar': `linear-gradient(90deg, ${n.color}, transparent)` }}
                onMouseEnter={e => { e.currentTarget.querySelector('.ab-num-bar').style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.querySelector('.ab-num-bar').style.opacity = '0' }}
              >
                <div className="ab-num-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg, ${n.color}, transparent)`, opacity:0, transition:'opacity 0.3s' }} />
                <div className="ab-num-val" style={{ color: n.color }}>{n.val}</div>
                <div className="ab-num-label">{n.label}</div>
              </div>
            ))}
          </div>

          {/* ── WHAT I BUILD ── */}
          <div className="ab-build-grid ab-anim ab-d3">
            {BUILDS.map(b => (
              <div
                className="ab-build-card"
                key={b.title}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = b.border
                  e.currentTarget.querySelector('.ab-build-bar').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.querySelector('.ab-build-bar').style.opacity = '0'
                }}
              >
                <div
                  className="ab-build-bar"
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: b.bar, opacity: 0, transition: 'opacity 0.3s',
                  }}
                />
                <div className="ab-build-icon">{b.icon}</div>
                <div className="ab-build-title" style={{ color: b.color }}>{b.title}</div>
                <p className="ab-build-desc">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* ── TECH ── */}
          <div className="ab-tech-strip ab-anim ab-d4">
            <div className="ab-tech-label">Stack Engine</div>
            <div className="ab-tech-pills">
              {TECH.map(t => <span className="ab-tech-pill" key={t}>{t}</span>)}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="ab-cta ab-anim ab-d5">
            <div className="ab-cta-heading">Let's Build Together</div>
            <p className="ab-cta-sub">
              Actively seeking internships · Full-Stack · Data Engineering · Product Analytics
            </p>
            <div className="ab-cta-btns">
              <a href={`mailto:${ME.email}`} className="ab-btn-primary">✉ Get In Touch</a>
              <a href="https://github.com/vikash1630" target="_blank" rel="noopener noreferrer" className="ab-btn-secondary">GitHub</a>
              <a href="https://linkedin.com/in/vikash-mundakar" target="_blank" rel="noopener noreferrer" className="ab-btn-secondary">LinkedIn</a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--stone-3)] text-center ab-font-historic text-[var(--text-muted)] space-y-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p style={{ color: 'var(--swarna-gold)' }}>▶ ABOUT MODULE OPERATIONAL</p>
          </div>

        </div>
      </div>
    </Navbar>
  )
}