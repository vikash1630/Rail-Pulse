import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const API_URI = import.meta.env.VITE_API_URL

/* ─── SHARED CSS VARS + FONT IMPORT ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:          #08090c;
    --ink-2:        #0f1117;
    --ink-3:        #181b23;
    --ink-4:        #21242f;
    --ink-5:        #2c3040;
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
    --glass:        rgba(255,255,255,.042);
    --glass-border: rgba(255,255,255,.09);
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
    --sidebar-w:    260px;
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

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: .03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }
`

const NAV_CSS = `
  /* ── HAMBURGER ── */
  .rw-hamburger {
    display: none;
    position: fixed;
    top: 1.1rem;
    right: 1.1rem;
    z-index: 500;
    width: 42px; height: 42px;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: border-color .3s, box-shadow .3s;
    backdrop-filter: blur(12px);
  }
  .rw-hamburger:hover { border-color: var(--gold); box-shadow: 0 0 18px var(--gold-glow); }
  .rw-hamburger span {
    display: block;
    width: 20px; height: 1.5px;
    background: var(--text-2);
    border-radius: 2px;
    transition: all .35s cubic-bezier(.22,1,.36,1);
    transform-origin: center;
  }
  .rw-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: var(--gold); }
  .rw-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .rw-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: var(--gold); }

  /* ── SIDEBAR ── */
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
  .rw-sidebar::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent 0%, rgba(201,151,58,.3) 30%, rgba(201,151,58,.3) 70%, transparent 100%);
  }

  /* ── LOGO ── */
  .rw-logo {
    padding: 2rem 1.6rem 1.4rem;
    border-bottom: 1px solid var(--glass-border);
  }
  .rw-signals { display: flex; gap: 7px; margin-bottom: 1.2rem; align-items: center; }
  .rw-sig { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .rw-sig-r { background: var(--sig-red);   box-shadow: 0 0 6px var(--sig-red);   animation: sig-pulse 3s 0s   infinite; }
  .rw-sig-a { background: var(--sig-amber); box-shadow: 0 0 6px var(--sig-amber); animation: sig-pulse 3s .9s  infinite; }
  .rw-sig-g { background: var(--sig-green); box-shadow: 0 0 6px var(--sig-green); animation: sig-pulse 3s 1.8s infinite; }
  @keyframes sig-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  .rw-sig-line { flex:1; height:1px; background: linear-gradient(90deg, var(--glass-border), transparent); }
  .rw-logo-name { font-family: var(--font-display); font-size: 1.7rem; font-weight: 700; color: var(--text-1); letter-spacing: .01em; line-height: 1.1; }
  .rw-logo-name em { font-style: italic; color: var(--gold-light); }
  .rw-logo-tag { font-size: .68rem; font-weight: 500; letter-spacing: .3em; color: var(--text-3); text-transform: uppercase; margin-top: .35rem; }

  /* ── NAV ── */
  .rw-nav { flex: 1; padding: 1.2rem 0; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; scrollbar-width: none; }
  .rw-nav::-webkit-scrollbar { display: none; }
  .rw-nav-section { font-size: .6rem; font-weight: 600; letter-spacing: .3em; text-transform: uppercase; color: var(--text-3); padding: 1rem 1.6rem .5rem; }

  .rw-link {
    display: flex; align-items: center; gap: .85rem;
    margin: 0 .75rem; padding: .75rem .9rem;
    border-radius: 10px; text-decoration: none;
    color: var(--text-2); font-size: .9rem; font-weight: 500; letter-spacing: .01em;
    position: relative; transition: color .25s, background .25s; overflow: hidden;
  }
  .rw-link::before { content:''; position:absolute; inset:0; border-radius:10px; background:var(--gold-pale); opacity:0; transition:opacity .25s; }
  .rw-link:hover { color: var(--text-1); }
  .rw-link:hover::before { opacity: 1; }
  .rw-link.active { color: var(--gold-light); background: var(--gold-pale); }
  .rw-link.active::after { content:''; position:absolute; left:0; top:20%; bottom:20%; width:3px; border-radius:0 3px 3px 0; background:var(--gold); box-shadow:0 0 12px var(--gold-glow); }

  .rw-link-icon {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; background: var(--glass); border: 1px solid var(--glass-border);
    font-size: .9rem; flex-shrink: 0;
    transition: background .25s, border-color .25s, transform .25s;
  }
  .rw-link:hover .rw-link-icon,
  .rw-link.active .rw-link-icon { background: var(--gold-pale); border-color: rgba(201,151,58,.3); transform: scale(1.08); }
  .rw-link-label { position: relative; z-index: 1; }

  /* ── PROFILE CARD (shown when logged in) ── */
  .rw-profile-card {
    margin: 0 .75rem;
    padding: .75rem .9rem;
    border-radius: 10px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,.2);
    display: flex;
    align-items: center;
    gap: .85rem;
    cursor: default;
    transition: border-color .25s, box-shadow .25s;
  }
  .rw-profile-card:hover {
    border-color: rgba(201,151,58,.4);
    box-shadow: 0 0 16px rgba(201,151,58,.1);
  }
  .rw-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: .85rem;
    font-weight: 700;
    color: var(--ink);
    flex-shrink: 0;
    box-shadow: 0 0 12px var(--gold-glow);
  }
  .rw-profile-info { flex: 1; min-width: 0; }
  .rw-profile-name {
    font-size: .85rem;
    font-weight: 600;
    color: var(--gold-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: .01em;
  }
  .rw-profile-role {
    font-size: .62rem;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: .1rem;
  }

  /* ── LOGOUT BUTTON ── */
  .rw-logout-btn {
    display: flex; align-items: center; gap: .85rem;
    margin: 0 .75rem; padding: .75rem .9rem;
    border-radius: 10px; text-decoration: none;
    color: var(--sig-red);
    font-size: .9rem; font-weight: 500; letter-spacing: .01em;
    position: relative; transition: color .25s, background .25s;
    background: none; border: none; cursor: pointer; width: calc(100% - 1.5rem);
    text-align: left;
    overflow: hidden;
  }
  .rw-logout-btn::before { content:''; position:absolute; inset:0; border-radius:10px; background:rgba(224,82,82,.08); opacity:0; transition:opacity .25s; }
  .rw-logout-btn:hover { color: #ff7f7f; }
  .rw-logout-btn:hover::before { opacity: 1; }
  .rw-logout-icon {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; background: rgba(224,82,82,.08); border: 1px solid rgba(224,82,82,.2);
    font-size: .9rem; flex-shrink: 0;
    transition: background .25s, transform .25s;
  }
  .rw-logout-btn:hover .rw-logout-icon { background: rgba(224,82,82,.15); transform: scale(1.08); }

  /* ── FOOTER ── */
  .rw-sidebar-footer { padding: 1.2rem 1.6rem; border-top: 1px solid var(--glass-border); }
  .rw-status { display: flex; align-items: center; gap: .6rem; }
  .rw-led { width:7px; height:7px; border-radius:50%; background:var(--sig-green); box-shadow:0 0 8px var(--sig-green); animation:sig-pulse 2s infinite; flex-shrink:0; }
  .rw-status-text { font-size:.7rem; font-weight:500; letter-spacing:.12em; color:var(--text-3); text-transform:uppercase; }
  .rw-version { font-size:.62rem; color:var(--text-3); margin-top:.3rem; letter-spacing:.08em; }

  /* ── OVERLAY ── */
  .rw-overlay { display:none; position:fixed; inset:0; background:rgba(8,9,12,.7); backdrop-filter:blur(3px); z-index:200; }
  .rw-overlay.open { display:block; }

  /* ── LAYOUT ── */
  .rw-layout { display:flex; min-height:100vh; }
  .rw-main { flex:1; margin-left:var(--sidebar-w); min-height:100vh; transition:margin .45s cubic-bezier(.22,1,.36,1); }

  /* ── MOBILE ── */
  @media (max-width: 900px) {
    .rw-hamburger { display: flex; }
    .rw-sidebar   { transform: translateX(-100%); }
    .rw-sidebar.open { transform: translateX(0); }
    .rw-main { margin-left: 0; }
  }
`

const EXPLORE_ITEMS = [
  { label: "Trains", to: "/", icon: "🚂" },
  { label: "Schedule", to: "/schedule", icon: "🕐" },
  { label: "Routes", to: "/routes", icon: "🗺" },
]

const MORE_ITEMS = [
  { label: "Bookings", to: "/bookings", icon: "🎫" },
]

const Navbar = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)   // null = loading, false = guest, object = logged in
  const [authReady, setAuthReady] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // ── Check auth on every route change ──
  useEffect(() => {
    setOpen(false)

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URI}/api/auth/me`, { credentials: "include" })
        const data = await res.json()  // read once
        console.log(data)
        if (res.ok) {
          setUser(data)                // reuse same data
        } else {
          setUser(false)
        }
      } catch {
        setUser(false)
      } finally {
        setAuthReady(true)
      }
    }

    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch(`${API_URI}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch { /* ignore */ }
    setUser(false)
    navigate("/login")
  }

  // First letter of name for avatar
  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "?"

  return (
    <>
      <style>{GLOBAL_CSS + NAV_CSS}</style>

      {/* hamburger */}
      <button
        className={`rw-hamburger${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      {/* overlay */}
      <div
        className={`rw-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className="rw-layout">
        <aside className={`rw-sidebar${open ? " open" : ""}`}>

          {/* logo */}
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

          {/* nav */}
          <nav className="rw-nav">

            {/* ── Explore ── */}
            <div className="rw-nav-section">Explore</div>
            {EXPLORE_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`rw-link${pathname === item.to ? " active" : ""}`}
              >
                <span className="rw-link-icon">{item.icon}</span>
                <span className="rw-link-label">{item.label}</span>
              </Link>
            ))}

            {/* ── Account ── */}
            <div className="rw-nav-section">Account</div>

            {authReady && user ? (
              /* ── LOGGED IN ── */
              <>


                {/* User identity chip */}
                <div className="rw-profile-card">
                  <div className="rw-avatar">{avatar}</div>
                  <div className="rw-profile-info">
                    <div className="rw-profile-name">{user.name}</div>
                    <div className="rw-profile-role">Passenger</div>
                  </div>
                </div>

                {/* Logout */}
                <button className="rw-logout-btn" onClick={handleLogout}>
                  <span className="rw-logout-icon">↩</span>
                  <span className="rw-link-label">Logout</span>
                </button>
              </>
            ) : authReady && !user ? (
              /* ── GUEST ── */
              <>
                <Link to="/login" className={`rw-link${pathname === "/login" ? " active" : ""}`}>
                  <span className="rw-link-icon">→</span>
                  <span className="rw-link-label">Login</span>
                </Link>
                <Link to="/signup" className={`rw-link${pathname === "/signup" ? " active" : ""}`}>
                  <span className="rw-link-icon">✦</span>
                  <span className="rw-link-label">Sign Up</span>
                </Link>
              </>
            ) : (
              /* ── LOADING ── */
              <div style={{ padding: ".75rem 1.6rem", fontSize: ".75rem", color: "var(--text-3)", letterSpacing: ".1em" }}>
                Checking session…
              </div>
            )}

            {/* ── More ── */}
            <div className="rw-nav-section">More</div>
            {MORE_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`rw-link${pathname === item.to ? " active" : ""}`}
              >
                <span className="rw-link-icon">{item.icon}</span>
                <span className="rw-link-label">{item.label}</span>
              </Link>
            ))}

          </nav>

          {/* footer */}
          <div className="rw-sidebar-footer">
            <div className="rw-status">
              <div className="rw-led" />
              <span className="rw-status-text">All Systems Operational</span>
            </div>
            <div className="rw-version">Railway OS v2.4.1</div>
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