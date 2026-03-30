import React, { useState, useEffect, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const API_URI = import.meta.env.VITE_API_URL

/* ─────────────────────────────────────────────
   RAILPULSE YUGA CSS (Indian Architecture & Mythology)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@400;600;800&family=Kumbh+Sans:wght@300;400;500;600;700&family=Rozha+One&display=swap');

  :root {
    /* ── DARK MODE ── */
    --stone-1:         #08080A; 
    --stone-2:         #121318; 
    --stone-3:         #1A1C23; 
    
    --kansa-bronze:    #CD7F32; 
    --kansa-light:     #E6A86B;
    --kansa-glow:      rgba(205, 127, 50, 0.35);
    
    --swarna-gold:     #D4AF37; 
    --sindoor-red:     #E34234; 
    --haldi-yellow:    #FFC30B; 

    --text-primary:    #F4EFE6; 
    --text-muted:      #9B9891; 
    
    /* Carved Shadows */
    --shadow-outset:   6px 6px 14px rgba(0,0,0,0.8), -4px -4px 10px rgba(255,255,255,0.03);
    --shadow-inset:    inset 4px 4px 10px rgba(0,0,0,0.8), inset -3px -3px 8px rgba(255,255,255,0.03);
    --diya-glow:       0 0 25px var(--kansa-glow), 0 0 10px var(--haldi-yellow);

    --font-mythic:     'Rozha One', serif;
    --font-historic:   'Eczar', serif;
    --font-body:       'Kumbh Sans', sans-serif;
    
    --sidebar-w:       280px;
    --sidebar-collapsed: 0px; /* Completely hidden */
  }

  [data-theme="light"] {
    /* ── LIGHT MODE ── */
    --stone-1:         #FDFBF7; 
    --stone-2:         #F4EFE6; 
    --stone-3:         #E8DCC4; 
    
    --kansa-bronze:    #A65D1A; 
    --kansa-light:     #CD7F32;
    --kansa-glow:      rgba(166, 93, 26, 0.25);
    
    --swarna-gold:     #B8860B; 
    --sindoor-red:     #C82A1C; 
    
    --text-primary:    #2A241D; 
    --text-muted:      #736B5E;
    
    --shadow-outset:   6px 6px 14px rgba(184, 169, 144, 0.6), -4px -4px 10px rgba(255, 255, 255, 0.8);
    --shadow-inset:    inset 4px 4px 10px rgba(184, 169, 144, 0.5), inset -3px -3px 8px rgba(255, 255, 255, 0.9);
    --diya-glow:       0 4px 15px rgba(205, 127, 50, 0.3);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--stone-1);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
  }

  /* Stone Texture Overlay */
  body::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    opacity: 0.035; mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  [data-theme="light"] body::after { opacity: 0.05; mix-blend-mode: color-burn; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--stone-1); }
  ::-webkit-scrollbar-thumb { background: var(--kansa-bronze); border-radius: 10px; }
`

const NAV_CSS = `
  /* ────────────────────────────────
     KEYFRAMES & ANIMATIONS
  ──────────────────────────────── */
  @keyframes diya-flicker {
    0%, 100% { opacity: 1; filter: brightness(1); }
    50%      { opacity: 0.8; filter: brightness(1.2); box-shadow: var(--diya-glow); }
  }
  @keyframes link-slide-in { 
    from { opacity: 0; transform: translateX(-30px); } 
    to { opacity: 1; transform: translateX(0); } 
  }
  @keyframes train-sheen {
    0% { transform: translateX(-150%) skewX(-15deg); }
    100% { transform: translateX(200%) skewX(-15deg); }
  }

  /* ────────────────────────────────
     MOBILE HAMBURGER 
  ──────────────────────────────── */
  .yg-hamburger {
    display: none; position: fixed; top: 1rem; right: 1rem; z-index: 600;
    width: 48px; height: 48px;
    background: var(--stone-2);
    border: 1px solid var(--kansa-bronze);
    border-radius: 8px;
    flex-direction: column; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; box-shadow: var(--shadow-outset);
  }
  .yg-hamburger span {
    display: block; width: 22px; height: 2px;
    background: var(--kansa-light); border-radius: 2px;
    transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .yg-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); background: var(--sindoor-red); }
  .yg-hamburger.open span:nth-child(2) { opacity: 0; }
  .yg-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); background: var(--sindoor-red); }

  /* ────────────────────────────────
     SIDEBAR (The Carved Pillar)
  ──────────────────────────────── */
  .yg-sidebar {
    position: fixed; top: 0; left: 0;
    width: var(--sidebar-w); height: 100vh; height: 100dvh; 
    background: var(--stone-2);
    border-right: 2px solid var(--stone-3);
    box-shadow: 10px 0 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; z-index: 500;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s ease;
    overflow: hidden; /* Prevents text overflow when completely collapsed */
  }
  [data-theme="light"] .yg-sidebar { box-shadow: 10px 0 30px rgba(184, 169, 144, 0.3); }

  /* Collapsed State */
  .yg-sidebar.collapsed { 
    width: 0; 
    border-right-width: 0; 
    box-shadow: none; 
  }

  /* ────────────────────────────────
     DESKTOP COLLAPSE TOGGLE (Sleek Latch)
  ──────────────────────────────── */
  .yg-desktop-toggle {
    position: fixed; top: 50%; z-index: 510;
    background: linear-gradient(to bottom, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze));
    color: var(--stone-1);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-family: var(--font-mythic); font-size: 1.2rem;
    box-shadow: 4px 0 10px rgba(0,0,0,0.4);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  /* Latch state when Sidebar is OPEN */
  .yg-desktop-toggle:not(.collapsed) {
    left: var(--sidebar-w); transform: translate(-50%, -50%);
    width: 32px; height: 64px;
    border: 2px solid var(--stone-1); border-radius: 8px;
  }

  /* Latch state when Sidebar is COLLAPSED (Docked to edge) */
  .yg-desktop-toggle.collapsed {
    left: 0; transform: translateY(-50%);
    width: 28px; height: 72px;
    border: 2px solid var(--stone-1); border-left: none;
    border-radius: 0 8px 8px 0;
  }

  .yg-desktop-toggle:hover {
    background: linear-gradient(to bottom, var(--swarna-gold), var(--sindoor-red), var(--swarna-gold));
    box-shadow: 8px 0 20px rgba(205, 127, 50, 0.5);
    width: 40px;
  }
  
  @media (max-width: 900px) { .yg-desktop-toggle { display: none; } }

  /* ────────────────────────────────
     LOGO AREA
  ──────────────────────────────── */
  .yg-logo {
    padding: 3rem 1.5rem 1.5rem; /* Increased top padding since icon is gone */
    border-bottom: 2px solid var(--stone-3);
    display: flex; flex-direction: column; align-items: center; text-align: center;
    min-width: var(--sidebar-w); flex-shrink: 0;
  }
  .yg-logo-name {
    font-family: var(--font-mythic); font-size: 2.8rem; color: var(--kansa-light);
    line-height: 1; letter-spacing: 0.05em; text-shadow: var(--shadow-outset);
  }
  .yg-logo-name em { color: var(--sindoor-red); font-style: normal; }
  .yg-logo-tag {
    font-family: var(--font-historic); font-size: 0.7rem; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.2em;
    margin-top: 0.5rem;
  }

  /* ────────────────────────────────
     SCROLLABLE NAV AREA
  ──────────────────────────────── */
  .yg-nav { 
    flex: 1; padding: 1.5rem 0; min-width: var(--sidebar-w); 
    display: flex; flex-direction: column; gap: 0.5rem; 
    overflow-y: auto; overflow-x: hidden; 
    scrollbar-width: none;
  }
  .yg-nav::-webkit-scrollbar { display: none; }
  
  .yg-nav-section {
    font-family: var(--font-historic); font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted);
    padding: 1rem 1.5rem 0.5rem; display: flex; align-items: center; gap: 1rem;
    flex-shrink: 0; white-space: nowrap;
  }
  .yg-nav-section::after { content: ''; flex: 1; height: 2px; background: var(--stone-3); }

  /* Links */
  .yg-link {
    display: flex; align-items: center; gap: 1rem;
    margin: 0 1rem; padding: 0.8rem 1rem;
    border-radius: 8px; text-decoration: none; position: relative; overflow: hidden;
    color: var(--text-muted); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem;
    background: transparent; border: 1px solid transparent; flex-shrink: 0;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    animation: link-slide-in 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
    white-space: nowrap;
  }

  .yg-link-icon {
    font-size: 1.4rem; display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    background: var(--stone-3); box-shadow: var(--shadow-outset);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 2;
  }

  .yg-link-label { z-index: 2; }

  @media (hover: hover) {
    .yg-link:not(.active):hover {
      color: var(--kansa-light); background: var(--stone-1);
      box-shadow: var(--shadow-inset); transform: translateX(8px); 
    }
    .yg-link:not(.active):hover .yg-link-icon { 
      color: var(--swarna-gold); box-shadow: var(--diya-glow); transform: scale(1.15) rotate(-5deg); 
    }
  }

  /* Active State with Train Sheen */
  .yg-link.active {
    color: var(--stone-1); background: linear-gradient(135deg, var(--swarna-gold), var(--kansa-bronze));
    box-shadow: var(--diya-glow); border: none; transform: scale(1.02);
  }
  .yg-link.active .yg-link-icon { background: var(--stone-1); color: var(--swarna-gold); box-shadow: var(--shadow-inset); }
  .yg-link.active::after {
    content: ''; position: absolute; top: 0; left: 0; width: 50px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: train-sheen 2.5s infinite; z-index: 1; pointer-events: none;
  }

  /* ────────────────────────────────
     THEME TOGGLE (Inside Sidebar)
  ──────────────────────────────── */
  .yg-theme-btn {
    display: flex; align-items: center; gap: 1rem;
    margin: 1rem; padding: 0.8rem 1rem; border-radius: 8px; flex-shrink: 0;
    color: var(--kansa-light); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem;
    background: var(--stone-3); border: 1px solid var(--kansa-bronze);
    cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: var(--shadow-outset); white-space: nowrap;
  }
  .yg-theme-btn:hover { background: var(--stone-1); color: var(--swarna-gold); transform: translateY(-2px); box-shadow: var(--diya-glow); }
  .yg-theme-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }

  /* ────────────────────────────────
     PROFILE CARD
  ──────────────────────────────── */
  .yg-profile-card {
    margin: 1rem; padding: 1rem; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(145deg, var(--kansa-glow), transparent);
    border: 1px solid var(--kansa-bronze); display: flex; align-items: center; gap: 1rem;
    box-shadow: var(--shadow-outset); transition: all 0.3s ease; white-space: nowrap;
  }
  .yg-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--swarna-gold), var(--kansa-bronze));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mythic); font-size: 1.2rem; color: var(--stone-1);
    box-shadow: var(--shadow-outset); flex-shrink: 0; border: 2px solid var(--stone-1);
  }
  .yg-profile-info { flex: 1; overflow: hidden; }
  .yg-profile-name { font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
  .yg-profile-role { font-family: var(--font-historic); font-size: 0.65rem; color: var(--kansa-light); text-transform: uppercase; letter-spacing: 0.1em; }

  /* Logout Button */
  .yg-logout-btn {
    display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
    margin: 0 1rem; padding: 0.8rem 1rem; border-radius: 8px;
    color: var(--sindoor-red); font-family: var(--font-body); font-weight: 700; font-size: 0.95rem;
    background: transparent; border: none; cursor: pointer; transition: all 0.3s ease;
    text-align: left; white-space: nowrap;
  }
  @media (hover: hover) {
    .yg-logout-btn:hover { background: var(--stone-1); box-shadow: var(--shadow-inset); transform: translateX(8px); }
    .yg-logout-btn:hover .yg-link-icon { color: var(--stone-1); background: var(--sindoor-red); }
  }

  /* ────────────────────────────────
     FOOTER
  ──────────────────────────────── */
  .yg-sidebar-footer {
    padding: 1.5rem; border-top: 2px solid var(--stone-3); flex-shrink: 0;
    min-width: var(--sidebar-w); white-space: nowrap;
  }
  .yg-status { display: flex; align-items: center; gap: 0.8rem; }
  .yg-led {
    width: 10px; height: 10px; border-radius: 50%; background: var(--swarna-gold);
    animation: diya-flicker 3s infinite alternate; flex-shrink: 0;
  }
  .yg-status-text { font-family: var(--font-historic); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em; color: var(--text-muted); text-transform: uppercase; }

  /* ────────────────────────────────
     LAYOUT & MOBILE ADAPTATION
  ──────────────────────────────── */
  .yg-layout { display: flex; min-height: 100vh; min-height: 100dvh; }
  .yg-main {
    flex: 1; padding: 2rem;
    margin-left: var(--sidebar-w); min-height: 100vh;
    transition: margin-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .yg-sidebar.collapsed ~ .yg-main { margin-left: var(--sidebar-collapsed); }

  .yg-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    z-index: 400; opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
  }
  .yg-overlay.open { opacity: 1; pointer-events: auto; }

  @media (max-width: 900px) {
    .yg-hamburger { display: flex; }
    .yg-sidebar {
      transform: translateX(-100%); width: 280px; max-width: 85vw;
      box-shadow: none; border-right: none;
    }
    .yg-sidebar.open { transform: translateX(0); box-shadow: 20px 0 50px rgba(0,0,0,0.8); }
    .yg-main { margin-left: 0 !important; padding: 5rem 1rem 2rem 1rem; }
    .yg-logo, .yg-nav, .yg-sidebar-footer { min-width: 100%; }
    .yg-nav { padding-bottom: 2rem; }
  }

  .yg-auth-loading { margin: 1rem; height: 50px; background: var(--stone-3); border-radius: 8px; animation: diya-flicker 2s infinite; flex-shrink: 0; }
`

const EXPLORE_ITEMS = [
  { label: "Dashboard",       to: "/",                 icon:"🏛️" },
  { label: "Trains",          to: "/train",            icon:"🚂" },
  { label: "Revenue",         to: "/Revenue",          icon:"🪙" },
  { label: "Demand & Infra",  to: "/DemandAndInfra",   icon:"📜" },
  { label: "Live Train",      to: "/LiveTrain",        icon:"🛤️" },
]
const MORE_ITEMS = [
  { label: "About Us",   to: "/About",   icon:"🪔"},
  { label: "Contact Us", to: "/Contact", icon:"📿"}
]

const Navbar = ({ children }) => {
  const [open, setOpen]                   = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [user, setUser]                   = useState(null)
  const [authReady, setAuthReady]         = useState(false)
  const [theme, setTheme]                 = useState("dark")
  
  const { pathname }  = useLocation()
  const navigate      = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem("railway-theme") || "dark"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res  = await fetch(`${API_URI}/api/auth/me`, { credentials: "include" })
        const data = await res.json()
        if (res.ok) { setUser(data) } else { setUser(false) }
      } catch { setUser(false) }
      finally { setAuthReady(true) }
    }
    checkAuth()
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => { document.body.style.overflow = ""; document.body.style.touchAction = "" }
  }, [open])

  const handleLogout = useCallback(async () => {
    try { await fetch(`${API_URI}/api/auth/logout`, { method: "POST", credentials: "include" }) } 
    catch { /* ignore */ }
    setUser(false)
    navigate("/login")
  }, [navigate])

  const toggleMobileSidebar = useCallback(() => setOpen(o => !o), [])
  const toggleDesktopSidebar = useCallback(() => setDesktopCollapsed(prev => !prev), [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("railway-theme", newTheme)
  }, [theme])

  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "ॐ"

  return (
    <>
      <style>{GLOBAL_CSS + NAV_CSS}</style>

      {/* Desktop Toggle Latch (Exists outside sidebar so it isn't hidden when width is 0) */}
      <button 
        className={`yg-desktop-toggle ${desktopCollapsed ? "collapsed" : ""}`} 
        onClick={toggleDesktopSidebar} 
        aria-label="Toggle Sidebar"
      >
        {desktopCollapsed ? "❯" : "❮"}
      </button>

      {/* Mobile Hamburger */}
      <button
        className={`yg-hamburger${open ? " open" : ""}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle Menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile Overlay */}
      <div className={`yg-overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      <div className="yg-layout">
        
        {/* SIDEBAR */}
        <aside className={`yg-sidebar ${open ? "open" : ""} ${desktopCollapsed ? "collapsed" : ""}`}>
          
          {/* Logo */}
          <div className="yg-logo">
            <div className="yg-logo-name">Rail<em>Pulse</em></div>
            <div className="yg-logo-tag">Royal Rail Network</div>
          </div>

          {/* Navigation Links */}
          <nav className="yg-nav">
            <div className="yg-nav-section">Journey</div>
            {EXPLORE_ITEMS.map((item, index) => (
              <Link key={item.to} to={item.to} className={`yg-link${pathname === item.to ? " active" : ""}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <span className="yg-link-icon">{item.icon}</span>
                <span className="yg-link-label">{item.label}</span>
              </Link>
            ))}

            <div className="yg-nav-section">Traveler</div>
            {authReady && user ? (
              <>
                <div className="yg-profile-card">
                  <div className="yg-avatar">{avatar}</div>
                  <div className="yg-profile-info">
                    <div className="yg-profile-name">{user.name}</div>
                    <div className="yg-profile-role">Royal Passenger</div>
                  </div>
                </div>
                <button className="yg-logout-btn" onClick={handleLogout}>
                  <span className="yg-link-icon" style={{color: 'inherit'}}>✕</span>
                  <span className="yg-link-label">Depart (Logout)</span>
                </button>
              </>
            ) : authReady && !user ? (
              <>
                <Link to="/login" className={`yg-link${pathname === "/login" ? " active" : ""}`}>
                  <span className="yg-link-icon">⛩️</span>
                  <span className="yg-link-label">Enter (Login)</span>
                </Link>
                <Link to="/signup" className={`yg-link${pathname === "/signup" ? " active" : ""}`}>
                  <span className="yg-link-icon">📜</span>
                  <span className="yg-link-label">Register</span>
                </Link>
              </>
            ) : (
              <div className="yg-auth-loading" />
            )}

            <div className="yg-nav-section">Wisdom</div>
            {MORE_ITEMS.map(item => (
              <Link key={item.to} to={item.to} className={`yg-link${pathname === item.to ? " active" : ""}`}>
                <span className="yg-link-icon">{item.icon}</span>
                <span className="yg-link-label">{item.label}</span>
              </Link>
            ))}

            {/* Standardized Theme Toggle Button */}
            <button className="yg-theme-btn" onClick={toggleTheme}>
              <span className="yg-link-icon" style={{ fontSize: '1.2rem' }}>
                {theme === "dark" ? "🔆" : "🌙"}
              </span>
              <span className="yg-theme-label">
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
            </button>
          </nav>

          {/* Footer */}
          <div className="yg-sidebar-footer">
            <div className="yg-status">
              <div className="yg-led" />
              <span className="yg-status-text">Network Blessed</span>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="yg-main">
          {children}
        </main>

      </div>
    </>
  )
}

export default Navbar