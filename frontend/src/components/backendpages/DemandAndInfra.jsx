import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../../pages/Navbar';

/* ─────────────────────────────────────────────
   YUGA DEMAND & INFRA CSS (Matches Dashboard Aesthetic)
───────────────────────────────────────────── */
const DEMAND_CSS = `
  /* ── Structural ── */
  .di-page {
    background: var(--stone-1);
    color: var(--text-primary);
    transition: background 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.6s ease;
  }

  /* ── Typography Utilities ── */
  .di-font-mythic   { font-family: var(--font-mythic); font-weight: 400; }
  .di-font-historic { font-family: var(--font-historic); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .di-font-body     { font-family: var(--font-body); }

  .di-text-primary { color: var(--text-primary); transition: color 0.4s ease; }
  .di-text-muted   { color: var(--text-muted);   transition: color 0.4s ease; }
  .di-text-gold    { color: var(--swarna-gold); }
  .di-text-bronze  { color: var(--kansa-bronze); }
  .di-text-red     { color: var(--sindoor-red); }
  .di-text-green   { color: #3CB371; }

  /* ── Neumorphic Stone Cards ── */
  .di-card {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .di-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-outset), var(--diya-glow);
    border-color: var(--kansa-bronze);
  }

  .di-card-inset {
    background: var(--stone-1);
    box-shadow: var(--shadow-inset);
    border: 1px solid var(--stone-2);
    border-radius: 12px;
    transition: all 0.4s ease;
  }

  .di-card-danger {
    background: linear-gradient(145deg, var(--stone-2), rgba(227,66,52,0.05));
    border: 1px solid rgba(227,66,52,0.3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .di-card-danger:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: var(--shadow-outset), 0 0 25px rgba(227,66,52,0.25);
    border-color: var(--sindoor-red);
  }

  /* ── Badges ── */
  .di-badge-gold    { background: rgba(212,175,55,0.1); color: var(--swarna-gold); border: 1px solid var(--swarna-gold); }
  .di-badge-bronze  { background: rgba(205,127,50,0.1); color: var(--kansa-bronze); border: 1px solid var(--kansa-bronze); }
  .di-badge-red     { background: rgba(227,66,52,0.1); color: var(--sindoor-red); border: 1px solid var(--sindoor-red); }
  .di-badge-neutral { background: var(--stone-3); color: var(--text-muted); border: 1px solid var(--text-muted); }
  .di-badge-green   { background: rgba(61,184,122,0.1); color: #3CB371; border: 1px solid rgba(61,184,122,0.4); }
  .di-badge-amber   { background: rgba(212,136,58,0.1); color: var(--kansa-light); border: 1px solid rgba(212,136,58,0.4); }

  /* ── Progress Tracks ── */
  .di-track { background: var(--stone-3); box-shadow: var(--shadow-inset); border-radius: 999px; overflow: hidden; }
  .di-bar-gold   { background: linear-gradient(90deg, var(--kansa-light), var(--swarna-gold)); }
  .di-bar-bronze { background: linear-gradient(90deg, var(--kansa-bronze), var(--kansa-light)); }
  .di-bar-red    { background: linear-gradient(90deg, var(--sindoor-red), #ff6b6b); }
  .di-bar-green  { background: linear-gradient(90deg, #2E8B57, #3CB371); }
  .di-bar-amber  { background: linear-gradient(90deg, var(--kansa-bronze), var(--kansa-light)); }

  /* ── Tabs ── */
  .di-tab-bar {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    margin-bottom: 2rem; padding-bottom: 1rem;
    border-bottom: 2px solid var(--stone-3);
  }
  .di-tab-btn {
    font-family: var(--font-historic); font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.65rem 1.2rem; border-radius: 10px;
    border: 1px solid transparent; background: transparent;
    color: var(--text-muted); cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    min-height: 44px;
  }
  .di-tab-btn:hover {
    color: var(--kansa-light); background: var(--stone-1);
    box-shadow: var(--shadow-inset); border-color: var(--stone-3);
  }
  .di-tab-btn.active {
    color: var(--stone-1);
    background: linear-gradient(135deg, var(--swarna-gold), var(--kansa-bronze));
    box-shadow: var(--diya-glow); border: none;
  }

  /* ── Section Label ── */
  .di-slabel {
    font-family: var(--font-historic); font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .di-slabel::before {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: var(--swarna-gold); box-shadow: 0 0 10px var(--kansa-glow);
    flex-shrink: 0; animation: diya-dot-pulse 2s ease infinite;
  }
  @keyframes diya-dot-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  /* ── Search / Input Panel ── */
  .di-search-panel {
    background: var(--stone-2);
    border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    border-radius: 16px; padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .di-search-panel:focus-within {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-outset), var(--diya-glow);
  }

  .di-input-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  .di-input, .di-select {
    flex: 1; min-width: 0;
    background: var(--stone-1); border: 1px solid var(--stone-3);
    border-radius: 10px; padding: 0.8rem 1.1rem;
    font-family: var(--font-body); font-size: 0.95rem;
    color: var(--text-primary); outline: none; min-height: 48px;
    transition: border-color 0.25s, box-shadow 0.25s;
    box-shadow: var(--shadow-inset);
    appearance: none; -webkit-appearance: none; cursor: pointer;
  }
  .di-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%23CD7F32' d='M5 7L0 0h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center;
    padding-right: 2.5rem;
  }
  .di-input:focus, .di-select:focus {
    border-color: var(--kansa-bronze);
    box-shadow: var(--shadow-inset), 0 0 0 3px var(--kansa-glow);
  }
  .di-input::placeholder { color: var(--text-muted); }
  .di-select option { background: var(--stone-2); color: var(--text-primary); }

  /* ── Buttons ── */
  .di-btn {
    background: linear-gradient(135deg, var(--swarna-gold), var(--kansa-bronze));
    color: var(--stone-1); font-family: var(--font-historic);
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.15em;
    text-transform: uppercase; border: none; border-radius: 10px;
    padding: 0.8rem 1.5rem; cursor: pointer; min-height: 48px;
    position: relative; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: var(--shadow-outset); white-space: nowrap; flex-shrink: 0;
  }
  .di-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.45s ease;
  }
  .di-btn:hover::before { left: 160%; }
  .di-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-outset), var(--diya-glow); }
  .di-btn:active { transform: scale(0.97); box-shadow: var(--shadow-inset); }
  .di-btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }

  .di-btn-sm {
    font-size: 0.65rem; padding: 0.5rem 1rem; min-height: 36px; border-radius: 8px;
  }

  /* ── Table ── */
  .di-table-wrap {
    overflow-x: auto; border-radius: 12px;
    -webkit-overflow-scrolling: touch;
  }
  .di-table {
    width: 100%; border-collapse: collapse; font-size: 0.82rem; min-width: 420px;
  }
  .di-table th {
    font-family: var(--font-historic); font-size: 0.6rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted);
    padding: 0.8rem; text-align: left; border-bottom: 1px solid var(--stone-3);
    white-space: nowrap;
  }
  .di-table td {
    padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.03);
    color: var(--text-muted); line-height: 1.5; font-size: 0.82rem;
    max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .di-table tr:last-child td { border-bottom: none; }
  .di-table tr { transition: background 0.15s; }
  .di-table tr:hover td { background: var(--stone-3); color: var(--text-primary); }
  .di-table-mono { font-family: var(--font-historic); font-size: 0.7rem; color: var(--text-muted); }

  /* ── Mode Sub-Tabs ── */
  .di-mode-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .di-mode-tab {
    font-family: var(--font-historic); font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.5rem 1rem; border-radius: 8px;
    border: 1px solid var(--stone-3); background: var(--stone-1);
    color: var(--text-muted); cursor: pointer;
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: var(--shadow-inset);
  }
  .di-mode-tab.active {
    color: var(--swarna-gold); border-color: var(--swarna-gold);
    background: rgba(212,175,55,0.08);
    box-shadow: 0 0 12px var(--kansa-glow);
  }

  /* ── Stat Grid ── */
  .di-stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
  }
  @media (min-width: 560px) { .di-stat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 900px) { .di-stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .di-stat-card {
    padding: 1.2rem; border-radius: 14px;
    background: var(--stone-2); border: 1px solid var(--stone-3);
    box-shadow: var(--shadow-outset);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: fade-slide-up 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
    overflow: hidden; position: relative;
  }
  .di-stat-card:hover { transform: translateY(-4px); border-color: var(--kansa-bronze); box-shadow: var(--shadow-outset), var(--diya-glow); }
  .di-stat-label { font-family: var(--font-historic); font-size: 0.62rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
  .di-stat-value { font-family: var(--font-mythic); font-size: clamp(2rem, 4vw, 3.5rem); color: var(--swarna-gold); line-height: 1; }
  .di-stat-value.green { color: #3CB371; }
  .di-stat-value.red   { color: var(--sindoor-red); }
  .di-stat-value.amber { color: var(--kansa-light); }

  /* ── Two Col ── */
  .di-two-col { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
  @media (min-width: 700px) { .di-two-col { grid-template-columns: 1fr 1fr; } }

  /* ── Range Grid ── */
  .di-range-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  @media (min-width: 560px) { .di-range-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 900px) { .di-range-grid { grid-template-columns: repeat(4, 1fr); } }

  .di-range-item {
    background: var(--stone-1); border: 1px solid var(--stone-2);
    border-radius: 12px; padding: 1rem 1.1rem;
    box-shadow: var(--shadow-inset);
    transition: border-color 0.25s, transform 0.25s;
  }
  .di-range-item:hover { border-color: var(--kansa-bronze); transform: translateY(-2px); }
  .ri-name { font-family: var(--font-historic); font-size: 0.62rem; color: var(--text-muted); margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.1em; text-transform: uppercase; }
  .ri-val  { font-family: var(--font-mythic); font-size: 1.8rem; color: var(--swarna-gold); line-height: 1; }

  /* ── Pagination ── */
  .di-pagination { display: flex; gap: 0.6rem; margin-top: 1.2rem; flex-wrap: wrap; align-items: center; }
  .di-page-info { font-family: var(--font-historic); font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.1em; }

  /* ── Loader ── */
  .di-loader {
    display: flex; flex-direction: column;
    align-items: center; gap: 2rem; padding: 5rem 1rem;
  }
  .di-spinner { position: relative; width: 64px; height: 64px; }
  .di-spin-outer {
    position: absolute; inset: 0; border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--swarna-gold); border-right-color: var(--kansa-light);
    animation: chakra-spin 1s linear infinite;
  }
  .di-spin-inner {
    position: absolute; inset: 10px; border-radius: 50%;
    border: 2px solid rgba(212,175,55,0.2);
    border-bottom-color: var(--kansa-bronze);
    animation: chakra-spin 0.75s linear infinite reverse;
  }
  @keyframes chakra-spin { to { transform: rotate(360deg); } }

  .di-loader-txt {
    font-family: var(--font-historic); font-size: 0.78rem;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted);
  }

  /* ── Empty / Error ── */
  .di-empty {
    text-align: center; padding: 4rem 1rem;
    font-family: var(--font-historic); font-size: 0.8rem;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted);
  }
  .di-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

  .di-error {
    background: rgba(227,66,52,0.07);
    border: 1px solid rgba(227,66,52,0.3);
    border-radius: 12px; padding: 1rem 1.4rem;
    font-family: var(--font-body); font-size: 0.85rem;
    color: var(--sindoor-red); letter-spacing: 0.08em;
    margin-bottom: 1.25rem;
  }

  /* ── Divider ── */
  .di-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 2rem 0 1.75rem;
    font-family: var(--font-historic); font-size: 0.68rem;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted);
    overflow: hidden;
  }
  .di-divider::before, .di-divider::after {
    content: ''; flex: 1; height: 1px;
    background: repeating-linear-gradient(
      90deg, var(--stone-3) 0, var(--stone-3) 6px, transparent 6px, transparent 12px
    );
  }
  .di-divider::before { background: linear-gradient(90deg, transparent, var(--stone-3)); }
  .di-divider::after  { background: linear-gradient(270deg, transparent, var(--stone-3)); }

  /* ── Animations ── */
  @keyframes fade-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-stagger { animation: fade-slide-up 0.6s cubic-bezier(0.25, 1, 0.5, 1) both; }

  /* ── Train Track ── */
  .train-track {
    position: relative; width: 100%; height: 48px;
    background: linear-gradient(transparent 70%, var(--stone-3) 75%, transparent 80%),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><text y="14" x="0" font-size="12">🌲</text></svg>') repeat-x;
    background-size: auto, 100px 30px;
    background-position: center, 0 5px;
    overflow: hidden; z-index: 50; pointer-events: none;
    display: flex; align-items: center;
  }
  .train-loop-container {
    display: flex; position: absolute;
    width: 200vw; left: 0;
    animation: train-rtl-loop 15s linear infinite;
  }
  .train-set {
    display: flex; width: 100vw;
    justify-content: flex-end; align-items: center; padding-right: 50px;
  }
  .bogie {
    font-size: 26px; width: 30px; display: flex; justify-content: center;
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4));
  }
  @keyframes train-rtl-loop {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100vw); }
  }

  /* ── Hero Banner ── */
  .di-hero-banner {
    position: relative; border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-outset); border: 1px solid var(--kansa-bronze);
  }

  /* ── Graph Container ── */
  .di-graph-wrap {
    width: 100%; overflow: visible; position: relative;
  }
  .di-graph-controls {
    display: flex; align-items: center; gap: 0.75rem;
    flex-wrap: wrap; margin-bottom: 1rem;
    padding: 0.75rem 1rem; border-radius: 10px;
    background: var(--stone-1); border: 1px solid var(--stone-2);
    box-shadow: var(--shadow-inset);
  }
  .di-graph-controls label {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--font-historic); font-size: 0.65rem;
    font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); cursor: pointer; transition: color 0.2s;
  }
  .di-graph-controls label:hover { color: var(--kansa-light); }
  .di-graph-controls input[type="checkbox"] {
    accent-color: var(--swarna-gold);
    width: 14px; height: 14px; cursor: pointer;
  }
  .di-graph-controls input[type="radio"] {
    accent-color: var(--swarna-gold);
    width: 14px; height: 14px; cursor: pointer;
  }
  .di-ctrl-sep {
    width: 1px; height: 20px; background: var(--stone-3); flex-shrink: 0;
  }
  .di-ctrl-label {
    font-family: var(--font-historic); font-size: 0.6rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--swarna-gold);
  }

  /* ── SVG Chart Base ── */
  .di-svg-chart { overflow: visible; width: 100%; }
  .di-svg-chart text { font-family: var(--font-body); }
  .di-tooltip-box {
    position: absolute; pointer-events: none;
    background: var(--stone-2); border: 1px solid var(--kansa-bronze);
    border-radius: 8px; padding: 0.5rem 0.8rem;
    font-family: var(--font-body); font-size: 0.78rem;
    color: var(--text-primary); box-shadow: var(--shadow-outset);
    white-space: nowrap; z-index: 999;
    transition: opacity 0.15s ease;
  }

  /* ── Train Detail Card ── */
  .di-train-big {
    font-family: var(--font-mythic); font-size: clamp(1.4rem, 4vw, 2.2rem);
    line-height: 1.1; margin-bottom: 0.4rem; word-break: break-word;
  }
  .di-train-meta {
    font-family: var(--font-body); font-size: 0.75rem; color: var(--text-muted);
    margin-bottom: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Status bar */
  .di-status-bar {
    display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
    padding: 0.75rem 1rem; border-radius: 10px;
    background: var(--stone-1); border-left: 3px solid var(--swarna-gold);
    box-shadow: var(--shadow-inset); margin-bottom: 2rem;
    font-family: var(--font-body); font-size: 0.82rem;
  }

  /* ── Responsive ── */
  * { box-sizing: border-box; }
  .di-page { overflow-x: hidden; width: 100%; }

  @media (max-width: 599px) {
    .di-table { display: none; }
    .di-table-wrap { overflow-x: hidden; overflow-y: auto; border-radius: 12px; border: 1px solid var(--stone-3); max-height: 600px; box-shadow: var(--shadow-inset); width: 100%; }
    
    .di-mobile-card-list { display: flex; flex-direction: column; gap: 0; }
    .di-mobile-station-card { padding: 0.85rem 1rem; border-bottom: 1px solid var(--stone-3); background: var(--stone-1); transition: background 0.15s; position: relative; }
    .di-mobile-station-card:last-child { border-bottom: none; }
    .di-mobile-station-card.is-current { background: rgba(212,175,55,0.06); }
    .di-mobile-station-card.is-current::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--swarna-gold); border-radius: 0 2px 2px 0; }

    .di-mobile-stn-row1 { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem; }
    .di-mobile-stn-name { font-family: var(--font-body); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .di-mobile-stn-num { font-family: var(--font-historic); font-size: 0.55rem; letter-spacing: 0.12em; color: var(--text-muted); flex-shrink: 0; }

    .di-mobile-stn-row2 { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
    .di-mobile-chip { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-family: var(--font-body); background: var(--stone-2); border: 1px solid var(--stone-3); color: var(--text-muted); white-space: nowrap; }
    .di-mobile-chip.timing { color: var(--swarna-gold); border-color: rgba(212,175,55,0.3); }
    .di-mobile-chip.delay-late { color: var(--sindoor-red); border-color: rgba(227,66,52,0.3); font-weight: 700; }
    .di-mobile-chip.delay-ok { color: #3CB371; border-color: rgba(60,179,113,0.3); font-weight: 700; }
    .di-mobile-chip.plat { color: #60a5fa; border-color: rgba(96,165,250,0.3); }
    .di-mobile-chip.halt { color: #a78bfa; border-color: rgba(167,139,250,0.3); }
    .di-mobile-chip.dist { color: var(--text-muted); }

    .di-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
    .di-stat-tile { min-width: 0; overflow: hidden; }
    .di-stat-val { font-size: 1.2rem; word-break: break-word; overflow-wrap: anywhere; }
    .di-stat-label { font-size: 0.55rem; word-break: break-word; }

    .di-range-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .di-input, .di-select { min-height: 44px; font-size: 1rem; }
  }

  @media (min-width: 600px) {
    .di-table { display: table; }
    .di-mobile-card-list { display: none; }
    .di-table-wrap { overflow-x: auto; }
    .di-stat-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (min-width: 900px) {
    .di-stat-grid { grid-template-columns: repeat(5, 1fr); }
    .di-range-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .di-card, .di-card-inset { min-width: 0; overflow: hidden; width: 100%; }
  .di-result-panel { width: 100%; overflow: hidden; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

/* ── Helpers ── */
const API = `${import.meta.env.VITE_API_URL}/api`;

const fetchJSON = async (url) => {
  const r = await fetch(url);
  const text = await r.text();
  let j;
  try {
    const sanitized = text.replace(/:\s*NaN/g, ': null');
    j = JSON.parse(sanitized);
  } catch {
    throw new Error(`Server returned non-JSON response (HTTP ${r.status})`);
  }
  if (!r.ok || j.error) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
};

const fmt = (n, d = 0) => (n != null ? Number(n).toLocaleString('en-IN', { maximumFractionDigits: d }) : '—');

const catBadgeClass = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('rajdhani') || c.includes('shatabdi') || c.includes('vande') || c.includes('duronto')) return 'di-badge-gold';
  if (c.includes('express') || c.includes('superfast')) return 'di-badge-bronze';
  if (c.includes('mail')) return 'di-badge-red';
  return 'di-badge-neutral';
};

function scoreColor(v, max = 100) {
  const p = v / max;
  if (p > 0.75) return 'di-text-green';
  if (p > 0.5) return 'di-text-gold';
  if (p > 0.3) return 'di-text-bronze';
  return 'di-text-red';
}
function scoreBarClass(v, max = 100) {
  const p = v / max;
  if (p > 0.75) return 'di-bar-green';
  if (p > 0.5) return 'di-bar-gold';
  if (p > 0.3) return 'di-bar-bronze';
  return 'di-bar-red';
}

/* ── Micro Components ── */
const Loader = ({ text = 'Loading data' }) => (
  <div className="di-loader">
    <div className="di-spinner">
      <div className="di-spin-outer" />
      <div className="di-spin-inner" />
    </div>
    <p className="di-loader-txt">{text}…</p>
  </div>
);

const ErrBox = ({ msg }) => (
  <div className="di-error">⚠ {msg}</div>
);

const Empty = ({ msg = 'No data found' }) => (
  <div className="di-empty">
    <span className="di-empty-icon">🚂</span>
    {msg}
  </div>
);

const Divider = ({ label }) => (
  <div className="di-divider">{label}</div>
);

/* ─────────────────────────────────────────────
   CHART ENGINE (Pure SVG — No deps)
───────────────────────────────────────────── */
const CHART_COLORS = [
  'var(--swarna-gold)', 'var(--kansa-light)', 'var(--sindoor-red)',
  '#3CB371', 'var(--kansa-bronze)', '#5B8FDE', '#E06B9A',
  '#8BC34A', '#FF7043', '#7E57C2'
];

const useTooltip = () => {
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const show = useCallback((e, content) => {
    const rect = e.currentTarget.closest('.di-graph-wrap').getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTip({ visible: true, x: cx, y: cy, content });
  }, []);
  const hide = useCallback(() => setTip(t => ({ ...t, visible: false })), []);
  return { tip, show, hide };
};

const Tooltip = ({ tip }) =>
  tip.visible ? (
    <div
      className="di-tooltip-box"
      style={{ left: tip.x + 12, top: tip.y - 10, opacity: tip.visible ? 1 : 0 }}
      dangerouslySetInnerHTML={{ __html: tip.content }}
    />
  ) : null;

/* Bar Chart */
const BarChart = ({ data, colorFn, height = 220, unit = '' }) => {
  const { tip, show, hide } = useTooltip();
  if (!data || data.length === 0) return <Empty />;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 560; const padL = 8; const padR = 8; const padT = 16; const padB = 36;
  const chartW = W - padL - padR;
  const chartH = height - padT - padB;
  const barW = Math.max(12, (chartW / data.length) * 0.65);
  const gap = chartW / data.length;

  return (
    <div className="di-graph-wrap" style={{ position: 'relative' }}>
      <svg className="di-svg-chart" viewBox={`0 0 ${W} ${height}`} style={{ height }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f}
            x1={padL} y1={padT + chartH * (1 - f)}
            x2={W - padR} y2={padT + chartH * (1 - f)}
            stroke="var(--stone-3)" strokeWidth="1" strokeDasharray="4,4"
          />
        ))}
        {data.map((d, i) => {
          const bh = (d.value / max) * chartH;
          const x = padL + i * gap + gap / 2 - barW / 2;
          const y = padT + chartH - bh;
          const color = colorFn ? colorFn(d, i) : CHART_COLORS[i % CHART_COLORS.length];
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={bh}
                fill={color} rx="4"
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseMove={e => show(e, `<strong>${d.label}</strong><br/>${fmt(d.value, 1)}${unit}`)}
                onMouseLeave={hide}
              />
              <text
                x={x + barW / 2} y={height - 6}
                textAnchor="middle" fill="var(--text-muted)"
                fontSize="8" fontFamily="var(--font-body)"
                style={{ dominantBaseline: 'auto' }}
              >
                {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
};

/* Horizontal Bar Chart */
const HBarChart = ({ data, colorFn, unit = '' }) => {
  const { tip, show, hide } = useTooltip();
  if (!data || data.length === 0) return <Empty />;
  const max = Math.max(...data.map(d => d.value), 1);
  const rowH = 34; const padL = 100; const padR = 56; const padT = 8; const padB = 8;
  const H = data.length * rowH + padT + padB;
  const W = 560;
  const chartW = W - padL - padR;

  return (
    <div className="di-graph-wrap" style={{ position: 'relative' }}>
      <svg className="di-svg-chart" viewBox={`0 0 ${W} ${H}`} style={{ height: H }}>
        {data.map((d, i) => {
          const bw = (d.value / max) * chartW;
          const y = padT + i * rowH;
          const color = colorFn ? colorFn(d, i) : CHART_COLORS[i % CHART_COLORS.length];
          return (
            <g key={i}>
              <text x={padL - 8} y={y + rowH / 2 + 1}
                textAnchor="end" fill="var(--text-muted)"
                fontSize="9" fontFamily="var(--font-body)"
                dominantBaseline="middle">
                {d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label}
              </text>
              <rect x={padL} y={y + 4} width={Math.max(bw, 2)} height={rowH - 10}
                fill={color} rx="3"
                style={{ cursor: 'pointer' }}
                onMouseMove={e => show(e, `<strong>${d.label}</strong><br/>${fmt(d.value, 1)}${unit}`)}
                onMouseLeave={hide}
              />
              <text x={padL + bw + 6} y={y + rowH / 2 + 1}
                fill={color} fontSize="9" fontFamily="var(--font-mono)"
                dominantBaseline="middle">
                {fmt(d.value, 1)}{unit}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
};

/* Donut / Pie Chart */
const DonutChart = ({ data, height = 220, donut = true }) => {
  const { tip, show, hide } = useTooltip();
  if (!data || data.length === 0) return <Empty />;
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 110; const cy = height / 2; const R = Math.min(cy - 14, 88); const r = donut ? R * 0.52 : 0;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const theta = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + theta);
    const y2 = cy + R * Math.sin(angle + theta);
    const xi1 = cx + r * Math.cos(angle);
    const yi1 = cy + r * Math.sin(angle);
    const xi2 = cx + r * Math.cos(angle + theta);
    const yi2 = cy + r * Math.sin(angle + theta);
    const large = theta > Math.PI ? 1 : 0;
    const path = donut
      ? `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1} Z`
      : `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`;
    const midAngle = angle + theta / 2;
    const mx = cx + (R + r) / 2 * Math.cos(midAngle);
    const my = cy + (R + r) / 2 * Math.sin(midAngle);
    angle += theta;
    return { path, color: CHART_COLORS[i % CHART_COLORS.length], d, pct: ((d.value / total) * 100).toFixed(1), mx, my };
  });

  const W = 560; const legendX = cx * 2 + 24;
  return (
    <div className="di-graph-wrap" style={{ position: 'relative' }}>
      <svg className="di-svg-chart" viewBox={`0 0 ${W} ${height}`} style={{ height }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="var(--stone-2)" strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseMove={e => show(e, `<strong>${s.d.label}</strong><br/>${s.d.value} (${s.pct}%)`)}
            onMouseLeave={hide}
          />
        ))}
        {donut && <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fill="var(--swarna-gold)" fontSize="13" fontFamily="var(--font-mythic)">{total}</text>}
        {slices.map((s, i) => (
          <g key={`leg-${i}`}>
            <rect x={legendX} y={16 + i * 20} width={10} height={10} rx="2" fill={s.color} />
            <text x={legendX + 14} y={16 + i * 20 + 5} dominantBaseline="middle"
              fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-body)">
              {s.d.label.length > 20 ? s.d.label.slice(0, 19) + '…' : s.d.label} ({s.pct}%)
            </text>
          </g>
        ))}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
};

/* Scatter Plot */
const ScatterChart = ({ data, xKey, yKey, xLabel, yLabel, colorFn, unit = '' }) => {
  const { tip, show, hide } = useTooltip();
  if (!data || data.length === 0) return <Empty />;
  const xs = data.map(d => d[xKey] ?? 0);
  const ys = data.map(d => d[yKey] ?? 0);
  const xMin = Math.min(...xs); const xMax = Math.max(...xs, 1);
  const yMin = Math.min(...ys); const yMax = Math.max(...ys, 1);
  const W = 560; const H = 240;
  const padL = 40; const padR = 16; const padT = 16; const padB = 40;
  const cw = W - padL - padR; const ch = H - padT - padB;

  return (
    <div className="di-graph-wrap" style={{ position: 'relative' }}>
      <svg className="di-svg-chart" viewBox={`0 0 ${W} ${H}`} style={{ height: H }}>
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <g key={f}>
            <line x1={padL} y1={padT + ch * (1 - f)} x2={W - padR} y2={padT + ch * (1 - f)}
              stroke="var(--stone-3)" strokeWidth="1" strokeDasharray="4,4" />
            <text x={padL - 4} y={padT + ch * (1 - f)} textAnchor="end" dominantBaseline="middle"
              fill="var(--text-muted)" fontSize="7.5" fontFamily="var(--font-body)">
              {fmt(yMin + f * (yMax - yMin), 0)}
            </text>
          </g>
        ))}
        <text x={padL - 28} y={padT + ch / 2} textAnchor="middle" fill="var(--text-muted)"
          fontSize="8" fontFamily="var(--font-historic)" transform={`rotate(-90, ${padL - 28}, ${padT + ch / 2})`}>
          {yLabel}
        </text>
        <text x={padL + cw / 2} y={H - 4} textAnchor="middle" fill="var(--text-muted)"
          fontSize="8" fontFamily="var(--font-historic)">{xLabel}</text>
        {data.map((d, i) => {
          const x = padL + ((d[xKey] ?? 0) - xMin) / (xMax - xMin) * cw;
          const y = padT + (1 - ((d[yKey] ?? 0) - yMin) / (yMax - yMin)) * ch;
          const color = colorFn ? colorFn(d, i) : CHART_COLORS[i % CHART_COLORS.length];
          return (
            <circle key={i} cx={x} cy={y} r={5} fill={color} fillOpacity="0.8"
              stroke="var(--stone-2)" strokeWidth="1" style={{ cursor: 'pointer' }}
              onMouseMove={e => show(e, `<strong>${d.label || d.TrainName || ''}</strong><br/>${xLabel}: ${fmt(d[xKey], 1)}<br/>${yLabel}: ${fmt(d[yKey], 1)}${unit}`)}
              onMouseLeave={hide}
            />
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
};

/* Graph Type Selector (checkbox-based radio) */
const GraphTypeSelector = ({ types, value, onChange }) => (
  <div className="di-graph-controls">
    <span className="di-ctrl-label">Chart:</span>
    {types.map(t => (
      <label key={t.id}>
        <input type="radio" name={`chart-${t.id}`}
          checked={value === t.id}
          onChange={() => onChange(t.id)} />
        {t.label}
      </label>
    ))}
  </div>
);

/* Show/Hide Graph Toggle */
const GraphToggle = ({ show, onToggle }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: 'var(--font-historic)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: show ? 'var(--swarna-gold)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
    <input type="checkbox" checked={show} onChange={onToggle} style={{ accentColor: 'var(--swarna-gold)', width: 14, height: 14, cursor: 'pointer' }} />
    Show Graph
  </label>
);

/* ─────────────────────────────────────────────
   DEMAND OVERVIEW TAB
───────────────────────────────────────────── */
const DemandOverviewTab = () => {
  const [state, setState] = useState({
    catOcc: null, zoneOcc: null, highest: null, lowest: null,
    loading: true, error: null,
  });
  const [showCatGraph, setShowCatGraph] = useState(true);
  const [showZoneGraph, setShowZoneGraph] = useState(true);
  const [catChartType, setCatChartType] = useState('hbar');
  const [zoneChartType, setZoneChartType] = useState('hbar');

  useEffect(() => {
    (async () => {
      try {
        const [catOcc, zoneOcc, highest, lowest] = await Promise.all([
          fetchJSON(`${API}/train/CategoryWiseTrainsOccupance`),
          fetchJSON(`${API}/train/ZoneyWiseTrainsOccupance`),
          fetchJSON(`${API}/train/HighestOccupancey`),
          fetchJSON(`${API}/train/LowestOccupancey`),
        ]);
        setState({ catOcc, zoneOcc, highest, lowest, loading: false, error: null });
      } catch (e) {
        setState(s => ({ ...s, loading: false, error: e.message }));
      }
    })();
  }, []);

  if (state.loading) return <Loader text="Analysing demand signals" />;
  if (state.error) return <ErrBox msg={state.error} />;

  const { catOcc, zoneOcc, highest, lowest } = state;
  const ht = highest?.train?.[0];
  const lt = lowest?.train?.[0];

  const catEntries = Object.entries(catOcc?.trains || {}).sort((a, b) => b[1] - a[1]);
  const zoneEntries = Object.entries(zoneOcc?.trains || {}).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] ?? 1;
  const maxZone = zoneEntries[0]?.[1] ?? 1;

  const catChartData = catEntries.map(([label, value]) => ({ label, value }));
  const zoneChartData = zoneEntries.map(([label, value]) => ({ label, value }));

  const CAT_CHART_TYPES = [
    { id: 'hbar', label: 'Horiz. Bar' },
    { id: 'bar', label: 'Vert. Bar' },
    { id: 'donut', label: 'Donut' },
    { id: 'pie', label: 'Pie' },
  ];
  const ZONE_CHART_TYPES = [
    { id: 'hbar', label: 'Horiz. Bar' },
    { id: 'bar', label: 'Vert. Bar' },
    { id: 'donut', label: 'Donut' },
  ];

  const renderCatChart = () => {
    if (catChartType === 'hbar') return <HBarChart data={catChartData} unit="%" />;
    if (catChartType === 'bar') return <BarChart data={catChartData} unit="%" />;
    if (catChartType === 'donut') return <DonutChart data={catChartData} donut={true} />;
    if (catChartType === 'pie') return <DonutChart data={catChartData} donut={false} />;
  };
  const renderZoneChart = () => {
    if (zoneChartType === 'hbar') return <HBarChart data={zoneChartData} colorFn={(d, i) => zoneEntries[i]?.[1] > 80 ? 'var(--kansa-light)' : CHART_COLORS[i % CHART_COLORS.length]} unit="%" />;
    if (zoneChartType === 'bar') return <BarChart data={zoneChartData} unit="%" />;
    if (zoneChartType === 'donut') return <DonutChart data={zoneChartData} donut={true} />;
  };

  const TrainDetailCard = ({ t, cls, label, icon }) => {
    if (!t) return <Empty msg="No data" />;
    const occ = t.OccupancyPercentage ?? t.OccupancyRate;
    const delay = t.DelayProbability;
    const punct = t.PunctualityScore;
    return (
      <>
        <div className={`di-train-big ${cls}`}>{t.TrainName}</div>
        <div className="di-train-meta">#{t.TrainNo} · {t.TrainCategory} · {t.RailwayZone}</div>
        <div className="di-train-meta">{t.StartingPoint} → {t.FinalDestination} · {t.Distance_km} km</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className={`di-badge-${occ > 80 ? 'red' : 'green'} text-xs px-2 py-1 rounded font-mono font-bold`}
            style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
            {icon} {occ != null ? `${occ}%` : 'N/A'} Occ.
          </span>
          {t.CoachCount && <span className="di-badge-bronze" style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>🚃 {t.CoachCount} Coaches</span>}
          {punct != null && <span className="di-badge-gold" style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>⏱ {punct}</span>}
          {delay != null && <span className="di-badge-red" style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>⚠ {(delay * 100).toFixed(0)}% Risk</span>}
          {t.ElectrifiedRoute != null && <span className={t.ElectrifiedRoute === 'Yes' ? 'di-badge-green' : 'di-badge-neutral'} style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>{t.ElectrifiedRoute === 'Yes' ? '⚡ Elec' : 'Non-elec'}</span>}
        </div>
        {/* Mini performance bars */}
        <div className="di-card-inset p-3 space-y-2" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {occ != null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-historic)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Occupancy</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: occ > 80 ? 'var(--sindoor-red)' : '#3CB371' }}>{occ}%</span>
              </div>
              <div className="di-track" style={{ height: 8 }}>
                <div className={occ > 80 ? 'di-bar-red' : 'di-bar-green'} style={{ height: '100%', width: `${Math.min(occ, 100)}%`, borderRadius: 999, transition: 'width 1s ease' }} />
              </div>
            </div>
          )}
          {punct != null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-historic)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Punctuality</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--swarna-gold)' }}>{punct}/100</span>
              </div>
              <div className="di-track" style={{ height: 8 }}>
                <div className={scoreBarClass(punct)} style={{ height: '100%', width: `${punct}%`, borderRadius: 999, transition: 'width 1s ease' }} />
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="di-two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="di-card" style={{ padding: '1.5rem' }}>
          <div className="di-slabel">Highest Occupancy</div>
          <TrainDetailCard t={ht} cls="di-text-bronze" label="Highest" icon="📈" />
        </div>
        <div className="di-card" style={{ padding: '1.5rem' }}>
          <div className="di-slabel">Lowest Occupancy</div>
          <TrainDetailCard t={lt} cls="di-text-green" label="Lowest" icon="📉" />
        </div>
      </div>

      <Divider label="Segment Breakdown" />

      <div className="di-two-col">
        {/* Category Chart */}
        <div className="di-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="di-slabel" style={{ margin: 0 }}>Avg Occ · By Category</div>
            <GraphToggle show={showCatGraph} onToggle={() => setShowCatGraph(p => !p)} />
          </div>
          {showCatGraph && (
            <>
              <GraphTypeSelector types={CAT_CHART_TYPES} value={catChartType} onChange={setCatChartType} />
              {renderCatChart()}
            </>
          )}
          {!showCatGraph && (
            <div className="di-bar-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {catEntries.map(([cat, val], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-historic)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', width: 88, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</div>
                  <div className="di-track" style={{ flex: 1, height: 10 }}>
                    <div className="di-bar-gold" style={{ height: '100%', width: `${(val / maxCat) * 100}%`, borderRadius: 999, transition: 'width 1s' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--swarna-gold)', width: 42, textAlign: 'right' }}>{val.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone Chart */}
        <div className="di-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="di-slabel" style={{ margin: 0 }}>Avg Occ · By Zone</div>
            <GraphToggle show={showZoneGraph} onToggle={() => setShowZoneGraph(p => !p)} />
          </div>
          {showZoneGraph && (
            <>
              <GraphTypeSelector types={ZONE_CHART_TYPES} value={zoneChartType} onChange={setZoneChartType} />
              {renderZoneChart()}
            </>
          )}
          {!showZoneGraph && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {zoneEntries.map(([zone, val], i) => {
                const hot = val > 80;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontFamily: 'var(--font-historic)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', width: 88, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{zone}</div>
                    <div className="di-track" style={{ flex: 1, height: 10 }}>
                      <div className={hot ? 'di-bar-amber' : 'di-bar-bronze'} style={{ height: '100%', width: `${(val / maxZone) * 100}%`, borderRadius: 999, transition: 'width 1s' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: hot ? 'var(--kansa-light)' : 'var(--kansa-bronze)', width: 42, textAlign: 'right' }}>{val.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TRAIN LOOKUP TAB
───────────────────────────────────────────── */
const TrainLookupTab = () => {
  const [mode, setMode] = useState('num');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGraph, setShowGraph] = useState(true);

  const search = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    try {
      setLoading(true); setError(null); setResult(null);
      const url = mode === 'num'
        ? `${API}/train/occupancyBynum?num=${encodeURIComponent(q)}`
        : `${API}/train/occupancyByname?name=${encodeURIComponent(q)}`;
      const data = await fetchJSON(url);
      setResult(data.train || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [mode, query]);

  const switchMode = (m) => { setMode(m); setResult(null); setError(null); setQuery(''); };

  const chartData = result ? result.map(t => ({
    label: t.TrainName?.slice(0, 14) || `#${t.TrainNo}`,
    value: t.OccupancyPercentage ?? 0,
  })) : [];

  return (
    <div>
      <div className="di-search-panel">
        <div className="di-slabel" style={{ marginBottom: '1rem' }}>Occupancy Lookup</div>
        <div className="di-mode-tabs">
          {[['num', '🔢 By Train No.'], ['name', '🔤 By Train Name']].map(([m, lbl]) => (
            <button key={m} className={`di-mode-tab${mode === m ? ' active' : ''}`} onClick={() => switchMode(m)}>{lbl}</button>
          ))}
        </div>
        <div className="di-input-row">
          <input className="di-input" placeholder={mode === 'num' ? 'Enter train number…' : 'Enter exact train name…'} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="di-btn" onClick={search} disabled={loading || !query.trim()}>{loading ? '…' : '🔍 Search'}</button>
        </div>
      </div>

      {loading && <Loader text="Querying occupancy" />}
      {error && <ErrBox msg={error} />}

      {result && result.length > 0 && (
        <div className="di-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="di-slabel" style={{ margin: 0 }}>
              Results
              <span className="di-badge-gold" style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em', marginLeft: '0.5rem' }}>{result.length} record{result.length > 1 ? 's' : ''}</span>
            </div>
            {chartData.length > 1 && <GraphToggle show={showGraph} onToggle={() => setShowGraph(p => !p)} />}
          </div>

          {showGraph && chartData.length > 1 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="di-graph-controls">
                <span className="di-ctrl-label">Occupancy Comparison</span>
              </div>
              <BarChart data={chartData} unit="%" colorFn={(d) => d.value > 85 ? 'var(--sindoor-red)' : d.value > 60 ? 'var(--kansa-light)' : '#3CB371'} height={200} />
            </div>
          )}

          <div className="di-table-wrap">
            <table className="di-table">
              <thead>
                <tr>
                  {mode === 'name' && <th>Train No.</th>}
                  <th>Name</th>
                  <th>Occupancy</th>
                  <th>Coaches</th>
                </tr>
              </thead>
              <tbody>
                {result.map((t, i) => {
                  const occ = t.OccupancyPercentage;
                  const badgeCls = occ == null ? 'di-badge-neutral' : occ > 85 ? 'di-badge-red' : occ > 60 ? 'di-badge-bronze' : 'di-badge-green';
                  return (
                    <tr key={i}>
                      {mode === 'name' && <td className="di-table-mono">{t.TrainNo}</td>}
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.TrainName}</td>
                      <td>
                        <span className={badgeCls} style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
                          {occ != null ? `${occ}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="di-table-mono">{t.CoachCount != null ? t.CoachCount : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {result && result.length === 0 && <Empty />}
    </div>
  );
};

/* ─────────────────────────────────────────────
   FLEET FILTER TAB — All original logic intact
───────────────────────────────────────────── */
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

const FleetFilterTab = () => {
  const [filterMode, setFilterMode] = useState('zone');
  const [input, setInput] = useState('');
  const [trains, setTrains] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [showGraph, setShowGraph] = useState(true);
  const [fleetChartType, setFleetChartType] = useState('scatter');
  const PAGE = 15;

  const search = useCallback(async (val) => {
    const q = (val ?? input).trim();
    if (!q) return;
    try {
      setLoading(true); setError(null); setTrains(null); setPage(0);
      const url = filterMode === 'zone'
        ? `${API}/train/ZoneWiseTrains?zone=${encodeURIComponent(q)}`
        : `${API}/train/CategoryWiseTrains?cat=${encodeURIComponent(q)}`;
      const data = await fetchJSON(url);
      setTrains(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [filterMode, input]);

  const handleSelect = (e) => {
    const val = e.target.value;
    setInput(val); setTrains(null); setError(null);
    if (val) search(val);
  };

  const switchFilter = (m) => { setFilterMode(m); setTrains(null); setError(null); setInput(''); };

  const list = trains?.trains || [];
  const slice = list.slice(page * PAGE, (page + 1) * PAGE);
  const pages = Math.ceil(list.length / PAGE);
  const opts = filterMode === 'zone' ? ZONES : CATEGORIES;

  const FLEET_CHART_TYPES = [
    { id: 'scatter', label: 'Scatter (Speed vs Dist)' },
    { id: 'bar', label: 'Occupancy Bar' },
    { id: 'donut', label: 'Category Donut' },
  ];

  const scatterData = list.slice(0, 60).map(t => ({
    ...t,
    label: t.TrainName,
    OccupancyPercentage: t.OccupancyPercentage ?? 0,
    Distance_km: t.Distance_km ?? 0,
    TravelTime_hr: t.TravelTime_hr ?? 0,
  }));
  const barData = list.slice(0, 20).map(t => ({
    label: t.TrainName?.slice(0, 12) || `#${t.TrainNo}`,
    value: t.OccupancyPercentage ?? 0,
  }));
  const catCounts = {};
  list.forEach(t => { catCounts[t.TrainCategory || 'Other'] = (catCounts[t.TrainCategory || 'Other'] || 0) + 1; });
  const donutData = Object.entries(catCounts).map(([label, value]) => ({ label, value }));

  const renderFleetChart = () => {
    if (fleetChartType === 'scatter') return <ScatterChart data={scatterData} xKey="Distance_km" yKey="OccupancyPercentage" xLabel="Distance (km)" yLabel="Occupancy %" colorFn={(d) => d.OccupancyPercentage > 85 ? 'var(--sindoor-red)' : d.OccupancyPercentage > 60 ? 'var(--kansa-light)' : '#3CB371'} />;
    if (fleetChartType === 'bar') return <BarChart data={barData} unit="%" height={220} colorFn={(d) => d.value > 85 ? 'var(--sindoor-red)' : d.value > 60 ? 'var(--kansa-light)' : '#3CB371'} />;
    if (fleetChartType === 'donut') return <DonutChart data={donutData} donut={true} />;
  };

  return (
    <div>
      <div className="di-search-panel">
        <div className="di-slabel" style={{ marginBottom: '1.1rem' }}>Fleet Filter</div>
        <div className="di-mode-tabs">
          {[['zone', '🗺 By Zone'], ['category', '🎫 By Category']].map(([m, lbl]) => (
            <button key={m} className={`di-mode-tab${filterMode === m ? ' active' : ''}`} onClick={() => switchFilter(m)}>{lbl}</button>
          ))}
        </div>
        <div className="di-input-row">
          <select className="di-select" value={input} onChange={handleSelect}>
            <option value="">{filterMode === 'zone' ? '— Select a Railway Zone —' : '— Select a Train Category —'}</option>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {loading && <Loader text="Filtering fleet" />}
      {error && <ErrBox msg={error} />}

      {trains && (
        <>
          {/* Graph */}
          {list.length > 0 && (
            <div className="di-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="di-slabel" style={{ margin: 0 }}>Visual Analysis · {input}</div>
                <GraphToggle show={showGraph} onToggle={() => setShowGraph(p => !p)} />
              </div>
              {showGraph && (
                <>
                  <GraphTypeSelector types={FLEET_CHART_TYPES} value={fleetChartType} onChange={setFleetChartType} />
                  {renderFleetChart()}
                </>
              )}
            </div>
          )}

          {/* Table */}
          <div className="di-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div className="di-slabel" style={{ margin: 0 }}>{input}</div>
              <span className="di-badge-gold" style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>{trains.count} trains</span>
            </div>

            <div className="di-table-wrap">

              {/* DESKTOP TABLE (UNCHANGED) */}
              <table className="di-table">
                <thead>
                  <tr>
                    <th>No.</th><th>Name</th><th>Category</th><th>Route</th>
                    <th>Dist km</th><th>Travel hr</th><th>Coaches</th>
                    <th>Occ%</th><th>Fare ₹</th><th>Stops</th><th>Route Type</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((t, i) => {
                    const occ = t.OccupancyPercentage;
                    const occColor = occ == null ? 'var(--text-muted)' : occ > 85 ? 'var(--sindoor-red)' : occ > 60 ? 'var(--swarna-gold)' : '#3CB371';
                    return (
                      <tr key={i}>
                        <td className="di-table-mono">{t.TrainNo}</td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600, minWidth: 110, maxWidth: 150 }}>{t.TrainName}</td>
                        <td><span className={catBadgeClass(t.TrainCategory)} style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontFamily: 'var(--font-historic)', fontSize: '0.58rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{t.TrainCategory}</span></td>
                        <td className="di-table-mono" style={{ fontSize: '0.62rem' }}>{t.StartingPoint} → {t.FinalDestination}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.66rem' }}>{t.Distance_km ?? '—'}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.66rem' }}>{t.TravelTime_hr != null ? t.TravelTime_hr.toFixed(1) : '—'}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.66rem' }}>{t.CoachCount ?? '—'}</td>
                        <td style={{ fontFamily: 'var(--font-historic)', fontSize: '0.7rem', color: occColor }}>{occ != null ? `${occ}%` : '—'}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.62rem' }}>{t.ApproxFareRange_INR || '—'}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.66rem' }}>{t.AvgStops ?? '—'}</td>
                        <td className="di-table-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t.RouteType || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ✅ MOBILE FIX (ONLY ADDITION) */}
              <div className="di-mobile-card-list">
                {slice.map((t, i) => {
                  const occ = t.OccupancyPercentage;

                  return (
                    <div key={i} className="di-mobile-station-card">

                      {/* TRAIN NAME */}
                      <div className="di-mobile-stn-name">
                        {t.TrainName || "Unknown Train"}
                      </div>

                      <div className="di-mobile-stn-row2">
                        <span className="di-mobile-chip">
                          🚆 {t.TrainNo}
                        </span>

                        <span className="di-mobile-chip">
                          🚉 {t.TrainCategory}
                        </span>

                        <span className="di-mobile-chip">
                          🗺 {t.StartingPoint} → {t.FinalDestination}
                        </span>

                        <span className="di-mobile-chip timing">
                          📊 {occ != null ? `${occ}%` : '—'}
                        </span>

                        <span className="di-mobile-chip">
                          🚃 {t.CoachCount ?? '—'}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {pages > 1 && (
              <div className="di-pagination">
                <button className="di-btn di-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="di-page-info">Page {page + 1} / {pages}</span>
                <button className="di-btn di-btn-sm" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        </>
      )}
      {trains && list.length === 0 && <Empty />}
    </div>
  );
};

/* ─────────────────────────────────────────────
   INFRASTRUCTURE TAB — All original logic intact
───────────────────────────────────────────── */
const InfraTab = () => {
  const [data, setData] = useState({ avg: null, highCap: null, coach: null, range: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showPlatGraph, setShowPlatGraph] = useState(true);
  const [platChartType, setPlatChartType] = useState('bar');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [avg, highCap, coach, range] = await Promise.all([
          fetchJSON(`${API}/infrastructure/platforms/average`),
          fetchJSON(`${API}/infrastructure/platforms/highcapacity`),
          fetchJSON(`${API}/infrastructure/coach/capacity`),
          fetchJSON(`${API}/infrastructure/platforms/range`),
        ]);
        setData({ avg, highCap, coach, range });
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader text="Scanning infrastructure" />;
  if (error) return <ErrBox msg={error} />;

  const { avg, highCap, coach, range } = data;
  const stations = (highCap?.stations || []).slice(0, showAll ? 99999 : 14);
  const rangeList = (range?.stations || []).slice(0, showAll ? 99999 : 24);
  const maxPlat = Math.max(...(highCap?.stations || []).map(s => s.PlatformCountAtOrigin), 1);

  const kpis = [
    { label: 'Avg Platforms', value: avg?.average_platforms, cls: '' },
    { label: 'Min Coaches', value: coach?.min_coaches, cls: 'red' },
    { label: 'Avg Coaches', value: coach?.average_coaches, cls: '' },
    { label: 'Max Coaches', value: coach?.max_coaches, cls: 'green' },
    { label: 'Total Stations', value: highCap?.count, cls: '' },
  ];

  const platChartData = (highCap?.stations || []).slice(0, 20).map(s => ({
    label: s.StartingPoint?.slice(0, 14) || 'Unknown',
    value: s.PlatformCountAtOrigin,
  }));
  const coachKpiData = [
    { label: 'Min', value: coach?.min_coaches ?? 0 },
    { label: 'Avg', value: coach?.average_coaches ?? 0 },
    { label: 'Max', value: coach?.max_coaches ?? 0 },
  ];

  const PLAT_CHART_TYPES = [
    { id: 'bar', label: 'Vert. Bar' },
    { id: 'hbar', label: 'Horiz. Bar' },
    { id: 'donut', label: 'Donut' },
  ];

  const renderPlatChart = () => {
    if (platChartType === 'bar') return <BarChart data={platChartData} height={220} />;
    if (platChartType === 'hbar') return <HBarChart data={platChartData} />;
    if (platChartType === 'donut') return <DonutChart data={platChartData.slice(0, 10)} donut={true} />;
  };

  return (
    <div>
      {/* KPI Ticker */}
      <div className="di-slabel">Key Infrastructure Metrics</div>
      <div className="di-stat-grid">
        {kpis.map((k, i) => (
          <div className="di-stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="di-stat-label">{k.label}</div>
            <div className={`di-stat-value ${k.cls}`}>{k.value ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* Coach Distribution Chart */}
      <div className="di-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div className="di-slabel" style={{ marginBottom: '1rem' }}>Coach Capacity Distribution</div>
        <BarChart data={coachKpiData} height={160} colorFn={(d, i) => ['var(--sindoor-red)', 'var(--swarna-gold)', '#3CB371'][i]} unit=" coaches" />
      </div>

      <Divider label="Platform Capacity by Station" />

      {/* Platform Bar Chart */}
      <div className="di-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="di-slabel" style={{ margin: 0 }}>Platform Count Ranking</div>
          <GraphToggle show={showPlatGraph} onToggle={() => setShowPlatGraph(p => !p)} />
        </div>
        {showPlatGraph && (
          <>
            <GraphTypeSelector types={PLAT_CHART_TYPES} value={platChartType} onChange={setPlatChartType} />
            {renderPlatChart()}
          </>
        )}
        {!showPlatGraph && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stations.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontFamily: 'var(--font-historic)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', width: 100, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.StartingPoint}</div>
                <div className="di-track" style={{ flex: 1, height: 10 }}>
                  <div className="di-bar-gold" style={{ height: '100%', width: `${(s.PlatformCountAtOrigin / maxPlat) * 100}%`, borderRadius: 999, transition: 'width 1s' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--swarna-gold)', width: 28, textAlign: 'right' }}>{s.PlatformCountAtOrigin}</div>
              </div>
            ))}
            {(highCap?.stations?.length > 14) && (
              <button className="di-btn di-btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={() => setShowAll(p => !p)}>
                {showAll ? 'Show Less' : `Show All ${highCap.count}`}
              </button>
            )}
          </div>
        )}
        {showPlatGraph && (highCap?.stations?.length > 14) && (
          <button className="di-btn di-btn-sm" style={{ marginTop: '1rem' }} onClick={() => setShowAll(p => !p)}>
            {showAll ? 'Show Less' : `Show All ${highCap.count}`}
          </button>
        )}
      </div>

      <Divider label="Platform Range per Origin" />

      <div className="di-card" style={{ padding: '1.5rem' }}>
        <div className="di-slabel" style={{ marginBottom: '1rem' }}>Platform Count</div>
        <div className="di-range-grid">
          {rangeList.map((s, i) => {
            const parts = s.PlatformRange ? s.PlatformRange.split('-').map(Number) : [0, 0];
            const avg2 = parts.length === 2 ? ((parts[0] + parts[1]) / 2).toFixed(1) : '—';
            return (
              <div className="di-range-item" key={i}>
                <div className="ri-name">{s.StartingPoint}</div>
                <div className="ri-val">{avg2}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: '📊 Demand Overview' },
  { id: 'lookup', label: '🔍 Train Lookup' },
  { id: 'fleet', label: '🚂 Fleet Filter' },
  { id: 'infra', label: '🏗 Infrastructure' },
];

const DemandAndInfra = () => {
  const [tab, setTab] = useState('overview');
  const [tick, setTick] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = tick.toLocaleTimeString('en-IN', { hour12: false });
  const dateStr = tick.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Navbar>
      <style>{DEMAND_CSS}</style>

      <div className="min-h-screen di-page relative overflow-x-hidden pb-12">

        {/* ── TRAIN ANIMATION ── */}
        <div className="train-track">
          <div className="train-loop-container">
            <div className="train-set">
              <div className="bogie">🚂</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
            </div>
            <div className="train-set">
              <div className="bogie">🚂</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
              <div className="bogie">🚃</div>
            </div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96" style={{ background: 'var(--swarna-gold)', opacity: 0.04, borderRadius: '50%', filter: 'blur(90px)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96" style={{ background: 'var(--sindoor-red)', opacity: 0.04, borderRadius: '50%', filter: 'blur(90px)' }} />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

          {/* ── HERO ── */}
          <div className="animate-stagger di-hero-banner mb-8 p-8 sm:p-12 flex flex-col justify-end min-h-[200px] relative overflow-hidden" style={{ background: 'var(--stone-3)' }}>
            <img
              src="https://imgs.search.brave.com/5crxKc3vjgEnhW79FP_HrNeBn7BFvHymQ3wSGkdmLM0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE2NjQzMDQx/MjEzNzQtZTRkMmJk/N2FmOGUxP2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZhdXRvPWZvcm1h/dCZmaXQ9Y3JvcCZp/eGxpYj1yYi00LjEu/MCZpeGlkPU0zd3hN/akEzZkRCOE1IeHpa/V0Z5WTJoOE1UTjhm/R2x1WkdsaEpUSXdk/SEpoYVc1OFpXNThN/SHg4TUh4OGZEQT0"
              alt="Train Infrastructure"
              loading="lazy"
              className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700"
              onLoad={e => { e.currentTarget.style.opacity = '0.5'; }}
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, var(--stone-2), transparent)' }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border" style={{ background: 'rgba(var(--stone-1-rgb, 8,8,10),0.8)', backdropFilter: 'blur(8px)', borderColor: 'var(--kansa-bronze)' }}>
                <span style={{ fontFamily: 'var(--font-historic)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kansa-bronze)' }}>🪔 Demand &amp; Infrastructure</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-mythic)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--swarna-gold)', lineHeight: 1.1, marginBottom: '0.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                Network Intelligence
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Occupancy · Capacity · Fleet · Platform Analytics
              </p>
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div className="di-status-bar animate-stagger" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3CB371', boxShadow: '0 0 8px #3CB371' }} />
              <span style={{ color: 'var(--text-muted)' }}>Systems <strong style={{ color: 'var(--text-primary)' }}>Nominal</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--swarna-gold)', animation: 'diya-dot-pulse 2s infinite' }} />
              <span style={{ color: 'var(--text-muted)' }}>Feed <strong style={{ color: 'var(--text-primary)' }}>Live</strong></span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>{timeStr}</span><span style={{ color: 'var(--kansa-bronze)' }}>•</span><span>{dateStr}</span>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="di-tab-bar animate-stagger" style={{ animationDelay: '0.2s' }}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                className={`di-tab-btn${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="animate-stagger" style={{ animationDelay: '0.3s' }}>
            {tab === 'overview' && <DemandOverviewTab />}
            {tab === 'lookup' && <TrainLookupTab />}
            {tab === 'fleet' && <FleetFilterTab />}
            {tab === 'infra' && <InfraTab />}
          </div>

          {/* ── FOOTER ── */}
          <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid var(--stone-3)', fontFamily: 'var(--font-historic)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            <p>Yatra Marga Intelligence System © 2026</p>
            <p style={{ color: 'var(--swarna-gold)', marginTop: '0.4rem' }}>▶ DEMAND &amp; INFRA MODULE · OPERATIONAL</p>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default DemandAndInfra;