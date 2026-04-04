import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Navbar from "../../pages/Navbar"
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis,
  AreaChart, Area
} from "recharts"

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")

/* ─────────────────────────────────────────────
   TRAIN YUGA CSS (Mirrors LiveTrain Aesthetic)
───────────────────────────────────────────── */
const TRAIN_CSS = `
  /* ── Structural ── */
  .tr-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
  }

  /* ── Typography Utilities ── */
  .tr-font-mythic   { font-family: var(--font-mythic);   font-weight: 400; }
  .tr-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .tr-font-body     { font-family: var(--font-body); }

  .tr-text-primary { color: var(--text-primary); transition: color 0.4s ease; }
  .tr-text-muted   { color: var(--text-muted);   transition: color 0.4s ease; }
  .tr-text-gold    { color: var(--swarna-gold); }
  .tr-text-bronze  { color: var(--kansa-bronze); }
  .tr-text-red     { color: var(--sindoor-red); }
  .tr-text-green   { color: #3CB371; }
  .tr-text-blue    { color: #60a5fa; }
  .tr-text-purple  { color: #a78bfa; }

  /* ── Neumorphic Stone Cards ── */
  .tr-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .tr-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }
  .tr-card-inset {
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.4s ease;
  }

  /* ── Tabs ── */
  .tr-tabs-wrap {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .tr-tabs-wrap::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .tr-tabs-title {
    font-family: var(--font-historic);
    font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light); margin-bottom: 0.85rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .tr-tabs-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }
  .tr-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.45rem;
  }
  @media (min-width: 480px) { .tr-tabs { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 700px) { .tr-tabs { grid-template-columns: repeat(7, 1fr); } }

  .tr-tab {
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
  .tr-tab:hover { color: var(--kansa-light); border-color: var(--kansa-bronze); }
  .tr-tab.active {
    background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze));
    color: var(--stone-1);
    border-color: var(--swarna-gold);
    box-shadow: var(--diya-glow);
    font-weight: 800;
  }

  /* ── Filter / Search Panel ── */
  .tr-filter-panel {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .tr-filter-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), var(--swarna-gold), var(--kansa-bronze), transparent);
    box-shadow: 0 0 12px var(--kansa-glow);
  }
  .tr-filter-title {
    font-family: var(--font-historic);
    font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--kansa-light); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .tr-filter-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }
  .tr-filter-row { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
  @media (min-width: 600px) {
    .tr-filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; }
    .tr-filter-row .tr-field { flex: 1; min-width: 160px; }
    .tr-fetch-btn { width: auto; }
  }

  /* ── Input Fields ── */
  .tr-field { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
  .tr-field label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--text-muted);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .tr-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--swarna-gold);
    box-shadow: 0 0 7px var(--swarna-gold);
    flex-shrink: 0;
  }
  .tr-field input, .tr-field select {
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
  .tr-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23CD7F32'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center;
    padding-right: 2.5rem; cursor: pointer;
  }
  [data-theme="light"] .tr-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23A65D1A'/%3E%3C/svg%3E");
  }
  .tr-field input::placeholder { color: var(--text-muted); opacity: 0.5; }
  .tr-field input:focus, .tr-field select:focus {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow);
  }
  .tr-field select option { background: var(--stone-2); color: var(--text-primary); }

  /* ── Buttons ── */
  .tr-fetch-btn {
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
  .tr-fetch-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s;
  }
  .tr-fetch-btn:hover { background: linear-gradient(145deg, var(--swarna-gold), var(--kansa-light)); box-shadow: var(--diya-glow); transform: translateY(-2px); }
  .tr-fetch-btn:hover::after { left: 160%; }
  .tr-fetch-btn:active { transform: translateY(1px); box-shadow: var(--shadow-inset); }
  .tr-fetch-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  @media (min-width: 600px) { .tr-fetch-btn { width: auto; } }

  /* ── Error / State ── */
  .tr-error-msg {
    background: rgba(227,66,52,0.08);
    border: 1px solid rgba(227,66,52,0.35);
    border-radius: 12px; padding: 0.85rem 1.1rem;
    color: var(--sindoor-red);
    font-family: var(--font-historic);
    font-size: 0.75rem; letter-spacing: 0.07em;
    display: flex; align-items: center; gap: 0.6rem; margin-top: 0.75rem;
  }

  .tr-state {
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    opacity: 0.5; padding: 3rem 0;
  }
  .tr-state-icon { font-size: 2.5rem; animation: tr-float 3s ease-in-out infinite; }
  .tr-state-msg {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase; text-align: center;
  }

  .tr-loader { display: flex; align-items: center; gap: 0.75rem; padding: 2rem 0; justify-content: center; }
  .tr-spinner {
    width: 32px; height: 32px; flex-shrink: 0;
    border: 3px solid var(--stone-3);
    border-top-color: var(--swarna-gold);
    border-right-color: var(--kansa-bronze);
    border-radius: 50%;
    animation: tr-chakra-spin 1.2s linear infinite;
  }
  .tr-loader-text {
    font-family: var(--font-historic);
    font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase;
    animation: tr-float 1.5s ease-in-out infinite;
  }

  /* ── Section Divider ── */
  .tr-section-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.5rem 0 1rem;
  }
  .tr-section-label {
    font-family: var(--font-historic);
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--kansa-light); white-space: nowrap;
  }
  .tr-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--kansa-bronze), transparent);
  }

  /* ── Stat Tiles ── */
  .tr-stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem; margin-bottom: 1.2rem;
  }
  @media (min-width: 480px) { .tr-stat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .tr-stat-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 900px) { .tr-stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .tr-stat-tile {
    padding: 1rem;
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    cursor: default;
  }
  .tr-stat-tile::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .tr-stat-tile.gold-top::before   { background: linear-gradient(90deg, transparent, var(--swarna-gold), transparent); }
  .tr-stat-tile.green-top::before  { background: linear-gradient(90deg, transparent, #3CB371, transparent); }
  .tr-stat-tile.red-top::before    { background: linear-gradient(90deg, transparent, var(--sindoor-red), transparent); }
  .tr-stat-tile.blue-top::before   { background: linear-gradient(90deg, transparent, #60a5fa, transparent); }
  .tr-stat-tile.purple-top::before { background: linear-gradient(90deg, transparent, #a78bfa, transparent); }
  .tr-stat-tile.bronze-top::before { background: linear-gradient(90deg, transparent, var(--kansa-bronze), transparent); }

  .tr-stat-label {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.35rem;
  }
  .tr-stat-val {
    font-family: var(--font-mythic);
    font-size: 1.35rem; line-height: 1; color: var(--text-primary); word-break: break-word;
  }
  .tr-stat-val.gold   { color: var(--swarna-gold); }
  .tr-stat-val.green  { color: #3CB371; }
  .tr-stat-val.red    { color: var(--sindoor-red); }
  .tr-stat-val.blue   { color: #60a5fa; }
  .tr-stat-val.purple { color: #a78bfa; }
  .tr-stat-val.bronze { color: var(--kansa-bronze); }
  .tr-stat-val.text   { font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; }

  /* ── Train Card Grid ── */
  .tr-cards-grid {
    display: grid; grid-template-columns: 1fr; gap: 0.85rem;
  }
  @media (min-width: 600px) { .tr-cards-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .tr-cards-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Individual Train Card ── */
  .tr-train-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px; padding: 1.2rem;
    position: relative; overflow: hidden;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    animation: tr-card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .tr-train-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(205,127,50,0.5), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .tr-train-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }
  .tr-train-card:hover::before { opacity: 1; }
  .tr-train-card:active { transform: scale(0.98); }

  .tr-card-rail {
    position: absolute; left: 0; top: 18%; bottom: 18%; width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(to bottom, var(--kansa-bronze), var(--swarna-gold));
    box-shadow: 0 0 10px var(--kansa-glow); opacity: 0; transition: opacity 0.25s;
  }
  .tr-train-card:hover .tr-card-rail { opacity: 1; }

  .tr-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; gap: 0.5rem; }
  .tr-card-no {
    font-family: var(--font-historic);
    font-size: 0.65rem; letter-spacing: 0.1em;
    color: var(--kansa-light); background: rgba(205,127,50,0.1);
    border: 1px solid rgba(205,127,50,0.25); padding: 0.28rem 0.7rem; border-radius: 7px;
    flex-shrink: 0;
  }
  .tr-cat-badge {
    font-family: var(--font-historic);
    font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; border-radius: 7px; white-space: nowrap; flex-shrink: 0;
    border: 1px solid transparent;
  }
  .tr-cat-badge.rajdhani  { background: rgba(212,175,55,0.12); color: var(--swarna-gold); border-color: rgba(212,175,55,0.25); }
  .tr-cat-badge.superfast { background: rgba(212,175,55,0.12); color: var(--swarna-gold); border-color: rgba(212,175,55,0.25); }
  .tr-cat-badge.express   { background: rgba(60,179,113,0.09);  color: #3CB371;           border-color: rgba(60,179,113,0.22); }
  .tr-cat-badge.mail      { background: rgba(205,127,50,0.09);  color: var(--kansa-light);border-color: rgba(205,127,50,0.22); }
  .tr-cat-badge.passenger { background: rgba(255,255,255,0.04); color: var(--text-muted); border-color: var(--stone-3); }
  .tr-cat-badge.default   { background: rgba(255,255,255,0.04); color: var(--text-muted); border-color: var(--stone-3); }

  .tr-card-name {
    font-family: var(--font-mythic);
    font-size: 1.45rem; color: var(--text-primary); line-height: 1.1;
    margin-bottom: 0.25rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .tr-card-zone {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
  }

  .tr-card-route {
    display: flex; align-items: center; gap: 0.6rem;
    margin: 0.75rem 0; padding: 0.8rem;
    background: var(--stone-1); border-radius: 10px;
    border: 1px solid var(--stone-3); box-shadow: var(--shadow-inset);
    min-width: 0;
  }
  .tr-route-city { flex: 1; min-width: 0; }
  .tr-route-city-name {
    font-family: var(--font-body); font-size: 1rem; font-weight: 700;
    color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tr-route-city-label {
    font-family: var(--font-historic);
    font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase;
  }
  .tr-route-mid { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
  .tr-route-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--kansa-bronze); box-shadow: 0 0 8px var(--kansa-glow); }
  .tr-route-line { width: 28px; height: 2px; background: linear-gradient(90deg, var(--kansa-bronze), var(--swarna-gold)); border-radius: 99px; opacity: 0.5; }

  .tr-meta-row { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.6rem; }
  .tr-meta-chip {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-family: var(--font-historic);
    font-size: 0.58rem; letter-spacing: 0.08em;
    color: var(--text-muted);
    background: var(--stone-1); border: 1px solid var(--stone-3);
    padding: 0.25rem 0.6rem; border-radius: 7px; white-space: nowrap;
  }

  .tr-rating-bar { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.75rem; }
  .tr-rating-track { flex: 1; height: 4px; background: var(--stone-3); border-radius: 99px; overflow: hidden; }
  .tr-rating-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--kansa-bronze), var(--swarna-gold));
  }
  .tr-rating-label {
    font-family: var(--font-mythic);
    font-size: 1.1rem; color: var(--swarna-gold); flex-shrink: 0;
  }

  /* ── Compare Cards ── */
  .tr-compare-grid {
    display: grid; grid-template-columns: 1fr; gap: 1rem;
  }
  @media (min-width: 900px) {
    .tr-compare-grid { grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: start; }
    .tr-compare-vs { flex-direction: column; }
    .tr-compare-vs-line { width: 1px !important; height: 36px !important; }
  }
  .tr-compare-vs {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 0;
  }
  .tr-compare-vs-label {
    font-family: var(--font-mythic);
    font-size: 2rem; color: var(--kansa-bronze); opacity: 0.6; letter-spacing: 0.1em;
  }
  .tr-compare-vs-line { background: var(--stone-3); height: 1px; width: 36px; }

  .tr-compare-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px; padding: 1.3rem;
    position: relative; overflow: hidden;
    animation: tr-card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .tr-compare-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), transparent);
  }
  .tr-compare-table { width: 100%; border-collapse: collapse; }
  .tr-compare-table tr { border-bottom: 1px solid var(--stone-3); }
  .tr-compare-table tr:last-child { border-bottom: none; }
  .tr-compare-table td { padding: 0.6rem 0; vertical-align: top; font-family: var(--font-body); }
  .tr-compare-table td:first-child {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); width: 42%; padding-right: 0.6rem;
  }
  .tr-compare-table td:last-child { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }

  /* ── Single Train Card ── */
  .tr-single-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px; padding: 1.5rem;
    position: relative; overflow: hidden; cursor: pointer;
    animation: tr-card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    -webkit-tap-highlight-color: transparent;
  }
  .tr-single-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--swarna-gold), var(--kansa-bronze), var(--swarna-gold), transparent);
    box-shadow: 0 0 16px var(--kansa-glow);
  }
  .tr-single-name {
    font-family: var(--font-mythic);
    font-size: clamp(1.6rem, 5vw, 2.8rem); line-height: 1.1;
    color: var(--text-primary); margin-bottom: 0.3rem;
  }

  .tr-info-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-top: 1.2rem;
  }
  @media (min-width: 480px) { .tr-info-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .tr-info-grid { grid-template-columns: repeat(4, 1fr); } }

  .tr-info-tile {
    background: var(--stone-1); border: 1px solid var(--stone-2);
    box-shadow: var(--shadow-inset); border-radius: 10px; padding: 0.85rem; min-width: 0;
  }
  .tr-info-tile-label {
    font-family: var(--font-historic);
    font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.3rem;
  }
  .tr-info-tile-val {
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
    color: var(--text-primary); word-break: break-word; line-height: 1.2;
  }
  .tr-info-tile-val.gold  { color: var(--swarna-gold); }
  .tr-info-tile-val.green { color: #3CB371; }
  .tr-info-tile-val.blue  { color: #60a5fa; }
  .tr-info-tile-val.red   { color: var(--sindoor-red); }

  /* ── Stops Chips ── */
  .tr-stops-list { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.85rem; }
  .tr-stop-chip {
    font-family: var(--font-historic);
    font-size: 0.6rem; letter-spacing: 0.08em;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    color: var(--text-muted); padding: 0.28rem 0.65rem; border-radius: 6px;
  }
  .tr-stop-chip.first, .tr-stop-chip.last {
    border-color: rgba(212,175,55,0.28); color: var(--swarna-gold);
    background: rgba(212,175,55,0.1); font-weight: 700;
  }

  /* ── Route Map Card ── */
  .tr-route-map-card {
    background: var(--stone-2); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset); border-radius: 14px; padding: 1.1rem;
    position: relative; overflow: hidden; cursor: pointer;
    animation: tr-card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .tr-route-map-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), transparent);
  }
  .tr-route-map-card:hover { border-color: var(--kansa-bronze); transform: translateY(-2px); box-shadow: var(--shadow-outset), var(--diya-glow); }

  /* ── Filter Client Bar ── */
  .tr-filter-bar { display: flex; gap: 0.6rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
  .tr-filter-input {
    flex: 1; min-width: 180px;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset); border-radius: 10px; color: var(--text-primary);
    font-family: var(--font-body); font-size: 1rem; font-weight: 600;
    padding: 0.7rem 1rem; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tr-filter-input::placeholder { color: var(--text-muted); opacity: 0.5; }
  .tr-filter-input:focus { border-color: var(--kansa-bronze); box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow); }
  .tr-filter-clear {
    background: rgba(227,66,52,0.08); border: 1px solid rgba(227,66,52,0.25);
    border-radius: 10px; color: var(--sindoor-red);
    font-family: var(--font-historic); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    padding: 0.7rem 0.9rem; cursor: pointer; white-space: nowrap; transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  /* ── Pagination ── */
  .tr-pagination { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.8rem; flex-wrap: wrap; }
  .tr-page-btn {
    min-width: 40px; height: 40px; padding: 0 0.6rem;
    background: var(--stone-2); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 10px; color: var(--text-muted);
    font-family: var(--font-historic); font-size: 0.65rem; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .tr-page-btn:hover  { border-color: var(--kansa-bronze); color: var(--kansa-light); }
  .tr-page-btn.active { background: linear-gradient(145deg, var(--kansa-light), var(--kansa-bronze)); color: var(--stone-1); border-color: var(--swarna-gold); box-shadow: var(--diya-glow); }
  .tr-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .tr-page-info { font-family: var(--font-historic); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; padding: 0 0.4rem; }

  /* ── Modal ── */
  .tr-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(8,8,10,0.88);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex; align-items: flex-end; justify-content: center;
    animation: tr-overlay-in 0.22s ease both;
    padding: 0;
  }
  @media (min-width: 700px) {
    .tr-modal-backdrop { align-items: center; padding: 1.5rem; }
  }
  .tr-modal {
    background: var(--stone-2); border: 1px solid var(--stone-3);
    border-radius: 24px 24px 0 0;
    width: 100%; max-width: 900px; max-height: 92vh;
    overflow-y: auto; overflow-x: hidden;
    position: relative;
    animation: tr-modal-in 0.32s cubic-bezier(0.22,1,0.36,1) both;
    scrollbar-width: thin; scrollbar-color: var(--kansa-bronze) transparent;
    box-shadow: 0 -20px 60px rgba(0,0,0,0.5);
  }
  @media (min-width: 700px) { .tr-modal { border-radius: 24px; max-height: 90vh; } }
  .tr-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze) 30%, var(--swarna-gold) 70%, transparent);
    box-shadow: 0 0 24px var(--kansa-glow);
  }
  .tr-modal-handle {
    position: absolute; top: 0.6rem; left: 50%; transform: translateX(-50%);
    width: 36px; height: 4px;
    background: var(--stone-3); border-radius: 99px;
  }
  @media (min-width: 700px) { .tr-modal-handle { display: none; } }
  .tr-modal-header {
    position: sticky; top: 0; z-index: 10;
    background: var(--stone-2); border-bottom: 1px solid var(--stone-3);
    padding: 1.3rem 1.4rem 1.1rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  }
  .tr-modal-title-block { display: flex; flex-direction: column; gap: 0.3rem; padding-top: 0.4rem; min-width: 0; }
  .tr-modal-eyebrow {
    font-family: var(--font-historic); font-size: 0.65rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--kansa-light);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .tr-modal-eyebrow::before { content: ''; display: inline-block; width: 12px; height: 1px; background: var(--kansa-bronze); }
  .tr-modal-name {
    font-family: var(--font-mythic);
    font-size: clamp(1.6rem, 6vw, 2.8rem); line-height: 1;
    color: var(--text-primary);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .tr-modal-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem; }
  .tr-modal-close {
    background: var(--stone-1); border: 1px solid var(--stone-3);
    border-radius: 12px; color: var(--text-muted); font-size: 1.3rem;
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; margin-top: 0.4rem;
    transition: background 0.2s, color 0.2s; box-shadow: var(--shadow-outset);
    -webkit-tap-highlight-color: transparent;
  }
  .tr-modal-close:hover { background: rgba(227,66,52,0.12); color: var(--sindoor-red); border-color: rgba(227,66,52,0.3); }
  .tr-modal-body { padding: 1.4rem; }
  .tr-modal-route {
    background: var(--stone-1); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset); border-radius: 14px; padding: 1.1rem;
    display: flex; align-items: center; gap: 0.8rem;
    margin-bottom: 1.4rem; min-width: 0; overflow: hidden;
  }
  .tr-modal-route-city { flex: 1; min-width: 0; }
  .tr-modal-route-name {
    font-family: var(--font-mythic);
    font-size: clamp(1.2rem, 4vw, 1.8rem); color: var(--text-primary);
    line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tr-modal-route-label {
    font-family: var(--font-historic); font-size: 0.58rem; color: var(--text-muted);
    letter-spacing: 0.18em; text-transform: uppercase; margin-top: 0.2rem;
  }
  .tr-modal-route-mid { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
  .tr-modal-route-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--kansa-bronze); box-shadow: 0 0 10px var(--kansa-glow); }
  .tr-modal-route-line { width: 36px; height: 2px; background: linear-gradient(90deg, var(--kansa-bronze), var(--swarna-gold)); border-radius: 99px; opacity: 0.55; }
  .tr-modal-section-label {
    font-family: var(--font-historic); font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.28em; text-transform: uppercase; color: var(--kansa-light);
    margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.55rem;
  }
  .tr-modal-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--kansa-bronze), transparent); }
  .tr-modal-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem; margin-bottom: 1.4rem;
  }
  @media (min-width: 480px) { .tr-modal-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .tr-modal-stats { grid-template-columns: repeat(4, 1fr); } }
  .tr-modal-stat {
    background: var(--stone-1); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-inset); border-radius: 12px; padding: 0.9rem; min-width: 0;
    transition: border-color 0.2s;
  }
  .tr-modal-stat:hover { border-color: var(--kansa-bronze); }
  .tr-modal-stat-label {
    font-family: var(--font-historic); font-size: 0.58rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;
  }
  .tr-modal-stat-val {
    font-family: var(--font-mythic);
    font-size: clamp(1.2rem, 3.5vw, 1.7rem); line-height: 1; color: var(--text-primary); word-break: break-word;
  }
  .tr-modal-stat-val.gold   { color: var(--swarna-gold); }
  .tr-modal-stat-val.green  { color: #3CB371; }
  .tr-modal-stat-val.blue   { color: #60a5fa; }
  .tr-modal-stat-val.red    { color: var(--sindoor-red); }
  .tr-modal-stat-val.bronze { color: var(--kansa-bronze); }
  .tr-modal-stops-wrap { margin-bottom: 1.4rem; }
  .tr-modal-stop {
    font-family: var(--font-historic); font-size: 0.62rem; letter-spacing: 0.06em;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    color: var(--text-muted); padding: 0.3rem 0.7rem; border-radius: 6px;
    display: inline-block; margin: 0.2rem;
  }
  .tr-modal-stop.first, .tr-modal-stop.last {
    border-color: rgba(212,175,55,0.3); color: var(--swarna-gold);
    background: rgba(212,175,55,0.1); font-weight: 700;
  }
  .tr-modal-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 2rem; gap: 1.4rem;
  }
  .tr-modal-spinner {
    width: 50px; height: 50px;
    border: 3px solid var(--stone-3);
    border-top-color: var(--swarna-gold); border-right-color: var(--kansa-bronze);
    border-radius: 50%; animation: tr-chakra-spin 1s linear infinite;
  }
  .tr-modal-loading-text {
    font-family: var(--font-historic); font-size: 0.7rem; color: var(--text-muted);
    letter-spacing: 0.22em; text-transform: uppercase; animation: tr-float 1.5s ease-in-out infinite;
  }

  /* ── Graph Selector ── */
  .tr-graph-selector {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
  }
  .tr-graph-selector-label {
    font-family: var(--font-historic); font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-muted); white-space: nowrap;
  }
  .tr-graph-checkbox {
    display: flex; align-items: center; gap: 0.4rem;
    cursor: pointer; font-family: var(--font-body); font-size: 0.8rem; color: var(--text-muted);
    transition: color 0.2s; user-select: none;
    padding: 0.3rem 0.7rem; border-radius: 8px;
    border: 1px solid var(--stone-3); background: var(--stone-1);
    box-shadow: var(--shadow-outset);
  }
  .tr-graph-checkbox:hover { color: var(--kansa-light); border-color: var(--kansa-bronze); }
  .tr-graph-checkbox input[type="checkbox"] { accent-color: var(--swarna-gold); width: 14px; height: 14px; cursor: pointer; }
  .tr-graph-checkbox.active { color: var(--swarna-gold); border-color: var(--swarna-gold); background: rgba(212,175,55,0.08); }

  /* ── Hero Banner ── */
  .tr-hero-banner {
    position: relative; border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-outset); border: 1px solid var(--kansa-bronze);
  }
  .tr-hero-banner img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.5;
    mix-blend-mode: overlay; transition: opacity 0.5s ease;
  }
  [data-theme="light"] .tr-hero-banner img { opacity: 0.3; mix-blend-mode: multiply; }

  /* ── Train Track (same as LiveTrain) ── */
  .tr-train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
  }
  .tr-train-loop-container {
    display: flex; position: absolute; width: 200vw; left: 0;
    animation: tr-train-rtl 15s linear infinite;
  }
  .tr-train-set {
    display: flex; width: 100vw; justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .tr-bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }

  /* ── Live Dot ── */
  .tr-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3CB371; position: relative; flex-shrink: 0;
  }
  .tr-live-dot::after {
    content: ''; position: absolute; inset: -2px; border-radius: 50%;
    background: #3CB371; opacity: 0.4;
    animation: tr-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  /* ── Ticker Summary ── */
  .tr-ticker {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem;
    margin-top: 1.4rem; width: 100%;
  }
  @media (min-width: 480px) { .tr-ticker { grid-template-columns: repeat(4, 1fr); } }
  .tr-ticker-card {
    background: var(--stone-2); border: 1px solid var(--stone-3);
    border-radius: 14px; padding: 0.9rem 0.8rem;
    text-align: center; position: relative; overflow: hidden; min-width: 0;
    box-shadow: var(--shadow-outset);
  }
  .tr-ticker-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--kansa-bronze), transparent);
  }
  .tr-ticker-val { font-family: var(--font-mythic); font-size: clamp(2rem, 7vw, 3.2rem); color: var(--swarna-gold); line-height: 1; display: block; }
  .tr-ticker-label { font-family: var(--font-historic); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 0.2rem; }

  /* ── Results Header ── */
  .tr-results-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.1rem; padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--stone-3);
  }
  .tr-results-label {
    font-family: var(--font-historic); font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);
    display: flex; align-items: center; gap: 0.55rem;
  }
  .tr-results-label::before { content: ''; width: 12px; height: 2px; background: var(--kansa-bronze); border-radius: 99px; }
  .tr-results-count {
    font-family: var(--font-mythic); font-size: 1.1rem; color: var(--swarna-gold);
    background: rgba(212,175,55,0.1); padding: 0.2rem 1rem;
    border-radius: 99px; border: 1px solid rgba(212,175,55,0.22);
  }

  /* ── Animations ── */
  @keyframes tr-chakra-spin  { to { transform: rotate(360deg); } }
  @keyframes tr-float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes tr-ping         { 75%,100%{transform:scale(2);opacity:0} }
  @keyframes tr-card-in      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tr-fade-up      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tr-overlay-in   { from{opacity:0} to{opacity:1} }
  @keyframes tr-modal-in     { from{opacity:0;transform:translateY(30px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes tr-train-rtl    { 0%{transform:translateX(0)} 100%{transform:translateX(-100vw)} }

  .tr-animate-in { animation: tr-fade-up 0.6s cubic-bezier(0.25,1,0.5,1) both; }

  /* ── Responsive ── */
  *, *::before, *::after { box-sizing: border-box; }
  .tr-page { overflow-x: hidden; width: 100%; }
  .tr-card, .tr-card-inset, .tr-filter-panel, .tr-tabs-wrap { min-width: 0; overflow: hidden; width: 100%; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`

// ─── Constants ────────────────────────────────────────────────────────────────
const MODES = [
  { id: "number",    label: "By Number",  icon: "🔢" },
  { id: "name",      label: "By Name",    icon: "📛" },
  { id: "zone",      label: "By Zone",    icon: "🗺️" },
  { id: "category",  label: "By Category",icon: "🏷️" },
  { id: "routetype", label: "Route Type", icon: "🛤️" },
  { id: "compare",   label: "Compare",    icon: "⚖️" },
  { id: "routemap",  label: "Route Map",  icon: "📍" },
]

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
]

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
]

const ROUTE_TYPES = [
  'Delta', 'River Valley', 'Sea Coast', 'Mountain', 'Plateau',
  'Desert', 'Coastal', 'Island', 'Plain', 'Forest',
]

const PAGE_SIZE = 24

// ─── Helpers ─────────────────────────────────────────────────────────────────
function catClass(cat = "") {
  const c = cat.toLowerCase()
  if (c.includes("rajdhani") || c.includes("shatabdi") || c.includes("duronto") || c.includes("vande")) return "rajdhani"
  if (c.includes("superfast")) return "superfast"
  if (c.includes("express"))   return "express"
  if (c.includes("mail"))      return "mail"
  if (c.includes("passenger")) return "passenger"
  return "default"
}

function parseStops(stops) {
  if (!stops) return []
  if (Array.isArray(stops)) return stops
  return String(stops).split("|").map(s => s.trim()).filter(Boolean)
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const YugaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "var(--stone-2)", border: "1px solid var(--kansa-bronze)",
      borderRadius: 10, padding: "0.6rem 1rem", boxShadow: "var(--shadow-outset)",
      fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-primary)"
    }}>
      <div style={{ color: "var(--kansa-light)", fontFamily: "var(--font-historic)", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--swarna-gold)" }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ─── Analytics Charts ─────────────────────────────────────────────────────────
function TrainAnalyticsCharts({ trains }) {
  const [activeChart, setActiveChart] = useState("speed")

  if (!trains || trains.length === 0) return null

  const GOLD = "#D4AF37"
  const BRONZE = "#CD7F32"
  const RED = "#E34234"
  const GREEN = "#3CB371"
  const BLUE = "#60a5fa"
  const PURPLE = "#a78bfa"

  // Speed distribution
  const speedData = trains
    .filter(t => t.AverageSpeed_kmph != null)
    .slice(0, 20)
    .map(t => ({ name: (t.TrainName || "").slice(0, 10), speed: t.AverageSpeed_kmph }))
    .sort((a, b) => b.speed - a.speed)
    .slice(0, 15)

  // Rating distribution
  const ratingBuckets = [0, 0, 0, 0, 0]
  trains.forEach(t => {
    if (t.Rating != null) {
      const idx = Math.min(4, Math.floor(t.Rating))
      ratingBuckets[idx]++
    }
  })
  const ratingData = ratingBuckets.map((count, i) => ({
    name: `${i + 1}★`, count
  }))

  // Distance distribution
  const distData = trains
    .filter(t => t.Distance_km != null)
    .slice(0, 20)
    .map(t => ({ name: (t.TrainName || "").slice(0, 10), dist: t.Distance_km }))
    .sort((a, b) => b.dist - a.dist)
    .slice(0, 15)

  // Punctuality area chart
  const punctData = trains
    .filter(t => t.PunctualityScore != null)
    .slice(0, 20)
    .map((t, i) => ({ name: (t.TrainName || `T${i + 1}`).slice(0, 8), score: t.PunctualityScore }))

  // Category breakdown
  const catMap = {}
  trains.forEach(t => {
    const c = t.TrainCategory || "Unknown"
    catMap[c] = (catMap[c] || 0) + 1
  })
  const catData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name: name.replace(/\(.*\)/, "").trim().slice(0, 14), count }))

  // Occupancy scatter
  const occupData = trains
    .filter(t => t.OccupancyPercentage != null && t.PunctualityScore != null)
    .slice(0, 50)
    .map(t => ({ x: t.OccupancyPercentage, y: t.PunctualityScore, z: t.Rating || 3 }))

  const charts = [
    { id: "speed",   label: "Speed"       },
    { id: "rating",  label: "Ratings"     },
    { id: "dist",    label: "Distance"    },
    { id: "punct",   label: "Punctuality" },
    { id: "cat",     label: "Categories"  },
    { id: "scatter", label: "Occupancy"   },
  ]

  const renderChart = () => {
    switch (activeChart) {
      case "speed":
        if (speedData.length === 0) return <div className="tr-state" style={{ padding: "1.5rem 0", opacity: 0.5 }}><span>No speed data available</span></div>
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={speedData} margin={{ top: 4, right: 8, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <Tooltip content={<YugaTooltip />} />
              <Bar dataKey="speed" name="Avg Speed (km/h)" radius={[4, 4, 0, 0]}>
                {speedData.map((d, i) => (
                  <Cell key={i} fill={d.speed > 100 ? GOLD : d.speed > 70 ? BRONZE : GREEN} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "rating":
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={ratingData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <Tooltip content={<YugaTooltip />} />
              <Bar dataKey="count" name="Trains" radius={[6, 6, 0, 0]}>
                {ratingData.map((d, i) => (
                  <Cell key={i} fill={[RED, BRONZE, GOLD, GREEN, BLUE][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "dist":
        if (distData.length === 0) return <div className="tr-state" style={{ padding: "1.5rem 0", opacity: 0.5 }}><span>No distance data</span></div>
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={distData} margin={{ top: 4, right: 8, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <Tooltip content={<YugaTooltip />} />
              <Bar dataKey="dist" name="Distance (km)" radius={[4, 4, 0, 0]}>
                {distData.map((d, i) => (
                  <Cell key={i} fill={d.dist > 2000 ? GOLD : d.dist > 800 ? BRONZE : BLUE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "punct":
        if (punctData.length === 0) return <div className="tr-state" style={{ padding: "1.5rem 0", opacity: 0.5 }}><span>No punctuality data</span></div>
        return (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={punctData} margin={{ top: 4, right: 8, left: -20, bottom: 50 }}>
              <defs>
                <linearGradient id="punctGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} domain={[0, 100]} />
              <Tooltip content={<YugaTooltip />} />
              <Area type="monotone" dataKey="score" name="Punctuality" stroke={GREEN} fill="url(#punctGrad)" strokeWidth={2} dot={{ fill: GREEN, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "cat":
        if (catData.length === 0) return <div className="tr-state" style={{ padding: "1.5rem 0", opacity: 0.5 }}><span>No category data</span></div>
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={catData} layout="vertical" margin={{ top: 4, right: 16, left: 80, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "var(--text-muted)", fontSize: 9 }} width={80} />
              <Tooltip content={<YugaTooltip />} />
              <Bar dataKey="count" name="Trains" radius={[0, 4, 4, 0]}>
                {catData.map((d, i) => (
                  <Cell key={i} fill={[GOLD, BRONZE, GREEN, BLUE, PURPLE, RED, "#f97316", "#ec4899"][i % 8]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "scatter":
        if (occupData.length === 0) return <div className="tr-state" style={{ padding: "1.5rem 0", opacity: 0.5 }}><span>No occupancy data</span></div>
        return (
          <ResponsiveContainer width="100%" height={230}>
            <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
              <XAxis dataKey="x" name="Occupancy %" tick={{ fill: "var(--text-muted)", fontSize: 9 }} label={{ value: "Occupancy %", position: "insideBottom", offset: -2, fill: "var(--text-muted)", fontSize: 9 }} />
              <YAxis dataKey="y" name="Punctuality" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <ZAxis dataKey="z" range={[20, 100]} />
              <Tooltip content={<YugaTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={occupData} fill={GOLD} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        )
      default: return null
    }
  }

  const chartLabels = {
    speed:   "Average Speed Distribution (km/h)",
    rating:  "Star Rating Breakdown",
    dist:    "Distance Ranking (km)",
    punct:   "Punctuality Scores",
    cat:     "Trains by Category",
    scatter: "Occupancy vs Punctuality",
  }

  return (
    <div className="tr-card p-5 tr-animate-in" style={{ animationDelay: "0.3s" }}>
      {/* Chart Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📊</span>
          <span className="tr-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>
            {chartLabels[activeChart]}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-historic)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          {trains.length} trains analysed
        </span>
      </div>

      {/* Chart Type Selector */}
      <div className="tr-graph-selector">
        <span className="tr-graph-selector-label">View:</span>
        {charts.map(c => (
          <label key={c.id} className={`tr-graph-checkbox${activeChart === c.id ? " active" : ""}`}>
            <input type="checkbox" checked={activeChart === c.id} onChange={() => setActiveChart(c.id)} />
            {c.label}
          </label>
        ))}
      </div>

      {renderChart()}
    </div>
  )
}

// ─── Single Train Analytics ───────────────────────────────────────────────────
function SingleTrainRadar({ train }) {
  const [chartType, setChartType] = useState("radar")
  if (!train) return null

  const data = [
    { subject: "Punctuality", A: train.PunctualityScore ?? 0 },
    { subject: "Rating",      A: ((train.Rating ?? 0) / 5) * 100 },
    { subject: "Occupancy",   A: train.OccupancyPercentage ?? 0 },
    { subject: "Maintenance", A: train.MaintenanceScore ?? 0 },
    { subject: "Speed",       A: Math.min(100, ((train.AverageSpeed_kmph ?? 0) / 160) * 100) },
  ].filter(d => d.A > 0)

  const barData = [
    { name: "Punctuality", val: train.PunctualityScore ?? 0,                                  color: "#3CB371" },
    { name: "Rating",      val: ((train.Rating ?? 0) / 5) * 100,                              color: "#D4AF37" },
    { name: "Occupancy",   val: train.OccupancyPercentage ?? 0,                               color: "#60a5fa" },
    { name: "Maintenance", val: train.MaintenanceScore ?? 0,                                  color: "#CD7F32" },
    { name: "Speed Index", val: Math.min(100, ((train.AverageSpeed_kmph ?? 0) / 160) * 100),  color: "#a78bfa" },
  ].filter(d => d.val > 0)

  if (data.length === 0) return null

  return (
    <div className="tr-card p-5 tr-animate-in" style={{ animationDelay: "0.35s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <span className="tr-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>Performance Overview</span>
        </div>
        <div className="tr-graph-selector" style={{ marginBottom: 0 }}>
          <span className="tr-graph-selector-label">View as:</span>
          {[{ id: "radar", label: "Radar" }, { id: "bar", label: "Bar" }].map(ct => (
            <label key={ct.id} className={`tr-graph-checkbox${chartType === ct.id ? " active" : ""}`}>
              <input type="checkbox" checked={chartType === ct.id} onChange={() => setChartType(ct.id)} />
              {ct.label}
            </label>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        {chartType === "radar" ? (
          <RadarChart data={data}>
            <PolarGrid stroke="var(--stone-3)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)" }} />
            <Radar name="Score" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
            <Tooltip content={<YugaTooltip />} />
          </RadarChart>
        ) : (
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--stone-3)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-body)" }} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} domain={[0, 100]} />
            <Tooltip content={<YugaTooltip />} />
            <Bar dataKey="val" name="Score" radius={[4, 4, 0, 0]}>
              {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// ─── Compare Analytics ────────────────────────────────────────────────────────
function CompareAnalyticsChart({ train1, train2 }) {
  if (!train1 || !train2) return null

  const metrics = [
    { key: "AverageSpeed_kmph",   label: "Avg Speed",    factor: 1 },
    { key: "Distance_km",         label: "Distance",     factor: 0.1 },
    { key: "PunctualityScore",    label: "Punctuality",  factor: 1 },
    { key: "OccupancyPercentage", label: "Occupancy",    factor: 1 },
    { key: "MaintenanceScore",    label: "Maintenance",  factor: 1 },
    { key: "Rating",              label: "Rating",       factor: 20 },
  ]

  const data = metrics
    .filter(m => train1[m.key] != null || train2[m.key] != null)
    .map(m => ({
      name: m.label,
      [train1.TrainName?.slice(0, 10) || "Train A"]: Math.min(100, (train1[m.key] ?? 0) * m.factor),
      [train2.TrainName?.slice(0, 10) || "Train B"]: Math.min(100, (train2[m.key] ?? 0) * m.factor),
    }))

  if (data.length === 0) return null

  const t1Name = train1.TrainName?.slice(0, 10) || "Train A"
  const t2Name = train2.TrainName?.slice(0, 10) || "Train B"

  return (
    <div className="tr-card p-5 tr-animate-in" style={{ animationDelay: "0.3s", marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--stone-3)" }}>
        <span style={{ fontSize: "1.2rem" }}>⚖️</span>
        <span className="tr-font-historic" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>Comparison Analytics</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--stone-3)" />
          <PolarAngleAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
          <Radar name={t1Name} dataKey={t1Name} stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
          <Radar name={t2Name} dataKey={t2Name} stroke="#60a5fa"  fill="#60a5fa"  fillOpacity={0.2} />
          <Tooltip content={<YugaTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "0.75rem" }}>
        {[{ name: t1Name, color: "#D4AF37" }, { name: t2Name, color: "#60a5fa" }].map(l => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-historic)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block", flexShrink: 0 }} />
            {l.name}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Train Detail Modal ───────────────────────────────────────────────────────
function TrainDetailModal({ trainNo, onClose }) {
  const [status, setStatus] = useState("loading")
  const [train, setTrain]   = useState(null)
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    if (!trainNo) return
    setStatus("loading")
    fetch(`${API_URI}/api/train/number?number=${encodeURIComponent(trainNo)}`, { credentials: "include" })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error || "Not found")
        setTrain(d); setStatus("success")
      })
      .catch(e => { setErrMsg(e.message || "Failed to load"); setStatus("error") })
  }, [trainNo])

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  const stops = train ? parseStops(train.stops) : []

  const stats = train ? [
    { label: "Train No",       val: train.TrainNo,                                                                      color: "gold"   },
    { label: "Distance",       val: train.Distance_km         != null ? `${train.Distance_km} km`          : null                      },
    { label: "Travel Time",    val: train.TravelTime_hr       != null ? `${train.TravelTime_hr} hrs`       : null                      },
    { label: "Avg Speed",      val: train.AverageSpeed_kmph   != null ? `${train.AverageSpeed_kmph} km/h`  : null                      },
    { label: "Coaches",        val: train.CoachCount                                                                                    },
    { label: "AC %",           val: train.ACPercentageCoaches != null ? `${train.ACPercentageCoaches}%`    : null                      },
    { label: "Occupancy",      val: train.OccupancyPercentage != null ? `${train.OccupancyPercentage}%`    : null                      },
    { label: "Punctuality",    val: train.PunctualityScore    != null ? `${train.PunctualityScore}/100`    : null, color: "green"       },
    { label: "Delay Prob",     val: train.DelayProbability    != null ? `${(train.DelayProbability*100).toFixed(1)}%` : null, color:"red"},
    { label: "Rating",         val: train.Rating              != null ? `★ ${train.Rating.toFixed(1)}`    : null, color: "gold"        },
    { label: "Fare Range",     val: train.ApproxFareRange_INR                                                                          },
    { label: "Revenue",        val: train.Revenue_INR         != null ? `₹${(train.Revenue_INR/1e5).toFixed(1)}L` : null, color:"blue" },
    { label: "Maintenance",    val: train.MaintenanceScore    != null ? `${train.MaintenanceScore}/100`    : null                      },
    { label: "Peak ×",         val: train.PeakSeasonMultiplier                                                                         },
    { label: "Year",           val: train.YearIntroduced                                                                               },
    { label: "Electrified",    val: train.ElectrifiedRoute                                                                             },
    { label: "Days Running",   val: train.DaysRunning                                                                                  },
    { label: "Route Type",     val: train.RouteType                                                                                    },
    { label: "Avg Stops",      val: train.AvgStops                                                                                     },
    { label: "Remarks",        val: train.Remarks                                                                                      },
  ].filter(s => s.val != null && s.val !== "") : []

  return (
    <div className="tr-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="tr-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="tr-modal-header">
          <div className="tr-modal-handle" />
          <div className="tr-modal-title-block">
            <div className="tr-modal-eyebrow">Train Detail</div>
            {status === "success" && train ? (
              <>
                <div className="tr-modal-name">{train.TrainName || "Unknown Train"}</div>
                <div className="tr-modal-badges">
                  <span className="tr-card-no">#{train.TrainNo}</span>
                  {train.TrainCategory && <span className={`tr-cat-badge ${catClass(train.TrainCategory)}`}>{train.TrainCategory}</span>}
                  {train.RailwayZone && (
                    <span style={{ fontFamily: "var(--font-historic)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "center" }}>
                      ⬡ {train.RailwayZone}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="tr-modal-name" style={{ color: "var(--text-muted)" }}>#{trainNo}</div>
            )}
          </div>
          <button className="tr-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="tr-modal-loading">
            <div className="tr-modal-spinner" />
            <div className="tr-modal-loading-text">Fetching train data…</div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="tr-error-msg" style={{ margin: "1.5rem" }}>⚠ {errMsg}</div>
        )}

        {/* Success body */}
        {status === "success" && train && (
          <div className="tr-modal-body">
            {/* Route hero */}
            {(train.StartingPoint || train.FinalDestination) && (
              <div className="tr-modal-route">
                <div className="tr-modal-route-city">
                  <div className="tr-modal-route-name">{train.StartingPoint || "—"}</div>
                  <div className="tr-modal-route-label">Origin</div>
                </div>
                <div className="tr-modal-route-mid">
                  <div className="tr-modal-route-dot" />
                  <div className="tr-modal-route-line" />
                  <div className="tr-modal-route-dot" />
                </div>
                <div className="tr-modal-route-city" style={{ textAlign: "right" }}>
                  <div className="tr-modal-route-name">{train.FinalDestination || "—"}</div>
                  <div className="tr-modal-route-label">Destination</div>
                </div>
              </div>
            )}

            {/* Performance Charts */}
            <SingleTrainRadar train={train} />

            {/* Stats */}
            <div className="tr-modal-section-label" style={{ marginTop: "1.4rem" }}>Performance &amp; Details</div>
            <div className="tr-modal-stats">
              {stats.map(s => (
                <div className="tr-modal-stat" key={s.label}>
                  <div className="tr-modal-stat-label">{s.label}</div>
                  <div className={`tr-modal-stat-val${s.color ? ` ${s.color}` : ""}`}>{String(s.val)}</div>
                </div>
              ))}
            </div>

            {/* Stops */}
            {stops.length > 0 && (
              <div className="tr-modal-stops-wrap">
                <div className="tr-modal-section-label">Route Stops ({stops.length})</div>
                <div>
                  {stops.map((s, i, arr) => (
                    <span key={i} className={`tr-modal-stop${i === 0 ? " first" : i === arr.length - 1 ? " last" : ""}`}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Train Card ───────────────────────────────────────────────────────────────
const TrainCard = React.memo(function TrainCard({ train: t, idx, onCardClick }) {
  return (
    <div
      className="tr-train-card"
      style={{ animationDelay: `${Math.min(idx, 8) * 0.055}s` }}
      onClick={() => onCardClick(t.TrainNo)}
    >
      <div className="tr-card-rail" />
      <div className="tr-card-top">
        <span className="tr-card-no">#{t.TrainNo || "—"}</span>
        {t.TrainCategory && <span className={`tr-cat-badge ${catClass(t.TrainCategory)}`}>{t.TrainCategory.replace(/\(.*\)/, "").trim()}</span>}
      </div>
      <div className="tr-card-name">{t.TrainName || "Unknown Train"}</div>
      {t.RailwayZone && <div className="tr-card-zone">⬡ {t.RailwayZone}</div>}

      {(t.StartingPoint || t.FinalDestination) && (
        <div className="tr-card-route">
          <div className="tr-route-city">
            <div className="tr-route-city-name">{t.StartingPoint || "—"}</div>
            <div className="tr-route-city-label">Origin</div>
          </div>
          <div className="tr-route-mid">
            <div className="tr-route-dot" />
            <div className="tr-route-line" />
            <div className="tr-route-dot" />
          </div>
          <div className="tr-route-city" style={{ textAlign: "right" }}>
            <div className="tr-route-city-name">{t.FinalDestination || "—"}</div>
            <div className="tr-route-city-label">Destination</div>
          </div>
        </div>
      )}

      <div className="tr-meta-row">
        {t.TravelTime_hr     != null && <span className="tr-meta-chip">⌛ {t.TravelTime_hr} hrs</span>}
        {t.Distance_km       != null && <span className="tr-meta-chip">📍 {t.Distance_km} km</span>}
        {t.AverageSpeed_kmph != null && <span className="tr-meta-chip">⚡ {t.AverageSpeed_kmph} km/h</span>}
        {t.DaysRunning               && <span className="tr-meta-chip">📅 {t.DaysRunning}</span>}
      </div>

      {t.Rating != null && (
        <div className="tr-rating-bar">
          <div className="tr-rating-track">
            <div className="tr-rating-fill" style={{ width: `${(t.Rating / 5) * 100}%` }} />
          </div>
          <span className="tr-rating-label">★ {t.Rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  )
})

// ─── Info Grid (single train) ─────────────────────────────────────────────────
function InfoGrid({ train }) {
  const fields = [
    { label: "Train No",          val: train.TrainNo },
    { label: "Category",          val: train.TrainCategory,          gold: true },
    { label: "Zone",              val: train.RailwayZone             },
    { label: "Origin",            val: train.StartingPoint           },
    { label: "Destination",       val: train.FinalDestination        },
    { label: "Distance",          val: train.Distance_km        != null ? `${train.Distance_km} km`          : null },
    { label: "Travel Time",       val: train.TravelTime_hr      != null ? `${train.TravelTime_hr} hrs`       : null },
    { label: "Avg Speed",         val: train.AverageSpeed_kmph  != null ? `${train.AverageSpeed_kmph} km/h`  : null },
    { label: "Days Running",      val: train.DaysRunning         },
    { label: "Route Type",        val: train.RouteType           },
    { label: "Coaches",           val: train.CoachCount          },
    { label: "AC Coaches %",      val: train.ACPercentageCoaches != null ? `${train.ACPercentageCoaches}%` : null },
    { label: "Avg Stops",         val: train.AvgStops            },
    { label: "Fare Range",        val: train.ApproxFareRange_INR },
    { label: "Occupancy",         val: train.OccupancyPercentage != null ? `${train.OccupancyPercentage}%` : null },
    { label: "Punctuality",       val: train.PunctualityScore    != null ? `${train.PunctualityScore}/100` : null, green: true },
    { label: "Delay Probability", val: train.DelayProbability    != null ? `${(train.DelayProbability*100).toFixed(1)}%` : null, red: true },
    { label: "Rating",            val: train.Rating              != null ? `★ ${train.Rating.toFixed(1)}/5` : null, gold: true },
    { label: "Electrified",       val: train.ElectrifiedRoute    },
    { label: "Year Introduced",   val: train.YearIntroduced      },
    { label: "Revenue",           val: train.Revenue_INR         != null ? `₹${train.Revenue_INR.toLocaleString("en-IN")}` : null, blue: true },
    { label: "Maintenance Score", val: train.MaintenanceScore    != null ? `${train.MaintenanceScore}/100` : null },
    { label: "Peak Multiplier",   val: train.PeakSeasonMultiplier },
    { label: "Journey Date",      val: train.JourneyDate          },
    { label: "Remarks",           val: train.Remarks              },
  ].filter(f => f.val != null && f.val !== "")

  return (
    <div className="tr-info-grid">
      {fields.map(f => (
        <div className="tr-info-tile" key={f.label}>
          <div className="tr-info-tile-label">{f.label}</div>
          <div className={`tr-info-tile-val${f.gold ? " gold" : f.green ? " green" : f.blue ? " blue" : f.red ? " red" : ""}`}>{String(f.val)}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Compare Card ─────────────────────────────────────────────────────────────
function CompareCard({ train, label }) {
  const rows = [
    { k: "Train No",    v: train.TrainNo },
    { k: "Zone",        v: train.RailwayZone },
    { k: "Category",    v: train.TrainCategory },
    { k: "From",        v: train.StartingPoint },
    { k: "To",          v: train.FinalDestination },
    { k: "Distance",    v: train.Distance_km       != null ? `${train.Distance_km} km`         : null },
    { k: "Travel Time", v: train.TravelTime_hr     != null ? `${train.TravelTime_hr} hrs`      : null },
    { k: "Avg Speed",   v: train.AverageSpeed_kmph != null ? `${train.AverageSpeed_kmph} km/h` : null },
    { k: "Route Type",  v: train.RouteType },
    { k: "Coaches",     v: train.CoachCount },
    { k: "Fare Range",  v: train.ApproxFareRange_INR },
    { k: "Occupancy",   v: train.OccupancyPercentage != null ? `${train.OccupancyPercentage}%` : null },
    { k: "Punctuality", v: train.PunctualityScore   != null ? `${train.PunctualityScore}/100`  : null },
    { k: "Rating",      v: train.Rating             != null ? `★ ${train.Rating.toFixed(1)}`  : null },
    { k: "Year",        v: train.YearIntroduced },
  ].filter(r => r.v != null && r.v !== "")

  return (
    <div className="tr-compare-card">
      <div style={{ marginBottom: "1rem" }}>
        <span className="tr-card-no" style={{ display: "inline-block", marginBottom: "0.5rem" }}>Train {label}</span>
        <div className="tr-font-mythic" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
          {train.TrainName || "—"}
        </div>
        {train.RailwayZone && <div className="tr-card-zone">⬡ {train.RailwayZone}</div>}
      </div>
      <table className="tr-compare-table">
        <tbody>
          {rows.map(r => (
            <tr key={r.k}>
              <td>{r.k}</td>
              <td>{String(r.v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Paginated Grid ───────────────────────────────────────────────────────────
function PaginatedGrid({ trains, onCardClick }) {
  const [page,   setPage]   = useState(0)
  const [filter, setFilter] = useState("")
  const filterRef = useRef(null)

  useEffect(() => { setPage(0) }, [trains, filter])

  const filtered = useMemo(() => {
    if (!filter.trim()) return trains
    const q = filter.trim().toLowerCase()
    return trains.filter(t =>
      (t.TrainName         && t.TrainName.toLowerCase().includes(q)) ||
      (t.TrainNo           && String(t.TrainNo).includes(q)) ||
      (t.StartingPoint     && t.StartingPoint.toLowerCase().includes(q)) ||
      (t.FinalDestination  && t.FinalDestination.toLowerCase().includes(q)) ||
      (t.RailwayZone       && t.RailwayZone.toLowerCase().includes(q))
    )
  }, [trains, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const pageTrains = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i)
    const around = new Set([0, totalPages - 1, safePage, safePage - 1, safePage + 1].filter(n => n >= 0 && n < totalPages))
    return Array.from(around).sort((a, b) => a - b)
  }, [totalPages, safePage])

  const goToPage = (p) => {
    setPage(p)
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Summary stats for graphs
  const hasData = trains.length > 1
  const avgSpeed = trains.filter(t => t.AverageSpeed_kmph != null).reduce((a, b) => a + b.AverageSpeed_kmph, 0) / (trains.filter(t => t.AverageSpeed_kmph != null).length || 1)
  const avgRating = trains.filter(t => t.Rating != null).reduce((a, b) => a + b.Rating, 0) / (trains.filter(t => t.Rating != null).length || 1)
  const avgPunct = trains.filter(t => t.PunctualityScore != null).reduce((a, b) => a + b.PunctualityScore, 0) / (trains.filter(t => t.PunctualityScore != null).length || 1)

  return (
    <>
      {/* Summary stat tiles */}
      {hasData && (
        <>
          <div className="tr-stat-grid tr-animate-in" style={{ animationDelay: "0.1s" }}>
            <div className="tr-stat-tile gold-top">
              <div className="tr-stat-val gold">{trains.length}</div>
              <div className="tr-stat-label">Total Trains</div>
            </div>
            <div className="tr-stat-tile blue-top">
              <div className="tr-stat-val blue">{isNaN(avgSpeed) ? "—" : avgSpeed.toFixed(0)}</div>
              <div className="tr-stat-label">Avg Speed</div>
            </div>
            <div className="tr-stat-tile green-top">
              <div className="tr-stat-val green">{isNaN(avgRating) ? "—" : avgRating.toFixed(1)}</div>
              <div className="tr-stat-label">Avg Rating</div>
            </div>
            <div className="tr-stat-tile purple-top">
              <div className="tr-stat-val purple">{isNaN(avgPunct) ? "—" : avgPunct.toFixed(0)}</div>
              <div className="tr-stat-label">Avg Punct.</div>
            </div>
            <div className="tr-stat-tile bronze-top">
              <div className="tr-stat-val bronze">{totalPages}</div>
              <div className="tr-stat-label">Pages</div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="tr-section-divider">
            <div className="tr-section-label">📊 Visual Analytics</div>
            <div className="tr-section-line" />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <TrainAnalyticsCharts trains={trains} />
          </div>
        </>
      )}

      {/* Filter bar */}
      <div className="tr-filter-bar" ref={filterRef}>
        <input
          className="tr-filter-input"
          placeholder="Filter by name, number, zone, city…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filter && <button className="tr-filter-clear" onClick={() => setFilter("")}>✕ Clear</button>}
      </div>

      {/* Count header */}
      <div className="tr-results-header" style={{ marginBottom: "0.85rem" }}>
        <span className="tr-results-label">{filter ? `${filtered.length} matches` : `${trains.length} trains`}</span>
        <span className="tr-results-count">Page {safePage + 1} / {totalPages}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="tr-state">
          <span className="tr-state-icon">🔍</span>
          <div className="tr-state-msg">No trains match "{filter}"</div>
        </div>
      ) : (
        <>
          <div className="tr-cards-grid">
            {pageTrains.map((t, i) => (
              <TrainCard key={`${t.TrainNo}-${i}`} train={t} idx={i} onCardClick={onCardClick} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="tr-pagination">
              <button className="tr-page-btn" onClick={() => goToPage(0)} disabled={safePage === 0}>«</button>
              <button className="tr-page-btn" onClick={() => goToPage(safePage - 1)} disabled={safePage === 0}>‹</button>
              {pageNums.map((n, idx) => {
                const prev = pageNums[idx - 1]
                return (
                  <React.Fragment key={n}>
                    {prev !== undefined && n - prev > 1 && <span className="tr-page-info">…</span>}
                    <button className={`tr-page-btn${n === safePage ? " active" : ""}`} onClick={() => goToPage(n)}>{n + 1}</button>
                  </React.Fragment>
                )
              })}
              <button className="tr-page-btn" onClick={() => goToPage(safePage + 1)} disabled={safePage >= totalPages - 1}>›</button>
              <button className="tr-page-btn" onClick={() => goToPage(totalPages - 1)} disabled={safePage >= totalPages - 1}>»</button>
            </div>
          )}
        </>
      )}
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Train() {
  const [mode,    setMode]    = useState("number")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [result,  setResult]  = useState(null)

  const [num,     setNum]     = useState("")
  const [name,    setName]    = useState("")
  const [zone,    setZone]    = useState(ZONES[0])
  const [cat,     setCat]     = useState(CATEGORIES[0])
  const [rtype,   setRtype]   = useState(ROUTE_TYPES[0])
  const [cmp1,    setCmp1]    = useState("")
  const [cmp2,    setCmp2]    = useState("")
  const [cmpMode, setCmpMode] = useState("number")
  const [mapName, setMapName] = useState("")

  const [modalTrainNo, setModalTrainNo] = useState(null)
  const openModal = useCallback((no) => setModalTrainNo(no), [])

  const reset      = () => { setResult(null); setError(null) }
  const switchMode = (m) => { setMode(m); reset() }

  const fetchData = useCallback(async (path) => {
    setLoading(true); setError(null); setResult(null)
    try {
      const res  = await fetch(`${API_URI}${path}`, { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setResult(data)
    } catch (e) {
      setError(e.message || "Could not reach the server")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = () => {
    setError(null)
    switch (mode) {
      case "number":
        if (!num.trim()) return setError("Train number is required")
        return fetchData(`/api/train/number?number=${encodeURIComponent(num.trim())}`)
      case "name":
        if (!name.trim()) return setError("Train name is required")
        return fetchData(`/api/train/name?name=${encodeURIComponent(name.trim())}`)
      case "zone":
        return fetchData(`/api/train/zone?zone=${encodeURIComponent(zone)}`)
      case "category":
        return fetchData(`/api/train/category?cat=${encodeURIComponent(cat)}`)
      case "routetype":
        return fetchData(`/api/train/Routetype?RType=${encodeURIComponent(rtype)}`)
      case "compare":
        if (!cmp1.trim() || !cmp2.trim()) return setError("Both train fields are required")
        return fetchData(
          cmpMode === "number"
            ? `/api/train/compare/bynumber?train1=${encodeURIComponent(cmp1.trim())}&train2=${encodeURIComponent(cmp2.trim())}`
            : `/api/train/compare/byname?train1=${encodeURIComponent(cmp1.trim())}&train2=${encodeURIComponent(cmp2.trim())}`
        )
      case "routemap":
        return fetchData(
          mapName.trim()
            ? `/api/train/routeMap?trainName=${encodeURIComponent(mapName.trim())}`
            : `/api/train/routeMap`
        )
      default: break
    }
  }

  const onKeyDown = (e) => { if (e.key === "Enter") handleSearch() }

  const renderFields = () => {
    switch (mode) {
      case "number":
        return (
          <div className="tr-field">
            <label>Train Number</label>
            <input type="number" placeholder="e.g. 77836" value={num}
              onChange={e => setNum(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      case "name":
        return (
          <div className="tr-field">
            <label>Train Name</label>
            <input type="text" placeholder="e.g. Madurai Intercity" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      case "zone":
        return (
          <div className="tr-field">
            <label>Railway Zone</label>
            <select value={zone} onChange={e => setZone(e.target.value)}>
              {ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
        )
      case "category":
        return (
          <div className="tr-field">
            <label>Train Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )
      case "routetype":
        return (
          <div className="tr-field">
            <label>Route Type</label>
            <select value={rtype} onChange={e => setRtype(e.target.value)}>
              {ROUTE_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        )
      case "compare":
        return (
          <>
            <div className="tr-field" style={{ maxWidth: 180 }}>
              <label>Compare By</label>
              <select value={cmpMode} onChange={e => setCmpMode(e.target.value)}>
                <option value="number">Number</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="tr-field">
              <label>Train A {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input placeholder={cmpMode === "number" ? "77836" : "Madurai Intercity"}
                value={cmp1} onChange={e => setCmp1(e.target.value)} onKeyDown={onKeyDown} />
            </div>
            <div className="tr-field">
              <label>Train B {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input placeholder={cmpMode === "number" ? "14331" : "Jaipur Rajdhani"}
                value={cmp2} onChange={e => setCmp2(e.target.value)} onKeyDown={onKeyDown} />
            </div>
          </>
        )
      case "routemap":
        return (
          <div className="tr-field">
            <label>Train Name <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input type="text" placeholder="Leave blank for all routes…" value={mapName}
              onChange={e => setMapName(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      default: return null
    }
  }

  const renderResult = () => {
    if (!result) return null

    // List result
    if (result.trains && Array.isArray(result.trains)) {
      if (result.trains.length === 0)
        return <div className="tr-state"><span className="tr-state-icon">🔍</span><div className="tr-state-msg">No trains found</div></div>
      return <PaginatedGrid trains={result.trains} onCardClick={openModal} />
    }

    // Compare result
    if (result.train1 && result.train2) {
      return (
        <>
          <div className="tr-results-header"><span className="tr-results-label">Comparison</span></div>
          <div className="tr-compare-grid">
            <CompareCard train={result.train1} label="A" />
            <div className="tr-compare-vs">
              <div className="tr-compare-vs-line" />
              <div className="tr-compare-vs-label">VS</div>
              <div className="tr-compare-vs-line" />
            </div>
            <CompareCard train={result.train2} label="B" />
          </div>
          <CompareAnalyticsChart train1={result.train1} train2={result.train2} />
        </>
      )
    }

    // Raw array (route map)
    if (Array.isArray(result)) {
      if (result.length === 0)
        return <div className="tr-state"><span className="tr-state-icon">🔍</span><div className="tr-state-msg">No results found</div></div>
      if (mode === "routemap") {
        const routeAsTrains = result.map(r => ({ ...r, TrainName: r.TrainName || "Route", _isRoute: true }))
        return <PaginatedGrid trains={routeAsTrains} onCardClick={(no) => no && openModal(no)} />
      }
      return <PaginatedGrid trains={result} onCardClick={openModal} />
    }

    // Single train
    return (
      <>
        <div className="tr-results-header"><span className="tr-results-label">Train Detail</span></div>
        <div className="tr-single-card" onClick={() => openModal(result.TrainNo)}>
          <div className="tr-card-top">
            <span className="tr-card-no">#{result.TrainNo || "—"}</span>
            {result.TrainCategory && <span className={`tr-cat-badge ${catClass(result.TrainCategory)}`}>{result.TrainCategory.replace(/\(.*\)/, "").trim()}</span>}
          </div>
          <div className="tr-single-name">{result.TrainName || "Unknown Train"}</div>
          {result.RailwayZone && <div className="tr-card-zone" style={{ marginTop: "0.25rem" }}>⬡ {result.RailwayZone}</div>}
          {result.stops && (
            <div className="tr-stops-list">
              {parseStops(result.stops).map((s, i, arr) => (
                <span key={i} className={`tr-stop-chip${i === 0 ? " first" : i === arr.length - 1 ? " last" : ""}`}>{s}</span>
              ))}
            </div>
          )}
          <InfoGrid train={result} />
        </div>
        {/* Single train chart */}
        <div style={{ marginTop: "1rem" }}>
          <SingleTrainRadar train={result} />
        </div>
      </>
    )
  }

  return (
    <Navbar>
      <style>{TRAIN_CSS}</style>

      <div className="min-h-screen tr-page relative overflow-x-hidden pb-12">

        {/* ── Train Track Animation ── */}
        <div className="tr-train-track">
          <div className="tr-train-loop-container">
            <div className="tr-train-set">
              <div className="tr-bogie">🚂</div>
              <div className="tr-bogie">🚃</div>
              <div className="tr-bogie">🚃</div>
              <div className="tr-bogie">🚃</div>
            </div>
            <div className="tr-train-set">
              <div className="tr-bogie">🚂</div>
              <div className="tr-bogie">🚃</div>
              <div className="tr-bogie">🚃</div>
              <div className="tr-bogie">🚃</div>
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
            className="mb-8 tr-animate-in tr-hero-banner p-8 sm:p-12 flex flex-col justify-end min-h-[200px] relative overflow-hidden"
            style={{ animationDelay: "0s", background: "var(--stone-3)" }}
          >
            <img
              src="https://media.cntraveler.com/photos/66e49c870735e7875d7b4c50/16%3A9/w_2560%2Cc_limit/Darjeeling_GettyImages-1396314780.jpg"
              alt="Train Explorer"
              loading="lazy"
              className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700"
              onLoad={e => { e.currentTarget.style.opacity = "0.5" }}
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-2)] via-transparent to-transparent z-[1]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-3 bg-[var(--stone-1)]/80 backdrop-blur px-3 py-1 rounded-full border border-[var(--kansa-bronze)]">
                <span className="text-xs tr-font-historic tr-text-bronze">🚂 Railway Intelligence · Explorer</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl tr-font-mythic tr-text-gold mb-2 drop-shadow-2xl">
                Train Explorer
              </h1>
              <p className="text-sm sm:text-base font-mono tr-text-primary tracking-wide uppercase drop-shadow-md">
                Search · Compare · Inspect · Discover
              </p>
            </div>

            {/* Ticker inside hero */}
            <div className="relative z-10 tr-ticker mt-4">
              {[
                { val: "10K+", label: "Trains"     },
                { val: "7",    label: "Modes"      },
                { val: "18+",  label: "Zones"      },
                { val: "18+",   label: "Categories" },
              ].map(t => (
                <div key={t.label} className="tr-ticker-card">
                  <span className="tr-ticker-val">{t.val}</span>
                  <div className="tr-ticker-label">{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6 p-4 tr-card-inset border-l-4 border-l-[var(--swarna-gold)]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="tr-live-dot" />
              <span className="tr-text-muted">Database <span className="font-bold tr-text-primary">Connected</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--swarna-gold)" }} />
              <span className="tr-text-muted">Index <span className="font-bold tr-text-primary">Active</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono ml-auto">
              <span className="tr-text-muted">{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              <span className="tr-text-bronze">•</span>
              <span className="tr-text-muted">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="tr-section-divider">
            <div className="tr-section-label">⬡ Search Mode</div>
            <div className="tr-section-line" />
          </div>

          <div className="tr-tabs-wrap tr-animate-in" style={{ animationDelay: "0.05s" }}>
            <div className="tr-tabs-title">🛤️ Explorer Mode</div>
            <div className="tr-tabs">
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`tr-tab${mode === m.id ? " active" : ""}`}
                  onClick={() => switchMode(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── SEARCH PANEL ── */}
          <div className="tr-filter-panel tr-animate-in" style={{ animationDelay: "0.1s" }}>
            <div className="tr-filter-title">🔍 Train Filter</div>
            <div className="tr-filter-row">
              {renderFields()}
              <button
                className="tr-fetch-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching…" : "Search →"}
              </button>
            </div>
            {error && <div className="tr-error-msg">⚠ {error}</div>}
          </div>

          {/* ── RESULTS ── */}
          {loading ? (
            <div style={{ background: "var(--stone-2)", border: "1px solid var(--stone-3)", borderRadius: 16, padding: "1.5rem", boxShadow: "var(--shadow-outset)" }}>
              <div className="tr-loader">
                <div className="tr-spinner" />
                <span className="tr-loader-text">Fetching train data…</span>
              </div>
            </div>
          ) : result ? (
            <div className="tr-animate-in" style={{ animationDelay: "0.15s" }}>
              {renderResult()}
            </div>
          ) : !error ? (
            <div style={{ background: "var(--stone-2)", border: "1px solid var(--stone-3)", borderRadius: 16, padding: "1.5rem", boxShadow: "var(--shadow-outset)" }}>
              <div className="tr-state">
                <span className="tr-state-icon">🚂</span>
                <div className="tr-state-msg">Select a mode and search</div>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-[var(--stone-3)] text-center tr-font-historic tr-text-muted space-y-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p className="tr-text-gold">▶ EXPLORER MODULE OPERATIONAL</p>
          </div>

        </div>
      </div>

      {/* Modal */}
      {modalTrainNo && (
        <TrainDetailModal trainNo={modalTrainNo} onClose={() => setModalTrainNo(null)} />
      )}

    </Navbar>
  )
}