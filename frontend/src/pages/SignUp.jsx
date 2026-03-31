import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from './Navbar'

const API_URI = import.meta.env.VITE_API_URL

/* ─── styles ─── */
const css = `
  /* ── Structural & Anti-Scroll Fix ── */
  .su-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden; /* STRICTLY PREVENTS SCROLLING */
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
    
    /* Exactly counteracts Navbar padding to lock it to 100vh */
    height: 100vh;
    height: 100dvh;
    margin: -2rem; 
  }
  @media (max-width: 900px) {
    .su-page {
      /* Counteracts mobile Navbar padding */
      margin: -5rem -1rem -2rem -1rem; 
    }
  }

  .su-content-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    position: relative;
    perspective: 1200px;
    z-index: 10;
    overflow: hidden;
  }

  /* ── Typography Utilities ── */
  .su-font-mythic   { font-family: var(--font-mythic); font-weight: 400; }
  .su-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .su-font-body     { font-family: var(--font-body); }

  /* ── RAILWAY BACKGROUND & AMBIENCE ── */
  .su-content-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 45% 40% at 90% 5%, rgba(212,175,55,.12) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 10% 95%, rgba(42,59,92,.15) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }

  /* ── GRID OVERLAY ── */
  .su-content-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,.03) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: 0;
    pointer-events: none;
  }

  /* ── RAIL TRACK LINES (perspective) ── */
  .su-rail-tracks {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 55%;
    z-index: 0;
    pointer-events: none;
  }
  .su-rail-tracks svg { width: 100%; height: 100%; }

  /* ── FLOATING PARTICLES ── */
  .su-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    animation: su-float-up linear infinite;
    background: var(--swarna-gold);
    opacity: 0;
    will-change: transform, opacity;
  }
  @keyframes su-float-up {
    0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
    10%  { opacity: .4; }
    90%  { opacity: .1; }
    100% { transform: translate3d(0, -100vh, 0) scale(.3); opacity: 0; }
  }

  /* ── Train Track Animation (Top & Bottom) ── */
  .su-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
    flex-shrink: 0;
    border-bottom: 2px solid var(--stone-3);
  }
  .su-train-track.bottom {
    border-bottom: none;
    border-top: 2px solid var(--stone-3);
  }

  .su-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    will-change: transform;
  }
  .su-train-loop-container.rtl { animation: su-train-rtl 15s linear infinite; }
  .su-train-loop-container.ltr { 
    left: -100vw; 
    animation: su-train-ltr 15s linear infinite; 
  }

  .su-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .su-train-set.ltr-set {
    justify-content: flex-start; padding-right: 0; padding-left: 50px;
    flex-direction: row-reverse;
  }

  .su-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
    will-change: transform;
  }
  .su-train-set.ltr-set .su-bogie { transform: scaleX(-1); }

  @keyframes su-train-rtl { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-100vw,0,0)} }
  @keyframes su-train-ltr { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(100vw,0,0)} }

  /* ── COMPACT CARD ── */
  .su-signup-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 380px; 
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    border-radius: 16px;
    padding: 1.5rem 1.4rem; 
    box-shadow: var(--shadow-outset);
    animation: su-card-in .7s cubic-bezier(.22,1,.36,1) both;
    will-change: transform, box-shadow;
    transform: translateZ(0);
  }

  @keyframes su-card-in {
    from { opacity: 0; transform: translate3d(0, 20px, 0) scale(.98); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }

  .su-signup-card::before, .su-signup-card::after {
    content: ''; position: absolute;
    width: 18px; height: 18px;
    border-color: var(--kansa-bronze);
    border-style: solid;
    border-radius: 4px;
    transition: border-color 0.4s;
  }
  .su-signup-card::before { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
  .su-signup-card::after  { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }
  .su-signup-card:hover::before, .su-signup-card:hover::after { border-color: var(--swarna-gold); }

  /* ── CARD HEADER ── */
  .su-card-header { margin-bottom: 1rem; position: relative; z-index: 2; }

  .su-signal-row {
    display: flex; gap: 5px; margin-bottom: 0.6rem; align-items: center;
  }
  .su-sig-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: su-pulse-dot 2.5s infinite;
    will-change: transform, opacity;
  }
  .su-sig-dot:nth-child(1) { background: var(--sindoor-red); box-shadow: 0 0 6px var(--sindoor-red); animation-delay: 0s; }
  .su-sig-dot:nth-child(2) { background: var(--swarna-gold); box-shadow: 0 0 6px var(--swarna-gold); animation-delay: .8s; }
  .su-sig-dot:nth-child(3) { background: #3CB371;            box-shadow: 0 0 6px #3CB371;            animation-delay: 1.6s; }
  
  @keyframes su-pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .5; transform: scale(.8); }
  }
  .su-sig-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--stone-3), transparent);
    margin-left: .4rem;
  }

  .su-card-tag {
    font-family: var(--font-historic);
    font-size: .6rem; letter-spacing: .2em;
    color: var(--kansa-light); text-transform: uppercase;
    margin-bottom: .2rem; font-weight: 800;
  }
  .su-card-title {
    font-family: var(--font-mythic);
    font-size: 2.8rem; letter-spacing: .02em;
    color: var(--text-primary); line-height: 1;
    text-shadow: var(--shadow-outset);
  }
  .su-card-title span { color: var(--swarna-gold); }
  
  .su-card-subtitle {
    font-family: var(--font-body);
    font-size: .75rem; color: var(--text-muted);
    letter-spacing: .02em; margin-top: .2rem;
  }

  /* ── PROGRESS STEPS ── */
  .su-step-bar {
    display: flex; align-items: flex-start; margin-bottom: 1rem;
  }
  .su-step {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: .3rem; position: relative;
  }
  .su-step:not(:last-child)::after {
    content: ''; position: absolute; top: 9px; left: 50%; width: 100%; height: 1px;
    background: var(--stone-3); z-index: 0; transition: background .4s;
  }
  .su-step.done::after { background: var(--kansa-bronze); opacity: .5; }

  .su-step-circle {
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-body); font-size: .55rem; font-weight: 700;
    color: var(--text-muted); position: relative; z-index: 1;
    transition: background .3s, border-color .3s, box-shadow .3s, color .3s;
  }
  .su-step.active .su-step-circle {
    background: var(--stone-1); border-color: var(--swarna-gold); color: var(--swarna-gold);
    box-shadow: 0 0 10px var(--kansa-glow);
  }
  .su-step.done .su-step-circle {
    background: var(--stone-1); border-color: var(--kansa-bronze); color: var(--kansa-bronze);
  }
  .su-step-label {
    font-family: var(--font-historic); font-size: .55rem; letter-spacing: .15em;
    color: var(--text-muted); text-transform: uppercase; font-weight: 800;
  }
  .su-step.active .su-step-label { color: var(--swarna-gold); }
  .su-step.done  .su-step-label  { color: var(--kansa-bronze); }

  /* ── FORM ── */
  .su-rail-form { display: flex; flex-direction: column; gap: 0.85rem; position: relative; z-index: 2; }

  .su-field-wrap { position: relative; }

  .su-field-label {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--font-historic);
    font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: .3rem;
    transition: color .25s; font-weight: 800;
  }
  .su-field-label::before {
    content: ''; display: block; width: 4px; height: 4px;
    border-radius: 50%; background: var(--text-muted);
    transition: background 0.3s, box-shadow 0.3s;
  }

  .su-field-input-row {
    display: flex; align-items: center; gap: .6rem;
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    transition: border-color .3s, box-shadow .3s;
  }
  .su-field-input-row:focus-within {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 2px var(--kansa-glow);
  }
  .su-field-input-row:focus-within + .su-field-label,
  .su-field-wrap:focus-within .su-field-label {
    color: var(--kansa-light);
  }
  .su-field-wrap:focus-within .su-field-label::before {
    background: var(--swarna-gold);
    box-shadow: 0 0 6px var(--swarna-gold);
  }
  
  .su-field-icon {
    font-size: .9rem; color: var(--text-muted);
    transition: color .3s, transform .3s; flex-shrink: 0;
  }
  .su-field-input-row:focus-within .su-field-icon {
    color: var(--swarna-gold); transform: scale(1.1);
  }

  .su-field-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text-primary); font-family: var(--font-body);
    font-size: .9rem; font-weight: 600; padding: 0;
  }
  .su-field-input::placeholder { color: var(--text-muted); opacity: 0.5; font-weight: 400; }
  .su-field-input:-webkit-autofill {
    -webkit-text-fill-color: var(--text-primary) !important;
    -webkit-box-shadow: 0 0 0 1000px var(--stone-1) inset !important;
  }

  /* Password Toggle Button */
  .su-pwd-toggle {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-historic);
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    text-transform: uppercase;
    transition: color 0.3s;
    outline: none;
  }
  .su-pwd-toggle:hover, .su-pwd-toggle:focus {
    color: var(--swarna-gold);
  }

  /* ── PASSWORD STRENGTH ── */
  .su-strength-row {
    display: flex; align-items: center; gap: .5rem; margin-top: .4rem;
  }
  .su-strength-meter {
    display: flex; gap: 4px; flex: 1;
  }
  .su-strength-seg {
    flex: 1; height: 2px; border-radius: 2px;
    background: var(--stone-3); transition: background .4s;
  }
  .su-strength-text {
    font-family: var(--font-historic); font-size: .55rem; font-weight: 800;
    letter-spacing: .15em; text-transform: uppercase; min-width: 40px; text-align: right;
  }
  
  .s1 .su-strength-seg:nth-child(1)       { background: var(--sindoor-red); }
  .s2 .su-strength-seg:nth-child(-n+2)    { background: var(--kansa-bronze); }
  .s3 .su-strength-seg:nth-child(-n+3)    { background: var(--swarna-gold); }
  .s4 .su-strength-seg                    { background: #3CB371; }

  /* ── ERROR / SUCCESS ── */
  .su-msg-bar {
    display: flex; align-items: center; gap: .5rem;
    padding: .6rem .8rem; border-radius: 8px;
    font-family: var(--font-historic); font-size: .65rem;
    letter-spacing: .05em; text-transform: uppercase;
  }
  .su-msg-bar.error {
    background: rgba(227,66,52,0.08);
    border: 1px solid rgba(227,66,52,0.35);
    color: var(--sindoor-red);
    animation: su-shake .4s cubic-bezier(.36,.07,.19,.97);
  }
  .su-msg-bar.success {
    background: rgba(60,179,113,0.08);
    border: 1px solid rgba(60,179,113,0.25);
    color: #3CB371;
    animation: su-slide-in .4s ease;
  }
  @keyframes su-shake {
    10%,90% { transform: translate3d(-2px,0,0); }
    20%,80% { transform: translate3d(4px,0,0); }
    30%,50%,70% { transform: translate3d(-4px,0,0); }
    40%,60% { transform: translate3d(4px,0,0); }
  }
  @keyframes su-slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── BUTTON ── */
  .su-submit-btn {
    position: relative; width: 100%; padding: .85rem;
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    border: none; border-radius: 8px;
    color: var(--stone-1); font-family: var(--font-historic);
    font-size: 0.8rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-top: .2rem;
    box-shadow: inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), var(--shadow-outset);
    -webkit-tap-highlight-color: transparent;
  }
  .su-submit-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .su-submit-btn:hover {
    background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light));
    transform: translateY(-2px); box-shadow: var(--diya-glow);
  }
  .su-submit-btn:hover::after { left: 160%; }
  .su-submit-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }
  .su-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  .su-loading-dot { display: inline-block; animation: su-blink 1s infinite; }
  .su-loading-dot:nth-child(2) { animation-delay:.2s; }
  .su-loading-dot:nth-child(3) { animation-delay:.4s; }
  @keyframes su-blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ── DIVIDER ── */
  .su-divider {
    display: flex; align-items: center; gap: .5rem;
    color: var(--text-muted); font-family: var(--font-historic);
    font-size: .55rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase;
  }
  .su-divider::before, .su-divider::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--stone-3), transparent);
  }

  /* ── BOTTOM LINK ── */
  .su-bottom-link {
    text-align: center; font-family: var(--font-body);
    font-size: .8rem; color: var(--text-muted); letter-spacing: .02em;
  }
  .su-bottom-link a {
    color: var(--kansa-light); text-decoration: none; font-weight: 700;
    transition: color .2s, text-shadow .2s;
  }
  .su-bottom-link a:hover { color: var(--swarna-gold); text-shadow: 0 0 10px var(--kansa-glow); }

  /* ── CARD FOOTER ── */
  .su-card-footer {
    margin-top: 1.2rem; padding-top: .8rem;
    border-top: 1px solid var(--stone-3);
    display: flex; justify-content: space-between; align-items: center;
    position: relative; z-index: 2;
  }
  .su-footer-badge {
    font-family: var(--font-historic); font-size: .5rem; font-weight: 800;
    letter-spacing: .15em; color: var(--text-muted); text-transform: uppercase;
    display: flex; align-items: center; gap: .3rem;
  }
  .su-secure-icon { color: #3CB371; font-size: .7rem; }

  /* ── DESKTOP TRANSFORMS & 3D SMOOTHNESS ── */
  @media (min-width: 1024px) {
    .su-signup-card {
      transform-style: preserve-3d;
      transition: transform .6s cubic-bezier(.34, 1.56, .64, 1), box-shadow .6s, border-color .6s;
      max-width: 400px;
      transform: translate3d(0,0,0);
    }
    .su-content-wrapper:hover .su-signup-card {
      transform: rotateY(-3deg) rotateX(1.5deg) scale(1.02) translate3d(0, -4px, 10px);
      box-shadow: 
        15px 15px 40px rgba(0,0,0,.5),
        -5px -5px 25px rgba(255,255,255,.01),
        var(--diya-glow);
      border-color: var(--kansa-bronze);
    }
  }

  /* ── TICKET STRIP (desktop only) ── */
  @media (min-width: 768px) {
    .su-signup-card { padding: 1.8rem 1.6rem; }
    .su-ticket-strip {
      position: absolute; top: 50%; right: -150px;
      transform: translateY(-50%) rotate(90deg);
      font-family: var(--font-historic); font-size: .6rem; font-weight: 800;
      letter-spacing: .3em; color: rgba(205,127,50,.25);
      white-space: nowrap; user-select: none; pointer-events: none;
    }
  }
  @media (max-width: 767px) {
    .su-ticket-strip { display: none; }
  }
`

const getStrength = (pw) => {
  let s = 0
  if (pw.length >= 8)           s++
  if (/[A-Z]/.test(pw))         s++
  if (/[0-9]/.test(pw))         s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"]
const STRENGTH_COLOR = ["", "var(--sindoor-red)", "var(--kansa-bronze)", "var(--swarna-gold)", "#3CB371"]

const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${8 + i * 11}%`,
  size: `${2 + (i % 3)}px`,
  duration: `${10 + i * 3}s`,
  delay: `${-i * 1.5}s`,
}))

const SignUp = () => {
  const [userName, setUserName] = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const strength = getStrength(password)
  const step = !userName ? 0 : !email ? 1 : !password ? 2 : 3

  const submitForm = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URI}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => navigate("/login"), 1800)
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch {
      setError("Cannot reach the server. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <Navbar>
        <div className="su-page">

          {/* ── TOP TRAIN TRACK (Right to Left) ── */}
          <div className="su-train-track top">
            <div className="su-train-loop-container rtl">
              <div className="su-train-set">
                <div className="su-bogie">🚂</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
              </div>
              <div className="su-train-set">
                <div className="su-bogie">🚂</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
              </div>
            </div>
          </div>

          <div className="su-content-wrapper">
            {/* floating embers */}
            {particles.map(p => (
              <div
                key={p.id}
                className="su-particle"
                style={{
                  left: p.left,
                  width: p.size, height: p.size,
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                  bottom: 0,
                }}
              />
            ))}

            {/* perspective rail tracks */}
            <div className="su-rail-tracks">
              <svg viewBox="0 0 700 400" preserveAspectRatio="none" fill="none">
                <path d="M 280 400 L 330 0" stroke="rgba(205,127,50,.15)" strokeWidth="3" />
                <path d="M 420 400 L 370 0" stroke="rgba(205,127,50,.15)" strokeWidth="3" />
                {Array.from({ length: 14 }, (_, i) => {
                  const y = 28 + i * 28
                  const frac = y / 400
                  const lx = 280 + (330 - 280) * frac
                  const rx = 420 - (420 - 370) * frac
                  const w = rx - lx
                  return (
                    <rect key={i} x={lx} y={y - 2} width={w} height={3} rx={1} fill="rgba(212,175,55,.12)" />
                  )
                })}
                <path d="M 280 400 L 330 0" stroke="rgba(212,175,55,.08)" strokeWidth="8" filter="blur(4px)" />
                <path d="M 420 400 L 370 0" stroke="rgba(212,175,55,.08)" strokeWidth="8" filter="blur(4px)" />
              </svg>
            </div>

            {/* card */}
            <div className="su-signup-card">
              <div className="su-ticket-strip">
                ◈ YATRA MARGA ◈ PASSENGER REGISTRATION ◈
              </div>

              {/* header */}
              <div className="su-card-header">
                <div className="su-signal-row">
                  <span className="su-sig-dot" />
                  <span className="su-sig-dot" />
                  <span className="su-sig-dot" />
                  <span className="su-sig-line" />
                </div>
                <div className="su-card-tag">↳ New Registration</div>
                <div className="su-card-title">DEPARTURE<span>.</span></div>
                <div className="su-card-subtitle">Your journey begins here</div>
              </div>

              {/* ── STEP BAR ── */}
              <div className="su-step-bar">
                {["Name", "Email", "Pass", "Done"].map((label, i) => (
                  <div key={i} className={`su-step${i < step ? " done" : i === step ? " active" : ""}`}>
                    <div className="su-step-circle">
                      {i < step ? "✔" : i + 1}
                    </div>
                    <div className="su-step-label">{label}</div>
                  </div>
                ))}
              </div>

              {/* form */}
              <form className="su-rail-form" onSubmit={submitForm}>

                <div className="su-field-wrap">
                  <div className="su-field-label">Full Name</div>
                  <div className="su-field-input-row">
                    <span className="su-field-icon">◉</span>
                    <input
                      type="text"
                      required
                      className="su-field-input"
                      placeholder="John Doe"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="su-field-wrap">
                  <div className="su-field-label">Email Address</div>
                  <div className="su-field-input-row">
                    <span className="su-field-icon">✉</span>
                    <input
                      type="email"
                      required
                      className="su-field-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="su-field-wrap">
                  <div className="su-field-label">Password</div>
                  <div className="su-field-input-row">
                    <span className="su-field-icon">◈</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="su-field-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="su-pwd-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>

                  {password && (
                    <div className="su-strength-row">
                      <div className={`su-strength-meter s${strength}`}>
                        <div className="su-strength-seg" />
                        <div className="su-strength-seg" />
                        <div className="su-strength-seg" />
                        <div className="su-strength-seg" />
                      </div>
                      <span className="su-strength-text" style={{ color: STRENGTH_COLOR[strength] }}>
                        {STRENGTH_LABEL[strength]}
                      </span>
                    </div>
                  )}
                </div>

                {error && <div className="su-msg-bar error"><span>⚠</span> {error}</div>}
                {success && <div className="su-msg-bar success"><span>✔</span> Account created! Redirecting…</div>}

                <button type="submit" className="su-submit-btn" disabled={loading || success}>
                  {loading
                    ? <>REGISTERING<span className="su-loading-dot">.</span><span className="su-loading-dot">.</span><span className="su-loading-dot">.</span></>
                    : success
                      ? "✔ TICKET ISSUED"
                      : "ISSUE TICKET →"
                  }
                </button>

                <div className="su-divider">Already a passenger?</div>

                <div className="su-bottom-link">
                  <Link to="/login">← Board with existing account</Link>
                </div>

              </form>

              <div className="su-card-footer">
                <div className="su-footer-badge">
                  <span className="su-secure-icon">✔</span> Encrypted
                </div>
                <div className="su-footer-badge">
                  YUGA DB v2.4.1
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM TRAIN TRACK (Left to Right) ── */}
          <div className="su-train-track bottom">
            <div className="su-train-loop-container ltr">
              <div className="su-train-set ltr-set">
                <div className="su-bogie">🚂</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
              </div>
              <div className="su-train-set ltr-set">
                <div className="su-bogie">🚂</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
                <div className="su-bogie">🚃</div>
              </div>
            </div>
          </div>

        </div>
      </Navbar>
    </>
  )
}

export default SignUp