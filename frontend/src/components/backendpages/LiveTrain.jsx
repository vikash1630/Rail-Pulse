import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../pages/Navbar";

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const LIVETRAIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

  /* ── KEYFRAMES ── */
  @keyframes lt-spin         { to { transform: rotate(360deg); } }
  @keyframes lt-card-in      { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes lt-glow-pulse   { 0%,100%{box-shadow:0 0 20px rgba(201,151,58,.15)} 50%{box-shadow:0 0 48px rgba(201,151,58,.45)} }
  @keyframes lt-rail-flow    { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes lt-float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes lt-scan         { 0%{top:0%;opacity:.5} 100%{top:100%;opacity:0} }
  @keyframes lt-badge-pop    { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes lt-bg-move      { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes lt-orb-drift    { 0%{transform:translate(0,0)} 33%{transform:translate(35px,-25px)} 66%{transform:translate(-18px,35px)} 100%{transform:translate(0,0)} }
  @keyframes lt-hero-rise    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lt-count-up     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lt-pulse-dot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }
  @keyframes lt-shimmer      { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes lt-status-glow  { 0%,100%{box-shadow:0 0 20px rgba(61,184,122,.12),inset 0 0 20px rgba(61,184,122,.04)} 50%{box-shadow:0 0 50px rgba(61,184,122,.35),inset 0 0 30px rgba(61,184,122,.08)} }
  @keyframes lt-row-in       { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lt-ping         { 75%,100%{transform:scale(1.8);opacity:0} }
  @keyframes lt-refresh-spin { to{transform:rotate(360deg)} }
  @keyframes lt-progress-bar { from{width:0%} to{width:100%} }

  /* ── RESET ── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── PAGE SHELL ── */
  .lt-page {
    min-height: 100vh;
    padding: 1.4rem .9rem 5rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    font-family: 'Barlow Condensed', sans-serif;
    color: #f0eeeb;
  }

  .lt-page::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.035) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: lt-bg-move 9s linear infinite;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  }
  .lt-page::after {
    content: '';
    position: fixed; top: -180px; right: -180px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(61,184,122,.055) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: lt-orb-drift 18s ease-in-out infinite;
  }
  .lt-page > * { position: relative; z-index: 1; }

  /* ── HERO HEADER ── */
  .lt-header {
    margin-bottom: 2.2rem;
    padding-top: .5rem;
    animation: lt-hero-rise .75s cubic-bezier(.22,1,.36,1) both;
  }
  .lt-header-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .88rem);
    letter-spacing: .35em; text-transform: uppercase;
    color: #3db87a; margin-bottom: .8rem;
    display: flex; align-items: center; gap: .7rem; opacity: .85;
  }
  .lt-header-eyebrow::before, .lt-header-eyebrow::after {
    content: ''; height: 1px; flex: 1; max-width: 55px;
  }
  .lt-header-eyebrow::before { background: linear-gradient(90deg, #3db87a, transparent); }
  .lt-header-eyebrow::after  { background: linear-gradient(270deg, #3db87a, transparent); }

  .lt-header h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 18vw, 8.5rem);
    font-weight: 400; color: #f0eeeb;
    letter-spacing: .05em; line-height: .88;
    text-transform: uppercase; margin: 0 0 .3rem;
  }
  .lt-header h1 .lt-h1-accent { color: transparent; -webkit-text-stroke: 1.5px #3db87a; }
  .lt-header h1 .lt-h1-gold   { color: transparent; -webkit-text-stroke: 1.5px #c9973a; }

  .lt-header-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .92rem);
    color: #6b7280; margin-top: .6rem;
    letter-spacing: .15em; text-transform: uppercase;
  }

  /* ── LIVE INDICATOR ── */
  .lt-live-badge {
    display: inline-flex; align-items: center; gap: .5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.6vw, .72rem);
    letter-spacing: .22em; text-transform: uppercase;
    padding: .3rem .8rem; border-radius: 99px;
    background: rgba(61,184,122,.08); border: 1px solid rgba(61,184,122,.25);
    color: #3db87a; margin-top: .85rem;
  }
  .lt-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3db87a; position: relative; flex-shrink: 0;
  }
  .lt-live-dot::after {
    content: ''; position: absolute; inset: -1px;
    border-radius: 50%; background: #3db87a;
    animation: lt-ping 1.5s cubic-bezier(0,0,.2,1) infinite;
  }

  /* ── RAIL DIVIDER ── */
  .lt-rail-divider { height: 22px; margin: 1.6rem 0; position: relative; overflow: hidden; }
  .lt-rail-divider::before {
    content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0px, rgba(255,255,255,.07) 20px, transparent 20px, transparent 30px);
    transform: translateY(-50%); animation: lt-rail-flow 2s linear infinite;
  }
  .lt-rail-divider::after {
    content: '▶'; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    color: #3db87a; font-size: .85rem; animation: lt-float 2s ease-in-out infinite;
  }

  /* ── SECTION DIVIDER ── */
  .lt-section-divider {
    display: flex; align-items: center; gap: .75rem;
    margin: 2rem 0 1.2rem;
  }
  .lt-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.8vw, .75rem); font-weight: 700;
    letter-spacing: .28em; text-transform: uppercase; color: #c9973a;
    white-space: nowrap;
  }
  .lt-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(201,151,58,.35), transparent);
  }

  /* ── FILTER PANEL ── */
  .lt-filter-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 1.4rem 1rem;
    margin-bottom: 1rem; position: relative; overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    width: 100%;
  }
  .lt-filter-panel:focus-within {
    border-color: rgba(61,184,122,.3);
    box-shadow: 0 0 50px rgba(61,184,122,.06);
  }
  .lt-filter-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #3db87a 40%, #5ee89f 60%, transparent 100%);
    box-shadow: 0 0 12px rgba(61,184,122,.25);
  }
  .lt-scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(61,184,122,.2), transparent);
    animation: lt-scan 5s ease-in-out infinite; pointer-events: none; z-index: 0;
  }
  .lt-filter-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem); font-weight: 700;
    letter-spacing: .22em; text-transform: uppercase; color: #3db87a;
    margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem;
    position: relative; z-index: 1;
  }
  .lt-filter-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(61,184,122,.3), transparent);
  }
  .lt-filter-row {
    display: flex; flex-direction: column; gap: .7rem;
    position: relative; z-index: 1;
  }
  .lt-field { display: flex; flex-direction: column; gap: .4rem; width: 100%; }
  .lt-field label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem);
    font-weight: 700; letter-spacing: .22em; text-transform: uppercase;
    color: #6b7280; display: flex; align-items: center; gap: .45rem;
  }
  .lt-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%; background: #3db87a; box-shadow: 0 0 7px #3db87a; flex-shrink: 0;
  }
  .lt-field input {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #f0eeeb;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.1rem, 3vw, 1.35rem); font-weight: 600;
    padding: .85rem 1rem; outline: none;
    transition: border-color .22s, box-shadow .22s; width: 100%;
    min-height: 52px;
  }
  .lt-field input::placeholder { color: #4b5563; }
  .lt-field input:focus {
    border-color: rgba(61,184,122,.45);
    box-shadow: 0 0 0 3px rgba(61,184,122,.08);
  }

  /* btn row */
  .lt-btn-row { display: flex; gap: .6rem; flex-wrap: wrap; }

  .lt-fetch-btn {
    padding: 1rem 1.6rem;
    background: linear-gradient(135deg, #2a9d5c 0%, #3db87a 100%);
    color: #07080b; border: none; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.78rem, 2.2vw, .95rem);
    font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; transition: transform .18s, box-shadow .2s, opacity .2s;
    width: 100%;
    box-shadow: 0 4px 20px rgba(61,184,122,.25);
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    min-height: 52px; position: relative; overflow: hidden;
  }
  .lt-fetch-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    transition: left .4s;
  }
  .lt-fetch-btn:hover::after { left: 150%; }
  .lt-fetch-btn:active { transform: scale(.97); }
  .lt-fetch-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .lt-fetch-btn:disabled::after { display: none; }

  .lt-refresh-btn {
    padding: 1rem 1.2rem;
    background: rgba(201,151,58,.12);
    border: 1px solid rgba(201,151,58,.25);
    color: #e8b454; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.78rem, 2.2vw, .95rem);
    font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
    cursor: pointer; transition: all .2s;
    min-height: 52px; white-space: nowrap;
    display: flex; align-items: center; gap: .5rem;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .lt-refresh-btn:hover { background: rgba(201,151,58,.2); border-color: rgba(201,151,58,.45); }
  .lt-refresh-btn:disabled { opacity: .4; cursor: not-allowed; }
  .lt-refresh-icon { display: inline-block; }
  .lt-refresh-icon.spinning { animation: lt-refresh-spin .7s linear infinite; }

  /* auto-refresh progress bar */
  .lt-auto-bar-wrap {
    margin-top: .9rem; position: relative; z-index: 1;
  }
  .lt-auto-bar-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.54rem, 1.4vw, .65rem);
    color: #4b5563; letter-spacing: .18em; text-transform: uppercase;
    margin-bottom: .35rem;
    display: flex; justify-content: space-between;
  }
  .lt-auto-bar-track {
    height: 3px; background: rgba(255,255,255,.06);
    border-radius: 99px; overflow: hidden;
  }
  .lt-auto-bar-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #3db87a, #5ee89f);
    transition: width .5s linear;
  }

  /* ── RESULT PANEL ── */
  .lt-result-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 1.4rem 1.2rem;
    margin-bottom: .5rem;
    position: relative; overflow: hidden;
    min-height: 120px;
    display: flex; align-items: center; justify-content: center;
  }
  .lt-result-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #3db87a 35%, #5ee89f 65%, transparent);
    box-shadow: 0 0 16px rgba(61,184,122,.3);
  }
  .lt-result-panel.has-data {
    align-items: flex-start; justify-content: flex-start;
  }

  /* ── STATES ── */
  .lt-state {
    display: flex; flex-direction: column; align-items: center; gap: .5rem;
    opacity: .45; padding: 1.5rem 0;
  }
  .lt-state-icon { font-size: clamp(1.8rem, 5vw, 2.4rem); animation: lt-float 3s ease-in-out infinite; }
  .lt-state-msg {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem);
    color: #6b7280; letter-spacing: .18em; text-transform: uppercase; text-align: center;
  }
  .lt-loader { display: flex; align-items: center; gap: .75rem; padding: 1rem 0; }
  .lt-spinner {
    width: 28px; height: 28px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.07);
    border-top-color: #3db87a; border-right-color: #5ee89f;
    border-radius: 50%; animation: lt-spin .75s linear infinite;
  }
  .lt-loader-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.8vw, .82rem);
    color: #6b7280; letter-spacing: .22em; text-transform: uppercase;
    animation: lt-float 1.5s ease-in-out infinite;
  }
  .lt-error-msg {
    background: rgba(224,82,82,.06); border: 1px solid rgba(224,82,82,.25);
    border-radius: 12px; padding: .85rem 1rem;
    color: #e05252; font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.8vw, .82rem); letter-spacing: .07em;
    display: flex; align-items: center; gap: .6rem; width: 100%;
  }
  .lt-error-msg::before { content: '⚠'; flex-shrink: 0; }

  /* ── RESULT CONTENT ── */
  .lt-result-inner { width: 100%; animation: lt-card-in .4s cubic-bezier(.22,1,.36,1) both; }

  .lt-result-header-row {
    display: flex; align-items: center; gap: .65rem;
    margin-bottom: 1.2rem; flex-wrap: wrap;
    padding-bottom: .75rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .lt-result-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.5vw, .68rem); letter-spacing: .18em; text-transform: uppercase;
    padding: .28rem .75rem; border-radius: 99px;
    background: rgba(61,184,122,.1); border: 1px solid rgba(61,184,122,.22);
    color: #3db87a;
    animation: lt-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
  }
  .lt-result-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .68rem); color: #4b5563;
    letter-spacing: .1em; margin-left: auto;
    display: flex; align-items: center; gap: .4rem;
  }

  /* ── SUMMARY STAT CARDS ── */
  .lt-stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .65rem; margin-bottom: 1.2rem;
  }
  @media (min-width: 480px) { .lt-stat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .lt-stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .lt-stat-tile {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px; padding: .9rem;
    transition: border-color .2s, transform .2s;
    position: relative; overflow: hidden;
  }
  .lt-stat-tile::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .lt-stat-tile.gold-top::before  { background: linear-gradient(90deg, transparent, #c9973a, transparent); }
  .lt-stat-tile.green-top::before { background: linear-gradient(90deg, transparent, #3db87a, transparent); }
  .lt-stat-tile.red-top::before   { background: linear-gradient(90deg, transparent, #e05252, transparent); }
  .lt-stat-tile.blue-top::before  { background: linear-gradient(90deg, transparent, #60a5fa, transparent); }
  .lt-stat-tile.purple-top::before{ background: linear-gradient(90deg, transparent, #a78bfa, transparent); }

  @media (min-width: 900px) {
    .lt-stat-tile:hover { border-color: rgba(61,184,122,.25); transform: translateY(-2px); }
  }

  .lt-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.52rem, 1.4vw, .64rem); letter-spacing: .15em; text-transform: uppercase;
    color: #4b5563; margin-bottom: .35rem;
  }
  .lt-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.2rem, 3.5vw, 1.7rem); line-height: 1;
    letter-spacing: .04em; color: #f0eeeb; word-break: break-word;
  }
  .lt-stat-val.gold   { color: #e8b454; }
  .lt-stat-val.green  { color: #3db87a; }
  .lt-stat-val.red    { color: #e05252; }
  .lt-stat-val.blue   { color: #60a5fa; }
  .lt-stat-val.purple { color: #a78bfa; }
  .lt-stat-val.text   { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(.9rem,2.5vw,1.15rem); font-weight:700; }

  /* Shimmer for loading stats */
  .lt-stat-shimmer {
    height: 1.7rem; border-radius: 6px;
    background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%);
    background-size: 200% 100%;
    animation: lt-shimmer 1.4s infinite;
    margin-bottom: .35rem;
  }

  /* ── CURRENT STATUS GLOW CARD ── */
  .lt-status-card {
    background: rgba(10,20,15,.95);
    border: 1px solid rgba(61,184,122,.2);
    border-radius: 18px; padding: 1.3rem 1.2rem;
    margin-bottom: 1.2rem;
    position: relative; overflow: hidden;
    animation: lt-status-glow 3s ease-in-out infinite;
  }
  .lt-status-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #3db87a 30%, #5ee89f 50%, #3db87a 70%, transparent);
    box-shadow: 0 0 20px rgba(61,184,122,.5);
  }
  .lt-status-card-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.6vw, .72rem);
    letter-spacing: .25em; text-transform: uppercase; color: #3db87a;
    margin-bottom: .6rem;
    display: flex; align-items: center; gap: .5rem;
  }
  .lt-status-card-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.4rem, 4vw, 2.1rem);
    letter-spacing: .05em; color: #f0eeeb; line-height: 1.1;
  }
  .lt-status-card-updated {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.4vw, .66rem);
    color: #4b5563; letter-spacing: .15em; text-transform: uppercase;
    margin-top: .55rem;
    display: flex; align-items: center; gap: .4rem;
  }
  .lt-status-orb {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: rgba(61,184,122,.15); border: 1px solid rgba(61,184,122,.3);
    display: flex; align-items: center; justify-content: center;
    font-size: .75rem;
  }
  .lt-status-bg-glow {
    position: absolute; bottom: -30px; right: -30px;
    width: 160px; height: 160px; border-radius: 50%;
    background: radial-gradient(circle, rgba(61,184,122,.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── STATIONS TABLE ── */
  .lt-table-wrap {
    overflow-x: auto; margin-top: .4rem;
    border-radius: 14px; border: 1px solid rgba(255,255,255,.07);
    max-height: 520px; overflow-y: auto;
  }
  /* custom scrollbar */
  .lt-table-wrap::-webkit-scrollbar { width: 5px; height: 5px; }
  .lt-table-wrap::-webkit-scrollbar-track { background: rgba(255,255,255,.03); border-radius: 99px; }
  .lt-table-wrap::-webkit-scrollbar-thumb { background: rgba(201,151,58,.3); border-radius: 99px; }
  .lt-table-wrap::-webkit-scrollbar-thumb:hover { background: rgba(201,151,58,.55); }

  .lt-table {
    width: 100%; border-collapse: collapse;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.5vw, .72rem); min-width: 560px;
  }
  .lt-table thead { position: sticky; top: 0; z-index: 2; }
  .lt-table thead tr { border-bottom: 1px solid rgba(201,151,58,.2); }
  .lt-table th {
    color: #c9973a; letter-spacing: .12em; text-transform: uppercase;
    padding: .65rem .9rem; text-align: left; font-weight: 700;
    background: rgba(10,12,18,.98); white-space: nowrap;
  }
  .lt-table td {
    color: #9ca3af; padding: .6rem .9rem;
    border-bottom: 1px solid rgba(255,255,255,.05);
    transition: background .15s, color .15s;
    vertical-align: middle;
  }
  .lt-table tbody tr {
    animation: lt-row-in .35s cubic-bezier(.22,1,.36,1) both;
  }
  .lt-table tbody tr:last-child td { border-bottom: none; }

  /* Normal hover */
  .lt-table tbody tr:not(.lt-row-current):hover td {
    background: rgba(201,151,58,.04); color: #f0eeeb;
  }

  /* Current station highlight */
  .lt-row-current td {
    background: rgba(61,184,122,.06) !important;
    color: #f0eeeb !important;
  }
  .lt-row-current { position: relative; }
  .lt-row-current td:first-child::before {
    content: '▶';
    color: #3db87a; font-size: .7rem;
    margin-right: .4rem;
  }

  /* Delay coloring */
  .lt-delay-late { color: #e05252 !important; font-weight: 700; }
  .lt-delay-ok   { color: #3db87a !important; font-weight: 700; }
  .lt-delay-none { color: #4b5563; }

  .lt-td-name    { color: #f0eeeb; }
  .lt-td-timing  { color: #e8b454; font-weight: 700; }
  .lt-td-plat    { color: #60a5fa; }
  .lt-td-halt    { color: #a78bfa; }

  /* Row index for staggered anim */
  ${Array.from({length: 50}, (_, i) =>
    `.lt-table tbody tr:nth-child(${i+1}) { animation-delay: ${i * 0.03}s; }`
  ).join('\n  ')}

  /* ── FOOTER META ── */
  .lt-footer-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.54rem, 1.4vw, .64rem);
    color: #374151; letter-spacing: .15em; text-transform: uppercase;
    text-align: center; margin-top: 1rem; padding-top: .75rem;
    border-top: 1px solid rgba(255,255,255,.05);
    display: flex; align-items: center; justify-content: center; gap: .5rem;
  }

  /* ── RESPONSIVE ── */
  @media (min-width: 600px) {
    .lt-page { padding: 1.8rem 1.5rem 6rem; }
    .lt-filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; }
    .lt-field { flex: 1; min-width: 160px; }
    .lt-fetch-btn { width: auto; flex-shrink: 0; padding: 1rem 1.8rem; }
  }
  @media (min-width: 900px) {
    .lt-page { padding: 2.2rem 2rem 7rem; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const AUTO_REFRESH_INTERVAL = 30; // seconds

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isLate(delay) {
  if (!delay || delay === "—" || delay === "-" || delay === "0min") return false;
  const match = delay.match(/(\d+)/);
  return match ? parseInt(match[1], 10) > 0 : false;
}

// ─── LiveStatCard ─────────────────────────────────────────────────────────────
function LiveStatCard({ label, value, colorClass, topClass, loading }) {
  return (
    <div className={`lt-stat-tile ${topClass ?? ""}`}>
      {loading ? (
        <div className="lt-stat-shimmer" />
      ) : (
        <div className={`lt-stat-val ${colorClass ?? ""}`}>{value ?? "—"}</div>
      )}
      <div className="lt-stat-label">{label}</div>
    </div>
  );
}

// ─── FilterPanel ─────────────────────────────────────────────────────────────
function FilterPanel({ title, children }) {
  return (
    <div className="lt-filter-panel">
      <div className="lt-scan-line" />
      <div className="lt-filter-title">{title}</div>
      <div className="lt-filter-row">{children}</div>
    </div>
  );
}

// ─── StatusGlowCard ──────────────────────────────────────────────────────────
function StatusGlowCard({ status, updatedTime }) {
  return (
    <div className="lt-status-card">
      <div className="lt-status-bg-glow" />
      <div className="lt-status-card-label">
        <div className="lt-live-dot" style={{width:8,height:8}} />
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
  // Try to detect which row is "current" from currentStatus text
  const currentStationName = (() => {
    if (!currentStatus) return null;
    const m = currentStatus.match(/(?:Crossed|At|Arriving at|Departed from|Passing through)\s+(.+?)\s+at/i);
    return m ? m[1].trim().toLowerCase() : null;
  })();

  return (
    <div className="lt-table-wrap">
      <table className="lt-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Station</th>
            <th>Distance</th>
            <th>Timing</th>
            <th>Delay</th>
            <th>Platform</th>
            <th>Halt</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((st, idx) => {
            const late = isLate(st.delay);
            const isCurrent = currentStationName &&
              st.station_name?.toLowerCase().includes(currentStationName);
            return (
              <tr
                key={idx}
                className={isCurrent ? "lt-row-current" : ""}
              >
                <td className="lt-delay-none">{idx + 1}</td>
                <td className="lt-td-name">{st.station_name || "—"}</td>
                <td>{st.distance || "—"}</td>
                <td className="lt-td-timing">{st.timing || "—"}</td>
                <td className={
                  !st.delay || st.delay === "—" || st.delay === "-" ? "lt-delay-none" :
                  late ? "lt-delay-late" : "lt-delay-ok"
                }>
                  {st.delay && st.delay !== "-" ? st.delay : "—"}
                </td>
                <td className="lt-td-plat">{st.platform || "—"}</td>
                <td className="lt-td-halt">{st.halt || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
        <div className="lt-error-msg">{data?.error || "Request failed. Check train number and try again."}</div>
      </div>
    );
  }

  // Success
  const summary  = data?.summary  || {};
  const stations = data?.stations || [];

  return (
    <div className="lt-result-panel has-data">
      <div className="lt-result-inner">

        {/* Header row */}
        <div className="lt-result-header-row">
          <div className="lt-result-badge">Live Status</div>
          <div className="lt-result-meta">
            <span>🕐</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="lt-stat-grid">
          <LiveStatCard
            label="Train Name"
            value={summary.train_name || "—"}
            colorClass="text gold"
            topClass="gold-top"
          />
          <LiveStatCard
            label="Total Stations"
            value={String(summary.total_stations ?? "—")}
            colorClass="blue"
            topClass="blue-top"
          />
          <LiveStatCard
            label="On Time"
            value={String(summary.on_time_stations ?? "—")}
            colorClass="green"
            topClass="green-top"
          />
          <LiveStatCard
            label="Delayed"
            value={String(summary.delayed_stations ?? "—")}
            colorClass="red"
            topClass="red-top"
          />
          <LiveStatCard
            label="Delay Rate"
            value={
              summary.total_stations
                ? `${Math.round((summary.delayed_stations / summary.total_stations) * 100)}%`
                : "—"
            }
            colorClass={
              summary.total_stations && (summary.delayed_stations / summary.total_stations) > 0.4
                ? "red" : "green"
            }
            topClass="purple-top"
          />
        </div>

        {/* Current Status Glow Card */}
        {summary.current_status && (
          <StatusGlowCard
            status={summary.current_status}
            updatedTime={summary.updated_time}
          />
        )}

        {/* Section divider */}
        {stations.length > 0 && (
          <>
            <div className="lt-section-divider" style={{ margin: "1.2rem 0 .8rem" }}>
              <div className="lt-section-label">Station Schedule · {stations.length} Stops</div>
              <div className="lt-section-line" />
            </div>
            <StationsTable stations={stations} currentStatus={summary.current_status} />
          </>
        )}

        <div className="lt-footer-meta">
          <span>⬡</span>
          <span>Railway Intelligence System · Live Module</span>
          <span>⬡</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveTrain() {
  const [trainNo,   setTrainNo]   = useState("");
  const [result,    setResult]    = useState({ status: "idle", data: null });
  const [isRefresh, setIsRefresh] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL);
  const [autoEnabled, setAutoEnabled] = useState(false);

  const lastTrainRef  = useRef("");
  const countdownRef  = useRef(null);
  const autoTimerRef  = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const doFetch = useCallback(async (num, isBackground = false) => {
    if (!num?.trim()) return;
    if (!isBackground) {
      setResult({ status: "loading", data: null });
    }
    try {
      const res  = await fetch(`${API_URI}/api/train/live?train_no=${encodeURIComponent(num.trim())}`, {
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
          // trigger refresh
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
      if (autoTimerRef.current)  clearInterval(autoTimerRef.current);
    };
  }, []);

  const hasResult = result.status === "success";

  return (
    <Navbar>
      <style>{LIVETRAIN_CSS}</style>

      <div className="lt-page">

        {/* ── HERO ── */}
        <div className="lt-header">
          <div className="lt-header-eyebrow">Railway Intelligence System · Live Module</div>
          <h1>
            Live <span className="lt-h1-accent">Train</span>{" "}
            <span className="lt-h1-gold">Intelligence</span>
          </h1>
          <div className="lt-header-sub">Real-Time · Tracking · Railway Network</div>
          <div className="lt-live-badge">
            <div className="lt-live-dot" />
            Live Tracking Active
          </div>
        </div>

        <div className="lt-rail-divider" />

        {/* ── INPUT PANEL ── */}
        <div className="lt-section-divider">
          <div className="lt-section-label">Train Tracker</div>
          <div className="lt-section-line" />
        </div>

        <FilterPanel title="⬡ Live Train Filter">
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
          <div className="lt-btn-row" style={{ position: "relative", zIndex: 1 }}>
            <button
              className="lt-fetch-btn"
              onClick={handleTrack}
              disabled={!trainNo.trim() || result.status === "loading"}
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

          {/* Auto-refresh bar */}
          {autoEnabled && hasResult && (
            <AutoRefreshBar countdown={countdown} total={AUTO_REFRESH_INTERVAL} />
          )}
        </FilterPanel>

        {/* ── RESULT ── */}
        <ResultPanel state={result} />

      </div>
    </Navbar>
  );
}