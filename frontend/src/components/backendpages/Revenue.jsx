import React, { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../../pages/Navbar";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/* ─────────────────────────────────────────────
   REVENUE YUGA CSS (Mirrors Train.jsx Aesthetic exactly)
───────────────────────────────────────────── */
const REVENUE_CSS = `
  /* ── Structural ── */
  .rv-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
    min-height: 100vh;
    padding-bottom: 5rem;
  }

  /* ── Typography Utilities ── */
  .rv-font-mythic   { font-family: var(--font-mythic);   font-weight: 400; }
  .rv-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .rv-font-body     { font-family: var(--font-body); }

  .rv-text-primary { color: var(--text-primary); transition: color 0.4s ease; }
  .rv-text-muted   { color: var(--text-muted);   transition: color 0.4s ease; }
  .rv-text-gold    { color: var(--swarna-gold); }
  .rv-text-bronze  { color: var(--kansa-bronze); }
  .rv-text-red     { color: var(--sindoor-red); }
  .rv-text-green   { color: #3CB371; }
  .rv-text-blue    { color: #60a5fa; }
  .rv-text-purple  { color: #a78bfa; }

  /* ── Neumorphic Stone Cards ── */
  .rv-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .rv-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }
  .rv-card-inset {
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.4s ease;
  }

  /* ── Tabs ── */
  .rv-tabs-wrap {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .rv-tabs-wrap::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .rv-tabs-title {
    font-family: var(--font-historic);
    font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light); margin-bottom: 0.85rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .rv-tabs-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }
  .rv-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.45rem;
  }
  @media (min-width: 480px) { .rv-tabs { grid-template-columns: repeat(4, 1fr); } }

  .rv-tab {
    padding: 0.7rem 0.5rem;
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 10px;
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer; text-align: center;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rv-tab:hover { color: var(--kansa-light); border-color: var(--kansa-bronze); }
  .rv-tab.active {
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    color: var(--stone-1);
    border-color: var(--swarna-gold);
    box-shadow: var(--diya-glow);
    font-weight: 800;
  }

  /* ── Filter Panel ── */
  .rv-filter-panel {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .rv-filter-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .rv-filter-title {
    font-family: var(--font-historic);
    font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .rv-filter-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }
  .rv-filter-row { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
  @media (min-width: 600px) {
    .rv-filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; }
    .rv-filter-row .rv-field { flex: 1; min-width: 160px; }
    .rv-fetch-btn { width: auto; }
  }

  /* ── Input Fields ── */
  .rv-field { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
  .rv-field label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .rv-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%; background: var(--swarna-gold);
    box-shadow: 0 0 7px var(--swarna-gold); flex-shrink: 0;
  }
  .rv-field input, .rv-field select {
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 1.05rem; font-weight: 600;
    padding: 0.8rem 1rem;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    width: 100%; -webkit-appearance: none;
  }
  .rv-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23CD7F32'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center;
    padding-right: 2.5rem; cursor: pointer;
  }
  [data-theme="light"] .rv-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23A65D1A'/%3E%3C/svg%3E");
  }
  .rv-field input::placeholder { color: var(--text-muted); opacity: 0.5; }
  .rv-field input:focus, .rv-field select:focus {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow);
  }
  .rv-field select option { background: var(--stone-2); color: var(--text-primary); }

  /* ── Buttons ── */
  .rv-fetch-btn {
    padding: 0.9rem 1.8rem;
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    color: var(--stone-1);
    border: none; border-radius: 10px;
    font-family: var(--font-historic);
    font-size: 0.8rem; font-weight: 800;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), var(--shadow-outset);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
    -webkit-tap-highlight-color: transparent; width: 100%;
  }
  .rv-fetch-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .rv-fetch-btn:hover { background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light)); box-shadow: var(--diya-glow); transform: translateY(-2px); }
  .rv-fetch-btn:hover::after { left: 160%; }
  .rv-fetch-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }
  .rv-fetch-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  @media (min-width: 600px) { .rv-fetch-btn { width: auto; flex-shrink: 0; } }

  /* ── Error / State ── */
  .rv-error-msg {
    background: rgba(227,66,52,0.08);
    border: 1px solid rgba(227,66,52,0.35);
    border-radius: 12px; padding: 0.85rem 1.1rem;
    color: var(--sindoor-red);
    font-family: var(--font-historic);
    font-size: 0.75rem; letter-spacing: 0.07em;
    display: flex; align-items: center; gap: 0.6rem; margin-top: 0.75rem;
  }

  .rv-state {
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    opacity: 0.5; padding: 3rem 0;
  }
  .rv-state-icon { font-size: 2.5rem; animation: rv-float 3s ease-in-out infinite; }
  .rv-state-msg {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase; text-align: center;
  }

  .rv-loader { display: flex; align-items: center; gap: 0.75rem; padding: 2rem 0; justify-content: center; }
  .rv-spinner {
    width: 32px; height: 32px; flex-shrink: 0;
    border: 3px solid var(--stone-3);
    border-top-color: var(--swarna-gold);
    border-right-color: var(--kansa-bronze);
    border-radius: 50%;
    animation: rv-chakra-spin 1.2s linear infinite;
  }
  .rv-loader-text {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase;
    animation: rv-float 1.5s ease-in-out infinite;
  }

  /* ── Section Divider ── */
  .rv-section-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.5rem 0 1rem;
  }
  .rv-section-label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--kansa-light); white-space: nowrap;
  }
  .rv-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }

  /* ── Result Stats ── */
  .rv-info-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-bottom: 1.2rem;
  }
  @media (min-width: 480px) { .rv-info-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .rv-info-grid { grid-template-columns: repeat(4, 1fr); } }

  .rv-info-tile {
    background: var(--stone-1); border: 1px solid var(--stone-2);
    box-shadow: var(--shadow-inset); border-radius: 10px; padding: 0.85rem; min-width: 0;
  }
  .rv-info-tile-label {
    font-family: var(--font-historic);
    font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.3rem;
  }
  .rv-info-tile-val {
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
    color: var(--text-primary); word-break: break-word; line-height: 1.2;
  }
  .rv-info-tile-val.gold  { color: var(--swarna-gold); font-family: var(--font-mythic); font-size: 1.35rem; }
  .rv-info-tile-val.blue  { color: #60a5fa; font-family: var(--font-mythic); font-size: 1.35rem; }

  /* ── Stops Chips ── */
  .rv-stops-list { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; }
  .rv-stop-chip {
    font-family: var(--font-historic); font-size: 0.6rem; letter-spacing: 0.08em;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    color: var(--text-muted); padding: 0.3rem 0.7rem; border-radius: 8px;
    white-space: nowrap;
  }
  .rv-stop-chip.first, .rv-stop-chip.last {
    border-color: rgba(212,175,55,0.3); color: var(--swarna-gold);
    background: rgba(212,175,55,0.1); font-weight: 700;
  }

  /* ── Graph Selector ── */
  .rv-graph-selector {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
  }
  .rv-graph-selector-label {
    font-family: var(--font-historic); font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-muted); white-space: nowrap;
  }
  .rv-graph-checkbox {
    display: flex; align-items: center; gap: 0.4rem;
    cursor: pointer; font-family: var(--font-body); font-size: 0.8rem; color: var(--text-muted);
    transition: color 0.2s; user-select: none;
    padding: 0.3rem 0.7rem; border-radius: 8px;
    border: 1px solid var(--stone-3); background: var(--stone-1);
    box-shadow: var(--shadow-outset);
  }
  .rv-graph-checkbox:hover { color: var(--kansa-light); border-color: var(--kansa-bronze); }
  .rv-graph-checkbox input[type="radio"] { accent-color: var(--swarna-gold); width: 14px; height: 14px; cursor: pointer; }
  .rv-graph-checkbox.active { color: var(--swarna-gold); border-color: var(--swarna-gold); background: rgba(212,175,55,0.08); }

  /* ── Table ── */
  .rv-table-wrap {
    overflow-x: auto; margin-top: 1.2rem;
    border-radius: 12px; border: 1px solid var(--stone-3);
    background: var(--stone-1); box-shadow: var(--shadow-inset);
  }
  .rv-table {
    width: 100%; border-collapse: collapse;
    font-family: var(--font-body); font-size: 0.85rem; min-width: 600px;
  }
  .rv-table thead tr { border-bottom: 1px solid var(--stone-3); background: var(--stone-2); }
  .rv-table th {
    font-family: var(--font-historic); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--kansa-light); padding: 0.8rem 1rem; text-align: left;
  }
  .rv-table td {
    color: var(--text-primary); padding: 0.8rem 1rem;
    border-bottom: 1px solid var(--stone-3);
    transition: background 0.15s, color 0.15s;
    vertical-align: top;
  }
  .rv-table tbody tr:last-child td { border-bottom: none; }
  .rv-table tbody tr:hover td { background: rgba(205,127,50,0.08); color: var(--swarna-gold); }
  .td-num { font-weight: 700; color: var(--kansa-bronze); white-space: nowrap; }

  /* ── Hero Banner ── */
  .rv-hero-banner {
    position: relative; border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-outset); border: 1px solid var(--kansa-bronze);
    margin-bottom: 2rem;
  }
  .rv-hero-banner img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.5;
    mix-blend-mode: overlay; transition: opacity 0.5s ease;
  }
  [data-theme="light"] .rv-hero-banner img { opacity: 0.3; mix-blend-mode: multiply; }

  /* ── Train Track ── */
  .rv-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
  }
  .rv-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    animation: rv-train-rtl 15s linear infinite;
  }
  .rv-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .rv-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }

  /* ── Live Dot ── */
  .rv-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3CB371; position: relative; flex-shrink: 0;
  }
  .rv-live-dot::after {
    content: ''; position: absolute; inset: -2px; border-radius: 50%;
    background: #3CB371; opacity: 0.4;
    animation: rv-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  /* ── Ticker Summary ── */
  .rv-ticker {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem;
    margin-top: 1.4rem; width: 100%;
  }
  @media (min-width: 480px) { .rv-ticker { grid-template-columns: repeat(4, 1fr); } }
  .rv-ticker-card {
    background: var(--stone-2); border: 1px solid var(--stone-3);
    border-radius: 14px; padding: 0.9rem 0.8rem;
    text-align: center; position: relative; overflow: hidden; min-width: 0;
    box-shadow: var(--shadow-outset);
  }
  .rv-ticker-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .rv-ticker-card.gold-top::before  { background: linear-gradient(90deg, transparent, var(--swarna-gold), transparent); }
  .rv-ticker-card.red-top::before   { background: linear-gradient(90deg, transparent, var(--sindoor-red), transparent); }
  .rv-ticker-card.green-top::before { background: linear-gradient(90deg, transparent, #3CB371, transparent); }
  .rv-ticker-card.blue-top::before  { background: linear-gradient(90deg, transparent, #60a5fa, transparent); }
  
  .rv-ticker-val { font-family: var(--font-mythic); font-size: clamp(1.5rem, 5vw, 2.2rem); line-height: 1; display: block; }
  .rv-ticker-val.gold  { color: var(--swarna-gold); }
  .rv-ticker-val.red   { color: var(--sindoor-red); }
  .rv-ticker-val.green { color: #3CB371; }
  .rv-ticker-val.blue  { color: #60a5fa; }
  
  .rv-ticker-label { font-family: var(--font-historic); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 0.4rem; }
  .rv-ticker-sub { font-family: var(--font-historic); font-size: 0.45rem; color: var(--text-muted); opacity: 0.7; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.2rem; }

  /* Loading shimmer for KPI */
  .rv-ticker-shimmer {
    height: 2.2rem; border-radius: 6px;
    background: linear-gradient(90deg, var(--stone-3) 25%, var(--stone-1) 50%, var(--stone-3) 75%);
    background-size: 200% 100%;
    animation: rv-shimmer 1.4s infinite;
    margin-bottom: 0.35rem;
  }

  /* ── Animations ── */
  @keyframes rv-chakra-spin  { to { transform: rotate(360deg); } }
  @keyframes rv-float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes rv-ping         { 75%,100%{transform:scale(2);opacity:0} }
  @keyframes rv-card-in      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rv-fade-up      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rv-train-rtl    { 0%{transform:translateX(0)} 100%{transform:translateX(-100vw)} }
  @keyframes rv-shimmer      { 0%{background-position: -200% 0;} 100%{background-position: 200% 0;} }

  .rv-animate-in { animation: rv-fade-up 0.6s cubic-bezier(0.25,1,0.5,1) both; }

  /* ── Responsive ── */
  *, *::before, *::after { box-sizing: border-box; }
  .rv-card, .rv-card-inset, .rv-filter-panel, .rv-tabs-wrap { min-width: 0; overflow: hidden; width: 100%; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Sampark Kranti Express (SK)', 'Superfast Express (SF)',
  'Rajdhani Express (RJDH)', 'Special Train (SPL)',
  'Tejas Express (TEJ)', 'Suburban Local (EMU)', 'DEMU (DEMU)',
  'Humsafar Express (HMSFR)', 'Double Decker Express (DD)',
  'Duronto Express (DRNT)', 'Vande Bharat Express (VB)',
  'Jan Shatabdi Express (JSTBD)', 'Shatabdi Express (SHTBD)',
  'Mail Express (ME)', 'MEMU (MEMU)', 'Passenger (PASS)',
  'Garib Rath Express (GR)', 'Intercity Express (IC)',
  'Antyodaya Express (ANTY)',
];

const ZONES = [
  'Northeast Frontier Railway (NFR)', 'North Central Railway (NCR)',
  'Metro Railway Kolkata (MTPR)', 'East Coast Railway (ECoR)',
  'South Central Railway (SCR)', 'Konkan Railway (KR)',
  'South Eastern Railway (SER)', 'West Central Railway (WCR)',
  'Southern Railway (SR)', 'Central Railway (CR)',
  'Western Railway (WR)', 'Northern Railway (NR)',
  'Eastern Railway (ER)', 'North Eastern Railway (NER)',
  'South Coast Railway (SCoR)', 'North Western Railway (NWR)',
  'East Central Railway (ECR)', 'South East Central Railway (SECR)',
  'South Western Railway (SWR)',
];

const MODES = [
  { id: "zone", label: "By Zone", icon: "🗺️" },
  { id: "category", label: "By Category", icon: "🏷️" },
  { id: "number", label: "By Number", icon: "🔢" },
  { id: "name", label: "By Name", icon: "📛" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(val) {
  if (val === null || val === undefined) return "—";
  const n = Number(val);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const formatChartValue = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val}`;
};

function parseStops(stops) {
  if (!stops) return [];
  if (Array.isArray(stops)) return stops;
  return String(stops).split("|").map(s => s.trim()).filter(Boolean);
}

// ─── Components ───────────────────────────────────────────────────────────────

function StopsDisplay({ stops }) {
  const arr = parseStops(stops);
  if (!arr.length) return <span className="rv-text-muted">—</span>;
  return (
    <div className="rv-stops-list">
      {arr.map((s, i) => (
        <span key={i} className={`rv-stop-chip${i === 0 ? " first" : i === arr.length - 1 ? " last" : ""}`}>{s}</span>
      ))}
    </div>
  );
}

const YugaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--stone-2)", border: "1px solid var(--kansa-bronze)",
      borderRadius: 10, padding: "0.6rem 1rem", boxShadow: "var(--shadow-outset)",
      fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-primary)"
    }}>
      <div style={{ color: "var(--kansa-light)", fontFamily: "var(--font-historic)", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--swarna-gold)" }}>
          {p.name}: <strong>{p.name === "Revenue" || p.name === "Value" ? formatINR(p.value) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function TickerCard({ label, sub, value, colorClass, topClass, loading }) {
  return (
    <div className={`rv-ticker-card ${topClass}`}>
      {loading ? (
        <div className="rv-ticker-shimmer" />
      ) : (
        <span className={`rv-ticker-val ${colorClass}`}>{value ?? "—"}</span>
      )}
      <div className="rv-ticker-label">{label}</div>
      {sub && <div className="rv-ticker-sub">{sub}</div>}
    </div>
  );
}

// Universal Revenue Chart handles all modes cleanly
function RevenueCharts({ data, dataKey, nameKey, title }) {
  const [chartType, setChartType] = useState("bar");
  if (!data || data.length === 0) return null;

  const COLORS = ['#D4AF37', '#3CB371', '#60a5fa', '#CD7F32', '#a78bfa', '#E34234', '#f97316', '#ec4899'];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" vertical={false} />
              <XAxis dataKey={nameKey} tick={{ fill: "var(--text-muted)", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={formatChartValue} width={95} tickMargin={8} />
              <Tooltip content={<YugaTooltip />} />
              <Bar dataKey={dataKey} name="Revenue" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" vertical={false} />
              <XAxis dataKey={nameKey} tick={{ fill: "var(--text-muted)", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={formatChartValue} width={95} tickMargin={8} />
              <Tooltip content={<YugaTooltip />} />
              <Line type="monotone" dataKey={dataKey} name="Revenue" stroke="var(--swarna-gold)" strokeWidth={3} dot={{ fill: "var(--stone-1)", stroke: "var(--swarna-gold)", strokeWidth: 2, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--kansa-bronze)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--kansa-bronze)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" vertical={false} />
              <XAxis dataKey={nameKey} tick={{ fill: "var(--text-muted)", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={formatChartValue} width={95} tickMargin={8} />
              <Tooltip content={<YugaTooltip />} />
              <Area type="monotone" dataKey={dataKey} name="Revenue" stroke="var(--kansa-bronze)" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={50}
                paddingAngle={2}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<YugaTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-body)", color: "var(--text-muted)" }} />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rv-card p-5 rv-animate-in" style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📈</span>
          <span className="rv-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>
            {title}
          </span>
        </div>
        <div className="rv-graph-selector" style={{ marginBottom: 0 }}>
          <span className="rv-graph-selector-label">View:</span>
          {[{ id: "bar", label: "Bar" }, { id: "line", label: "Line" }, { id: "area", label: "Area" }, { id: "pie", label: "Pie" }].map(ct => (
            <label key={ct.id} className={`rv-graph-checkbox${chartType === ct.id ? " active" : ""}`}>
              <input type="radio" name={`${title}-chartType`} checked={chartType === ct.id} onChange={() => setChartType(ct.id)} />
              {ct.label}
            </label>
          ))}
        </div>
      </div>
      {renderChart()}
    </div>
  );
}

function FilterPanel({ title, children }) {
  return (
    <div className="rv-filter-panel rv-animate-in">
      <div className="rv-filter-title">{title}</div>
      <div className="rv-filter-row">{children}</div>
    </div>
  );
}

function ResultPanel({ state, kpi }) {
  const { status, data, mode } = state;

  const BADGE_MAP = {
    zone: "BY ZONE",
    category: "BY CATEGORY",
    number: "BY TRAIN NO",
    name: "BY TRAIN NAME",
  };

  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <div className="rv-card p-5">
        <div className="rv-loader">
          <div className="rv-spinner" />
          <span className="rv-loader-text">Fetching revenue data…</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rv-card p-5">
        <div className="rv-error-msg">{data?.error || "Request failed"}</div>
      </div>
    );
  }

  let stats = [];
  let tableRows = null;
  let chartComponent = null;

  if (mode === "zone") {
    stats = [
      { label: "Zone", val: data.zone },
      { label: "Train Count", val: String(data.count ?? "—") },
      { label: "Avg Revenue", val: formatINR(data.average_revenue), cls: "gold" },
    ];
    const compData = [
      { name: data.zone || "Selected Zone", Revenue: data.average_revenue || 0 },
      { name: "National Avg", Revenue: kpi?.average || 0 },
      { name: "Highest Achieved", Revenue: kpi?.highest || 0 }
    ];
    chartComponent = <RevenueCharts data={compData} dataKey="Revenue" nameKey="name" title={`Zonal Comparison vs National Benchmark`} />;
  } else if (mode === "category") {
    stats = [
      { label: "Category", val: data.category },
      { label: "Train Count", val: String(data.count ?? "—") },
      { label: "Avg Revenue", val: formatINR(data.average_revenue), cls: "gold" },
    ];
    const compData = [
      { name: data.category || "Selected Category", Revenue: data.average_revenue || 0 },
      { name: "National Avg", Revenue: kpi?.average || 0 },
      { name: "Highest Achieved", Revenue: kpi?.highest || 0 }
    ];
    chartComponent = <RevenueCharts data={compData} dataKey="Revenue" nameKey="name" title={`Category Comparison vs National Benchmark`} />;
  } else if (mode === "number") {
    stats = [
      { label: "Train No", val: String(data.TrainNo ?? "—"), cls: "gold" },
      { label: "Train Name", val: data.TrainName },
      { label: "Distance", val: data.distance != null ? `${Number(data.distance).toFixed(1)} km` : "—" },
      { label: "Revenue", val: formatINR(data.Revenue), cls: "gold" },
    ];
    const compData = [
      { name: `Train ${data.TrainNo}`, Revenue: data.Revenue || 0 },
      { name: "Fleet Avg", Revenue: kpi?.average || 0 }
    ];
    chartComponent = <RevenueCharts data={compData} dataKey="Revenue" nameKey="name" title={`Train ${data.TrainNo} Performance vs Fleet Average`} />;
  } else if (mode === "name") {
    stats = [
      { label: "Train Name", val: data.train_name },
      { label: "Matches Found", val: String(data.count ?? "—"), cls: "blue" },
      { label: "Net Revenue (All)", val: formatINR(data.net_revenue), cls: "gold" },
    ];
    if (data.trains && data.trains.length > 0) {
      tableRows = data.trains;
      chartComponent = <RevenueCharts data={tableRows.slice(0, 15)} dataKey="Revenue" nameKey="TrainNo" title="Revenue Distribution: Matching Trains" />;
    }
  }

  return (
    <div className="rv-card p-5 rv-animate-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div className="rv-font-historic" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--swarna-gold)", background: "rgba(212,175,55,0.1)", padding: "0.3rem 0.8rem", borderRadius: "99px", border: "1px solid rgba(212,175,55,0.2)" }}>
          {BADGE_MAP[mode] ?? mode.toUpperCase()}
        </div>
        <div className="rv-font-historic" style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          RESULT · {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="rv-info-grid">
        {stats.map(s => (
          <div className="rv-info-tile" key={s.label}>
            <div className="rv-info-tile-label">{s.label}</div>
            <div className={`rv-info-tile-val ${s.cls ?? ""}`}>{s.val ?? "—"}</div>
          </div>
        ))}
      </div>

      {mode === "number" && data.stops && (
        <>
          <div className="rv-section-divider" style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>
            <div className="rv-section-label">Route Stops</div>
            <div className="rv-section-line" />
          </div>
          <StopsDisplay stops={data.stops} />
        </>
      )}

      {tableRows && (
        <div className="rv-table-wrap">
          <table className="rv-table">
            <thead>
              <tr>
                <th>Train No</th>
                <th>Train Name</th>
                <th>Revenue</th>
                <th>Distance</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(t => (
                <tr key={t.TrainNo}>
                  <td className="td-num">{t.TrainNo}</td>
                  <td style={{ fontWeight: 600 }}>{t.TrainName}</td>
                  <td className="td-num">{formatINR(t.Revenue)}</td>
                  <td>{t.distance != null ? `${Number(t.distance).toFixed(1)} km` : "—"}</td>
                  <td style={{ maxWidth: '350px', whiteSpace: 'normal' }}>
                    <StopsDisplay stops={t.stops} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chartComponent}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Revenue() {
  const [kpi, setKpi] = useState({ highest: null, lowest: null, average: null, total: null, totalTrains: null });
  const [kpiLoading, setKpiLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("zone");

  const [zone, setZone] = useState("");
  const [cat, setCat] = useState("");
  const [trainNum, setTrainNum] = useState("");
  const [trainName, setTrainName] = useState("");

  const [zoneResult, setZoneResult] = useState({ status: "idle", data: null, mode: "zone" });
  const [catResult, setCatResult] = useState({ status: "idle", data: null, mode: "category" });
  const [numResult, setNumResult] = useState({ status: "idle", data: null, mode: "number" });
  const [nameResult, setNameResult] = useState({ status: "idle", data: null, mode: "name" });

  useEffect(() => {
    Promise.all([
      fetch(`${API_URI}/api/train/HighestRevenue`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API_URI}/api/train/LowestRevenue`,  { credentials: "include" }).then(r => r.json()),
      fetch(`${API_URI}/api/train/AverageRevenue`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API_URI}/api/train/TotalRevenue`,   { credentials: "include" }).then(r => r.json()),
    ])
      .then(([h, l, a, t]) => {
        setKpi({
          highest:     h.highest_revenue,
          lowest:      l.lowest_revenue,
          average:     a.average_revenue,
          total:       t.total_revenue,
          totalTrains: t.total_trains,
        });
      })
      .catch(() => {})
      .finally(() => setKpiLoading(false));
  }, []);

  const doFetch = useCallback(async (path, setResult, mode) => {
    setResult({ status: "loading", data: null, mode });
    try {
      const res  = await fetch(`${API_URI}${path}`, { credentials: "include" });
      const data = await res.json();
      setResult({ status: res.ok ? "success" : "error", data, mode });
    } catch {
      setResult({ status: "error", data: { error: "Network error" }, mode });
    }
  }, []);

  const fetchByZone = () => {
    if (!zone) return;
    doFetch(`/api/train/RevenueByZone?zone=${encodeURIComponent(zone)}`, setZoneResult, "zone");
  };

  const fetchByCat = () => {
    if (!cat) return;
    doFetch(`/api/train/RevenueByCategory?cat=${encodeURIComponent(cat)}`, setCatResult, "category");
  };

  const fetchByNum = () => {
    if (!trainNum.trim()) return;
    doFetch(`/api/train/RevenueByNum?num=${encodeURIComponent(trainNum.trim())}`, setNumResult, "number");
  };

  const fetchByName = () => {
    if (!trainName.trim()) return;
    doFetch(`/api/train/RevenueByName?name=${encodeURIComponent(trainName.trim())}`, setNameResult, "name");
  };

  const kpiChartData = useMemo(() => {
    if (kpiLoading) return [];
    return [
      { name: "Lowest", Value: kpi.lowest || 0 },
      { name: "Average", Value: kpi.average || 0 },
      { name: "Highest", Value: kpi.highest || 0 }
    ];
  }, [kpi, kpiLoading]);

  return (
    <Navbar>
      <style>{REVENUE_CSS}</style>

      <div className="rv-page">
        {/* ── Train Track Animation ── */}
        <div className="rv-train-track">
          <div className="rv-train-loop-container">
            <div className="rv-train-set">
              <div className="rv-bogie">🚂</div>
              <div className="rv-bogie">🚃</div>
              <div className="rv-bogie">🚃</div>
              <div className="rv-bogie">🚃</div>
            </div>
            <div className="rv-train-set">
              <div className="rv-bogie">🚂</div>
              <div className="rv-bogie">🚃</div>
              <div className="rv-bogie">🚃</div>
              <div className="rv-bogie">🚃</div>
            </div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--swarna-gold)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--kansa-bronze)" }} />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
          
          {/* ── HERO BANNER ── */}
          <div
            className="mb-8 rv-animate-in rv-hero-banner p-8 sm:p-12 flex flex-col justify-end min-h-[200px] relative overflow-hidden"
            style={{ animationDelay: "0s", background: "var(--stone-3)" }}
          >
            <img
              src="https://imgs.search.brave.com/nYwQ0EInRLiRHvY_CkVbs9NdI5kkztACB9CMynwzXiw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/d2hhdHMteW91ci1m/YXZvcml0ZS1kaWVz/ZWwtbG9jb21vdGl2/ZS1vZi1hbGwtdGlt/ZS12MC1xN2c4ZDJx/aHV0NWUxLmpwZWc_/d2lkdGg9MjA0OCZm/b3JtYXQ9cGpwZyZh/dXRvPXdlYnAmcz00/ZGFhOTZjZDk2MDI4/NDIyN2Q3NjQ2NTMx/OTVhYTZiY2JmOTFm/NzVm"
              alt="Revenue Explorer"
              loading="lazy"
              className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700"
              onLoad={e => { e.currentTarget.style.opacity = "0.5" }}
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-2)] via-transparent to-transparent z-[1]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-3 bg-[var(--stone-1)]/80 backdrop-blur px-3 py-1 rounded-full border border-[var(--kansa-bronze)]">
                <span className="text-xs rv-font-historic rv-text-bronze">🪙 Railway Intelligence · Revenue</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl rv-font-mythic rv-text-gold mb-2 drop-shadow-2xl">
                Revenue Analytics
              </h1>
              <p className="text-sm sm:text-base font-mono rv-text-primary tracking-wide uppercase drop-shadow-md">
                Aggregate · Segmented · Financial Intelligence
              </p>
            </div>

            {/* KPI Ticker inside hero */}
            <div className="relative z-10 rv-ticker mt-4">
              <TickerCard
                label="Highest Revenue" sub="Peak Earner"
                value={formatINR(kpi.highest)}
                colorClass="gold" topClass="gold-top"
                loading={kpiLoading}
              />
              <TickerCard
                label="Lowest Revenue" sub="Bottom Range"
                value={formatINR(kpi.lowest)}
                colorClass="red" topClass="red-top"
                loading={kpiLoading}
              />
              <TickerCard
                label="Average Revenue" sub="Fleet Mean"
                value={formatINR(kpi.average)}
                colorClass="green" topClass="green-top"
                loading={kpiLoading}
              />
              <TickerCard
                label="Total Revenue"
                sub={kpi.totalTrains ? `${kpi.totalTrains} Trains` : "All Trains"}
                value={formatINR(kpi.total)}
                colorClass="blue" topClass="blue-top"
                loading={kpiLoading}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6 p-4 rv-card-inset border-l-4 border-l-[var(--swarna-gold)]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="rv-live-dot" />
              <span className="rv-text-muted">Financial DB <span className="font-bold rv-text-primary">Connected</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono ml-auto">
              <span className="rv-text-muted">{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              <span className="rv-text-bronze">•</span>
              <span className="rv-text-muted">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* ── KPI CHARTS ── */}
          <div className="rv-section-divider">
            <div className="rv-section-label">📊 Core Financial Metrics</div>
            <div className="rv-section-line" />
          </div>
          <div className="mb-8">
            <RevenueCharts
              data={kpiChartData}
              dataKey="Value"
              nameKey="name"
              title="Global Revenue Distribution"
            />
          </div>

          {/* ── TABS ── */}
          <div className="rv-section-divider">
            <div className="rv-section-label">⬡ Segmentation Mode</div>
            <div className="rv-section-line" />
          </div>

          <div className="rv-tabs-wrap rv-animate-in" style={{ animationDelay: "0.05s" }}>
            <div className="rv-tabs-title">🪙 Revenue Explorer</div>
            <div className="rv-tabs">
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`rv-tab${activeTab === m.id ? " active" : ""}`}
                  onClick={() => setActiveTab(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CONDITIONAL PANELS ── */}

          <div style={{ display: activeTab === "zone" ? "block" : "none" }}>
            <FilterPanel title="⬡ Zone Filter">
              <div className="rv-field">
                <label>Railway Zone</label>
                <select value={zone} onChange={e => setZone(e.target.value)}>
                  <option value="">— Choose Zone —</option>
                  {ZONES.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <button
                className="rv-fetch-btn"
                onClick={fetchByZone}
                disabled={!zone || zoneResult.status === "loading"}
              >
                {zoneResult.status === "loading" ? "Fetching…" : "Fetch Revenue →"}
              </button>
            </FilterPanel>
            <ResultPanel state={zoneResult} kpi={kpi} />
          </div>

          <div style={{ display: activeTab === "category" ? "block" : "none" }}>
            <FilterPanel title="⬡ Category Filter">
              <div className="rv-field">
                <label>Train Category</label>
                <select value={cat} onChange={e => setCat(e.target.value)}>
                  <option value="">— Choose Category —</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button
                className="rv-fetch-btn"
                onClick={fetchByCat}
                disabled={!cat || catResult.status === "loading"}
              >
                {catResult.status === "loading" ? "Fetching…" : "Fetch Revenue →"}
              </button>
            </FilterPanel>
            <ResultPanel state={catResult} kpi={kpi} />
          </div>

          <div style={{ display: activeTab === "number" ? "block" : "none" }}>
            <FilterPanel title="⬡ Train Number Filter">
              <div className="rv-field">
                <label>Train Number</label>
                <input
                  type="number"
                  placeholder="e.g. 77836"
                  value={trainNum}
                  onChange={e => setTrainNum(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchByNum()}
                />
              </div>
              <button
                className="rv-fetch-btn"
                onClick={fetchByNum}
                disabled={!trainNum.trim() || numResult.status === "loading"}
              >
                {numResult.status === "loading" ? "Fetching…" : "Fetch Revenue →"}
              </button>
            </FilterPanel>
            <ResultPanel state={numResult} kpi={kpi} />
          </div>

          <div style={{ display: activeTab === "name" ? "block" : "none" }}>
            <FilterPanel title="⬡ Train Name Filter">
              <div className="rv-field">
                <label>Train Name</label>
                <input
                  type="text"
                  placeholder="e.g. Madurai Intercity"
                  value={trainName}
                  onChange={e => setTrainName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchByName()}
                />
              </div>
              <button
                className="rv-fetch-btn"
                onClick={fetchByName}
                disabled={!trainName.trim() || nameResult.status === "loading"}
              >
                {nameResult.status === "loading" ? "Fetching…" : "Fetch Revenue →"}
              </button>
            </FilterPanel>
            <ResultPanel state={nameResult} kpi={kpi} />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-[var(--stone-3)] text-center rv-font-historic rv-text-muted space-y-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p className="rv-text-gold">▶ REVENUE MODULE OPERATIONAL</p>
          </div>

        </div>
      </div>
    </Navbar>
  );
}