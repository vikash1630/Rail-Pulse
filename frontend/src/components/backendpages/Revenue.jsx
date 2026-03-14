import React, { useState, useEffect } from "react";
import Navbar from "../../pages/Navbar";

const CSS = `
  /* Revenue page — scoped styles only.
     :root vars, fonts, reset, and sidebar margin
     are all provided globally by Navbar.           */

  .rev-page {
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--text-1);
  }

  .rev-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem 5rem;
  }

  /* ── PAGE HEADER ── */
  .rev-header {
    position: relative;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--glass-border);
    overflow: hidden;
  }

  .rev-header::after {
    content: 'REVENUE';
    position: absolute;
    right: -1rem;
    top: -0.5rem;
    font-family: var(--font-display);
    font-size: clamp(4rem, 15vw, 8rem);
    color: rgba(201,151,58,0.04);
    pointer-events: none;
    line-height: 1;
    letter-spacing: 0.05em;
  }

  .rev-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--gold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rev-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    background: var(--gold);
  }

  .rev-title {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 8vw, 4rem);
    line-height: 1;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, var(--text-1) 0%, var(--gold-light) 60%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .rev-subtitle {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--text-3);
    margin-top: 0.5rem;
  }

  /* ── KPI TILES ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 700px) {
    .kpi-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .kpi-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem 1.2rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .kpi-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  @media (min-width: 900px) {
    .kpi-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 8px 32px var(--gold-glow);
    }
    .kpi-card:hover::before { opacity: 1; }
  }

  .kpi-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .kpi-value {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .kpi-value.gold   { color: var(--gold-light); }
  .kpi-value.green  { color: var(--sig-green); }
  .kpi-value.red    { color: var(--sig-red); }
  .kpi-value.amber  { color: var(--sig-amber); }
  .kpi-value.blue   { color: #60a5fa; }

  .kpi-sub {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-3);
    margin-top: 0.35rem;
  }

  .kpi-ghost {
    position: absolute;
    bottom: -0.4rem; right: 0.8rem;
    font-family: var(--font-display);
    font-size: 3.5rem;
    color: rgba(201,151,58,0.05);
    line-height: 1;
    pointer-events: none;
  }

  /* ── FILTER PANEL ── */
  .filter-panel {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-top: 2px solid var(--gold);
    border-radius: 18px;
    padding: 1.4rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

@media (min-width: 900px) {
    .filter-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient( ... );
      pointer-events: none;
      animation: scan 6s linear infinite;
    }
  }

  @keyframes scan {            /* ✅ moved outside media query */
    0% { background-position: 0 0; }
    100% { background-position: 0 100px; }
  }
  .filter-title {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--gold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .filter-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (min-width: 560px) {
    .filter-row { grid-template-columns: 1fr 1fr; }
  }

  @media (min-width: 700px) {
    .filter-row { grid-template-columns: 1fr 1fr 1fr; }
  }

  .filter-group { display: flex; flex-direction: column; gap: 0.35rem; }

  .filter-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .filter-select,
  .filter-input {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    color: var(--text-1);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    padding: 0.6rem 0.85rem;
    min-height: 40px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }

  .filter-select:focus,
  .filter-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
  }

  .filter-select option { background: var(--ink-3); color: var(--text-1); }

  .btn-primary {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    min-height: 42px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.4s;
  }

  .btn-primary:hover::after { left: 150%; }

  @media (min-width: 900px) {
    .btn-primary:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 24px var(--gold-glow);
    }
  }

  /* ── RESULT PANEL ── */
  .result-panel {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.6rem;
    position: relative;
    overflow: hidden;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-panel.has-data {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .result-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.4;
  }

  .empty-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .empty-text {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ── RESULT CONTENT ── */
  .result-inner { width: 100%; }

  .result-header-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
  }

  .result-badge {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    background: var(--gold-pale);
    border: 1px solid var(--gold-glow);
    color: var(--gold-light);
  }

  .result-meta {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-3);
  }

  .result-data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (min-width: 560px) {
    .result-data-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .result-stat {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    padding: 1rem;
  }

  .result-stat-label {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--text-3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .result-stat-value {
    font-family: var(--font-display);
    font-size: 1.6rem;
    line-height: 1.1;
    color: var(--gold-light);
  }

  .result-stat-sub {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--text-3);
    margin-top: 0.25rem;
  }

  /* ── TRAINS TABLE (for by-name multi-result) ── */
  .trains-table-wrap {
    overflow-x: auto;
    margin-top: 1.2rem;
  }

  .trains-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 0.72rem;
  }

  .trains-table thead tr {
    border-bottom: 1px solid var(--gold-glow);
  }

  .trains-table th {
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 600;
  }

  .trains-table td {
    color: var(--text-2);
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .trains-table tbody tr:hover td {
    background: rgba(201,151,58,0.04);
    color: var(--text-1);
  }

  .trains-table .td-num {
    color: var(--gold-light);
    font-weight: 600;
  }

  /* ── ERROR / LOADING ── */
  .status-text {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
  }

  .status-text.loading { color: var(--gold); }
  .status-text.error   { color: var(--sig-red); }

  .pulse-dot {
    display: inline-block;
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    margin-right: 8px;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.6); }
  }

  /* ── BOTTOM RAIL DECORATION ── */
  .rail-deco {
    display: none;
  }

  @media (min-width: 900px) {
    .rail-deco {
      display: block;
      margin-top: 3rem;
      height: 24px;
      position: relative;
    }

    .rail-deco::before,
    .rail-deco::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--glass-border), var(--gold-glow), var(--glass-border), transparent);
    }

    .rail-deco::before { top: 6px; }
    .rail-deco::after  { bottom: 6px; }

    .rail-ties {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 18px,
        var(--glass-border) 18px,
        var(--glass-border) 20px
      );
    }
  }

  /* ── GRID BG ── */
  @media (min-width: 900px) {
    .rev-page::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(var(--glass-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--glass-border) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.5;
    }
  }

  .rev-shell { position: relative; z-index: 1; }

  /* ── SECTION DIVIDER ── */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 2rem 0 1.2rem;
  }

  .section-divider-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--gold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .section-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--gold-glow), transparent);
  }

  /* ── COUNTER ANIMATION ── */
  .count-up {
    display: inline-block;
  }
`;


const BASE = `${import.meta.env.VITE_API_URL}/api/train`;

const CATEGORIES = ['Sampark Kranti Express (SK)', 'Superfast Express (SF)',
  'Rajdhani Express (RJDH)', 'Special Train (SPL)',
  'Tejas Express (TEJ)', 'Suburban Local (EMU)', 'DEMU (DEMU)',
  'Humsafar Express (HMSFR)', 'Double Decker Express (DD)',
  'Duronto Express (DRNT)', 'Vande Bharat Express (VB)',
  'Jan Shatabdi Express (JSTBD)', 'Shatabdi Express (SHTBD)',
  'Mail Express (ME)', 'MEMU (MEMU)', 'Passenger (PASS)',
  'Garib Rath Express (GR)', 'Intercity Express (IC)',
  'Antyodaya Express (ANTY)']
const ZONES = ['Northeast Frontier Railway (NFR)', 'North Central Railway (NCR)',
  'Metro Railway Kolkata (MTPR)', 'East Coast Railway (ECoR)',
  'South Central Railway (SCR)', 'Konkan Railway (KR)',
  'South Eastern Railway (SER)', 'West Central Railway (WCR)',
  'Southern Railway (SR)', 'Central Railway (CR)',
  'Western Railway (WR)', 'Northern Railway (NR)',
  'Eastern Railway (ER)', 'North Eastern Railway (NER)',
  'South Coast Railway (SCoR)', 'North Western Railway (NWR)',
  'East Central Railway (ECR)', 'South East Central Railway (SECR)',
  'South Western Railway (SWR)'];

function formatINR(val) {
  if (val === null || val === undefined) return "—";
  if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`;
  if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)} L`;
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function KPICard({ label, value, colorClass, ghost, sub }) {
  const anim = useCountUp(typeof value === "number" ? value : 0);
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${colorClass}`}>
        {typeof value === "number" ? formatINR(anim) : (value ?? "—")}
      </div>
      {sub && <div className="kpi-sub">{sub}</div>}
      <div className="kpi-ghost">{ghost}</div>
    </div>
  );
}

function ResultPanel({ state }) {
  const { status, data, mode } = state;

  if (status === "idle") {
    return (
      <div className="result-panel">
        <div className="empty-state">
          <div className="empty-icon">📡</div>
          <div className="empty-text">Awaiting query — select filter and fetch</div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="result-panel">
        <span className="status-text loading">
          <span className="pulse-dot" />
          Fetching revenue data...
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="result-panel">
        <span className="status-text error">⚠ {data?.error || "Request failed"}</span>
      </div>
    );
  }

  // ── Build items based on mode ──
  let items = [];
  let tableRows = null;

  if (mode === "zone") {
    items = [
      { label: "Zone", value: data.zone, isText: true },
      { label: "Train Count", value: String(data.count), isText: true },
      { label: "Avg Revenue", value: formatINR(data.average_revenue) },
    ];
  } else if (mode === "category") {
    items = [
      { label: "Category", value: data.category, isText: true },
      { label: "Train Count", value: String(data.count), isText: true },
      { label: "Avg Revenue", value: formatINR(data.average_revenue) },
    ];
  } else if (mode === "number") {
    items = [
      { label: "Train No", value: String(data.TrainNo), isText: true },
      { label: "Train Name", value: data.TrainName, isText: true },
      { label: "Revenue", value: formatINR(data.Revenue) },
      { label: "Stops", value: String(data.stops), isText: true },
      { label: "Distance", value: `${data.distance?.toFixed(1)} km`, isText: true },
    ];
  } else if (mode === "name") {
    items = [
      { label: "Train Name", value: data.train_name, isText: true },
      { label: "Matches", value: String(data.count), isText: true },
      { label: "Net Revenue", value: formatINR(data.net_revenue) },
    ];
    if (data.trains && data.trains.length > 0) {
      tableRows = data.trains;
    }
  }

  const BADGE_MAP = {
    zone: "BY ZONE",
    category: "BY CATEGORY",
    number: "BY TRAIN NO",
    name: "BY TRAIN NAME",
  };

  return (
    <div className="result-panel has-data">
      <div className="result-inner">
        <div className="result-header-row">
          <div className="result-badge">{BADGE_MAP[mode] ?? mode.toUpperCase()}</div>
          <div className="result-meta">QUERY RESULT · {new Date().toLocaleTimeString()}</div>
        </div>
        <div className="result-data-grid">
          {items.map((it) => (
            <div className="result-stat" key={it.label}>
              <div className="result-stat-label">{it.label}</div>
              <div
                className="result-stat-value"
                style={it.isText ? { fontSize: "1rem", color: "var(--text-1)" } : {}}
              >
                {it.value ?? "—"}
              </div>
            </div>
          ))}
        </div>

        {/* Multi-train table rendered only for by-name results */}
        {tableRows && (
          <div className="trains-table-wrap">
            <table className="trains-table">
              <thead>
                <tr>
                  <th>Train No</th>
                  <th>Train Name</th>
                  <th>Revenue</th>
                  <th>Stops</th>
                  <th>Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((t) => (
                  <tr key={t.TrainNo}>
                    <td className="td-num">{t.TrainNo}</td>
                    <td>{t.TrainName}</td>
                    <td className="td-num">{formatINR(t.Revenue)}</td>
                    <td>{t.stops}</td>
                    <td>{t.distance?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Revenue() {
  const [kpi, setKpi] = useState({ highest: null, lowest: null, average: null, total: null, totalTrains: null });
  const [kpiLoading, setKpiLoading] = useState(true);

  const [zone, setZone] = useState("");
  const [cat, setCat] = useState("");
  const [trainNum, setTrainNum] = useState("");
  const [trainName, setTrainName] = useState("");

  const [zoneResult, setZoneResult] = useState({ status: "idle", data: null, mode: "zone" });
  const [catResult, setCatResult] = useState({ status: "idle", data: null, mode: "category" });
  const [numResult, setNumResult] = useState({ status: "idle", data: null, mode: "number" });
  const [nameResult, setNameResult] = useState({ status: "idle", data: null, mode: "name" });

  // ── Load all four KPI tiles on mount ──
  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/HighestRevenue`).then(r => r.json()),
      fetch(`${BASE}/LowestRevenue`).then(r => r.json()),
      fetch(`${BASE}/AverageRevenue`).then(r => r.json()),
      fetch(`${BASE}/TotalRevenue`).then(r => r.json()),
    ])
      .then(([h, l, a, t]) => {
        setKpi({
          highest: h.highest_revenue,
          lowest: l.lowest_revenue,
          average: a.average_revenue,
          total: t.total_revenue,
          totalTrains: t.total_trains,
        });
      })
      .catch(() => { })
      .finally(() => setKpiLoading(false));
  }, []);

  const fetchByZone = async () => {
    if (!zone) return;
    setZoneResult({ status: "loading", data: null, mode: "zone" });
    try {
      const r = await fetch(`${BASE}/RevenueByZone?zone=${encodeURIComponent(zone)}`);
      const d = await r.json();
      setZoneResult({ status: r.ok ? "success" : "error", data: d, mode: "zone" });
    } catch {
      setZoneResult({ status: "error", data: { error: "Network error" }, mode: "zone" });
    }
  };

  const fetchByCat = async () => {
    if (!cat) return;
    setCatResult({ status: "loading", data: null, mode: "category" });
    try {
      const r = await fetch(`${BASE}/RevenueByCategory?cat=${encodeURIComponent(cat)}`);
      const d = await r.json();
      setCatResult({ status: r.ok ? "success" : "error", data: d, mode: "category" });
    } catch {
      setCatResult({ status: "error", data: { error: "Network error" }, mode: "category" });
    }
  };

  const fetchByNum = async () => {
    if (!trainNum.trim()) return;
    setNumResult({ status: "loading", data: null, mode: "number" });
    try {
      const r = await fetch(`${BASE}/RevenueByNum?num=${encodeURIComponent(trainNum.trim())}`);
      const d = await r.json();
      setNumResult({ status: r.ok ? "success" : "error", data: d, mode: "number" });
    } catch {
      setNumResult({ status: "error", data: { error: "Network error" }, mode: "number" });
    }
  };

  const fetchByName = async () => {
    if (!trainName.trim()) return;
    setNameResult({ status: "loading", data: null, mode: "name" });
    try {
      const r = await fetch(`${BASE}/RevenueByName?name=${encodeURIComponent(trainName.trim())}`);
      const d = await r.json();
      setNameResult({ status: r.ok ? "success" : "error", data: d, mode: "name" });
    } catch {
      setNameResult({ status: "error", data: { error: "Network error" }, mode: "name" });
    }
  };

  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="rev-page">
        <div className="rev-shell">

          {/* ── HEADER ── */}
          <div className="rev-header">
            <div className="rev-eyebrow">Railway Intelligence System · Revenue Module</div>
            <h1 className="rev-title">Revenue Analytics</h1>
            <p className="rev-subtitle">Aggregate and segmented financial intelligence across 1005 trains</p>
          </div>

          {/* ── KPI TILES ── */}
          <div className="kpi-grid">
            <KPICard
              label="Highest Revenue"
              value={kpiLoading ? null : kpi.highest}
              colorClass="gold"
              ghost="H"
              sub="PEAK EARNER"
            />
            <KPICard
              label="Lowest Revenue"
              value={kpiLoading ? null : kpi.lowest}
              colorClass="red"
              ghost="L"
              sub="BOTTOM RANGE"
            />
            <KPICard
              label="Average Revenue"
              value={kpiLoading ? null : kpi.average}
              colorClass="green"
              ghost="Ø"
              sub="FLEET MEAN"
            />
            <KPICard
              label="Total Revenue"
              value={kpiLoading ? null : kpi.total}
              colorClass="blue"
              ghost="Σ"
              sub={kpi.totalTrains ? `ACROSS ${kpi.totalTrains} TRAINS` : "ALL TRAINS"}
            />
          </div>

          {/* ── BY ZONE ── */}
          <div className="section-divider">
            <div className="section-divider-label">Revenue by Zone</div>
            <div className="section-divider-line" />
          </div>

          <div className="filter-panel" style={{ marginBottom: "1rem" }}>
            <div className="filter-title">⬡ Zone Filter</div>
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Select Zone</label>
                <select
                  className="filter-select"
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                >
                  <option value="">— Choose Zone —</option>
                  {ZONES.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group" style={{ justifyContent: "flex-end" }}>
                <label className="filter-label">&nbsp;</label>
                <button
                  className="btn-primary"
                  onClick={fetchByZone}
                  disabled={!zone}
                  style={{ opacity: zone ? 1 : 0.5, cursor: zone ? "pointer" : "not-allowed" }}
                >
                  Fetch Revenue
                </button>
              </div>
            </div>
          </div>

          <ResultPanel state={zoneResult} />

          {/* ── BY CATEGORY ── */}
          <div className="section-divider">
            <div className="section-divider-label">Revenue by Category</div>
            <div className="section-divider-line" />
          </div>

          <div className="filter-panel" style={{ marginBottom: "1rem" }}>
            <div className="filter-title">⬡ Category Filter</div>
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Train Category</label>
                <select
                  className="filter-select"
                  value={cat}
                  onChange={e => setCat(e.target.value)}
                >
                  <option value="">— Choose Category —</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group" style={{ justifyContent: "flex-end" }}>
                <label className="filter-label">&nbsp;</label>
                <button
                  className="btn-primary"
                  onClick={fetchByCat}
                  disabled={!cat}
                  style={{ opacity: cat ? 1 : 0.5, cursor: cat ? "pointer" : "not-allowed" }}
                >
                  Fetch Revenue
                </button>
              </div>
            </div>
          </div>

          <ResultPanel state={catResult} />

          {/* ── BY TRAIN NUMBER ── */}
          <div className="section-divider">
            <div className="section-divider-label">Revenue by Train Number</div>
            <div className="section-divider-line" />
          </div>

          <div className="filter-panel" style={{ marginBottom: "1rem" }}>
            <div className="filter-title">⬡ Train Number Filter</div>
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Train Number</label>
                <input
                  className="filter-input"
                  type="number"
                  placeholder="e.g. 77836"
                  value={trainNum}
                  onChange={e => setTrainNum(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchByNum()}
                />
              </div>
              <div className="filter-group" style={{ justifyContent: "flex-end" }}>
                <label className="filter-label">&nbsp;</label>
                <button
                  className="btn-primary"
                  onClick={fetchByNum}
                  disabled={!trainNum.trim()}
                  style={{ opacity: trainNum.trim() ? 1 : 0.5, cursor: trainNum.trim() ? "pointer" : "not-allowed" }}
                >
                  Fetch Revenue
                </button>
              </div>
            </div>
          </div>

          <ResultPanel state={numResult} />

          {/* ── BY TRAIN NAME ── */}
          <div className="section-divider">
            <div className="section-divider-label">Revenue by Train Name</div>
            <div className="section-divider-line" />
          </div>

          <div className="filter-panel" style={{ marginBottom: "1rem" }}>
            <div className="filter-title">⬡ Train Name Filter</div>
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Train Name</label>
                <input
                  className="filter-input"
                  type="text"
                  placeholder="e.g. Madurai Intercity"
                  value={trainName}
                  onChange={e => setTrainName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchByName()}
                />
              </div>
              <div className="filter-group" style={{ justifyContent: "flex-end" }}>
                <label className="filter-label">&nbsp;</label>
                <button
                  className="btn-primary"
                  onClick={fetchByName}
                  disabled={!trainName.trim()}
                  style={{ opacity: trainName.trim() ? 1 : 0.5, cursor: trainName.trim() ? "pointer" : "not-allowed" }}
                >
                  Fetch Revenue
                </button>
              </div>
            </div>
          </div>

          <ResultPanel state={nameResult} />

          {/* ── RAIL DECORATION ── */}
          <div className="rail-deco">
            <div className="rail-ties" />
          </div>

        </div>
      </div>
    </Navbar>
  );
}