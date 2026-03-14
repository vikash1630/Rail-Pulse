import React, { useState } from 'react'
import Navbar from './Navbar'

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
  { name: "Local Lynk",     tag: "E-Commerce",      icon: "🛒", color: "#e8b454", live: "https://local-lynk.vercel.app/" },
  { name: "IPL Analytics",  tag: "Dashboard",        icon: "📊", color: "#60a5fa", live: "https://ipl-analytics-dashboard-htof.onrender.com" },
  { name: "Solo Levelling", tag: "Fitness Tracker",  icon: "⚡", color: "#3db87a", live: "https://solo-levelling-fitness-model-app.onrender.com" },
  { name: "Advanced Notes", tag: "Notes App",        icon: "📝", color: "#a78bfa", live: "https://notes-app-mwwd.onrender.com/" },
]

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

  .ct-page {
    min-height: 100vh;
    font-family: 'DM Mono', monospace;
    color: var(--text-1);
    background: var(--ink);
    overflow-x: hidden;
  }

  .ct-shell {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── HERO ── */
  .ct-hero {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
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
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }

  .ct-chip {
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

  .ct-name {
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

  .ct-tagline {
    font-size: clamp(1.1rem, 2.8vw, 1.5rem);
    color: var(--text-2);
    line-height: 1.5;
    max-width: 700px;
    margin-bottom: 2rem;
    letter-spacing: 0.01em;
  }
  .ct-tagline strong { color: var(--gold-light); font-weight: 500; }

  /* ── CONTACT ROW ── */
  .ct-contact-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media(max-width:600px){ .ct-contact-row { grid-template-columns: 1fr; } }

  .ct-contact-card {
    display: flex;
    align-items: center;
    gap: 1.1rem;
    padding: 1.6rem 1.8rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    text-decoration: none;
    color: var(--text-1);
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ct-contact-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ct-contact-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201,151,58,0.3);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(201,151,58,0.1);
  }
  .ct-contact-card:hover::before { opacity: 1; }

  .ct-cc-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(201,151,58,0.1);
    border: 1px solid rgba(201,151,58,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .ct-contact-card:hover .ct-cc-icon { transform: scale(1.1) rotate(-5deg); }
  .ct-cc-label {
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 0.3rem;
  }
  .ct-cc-val {
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: var(--gold-light);
    font-weight: 500;
    word-break: break-all;
  }

  /* ── SOCIAL ROW ── */
  .ct-social-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media(max-width:600px){ .ct-social-row { grid-template-columns: 1fr; } }

  .ct-social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 1.8rem 1rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    text-decoration: none;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
  }
  .ct-social-card:hover { transform: translateY(-5px); }

  .ct-social-icon {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    width: 54px; height: 54px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: transform 0.25s;
  }
  .ct-social-card:hover .ct-social-icon { transform: scale(1.12) rotate(-6deg); }
  .ct-social-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .ct-social-sub {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  /* ── PROJECTS ── */
  .ct-projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media(max-width:640px){ .ct-projects-grid { grid-template-columns: 1fr; } }

  .ct-proj-card {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.5rem 1.8rem;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    text-decoration: none;
    color: var(--text-1);
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
  }
  .ct-proj-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ct-proj-card:hover { transform: translateY(-4px); }
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
    transition: transform 0.25s;
  }
  .ct-proj-card:hover .ct-proj-icon { transform: scale(1.1) rotate(-7deg); }

  .ct-proj-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 0.2rem;
  }
  .ct-proj-tag {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .ct-proj-arrow {
    margin-left: auto;
    font-size: 1.4rem;
    color: var(--text-3);
    transition: transform 0.22s, color 0.22s;
    flex-shrink: 0;
  }
  .ct-proj-card:hover .ct-proj-arrow { transform: translateX(4px); color: var(--gold-light); }

  /* ── FORM ── */
  .ct-form-wrap {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
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
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }
  .ct-form-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    letter-spacing: 0.05em;
    line-height: 1;
    background: linear-gradient(130deg, #fff 0%, var(--gold-light) 60%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.4rem;
  }
  .ct-form-sub {
    font-size: 0.85rem;
    color: var(--text-2);
    letter-spacing: 0.08em;
    margin-bottom: 2rem;
  }
  .ct-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  @media(max-width:580px){ .ct-form-grid { grid-template-columns: 1fr; } }

  .ct-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .ct-field.full { grid-column: 1 / -1; }
  .ct-field label {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .ct-field input, .ct-field textarea {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    color: var(--text-1);
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    padding: 0.8rem 1rem;
    outline: none;
    resize: none;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ct-field input::placeholder, .ct-field textarea::placeholder { color: var(--text-3); }
  .ct-field input:focus, .ct-field textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,151,58,0.15);
  }
  .ct-field textarea { min-height: 120px; }

  .ct-submit-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.2rem;
  }
  .ct-submit-btn {
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
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
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
    box-shadow: 0 8px 28px rgba(201,151,58,0.35);
  }
  .ct-submit-note {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--text-3);
  }
  .ct-success {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: #6ee7b7;
  }

  /* ── SECTION LABEL ── */
  .ct-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .ct-label span {
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    white-space: nowrap;
  }
  .ct-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,151,58,0.4), transparent);
  }
    .ct-name {
      font-size: 3.6rem;
    }

  /* ── ANIMATIONS ── */
  @keyframes ct-rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: none; }
  }
  .ct-anim { animation: ct-rise 0.6s cubic-bezier(.22,1,.36,1) both; }
  .ct-d1 { animation-delay: 0.05s; }
  .ct-d2 { animation-delay: 0.15s; }
  .ct-d3 { animation-delay: 0.25s; }
  .ct-d4 { animation-delay: 0.35s; }
  .ct-d5 { animation-delay: 0.45s; }
`

const SOCIALS = [
  { name: "GitHub",    sub: "View my code",      icon: "⌥",  color: "#e8b454", href: ME.github,    bg: "rgba(232,180,84,0.1)",   border: "rgba(232,180,84,0.3)" },
  { name: "LinkedIn",  sub: "Connect with me",   icon: "in", color: "#60a5fa", href: ME.linkedin,  bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.3)" },
  { name: "Portfolio", sub: "See my work",       icon: "◈",  color: "#3db87a", href: ME.portfolio, bg: "rgba(61,184,122,0.1)",   border: "rgba(61,184,122,0.3)" },
]

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

          {/* ── HERO ── */}
          <div className="ct-hero ct-anim ct-d1">
            <div className="ct-chip">Open to Internships · Full Stack · Data Analytics</div>
            <h1 className="ct-name">{ME.name}</h1>
            <p className="">
              <strong>Full Stack Developer</strong> · B.Tech CSE 2024–28 · MGIT Hyderabad<br />
              Building <strong>scalable web apps</strong> & <strong>analytics platforms</strong> — reach out to collaborate.
            </p>
          </div>

          {/* ── DIRECT CONTACT ── */}
          <div className="ct-label ct-anim ct-d2"><span>Direct Contact</span></div>
          <div className="ct-contact-row ct-anim ct-d2">
            <a href={`mailto:${ME.email}`} className="ct-contact-card"
              style={{ '--bar': 'linear-gradient(90deg, #e8b454, #e8b45488, transparent)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(232,180,84,0.4)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.4), 0 0 24px rgba(232,180,84,0.12)'; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow=''; e.currentTarget.querySelector('.ct-contact-card-bar').style.opacity='0' }}
            >
              <div className="ct-contact-card-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#e8b454,#e8b45488,transparent)', opacity:0, transition:'opacity 0.3s' }} />
              <div className="ct-cc-icon">✉️</div>
              <div>
                <div className="ct-cc-label">Email</div>
                <div className="ct-cc-val">{ME.email}</div>
              </div>
            </a>
            <a href={`tel:${ME.phone.replace(/\s/g,'')}`} className="ct-contact-card"
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(96,165,250,0.4)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.4), 0 0 24px rgba(96,165,250,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow=''; }}
            >
              <div className="ct-cc-icon" style={{ background:'rgba(96,165,250,0.1)', borderColor:'rgba(96,165,250,0.2)' }}>📞</div>
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
                onMouseEnter={e => { e.currentTarget.style.borderColor=s.border; e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.4), 0 0 24px ${s.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow=''; }}
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
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${p.color}44`; e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.4), 0 0 24px ${p.color}22`; e.currentTarget.querySelector('.ct-proj-bar').style.opacity='1'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow=''; e.currentTarget.querySelector('.ct-proj-bar').style.opacity='0'; }}
              >
                <div className="ct-proj-bar" style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${p.color},${p.color}88,transparent)`, opacity:0, transition:'opacity 0.3s' }} />
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

        </div>
      </div>
    </Navbar>
  )
}