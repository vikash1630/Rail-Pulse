import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../pages/Navbar";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/* ─────────────────────────────────────────────
   LIVE TRAIN YUGA CSS (Matches Dashboard Aesthetic)
───────────────────────────────────────────── */
const LIVETRAIN_CSS = `
  /* ── Structural Classes ── */
  .lt-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
  }

  /* ── Typography Utilities ── */
  .lt-font-mythic  { font-family: var(--font-mythic);   font-weight: 400; }
  .lt-font-historic{ font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .lt-font-body    { font-family: var(--font-body); }

  .lt-text-primary { color: var(--text-primary); transition: color 0.4s ease; }
  .lt-text-muted   { color: var(--text-muted);   transition: color 0.4s ease; }
  .lt-text-gold    { color: var(--swarna-gold); }
  .lt-text-bronze  { color: var(--kansa-bronze); }
  .lt-text-red     { color: var(--sindoor-red); }
  .lt-text-green   { color: #3CB371; }

  /* ── Neumorphic Stone Cards ── */
  .lt-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .lt-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }
  .lt-card-inset {
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.4s ease;
  }

  /* ── Filter Panel ── */
  .lt-filter-panel {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .lt-filter-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .lt-filter-title {
    font-family: var(--font-historic);
    font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light);
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .lt-filter-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }

  /* ── Input Fields ── */
  .lt-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .lt-field label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .lt-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--swarna-gold);
    box-shadow: 0 0 7px var(--swarna-gold);
    flex-shrink: 0;
  }
  .lt-field input {
    background: var(--stone-1);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 1.1rem; font-weight: 600;
    padding: 0.8rem 1rem;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    width: 100%;
  }
  .lt-field input::placeholder { color: var(--text-muted); opacity: 0.5; }
  .lt-field input:focus {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow);
  }

  /* ── Buttons ── */
  .lt-fetch-btn {
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
    -webkit-tap-highlight-color: transparent;
  }
  .lt-fetch-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .lt-fetch-btn:hover { background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light)); box-shadow: var(--diya-glow); transform: translateY(-2px); }
  .lt-fetch-btn:hover::after { left: 160%; }
  .lt-fetch-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }
  .lt-fetch-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .lt-refresh-btn {
    padding: 0.9rem 1.2rem;
    background: var(--stone-3);
    border: 1px solid var(--kansa-bronze);
    color: var(--kansa-light);
    border-radius: 10px;
    font-family: var(--font-historic);
    font-size: 0.8rem; font-weight: 800;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--shadow-outset);
    transition: all 0.3s ease;
    display: flex; align-items: center; gap: 0.5rem;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .lt-refresh-btn:hover { background: var(--stone-1); color: var(--swarna-gold); box-shadow: var(--diya-glow); }
  .lt-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .lt-refresh-icon.spinning { animation: lt-chakra-spin 0.7s linear infinite; display: inline-block; }

  /* ── Progress bar ── */
  .lt-auto-bar-wrap { margin-top: 0.9rem; }
  .lt-auto-bar-label {
    font-family: var(--font-historic);
    font-size: 0.6rem; color: var(--text-muted);
    letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 0.3rem;
    display: flex; justify-content: space-between;
  }
  .lt-auto-bar-track {
    height: 3px;
    background: var(--stone-3);
    box-shadow: var(--shadow-inset);
    border-radius: 999px; overflow: hidden;
  }
  .lt-auto-bar-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, var(--kansa-bronze), var(--swarna-gold));
    transition: width 0.5s linear;
  }

  /* ── Result Panel ── */
  .lt-result-panel {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
    min-height: 120px;
    display: flex; align-items: center; justify-content: center;
  }
  .lt-result-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--swarna-gold), var(--kansa-bronze), var(--swarna-gold), transparent);
    box-shadow: 0 0 16px var(--kansa-glow);
  }
  .lt-result-panel.has-data {
    align-items: flex-start; justify-content: flex-start;
  }

  /* ── States ── */
  .lt-state {
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    opacity: 0.5; padding: 2rem 0;
  }
  .lt-state-icon { font-size: 2.5rem; animation: lt-float 3s ease-in-out infinite; }
  .lt-state-msg {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase; text-align: center;
  }

  .lt-loader { display: flex; align-items: center; gap: 0.75rem; padding: 1.5rem 0; }
  .lt-spinner {
    width: 32px; height: 32px; flex-shrink: 0;
    border: 3px solid var(--stone-3);
    border-top-color: var(--swarna-gold);
    border-right-color: var(--kansa-bronze);
    border-radius: 50%;
    animation: lt-chakra-spin 1.2s linear infinite;
  }
  .lt-loader-text {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase;
    animation: lt-float 1.5s ease-in-out infinite;
  }

  .lt-error-msg {
    background: rgba(227,66,52,0.08);
    border: 1px solid rgba(227,66,52,0.35);
    border-radius: 12px; padding: 0.85rem 1.1rem;
    color: var(--sindoor-red);
    font-family: var(--font-historic);
    font-size: 0.75rem; letter-spacing: 0.07em;
    display: flex; align-items: center; gap: 0.6rem; width: 100%;
  }

  /* ── Result Header ── */
  .lt-result-header-row {
    display: flex; align-items: center; gap: 0.65rem;
    margin-bottom: 1.2rem; flex-wrap: wrap;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--stone-3);
  }
  .lt-result-badge {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 0.28rem 0.85rem; border-radius: 999px;
    background: rgba(212,175,55,0.1);
    border: 1px solid var(--swarna-gold);
    color: var(--swarna-gold);
  }
  .lt-result-meta {
    font-family: var(--font-historic);
    font-size: 0.6rem; color: var(--text-muted);
    letter-spacing: 0.1em; margin-left: auto;
    display: flex; align-items: center; gap: 0.4rem;
  }

  /* ── Stat Tiles (matches dashboard ticker cards) ── */
  .lt-stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem; margin-bottom: 1.2rem;
  }
  @media (min-width: 480px) { .lt-stat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .lt-stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .lt-stat-tile {
    padding: 1rem;
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
  }
  .lt-stat-tile::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .lt-stat-tile.gold-top::before   { background: linear-gradient(90deg, transparent, var(--swarna-gold), transparent); }
  .lt-stat-tile.green-top::before  { background: linear-gradient(90deg, transparent, #3CB371, transparent); }
  .lt-stat-tile.red-top::before    { background: linear-gradient(90deg, transparent, var(--sindoor-red), transparent); }
  .lt-stat-tile.blue-top::before   { background: linear-gradient(90deg, transparent, #60a5fa, transparent); }
  .lt-stat-tile.purple-top::before { background: linear-gradient(90deg, transparent, #a78bfa, transparent); }

  .lt-stat-label {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.35rem;
  }
  .lt-stat-val {
    font-family: var(--font-mythic);
    font-size: 1.5rem; line-height: 1; color: var(--text-primary); word-break: break-word;
  }
  .lt-stat-val.gold   { color: var(--swarna-gold); }
  .lt-stat-val.green  { color: #3CB371; }
  .lt-stat-val.red    { color: var(--sindoor-red); }
  .lt-stat-val.blue   { color: #60a5fa; }
  .lt-stat-val.purple { color: #a78bfa; }
  .lt-stat-val.text   { font-family: var(--font-body); font-size: 1rem; font-weight: 700; }

  /* ── Status Glow Card ── */
  .lt-status-card {
    background: linear-gradient(145deg, var(--stone-2), rgba(212,175,55,0.05));
    border: 1px solid var(--kansa-bronze);
    border-radius: 16px; padding: 1.2rem 1.4rem;
    margin-bottom: 1.2rem;
    box-shadow: var(--shadow-outset), var(--diya-glow);
    position: relative; overflow: hidden;
    animation: lt-glow-pulse 3s ease-in-out infinite;
  }
  .lt-status-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-light), var(--swarna-gold), var(--kansa-light), transparent);
  }
  .lt-status-card-label {
    font-family: var(--font-historic);
    font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light);
    margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .lt-status-card-value {
    font-family: var(--font-mythic);
    font-size: 1.8rem; letter-spacing: 0.03em;
    color: var(--text-primary); line-height: 1.1;
  }
  .lt-status-card-updated {
    font-family: var(--font-historic);
    font-size: 0.6rem; color: var(--text-muted);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-top: 0.5rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .lt-status-orb {
    position: absolute; bottom: -20px; right: -20px;
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, var(--kansa-glow) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Section Divider ── */
  .lt-section-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.5rem 0 1rem;
  }
  .lt-section-label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--kansa-light); white-space: nowrap;
  }
  .lt-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }

  /* ── Graph Type Selector ── */
  .lt-graph-selector {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .lt-graph-selector-label {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text-muted); white-space: nowrap;
  }
  .lt-graph-checkbox {
    display: flex; align-items: center; gap: 0.4rem;
    cursor: pointer;
    font-family: var(--font-body); font-size: 0.8rem;
    color: var(--text-muted);
    transition: color 0.2s;
    user-select: none;
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    border: 1px solid var(--stone-3);
    background: var(--stone-1);
    box-shadow: var(--shadow-outset);
  }
  .lt-graph-checkbox:hover { color: var(--kansa-light); border-color: var(--kansa-bronze); }
  .lt-graph-checkbox input[type="checkbox"] { accent-color: var(--swarna-gold); width: 14px; height: 14px; cursor: pointer; }
  .lt-graph-checkbox.active { color: var(--swarna-gold); border-color: var(--swarna-gold); background: rgba(212,175,55,0.08); }

  /* ── Stations Table ── */
  .lt-table-wrap {
    overflow-x: auto; margin-top: 0.4rem;
    border-radius: 12px; border: 1px solid var(--stone-3);
    max-height: 480px; overflow-y: auto;
    box-shadow: var(--shadow-inset);
  }
  .lt-table-wrap::-webkit-scrollbar { width: 5px; height: 5px; }
  .lt-table-wrap::-webkit-scrollbar-track { background: var(--stone-1); border-radius: 99px; }
  .lt-table-wrap::-webkit-scrollbar-thumb { background: var(--kansa-bronze); border-radius: 99px; }

  .lt-table {
    width: 100%; border-collapse: collapse;
    font-family: var(--font-body);
    font-size: 0.8rem; min-width: 560px;
  }
  .lt-table thead { position: sticky; top: 0; z-index: 2; }
  .lt-table thead tr { border-bottom: 1px solid var(--kansa-bronze); }
  .lt-table th {
    color: var(--kansa-light);
    font-family: var(--font-historic);
    font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.65rem 0.9rem; text-align: left; font-weight: 800;
    background: var(--stone-2); white-space: nowrap;
  }
  .lt-table td {
    color: var(--text-muted); padding: 0.55rem 0.9rem;
    border-bottom: 1px solid var(--stone-3);
    transition: background 0.15s, color 0.15s;
    vertical-align: middle;
  }
  .lt-table tbody tr:not(.lt-row-current):hover td {
    background: rgba(205,127,50,0.05); color: var(--text-primary);
  }
  .lt-row-current td {
    background: rgba(212,175,55,0.07) !important;
    color: var(--text-primary) !important;
  }
  .lt-row-current td:first-child::before {
    content: '▶'; color: var(--swarna-gold); font-size: 0.65rem; margin-right: 0.4rem;
  }
  .lt-table tbody tr:last-child td { border-bottom: none; }
  .lt-delay-late { color: var(--sindoor-red) !important; font-weight: 700; }
  .lt-delay-ok   { color: #3CB371 !important; font-weight: 700; }
  .lt-delay-none { color: var(--text-muted); }
  .lt-td-name    { color: var(--text-primary); }
  .lt-td-timing  { color: var(--swarna-gold); font-weight: 700; }
  .lt-td-plat    { color: #60a5fa; }
  .lt-td-halt    { color: #a78bfa; }

  /* ── Live Dot ── */
  .lt-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3CB371; position: relative; flex-shrink: 0;
  }
  .lt-live-dot::after {
    content: ''; position: absolute; inset: -2px;
    border-radius: 50%; background: #3CB371; opacity: 0.4;
    animation: lt-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  /* ── Hero Banner ── */
  .lt-hero-banner {
    position: relative;
    border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-outset);
    border: 1px solid var(--kansa-bronze);
  }
  .lt-hero-banner img {
    width: 100%; height: 100%;
    object-fit: cover; opacity: 0.6;
    mix-blend-mode: overlay;
    transition: opacity 0.5s ease;
  }
  [data-theme="light"] .lt-hero-banner img { opacity: 0.3; mix-blend-mode: multiply; }

  /* ── Train Track (from Dashboard) ── */
  .lt-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50;
    pointer-events: none;
    display: flex; align-items: center;
  }
  .lt-train-loop-container {
    display: flex; position: absolute;
    width: 200vw; left: 0;
    animation: train-rtl-loop 15s linear infinite;
  }
  .lt-train-set {
    display: flex; width: 100vw;
    justify-content: flex-end; align-items: center;
    padding-right: 50px;
  }
  .lt-bogie {
    font-size: 26px; width: 30px;
    display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }
  @keyframes train-rtl-loop {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100vw); }
  }

  /* ── Animations ── */
  @keyframes lt-chakra-spin  { to { transform: rotate(360deg); } }
  @keyframes lt-float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes lt-ping         { 75%,100%{transform:scale(2);opacity:0} }
  @keyframes lt-glow-pulse   { 0%,100%{box-shadow:var(--shadow-outset)} 50%{box-shadow:var(--shadow-outset),var(--diya-glow)} }
  @keyframes lt-card-in      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lt-fade-up      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lt-row-in       { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lt-refresh-spin { to{transform:rotate(360deg)} }

  .lt-animate-in { animation: lt-fade-up 0.6s cubic-bezier(0.25,1,0.5,1) both; }
  .lt-card-animate { animation: lt-card-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }

  ${Array.from({ length: 50 }, (_, i) => `.lt-table tbody tr:nth-child(${i + 1}){animation:lt-row-in .35s cubic-bezier(.22,1,.36,1) ${i * 0.025}s both;}`).join('')}

  /* ── Responsive ── */
  /* ── Responsive ── */
  * { box-sizing: border-box; }

  .lt-page { overflow-x: hidden; width: 100%; }

  .lt-filter-row { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
  .lt-filter-row .lt-field { width: 100%; }
  .lt-filter-row .lt-field input { width: 100%; min-width: 0; }
  .lt-fetch-btn { width: 100%; }

  .lt-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; margin-bottom: 1rem; width: 100%; }
  @media (min-width: 400px) { .lt-stat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 600px) { .lt-stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .lt-stat-tile { min-width: 0; overflow: hidden; }
  .lt-stat-val { font-size: 1.2rem; word-break: break-word; overflow-wrap: anywhere; }
  .lt-stat-label { font-size: 0.55rem; word-break: break-word; }

  .lt-status-card { word-break: break-word; }
  .lt-status-card-value { font-size: 1.1rem; word-break: break-word; overflow-wrap: anywhere; line-height: 1.3; }

  .lt-table-wrap { overflow-x: hidden; overflow-y: auto; border-radius: 12px; border: 1px solid var(--stone-3); max-height: 600px; box-shadow: var(--shadow-inset); width: 100%; }

  @media (max-width: 599px) {
    .lt-table { display: none; }

    .lt-mobile-card-list { display: flex; flex-direction: column; gap: 0; }

    .lt-mobile-station-card { padding: 0.85rem 1rem; border-bottom: 1px solid var(--stone-3); background: var(--stone-1); transition: background 0.15s; position: relative; }
    .lt-mobile-station-card:last-child { border-bottom: none; }
    .lt-mobile-station-card.is-current { background: rgba(212,175,55,0.06); }
    .lt-mobile-station-card.is-current::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--swarna-gold); border-radius: 0 2px 2px 0; }

    .lt-mobile-stn-row1 { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem; }
    .lt-mobile-stn-name { font-family: var(--font-body); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .lt-mobile-stn-num { font-family: var(--font-historic); font-size: 0.55rem; letter-spacing: 0.12em; color: var(--text-muted); flex-shrink: 0; }

    .lt-mobile-stn-row2 { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
    .lt-mobile-chip { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-family: var(--font-body); background: var(--stone-2); border: 1px solid var(--stone-3); color: var(--text-muted); white-space: nowrap; }
    .lt-mobile-chip.timing { color: var(--swarna-gold); border-color: rgba(212,175,55,0.3); }
    .lt-mobile-chip.delay-late { color: var(--sindoor-red); border-color: rgba(227,66,52,0.3); font-weight: 700; }
    .lt-mobile-chip.delay-ok { color: #3CB371; border-color: rgba(60,179,113,0.3); font-weight: 700; }
    .lt-mobile-chip.plat { color: #60a5fa; border-color: rgba(96,165,250,0.3); }
    .lt-mobile-chip.halt { color: #a78bfa; border-color: rgba(167,139,250,0.3); }
    .lt-mobile-chip.dist { color: var(--text-muted); }

    .lt-hero-banner { min-height: 150px !important; padding: 1.5rem !important; }
    .lt-charts-grid { grid-template-columns: 1fr !important; }
  }

  @media (min-width: 600px) {
    .lt-filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; }
    .lt-filter-row .lt-field { flex: 1; min-width: 160px; }
    .lt-fetch-btn { width: auto; }
    .lt-table { display: table; }
    .lt-mobile-card-list { display: none; }
    .lt-table-wrap { overflow-x: auto; }
  }

  .lt-result-header-row { flex-wrap: wrap; gap: 0.5rem; }
  .lt-result-panel { width: 100%; overflow: hidden; }
  .lt-card, .lt-card-inset, .lt-filter-panel { min-width: 0; overflow: hidden; width: 100%; }
  .lt-section-divider { overflow: hidden; }
  .lt-section-label { flex-shrink: 0; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const AUTO_REFRESH_INTERVAL = 30;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isLate(delay) {
  if (!delay || delay === "—" || delay === "-" || delay === "0min") return false;
  const match = delay.match(/(\d+)/);
  return match ? parseInt(match[1], 10) > 0 : false;
}

function extractDelayMinutes(delay) {
  if (!delay || delay === "—" || delay === "-") return 0;
  const match = delay.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// ─── Custom Tooltip for Charts ────────────────────────────────────────────────
const YugaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--stone-2)", border: "1px solid var(--kansa-bronze)",
      borderRadius: 10, padding: "0.6rem 1rem", boxShadow: "var(--shadow-outset)",
      fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-primary)"
    }}>
      <div style={{ color: "var(--kansa-light)", fontFamily: "var(--font-historic)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--swarna-gold)" }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── Delay Chart ─────────────────────────────────────────────────────────────
function DelayChart({ stations }) {
  const [chartType, setChartType] = useState("bar");

  const data = stations
    .map((st, idx) => ({
      name: st.station_name ? st.station_name.slice(0, 10) : `Stn ${idx + 1}`,
      delay: extractDelayMinutes(st.delay),
      index: idx + 1,
    }))
    .filter(d => d.delay > 0);

  if (data.length === 0) return null;

  const GOLD = "#D4AF37";
  const RED = "#E34234";
  const BRONZE = "#CD7F32";

  const chartTypes = [
    { id: "bar", label: "Bar Chart" },
    { id: "line", label: "Line Chart" },
  ];

  return (
    <div className="lt-card p-5 lt-animate-in" style={{ animationDelay: "0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>⏱️</span>
          <span className="lt-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>Delay Distribution</span>
          <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-historic)", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>({data.length} delayed stops)</span>
        </div>
        <div className="lt-graph-selector">
          <span className="lt-graph-selector-label">View as:</span>
          {chartTypes.map(ct => (
            <label key={ct.id} className={`lt-graph-checkbox ${chartType === ct.id ? "active" : ""}`}>
              <input
                type="checkbox"
                checked={chartType === ct.id}
                onChange={() => setChartType(ct.id)}
              />
              {ct.label}
            </label>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        {chartType === "bar" ? (
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-body)" }} angle={-40} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
            <Tooltip content={<YugaTooltip />} />
            <Bar dataKey="delay" name="Delay (min)" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.delay > 30 ? RED : d.delay > 10 ? BRONZE : GOLD} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-body)" }} angle={-40} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
            <Tooltip content={<YugaTooltip />} />
            <Line type="monotone" dataKey="delay" name="Delay (min)" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD, r: 3 }} activeDot={{ r: 5, fill: RED }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── On-Time vs Delayed Chart ─────────────────────────────────────────────────
function PunctualityChart({ summary }) {
  const [chartType, setChartType] = useState("bar");

  if (!summary?.total_stations) return null;

  const onTime = summary.on_time_stations ?? 0;
  const delayed = summary.delayed_stations ?? 0;

  const data = [
    { name: "On Time", value: onTime, color: "#3CB371" },
    { name: "Delayed", value: delayed, color: "#E34234" },
  ];

  const radarData = [
    { subject: "On Time", A: onTime },
    { subject: "Delayed", A: delayed },
    { subject: "Total", A: summary.total_stations },
  ];

  const chartTypes = [
    { id: "bar", label: "Bar Chart" },
    { id: "radar", label: "Radar" },
  ];

  return (
    <div className="lt-card p-5 lt-animate-in" style={{ animationDelay: "0.4s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <span className="lt-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>Punctuality Breakdown</span>
        </div>
        <div className="lt-graph-selector">
          <span className="lt-graph-selector-label">View as:</span>
          {chartTypes.map(ct => (
            <label key={ct.id} className={`lt-graph-checkbox ${chartType === ct.id ? "active" : ""}`}>
              <input
                type="checkbox"
                checked={chartType === ct.id}
                onChange={() => setChartType(ct.id)}
              />
              {ct.label}
            </label>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        {chartType === "bar" ? (
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
            <Tooltip content={<YugaTooltip />} />
            <Bar dataKey="value" name="Stations" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        ) : (
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--stone-3)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }} />
            <Radar name="Stations" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
            <Tooltip content={<YugaTooltip />} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── LiveStatCard ─────────────────────────────────────────────────────────────
function LiveStatCard({ label, value, colorClass, topClass }) {
  return (
    <div className={`lt-stat-tile ${topClass ?? ""}`}>
      <div className={`lt-stat-val ${colorClass ?? ""}`}>{value ?? "—"}</div>
      <div className="lt-stat-label">{label}</div>
    </div>
  );
}

// ─── StatusGlowCard ──────────────────────────────────────────────────────────
function StatusGlowCard({ status, updatedTime }) {
  return (
    <div className="lt-status-card">
      <div className="lt-status-orb" />
      <div className="lt-status-card-label">
        <div className="lt-live-dot" />
        Current Running Status
      </div>
      <div className="lt-status-card-value">{status || "—"}</div>
      {updatedTime && (
        <div className="lt-status-card-updated">
          <span>🕐</span>
          <span>{updatedTime}</span>
        </div>
      )}
    </div>
  );
}

// ─── AutoRefreshBar ──────────────────────────────────────────────────────────
function AutoRefreshBar({ countdown, total }) {
  const pct = Math.max(0, Math.min(100, ((total - countdown) / total) * 100));
  return (
    <div className="lt-auto-bar-wrap">
      <div className="lt-auto-bar-label">
        <span>Auto-refresh</span>
        <span>{countdown}s</span>
      </div>
      <div className="lt-auto-bar-track">
        <div className="lt-auto-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── StationsTable ───────────────────────────────────────────────────────────
function StationsTable({ stations, currentStatus }) {
  const currentStationName = (() => {
    if (!currentStatus) return null;
    const m = currentStatus.match(/(?:Crossed|At|Arriving at|Departed from|Passing through)\s+(.+?)\s+at/i);
    return m ? m[1].trim().toLowerCase() : null;
  })();

  return (
    <div className="lt-table-wrap">
      {/* Desktop Table */}
      <table className="lt-table">
        <thead>
          <tr>
            <th>#</th><th>Station</th><th>Distance</th>
            <th>Timing</th><th>Delay</th><th>Platform</th><th>Halt</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((st, idx) => {
            const late = isLate(st.delay);
            const isCurrent = currentStationName &&
              st.station_name?.toLowerCase().includes(currentStationName);
            return (
              <tr key={idx} className={isCurrent ? "lt-row-current" : ""}>
                <td className="lt-delay-none">{idx + 1}</td>
                <td className="lt-td-name">{st.station_name || "—"}</td>
                <td>{st.distance || "—"}</td>
                <td className="lt-td-timing">
                    {st.timing ? st.timing.slice(0, 5) : "—"}
                </td>
                <td className={
                  !st.delay || st.delay === "—" || st.delay === "-" ? "lt-delay-none" :
                    late ? "lt-delay-late" : "lt-delay-ok"
                }>{st.delay && st.delay !== "-" ? st.delay : "—"}</td>
                <td className="lt-td-plat">{st.platform || "—"}</td>
                <td className="lt-td-halt">{st.halt || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card List */}
      <div className="lt-mobile-card-list">
        {stations.map((st, idx) => {
          const late = isLate(st.delay);
          const isCurrent = currentStationName &&
            st.station_name?.toLowerCase().includes(currentStationName);
          const hasDelay = st.delay && st.delay !== "—" && st.delay !== "-";
          return (
            <div key={idx} className={`lt-mobile-station-card${isCurrent ? " is-current" : ""}`}>
              <div className="lt-mobile-stn-row1">
                <span className="lt-mobile-stn-name">{isCurrent ? "▶ " : ""}{st.station_name || "—"}</span>
                <span className="lt-mobile-stn-num">#{idx + 1}</span>
              </div>
              <div className="lt-mobile-stn-row2">
                {st.timing && (
                    <span className="lt-mobile-chip timing">
                    🕐 {st.timing.slice(0, 5)}
                    </span>
                )}
                {hasDelay && <span className={`lt-mobile-chip ${late ? "delay-late" : "delay-ok"}`}>⏱ {st.delay}</span>}
                {st.platform && <span className="lt-mobile-chip plat">🚉 Pf {st.platform}</span>}
                {st.halt && <span className="lt-mobile-chip halt">⏸ {st.halt}</span>}
                {st.distance && <span className="lt-mobile-chip dist">📍 {st.distance}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ResultPanel ─────────────────────────────────────────────────────────────
function ResultPanel({ state }) {
  const { status, data } = state;

  if (status === "idle") {
    return (
      <div className="lt-result-panel">
        <div className="lt-state">
          <span className="lt-state-icon">🚆</span>
          <div className="lt-state-msg">Enter a train number to begin tracking</div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="lt-result-panel">
        <div className="lt-loader">
          <div className="lt-spinner" />
          <span className="lt-loader-text">Fetching live train status…</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="lt-result-panel">
        <div className="lt-error-msg">⚠ {data?.error || "Request failed. Check train number and try again."}</div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const stations = data?.stations || [];

  return (
    <div className="lt-result-panel has-data">
      <div className="lt-card-animate" style={{ width: "100%" }}>

        {/* Header */}
        <div className="lt-result-header-row">
          <div className="lt-result-badge">🪔 Live Status</div>
          <div className="lt-result-meta">
            <span>🕐</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="lt-stat-grid">
          <LiveStatCard label="Train Name" value={summary.train_name || "—"} colorClass="text" topClass="gold-top" />
          <LiveStatCard label="Total Stations" value={String(summary.total_stations ?? "—")} colorClass="blue" topClass="blue-top" />
          <LiveStatCard label="On Time" value={String(summary.on_time_stations ?? "—")} colorClass="green" topClass="green-top" />
          <LiveStatCard label="Delayed" value={String(summary.delayed_stations ?? "—")} colorClass="red" topClass="red-top" />
          <LiveStatCard
            label="Delay Rate"
            value={summary.total_stations ? `${Math.round((summary.delayed_stations / summary.total_stations) * 100)}%` : "—"}
            colorClass={summary.total_stations && (summary.delayed_stations / summary.total_stations) > 0.4 ? "red" : "green"}
            topClass="purple-top"
          />
        </div>

        {/* Status Glow Card */}
        {summary.current_status && (
          <StatusGlowCard status={summary.current_status} updatedTime={summary.updated_time} />
        )}

        {/* Charts */}
        {stations.length > 0 && (
          <>
            <div className="lt-section-divider" style={{ marginTop: "1.5rem" }}>
              <div className="lt-section-label">📊 Visual Analytics</div>
              <div className="lt-section-line" />
            </div>
            <div className="lt-charts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <PunctualityChart summary={summary} />
              <DelayChart stations={stations} />
            </div>
          </>
        )}

        {/* Station Schedule Table */}
        {stations.length > 0 && (
          <>
            <div className="lt-section-divider">
              <div className="lt-section-label">🚉 Station Schedule · {stations.length} Stops</div>
              <div className="lt-section-line" />
            </div>
            <StationsTable stations={stations} currentStatus={summary.current_status} />
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "1.2rem", paddingTop: "0.75rem",
          borderTop: "1px solid var(--stone-3)",
          textAlign: "center",
          fontFamily: "var(--font-historic)", fontSize: "0.6rem",
          color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
        }}>
          <span className="lt-text-gold">♦</span>
          Yatra Marga Intelligence · Live Module
          <span className="lt-text-gold">♦</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveTrain() {
  const [trainNo, setTrainNo] = useState("");
  const [result, setResult] = useState({ status: "idle", data: null });
  const [isRefresh, setIsRefresh] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL);
  const [autoEnabled, setAutoEnabled] = useState(false);

  const lastTrainRef = useRef("");
  const countdownRef = useRef(null);
  const autoTimerRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const doFetch = useCallback(async (num, isBackground = false) => {
    if (!num?.trim()) return;
    if (!isBackground) {
      setResult({ status: "loading", data: null });
    }
    try {
      const res = await fetch(`${API_URI}/api/train/live?train_no=${encodeURIComponent(num.trim())}`, {
        credentials: "include",
      });
      const data = await res.json();
      setResult({ status: res.ok ? "success" : "error", data });
    } catch {
      setResult({ status: "error", data: { error: "Network error. Please try again." } });
    }
  }, []);

  const handleTrack = () => {
    if (!trainNo.trim()) return;
    lastTrainRef.current = trainNo.trim();
    doFetch(trainNo.trim());
    setAutoEnabled(true);
    resetCountdown();
  };

  const handleRefresh = () => {
    if (!lastTrainRef.current) return;
    setIsRefresh(true);
    doFetch(lastTrainRef.current, true).finally(() => setIsRefresh(false));
    resetCountdown();
  };

  // ── Countdown + auto-refresh ───────────────────────────────────────────────
  const resetCountdown = () => {
    setCountdown(AUTO_REFRESH_INTERVAL);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (lastTrainRef.current) {
            setIsRefresh(true);
            doFetch(lastTrainRef.current, true).finally(() => setIsRefresh(false));
          }
          return AUTO_REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const hasResult = result.status === "success";

  return (
    <Navbar>
      <style>{LIVETRAIN_CSS}</style>

      <div className="min-h-screen lt-page relative overflow-x-hidden pb-12">

        {/* ── Train Track Animation (from Dashboard) ── */}
        <div className="lt-train-track">
          <div className="lt-train-loop-container">
            <div className="lt-train-set">
              <div className="lt-bogie">🚂</div>
              <div className="lt-bogie">🚃</div>
              <div className="lt-bogie">🚃</div>
              <div className="lt-bogie">🚃</div>
            </div>
            <div className="lt-train-set">
              <div className="lt-bogie">🚂</div>
              <div className="lt-bogie">🚃</div>
              <div className="lt-bogie">🚃</div>
              <div className="lt-bogie">🚃</div>
            </div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--swarna-gold)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-5 rounded-full blur-[100px]" style={{ background: "var(--sindoor-red)" }} />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

          {/* ── HERO BANNER ── */}
          <div
            className="mb-8 lt-animate-in lt-hero-banner p-8 sm:p-12 flex flex-col justify-end min-h-[200px] relative overflow-hidden"
            style={{ animationDelay: "0s", background: "var(--stone-3)" }}
          >
            <img
              src="https://d1hjkbq40fs2x4.cloudfront.net/2020-02-17/files/water-reflection-photography-train_2011-03.jpg"
              alt="Live Train"
              loading="lazy"
              className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700"
              onLoad={e => { e.currentTarget.style.opacity = "0.5"; }}
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-2)] via-transparent to-transparent z-[1]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-3 bg-[var(--stone-1)]/80 backdrop-blur px-3 py-1 rounded-full border border-[var(--kansa-bronze)]">
                <span className="text-xs lt-font-historic lt-text-bronze">🛤️ Railway Intelligence · Live Module</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl lt-font-mythic lt-text-gold mb-2 drop-shadow-2xl">
                Live Train Intelligence
              </h1>
              <p className="text-sm sm:text-base font-mono lt-text-primary tracking-wide uppercase drop-shadow-md">
                Real-Time Tracking · Network Status
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4 sm:gap-6 p-4 lt-card-inset border-l-4 border-l-[var(--swarna-gold)]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="lt-live-dot" />
              <span className="lt-text-muted">Tracking <span className="font-bold lt-text-primary">Active</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--swarna-gold)", animation: "lt-glow-pulse 2s infinite" }} />
              <span className="lt-text-muted">Feed <span className="font-bold lt-text-primary">Live</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono ml-auto">
              <span className="lt-text-muted">{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              <span className="lt-text-bronze">•</span>
              <span className="lt-text-muted">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* ── FILTER / INPUT PANEL ── */}
          <div className="lt-section-divider">
            <div className="lt-section-label">⬡ Train Tracker</div>
            <div className="lt-section-line" />
          </div>

          <div className="lt-filter-panel lt-animate-in" style={{ animationDelay: "0.1s" }}>
            <div className="lt-filter-title">🚂 Live Train Filter</div>
            <div className="lt-filter-row" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div className="lt-field">
                <label>Train Number</label>
                <input
                  type="number"
                  placeholder="e.g. 11002"
                  value={trainNo}
                  onChange={e => setTrainNo(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleTrack()}
                />
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button
                  className="lt-fetch-btn"
                  onClick={handleTrack}
                  disabled={!trainNo.trim() || result.status === "loading"}
                  style={{ flex: "1 1 auto" }}
                >
                  {result.status === "loading" && !isRefresh ? "Tracking…" : "Track Train →"}
                </button>
                {hasResult && (
                  <button
                    className="lt-refresh-btn"
                    onClick={handleRefresh}
                    disabled={isRefresh}
                    title="Refresh now"
                  >
                    <span className={`lt-refresh-icon${isRefresh ? " spinning" : ""}`}>↻</span>
                    Refresh
                  </button>
                )}
              </div>
              {autoEnabled && hasResult && (
                <AutoRefreshBar countdown={countdown} total={AUTO_REFRESH_INTERVAL} />
              )}
            </div>
          </div>

          {/* ── RESULT PANEL ── */}
          <ResultPanel state={result} />

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-[var(--stone-3)] text-center lt-font-historic lt-text-muted space-y-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p className="lt-text-gold">▶ LIVE SYSTEMS OPERATIONAL</p>
          </div>

        </div>
      </div>
    </Navbar>
  );
}
