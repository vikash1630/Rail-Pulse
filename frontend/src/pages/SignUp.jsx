import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"

const API_URI = import.meta.env.VITE_API_URL

const css = `
  /* Inherits global CSS vars from Navbar (--gold, --ink-*, --font-display, --font-body, etc.) */

  /* ── PAGE ── */
  .signup-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
    overflow: hidden;
    background: var(--ink);
  }

  /* ── AMBIENT GLOW BG ── */
  .signup-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 50% at 15% 20%, rgba(201,151,58,.08) 0%, transparent 65%),
      radial-gradient(ellipse 45% 40% at 85% 80%, rgba(201,151,58,.05) 0%, transparent 65%),
      radial-gradient(ellipse 30% 30% at 50% 50%, rgba(201,151,58,.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── FINE GRID ── */
  .signup-page::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.025) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── TICKET STRIP (side decoration) ── */
  .ticket-strip {
    display: none;
  }
  @media (min-width: 900px) {
    .ticket-strip {
      display: block;
      position: absolute;
      top: 50%;
      left: -118px;
      transform: translateY(-50%) rotate(-90deg);
      font-family: var(--font-body);
      font-size: .6rem;
      font-weight: 600;
      letter-spacing: .45em;
      color: rgba(201,151,58,.18);
      white-space: nowrap;
      text-transform: uppercase;
      user-select: none;
      pointer-events: none;
    }
  }

  /* ── CARD ── */
  .signup-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 460px;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    padding: 2.8rem 2.4rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(201,151,58,.04),
      0 30px 80px rgba(0,0,0,.7),
      inset 0 1px 0 rgba(255,255,255,.04);
    animation: card-rise .75s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes card-rise {
    from { opacity: 0; transform: translateY(36px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* gold corner accents */
  .signup-card::before,
  .signup-card::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-color: var(--gold);
    border-style: solid;
    opacity: .7;
  }
  .signup-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
  .signup-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  /* 3D tilt on desktop */
  @media (min-width: 1024px) {
    .signup-card {
      max-width: 490px;
      transition: transform .55s cubic-bezier(.22,1,.36,1), box-shadow .55s;
    }
    .signup-card:hover {
      transform: rotateY(2deg) rotateX(-1deg) scale(1.015) translateY(-4px);
      box-shadow:
        -12px 0 50px rgba(0,0,0,.45),
        0 35px 90px rgba(0,0,0,.65),
        inset 0 1px 0 rgba(255,255,255,.06);
    }
  }

  /* ── HEADER ── */
  .card-header { margin-bottom: 2rem; }

  /* signal dots row (mirrors Navbar logo area) */
  .signal-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 1.4rem;
  }
  .sig-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .sig-dot-r { background: var(--sig-red);   box-shadow: 0 0 6px var(--sig-red);   animation: sig-blink 3s 0s   infinite; }
  .sig-dot-a { background: var(--sig-amber); box-shadow: 0 0 6px var(--sig-amber); animation: sig-blink 3s .9s  infinite; }
  .sig-dot-g { background: var(--sig-green); box-shadow: 0 0 6px var(--sig-green); animation: sig-blink 3s 1.8s infinite; }
  @keyframes sig-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: .35; }
  }
  .sig-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--glass-border), transparent); }

  .card-eyebrow {
    font-family: var(--font-body);
    font-size: .65rem;
    font-weight: 600;
    letter-spacing: .35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: .5rem;
  }

  .card-title {
    font-family: var(--font-display);
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--text-1);
    line-height: 1.05;
    letter-spacing: .01em;
  }
  .card-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .card-subtitle {
    font-family: var(--font-body);
    font-size: .78rem;
    font-weight: 400;
    letter-spacing: .12em;
    color: var(--text-3);
    text-transform: uppercase;
    margin-top: .5rem;
  }

  /* ── PROGRESS STEPS ── */
  .step-bar {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .35rem;
    position: relative;
  }
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 9px;
    left: 50%;
    width: 100%;
    height: 1px;
    background: var(--glass-border);
    z-index: 0;
    transition: background .4s;
  }
  .step.done::after { background: var(--gold); opacity: .5; }

  .step-circle {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--ink-4);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-body);
    font-size: .55rem;
    font-weight: 600;
    color: var(--text-3);
    position: relative;
    z-index: 1;
    transition: background .3s, border-color .3s, box-shadow .3s;
  }
  .step.active .step-circle {
    background: var(--gold);
    border-color: var(--gold-light);
    color: var(--ink);
    box-shadow: 0 0 14px var(--gold-glow);
  }
  .step.done .step-circle {
    background: var(--gold-pale);
    border-color: rgba(201,151,58,.4);
    color: var(--gold-light);
  }
  .step-label {
    font-family: var(--font-body);
    font-size: .58rem;
    letter-spacing: .15em;
    color: var(--text-3);
    text-transform: uppercase;
    font-weight: 500;
  }
  .step.active .step-label { color: var(--gold-light); }
  .step.done  .step-label  { color: var(--text-3); }

  /* ── FORM ── */
  .rail-form {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .field-wrap { position: relative; }

  .field-label {
    display: block;
    font-family: var(--font-body);
    font-size: .67rem;
    font-weight: 600;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: .55rem;
    transition: color .25s;
  }
  .field-wrap:focus-within .field-label { color: var(--gold-light); }

  .field-input-row {
    display: flex;
    align-items: center;
    gap: .8rem;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: .55rem;
    transition: border-color .3s;
  }
  .field-input-row:focus-within { border-color: var(--gold); }

  .field-icon {
    font-size: .9rem;
    color: var(--text-3);
    flex-shrink: 0;
    transition: color .3s, transform .3s;
    line-height: 1;
  }
  .field-input-row:focus-within .field-icon {
    color: var(--gold-light);
    transform: scale(1.15);
  }

  .field-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-1);
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: .04em;
    padding: .1rem 0;
  }
  .field-input::placeholder {
    color: var(--text-3);
    font-style: italic;
    font-weight: 300;
  }
  .field-input:-webkit-autofill {
    -webkit-text-fill-color: var(--text-1) !important;
    -webkit-box-shadow: 0 0 0 1000px var(--ink-3) inset !important;
  }

  /* ── PASSWORD STRENGTH ── */
  .strength-row {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-top: .5rem;
  }
  .strength-meter {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .strength-seg {
    flex: 1;
    height: 2px;
    border-radius: 2px;
    background: var(--ink-4);
    transition: background .4s;
  }
  .strength-text {
    font-family: var(--font-body);
    font-size: .62rem;
    font-weight: 600;
    letter-spacing: .15em;
    text-transform: uppercase;
    min-width: 40px;
    text-align: right;
  }
  /* strength levels */
  .s1 .strength-seg:nth-child(1)              { background: var(--sig-red);   }
  .s2 .strength-seg:nth-child(-n+2)           { background: var(--sig-amber); }
  .s3 .strength-seg:nth-child(-n+3)           { background: var(--gold); }
  .s4 .strength-seg                           { background: var(--sig-green); }

  /* ── ERROR / SUCCESS ── */
  .msg-bar {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .75rem 1rem;
    border-radius: 3px;
    font-family: var(--font-body);
    font-size: .82rem;
    font-weight: 400;
    letter-spacing: .04em;
  }
  .msg-bar.error {
    background: rgba(224,82,82,.1);
    border: 1px solid rgba(224,82,82,.25);
    color: #fca5a5;
    animation: shake .4s cubic-bezier(.36,.07,.19,.97);
  }
  .msg-bar.success {
    background: rgba(61,184,122,.08);
    border: 1px solid rgba(61,184,122,.25);
    color: #86efac;
    animation: slide-in .4s ease;
  }
  @keyframes shake {
    10%,90% { transform: translateX(-2px); }
    20%,80% { transform: translateX(4px); }
    30%,50%,70% { transform: translateX(-4px); }
    40%,60% { transform: translateX(4px); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── SUBMIT BUTTON ── */
  .submit-btn {
    position: relative;
    width: 100%;
    padding: .95rem;
    background: linear-gradient(135deg, #a87828, var(--gold), var(--gold-light));
    background-size: 200% 100%;
    background-position: 100% 0;
    border: none;
    border-radius: 3px;
    color: var(--ink);
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: .12em;
    cursor: pointer;
    overflow: hidden;
    transition: background-position .55s, transform .2s, box-shadow .3s;
    margin-top: .2rem;
    box-shadow: 0 4px 28px var(--gold-glow);
  }
  .submit-btn:hover {
    background-position: 0 0;
    transform: translateY(-2px);
    box-shadow: 0 10px 40px rgba(201,151,58,.45);
  }
  .submit-btn:active { transform: translateY(0) scale(.98); }
  /* shimmer sweep */
  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,.25) 50%, transparent 70%);
    transform: translateX(-120%);
    transition: transform .6s;
  }
  .submit-btn:hover::before { transform: translateX(120%); }
  .submit-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }

  .loading-dot { display: inline-block; animation: blink 1s infinite; }
  .loading-dot:nth-child(2) { animation-delay:.2s; }
  .loading-dot:nth-child(3) { animation-delay:.4s; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ── DIVIDER ── */
  .divider {
    display: flex;
    align-items: center;
    gap: .75rem;
    font-family: var(--font-body);
    font-size: .65rem;
    font-weight: 500;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .divider::before,
  .divider::after { content:''; flex:1; height:1px; background: var(--glass-border); }

  /* ── BOTTOM LINK ── */
  .bottom-link {
    text-align: center;
    font-family: var(--font-body);
    font-size: .85rem;
    color: var(--text-3);
    letter-spacing: .04em;
  }
  .bottom-link a {
    color: var(--gold-light);
    text-decoration: none;
    font-weight: 600;
    transition: color .2s, text-shadow .2s;
  }
  .bottom-link a:hover {
    color: var(--text-1);
    text-shadow: 0 0 14px var(--gold-glow);
  }

  /* ── CARD FOOTER ── */
  .card-footer {
    margin-top: 1.8rem;
    padding-top: 1rem;
    border-top: 1px solid var(--glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-badge {
    font-family: var(--font-body);
    font-size: .62rem;
    letter-spacing: .2em;
    color: var(--text-3);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: .4rem;
    font-weight: 500;
  }
  .secure-icon { color: var(--sig-green); }
`

const getStrength = (pw) => {
  let s = 0
  if (pw.length >= 8)           s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"]
const STRENGTH_COLOR = ["", "var(--sig-red)", "var(--sig-amber)", "var(--gold)", "var(--sig-green)"]

const SignUp = () => {
  const [userName, setUserName] = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
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
      <div className="signup-page">
        <div className="signup-card">
          <div className="ticket-strip">
            ◈ NATIONAL RAIL ◈ PASSENGER REGISTRATION ◈ SECURE FORM ◈
          </div>

          {/* ── HEADER ── */}
          <div className="card-header">
            <div className="signal-row">
              <span className="sig-dot sig-dot-r" />
              <span className="sig-dot sig-dot-a" />
              <span className="sig-dot sig-dot-g" />
              <span className="sig-line" />
            </div>
            <div className="card-eyebrow">↳ New Passenger Registration</div>
            <div className="card-title">Depar<em>ture</em></div>
            <div className="card-subtitle">Your journey begins here</div>
          </div>

          {/* ── STEP BAR ── */}
          <div className="step-bar">
            {["Name", "Email", "Pass", "Done"].map((label, i) => (
              <div
                key={i}
                className={`step${i < step ? " done" : i === step ? " active" : ""}`}
              >
                <div className="step-circle">
                  {i < step ? "✓" : i + 1}
                </div>
                <div className="step-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ── FORM ── */}
          <form className="rail-form" onSubmit={submitForm}>

            {/* Name */}
            <div className="field-wrap">
              <label className="field-label">Full Name</label>
              <div className="field-input-row">
                <span className="field-icon">◉</span>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="John Doe"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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

              {password && (
                <div className="strength-row">
                  <div className={`strength-meter s${strength}`}>
                    <div className="strength-seg" />
                    <div className="strength-seg" />
                    <div className="strength-seg" />
                    <div className="strength-seg" />
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: STRENGTH_COLOR[strength] }}
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            {error   && <div className="msg-bar error">   <span>⚠</span> {error}</div>}
            {success && <div className="msg-bar success"> <span>✔</span> Account created! Redirecting…</div>}

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || success}
            >
              {loading
                ? <>Registering<span className="loading-dot">.</span><span className="loading-dot">.</span><span className="loading-dot">.</span></>
                : success
                  ? "✔ Ticket Issued"
                  : "Issue Ticket →"
              }
            </button>

            <div className="divider">Already a passenger?</div>

            <div className="bottom-link">
              <Link to="/login">← Board with existing account</Link>
            </div>

          </form>

          {/* ── CARD FOOTER ── */}
          <div className="card-footer">
            <div className="footer-badge">
              <span className="secure-icon">✔</span> Encrypted
            </div>
            <div className="footer-badge">Railway OS v2.4.1</div>
          </div>
        </div>
      </div>
      </Navbar>
    </>
  )
}

export default SignUp