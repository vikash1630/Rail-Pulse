import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"

const API_URI = import.meta.env.VITE_API_URL

/* ─── styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;1,300&display=swap');

  :root {
    --rail-black:  #0a0a0b;
    --rail-steel:  #13151a;
    --rail-iron:   #1e2028;
    --amber:       #f59e0b;
    --amber-glow:  #fbbf24;
    --amber-dim:   rgba(245,158,11,.12);
    --signal-red:  #ef4444;
    --signal-green:#22c55e;
    --chrome:      #94a3b8;
    --chrome-dim:  #475569;
    --off-white:   #f1f5f9;
    --card-bg:     rgba(30,32,40,.85);
  }

  /* ── RESET ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Barlow Condensed', sans-serif; }

  /* ── PAGE ── */
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    background: var(--rail-black);
  }

  /* ── RAILWAY BACKGROUND ── */
  .login-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      /* amber signal glow top-right */
      radial-gradient(ellipse 45% 40% at 90% 5%, rgba(245,158,11,.18) 0%, transparent 70%),
      /* deep blue-steel bottom-left */
      radial-gradient(ellipse 60% 50% at 10% 95%, rgba(30,58,138,.25) 0%, transparent 70%),
      /* base gradient */
      linear-gradient(160deg, #0d0f14 0%, #111318 40%, #0a0a0b 100%);
    z-index: 0;
  }

  /* ── RAIL TRACK LINES (perspective) ── */
  .rail-tracks {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 55%;
    z-index: 0;
    pointer-events: none;
  }
  .rail-tracks svg { width: 100%; height: 100%; }

  /* ── GRID OVERLAY ── */
  .login-page::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,158,11,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,158,11,.025) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: 0;
  }

  /* ── FLOATING PARTICLES ── */
  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    animation: float-up linear infinite;
    background: var(--amber);
    opacity: 0;
  }
  @keyframes float-up {
    0%   { transform: translateY(0) scale(1); opacity: 0; }
    10%  { opacity: .5; }
    90%  { opacity: .15; }
    100% { transform: translateY(-100vh) scale(.3); opacity: 0; }
  }

  /* ── CARD ── */
  .login-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    background: var(--card-bg);
    border: 1px solid rgba(245,158,11,.2);
    border-radius: 4px;
    padding: 2.5rem 2rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(245,158,11,.05),
      0 25px 60px rgba(0,0,0,.7),
      inset 0 1px 0 rgba(255,255,255,.06);
    animation: card-in .7s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(32px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  /* corner brackets */
  .login-card::before, .login-card::after {
    content: '';
    position: absolute;
    width: 18px; height: 18px;
    border-color: var(--amber);
    border-style: solid;
  }
  .login-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
  .login-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  /* ── CARD HEADER ── */
  .card-header { margin-bottom: 2rem; }

  .signal-row {
    display: flex;
    gap: 6px;
    margin-bottom: 1.2rem;
    align-items: center;
  }
  .sig-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    animation: pulse-dot 2.5s infinite;
  }
  .sig-dot:nth-child(1) { background: var(--signal-red);   box-shadow: 0 0 8px var(--signal-red);   animation-delay: 0s; }
  .sig-dot:nth-child(2) { background: var(--amber);        box-shadow: 0 0 8px var(--amber);        animation-delay: .8s; }
  .sig-dot:nth-child(3) { background: var(--signal-green); box-shadow: 0 0 8px var(--signal-green); animation-delay: 1.6s; }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .5; transform: scale(.8); }
  }
  .sig-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--chrome-dim), transparent);
    margin-left: .5rem;
  }

  .card-tag {
    font-size: .7rem;
    letter-spacing: .35em;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: .4rem;
    font-weight: 600;
  }
  .card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem;
    letter-spacing: .08em;
    color: var(--off-white);
    line-height: 1;
  }
  .card-title span { color: var(--amber); }
  .card-subtitle {
    font-size: .82rem;
    color: var(--chrome-dim);
    letter-spacing: .1em;
    margin-top: .4rem;
  }

  /* ── FORM ── */
  .rail-form { display: flex; flex-direction: column; gap: 1.6rem; }

  .field-wrap { position: relative; }

  .field-label {
    display: block;
    font-size: .7rem;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--chrome-dim);
    margin-bottom: .5rem;
    transition: color .25s;
  }

  .field-input-row {
    display: flex;
    align-items: center;
    gap: .75rem;
    border-bottom: 1px solid #2d3140;
    padding-bottom: .5rem;
    transition: border-color .3s;
  }
  .field-input-row:focus-within {
    border-color: var(--amber);
  }
  .field-input-row:focus-within + .field-label,
  .field-wrap:focus-within .field-label {
    color: var(--amber);
  }
  .field-icon {
    font-size: .95rem;
    color: var(--chrome-dim);
    transition: color .3s, transform .3s;
    flex-shrink: 0;
  }
  .field-input-row:focus-within .field-icon {
    color: var(--amber);
    transform: scale(1.15);
  }

  .field-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--off-white);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.05rem;
    letter-spacing: .05em;
    padding: .15rem 0;
  }
  .field-input::placeholder { color: var(--chrome-dim); font-style: italic; }
  .field-input:-webkit-autofill {
    -webkit-text-fill-color: var(--off-white) !important;
    -webkit-box-shadow: 0 0 0 1000px var(--rail-iron) inset !important;
  }

  /* ── ERROR ── */
  .error-bar {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .7rem 1rem;
    background: rgba(239,68,68,.12);
    border: 1px solid rgba(239,68,68,.3);
    border-radius: 3px;
    font-size: .82rem;
    color: #fca5a5;
    letter-spacing: .05em;
    animation: shake .4s cubic-bezier(.36,.07,.19,.97);
  }
  @keyframes shake {
    10%,90% { transform: translateX(-2px); }
    20%,80% { transform: translateX(4px); }
    30%,50%,70% { transform: translateX(-4px); }
    40%,60% { transform: translateX(4px); }
  }

  /* ── BUTTON ── */
  .submit-btn {
    position: relative;
    width: 100%;
    padding: .9rem;
    background: linear-gradient(135deg, #b45309, var(--amber), #b45309);
    background-size: 200% 100%;
    background-position: 100% 0;
    border: none;
    border-radius: 3px;
    color: #0a0a0b;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: .25em;
    cursor: pointer;
    overflow: hidden;
    transition: background-position .5s, transform .2s, box-shadow .3s;
    margin-top: .4rem;
    box-shadow: 0 4px 24px rgba(245,158,11,.25);
  }
  .submit-btn:hover {
    background-position: 0 0;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(245,158,11,.45);
  }
  .submit-btn:active { transform: translateY(0) scale(.98); }
  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,.15) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform .5s;
  }
  .submit-btn:hover::before { transform: translateX(100%); }
  .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  /* loading dots */
  .loading-dot {
    display: inline-block;
    animation: blink 1s infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: .2s; }
  .loading-dot:nth-child(3) { animation-delay: .4s; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ── DIVIDER ── */
  .divider {
    display: flex;
    align-items: center;
    gap: .75rem;
    color: var(--chrome-dim);
    font-size: .7rem;
    letter-spacing: .2em;
    text-transform: uppercase;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2d3140;
  }

  /* ── BOTTOM LINK ── */
  .bottom-link {
    text-align: center;
    font-size: .83rem;
    color: var(--chrome-dim);
    letter-spacing: .05em;
  }
  .bottom-link a {
    color: var(--amber);
    text-decoration: none;
    font-weight: 700;
    letter-spacing: .08em;
    transition: color .2s, text-shadow .2s;
  }
  .bottom-link a:hover {
    color: var(--amber-glow);
    text-shadow: 0 0 12px var(--amber);
  }

  /* ── CARD FOOTER ── */
  .card-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #1e2028;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-badge {
    font-size: .65rem;
    letter-spacing: .2em;
    color: var(--chrome-dim);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: .4rem;
  }
  .secure-icon { color: var(--signal-green); font-size: .8rem; }

  /* ── DESKTOP TRANSFORMS ── */
  @media (min-width: 1024px) {
    .login-page { perspective: 1200px; }
    .login-card {
      transform-style: preserve-3d;
      transition: transform .6s cubic-bezier(.22,1,.36,1), box-shadow .6s;
      max-width: 460px;
    }
    .login-card:hover {
      transform: rotateY(-3deg) rotateX(1.5deg) scale(1.02) translateY(-6px);
      box-shadow:
        16px 0 60px rgba(0,0,0,.5),
        0 30px 80px rgba(0,0,0,.6),
        inset 0 1px 0 rgba(255,255,255,.1);
    }
  }

  /* ── TICKET STRIP (desktop only) ── */
  @media (min-width: 768px) {
    .login-card { padding: 3rem 2.5rem; }

    .ticket-strip {
      position: absolute;
      top: 50%;
      right: -130px;
      transform: translateY(-50%) rotate(90deg);
      font-family: 'Bebas Neue', sans-serif;
      font-size: .75rem;
      letter-spacing: .4em;
      color: rgba(245,158,11,.25);
      white-space: nowrap;
      user-select: none;
    }
  }
  @media (max-width: 767px) {
    .ticket-strip { display: none; }
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
      console.log(data)
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

        <div className="login-page">

          {/* floating embers */}
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
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
          <div className="rail-tracks">
            <svg viewBox="0 0 700 400" preserveAspectRatio="none" fill="none">
              {/* left rail */}
              <path d="M 280 400 L 330 0" stroke="rgba(148,163,184,.15)" strokeWidth="3" />
              {/* right rail */}
              <path d="M 420 400 L 370 0" stroke="rgba(148,163,184,.15)" strokeWidth="3" />
              {/* sleepers */}
              {Array.from({ length: 14 }, (_, i) => {
                const y = 28 + i * 28
                const frac = y / 400
                const lx = 280 + (330 - 280) * frac
                const rx = 420 - (420 - 370) * frac
                const w = rx - lx
                return (
                  <rect
                    key={i}
                    x={lx} y={y - 2}
                    width={w} height={3}
                    rx={1}
                    fill="rgba(148,163,184,.12)"
                  />
                )
              })}
              {/* amber glow on rail */}
              <path d="M 280 400 L 330 0" stroke="rgba(245,158,11,.05)" strokeWidth="8" filter="blur(4px)" />
              <path d="M 420 400 L 370 0" stroke="rgba(245,158,11,.05)" strokeWidth="8" filter="blur(4px)" />
            </svg>
          </div>

          {/* card */}
          <div className="login-card">
            <div className="ticket-strip">
              ◈ NATIONAL RAIL ◈ SECURE PORTAL ◈ AUTHENTICATED ACCESS ◈
            </div>

            {/* header */}
            <div className="card-header">
              <div className="signal-row">
                <span className="sig-dot" />
                <span className="sig-dot" />
                <span className="sig-dot" />
                <span className="sig-line" />
              </div>
              <div className="card-tag">↳ Passenger Access Portal</div>
              <div className="card-title">BOARD<span>.</span></div>
              <div className="card-subtitle">Sign in to manage your journeys</div>
            </div>

            {/* form */}
            <form className="rail-form" onSubmit={submitForm}>

              {/* email */}
              <div className="field-wrap">
                <label className="field-label">Email Address</label>
                <div className="field-input-row">
                  <span className="field-icon">✉</span>
                  <input
                    type="email"
                    required
                    className="field-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* password */}
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="field-input-row">
                  <span className="field-icon">◈</span>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="error-bar">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <>VERIFYING<span className="loading-dot">.</span><span className="loading-dot">.</span><span className="loading-dot">.</span></>
                  : "BOARD THE TRAIN →"
                }
              </button>

              <div className="divider">OR</div>

              <div className="bottom-link">
                New passenger?{" "}
                <Link to="/signup">Create an account →</Link>
              </div>

            </form>

            {/* footer */}
            <div className="card-footer">
              <div className="footer-badge">
                <span className="secure-icon">✔</span> 256-bit encrypted
              </div>
              <div className="footer-badge">
                RAILWAY v2.4
              </div>
            </div>
          </div>

        </div>
      </Navbar>
    </>
  )
}

export default Login