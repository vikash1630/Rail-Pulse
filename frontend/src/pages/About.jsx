import React from 'react'
import Navbar from './Navbar'

const ME = {
  name:       "Vikash Mundakar",
  email:      "m.vikash1630@gmail.com",
  github:     "https://github.com/vikash1630",
  linkedin:   "https://linkedin.com/in/vikash-mundakar",
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

  .ab-page {
    min-height: 100vh;
    font-family: 'DM Mono', monospace;
    color: var(--text-1);
    background: var(--ink);
    position: relative;
    overflow-x: hidden;
  }

  .ab-shell {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── HERO BLOCK ── */
  .ab-hero {
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 3.5rem 3rem;
    background: var(--ink-2);
    position: relative;
    overflow: hidden;
  }
  .ab-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }

  .ab-chip {
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(201,151,58,0.35);
    background: rgba(201,151,58,0.08);
    padding: 0.35rem 1rem;
    border-radius: 99px;
    margin-bottom: 1.2rem;
  }

  .ab-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.5rem, 12vw, 9rem);
    line-height: 0.88;
    letter-spacing: 0.04em;
    background: linear-gradient(130deg, #fff 0%, var(--gold-light) 60%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
  }

  .ab-role-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.6rem;
  }
  .ab-role-tag {
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 0.45rem 1.1rem;
    border-radius: 99px;
    border: 1px solid;
  }
  .ab-role-tag.gold  { border-color: rgba(201,151,58,0.4); color: var(--gold-light); background: rgba(201,151,58,0.08); }
  .ab-role-tag.blue  { border-color: rgba(96,165,250,0.4); color: #93c5fd; background: rgba(96,165,250,0.08); }
  .ab-role-tag.green { border-color: rgba(61,184,122,0.4); color: #6ee7b7; background: rgba(61,184,122,0.08); }
  .ab-role-tag.red   { border-color: rgba(224,82,82,0.4);  color: #fca5a5; background: rgba(224,82,82,0.08); }

  .ab-one-liner {
    font-size: clamp(1.1rem, 2.8vw, 1.55rem);
    color: var(--text-2);
    line-height: 1.5;
    max-width: 780px;
    letter-spacing: 0.01em;
  }
  .ab-one-liner strong { color: var(--gold-light); font-weight: 500; }

  /* ── NUMBERS ROW ── */
  .ab-numbers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ab-numbers { grid-template-columns: repeat(2,1fr); } }

  .ab-num-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    text-align: center;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
  }
  .ab-num-card:hover {
    transform: translateY(-5px);
    border-color: rgba(201,151,58,0.3);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(201,151,58,0.1);
  }
  .ab-num-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 0.4rem;
  }
  .ab-num-label {
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  /* ── WHAT I BUILD ── */
  .ab-build-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media(max-width:700px){ .ab-build-grid { grid-template-columns: 1fr; } }

  .ab-build-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem 1.8rem;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ab-build-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-build-card:hover { transform: translateY(-5px); }
  .ab-build-card:hover::before { opacity: 1; }

  .ab-build-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  .ab-build-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 0.6rem;
  }
  .ab-build-desc {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    letter-spacing: 0.02em;
  }

  /* ── TECH STRIP ── */
  .ab-tech-strip {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .ab-tech-label {
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
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
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    padding: 0.4rem 1rem;
    border-radius: 99px;
    border: 1px solid var(--glass-border);
    background: var(--ink-3);
    color: var(--text-2);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .ab-tech-pill:hover {
    color: var(--gold-light);
    border-color: rgba(201,151,58,0.3);
    background: rgba(201,151,58,0.08);
  }

  /* ── CTA ── */
  .ab-cta {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
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
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ab-cta-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    letter-spacing: 0.06em;
    line-height: 1;
    background: linear-gradient(130deg, #fff 0%, var(--gold-light) 55%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }
  .ab-cta-sub {
    font-size: clamp(0.95rem, 2vw, 1.2rem);
    color: var(--text-2);
    margin-bottom: 2rem;
    letter-spacing: 0.04em;
  }
  .ab-cta-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ab-btn-primary {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: #111;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border: none;
    border-radius: 14px;
    padding: 1rem 2.5rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ab-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 8px 28px rgba(201,151,58,0.35);
  }
  .ab-btn-secondary {
    background: transparent;
    color: var(--text-2);
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    padding: 1rem 2.5rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s, border-color 0.2s, color 0.2s;
  }
  .ab-btn-secondary:hover {
    transform: translateY(-3px);
    border-color: rgba(201,151,58,0.4);
    color: var(--gold-light);
  }
    .ab-name {
      font-size: 3.6rem;
    }
      .ab-nums {
        font-size: 1.6rem;
      }

  /* ── ANIMATIONS ── */
  @keyframes ab-rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: none; }
  }
  .ab-anim { animation: ab-rise 0.6s cubic-bezier(.22,1,.36,1) both; }
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
    color: "#e8b454",
    border: "rgba(232,180,84,0.4)",
    bar: "linear-gradient(90deg, #e8b454, #e8b45488, transparent)",
  },
  {
    icon: "📊",
    title: "Analytics Dashboards",
    desc: "Real-time dashboards with animated KPIs, drill-down charts, zone heatmaps, and demand forecasting visuals.",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.4)",
    bar: "linear-gradient(90deg, #60a5fa, #60a5fa88, transparent)",
  },
  {
    icon: "🔐",
    title: "Full-Stack Auth Systems",
    desc: "JWT authentication, session management, role-aware views — Node.js + Express + MongoDB, production-deployed.",
    color: "#3db87a",
    border: "rgba(61,184,122,0.4)",
    bar: "linear-gradient(90deg, #3db87a, #3db87a88, transparent)",
  },
]

const TECH = ["React", "Vite", "Node.js", "Express.js", "MongoDB", "Flask", "Python", "Tailwind CSS", "JWT Auth", "Vercel", "Render"]

const NUMS = [
  { val: "49000+",    label: "Dataset Records", color: "#e8b454" },
  { val: "4+",      label: "Live Projects",   color: "#3db87a" },
  { val: "10+",     label: "Technologies",    color: "#60a5fa" },
  { val: "2024 - 2028",  label: "B.Tech CSE",      color: "#c9973a" },
]

export default function About() {
  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="ab-page">
        <div className="ab-shell">

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
            <p className="">
              I build <strong>scalable web apps</strong> and <strong>analytics platforms</strong> — from database to dashboard.
              Flagship project: a <strong className='ab-one-linear'>49,011-record Indian Railways</strong> intelligence system, fully deployed.
            </p>
          </div>

          {/* ── NUMBERS ── */}
          <div className="ab-numbers ab-anim ab-d2">
            {NUMS.map(n => (
              <div className="ab-num-card" key={n.label}>
                <div className="ab-nums" style={{ color: n.color }}>{n.val}</div>
                <div className="">{n.label}</div>
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
                  e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.45), 0 0 28px ${b.color}22`
                  e.currentTarget.querySelector('.ab-build-bar').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
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
            <div className="ab-tech-label">Stack</div>
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

        </div>
      </div>
    </Navbar>
  )
}