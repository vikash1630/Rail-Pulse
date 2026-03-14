import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../pages/Navbar";

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const REVENUE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

  /* ── KEYFRAMES ── */
  @keyframes rv-spin        { to { transform: rotate(360deg); } }
  @keyframes rv-card-in     { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes rv-glow-pulse  { 0%,100%{box-shadow:0 0 20px rgba(201,151,58,.15)} 50%{box-shadow:0 0 40px rgba(201,151,58,.35)} }
  @keyframes rv-rail-flow   { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes rv-float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes rv-scan        { 0%{top:0%;opacity:.5} 100%{top:100%;opacity:0} }
  @keyframes rv-badge-pop   { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes rv-bg-move     { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes rv-orb-drift   { 0%{transform:translate(0,0)} 33%{transform:translate(35px,-25px)} 66%{transform:translate(-18px,35px)} 100%{transform:translate(0,0)} }
  @keyframes rv-hero-rise   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rv-count-up    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rv-pulse-dot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }
  @keyframes rv-shimmer     { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

  /* ── RESET ── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── PAGE SHELL ── */
  .rv-page {
    min-height: 100vh;
    padding: 1.4rem .9rem 5rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    font-family: 'Barlow Condensed', sans-serif;
    color: #f0eeeb;
  }

  .rv-page::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.035) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: rv-bg-move 9s linear infinite;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  }
  .rv-page::after {
    content: '';
    position: fixed; top: -180px; right: -180px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,.065) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: rv-orb-drift 18s ease-in-out infinite;
  }
  .rv-page > * { position: relative; z-index: 1; }

  /* ── HERO HEADER ── */
  .rv-header {
    margin-bottom: 2.2rem;
    padding-top: .5rem;
    animation: rv-hero-rise .75s cubic-bezier(.22,1,.36,1) both;
  }

  .rv-header-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .88rem);
    letter-spacing: .35em; text-transform: uppercase;
    color: #c9973a; margin-bottom: .8rem;
    display: flex; align-items: center; gap: .7rem; opacity: .85;
  }
  .rv-header-eyebrow::before, .rv-header-eyebrow::after {
    content: ''; height: 1px; flex: 1; max-width: 55px;
  }
  .rv-header-eyebrow::before { background: linear-gradient(90deg, #c9973a, transparent); }
  .rv-header-eyebrow::after  { background: linear-gradient(270deg, #c9973a, transparent); }

  .rv-header h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.5rem, 20vw, 9rem);
    font-weight: 400; color: #f0eeeb;
    letter-spacing: .05em; line-height: .88;
    text-transform: uppercase; margin: 0 0 .3rem;
  }
  .rv-header h1 .rv-h1-accent {
    color: transparent; -webkit-text-stroke: 1.5px #c9973a;
  }

  .rv-header-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .92rem);
    color: #6b7280; margin-top: .6rem;
    letter-spacing: .15em; text-transform: uppercase;
  }

  /* ── KPI TICKER — 2×2 mobile, 4-col 480px+ ── */
  .rv-ticker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .6rem;
    margin-top: 1.4rem;
    width: 100%;
  }
  @media (min-width: 480px) { .rv-ticker { grid-template-columns: repeat(4, 1fr); } }

  .rv-ticker-card {
    background: rgba(13,16,22,.92);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 14px; padding: .9rem .8rem;
    text-align: center; position: relative; overflow: hidden; min-width: 0;
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .rv-ticker-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a, transparent);
  }
  .rv-ticker-card.gold-top::before   { background: linear-gradient(90deg, transparent, #e8b454, transparent); }
  .rv-ticker-card.green-top::before  { background: linear-gradient(90deg, transparent, #3db87a, transparent); }
  .rv-ticker-card.red-top::before    { background: linear-gradient(90deg, transparent, #e05252, transparent); }
  .rv-ticker-card.blue-top::before   { background: linear-gradient(90deg, transparent, #60a5fa, transparent); }

  @media (min-width: 900px) {
    .rv-ticker-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 18px 55px rgba(0,0,0,.48);
      border-color: rgba(201,151,58,.25);
    }
  }

  .rv-ticker-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2.2rem);
    line-height: 1; letter-spacing: .04em; display: block;
    animation: rv-count-up .5s cubic-bezier(.22,1,.36,1) both;
  }
  .rv-ticker-val.gold  { color: #e8b454; }
  .rv-ticker-val.green { color: #3db87a; }
  .rv-ticker-val.red   { color: #e05252; }
  .rv-ticker-val.blue  { color: #60a5fa; }

  .rv-ticker-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.6vw, .7rem);
    color: #6b7280; letter-spacing: .18em; text-transform: uppercase; margin-top: .3rem;
  }
  .rv-ticker-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.5rem, 1.4vw, .6rem);
    color: #4b5563; letter-spacing: .12em; text-transform: uppercase; margin-top: .15rem;
  }

  /* Loading shimmer for KPI */
  .rv-ticker-shimmer {
    height: 2.2rem; border-radius: 6px;
    background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%);
    background-size: 200% 100%;
    animation: rv-shimmer 1.4s infinite;
    margin-bottom: .35rem;
  }

  /* ── RAIL DIVIDER ── */
  .rv-rail-divider { height: 22px; margin: 1.6rem 0; position: relative; overflow: hidden; }
  .rv-rail-divider::before {
    content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0px, rgba(255,255,255,.07) 20px, transparent 20px, transparent 30px);
    transform: translateY(-50%); animation: rv-rail-flow 2s linear infinite;
  }
  .rv-rail-divider::after {
    content: '▶'; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    color: #c9973a; font-size: .85rem; animation: rv-float 2s ease-in-out infinite;
  }

  /* ── SECTION DIVIDER ── */
  .rv-section-divider {
    display: flex; align-items: center; gap: .75rem;
    margin: 2rem 0 1.2rem;
  }
  .rv-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.8vw, .75rem); font-weight: 700;
    letter-spacing: .28em; text-transform: uppercase; color: #c9973a;
    white-space: nowrap;
  }
  .rv-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(201,151,58,.35), transparent);
  }

  /* ── FILTER PANEL ── */
  .rv-filter-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 1.4rem 1rem;
    margin-bottom: 1rem; position: relative; overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    width: 100%;
  }
  .rv-filter-panel:focus-within {
    border-color: rgba(201,151,58,.3);
    box-shadow: 0 0 50px rgba(201,151,58,.06);
  }
  .rv-filter-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #c9973a 40%, #e8b454 60%, transparent 100%);
    box-shadow: 0 0 12px rgba(201,151,58,.25);
  }
  .rv-scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
    animation: rv-scan 5s ease-in-out infinite; pointer-events: none; z-index: 0;
  }

  .rv-filter-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem); font-weight: 700;
    letter-spacing: .22em; text-transform: uppercase; color: #c9973a;
    margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem;
    position: relative; z-index: 1;
  }
  .rv-filter-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(201,151,58,.3), transparent);
  }

  /* Filter row — stacked on mobile, flex on 600px+ */
  .rv-filter-row {
    display: flex; flex-direction: column; gap: .7rem;
    position: relative; z-index: 1;
  }

  .rv-field { display: flex; flex-direction: column; gap: .4rem; width: 100%; }
  .rv-field label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem);
    font-weight: 700; letter-spacing: .22em; text-transform: uppercase;
    color: #6b7280; display: flex; align-items: center; gap: .45rem;
  }
  .rv-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%; background: #c9973a; box-shadow: 0 0 7px #c9973a; flex-shrink: 0;
  }

  .rv-field input, .rv-field select {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #f0eeeb;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.1rem, 3vw, 1.35rem); font-weight: 600;
    padding: .85rem 1rem; outline: none;
    transition: border-color .22s, box-shadow .22s; width: 100%;
    -webkit-appearance: none; min-height: 52px;
  }
  .rv-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23c9973a'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center;
    padding-right: 2.5rem; cursor: pointer;
  }
  .rv-field input::placeholder { color: #4b5563; }
  .rv-field input:focus, .rv-field select:focus {
    border-color: rgba(201,151,58,.45);
    box-shadow: 0 0 0 3px rgba(201,151,58,.08);
  }
  .rv-field select option { background: #161920; }

  .rv-fetch-btn {
    padding: 1rem 1.6rem;
    background: linear-gradient(135deg, #c9973a 0%, #e8b454 100%);
    color: #07080b; border: none; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.78rem, 2.2vw, .95rem);
    font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; transition: transform .18s, box-shadow .2s, opacity .2s;
    width: 100%;
    box-shadow: 0 4px 20px rgba(201,151,58,.25);
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    min-height: 52px; position: relative; overflow: hidden;
  }
  .rv-fetch-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    transition: left .4s;
  }
  .rv-fetch-btn:hover::after { left: 150%; }
  .rv-fetch-btn:active { transform: scale(.97); }
  .rv-fetch-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .rv-fetch-btn:disabled::after { display: none; }

  /* ── RESULT PANEL ── */
  .rv-result-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 1.4rem 1.2rem;
    margin-bottom: .5rem;
    position: relative; overflow: hidden;
    min-height: 100px;
    display: flex; align-items: center; justify-content: center;
  }
  .rv-result-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a 35%, #e8b454 65%, transparent);
    box-shadow: 0 0 16px rgba(201,151,58,.3);
  }
  .rv-result-panel.has-data {
    align-items: flex-start; justify-content: flex-start;
  }

  /* ── IDLE / LOADING / ERROR states ── */
  .rv-state {
    display: flex; flex-direction: column; align-items: center; gap: .5rem;
    opacity: .45; padding: 1.5rem 0;
  }
  .rv-state-icon { font-size: clamp(1.8rem, 5vw, 2.4rem); animation: rv-float 3s ease-in-out infinite; }
  .rv-state-msg {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem);
    color: #6b7280; letter-spacing: .18em; text-transform: uppercase; text-align: center;
  }

  .rv-loader {
    display: flex; align-items: center; gap: .75rem; padding: 1rem 0;
  }
  .rv-spinner {
    width: 28px; height: 28px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.07);
    border-top-color: #c9973a; border-right-color: #e8b454;
    border-radius: 50%; animation: rv-spin .75s linear infinite;
  }
  .rv-loader-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.8vw, .82rem);
    color: #6b7280; letter-spacing: .22em; text-transform: uppercase;
    animation: rv-float 1.5s ease-in-out infinite;
  }
  .rv-pulse-dot {
    display: inline-block; width: 6px; height: 6px;
    background: #c9973a; border-radius: 50%; margin-right: .5rem;
    animation: rv-pulse-dot 1s ease-in-out infinite;
  }

  .rv-error-msg {
    background: rgba(224,82,82,.06); border: 1px solid rgba(224,82,82,.25);
    border-radius: 12px; padding: .85rem 1rem;
    color: #e05252; font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.8vw, .82rem); letter-spacing: .07em;
    display: flex; align-items: center; gap: .6rem; width: 100%;
  }
  .rv-error-msg::before { content: '⚠'; flex-shrink: 0; }

  /* ── RESULT CONTENT ── */
  .rv-result-inner { width: 100%; animation: rv-card-in .4s cubic-bezier(.22,1,.36,1) both; }

  .rv-result-header-row {
    display: flex; align-items: center; gap: .65rem;
    margin-bottom: 1.2rem; flex-wrap: wrap;
    padding-bottom: .75rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .rv-result-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.5vw, .68rem); letter-spacing: .18em; text-transform: uppercase;
    padding: .28rem .75rem; border-radius: 99px;
    background: rgba(201,151,58,.1); border: 1px solid rgba(201,151,58,.22);
    color: #e8b454;
    animation: rv-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
  }
  .rv-result-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .68rem); color: #4b5563;
    letter-spacing: .1em; margin-left: auto;
  }

  /* Result stat cards — 2-col mobile, 3-col 480px+ */
  .rv-result-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: .65rem; margin-bottom: .5rem;
  }
  @media (min-width: 480px) { .rv-result-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .rv-result-stats { grid-template-columns: repeat(4, 1fr); } }

  .rv-stat-tile {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px; padding: .9rem;
    transition: border-color .2s, transform .2s;
    -webkit-tap-highlight-color: transparent;
  }
  @media (min-width: 900px) {
    .rv-stat-tile:hover { border-color: rgba(201,151,58,.25); transform: translateY(-2px); }
  }
  .rv-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.5vw, .68rem); letter-spacing: .15em; text-transform: uppercase;
    color: #4b5563; margin-bottom: .35rem;
  }
  .rv-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.3rem, 4vw, 1.8rem); line-height: 1;
    letter-spacing: .04em; color: #f0eeeb; word-break: break-word;
  }
  .rv-stat-val.gold  { color: #e8b454; }
  .rv-stat-val.green { color: #3db87a; }
  .rv-stat-val.blue  { color: #60a5fa; }
  .rv-stat-val.text  { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(1rem,3vw,1.25rem); font-weight:700; }

  /* ── TRAINS TABLE (multi-result) ── */
  .rv-table-wrap {
    overflow-x: auto; margin-top: 1.2rem;
    border-radius: 14px; border: 1px solid rgba(255,255,255,.07);
  }
  .rv-table {
    width: 100%; border-collapse: collapse;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.6vw, .75rem); min-width: 520px;
  }
  .rv-table thead tr { border-bottom: 1px solid rgba(201,151,58,.2); }
  .rv-table th {
    color: #c9973a; letter-spacing: .12em; text-transform: uppercase;
    padding: .65rem .9rem; text-align: left; font-weight: 700;
    background: rgba(13,16,22,.95); white-space: nowrap;
  }
  .rv-table td {
    color: #9ca3af; padding: .6rem .9rem;
    border-bottom: 1px solid rgba(255,255,255,.06);
    transition: background .15s, color .15s;
  }
  .rv-table tbody tr:last-child td { border-bottom: none; }
  .rv-table tbody tr:hover td { background: rgba(201,151,58,.04); color: #f0eeeb; }
  .rv-table .td-num { color: #e8b454; font-weight: 700; }
  .rv-table .td-name { color: #f0eeeb; }

  /* ── RESPONSIVE — 600px+ ── */
  @media (min-width: 600px) {
    .rv-page { padding: 1.8rem 1.5rem 6rem; }
    .rv-filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; }
    .rv-field { flex: 1; min-width: 160px; }
    .rv-fetch-btn { width: auto; flex-shrink: 0; padding: 1rem 1.8rem; }
  }

  @media (min-width: 900px) {
    .rv-page { padding: 2.2rem 2rem 7rem; }
  }

  /* Reduced motion */
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(val) {
  if (val === null || val === undefined) return "—";
  const n = Number(val);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── KPI Ticker Card ─────────────────────────────────────────────────────────
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

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ title, children }) {
  return (
    <div className="rv-filter-panel">
      <div className="rv-scan-line" />
      <div className="rv-filter-title">{title}</div>
      <div className="rv-filter-row">{children}</div>
    </div>
  );
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ state }) {
  const { status, data, mode } = state;

  const BADGE_MAP = {
    zone:     "BY ZONE",
    category: "BY CATEGORY",
    number:   "BY TRAIN NO",
    name:     "BY TRAIN NAME",
  };

  if (status === "idle") {
    return (
      <div className="rv-result-panel">
        <div className="rv-state">
          <span className="rv-state-icon">📡</span>
          <div className="rv-state-msg">Select filter and fetch revenue</div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="rv-result-panel">
        <div className="rv-loader">
          <div className="rv-spinner" />
          <span className="rv-loader-text">Fetching revenue data…</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rv-result-panel">
        <div className="rv-error-msg">{data?.error || "Request failed"}</div>
      </div>
    );
  }

  // Build stat tiles
  let stats = [];
  let tableRows = null;

  if (mode === "zone") {
    stats = [
      { label: "Zone",        val: data.zone,                          cls: "text" },
      { label: "Train Count", val: String(data.count ?? "—"),          cls: "text" },
      { label: "Avg Revenue", val: formatINR(data.average_revenue),    cls: "gold" },
    ];
  } else if (mode === "category") {
    stats = [
      { label: "Category",    val: data.category,                      cls: "text" },
      { label: "Train Count", val: String(data.count ?? "—"),          cls: "text" },
      { label: "Avg Revenue", val: formatINR(data.average_revenue),    cls: "gold" },
    ];
  } else if (mode === "number") {
    stats = [
      { label: "Train No",   val: String(data.TrainNo ?? "—"),         cls: "gold" },
      { label: "Train Name", val: data.TrainName,                      cls: "text" },
      { label: "Revenue",    val: formatINR(data.Revenue),             cls: "gold" },
      { label: "Stops",      val: String(data.stops ?? "—"),           cls: "text" },
      { label: "Distance",   val: data.distance != null ? `${Number(data.distance).toFixed(1)} km` : "—", cls: "text" },
    ];
  } else if (mode === "name") {
    stats = [
      { label: "Train Name",   val: data.train_name,                   cls: "text" },
      { label: "Matches",      val: String(data.count ?? "—"),         cls: "blue" },
      { label: "Net Revenue",  val: formatINR(data.net_revenue),       cls: "gold" },
    ];
    if (data.trains && data.trains.length > 0) tableRows = data.trains;
  }

  return (
    <div className="rv-result-panel has-data">
      <div className="rv-result-inner">
        <div className="rv-result-header-row">
          <div className="rv-result-badge">{BADGE_MAP[mode] ?? mode.toUpperCase()}</div>
          <div className="rv-result-meta">RESULT · {new Date().toLocaleTimeString()}</div>
        </div>

        <div className="rv-result-stats">
          {stats.map(s => (
            <div className="rv-stat-tile" key={s.label}>
              <div className="rv-stat-label">{s.label}</div>
              <div className={`rv-stat-val ${s.cls ?? ""}`}>{s.val ?? "—"}</div>
            </div>
          ))}
        </div>

        {tableRows && (
          <div className="rv-table-wrap">
            <table className="rv-table">
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
                {tableRows.map(t => (
                  <tr key={t.TrainNo}>
                    <td className="td-num">{t.TrainNo}</td>
                    <td className="td-name">{t.TrainName}</td>
                    <td className="td-num">{formatINR(t.Revenue)}</td>
                    <td>{t.stops}</td>
                    <td>{t.distance != null ? Number(t.distance).toFixed(1) : "—"}</td>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Revenue() {
  const [kpi, setKpi]           = useState({ highest: null, lowest: null, average: null, total: null, totalTrains: null });
  const [kpiLoading, setKpiLoading] = useState(true);

  const [zone,      setZone]      = useState("");
  const [cat,       setCat]       = useState("");
  const [trainNum,  setTrainNum]  = useState("");
  const [trainName, setTrainName] = useState("");

  const [zoneResult, setZoneResult]   = useState({ status: "idle", data: null, mode: "zone" });
  const [catResult,  setCatResult]    = useState({ status: "idle", data: null, mode: "category" });
  const [numResult,  setNumResult]    = useState({ status: "idle", data: null, mode: "number" });
  const [nameResult, setNameResult]   = useState({ status: "idle", data: null, mode: "name" });

  // ── KPI on mount ──────────────────────────────────────────────────────────
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

  // ── Generic fetch helper ──────────────────────────────────────────────────
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

  return (
    <Navbar>
      <style>{REVENUE_CSS}</style>

      <div className="rv-page">

        {/* ── HERO ── */}
        <div className="rv-header">
          <div className="rv-header-eyebrow">Railway Intelligence System · Revenue Module</div>
          <h1>
            Revenue <span className="rv-h1-accent">Analytics</span>
          </h1>
          <div className="rv-header-sub">Aggregate · Segmented · Financial Intelligence</div>

          {/* KPI Ticker */}
          <div className="rv-ticker">
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

        <div className="rv-rail-divider" />

        {/* ── BY ZONE ── */}
        <div className="rv-section-divider">
          <div className="rv-section-label">Revenue by Zone</div>
          <div className="rv-section-line" />
        </div>

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

        <ResultPanel state={zoneResult} />

        <div className="rv-rail-divider" />

        {/* ── BY CATEGORY ── */}
        <div className="rv-section-divider">
          <div className="rv-section-label">Revenue by Category</div>
          <div className="rv-section-line" />
        </div>

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

        <ResultPanel state={catResult} />

        <div className="rv-rail-divider" />

        {/* ── BY TRAIN NUMBER ── */}
        <div className="rv-section-divider">
          <div className="rv-section-label">Revenue by Train Number</div>
          <div className="rv-section-line" />
        </div>

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

        <ResultPanel state={numResult} />

        <div className="rv-rail-divider" />

        {/* ── BY TRAIN NAME ── */}
        <div className="rv-section-divider">
          <div className="rv-section-label">Revenue by Train Name</div>
          <div className="rv-section-line" />
        </div>

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

        <ResultPanel state={nameResult} />

      </div>
    </Navbar>
  );
}