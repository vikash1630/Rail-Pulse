import React, { useEffect, useState } from "react"
import Navbar from "../../pages/Navbar"

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")

/* ─────────────────────────────────────────────────────────────
   CSS — Zero x-scroll, mobile-first, vertical-only layout
───────────────────────────────────────────────────────────── */
const DB_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

  /* ── KEYFRAMES ── */
  @keyframes spin-cw   { to { transform: rotate(360deg); } }
  @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
  @keyframes card-rise { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes bar-grow  { from { width: 0; } }
  @keyframes float-y   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes scan-line { 0%{top:0%;opacity:.5} 100%{top:100%;opacity:0} }
  @keyframes grid-drift { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes orb-drift  { 0%{transform:translate(0,0)} 40%{transform:translate(40px,-30px)} 80%{transform:translate(-20px,40px)} 100%{transform:translate(0,0)} }
  @keyframes fade-num   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes badge-pop  { 0%{transform:scale(.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes hero-in    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow-pulse { 0%,100%{text-shadow:0 0 20px rgba(201,151,58,.25)} 50%{text-shadow:0 0 50px rgba(201,151,58,.55)} }

  /* ── HARD RESET for x-scroll prevention ── */
  *, *::before, *::after { box-sizing: border-box; }

  .db-root {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;
    font-family: 'Barlow Condensed', sans-serif;
    color: #f0eeeb;
    position: relative;
  }

  .db-root::before {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.03) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: grid-drift 12s linear infinite;
    mask-image: radial-gradient(ellipse 100% 70% at 50% 0%, black 10%, transparent 100%);
  }
  .db-root::after {
    content: '';
    position: fixed; top: -150px; right: -150px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: orb-drift 20s ease-in-out infinite;
  }

  .db-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 100%;
    /* Mobile default — safe horizontal padding */
    padding: 1.4rem .9rem 5rem;
    overflow-x: hidden;
  }

  /* ── HEADER ── */
  .db-header {
    margin-bottom: 2rem;
    animation: hero-in .7s cubic-bezier(.22,1,.36,1) both;
  }

  .db-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: .75rem;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: #c9973a;
    margin-bottom: .9rem;
    display: flex; align-items: center; gap: .6rem;
    opacity: .9;
  }
  .db-eyebrow::before, .db-eyebrow::after {
    content: ''; height: 1px; flex: 1; max-width: 50px;
  }
  .db-eyebrow::before { background: linear-gradient(90deg, #c9973a, transparent); }
  .db-eyebrow::after  { background: linear-gradient(270deg, #c9973a, transparent); }

  .db-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.8rem, 18vw, 9rem);
    font-weight: 400;
    line-height: .88;
    letter-spacing: .04em;
    text-transform: uppercase;
    margin: 0 0 .3rem;
    animation: glow-pulse 4s ease-in-out infinite;
  }
  .db-title .t1 { color: #f0eeeb; display: block; }
  .db-title .t2 { display: block; color: transparent; -webkit-text-stroke: 1.5px #c9973a; }

  .db-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 2vw, .88rem);
    color: #6b7280;
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-top: .5rem;
  }

  /* ── TICKER — 2×2 grid, never overflows ── */
  .db-ticker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .6rem;
    margin-top: 1.6rem;
    width: 100%;
  }
  .db-ticker-card {
    background: rgba(13,16,22,.92);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px;
    padding: 1rem .8rem;
    text-align: center;
    position: relative; overflow: hidden;
    min-width: 0; /* prevent grid blowout */
  }
  .db-ticker-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a, transparent);
  }
  .db-ticker-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.8rem, 9vw, 4.5rem);
    color: #e8b454;
    line-height: 1; letter-spacing: .05em;
    animation: fade-num .7s ease both;
    display: block;
  }
  .db-ticker-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2.2vw, .9rem);
    color: #6b7280; letter-spacing: .2em;
    text-transform: uppercase; margin-top: .3rem;
  }

  /* ── STATUS BAR — stacked on mobile ── */
  .db-status-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem .8rem;
    padding: .9rem 1rem;
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px;
    margin-top: 1.2rem;
    position: relative; overflow: hidden;
    width: 100%;
  }
  .db-status-bar::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.3), transparent);
  }
  .db-status-item {
    display: flex; align-items: center; gap: .45rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.8vw, .75rem);
    color: #6b7280; letter-spacing: .08em; text-transform: uppercase;
    min-width: 0;
  }
  .db-status-item b { color: #f0eeeb; }
  .db-status-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    animation: dot-pulse 2s ease-in-out infinite;
  }
  .dot-green { background: #3db87a; box-shadow: 0 0 7px #3db87a; }
  .dot-gold  { background: #c9973a; box-shadow: 0 0 7px #c9973a; animation-delay: .6s; }
  .dot-amber { background: #d4883a; box-shadow: 0 0 7px #d4883a; animation-delay: 1.2s; }

  /* ── DIVIDER ── */
  .db-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.18), transparent);
    margin: 1.8rem 0;
    width: 100%;
  }

  /* ── SECTION LABEL ── */
  .db-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.75rem, 2.2vw, .95rem);
    letter-spacing: .35em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: .6rem;
  }
  .db-section-label::before {
    content: ''; width: 8px; height: 8px; border-radius: 50%;
    background: #c9973a; box-shadow: 0 0 10px rgba(201,151,58,.7); flex-shrink: 0;
  }

  /* ── HERO STAT GRID — always 2-col on mobile ── */
  .db-hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .7rem;
    margin-bottom: 1.6rem;
    width: 100%;
  }
  .db-hero-stat {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 1.3rem 1rem 1.1rem;
    position: relative; overflow: hidden; min-width: 0;
    animation: card-rise .5s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .25s, transform .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .db-hero-stat::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.5), transparent);
    opacity: 0; transition: opacity .25s;
  }
  .db-hero-stat:active { transform: scale(.96); border-color: rgba(201,151,58,.3); }
  .db-hero-stat:active::before { opacity: 1; }
  .db-hero-stat:active .db-hero-rail { opacity: 1; }

  .db-hero-rail {
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 3px 3px 0; opacity: 0; transition: opacity .25s;
  }
  .db-hero-ghost {
    position: absolute; bottom: -10px; right: 2px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 12vw, 6rem);
    opacity: .04; line-height: 1;
    pointer-events: none; user-select: none;
  }
  .db-hero-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 2vw, .88rem);
    letter-spacing: .2em; text-transform: uppercase;
    color: #6b7280; margin-bottom: .5rem;
  }
  .db-hero-stat-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 10vw, 5.5rem);
    line-height: 1; letter-spacing: .05em;
    animation: fade-num .8s cubic-bezier(.22,1,.36,1) both;
  }
  .db-hero-stat-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.6vw, .78rem);
    color: #4b5563; margin-top: .35rem;
    letter-spacing: .07em; text-transform: uppercase;
  }

  /* ── KPI GRID — 2-col mobile, never wraps weirdly ── */
  .db-kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .65rem;
    margin-bottom: 1.6rem;
    width: 100%;
  }
  .db-kpi-card {
    background: rgba(22,25,32,.98);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px;
    padding: 1.1rem .9rem;
    position: relative; overflow: hidden; min-width: 0;
    animation: card-rise .5s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .2s, transform .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .db-kpi-card:active { transform: scale(.96); border-color: rgba(201,151,58,.22); }

  .db-kpi-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.9vw, .82rem);
    letter-spacing: .18em; text-transform: uppercase;
    color: #6b7280; margin-bottom: .4rem;
  }
  .db-kpi-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.4rem, 4.5vw, 2.1rem);
    font-weight: 700; line-height: 1.2;
    word-break: break-word;
  }
  .db-kpi-unit {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .7rem);
    color: #4b5563; margin-top: .25rem;
    letter-spacing: .07em; text-transform: uppercase;
  }

  /* Colors */
  .c-gold  { color: #e8b454; }
  .c-green { color: #3db87a; }
  .c-red   { color: #e05252; }
  .c-amber { color: #d4883a; }
  .c-muted { color: #9ca3af; }

  /* ── PANEL ── */
  .db-cols {
    display: grid; grid-template-columns: 1fr;
    gap: .9rem; margin-bottom: 1.6rem; width: 100%;
  }
  .db-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px; padding: 1.4rem 1rem;
    position: relative; overflow: hidden; width: 100%; min-width: 0;
    animation: card-rise .5s cubic-bezier(.22,1,.36,1) both;
  }
  .db-panel::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #c9973a 40%, #e8b454 60%, transparent 100%);
    box-shadow: 0 0 12px rgba(201,151,58,.25);
  }
  .db-scan {
    position: absolute; left: 0; right: 0; top: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.25), transparent);
    pointer-events: none; z-index: 2;
    animation: scan-line 6s ease-in-out infinite;
  }

  /* ── CATEGORY BARS ── */
  .db-cat-list { display: flex; flex-direction: column; gap: .9rem; }
  .db-cat-row  { display: flex; align-items: center; gap: .8rem; width: 100%; min-width: 0; }
  .db-cat-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .95rem);
    letter-spacing: .06em; color: #9ca3af;
    width: clamp(90px, 26vw, 160px);
    flex-shrink: 0; text-transform: uppercase;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .db-cat-bar-bg {
    flex: 1; height: 12px;
    background: rgba(31,34,44,1); border-radius: 6px; overflow: hidden;
    min-width: 0;
  }
  .db-cat-bar-fill {
    height: 100%; border-radius: 6px;
    animation: bar-grow 1s cubic-bezier(.22,1,.36,1) both;
  }
  .db-cat-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.4rem, 4vw, 2rem);
    color: #9ca3af;
    width: clamp(44px, 11vw, 58px); text-align: right; flex-shrink: 0;
  }

  /* ── ZONE LIST — always single column bar rows, zero overflow ── */
  .db-zone-grid {
    display: flex; flex-direction: column;
    gap: .75rem; width: 100%;
  }
  .db-zone-item {
    background: rgba(22,25,32,.98);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px; padding: .9rem 1rem;
    display: flex; align-items: center; gap: .8rem;
    animation: card-rise .5s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .2s, transform .18s;
    min-width: 0; width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .db-zone-item:active { border-color: rgba(201,151,58,.28); transform: scale(.98); }
  .db-zone-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .95rem);
    color: #9ca3af; letter-spacing: .06em; text-transform: uppercase;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    flex: 1; min-width: 0;
  }
  /* zone bar takes remaining space */
  .db-zone-bar-wrap {
    width: clamp(60px, 18vw, 140px);
    flex-shrink: 0;
  }
  .db-zone-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 4.5vw, 2.2rem);
    color: #c9973a; line-height: 1; flex-shrink: 0;
    text-shadow: 0 0 14px rgba(201,151,58,.35);
    width: clamp(50px, 12vw, 70px); text-align: right;
  }

  /* ── TRAIN CARDS — replaces table on mobile, no x-scroll ── */
  .db-train-list { display: flex; flex-direction: column; gap: .8rem; width: 100%; }

  .db-train-card {
    background: rgba(22,25,32,.98);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px; padding: 1.1rem 1rem;
    position: relative; overflow: hidden; width: 100%; min-width: 0;
    animation: card-rise .45s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .2s, transform .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .db-train-card:active { transform: scale(.98); border-color: rgba(201,151,58,.25); }
  .db-train-card.flagged { border-color: rgba(224,82,82,.18); }
  .db-train-card.flagged:active { border-color: rgba(224,82,82,.4); }

  /* Card top row: number + name + badge */
  .db-tc-top {
    display: flex; align-items: center; gap: .6rem;
    margin-bottom: .65rem; min-width: 0; flex-wrap: nowrap;
  }
  .db-tc-no {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.8rem, 2.4vw, 1rem);
    font-weight: 700; color: #c9973a;
    background: rgba(201,151,58,.1);
    border: 1px solid rgba(201,151,58,.22);
    padding: .3rem .6rem; border-radius: 8px;
    flex-shrink: 0; white-space: nowrap;
  }
  .db-tc-no.red {
    color: #e05252; background: rgba(224,82,82,.09);
    border-color: rgba(224,82,82,.22);
  }
  .db-tc-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.3rem, 4.5vw, 1.7rem);
    color: #f0eeeb; letter-spacing: .04em;
    text-transform: uppercase; line-height: 1;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    flex: 1; min-width: 0;
  }
  .db-cat-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.6vw, .72rem);
    font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
    padding: .28rem .65rem; border-radius: 8px; white-space: nowrap; flex-shrink: 0;
    animation: badge-pop .4s cubic-bezier(.22,1,.36,1) both;
    border: 1px solid transparent;
  }
  .badge-gold  { background: rgba(201,151,58,.12); color: #e8b454; border-color: rgba(201,151,58,.28); }
  .badge-green { background: rgba(61,184,122,.09);  color: #3db87a; border-color: rgba(61,184,122,.22); }
  .badge-amber { background: rgba(212,136,58,.09);  color: #d4883a; border-color: rgba(212,136,58,.22); }
  .badge-muted { background: rgba(255,255,255,.04); color: #9ca3af; border-color: rgba(255,255,255,.09); }

  /* Card route row */
  .db-tc-route {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.7rem, 2vw, .88rem);
    color: #6b7280; letter-spacing: .05em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    margin-bottom: .75rem; width: 100%;
  }
  .db-tc-route span { color: #4b5563; }

  /* Card stats row: 3 chips */
  .db-tc-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: .5rem;
  }
  .db-tc-stat {
    background: rgba(13,16,22,.8);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px; padding: .6rem .65rem;
    min-width: 0;
  }
  .db-tc-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .7rem);
    color: #4b5563; letter-spacing: .1em; text-transform: uppercase; margin-bottom: .22rem;
  }
  .db-tc-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.05rem, 3.2vw, 1.4rem);
    font-weight: 700; line-height: 1.1;
  }

  /* Score bar inside card */
  .db-tc-score { display: flex; align-items: center; gap: .55rem; margin-top: .65rem; }
  .db-tc-score-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.5vw, .72rem);
    color: #4b5563; letter-spacing: .09em; text-transform: uppercase; flex-shrink: 0;
  }
  .db-score-bg { flex: 1; height: 7px; background: rgba(31,34,44,1); border-radius: 4px; overflow: hidden; min-width: 0; }
  .db-score-fill { height: 100%; border-radius: 4px; animation: bar-grow .9s cubic-bezier(.22,1,.36,1) both; }
  .db-score-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .88rem); font-weight: 700; flex-shrink: 0;
  }

  /* ── LOADER ── */
  .db-loader {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 7rem 2rem; gap: 2rem;
  }
  .db-spinner-wrap { position: relative; width: 72px; height: 72px; }
  .db-spinner-outer {
    width: 72px; height: 72px;
    border: 2px solid rgba(255,255,255,.07);
    border-top-color: #c9973a; border-right-color: #e8b454;
    border-radius: 50%; animation: spin-cw .8s linear infinite;
  }
  .db-spinner-inner {
    position: absolute; top: 11px; left: 11px; right: 11px; bottom: 11px;
    border: 1px solid rgba(201,151,58,.18); border-bottom-color: #c9973a;
    border-radius: 50%; animation: spin-ccw .55s linear infinite;
  }
  .db-spinner-core {
    position: absolute; top: 50%; left: 50%;
    width: 9px; height: 9px; border-radius: 50%;
    background: #c9973a; box-shadow: 0 0 16px #c9973a;
    transform: translate(-50%,-50%);
  }
  .db-loader-text {
    font-family: 'JetBrains Mono', monospace; font-size: .82rem;
    color: #6b7280; letter-spacing: .3em; text-transform: uppercase;
    animation: float-y 1.6s ease-in-out infinite;
  }

  .db-error {
    background: rgba(224,82,82,.07); border: 1px solid rgba(224,82,82,.28);
    border-radius: 16px; padding: 2.5rem 1.5rem;
    text-align: center; font-family: 'JetBrains Mono', monospace;
    font-size: .9rem; color: #e05252; letter-spacing: .06em;
    width: 100%;
  }

  /* ── PANEL VARIANTS ── */
  .db-panel.danger { border-color: rgba(224,82,82,.18); }
  .db-panel.danger::before { background: linear-gradient(90deg, transparent, #e05252 50%, transparent); }

  /* ── FOOTER ── */
  .db-footer {
    margin-top: 3.5rem; padding-top: 1.2rem;
    border-top: 1px solid rgba(31,34,44,1);
    display: flex; flex-direction: column; gap: .4rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.55rem, 1.4vw, .68rem);
    color: #4b5563; letter-spacing: .14em; text-transform: uppercase;
  }
  .db-footer-accent { color: rgba(201,151,58,.55); }

  /* ════════════════════════════════════════════
     RESPONSIVE — tablet 600px+ and desktop 900px+
     Tables come back on desktop where there's room.
     Zone list stays single-column everywhere.
  ════════════════════════════════════════════ */

  /* Phablet 480px+ — status bar goes 4-col */
  @media (min-width: 480px) {
    .db-status-bar { grid-template-columns: repeat(4, auto); justify-content: start; }
  }

  /* Tablet 600px+ */
  @media (min-width: 600px) {
    .db-page { padding: 1.8rem 1.6rem 6rem; }
    .db-ticker { grid-template-columns: repeat(4, 1fr); }
    .db-kpi-grid { grid-template-columns: repeat(3, 1fr); gap: .9rem; }
    .db-tc-stats { grid-template-columns: repeat(4, 1fr); }
    .db-cat-name { font-size: clamp(.8rem, 2vw, 1rem); }
    .db-zone-name { font-size: clamp(.8rem, 2vw, 1rem); }
  }

  /* Tablet landscape 768px+ */
  @media (min-width: 768px) {
    .db-page { padding: 2rem 2rem 6rem; }
    .db-hero-grid { gap: 1.1rem; }
    .db-hero-stat { padding: 1.9rem 1.5rem 1.6rem; }
    .db-hero-stat-value { font-size: clamp(3.2rem, 7vw, 5rem); }
    .db-kpi-grid { grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    /* cols stay single column — zones panel needs full width */
    .db-cols { grid-template-columns: 1fr; gap: 1.2rem; }
    .db-panel { padding: 1.9rem 1.5rem; }
    .db-cat-count { font-size: clamp(1.5rem, 3.5vw, 2rem); }
    .db-zone-count { font-size: clamp(1.6rem, 4vw, 2.2rem); }
  }

  /* Desktop 900px+ — show tables, hide train cards, 2-col panels */
  @media (min-width: 900px) {
    .db-page { padding: 2.5rem 2.2rem 7rem; max-width: 1400px; margin: 0 auto; }
    .db-kpi-grid { grid-template-columns: repeat(6, 1fr); gap: 1.1rem; }

    /* Side-by-side panels only at desktop — both have enough room */
    .db-cols { grid-template-columns: 1fr 1fr; gap: 1.4rem; }

    /* Show table, hide cards — explicit block overrides the default none */
    .db-train-list { display: none !important; }
    .db-table-wrap { display: block !important; }

    /* Hover states */
    .db-hero-stat:hover {
      border-color: rgba(201,151,58,.32);
      transform: translateY(-5px) scale(1.018);
      box-shadow: 0 20px 60px rgba(0,0,0,.45), 0 0 40px rgba(201,151,58,.07);
    }
    .db-hero-stat:hover::before { opacity: 1; }
    .db-hero-stat:hover .db-hero-rail { opacity: 1; }
    .db-kpi-card:hover { border-color: rgba(201,151,58,.22); transform: translateY(-3px); }
    .db-zone-item:hover { border-color: rgba(201,151,58,.28); transform: translateY(-2px); background: rgba(31,34,44,.7); }
    .db-train-card:hover { border-color: rgba(201,151,58,.22); transform: translateY(-2px); }
    .db-table tbody tr:hover td { background: rgba(22,25,32,.9); color: #f0eeeb; }

    /* Bigger zone font on desktop */
    .db-zone-name { font-size: 1rem; letter-spacing: .08em; }
    .db-zone-count { font-size: 2.4rem; }
    .db-cat-name { font-size: 1rem; }
    .db-cat-count { font-size: 2rem; }
    .db-cat-bar-bg { height: 14px; }
  }

  /* Wide desktop 1100px+ — bigger fonts for 3-4m visibility */
  @media (min-width: 1100px) {
    .db-zone-name { font-size: 1.05rem; }
    .db-zone-count { font-size: 2.6rem; }
    .db-cat-name { font-size: 1.05rem; }
    .db-cat-count { font-size: 2.2rem; }
    .db-zone-item { padding: 1.1rem 1.2rem; }
    .db-cat-row { gap: 1rem; }
  }

  /* Large desktop 1200px+ */
  @media (min-width: 1200px) {
    .db-hero-grid { gap: 1.4rem; }
    .db-panel { padding: 2.2rem 1.8rem; }
    .db-kpi-value { font-size: 2rem; }
    .db-hero-stat-value { font-size: clamp(3.5rem, 5.5vw, 5.5rem); }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }

  /* ── TABLE — hidden on mobile, shown on desktop 900px+ ── */
  .db-table-wrap { display: none; border-radius: 12px; overflow: hidden; }
  .db-table { width: 100%; border-collapse: collapse; }
  .db-table th {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.7rem, 1vw, .85rem); letter-spacing: .16em; text-transform: uppercase;
    color: #6b7280; padding: 1rem 1.1rem; text-align: left;
    border-bottom: 1px solid rgba(31,34,44,1); white-space: nowrap;
    background: rgba(13,16,22,.8);
  }
  .db-table td {
    padding: 1.05rem 1.1rem; border-bottom: 1px solid rgba(31,34,44,.8);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1rem, 1.4vw, 1.2rem); font-weight: 500;
    color: #9ca3af; vertical-align: middle;
  }
  .db-table tr:last-child td { border-bottom: none; }
  .db-table tbody tr { transition: background .18s; cursor: pointer; }

  .db-train-no {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.78rem, 1vw, .92rem); font-weight: 700; color: #c9973a;
    display: inline-block; background: rgba(201,151,58,.1);
    border: 1px solid rgba(201,151,58,.2); padding: .28rem .7rem;
    border-radius: 7px; white-space: nowrap;
  }
  .db-train-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.1rem, 1.5vw, 1.45rem); color: #f0eeeb;
    letter-spacing: .04em; white-space: nowrap;
    max-width: 200px; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase;
  }
  .db-score-bar-d { display: flex; align-items: center; gap: .5rem; }
  .db-score-bg-d  { width: 72px; height: 7px; background: rgba(31,34,44,1); border-radius: 4px; overflow: hidden; }
  .db-score-fill-d { height: 100%; border-radius: 4px; animation: bar-grow .9s cubic-bezier(.22,1,.36,1) both; }
  .db-score-num-d {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.7rem, .95vw, .85rem); font-weight: 700;
  }

  /* ── TRAIN DETAIL MODAL ── */
  @keyframes modal-in  { from{opacity:0;transform:translateY(32px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes overlay-in { from{opacity:0} to{opacity:1} }

  .db-modal-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(7,8,11,.82);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: overlay-in .2s ease both;
  }
  .db-modal {
    background: #0d1016;
    border: 1px solid rgba(201,151,58,.25);
    border-radius: 24px;
    width: 100%; max-width: 680px;
    max-height: 90vh; overflow-y: auto;
    position: relative;
    animation: modal-in .3s cubic-bezier(.22,1,.36,1) both;
    scrollbar-width: thin;
    scrollbar-color: rgba(201,151,58,.3) transparent;
  }
  .db-modal::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a 40%, #e8b454 60%, transparent);
    border-radius: 24px 24px 0 0;
    box-shadow: 0 0 20px rgba(201,151,58,.3);
  }
  .db-modal-head {
    padding: 1.8rem 1.8rem 1.2rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
    border-bottom: 1px solid rgba(255,255,255,.06);
    position: sticky; top: 0;
    background: #0d1016; z-index: 2; border-radius: 24px 24px 0 0;
  }
  .db-modal-title-wrap { min-width: 0; }
  .db-modal-no {
    font-family: 'JetBrains Mono', monospace;
    font-size: .82rem; font-weight: 700; color: #c9973a;
    background: rgba(201,151,58,.1); border: 1px solid rgba(201,151,58,.22);
    padding: .3rem .7rem; border-radius: 8px;
    display: inline-block; margin-bottom: .6rem;
  }
  .db-modal-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    color: #f0eeeb; letter-spacing: .05em;
    text-transform: uppercase; line-height: 1;
  }
  .db-modal-close {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
    color: #9ca3af; font-size: 1.3rem; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    transition: background .2s, color .2s, border-color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .db-modal-close:hover { background: rgba(224,82,82,.12); color: #e05252; border-color: rgba(224,82,82,.25); }
  .db-modal-body { padding: 1.4rem 1.8rem 2rem; display: flex; flex-direction: column; gap: 1.2rem; }

  /* Route banner */
  .db-modal-route {
    background: rgba(22,25,32,.95); border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px; padding: 1.1rem 1.2rem;
    display: flex; align-items: center; gap: .8rem; flex-wrap: wrap;
  }
  .db-modal-route-city {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.2rem, 3vw, 1.7rem);
    color: #f0eeeb; letter-spacing: .04em; text-transform: uppercase;
  }
  .db-modal-route-arrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem; color: #c9973a; flex-shrink: 0;
  }

  /* Stat chips grid */
  .db-modal-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: .7rem;
  }
  @media (min-width: 480px) { .db-modal-stats { grid-template-columns: repeat(3, 1fr); } }

  .db-modal-stat {
    background: rgba(22,25,32,.95); border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px; padding: 1rem;
  }
  .db-modal-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .7rem);
    letter-spacing: .18em; text-transform: uppercase;
    color: #4b5563; margin-bottom: .4rem;
  }
  .db-modal-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.2rem, 3.5vw, 1.65rem);
    font-weight: 700; line-height: 1.1; color: #f0eeeb;
  }
  .db-modal-stat-val.gold  { color: #e8b454; }
  .db-modal-stat-val.green { color: #3db87a; }
  .db-modal-stat-val.red   { color: #e05252; }
  .db-modal-stat-val.amber { color: #d4883a; }

  /* Score bar in modal */
  .db-modal-score-row { display: flex; align-items: center; gap: .6rem; }
  .db-modal-score-bg { flex: 1; height: 8px; background: rgba(31,34,44,1); border-radius: 4px; overflow: hidden; }
  .db-modal-score-fill { height: 100%; border-radius: 4px; animation: bar-grow 1s cubic-bezier(.22,1,.36,1) both; }

  /* Section divider in modal */
  .db-modal-section {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.6vw, .75rem);
    letter-spacing: .3em; text-transform: uppercase;
    color: #6b7280; display: flex; align-items: center; gap: .6rem;
    margin-top: .2rem;
  }
  .db-modal-section::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #c9973a; box-shadow: 0 0 8px rgba(201,151,58,.7); flex-shrink: 0;
  }
  .db-modal-section::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.06); }

  /* Modal loader */
  .db-modal-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 4rem 2rem; gap: 1.2rem; flex-direction: column;
  }
  .db-modal-err {
    padding: 2.5rem; text-align: center;
    font-family: 'JetBrains Mono', monospace; font-size: .85rem;
    color: #e05252; letter-spacing: .06em;
  }

  /* Clickable rows/cards show pointer */
  .db-train-card { cursor: pointer; }
`

/* ── Helpers ── */
const fmt   = (n, d = 0) => (n != null ? Number(n).toLocaleString("en-IN", { maximumFractionDigits: d }) : "—")
const fmtCr = n           => (n != null ? `₹${(n / 1e7).toFixed(1)} Cr` : "—")

function catBadgeClass(cat = "") {
  const c = cat.toLowerCase()
  if (c.includes("rajdhani") || c.includes("shatabdi") || c.includes("vande") || c.includes("duronto")) return "badge-gold"
  if (c.includes("express") || c.includes("superfast")) return "badge-green"
  if (c.includes("mail"))  return "badge-amber"
  return "badge-muted"
}
function catBarColor(cat = "") {
  const c = cat.toLowerCase()
  if (c.includes("rajdhani") || c.includes("shatabdi") || c.includes("vande")) return "#c9973a"
  if (c.includes("express") || c.includes("superfast")) return "#3db87a"
  if (c.includes("mail"))  return "#d4883a"
  return "#e05252"
}
function scoreColor(v, max = 100) {
  const p = v / max
  if (p > .75) return "#3db87a"
  if (p > .5)  return "#c9973a"
  if (p > .3)  return "#d4883a"
  return "#e05252"
}
function railColor(color) {
  if (color === "c-gold")  return "linear-gradient(to bottom, #c9973a, #e8b454)"
  if (color === "c-green") return "linear-gradient(to bottom, #3db87a, #56e09a)"
  if (color === "c-amber") return "linear-gradient(to bottom, #d4883a, #f0a050)"
  return "linear-gradient(to bottom, #e05252, #f07070)"
}

/* ── Train Detail Modal ── */
const TrainModal = ({ trainNo, onClose }) => {
  const [train, setTrain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!trainNo) return
    setLoading(true); setError(null); setTrain(null)
    fetch(`${API_URI}/api/train/number?number=${trainNo}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d  => { setTrain(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [trainNo])

  // Close on backdrop click
  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose() }

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const badgeClass = catBadgeClass(train?.TrainCategory || "")

  const stats = train ? [
    { label: "Train No",     val: train.TrainNo,                              cls: "gold"  },
    { label: "Category",     val: train.TrainCategory,                        cls: ""      },
    { label: "Zone",         val: train.RailwayZone,                          cls: ""      },
    { label: "Speed",        val: train.AverageSpeed_kmph != null ? `${fmt(train.AverageSpeed_kmph, 1)} km/h` : "—", cls: "gold"  },
    { label: "Distance",     val: train.Distance_km != null ? `${fmt(train.Distance_km)} km` : "—",                  cls: ""      },
    { label: "Punctuality",  val: train.PunctualityScore != null ? `${fmt(train.PunctualityScore, 1)} / 100` : "—",  cls: train?.PunctualityScore > 75 ? "green" : train?.PunctualityScore > 50 ? "gold" : "amber" },
    { label: "Occupancy",    val: train.OccupancyRate   != null ? `${fmt(train.OccupancyRate, 1)}%`   : "—",         cls: train?.OccupancyRate > 85 ? "amber" : "green" },
    { label: "Delay Risk",   val: train.DelayProbability != null ? `${fmt(train.DelayProbability, 1)}%` : "—",       cls: train?.DelayProbability > 50 ? "red" : "amber" },
    { label: "Route Type",   val: train.RouteType,                            cls: ""      },
    { label: "Stops",        val: train.NumberOfStops != null ? fmt(train.NumberOfStops) : "—", cls: "" },
    { label: "Fare (₹)",     val: train.BaseFare != null ? `₹${fmt(train.BaseFare, 0)}` : "—", cls: "green" },
    { label: "Electrified",  val: train.Electrified != null ? (train.Electrified ? "Yes" : "No") : "—", cls: train?.Electrified ? "green" : "" },
  ].filter(s => s.val && s.val !== "—" && s.val !== "undefined" && s.val !== "null") : []

  const pct = train?.PunctualityScore ?? 0
  const delayPct = train?.DelayProbability ?? 0

  return (
    <div className="db-modal-overlay" onClick={handleOverlay}>
      <div className="db-modal">
        {/* Header */}
        <div className="db-modal-head">
          <div className="db-modal-title-wrap">
            {train && <div className="db-modal-no">{train.TrainNo}</div>}
            <div className="db-modal-name">
              {loading ? "Loading…" : error ? "Error" : train?.TrainName || "Train Details"}
            </div>
            {train && (
              <span className={`db-cat-badge ${badgeClass}`} style={{ marginTop: ".5rem", display: "inline-block" }}>
                {train.TrainCategory}
              </span>
            )}
          </div>
          <button className="db-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="db-modal-body">
          {loading && (
            <div className="db-modal-loading">
              <div className="db-spinner-wrap" style={{ width: 56, height: 56 }}>
                <div className="db-spinner-outer" style={{ width: 56, height: 56 }} />
                <div className="db-spinner-inner" style={{ top: 9, left: 9, right: 9, bottom: 9 }} />
                <div className="db-spinner-core" />
              </div>
              <div className="db-loader-text" style={{ fontSize: ".75rem" }}>Fetching Train Data…</div>
            </div>
          )}

          {error && <div className="db-modal-err">⚠ {error}</div>}

          {train && !loading && (
            <>
              {/* Route */}
              {train.StartingPoint && train.FinalDestination && (
                <>
                  <div className="db-modal-section">Route</div>
                  <div className="db-modal-route">
                    <div className="db-modal-route-city">{train.StartingPoint}</div>
                    <div className="db-modal-route-arrow">→</div>
                    <div className="db-modal-route-city">{train.FinalDestination}</div>
                  </div>
                </>
              )}

              {/* Stats */}
              <div className="db-modal-section">Details</div>
              <div className="db-modal-stats">
                {stats.map(s => (
                  <div key={s.label} className="db-modal-stat">
                    <div className="db-modal-stat-label">{s.label}</div>
                    <div className={`db-modal-stat-val ${s.cls}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Score bars */}
              {pct > 0 && (
                <>
                  <div className="db-modal-section">Performance</div>
                  <div style={{ background:"rgba(22,25,32,.95)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"1.2rem" }}>
                    <div style={{ marginBottom:".9rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".4rem" }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", letterSpacing:".18em", textTransform:"uppercase", color:"#6b7280" }}>Punctuality</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".8rem", fontWeight:700, color: scoreColor(pct, 100) }}>{fmt(pct, 1)}</span>
                      </div>
                      <div className="db-modal-score-bg">
                        <div className="db-modal-score-fill" style={{ width:`${pct}%`, background: scoreColor(pct, 100) }} />
                      </div>
                    </div>
                    {delayPct > 0 && (
                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".4rem" }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", letterSpacing:".18em", textTransform:"uppercase", color:"#6b7280" }}>Delay Risk</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".8rem", fontWeight:700, color:"#e05252" }}>{fmt(delayPct, 1)}%</span>
                        </div>
                        <div className="db-modal-score-bg">
                          <div className="db-modal-score-fill" style={{ width:`${delayPct}%`, background:"#e05252" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */
const Loader = () => (
  <div className="db-loader">
    <div className="db-spinner-wrap">
      <div className="db-spinner-outer" />
      <div className="db-spinner-inner" />
      <div className="db-spinner-core"  />
    </div>
    <div className="db-loader-text">Loading Intelligence…</div>
  </div>
)

const ErrorPanel = ({ msg }) => (
  <div className="db-error">⚠ &nbsp;{msg || "Failed to fetch dashboard data."}</div>
)

const SectionLabel = ({ children }) => (
  <div className="db-section-label">{children}</div>
)

/* ── Main ── */
const DashBoard = () => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [tick,    setTick]    = useState(new Date())
  const [selectedTrain, setSelectedTrain] = useState(null)  // trainNo for modal

  useEffect(() => {
    fetch(`${API_URI}/api/dashBoard`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d  => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = tick.toLocaleTimeString("en-IN", { hour12: false })
  const dateStr = tick.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

  const catEntries  = data ? Object.entries(data.Category_Breakdown || {}).sort((a, b) => b[1] - a[1]) : []
  const zoneEntries = data ? Object.entries(data.Zone_Breakdown     || {}).sort((a, b) => b[1] - a[1]) : []
  const maxCat      = catEntries[0]?.[1]  ?? 1
  const maxZone     = zoneEntries[0]?.[1] ?? 1

  const totalStations = data?.Total_Stations ?? data?.Stops_Count_Row1 ?? "—"
  const avgDelay      = data?.Average_Delay_Prob ?? null
  const electPct      = data?.Electrified_Pct   ?? null
  const totalRev      = data?.Total_Revenue_INR  ?? null
  const avgRating     = data?.Average_Rating     ?? null

  return (
    <Navbar>
      <style>{DB_CSS}</style>
      {selectedTrain && (
        <TrainModal trainNo={selectedTrain} onClose={() => setSelectedTrain(null)} />
      )}
      <div className="db-root">
        <div className="db-page">

          {/* ── HEADER ── */}
          <div className="db-header">
            <div className="db-eyebrow">Railway Intelligence System</div>
            <h1 className="db-title">
              <span className="t1">Network</span>
              <span className="t2">Overview</span>
            </h1>
            <p className="db-subtitle">Live Operations · Indian Railway Analytics</p>

            {/* TICKER — 4 key numbers large */}
            {data && (
              <div className="db-ticker">
                {[
                  { val: fmt(data.Total_Trains),         label: "Trains"   },
                  { val: fmt(data.Unique_Railway_Zones), label: "Zones"    },
                  { val: fmt(totalStations),             label: "Stations" },
                  { val: fmt(data.Unique_Routes),        label: "Routes"   },
                ].map((t, i) => (
                  <div key={t.label} className="db-ticker-card" style={{ animationDelay: `${i * .08}s` }}>
                    <span className="db-ticker-val">{t.val}</span>
                    <div className="db-ticker-label">{t.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* STATUS BAR */}
            <div className="db-status-bar">
              <div className="db-status-item">
                <div className="db-status-dot dot-green" />
                <span>Systems <b>Nominal</b></span>
              </div>
              <div className="db-status-item">
                <div className="db-status-dot dot-gold" />
                <span>Feed <b>Live</b></span>
              </div>
              <div className="db-status-item">
                <div className="db-status-dot dot-amber" />
                <span>IST <b>{timeStr}</b></span>
              </div>
              <div className="db-status-item" style={{ marginLeft: "auto" }}>
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* ── LOADING / ERROR ── */}
          {loading && <Loader />}
          {!loading && error && <ErrorPanel msg={error} />}

          {!loading && !error && data && (
            <>
              {/* ── HERO STATS ── */}
              <SectionLabel>Core Network Metrics</SectionLabel>
              <div className="db-hero-grid">
                {[
                  { label: "Total Trains",   value: fmt(data.Total_Trains),           color: "c-gold",  ghost: "TR", sub: "across network",       d: 0    },
                  { label: "Railway Zones",  value: fmt(data.Unique_Railway_Zones),   color: "c-green", ghost: "ZN", sub: "operational zones",     d: .07  },
                  { label: "Unique Routes",  value: fmt(data.Unique_Routes),          color: "c-gold",  ghost: "RT", sub: "distinct itineraries",  d: .14  },
                  { label: "Total Stations", value: fmt(totalStations),               color: "c-amber", ghost: "ST", sub: "network stations",      d: .21  },
                ].map(s => (
                  <div key={s.label} className="db-hero-stat" style={{ animationDelay: `${s.d}s` }}>
                    <div className="db-hero-rail" style={{ background: railColor(s.color) }} />
                    <div className="db-hero-ghost">{s.ghost}</div>
                    <div className="db-hero-stat-label">{s.label}</div>
                    <div className={`db-hero-stat-value ${s.color}`}>{s.value}</div>
                    <div className="db-hero-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="db-divider" />

              {/* ── KPI GRID ── */}
              <SectionLabel>Performance Averages</SectionLabel>
              <div className="db-kpi-grid">
                {[
                  { label: "Avg Speed",     value: `${fmt(data.Average_Speed, 1)} km/h`,         color: "c-gold",  unit: "fleet average",    d: 0    },
                  { label: "Avg Distance",  value: `${fmt(data.Average_Distance, 0)} km`,          color: "c-green", unit: "per route",         d: .05  },
                  { label: "Avg Occupancy", value: `${fmt(data.Average_Occupancy, 1)}%`,           color: (data.Average_Occupancy ?? 0) > 85 ? "c-amber" : "c-green", unit: "utilisation", d: .1  },
                  { label: "Punctuality",   value: fmt(data.Average_Punctuality, 1),               color: (data.Average_Punctuality ?? 0) > 75 ? "c-green" : "c-gold", unit: "score / 100",   d: .15  },
                  ...(avgDelay  != null ? [{ label: "Delay Risk",  value: `${fmt(avgDelay, 1)}%`,  color: "c-red",   unit: "avg probability",  d: .20 }] : []),
                  ...(electPct  != null ? [{ label: "Electrified", value: `${fmt(electPct, 1)}%`,  color: "c-green", unit: "routes on grid",   d: .25 }] : []),
                  ...(avgRating != null ? [{ label: "Rating",      value: `${fmt(avgRating, 2)}/5`,color: "c-gold",  unit: "passenger score",  d: .30 }] : []),
                  ...(totalRev  != null ? [{ label: "Revenue",     value: fmtCr(totalRev),          color: "c-green", unit: "total network",    d: .35 }] : []),
                  { label: "Categories", value: `${catEntries.length}`,  color: "c-amber", unit: "train types",    d: .40 },
                  { label: "Zones",      value: `${zoneEntries.length}`, color: "c-gold",  unit: "tracked zones",  d: .45 },
                  ...((data.High_Delay_Risk_Trains ?? []).length > 0 ? [{ label: "High Delay", value: `${data.High_Delay_Risk_Trains.length}`, color: "c-red",   unit: "flagged trains", d: .50 }] : []),
                  ...((data.Top_Punctual_Trains    ?? []).length > 0 ? [{ label: "Top Trains", value: `${data.Top_Punctual_Trains.length}`,    color: "c-green", unit: "best in class",  d: .55 }] : []),
                ].map(k => (
                  <div key={k.label} className="db-kpi-card" style={{ animationDelay: `${k.d}s` }}>
                    <div className="db-kpi-label">{k.label}</div>
                    <div className={`db-kpi-value ${k.color}`}>{k.value}</div>
                    <div className="db-kpi-unit">{k.unit}</div>
                  </div>
                ))}
              </div>

              <div className="db-divider" />

              {/* ── FLEET COMPOSITION ── */}
              <SectionLabel>Fleet Composition</SectionLabel>
              <div className="db-cols">

                {/* Categories panel */}
                <div className="db-panel">
                  <div className="db-scan" />
                  <SectionLabel>Train Categories</SectionLabel>
                  <div className="db-cat-list">
                    {catEntries.map(([cat, count], i) => (
                      <div key={cat} className="db-cat-row" style={{ animationDelay: `${i * .055}s` }}>
                        <div className="db-cat-name">{cat}</div>
                        <div className="db-cat-bar-bg">
                          <div
                            className="db-cat-bar-fill"
                            style={{ width: `${(count / maxCat) * 100}%`, background: catBarColor(cat), animationDelay: `${i * .06}s` }}
                          />
                        </div>
                        <div className="db-cat-count">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zones panel */}
                <div className="db-panel">
                  <div className="db-scan" />
                  <SectionLabel>Railway Zones</SectionLabel>
                  <div className="db-zone-grid">
                    {zoneEntries.map(([zone, count], i) => (
                      <div key={zone} className="db-zone-item" style={{ animationDelay: `${i * .04}s` }}>
                        <div className="db-zone-name">{zone}</div>
                        <div className="db-zone-bar-wrap">
                          <div className="db-cat-bar-bg" style={{ height: "8px" }}>
                            <div className="db-cat-bar-fill" style={{ width: `${(count / maxZone) * 100}%`, background: "#c9973a", animationDelay: `${i * .05}s` }} />
                          </div>
                        </div>
                        <div className="db-zone-count">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── TOP PUNCTUAL TRAINS ── */}
              {(data.Top_Punctual_Trains ?? []).length > 0 && (
                <>
                  <div className="db-divider" />
                  <SectionLabel>Top Punctual Trains</SectionLabel>
                  <div className="db-panel" style={{ marginBottom: "1.2rem" }}>
                    <div className="db-scan" />

                    {/* ── MOBILE: train cards (shown < 900px) ── */}
                    <div className="db-train-list">
                      {data.Top_Punctual_Trains.map((t, i) => (
                        <div key={t.TrainNo} className="db-train-card" style={{ animationDelay: `${i * .055}s` }}
                          onClick={() => setSelectedTrain(t.TrainNo)}>
                          <div className="db-tc-top">
                            <span className="db-tc-no">{t.TrainNo}</span>
                            <div className="db-tc-name">{t.TrainName}</div>
                            <span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span>
                          </div>
                          <div className="db-tc-route">
                            {t.StartingPoint} <span>→</span> {t.FinalDestination}
                          </div>
                          <div className="db-tc-stats">
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Speed</div>
                              <div className="db-tc-stat-val c-gold">{fmt(t.AverageSpeed_kmph, 1)} <span style={{fontSize:"clamp(.6rem,1.5vw,.7rem)",color:"#6b7280"}}>km/h</span></div>
                            </div>
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Dist</div>
                              <div className="db-tc-stat-val c-muted">{fmt(t.Distance_km)} <span style={{fontSize:"clamp(.6rem,1.5vw,.7rem)",color:"#6b7280"}}>km</span></div>
                            </div>
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Zone</div>
                              <div className="db-tc-stat-val c-muted" style={{fontSize:"clamp(.8rem,2.2vw,1rem)"}}>{t.RailwayZone}</div>
                            </div>
                          </div>
                          <div className="db-tc-score">
                            <div className="db-tc-score-label">Punctuality</div>
                            <div className="db-score-bg">
                              <div className="db-score-fill" style={{ width: `${t.PunctualityScore ?? 0}%`, background: scoreColor(t.PunctualityScore, 100), animationDelay: `${i * .08}s` }} />
                            </div>
                            <span className="db-score-num" style={{ color: scoreColor(t.PunctualityScore, 100) }}>{fmt(t.PunctualityScore, 1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── DESKTOP: table (shown ≥ 900px) ── */}
                    <div className="db-table-wrap">
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>No.</th><th>Name</th><th>Category</th><th>Route</th>
                            <th>Punctuality</th><th>Speed</th><th>Dist</th><th>Zone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.Top_Punctual_Trains.map((t, i) => (
                            <tr key={t.TrainNo} onClick={() => setSelectedTrain(t.TrainNo)}>
                              <td><span className="db-train-no">{t.TrainNo}</span></td>
                              <td><div className="db-train-name">{t.TrainName}</div></td>
                              <td><span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span></td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.62rem,1vw,.76rem)", color:"#6b7280", whiteSpace:"nowrap", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis" }}>
                                {t.StartingPoint} → {t.FinalDestination}
                              </td>
                              <td>
                                <div className="db-score-bar-d">
                                  <div className="db-score-bg-d">
                                    <div className="db-score-fill-d" style={{ width:`${t.PunctualityScore??0}%`, background:scoreColor(t.PunctualityScore,100), animationDelay:`${i*.08}s` }} />
                                  </div>
                                  <span className="db-score-num-d" style={{ color:scoreColor(t.PunctualityScore,100) }}>{fmt(t.PunctualityScore,1)}</span>
                                </div>
                              </td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.66rem,.9vw,.8rem)", color:"#c9973a" }}>
                                {fmt(t.AverageSpeed_kmph,1)}<span style={{color:"#6b7280"}}> km/h</span>
                              </td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.66rem,.9vw,.8rem)", color:"#6b7280" }}>{fmt(t.Distance_km)} km</td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.58rem,.82vw,.7rem)", color:"#6b7280" }}>{t.RailwayZone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ── HIGH DELAY RISK ── */}
              {(data.High_Delay_Risk_Trains ?? []).length > 0 && (
                <>
                  <div className="db-divider" />
                  <SectionLabel>High Delay Risk — Flagged Trains</SectionLabel>
                  <div className="db-panel danger">
                    <div className="db-scan" />

                    {/* ── MOBILE: train cards ── */}
                    <div className="db-train-list">
                      {data.High_Delay_Risk_Trains.map((t, i) => (
                        <div key={t.TrainNo} className="db-train-card flagged" style={{ animationDelay: `${i * .055}s` }}
                          onClick={() => setSelectedTrain(t.TrainNo)}>
                          <div className="db-tc-top">
                            <span className="db-tc-no red">{t.TrainNo}</span>
                            <div className="db-tc-name">{t.TrainName}</div>
                            <span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span>
                          </div>
                          <div className="db-tc-route">
                            {t.StartingPoint} <span>→</span> {t.FinalDestination}
                          </div>
                          <div className="db-tc-stats">
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Speed</div>
                              <div className="db-tc-stat-val c-gold">{fmt(t.AverageSpeed_kmph, 1)} <span style={{fontSize:"clamp(.6rem,1.5vw,.7rem)",color:"#6b7280"}}>km/h</span></div>
                            </div>
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Dist</div>
                              <div className="db-tc-stat-val c-muted">{fmt(t.Distance_km)} <span style={{fontSize:"clamp(.6rem,1.5vw,.7rem)",color:"#6b7280"}}>km</span></div>
                            </div>
                            <div className="db-tc-stat">
                              <div className="db-tc-stat-label">Zone</div>
                              <div className="db-tc-stat-val c-muted" style={{fontSize:"clamp(.8rem,2.2vw,1rem)"}}>{t.RailwayZone}</div>
                            </div>
                          </div>
                          <div className="db-tc-score">
                            <div className="db-tc-score-label">Delay Risk</div>
                            <div className="db-score-bg">
                              <div className="db-score-fill" style={{ width: `${t.DelayProbability ?? 0}%`, background: "#e05252", animationDelay: `${i * .08}s` }} />
                            </div>
                            <span className="db-score-num" style={{ color: "#e05252" }}>{fmt(t.DelayProbability, 1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── DESKTOP: table ── */}
                    <div className="db-table-wrap">
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>No.</th><th>Name</th><th>Category</th><th>Route</th>
                            <th>Delay Risk</th><th>Speed</th><th>Dist</th><th>Zone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.High_Delay_Risk_Trains.map((t, i) => (
                            <tr key={t.TrainNo} onClick={() => setSelectedTrain(t.TrainNo)}>
                              <td><span className="db-train-no" style={{ color:"#e05252", borderColor:"rgba(224,82,82,.25)", background:"rgba(224,82,82,.09)" }}>{t.TrainNo}</span></td>
                              <td><div className="db-train-name">{t.TrainName}</div></td>
                              <td><span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span></td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.62rem,1vw,.76rem)", color:"#6b7280", whiteSpace:"nowrap", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis" }}>
                                {t.StartingPoint} → {t.FinalDestination}
                              </td>
                              <td>
                                <div className="db-score-bar-d">
                                  <div className="db-score-bg-d">
                                    <div className="db-score-fill-d" style={{ width:`${t.DelayProbability??0}%`, background:"#e05252", animationDelay:`${i*.08}s` }} />
                                  </div>
                                  <span className="db-score-num-d" style={{ color:"#e05252" }}>{fmt(t.DelayProbability,1)}%</span>
                                </div>
                              </td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.66rem,.9vw,.8rem)", color:"#c9973a" }}>
                                {fmt(t.AverageSpeed_kmph,1)}<span style={{color:"#6b7280"}}> km/h</span>
                              </td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.66rem,.9vw,.8rem)", color:"#6b7280" }}>{fmt(t.Distance_km)} km</td>
                              <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.58rem,.82vw,.7rem)", color:"#6b7280" }}>{t.RailwayZone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ── FOOTER ── */}
              <div className="db-footer">
                <span>Railway Intelligence System © 2025</span>
                <span className="db-footer-accent">▶ ALL SYSTEMS OPERATIONAL</span>
                <span>Dataset · 1005 Trains · Powered by RI/Core</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Navbar>
  )
}

export default DashBoard