import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const API_URI = import.meta.env.VITE_API_URL

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --ink:          #07080b;
    --ink-2:        #0d1016;
    --ink-3:        #161920;
    --ink-4:        #1f222c;
    --ink-5:        #292d3a;
    --gold:         #c9973a;
    --gold-light:   #e8b454;
    --gold-pale:    rgba(201,151,58,.1);
    --gold-glow:    rgba(201,151,58,.3);
    --sig-red:      #e05252;
    --sig-amber:    #d4883a;
    --sig-green:    #3db87a;
    --text-1:       #f0eeeb;
    --text-2:       #9ca3af;
    --text-3:       #6b7280;
    --glass:        rgba(255,255,255,.038);
    --glass-border: rgba(255,255,255,.08);
    --sidebar-w:    270px;
    --font-display: 'Bebas Neue', 'Impact', sans-serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
    --font-mono:    'Space Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--ink);
    color: var(--text-1);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Noise grain overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: .025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--ink-2); }
  ::-webkit-scrollbar-thumb { background: rgba(201,151,58,.3); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`

const NAV_CSS = `
  /* ────────────────────────────────
     KEYFRAMES
  ──────────────────────────────── */
  @keyframes sig-pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes nav-glow    { 0%,100%{box-shadow:0 0 6px currentColor} 50%{box-shadow:0 0 18px currentColor, 0 0 40px currentColor} }
  @keyframes nav-slide-in { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes sidebar-scan { 0%{top:0%;opacity:.4} 100%{top:100%;opacity:0} }
  @keyframes track-flow  { 0%{background-position:0 0} 100%{background-position:0 60px} }
  @keyframes burger-show { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }

  /* ────────────────────────────────
     HAMBURGER
  ──────────────────────────────── */
  .rw-hamburger {
    display: none;
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 500;
    width: 44px; height: 44px;
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    backdrop-filter: blur(16px);
    transition: border-color .3s, box-shadow .3s, background .3s;
    animation: burger-show .3s cubic-bezier(.22,1,.36,1) both;
  }
  .rw-hamburger:hover {
    border-color: rgba(201,151,58,.4);
    box-shadow: 0 0 24px rgba(201,151,58,.15);
    background: var(--ink-3);
  }
  .rw-hamburger span {
    display: block;
    width: 18px; height: 1.5px;
    background: var(--text-2);
    border-radius: 2px;
    transition: all .35s cubic-bezier(.22,1,.36,1);
    transform-origin: center;
  }
  .rw-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: var(--gold); }
  .rw-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .rw-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: var(--gold); }

  /* ────────────────────────────────
     SIDEBAR
  ──────────────────────────────── */
  .rw-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: var(--sidebar-w);
    height: 100vh;
    background: var(--ink-2);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    z-index: 300;
    overflow: hidden;
    transition: transform .45s cubic-bezier(.22,1,.36,1);
  }

  /* Right shimmer border */
  .rw-sidebar::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(201,151,58,.4) 25%,
      rgba(232,180,84,.5) 50%,
      rgba(201,151,58,.4) 75%,
      transparent 100%
    );
    z-index: 10;
  }

  /* Scan line on sidebar (desktop only) */
  @media (min-width: 900px) {
    .rw-sidebar::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 120px;
      background: linear-gradient(to bottom, transparent, rgba(201,151,58,.03), transparent);
      animation: sidebar-scan 6s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }
  }

  /* Vertical track decoration */
  .rw-track-bar {
    position: absolute;
    left: 18px;
    top: 120px;
    bottom: 80px;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      rgba(201,151,58,.12) 0px,
      rgba(201,151,58,.12) 8px,
      transparent 8px,
      transparent 14px
    );
    animation: track-flow 3s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* ────────────────────────────────
     LOGO
  ──────────────────────────────── */
  .rw-logo {
    padding: 2rem 1.6rem 1.6rem;
    border-bottom: 1px solid var(--glass-border);
    position: relative;
    z-index: 2;
  }

  .rw-signals {
    display: flex;
    gap: 8px;
    margin-bottom: 1.4rem;
    align-items: center;
  }
  .rw-sig {
    width: 9px; height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
  }
  .rw-sig::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: inherit;
    opacity: .2;
    filter: blur(4px);
  }
  .rw-sig-r { background: var(--sig-red);   animation: sig-pulse 3s 0s   infinite; }
  .rw-sig-a { background: var(--sig-amber); animation: sig-pulse 3s .9s  infinite; }
  .rw-sig-g { background: var(--sig-green); animation: sig-pulse 3s 1.8s infinite; }
  .rw-sig-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,151,58,.2), transparent);
  }

  .rw-logo-name {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 400;
    color: var(--text-1);
    letter-spacing: .12em;
    line-height: 1;
    text-transform: uppercase;
  }
  .rw-logo-name em {
    font-style: normal;
    color: var(--gold-light);
    text-shadow: 0 0 30px rgba(232,180,84,.4);
  }
  .rw-logo-tag {
    font-family: var(--font-mono);
    font-size: .58rem;
    font-weight: 700;
    letter-spacing: .35em;
    color: var(--text-3);
    text-transform: uppercase;
    margin-top: .5rem;
  }

  /* ────────────────────────────────
     NAV BODY
  ──────────────────────────────── */
  .rw-nav {
    flex: 1;
    padding: 1.2rem 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    scrollbar-width: none;
    position: relative;
    z-index: 2;
  }
  .rw-nav::-webkit-scrollbar { display: none; }

  .rw-nav-section {
    font-family: var(--font-mono);
    font-size: .55rem;
    font-weight: 700;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: var(--text-3);
    padding: 1.1rem 1.6rem .5rem;
    display: flex;
    align-items: center;
    gap: .6rem;
  }
  .rw-nav-section::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--glass-border), transparent);
  }

  /* ────────────────────────────────
     NAV LINKS
  ──────────────────────────────── */
  .rw-link {
    display: flex;
    align-items: center;
    gap: .85rem;
    margin: 0 .65rem;
    padding: .7rem .9rem;
    border-radius: 12px;
    text-decoration: none;
    color: var(--text-2);
    font-family: var(--font-body);
    font-size: .88rem;
    font-weight: 500;
    letter-spacing: .02em;
    position: relative;
    transition: color .25s, background .25s, transform .2s;
    overflow: hidden;
    animation: nav-slide-in .4s cubic-bezier(.22,1,.36,1) both;
  }
  .rw-link:nth-child(2) { animation-delay: .05s; }
  .rw-link:nth-child(3) { animation-delay: .1s; }
  .rw-link:nth-child(4) { animation-delay: .15s; }

  /* Hover fill */
  .rw-link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(201,151,58,.08) 0%, transparent 70%);
    opacity: 0;
    transition: opacity .25s;
  }

  /* Shimmer on hover */
  .rw-link::after {
    content: '';
    position: absolute;
    top: 0; left: -80%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
    transition: left .5s ease;
    pointer-events: none;
  }

  .rw-link:hover {
    color: var(--text-1);
    transform: translateX(3px);
  }
  .rw-link:hover::before { opacity: 1; }
  .rw-link:hover::after  { left: 150%; }

  .rw-link.active {
    color: var(--gold-light);
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,.15);
    box-shadow: 0 0 20px rgba(201,151,58,.06);
  }
  /* Active left accent */
  .rw-link.active .rw-link-accent {
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(to bottom, var(--gold), var(--gold-light));
    box-shadow: 0 0 10px var(--gold-glow);
  }

  /* ────────────────────────────────
     LINK ICON
  ──────────────────────────────── */
  .rw-link-icon {
    width: 34px; height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    font-size: .95rem;
    flex-shrink: 0;
    transition: background .25s, border-color .25s, transform .25s, box-shadow .25s;
  }
  .rw-link:hover .rw-link-icon,
  .rw-link.active .rw-link-icon {
    background: var(--gold-pale);
    border-color: rgba(201,151,58,.3);
    transform: scale(1.1) rotate(-3deg);
    box-shadow: 0 0 16px rgba(201,151,58,.12);
  }
  .rw-link-label { position: relative; z-index: 1; }

  /* ────────────────────────────────
     PROFILE CARD
  ──────────────────────────────── */
  .rw-profile-card {
    margin: 0 .65rem;
    padding: .85rem .9rem;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--gold-pale) 0%, rgba(201,151,58,.05) 100%);
    border: 1px solid rgba(201,151,58,.2);
    display: flex;
    align-items: center;
    gap: .85rem;
    position: relative;
    overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    z-index: 2;
  }
  .rw-profile-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.5), transparent);
  }
  .rw-profile-card:hover {
    border-color: rgba(201,151,58,.4);
    box-shadow: 0 8px 30px rgba(0,0,0,.3), 0 0 30px rgba(201,151,58,.08);
  }

  .rw-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: .05em;
    color: var(--ink);
    flex-shrink: 0;
    box-shadow: 0 0 20px var(--gold-glow), 0 0 0 2px rgba(201,151,58,.2);
  }

  .rw-profile-info { flex: 1; min-width: 0; }
  .rw-profile-name {
    font-family: var(--font-body);
    font-size: .85rem;
    font-weight: 600;
    color: var(--gold-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rw-profile-role {
    font-family: var(--font-mono);
    font-size: .55rem;
    font-weight: 700;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: .15rem;
  }

  /* Online indicator */
  .rw-profile-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--sig-green);
    box-shadow: 0 0 8px var(--sig-green);
    flex-shrink: 0;
    animation: sig-pulse 2s infinite;
  }

  /* ────────────────────────────────
     LOGOUT
  ──────────────────────────────── */
  .rw-logout-btn {
    display: flex;
    align-items: center;
    gap: .85rem;
    margin: 0 .65rem;
    padding: .7rem .9rem;
    border-radius: 12px;
    color: var(--sig-red);
    font-family: var(--font-body);
    font-size: .88rem;
    font-weight: 500;
    position: relative;
    transition: color .25s, transform .2s;
    background: none;
    border: none;
    cursor: pointer;
    width: calc(100% - 1.3rem);
    text-align: left;
    overflow: hidden;
    z-index: 2;
  }
  .rw-logout-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: rgba(224,82,82,.06);
    opacity: 0;
    transition: opacity .25s;
  }
  .rw-logout-btn:hover { color: #ff7f7f; transform: translateX(3px); }
  .rw-logout-btn:hover::before { opacity: 1; }

  .rw-logout-icon {
    width: 34px; height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(224,82,82,.07);
    border: 1px solid rgba(224,82,82,.18);
    font-size: .95rem;
    flex-shrink: 0;
    transition: background .25s, transform .25s;
  }
  .rw-logout-btn:hover .rw-logout-icon {
    background: rgba(224,82,82,.14);
    transform: scale(1.1) rotate(5deg);
  }

  /* ────────────────────────────────
     FOOTER
  ──────────────────────────────── */
  .rw-sidebar-footer {
    padding: 1.2rem 1.6rem;
    border-top: 1px solid var(--glass-border);
    position: relative;
    z-index: 2;
  }
  .rw-status {
    display: flex;
    align-items: center;
    gap: .6rem;
  }
  .rw-led {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--sig-green);
    box-shadow: 0 0 10px var(--sig-green);
    animation: sig-pulse 2s infinite;
    flex-shrink: 0;
  }
  .rw-status-text {
    font-family: var(--font-mono);
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .18em;
    color: var(--text-3);
    text-transform: uppercase;
  }
  .rw-version {
    font-family: var(--font-mono);
    font-size: .55rem;
    color: var(--text-3);
    margin-top: .4rem;
    letter-spacing: .12em;
    opacity: .6;
  }

  /* ────────────────────────────────
     OVERLAY
  ──────────────────────────────── */
  .rw-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(7,8,11,.8);
    backdrop-filter: blur(4px);
    z-index: 200;
    transition: opacity .3s;
  }
  .rw-overlay.open { display: block; }

  /* ────────────────────────────────
     LAYOUT
  ──────────────────────────────── */
  .rw-layout { display: flex; min-height: 100vh; }
  .rw-main {
    flex: 1;
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    transition: margin .45s cubic-bezier(.22,1,.36,1);
  }

  /* ────────────────────────────────
     MOBILE
  ──────────────────────────────── */
  @media (max-width: 900px) {
    .rw-hamburger { display: flex; }
    .rw-sidebar   { transform: translateX(-100%); box-shadow: none; }
    .rw-sidebar.open {
      transform: translateX(0);
      box-shadow: 20px 0 60px rgba(0,0,0,.6);
    }
    .rw-main { margin-left: 0; }
  }

  /* Loading shimmer for auth */
  .rw-auth-loading {
    margin: 0 .65rem;
    padding: .7rem .9rem;
    border-radius: 12px;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    overflow: hidden;
    position: relative;
    height: 50px;
  }
  .rw-auth-loading::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
    animation: sidebar-shimmer 1.5s ease-in-out infinite;
  }
  @keyframes sidebar-shimmer { 0%{left:-100%} 100%{left:100%} }
`

const EXPLORE_ITEMS = [
  { label: "DashBoard", to: "/",               icon:"🎬" },
  { label: "Trains",    to: "/train",          icon: "🚂" },
  // { label: "Schedule",  to: "/schedule",       icon: "🕐" },
  // { label: "Routes",    to: "/routes",         icon: "🗺" },
  { label: "Revenue",   to: "/Revenue",        icon: "💲"  },
  { label: "Demand",    to: "/DemandAndInfra", icon:"📊"} ,
]
const MORE_ITEMS = [
  // { label: "Bookings", to: "/bookings", icon: "🎫" },
     { label: "About Us", to: "/About", icon:"😐"},
     { label: "Contact Us", to: "/Contact", icon:"📞"}
]

const Navbar = ({ children }) => {
  const [open, setOpen]         = useState(false)
  const [user, setUser]         = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const { pathname }            = useLocation()
  const navigate                = useNavigate()

  useEffect(() => {
    setOpen(false)
    const checkAuth = async () => {
      try {
        const res  = await fetch(`${API_URI}/api/auth/me`, { credentials: "include" })
        const data = await res.json()
        console.log(data)
        if (res.ok) { setUser(data) } else { setUser(false) }
      } catch { setUser(false) }
      finally { setAuthReady(true) }
    }
    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch(`${API_URI}/api/auth/logout`, { method: "POST", credentials: "include" })
    } catch { /* ignore */ }
    setUser(false)
    navigate("/login")
  }

  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "?"

  return (
    <>
      <style>{GLOBAL_CSS + NAV_CSS}</style>

      {/* Hamburger */}
      <button
        className={`rw-hamburger${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      {/* Overlay */}
      <div
        className={`rw-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className="rw-layout">
        <aside className={`rw-sidebar${open ? " open" : ""}`}>

          {/* Vertical track decoration */}
          <div className="rw-track-bar" />

          {/* Logo */}
          <div className="rw-logo">
            <div className="rw-signals">
              <span className="rw-sig rw-sig-r" />
              <span className="rw-sig rw-sig-a" />
              <span className="rw-sig rw-sig-g" />
              <span className="rw-sig-line" />
            </div>
            <div className="rw-logo-name">Rail<em>way</em></div>
            <div className="rw-logo-tag">National Rail System</div>
          </div>

          {/* Nav */}
          <nav className="rw-nav">

            <div className="rw-nav-section">Explore</div>
            {EXPLORE_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`rw-link${pathname === item.to ? " active" : ""}`}
              >
                <span className="rw-link-accent" />
                <span className="rw-link-icon">{item.icon}</span>
                <span className="rw-link-label">{item.label}</span>
              </Link>
            ))}

            <div className="rw-nav-section">Account</div>

            {authReady && user ? (
              <>
                <div className="rw-profile-card">
                  <div className="rw-avatar">{avatar}</div>
                  <div className="rw-profile-info">
                    <div className="rw-profile-name">{user.name}</div>
                    <div className="rw-profile-role">Passenger</div>
                  </div>
                  <div className="rw-profile-dot" />
                </div>
                <button className="rw-logout-btn" onClick={handleLogout}>
                  <span className="rw-logout-icon">↩</span>
                  <span className="rw-link-label">Logout</span>
                </button>
              </>
            ) : authReady && !user ? (
              <>
                <Link to="/login" className={`rw-link${pathname === "/login" ? " active" : ""}`}>
                  <span className="rw-link-accent" />
                  <span className="rw-link-icon">→</span>
                  <span className="rw-link-label">Login</span>
                </Link>
                <Link to="/signup" className={`rw-link${pathname === "/signup" ? " active" : ""}`}>
                  <span className="rw-link-accent" />
                  <span className="rw-link-icon">✦</span>
                  <span className="rw-link-label">Sign Up</span>
                </Link>
              </>
            ) : (
              <div className="rw-auth-loading" />
            )}

            <div className="rw-nav-section">More</div>
            {MORE_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`rw-link${pathname === item.to ? " active" : ""}`}
              >
                <span className="rw-link-accent" />
                <span className="rw-link-icon">{item.icon}</span>
                <span className="rw-link-label">{item.label}</span>
              </Link>
            ))}

          </nav>

          {/* Footer */}
          <div className="rw-sidebar-footer">
            <div className="rw-status">
              <div className="rw-led" />
              <span className="rw-status-text">All Systems Operational</span>
            </div>
            <div className="rw-version">Railway OS v2.4.1 · Build 2024</div>
          </div>

        </aside>

        <main className="rw-main">
          {children}
        </main>
      </div>
    </>
  )
}

export default Navbar