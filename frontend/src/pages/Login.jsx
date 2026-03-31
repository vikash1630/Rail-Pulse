import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from './Navbar'

const API_URI = import.meta.env.VITE_API_URL

/* ─── styles ─── */
const css = `
  /* ── Structural & Anti-Scroll Fix ── */
  .lg-page {
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
    .lg-page {
      /* Counteracts mobile Navbar padding */
      margin: -5rem -1rem -2rem -1rem; 
    }
  }

  .lg-content-wrapper {
    flex: 1; /* Takes remaining space between tracks */
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
  .lg-font-mythic   { font-family: var(--font-mythic); font-weight: 400; }
  .lg-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .lg-font-body     { font-family: var(--font-body); }

  /* ── RAILWAY BACKGROUND & AMBIENCE ── */
  .lg-content-wrapper::before {
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
  .lg-content-wrapper::after {
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
  .lg-rail-tracks {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 55%;
    z-index: 0;
    pointer-events: none;
  }
  .lg-rail-tracks svg { width: 100%; height: 100%; }

  /* ── FLOATING PARTICLES ── */
  .lg-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    animation: lg-float-up linear infinite;
    background: var(--swarna-gold);
    opacity: 0;
    will-change: transform, opacity;
  }
  @keyframes lg-float-up {
    0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
    10%  { opacity: .4; }
    90%  { opacity: .1; }
    100% { transform: translate3d(0, -100vh, 0) scale(.3); opacity: 0; }
  }

  /* ── Train Track Animation (Top & Bottom) ── */
  .lg-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
    flex-shrink: 0; /* Prevents track from squishing */
    border-bottom: 2px solid var(--stone-3);
  }
  .lg-train-track.bottom {
    border-bottom: none;
    border-top: 2px solid var(--stone-3);
  }

  .lg-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    will-change: transform;
  }
  .lg-train-loop-container.rtl { animation: lg-train-rtl 15s linear infinite; }
  .lg-train-loop-container.ltr { 
    left: -100vw; 
    animation: lg-train-ltr 15s linear infinite; 
  }

  .lg-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .lg-train-set.ltr-set {
    justify-content: flex-start; padding-right: 0; padding-left: 50px;
    flex-direction: row-reverse;
  }

  .lg-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
    will-change: transform;
  }
  .lg-train-set.ltr-set .lg-bogie { transform: scaleX(-1); }

  @keyframes lg-train-rtl { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-100vw,0,0)} }
  @keyframes lg-train-ltr { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(100vw,0,0)} }

  /* ── COMPACT CARD ── */
  .lg-login-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 360px; /* Reduced Width */
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    border-radius: 16px;
    padding: 1.6rem 1.4rem; /* Reduced Padding */
    box-shadow: var(--shadow-outset);
    animation: lg-card-in .7s cubic-bezier(.22,1,.36,1) both;
    will-change: transform, box-shadow;
    transform: translateZ(0);
  }

  @keyframes lg-card-in {
    from { opacity: 0; transform: translate3d(0, 20px, 0) scale(.98); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }

  .lg-login-card::before, .lg-login-card::after {
    content: ''; position: absolute;
    width: 18px; height: 18px;
    border-color: var(--kansa-bronze);
    border-style: solid;
    border-radius: 4px;
    transition: border-color 0.4s;
  }
  .lg-login-card::before { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
  .lg-login-card::after  { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }
  .lg-login-card:hover::before, .lg-login-card:hover::after { border-color: var(--swarna-gold); }

  /* ── CARD HEADER ── */
  .lg-card-header { margin-bottom: 1.2rem; position: relative; z-index: 2; } /* Reduced Gap */

  .lg-signal-row {
    display: flex; gap: 5px; margin-bottom: 0.8rem; align-items: center;
  }
  .lg-sig-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: lg-pulse-dot 2.5s infinite;
    will-change: transform, opacity;
  }
  .lg-sig-dot:nth-child(1) { background: var(--sindoor-red); box-shadow: 0 0 6px var(--sindoor-red); animation-delay: 0s; }
  .lg-sig-dot:nth-child(2) { background: var(--swarna-gold); box-shadow: 0 0 6px var(--swarna-gold); animation-delay: .8s; }
  .lg-sig-dot:nth-child(3) { background: #3CB371;            box-shadow: 0 0 6px #3CB371;            animation-delay: 1.6s; }
  
  @keyframes lg-pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .5; transform: scale(.8); }
  }
  .lg-sig-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--stone-3), transparent);
    margin-left: .4rem;
  }

  .lg-card-tag {
    font-family: var(--font-historic);
    font-size: .6rem; letter-spacing: .2em;
    color: var(--kansa-light); text-transform: uppercase;
    margin-bottom: .2rem; font-weight: 800;
  }
  .lg-card-title {
    font-family: var(--font-mythic);
    font-size: 3rem; letter-spacing: .02em;
    color: var(--text-primary); line-height: 1;
    text-shadow: var(--shadow-outset);
  }
  .lg-card-title span { color: var(--swarna-gold); }
  
  .lg-card-subtitle {
    font-family: var(--font-body);
    font-size: .8rem; color: var(--text-muted);
    letter-spacing: .02em; margin-top: .2rem;
  }

  /* ── FORM ── */
  .lg-rail-form { display: flex; flex-direction: column; gap: 1rem; position: relative; z-index: 2; } /* Tighter gap */

  .lg-field-wrap { position: relative; }

  .lg-field-label {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--font-historic);
    font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: .4rem;
    transition: color .25s; font-weight: 800;
  }
  .lg-field-label::before {
    content: ''; display: block; width: 4px; height: 4px;
    border-radius: 50%; background: var(--text-muted);
    transition: background 0.3s, box-shadow 0.3s;
  }

  .lg-field-input-row {
    display: flex; align-items: center; gap: .6rem;
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 8px;
    padding: 0.6rem 0.8rem; /* Thinner inputs */
    transition: border-color .3s, box-shadow .3s;
  }
  .lg-field-input-row:focus-within {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 2px var(--kansa-glow);
  }
  .lg-field-input-row:focus-within + .lg-field-label,
  .lg-field-wrap:focus-within .lg-field-label {
    color: var(--kansa-light);
  }
  .lg-field-wrap:focus-within .lg-field-label::before {
    background: var(--swarna-gold);
    box-shadow: 0 0 6px var(--swarna-gold);
  }
  
  .lg-field-icon {
    font-size: .9rem; color: var(--text-muted);
    transition: color .3s, transform .3s; flex-shrink: 0;
  }
  .lg-field-input-row:focus-within .lg-field-icon {
    color: var(--swarna-gold); transform: scale(1.1);
  }

  .lg-field-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text-primary); font-family: var(--font-body);
    font-size: .95rem; font-weight: 600; padding: 0;
  }
  .lg-field-input::placeholder { color: var(--text-muted); opacity: 0.5; font-weight: 400; }
  .lg-field-input:-webkit-autofill {
    -webkit-text-fill-color: var(--text-primary) !important;
    -webkit-box-shadow: 0 0 0 1000px var(--stone-1) inset !important;
  }

  /* Password Toggle Button */
  .lg-pwd-toggle {
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
  .lg-pwd-toggle:hover, .lg-pwd-toggle:focus {
    color: var(--swarna-gold);
  }

  /* ── ERROR ── */
  .lg-error-bar {
    display: flex; align-items: center; gap: .5rem;
    padding: .6rem .8rem;
    background: rgba(227,66,52,0.08);
    border: 1px solid rgba(227,66,52,0.35);
    border-radius: 8px;
    font-family: var(--font-historic); font-size: .7rem;
    color: var(--sindoor-red); letter-spacing: .05em;
    animation: lg-shake .4s cubic-bezier(.36,.07,.19,.97);
  }
  @keyframes lg-shake {
    10%,90% { transform: translate3d(-2px,0,0); }
    20%,80% { transform: translate3d(4px,0,0); }
    30%,50%,70% { transform: translate3d(-4px,0,0); }
    40%,60% { transform: translate3d(4px,0,0); }
  }

  /* ── BUTTON ── */
  .lg-submit-btn {
    position: relative; width: 100%; padding: .85rem; /* Reduced Padding */
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
  .lg-submit-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .lg-submit-btn:hover {
    background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light));
    transform: translateY(-2px); box-shadow: var(--diya-glow);
  }
  .lg-submit-btn:hover::after { left: 160%; }
  .lg-submit-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }
  .lg-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* loading dots */
  .lg-loading-dot { display: inline-block; animation: lg-blink 1s infinite; }
  .lg-loading-dot:nth-child(2) { animation-delay: .2s; }
  .lg-loading-dot:nth-child(3) { animation-delay: .4s; }
  @keyframes lg-blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ── DIVIDER ── */
  .lg-divider {
    display: flex; align-items: center; gap: .5rem;
    color: var(--text-muted); font-family: var(--font-historic);
    font-size: .6rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase;
  }
  .lg-divider::before, .lg-divider::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--stone-3), transparent);
  }

  /* ── BOTTOM LINK ── */
  .lg-bottom-link {
    text-align: center; font-family: var(--font-body);
    font-size: .8rem; color: var(--text-muted); letter-spacing: .02em;
  }
  .lg-bottom-link a {
    color: var(--kansa-light); text-decoration: none; font-weight: 700;
    transition: color .2s, text-shadow .2s;
  }
  .lg-bottom-link a:hover { color: var(--swarna-gold); text-shadow: 0 0 10px var(--kansa-glow); }

  /* ── CARD FOOTER ── */
  .lg-card-footer {
    margin-top: 1.2rem; padding-top: .8rem; /* Tighter footer */
    border-top: 1px solid var(--stone-3);
    display: flex; justify-content: space-between; align-items: center;
    position: relative; z-index: 2;
  }
  .lg-footer-badge {
    font-family: var(--font-historic); font-size: .5rem; font-weight: 800;
    letter-spacing: .15em; color: var(--text-muted); text-transform: uppercase;
    display: flex; align-items: center; gap: .3rem;
  }
  .lg-secure-icon { color: #3CB371; font-size: .7rem; }

  /* ── DESKTOP TRANSFORMS & 3D SMOOTHNESS ── */
  @media (min-width: 1024px) {
    .lg-login-card {
      transform-style: preserve-3d;
      transition: transform .6s cubic-bezier(.34, 1.56, .64, 1), box-shadow .6s, border-color .6s;
      max-width: 380px; /* Kept compact for desktop too */
      transform: translate3d(0,0,0);
    }
    .lg-content-wrapper:hover .lg-login-card {
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
    .lg-login-card { padding: 1.8rem 1.6rem; }
    .lg-ticket-strip {
      position: absolute; top: 50%; right: -130px;
      transform: translateY(-50%) rotate(90deg);
      font-family: var(--font-historic); font-size: .6rem; font-weight: 800;
      letter-spacing: .3em; color: rgba(205,127,50,.25);
      white-space: nowrap; user-select: none; pointer-events: none;
    }
  }
  @media (max-width: 767px) {
    .lg-ticket-strip { display: none; }
  }
`

const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${8 + i * 11}%`,
  size: `${2 + (i % 3)}px`,
  duration: `${10 + i * 3}s`,
  delay: `${-i * 1.5}s`,
}))

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URI}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        navigate("/train")
      } else {
        setError(data.error || "Invalid credentials. Please try again.")
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
        <div className="lg-page">
          
          {/* ── TOP TRAIN TRACK (Right to Left) ── */}
          <div className="lg-train-track top">
            <div className="lg-train-loop-container rtl">
              <div className="lg-train-set">
                <div className="lg-bogie">🚂</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
              </div>
              <div className="lg-train-set">
                <div className="lg-bogie">🚂</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
              </div>
            </div>
          </div>

          <div className="lg-content-wrapper">
            {/* floating embers */}
            {particles.map(p => (
              <div
                key={p.id}
                className="lg-particle"
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
            <div className="lg-rail-tracks">
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
                    <rect
                      key={i} x={lx} y={y - 2} width={w} height={3} rx={1} fill="rgba(212,175,55,.12)"
                    />
                  )
                })}
                <path d="M 280 400 L 330 0" stroke="rgba(212,175,55,.08)" strokeWidth="8" filter="blur(4px)" />
                <path d="M 420 400 L 370 0" stroke="rgba(212,175,55,.08)" strokeWidth="8" filter="blur(4px)" />
              </svg>
            </div>

            {/* card */}
            <div className="lg-login-card">
              <div className="lg-ticket-strip">
                ◈ YATRA MARGA ◈ SECURE PORTAL ◈
              </div>

              {/* header */}
              <div className="lg-card-header">
                <div className="lg-signal-row">
                  <span className="lg-sig-dot" />
                  <span className="lg-sig-dot" />
                  <span className="lg-sig-dot" />
                  <span className="lg-sig-line" />
                </div>
                <div className="lg-card-tag">↳ Passenger Portal</div>
                <div className="lg-card-title">BOARD<span>.</span></div>
                <div className="lg-card-subtitle">Sign in to manage your journeys</div>
              </div>

              {/* form */}
              <form className="lg-rail-form" onSubmit={submitForm}>
                <div className="lg-field-wrap">
                  <div className="lg-field-label">Email Address</div>
                  <div className="lg-field-input-row">
                    <span className="lg-field-icon">✉</span>
                    <input
                      type="email"
                      required
                      className="lg-field-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="lg-field-wrap">
                  <div className="lg-field-label">Password</div>
                  <div className="lg-field-input-row">
                    <span className="lg-field-icon">◈</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="lg-field-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="lg-pwd-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="lg-error-bar">
                    <span>⚠</span> {error}
                  </div>
                )}

                <button type="submit" className="lg-submit-btn" disabled={loading}>
                  {loading
                    ? <>VERIFYING<span className="lg-loading-dot">.</span><span className="lg-loading-dot">.</span><span className="lg-loading-dot">.</span></>
                    : "BOARD THE TRAIN →"
                  }
                </button>

                <div className="lg-divider">OR</div>

                <div className="lg-bottom-link">
                  New passenger?{" "}
                  <Link to="/signup">Create an account →</Link>
                </div>
              </form>

              <div className="lg-card-footer">
                <div className="lg-footer-badge">
                  <span className="lg-secure-icon">✔</span> 256-bit encrypted
                </div>
                <div className="lg-footer-badge">
                  YUGA DB v2.4
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM TRAIN TRACK (Left to Right) ── */}
          <div className="lg-train-track bottom">
            <div className="lg-train-loop-container ltr">
              <div className="lg-train-set ltr-set">
                <div className="lg-bogie">🚂</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
              </div>
              <div className="lg-train-set ltr-set">
                <div className="lg-bogie">🚂</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
                <div className="lg-bogie">🚃</div>
              </div>
            </div>
          </div>

        </div>
      </Navbar>
    </>
  )
}

export default Login