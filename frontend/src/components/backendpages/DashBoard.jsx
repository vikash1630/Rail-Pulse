import React, { useEffect, useState } from "react"
import Navbar from "../../pages/Navbar"

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")

/* ─────────────────────────────────────────────
   YUGA DASHBOARD CSS (Architecture & Mythology)
   * Theme variables now strictly inherit from Global.css
───────────────────────────────────────────── */
const DASHBOARD_CSS = `
  /* ── Structural Classes ── */
  .yg-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
  }

  /* ── Typography Utilities ── */
  .yg-font-mythic { font-family: var(--font-mythic); font-weight: 400; }
  .yg-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .yg-font-body { font-family: var(--font-body); }
  
  .yg-text-primary { color: var(--text-primary); transition: color 0.4s ease; }
  .yg-text-muted { color: var(--text-muted); transition: color 0.4s ease; }
  .yg-text-gold { color: var(--swarna-gold); }
  .yg-text-bronze { color: var(--kansa-bronze); }
  .yg-text-red { color: var(--sindoor-red); }

  /* ── Neumorphic Stone Cards ── */
  .yg-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .yg-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }

  .yg-card-inset {
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.4s ease;
  }
  
  .yg-card-danger {
    background: linear-gradient(145deg, var(--stone-2), rgba(227,66,52,0.05));
    border: 1px solid rgba(227,66,52,0.3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .yg-card-danger:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: var(--shadow-outset), 0 0 25px rgba(227,66,52,0.25);
    border-color: var(--sindoor-red);
  }

  /* ── Badges & Progress Tracks ── */
  .yg-badge-gold { background: rgba(212,175,55,0.1); color: var(--swarna-gold); border: 1px solid var(--swarna-gold); }
  .yg-badge-bronze { background: rgba(205,127,50,0.1); color: var(--kansa-bronze); border: 1px solid var(--kansa-bronze); }
  .yg-badge-red { background: rgba(227,66,52,0.1); color: var(--sindoor-red); border: 1px solid var(--sindoor-red); }
  .yg-badge-neutral { background: var(--stone-3); color: var(--text-muted); border: 1px solid var(--text-muted); }

  .yg-track { background: var(--stone-3); box-shadow: var(--shadow-inset); border-radius: 999px; overflow: hidden; }
  .yg-bar-gold { background: linear-gradient(90deg, var(--kansa-light), var(--swarna-gold)); }
  .yg-bar-bronze { background: linear-gradient(90deg, var(--kansa-bronze), var(--kansa-light)); }
  .yg-bar-red { background: linear-gradient(90deg, var(--sindoor-red), #ff6b6b); }
  .yg-bar-green { background: linear-gradient(90deg, #2E8B57, #3CB371); }
  .yg-text-green { color: #3CB371; }

  /* ── Modal & Overlays ── */
  .yg-modal-backdrop {
    background: rgba(0,0,0,0.75); backdrop-filter: blur(10px);
    transition: background 0.5s ease;
  }
  [data-theme="light"] .yg-modal-backdrop { background: rgba(255,255,255,0.4); }



  .yg-modal-surface {
    background: var(--stone-2);
    border: 2px solid var(--kansa-bronze);
    box-shadow: var(--shadow-outset), 0 20px 60px rgba(0,0,0,0.5);
    border-radius: 24px;
    animation: modal-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .yg-btn-close {
    background: var(--stone-3); color: var(--sindoor-red);
    border: 1px solid rgba(227,66,52,0.4); box-shadow: var(--shadow-outset);
    transition: all 0.3s ease;
  }
  .yg-btn-close:hover { background: var(--sindoor-red); color: var(--stone-1); transform: scale(1.1); }
  .yg-btn-close:active { transform: scale(0.95); box-shadow: var(--shadow-inset); }

  /* ── Animations ── */
  @keyframes modal-pop { 0% { opacity: 0; transform: scale(0.9) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes chakra-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fade-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  .animate-stagger { animation: fade-slide-up 0.6s cubic-bezier(0.25, 1, 0.5, 1) both; }
  
  
/* ── Infinite RTL Train ── */
  .train-track {
    position: relative;
    width: 100%;
    height: 48px; 
    /* Trees and Rail background */
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden;
    z-index: 50;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .train-loop-container {
    display: flex;
    position: absolute;
    /* This width ensures two full train sets can follow each other */
    width: 200vw; 
    left: 0;
    animation: train-rtl-loop 15s linear infinite;
  }

  .train-set {
    display: flex;
    width: 100vw;
    justify-content: flex-end; /* Align train to the right side of its 100vw block */
    align-items: center;
    padding-right: 50px;
  }

  .bogie {
    font-size: 26px;
    width: 30px;
    display: flex;
    justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }

  /* Right-to-Left loop animation */
  @keyframes train-rtl-loop {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100vw); }
  }

  /* Media Banner Utility */
  .yg-hero-banner {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow-outset);
    border: 1px solid var(--kansa-bronze);
  }
  .yg-hero-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    mix-blend-mode: overlay;
    transition: opacity 0.5s ease;
  }
  [data-theme="light"] .yg-hero-banner img { opacity: 0.3; mix-blend-mode: multiply; }
`

/* ── Helpers ── */
const fmt = (n, d = 0) => (n != null ? Number(n).toLocaleString("en-IN", { maximumFractionDigits: d }) : "—")

function catBadgeClass(cat = "") {
  const c = cat.toLowerCase()
  if (c.includes("rajdhani") || c.includes("shatabdi") || c.includes("vande") || c.includes("duronto")) return "yg-badge-gold"
  if (c.includes("express") || c.includes("superfast")) return "yg-badge-bronze"
  if (c.includes("mail")) return "yg-badge-red"
  return "yg-badge-neutral"
}

function catBarColor(cat = "") {
  const c = cat.toLowerCase()
  if (c.includes("rajdhani") || c.includes("shatabdi") || c.includes("vande")) return "yg-bar-gold"
  if (c.includes("express") || c.includes("superfast")) return "yg-bar-bronze"
  if (c.includes("mail")) return "yg-bar-red"
  return "yg-bar-bronze"
}

function scoreColor(v, max = 100) {
  const p = v / max
  if (p > 0.75) return "yg-text-green"
  if (p > 0.5) return "yg-text-gold"
  if (p > 0.3) return "yg-text-bronze"
  return "yg-text-red"
}

function scoreBarColor(v, max = 100) {
  const p = v / max
  if (p > 0.75) return "yg-bar-green"
  if (p > 0.5) return "yg-bar-gold"
  if (p > 0.3) return "yg-bar-bronze"
  return "yg-bar-red"
}

/* ── Train Detail Modal ── */
const TrainModal = ({ trainNo, onClose }) => {
  const [train, setTrain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!trainNo) return
    setLoading(true)
    setError(null)
    setTrain(null)
    fetch(`${API_URI}/api/train/number?number=${trainNo}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setTrain(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [trainNo])

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose() }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const stats = train ? [
    { icon: "🚂", label: "Train No", val: train.TrainNo, cls: "yg-text-gold" },
    { icon: "🎫", label: "Category", val: train.TrainCategory, cls: "" },
    { icon: "🗺️", label: "Zone", val: train.RailwayZone, cls: "" },
    { icon: "⚡", label: "Speed", val: train.AverageSpeed_kmph != null ? `${fmt(train.AverageSpeed_kmph, 1)} km/h` : "—", cls: "yg-text-bronze" },
    { icon: "📏", label: "Distance", val: train.Distance_km != null ? `${fmt(train.Distance_km)} km` : "—", cls: "" },
    { icon: "⏱️", label: "Punctuality", val: train.PunctualityScore != null ? `${fmt(train.PunctualityScore, 1)} / 100` : "—", cls: scoreColor(train?.PunctualityScore, 100) },
    { icon: "👥", label: "Occupancy", val: train.OccupancyRate != null ? `${fmt(train.OccupancyRate, 1)}%` : "—", cls: train?.OccupancyRate > 85 ? "yg-text-red" : "yg-text-green" },
    { icon: "⚠️", label: "Delay Risk", val: train.DelayProbability != null ? `${fmt(train.DelayProbability, 1)}%` : "—", cls: train?.DelayProbability > 50 ? "yg-text-red" : "yg-text-bronze" },
    { icon: "🛤️", label: "Route Type", val: train.RouteType, cls: "" },
    { icon: "🚉", label: "Stops", val: train.NumberOfStops != null ? fmt(train.NumberOfStops) : "—", cls: "" },
    { icon: "🪙", label: "Fare (₹)", val: train.BaseFare != null ? `₹${fmt(train.BaseFare, 0)}` : "—", cls: "yg-text-gold" },
    { icon: "🔌", label: "Electrified", val: train.Electrified != null ? (train.Electrified ? "Yes" : "No") : "—", cls: train?.Electrified ? "yg-text-green" : "" },
  ].filter(s => s.val && s.val !== "—" && s.val !== "undefined" && s.val !== "null") : []

  const pct = train?.PunctualityScore ?? 0
  const delayPct = train?.DelayProbability ?? 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 yg-modal-backdrop" onClick={handleOverlay}>
      <div className="yg-modal-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto transform-gpu relative">

        {/* Modal Header w/ Image Banner */}
        <div className="sticky top-0 z-10 p-0 border-b border-[var(--stone-3)] bg-[var(--stone-2)]/90 backdrop-blur-xl flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1532015886617-1f19f20e98af?auto=format&fit=crop&q=80" alt="Train Texture" className="w-full h-full object-cover mix-blend-luminosity" />
          </div>

          <div className="p-6 flex items-start justify-between gap-4 relative z-10">
            <div className="min-w-0">
              {train && (
                <div className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold mb-2 ${catBadgeClass(train.TrainCategory)}`}>
                  🚂 {train.TrainNo}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl yg-font-mythic yg-text-gold leading-tight">
                {loading ? "Decrypting Scrolls…" : error ? "Network Disturbance" : train?.TrainName || "Train Details"}
              </h2>
              {train && (
                <span className={`inline-block mt-3 px-3 py-1 rounded-lg text-xs font-mono font-bold ${catBadgeClass(train.TrainCategory)}`}>
                  {train.TrainCategory}
                </span>
              )}
            </div>
            <button className="flex-shrink-0 w-10 h-10 rounded-lg yg-btn-close flex items-center justify-center cursor-pointer" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--swarna-gold)] border-b-[var(--sindoor-red)]" style={{ animation: "chakra-spin 1.5s linear infinite" }} />
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-l-[var(--kansa-light)] border-r-[var(--kansa-bronze)]" style={{ animation: "chakra-spin 2s linear infinite reverse" }} />
              </div>
              <p className="text-sm yg-font-historic yg-text-muted">Fetching Records…</p>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 border border-[var(--sindoor-red)] rounded-lg yg-text-red bg-[var(--stone-1)] text-sm font-mono shadow-[var(--shadow-inset)]">
              ⚠ {error}
            </div>
          )}

          {train && !loading && (
            <>
              {/* Route Banner */}
              {train.StartingPoint && train.FinalDestination && (
                <div className="px-4 py-6 yg-card-inset flex items-center justify-center gap-4 flex-wrap border border-[var(--kansa-bronze)] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                  <div className="text-lg yg-font-mythic yg-text-primary text-center">
                    <span className="block text-[10px] yg-font-historic yg-text-muted mb-1">Origin</span>
                    {train.StartingPoint}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="yg-text-gold text-2xl">⟶</span>
                    <span className="text-[10px] font-mono yg-text-muted">{fmt(train.Distance_km)} km</span>
                  </div>
                  <div className="text-lg yg-font-mythic yg-text-primary text-center">
                    <span className="block text-[10px] yg-font-historic yg-text-muted mb-1">Destination</span>
                    {train.FinalDestination}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div>
                <h3 className="text-xs yg-font-historic yg-text-muted mb-3 flex items-center gap-2"><span className="text-lg">📜</span> Carved Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {stats.map(s => (
                    <div key={s.label} className="px-3 py-3 yg-card-inset flex flex-col justify-center">
                      <div className="text-[10px] yg-font-historic yg-text-muted mb-1 flex items-center gap-1">
                        {s.icon} {s.label}
                      </div>
                      <div className={`text-sm font-bold font-serif ${s.cls || "yg-text-primary"}`}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Bars */}
              {pct > 0 && (
                <div>
                  <h3 className="text-xs yg-font-historic yg-text-muted mb-4 flex items-center gap-2"><span className="text-lg">⚙️</span> Live Performance</h3>
                  <div className="space-y-4 yg-card-inset p-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs yg-font-historic yg-text-muted">Punctuality</span>
                        <span className={`text-sm font-bold font-mono ${scoreColor(pct, 100)}`}>{fmt(pct, 1)}</span>
                      </div>
                      <div className="w-full h-3 yg-track">
                        <div className={`h-full ${scoreBarColor(pct, 100)} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    {delayPct > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs yg-font-historic yg-text-muted">Delay Risk</span>
                          <span className="text-sm font-bold font-mono yg-text-red">{fmt(delayPct, 1)}%</span>
                        </div>
                        <div className="w-full h-3 yg-track">
                          <div className="h-full yg-bar-red transition-all duration-1000 ease-out" style={{ width: `${delayPct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Dashboard Component ── */
const DashBoard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(new Date())
  const [selectedTrain, setSelectedTrain] = useState(null)

  useEffect(() => {
    fetch(`${API_URI}/api/dashBoard`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = tick.toLocaleTimeString("en-IN", { hour12: false })
  const dateStr = tick.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

  const catEntries = data ? Object.entries(data.Category_Breakdown || {}).sort((a, b) => b[1] - a[1]) : []
  const zoneEntries = data ? Object.entries(data.Zone_Breakdown || {}).sort((a, b) => b[1] - a[1]) : []
  const maxCat = catEntries[0]?.[1] ?? 1
  const maxZone = zoneEntries[0]?.[1] ?? 1

  const totalStations = data?.Total_Stations ?? data?.Stops_Count_Row1 ?? "—"
  const avgDelay = data?.Average_Delay_Prob ?? null
  const electPct = data?.Electrified_Pct ?? null

  return (
    <Navbar>
      <style>{DASHBOARD_CSS}</style>

      {selectedTrain && (
        <TrainModal trainNo={selectedTrain} onClose={() => setSelectedTrain(null)} />
      )}

      <div className="min-h-screen yg-page relative overflow-x-hidden pb-12">

        <div className="train-track">
          <div className="train-loop-container">

            {/* TRAIN SET 1 */}
            <div className="train-set">
              <div className="bogie">🚂</div> {/* Engine Leads */}
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
            </div>

            {/* TRAIN SET 2 (Identical copy for the loop) */}
            <div className="train-set">
              <div className="bogie">🚂</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
            </div>

          </div>
        </div>
        {/* Background Texture Accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--swarna-gold)] opacity-5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[var(--sindoor-red)] opacity-5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

          {/* ── HEADER & HERO ── */}
          {/* ── HEADER & HERO ── */}
          <div className="mb-8 animate-stagger yg-hero-banner p-8 sm:p-12 flex flex-col justify-end min-h-[220px] relative overflow-hidden"
            style={{ animationDelay: '0s', background: 'var(--stone-3)' }}> {/* Darker fallback background */}

            {/* Optimized Image: added w-full, h-full, and loading="lazy" for performance */}
            <img
              src="https://images.unsplash.com/photo-1572041341933-57caa3b8f6d5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
              alt="Train Infrastructure"
              loading="lazy"
              className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700"
              onLoad={e => { e.currentTarget.style.opacity = '0.5'; }}
              style={{ opacity: 0 }}
            />

            {/* Overlay Gradient to ensure text is readable even if image fails */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-2)] via-transparent to-transparent z-[1]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 mb-3 bg-[var(--stone-1)]/80 backdrop-blur px-3 py-1 rounded-full border border-[var(--kansa-bronze)]">
                <span className="text-xs yg-font-historic yg-text-bronze">🪔 Railway Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl yg-font-mythic yg-text-gold mb-2 drop-shadow-2xl text-shadow-lg">
                Network Overview
              </h1>
              <p className="text-sm sm:text-base font-mono yg-text-primary tracking-wide uppercase drop-shadow-md">
                Live Operations · Core Analytics
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mb-10 flex flex-wrap items-center gap-4 sm:gap-6 p-4 yg-card-inset border-l-4 border-l-[var(--swarna-gold)]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="w-2 h-2 rounded-full yg-bg-green" style={{ background: '#3CB371', boxShadow: '0 0 8px #3CB371' }} />
              <span className="yg-text-muted">Systems <span className="font-bold yg-text-primary">Nominal</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--swarna-gold)', animation: 'diya-flicker 2s infinite' }} />
              <span className="yg-text-muted">Feed <span className="font-bold yg-text-primary">Live</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono ml-auto">
              <span className="yg-text-muted">{timeStr}</span>
              <span className="yg-text-bronze">•</span>
              <span className="yg-text-muted">{dateStr}</span>
            </div>
          </div>

          {/* ── TICKER CARDS ── */}
          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-10">
              {[
                { val: fmt(data.Total_Trains), label: "Active Trains", icon: "🚂", delay: "0.1s" },
                { val: fmt(data.Unique_Railway_Zones), label: "Railway Zones", icon: "🗺️", delay: "0.2s" },
                { val: fmt(totalStations), label: "Total Stations", icon: "🚉", delay: "0.3s" },
                { val: fmt(data.Unique_Routes), label: "Unique Routes", icon: "🛤️", delay: "0.4s" },
              ].map((t) => (
                <div key={t.label} className="p-5 yg-card text-center animate-stagger flex flex-col items-center justify-center" style={{ animationDelay: t.delay }}>
                  <div className="text-2xl mb-2 opacity-80">{t.icon}</div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl yg-font-mythic yg-text-gold tabular-nums drop-shadow-md mb-2">
                    {t.val}
                  </div>
                  <div className="text-xs sm:text-sm yg-font-historic yg-text-muted">{t.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── LOADING / ERROR ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-6 animate-stagger">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--swarna-gold)] border-b-[var(--sindoor-red)]" style={{ animation: "chakra-spin 1.5s linear infinite" }} />
                <div className="absolute inset-3 rounded-full border-4 border-transparent border-l-[var(--kansa-light)] border-r-[var(--kansa-bronze)]" style={{ animation: "chakra-spin 2s linear infinite reverse" }} />
              </div>
              <p className="text-sm yg-font-historic yg-text-muted">Awakening Network Sensors…</p>
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-4 border border-[var(--sindoor-red)] rounded-2xl yg-text-red bg-[var(--stone-2)] text-center font-mono text-sm shadow-[var(--shadow-inset)] mb-8 flex items-center justify-center gap-3">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* ── KPI GRID ── */}
              <div className="flex items-center gap-3 mb-4 animate-stagger" style={{ animationDelay: "0.4s" }}>
                <div className="text-xl">📊</div>
                <h2 className="text-sm yg-font-historic yg-text-primary">Performance Averages</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 animate-stagger" style={{ animationDelay: "0.5s" }}>
                {[
                  { icon: "⚡", label: "Avg Speed", value: `${fmt(data.Average_Speed, 1)}`, unit: "km/h" },
                  { icon: "📏", label: "Avg Distance", value: `${fmt(data.Average_Distance, 0)}`, unit: "km" },
                  { icon: "👥", label: "Avg Occupancy", value: `${fmt(data.Average_Occupancy, 1)}`, unit: "%" },
                  { icon: "⏱️", label: "Punctuality", value: fmt(data.Average_Punctuality, 1), unit: "/ 100" },
                  ...(avgDelay != null ? [{ icon: "⚠️", label: "Delay Risk", value: `${fmt(avgDelay, 1)}`, unit: "%" }] : []),
                  ...(electPct != null ? [{ icon: "🔌", label: "Electrified", value: `${fmt(electPct, 1)}`, unit: "%" }] : []),
                ].map(k => (
                  <div key={k.label} className="p-4 yg-card-inset hover:-translate-y-1 transform-gpu">
                    <div className="text-[10px] yg-font-historic yg-text-muted mb-2 flex items-center gap-1">
                      {k.icon} {k.label}
                    </div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold yg-text-primary tabular-nums drop-shadow-sm">{k.value}</div>
                    <div className="text-xs yg-text-muted mt-1">{k.unit}</div>
                  </div>
                ))}
              </div>

              {/* ── FLEET COMPOSITION ── */}
              <div className="grid lg:grid-cols-2 gap-6 mb-10 animate-stagger" style={{ animationDelay: "0.6s" }}>
                {/* Categories */}
                <div className="p-6 yg-card">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--stone-3)]">
                    <div className="text-xl">🎫</div>
                    <h2 className="text-sm yg-font-historic yg-text-primary">Train Categories</h2>
                  </div>
                  <div className="space-y-4">
                    {catEntries.map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-4">
                        <div className="text-[10px] yg-font-historic yg-text-muted w-24 flex-shrink-0 truncate">{cat}</div>
                        <div className="flex-1 h-3 yg-track">
                          <div className={`h-full transition-all duration-1000 ${catBarColor(cat)}`} style={{ width: `${(count / maxCat) * 100}%` }} />
                        </div>
                        <div className="text-sm font-serif font-bold yg-text-gold w-12 text-right tabular-nums">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zones */}
                <div className="p-6 yg-card">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--stone-3)]">
                    <div className="text-xl">🗺️</div>
                    <h2 className="text-sm yg-font-historic yg-text-primary">Railway Zones</h2>
                  </div>
                  <div className="space-y-4 pr-2">
                    {zoneEntries.map(([zone, count]) => (
                      <div key={zone} className="flex items-center gap-4">
                        <div className="text-[10px] yg-font-historic yg-text-muted w-24 truncate">{zone}</div>
                        <div className="flex-1 h-3 yg-track">
                          <div className="h-full yg-bar-bronze transition-all duration-1000" style={{ width: `${(count / maxZone) * 100}%` }} />
                        </div>
                        <div className="text-sm font-serif font-bold yg-text-bronze w-12 text-right tabular-nums">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── TOP PUNCTUAL TRAINS ── */}
              {(data.Top_Punctual_Trains ?? []).length > 0 && (
                <div className="mb-10 animate-stagger" style={{ animationDelay: "0.7s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">✨</div>
                    <h2 className="text-sm yg-font-historic yg-text-primary">Top Punctual Trains</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.Top_Punctual_Trains.slice(0, 6).map((t) => (
                      <div
                        key={t.TrainNo}
                        onClick={() => setSelectedTrain(t.TrainNo)}
                        className="p-4 yg-card cursor-pointer flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4 gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-serif font-bold yg-text-primary truncate">{t.TrainName}</h3>
                            <p className="text-xs font-mono yg-text-muted truncate mt-1">{t.StartingPoint} ⟶ {t.FinalDestination}</p>
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-md text-[10px] font-mono font-bold flex-shrink-0 ${catBadgeClass(t.TrainCategory)}`}>
                            {t.TrainNo}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 yg-card-inset p-2 rounded-lg">
                          <div className="flex-1 h-1.5 yg-track">
                            <div className={`h-full ${scoreBarColor(t.PunctualityScore, 100)} transition-all duration-1000`} style={{ width: `${t.PunctualityScore ?? 0}%` }} />
                          </div>
                          <span className={`text-[10px] font-mono font-bold tabular-nums flex-shrink-0 ${scoreColor(t.PunctualityScore, 100)}`}>
                            {fmt(t.PunctualityScore, 1)} SCORE
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── HIGH DELAY RISK ── */}
              {(data.High_Delay_Risk_Trains ?? []).length > 0 && (
                <div className="mb-10 animate-stagger" style={{ animationDelay: "0.8s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">🚨</div>
                    <h2 className="text-sm yg-font-historic yg-text-red">High Delay Risk — Flagged</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.High_Delay_Risk_Trains.slice(0, 6).map((t) => (
                      <div
                        key={t.TrainNo}
                        onClick={() => setSelectedTrain(t.TrainNo)}
                        className="p-4 yg-card-danger cursor-pointer flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4 gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-serif font-bold yg-text-primary truncate">{t.TrainName}</h3>
                            <p className="text-xs font-mono yg-text-muted truncate mt-1">{t.StartingPoint} ⟶ {t.FinalDestination}</p>
                          </div>
                          <div className="inline-block px-2 py-1 rounded-md text-[10px] font-mono font-bold w-fit yg-badge-red border border-[var(--sindoor-red)]">
                            {t.TrainNo}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 yg-card-inset border border-[var(--sindoor-red)]/30 p-2 rounded-lg bg-[var(--stone-1)]">
                          <div className="flex-1 h-1.5 yg-track">
                            <div className="h-full yg-bar-red transition-all duration-1000" style={{ width: `${t.DelayProbability ?? 0}%` }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold yg-text-red tabular-nums flex-shrink-0">
                            {fmt(t.DelayProbability, 1)}% RISK
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FOOTER ── */}
              <div className="mt-16 pt-8 border-t border-[var(--stone-3)] text-center text-[10px] yg-font-historic yg-text-muted space-y-2">
                <p>Yatra Marga Intelligence System © 2026</p>
                <p className="yg-text-gold drop-shadow-md">▶ ALL SYSTEMS OPERATIONAL</p>
                <p>Dataset · {fmt(data.Total_Trains)} Trains · Powered by RI/Core</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Navbar>
  )
}

export default DashBoard