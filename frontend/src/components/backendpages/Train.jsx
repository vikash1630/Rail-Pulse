import React, { useState, useCallback, useEffect, useRef } from "react"
import Navbar from "../../pages/Navbar"

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")

/* ─────────────────────────────────────────────
   CSS — PEAK EFFECTS EDITION
───────────────────────────────────────────── */
const TRAIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  /* ── KEYFRAMES ── */
  @keyframes tw-spin       { to { transform: rotate(360deg); } }
  @keyframes tw-card-in    { from { opacity:0; transform:translateY(20px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes tw-glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(201,151,58,.15), 0 0 60px rgba(201,151,58,.05)} 50%{box-shadow:0 0 40px rgba(201,151,58,.35), 0 0 120px rgba(201,151,58,.12)} }
  @keyframes tw-rail-flow  { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes tw-shimmer    { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes tw-float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes tw-scan       { 0%{top:0%;opacity:.6} 100%{top:100%;opacity:0} }
  @keyframes tw-badge-pop  { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes tw-number-in  { from{letter-spacing:.6em;opacity:0} to{letter-spacing:.25em;opacity:1} }
  @keyframes tw-bg-move    { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes tw-orb-drift  { 0%{transform:translate(0,0)} 33%{transform:translate(40px,-30px)} 66%{transform:translate(-20px,40px)} 100%{transform:translate(0,0)} }
  @keyframes tw-line-expand { from{width:0;opacity:0} to{width:100%;opacity:1} }
  @keyframes tw-title-in   { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes tw-hero-rise  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  /* ── PAGE SHELL ── */
  .tw-page {
    min-height: 100vh;
    padding: 2rem 1rem 5rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }

  /* Grid texture */
  .tw-page::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.04) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: tw-bg-move 8s linear infinite;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%);
  }

  /* Floating orbs — PC-only heavy effect */
  .tw-page::after {
    content: '';
    position: fixed;
    top: -200px; right: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: tw-orb-drift 18s ease-in-out infinite;
  }

  .tw-page > * { position: relative; z-index: 1; }

  /* ── HERO HEADER ── */
  .tw-header {
    margin-bottom: 3rem;
    padding-top: 1rem;
    animation: tw-hero-rise .8s cubic-bezier(.22,1,.36,1) both;
  }

  .tw-header-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .6rem;
    letter-spacing: .5em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: .8rem;
    opacity: .8;
  }
  .tw-header-eyebrow::before,
  .tw-header-eyebrow::after {
    content: '';
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    flex: 1;
    max-width: 60px;
  }
  .tw-header-eyebrow::after {
    background: linear-gradient(270deg, var(--gold), transparent);
  }

  .tw-header h1 {
    font-family: 'Bebas Neue', 'Impact', sans-serif;
    font-size: clamp(3.5rem, 10vw, 7rem);
    font-weight: 400;
    color: var(--text-1);
    letter-spacing: .04em;
    line-height: .9;
    text-transform: uppercase;
  }
  .tw-header h1 .tw-h1-accent {
    color: transparent;
    -webkit-text-stroke: 1px var(--gold);
    text-stroke: 1px var(--gold);
    position: relative;
  }
  .tw-header h1 .tw-h1-accent::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    color: var(--gold);
    clip-path: inset(0 60% 0 0);
    animation: tw-title-in 2s cubic-bezier(.22,1,.36,1) 0.4s both;
  }

  .tw-header-sub {
    font-size: .8rem;
    color: var(--text-3);
    margin-top: 1rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    font-family: 'Space Mono', monospace;
  }

  /* Stat ticker below header */
  .tw-ticker {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .tw-ticker-item {
    display: flex;
    align-items: baseline;
    gap: .4rem;
  }
  .tw-ticker-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: var(--gold-light);
    letter-spacing: .06em;
    line-height: 1;
  }
  .tw-ticker-label {
    font-size: .6rem;
    color: var(--text-3);
    letter-spacing: .2em;
    text-transform: uppercase;
    font-family: 'Space Mono', monospace;
  }
  .tw-ticker-divider {
    width: 1px;
    height: 30px;
    background: var(--glass-border);
    align-self: center;
  }

  /* ── RAIL DIVIDER ── */
  .tw-rail-divider {
    height: 24px;
    margin: 1.5rem 0;
    position: relative;
    overflow: hidden;
  }
  .tw-rail-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: 2px;
    background: repeating-linear-gradient(90deg,
      var(--glass-border) 0px,
      var(--glass-border) 20px,
      transparent 20px,
      transparent 30px
    );
    transform: translateY(-50%);
    animation: tw-rail-flow 2s linear infinite;
  }
  .tw-rail-divider::after {
    content: '▶';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gold);
    font-size: .7rem;
    animation: tw-float 2s ease-in-out infinite;
  }

  /* ── TABS ── */
  .tw-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: .35rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .tw-tab {
    padding: .65rem .5rem;
    border-radius: 10px;
    font-family: 'Space Mono', monospace;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--text-3);
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    cursor: pointer;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
  }
  .tw-tab::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,151,58,.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity .25s;
  }
  .tw-tab:hover { color: var(--text-1); border-color: rgba(201,151,58,.3); transform: translateY(-2px); }
  .tw-tab:hover::before { opacity: 1; }
  .tw-tab.active {
    background: var(--gold-pale);
    color: var(--gold-light);
    border-color: rgba(201,151,58,.4);
    box-shadow: 0 0 30px rgba(201,151,58,.12), inset 0 1px 0 rgba(201,151,58,.2);
    transform: translateY(-2px);
    animation: tw-glow-pulse 3s ease-in-out infinite;
  }
  .tw-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 20%; right: 20%;
    height: 2px;
    background: var(--gold);
    border-radius: 99px;
    box-shadow: 0 0 8px var(--gold);
  }

  /* Shimmer on active tab */
  .tw-tab.active::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 60px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
    animation: tw-shimmer 2.5s ease-in-out infinite;
    opacity: 1;
  }

  /* ── SEARCH PANEL ── */
  .tw-search-panel {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 1.6rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
  }
  .tw-search-panel:focus-within {
    border-color: rgba(201,151,58,.35);
    box-shadow: 0 0 60px rgba(201,151,58,.08), 0 20px 60px rgba(0,0,0,.4);
  }

  /* Top shimmer line */
  .tw-search-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 60%, transparent 100%);
    opacity: .5;
  }

  /* Corner accent */
  .tw-search-panel::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 60px; height: 60px;
    background:
      linear-gradient(225deg, rgba(201,151,58,.08) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Scan line effect on panel — desktop only */
  @media (min-width: 900px) {
    .tw-search-panel .tw-scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,151,58,.25), transparent);
      animation: tw-scan 4s ease-in-out infinite;
      pointer-events: none;
      z-index: 10;
    }
  }

  .tw-search-row { display: flex; gap: .75rem; flex-wrap: wrap; align-items: flex-end; }

  .tw-field { flex: 1; min-width: 160px; display: flex; flex-direction: column; gap: .4rem; }
  .tw-field label {
    font-family: 'Space Mono', monospace;
    font-size: .58rem;
    font-weight: 700;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: .4rem;
  }
  .tw-field label::before {
    content: '';
    display: block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 6px var(--gold);
    flex-shrink: 0;
  }

  .tw-field input, .tw-field select {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    color: var(--text-1);
    font-family: 'DM Sans', sans-serif;
    font-size: .92rem;
    padding: .78rem 1.1rem;
    outline: none;
    transition: border-color .25s, box-shadow .25s, background .25s;
    width: 100%;
    -webkit-appearance: none;
  }
  .tw-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23c9973a'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
    cursor: pointer;
  }
  .tw-field input::placeholder { color: var(--text-3); }
  .tw-field input:focus, .tw-field select:focus {
    border-color: rgba(201,151,58,.5);
    background: var(--ink-2);
    box-shadow:
      0 0 0 3px rgba(201,151,58,.08),
      0 0 30px rgba(201,151,58,.06),
      inset 0 1px 0 rgba(201,151,58,.08);
  }
  .tw-field select option { background: var(--ink-3); }

  /* ── SEARCH BUTTON ── */
  .tw-search-btn {
    padding: .78rem 2rem;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: var(--ink);
    border: none;
    border-radius: 12px;
    font-family: 'Space Mono', monospace;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    white-space: nowrap;
    flex-shrink: 0;
    height: fit-content;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(201,151,58,.25);
  }
  .tw-search-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    transition: left .4s ease;
  }
  .tw-search-btn:hover {
    box-shadow: 0 8px 40px rgba(201,151,58,.5), 0 0 60px rgba(201,151,58,.2);
    transform: translateY(-2px) scale(1.02);
  }
  .tw-search-btn:hover::before { left: 100%; }
  .tw-search-btn:active { transform: translateY(0) scale(.98); }
  .tw-search-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── ERROR ── */
  .tw-error-msg {
    margin-top: 1rem;
    background: rgba(224,82,82,.06);
    border: 1px solid rgba(224,82,82,.25);
    border-radius: 12px;
    padding: .9rem 1.2rem;
    color: var(--sig-red);
    font-family: 'Space Mono', monospace;
    font-size: .72rem;
    letter-spacing: .08em;
    display: flex;
    align-items: center;
    gap: .6rem;
  }
  .tw-error-msg::before { content: '⚠'; font-size: .9rem; flex-shrink: 0; }

  /* ── STATES ── */
  .tw-state { text-align: center; padding: 5rem 2rem; }
  .tw-state-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1.2rem;
    animation: tw-float 3s ease-in-out infinite;
    filter: grayscale(.5);
  }
  .tw-state-msg {
    font-family: 'Space Mono', monospace;
    color: var(--text-3);
    font-size: .72rem;
    letter-spacing: .2em;
    text-transform: uppercase;
  }

  /* ── SPINNER ── */
  .tw-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 2rem;
    gap: 2rem;
  }
  .tw-spinner-wrap { position: relative; width: 60px; height: 60px; }
  .tw-spinner {
    width: 60px; height: 60px;
    border: 2px solid var(--glass-border);
    border-top-color: var(--gold);
    border-right-color: var(--gold-light);
    border-radius: 50%;
    animation: tw-spin .7s linear infinite;
  }
  .tw-spinner-inner {
    position: absolute;
    top: 10px; left: 10px;
    right: 10px; bottom: 10px;
    border: 1px solid rgba(201,151,58,.2);
    border-bottom-color: var(--gold);
    border-radius: 50%;
    animation: tw-spin .5s linear infinite reverse;
  }
  .tw-spinner-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 12px var(--gold);
    transform: translate(-50%,-50%);
  }
  .tw-loader-text {
    font-family: 'Space Mono', monospace;
    font-size: .65rem;
    color: var(--text-3);
    letter-spacing: .35em;
    text-transform: uppercase;
    animation: tw-float 1.5s ease-in-out infinite;
  }

  /* ── RESULTS HEADER ── */
  .tw-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: .75rem;
    border-bottom: 1px solid var(--glass-border);
  }
  .tw-results-label {
    font-family: 'Space Mono', monospace;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .35em;
    text-transform: uppercase;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: .6rem;
  }
  .tw-results-label::before {
    content: '';
    width: 16px; height: 2px;
    background: var(--gold);
    border-radius: 99px;
  }
  .tw-results-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    color: var(--gold-light);
    letter-spacing: .1em;
    background: var(--gold-pale);
    padding: .15rem .9rem;
    border-radius: 99px;
    border: 1px solid rgba(201,151,58,.25);
    box-shadow: 0 0 20px rgba(201,151,58,.1);
    animation: tw-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── CARDS GRID ── */
  .tw-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 560px) { .tw-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .tw-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── TRAIN CARD ── */
  .tw-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem;
    position: relative;
    overflow: hidden;
    transition: border-color .3s, box-shadow .35s, transform .35s;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    cursor: default;
  }
  .tw-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(201,151,58,.5) 50%, transparent 100%);
    opacity: 0;
    transition: opacity .3s;
  }

  /* Shimmer on hover — desktop */
  @media (min-width: 900px) {
    .tw-card::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 50%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.025), transparent);
      transition: left .6s ease;
      pointer-events: none;
    }
    .tw-card:hover::after { left: 150%; }
    .tw-card:hover {
      border-color: rgba(201,151,58,.35);
      box-shadow:
        0 20px 60px rgba(0,0,0,.5),
        0 0 0 1px rgba(201,151,58,.08),
        0 0 40px rgba(201,151,58,.06);
      transform: translateY(-4px) scale(1.01);
    }
  }

  .tw-card:hover::before { opacity: 1; }

  /* Left accent bar */
  .tw-card-rail {
    position: absolute;
    left: 0; top: 15%; bottom: 15%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(to bottom, var(--gold), var(--gold-light));
    box-shadow: 0 0 12px var(--gold-glow);
    opacity: 0;
    transition: opacity .3s;
  }
  .tw-card:hover .tw-card-rail { opacity: 1; }

  .tw-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: .5rem;
  }

  .tw-train-no {
    font-family: 'Space Mono', monospace;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .2em;
    color: var(--gold);
    background: var(--gold-pale);
    border: 1px solid rgba(201,151,58,.2);
    padding: .28rem .7rem;
    border-radius: 6px;
  }

  .tw-cat-badge {
    font-family: 'Space Mono', monospace;
    font-size: .55rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: .28rem .7rem;
    border-radius: 6px;
    white-space: nowrap;
  }
  .tw-cat-badge.rajdhani  { background:rgba(201,151,58,.12); color:var(--gold-light);  border:1px solid rgba(201,151,58,.2); }
  .tw-cat-badge.express   { background:rgba(61,184,122,.08);  color:var(--sig-green);   border:1px solid rgba(61,184,122,.2); }
  .tw-cat-badge.mail      { background:rgba(212,136,58,.08);  color:var(--sig-amber);   border:1px solid rgba(212,136,58,.2); }
  .tw-cat-badge.passenger { background:rgba(255,255,255,.04); color:var(--text-2);      border:1px solid var(--glass-border); }
  .tw-cat-badge.superfast { background:rgba(201,151,58,.12);  color:var(--gold-light);  border:1px solid rgba(201,151,58,.2); }
  .tw-cat-badge.default   { background:rgba(255,255,255,.04); color:var(--text-2);      border:1px solid var(--glass-border); }

  .tw-train-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--text-1);
    letter-spacing: .06em;
    line-height: 1.1;
    margin-bottom: .25rem;
    text-transform: uppercase;
  }
  .tw-train-zone {
    font-family: 'Space Mono', monospace;
    font-size: .6rem;
    color: var(--text-3);
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  /* ── ROUTE STRIP ── */
  .tw-route {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: 1rem 0;
    padding: .85rem 1rem;
    background: var(--ink-3);
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    position: relative;
    overflow: hidden;
  }
  .tw-route::after {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.15), transparent);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .tw-route-city { flex: 1; min-width: 0; }
  .tw-route-city-name {
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    font-weight: 600;
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tw-route-city-label {
    font-family: 'Space Mono', monospace;
    font-size: .55rem;
    color: var(--text-3);
    letter-spacing: .18em;
    text-transform: uppercase;
    margin-top: .1rem;
  }

  .tw-route-mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .tw-route-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 8px var(--gold-glow);
  }
  .tw-route-line {
    width: 36px; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 99px;
    opacity: .5;
    position: relative;
  }
  .tw-route-line::after {
    content: '›';
    position: absolute;
    right: -5px;
    top: -9px;
    font-size: .75rem;
    color: var(--gold);
    opacity: .8;
  }

  /* ── META CHIPS ── */
  .tw-meta-row { display: flex; gap: .4rem; flex-wrap: wrap; margin-top: .75rem; }
  .tw-meta-chip {
    display: flex;
    align-items: center;
    gap: .3rem;
    font-family: 'Space Mono', monospace;
    font-size: .6rem;
    color: var(--text-2);
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    padding: .28rem .65rem;
    border-radius: 7px;
    letter-spacing: .04em;
    white-space: nowrap;
    transition: border-color .2s, color .2s;
  }
  .tw-card:hover .tw-meta-chip {
    border-color: rgba(201,151,58,.15);
    color: var(--text-1);
  }
  .tw-meta-chip-icon { font-size: .65rem; opacity: .7; }

  /* ── RATING BAR ── */
  .tw-rating-bar {
    display: flex;
    align-items: center;
    gap: .6rem;
    margin-top: .9rem;
  }
  .tw-rating-track {
    flex: 1;
    height: 3px;
    background: var(--ink-4);
    border-radius: 99px;
    overflow: hidden;
  }
  .tw-rating-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%);
    box-shadow: 0 0 8px rgba(201,151,58,.4);
    transition: width .8s cubic-bezier(.22,1,.36,1);
  }
  .tw-rating-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: .9rem;
    color: var(--gold-light);
    letter-spacing: .08em;
    flex-shrink: 0;
  }

  /* ── SINGLE TRAIN DETAIL ── */
  .tw-single-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
  }
  .tw-single-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-light) 70%, transparent);
    box-shadow: 0 0 20px var(--gold-glow);
  }
  .tw-single-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(201,151,58,.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .tw-single-hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 400;
    color: var(--text-1);
    letter-spacing: .06em;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: .25rem;
  }

  /* ── INFO GRID ── */
  .tw-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: .65rem;
    margin-top: 1.5rem;
  }
  .tw-info-tile {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: .9rem 1rem;
    transition: border-color .25s, box-shadow .25s, transform .25s;
    position: relative;
    overflow: hidden;
  }
  .tw-info-tile::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
    opacity: 0;
    transition: opacity .25s;
  }
  @media (min-width: 900px) {
    .tw-info-tile:hover {
      border-color: rgba(201,151,58,.3);
      box-shadow: 0 8px 24px rgba(0,0,0,.3);
      transform: translateY(-2px);
    }
    .tw-info-tile:hover::before { opacity: 1; }
  }
  .tw-info-tile-label {
    font-family: 'Space Mono', monospace;
    font-size: .55rem;
    font-weight: 700;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: .35rem;
  }
  .tw-info-tile-val {
    font-family: 'DM Sans', sans-serif;
    font-size: .95rem;
    font-weight: 600;
    color: var(--text-1);
    line-height: 1.2;
  }
  .tw-info-tile-val.gold  { color: var(--gold-light); }
  .tw-info-tile-val.green { color: var(--sig-green); }
  .tw-info-tile-val.amber { color: var(--sig-amber); }

  /* ── STOPS ── */
  .tw-stops-list {
    display: flex;
    gap: .35rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  .tw-stop-chip {
    font-family: 'Space Mono', monospace;
    font-size: .6rem;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    color: var(--text-2);
    padding: .25rem .6rem;
    border-radius: 5px;
    letter-spacing: .04em;
    transition: border-color .2s, color .2s;
  }
  .tw-stop-chip.first, .tw-stop-chip.last {
    border-color: rgba(201,151,58,.25);
    color: var(--gold-light);
    background: var(--gold-pale);
    box-shadow: 0 0 10px rgba(201,151,58,.1);
  }

  /* ── COMPARE ── */
  .tw-compare-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 700px) {
    .tw-compare-grid {
      grid-template-columns: 1fr auto 1fr;
      gap: 1.2rem;
      align-items: start;
    }
  }

  .tw-compare-vs {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    gap: .5rem;
  }
  @media (min-width: 700px) {
    .tw-compare-vs {
      flex-direction: column;
      padding-top: 3rem;
    }
  }
  .tw-compare-vs-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    color: var(--gold);
    opacity: .5;
    letter-spacing: .15em;
  }
  .tw-compare-vs-line {
    background: linear-gradient(to bottom, transparent, var(--glass-border), transparent);
    flex-shrink: 0;
  }
  @media (max-width: 699px) {
    .tw-compare-vs-line { width: 40px; height: 1px; }
  }
  @media (min-width: 700px) {
    .tw-compare-vs-line { width: 1px; height: 40px; }
  }

  .tw-compare-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .4s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .3s, box-shadow .3s;
  }
  .tw-compare-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.35), transparent);
  }
  @media (min-width: 900px) {
    .tw-compare-card:hover {
      border-color: rgba(201,151,58,.25);
      box-shadow: 0 16px 50px rgba(0,0,0,.4);
    }
  }

  .tw-compare-table { width: 100%; border-collapse: collapse; }
  .tw-compare-table tr { border-bottom: 1px solid var(--glass-border); }
  .tw-compare-table tr:last-child { border-bottom: none; }
  .tw-compare-table td {
    padding: .6rem 0;
    font-size: .82rem;
    vertical-align: top;
  }
  .tw-compare-table td:first-child {
    font-family: 'Space Mono', monospace;
    color: var(--text-3);
    font-size: .58rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    width: 40%;
    padding-right: .8rem;
  }
  .tw-compare-table td:last-child {
    color: var(--text-1);
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── ROUTE MAP ── */
  .tw-route-map-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 1.4rem;
    margin-bottom: .75rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .4s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .3s, box-shadow .3s;
  }
  @media (min-width: 900px) {
    .tw-route-map-card:hover {
      border-color: rgba(201,151,58,.25);
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
    }
  }
  .tw-route-map-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
  }
  .tw-route-map-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: .5rem;
  }

  /* ── DECORATIVE NUMBER OVERLAY (desktop) ── */
  @media (min-width: 900px) {
    .tw-card .tw-card-bg-num {
      position: absolute;
      right: -10px;
      bottom: -15px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 6rem;
      color: rgba(201,151,58,.04);
      letter-spacing: -.02em;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      transition: color .3s, transform .3s;
    }
    .tw-card:hover .tw-card-bg-num {
      color: rgba(201,151,58,.08);
      transform: scale(1.05);
    }
  }

  /* ── RESPONSIVE TOUCH ── */
  @media (max-width: 559px) {
    .tw-page { padding: 1.2rem .75rem 4rem; }
    .tw-header h1 { font-size: 3.2rem; }
    .tw-tabs { grid-template-columns: repeat(3, 1fr); gap: .3rem; }
    .tw-tab { font-size: .52rem; padding: .6rem .3rem; }
    .tw-search-panel { padding: 1.2rem; border-radius: 16px; }
    .tw-card { border-radius: 14px; }
    .tw-info-grid { grid-template-columns: repeat(2, 1fr); }
  }
`

/* ─────────────────────────────────────────────
   CONSTANTS — unchanged
───────────────────────────────────────────── */
const MODES = [
  { id: "number",    label: "By Number"   },
  { id: "name",      label: "By Name"     },
  { id: "zone",      label: "By Zone"     },
  { id: "category",  label: "By Category" },
  { id: "routetype", label: "Route Type"  },
  { id: "compare",   label: "Compare"     },
  { id: "routemap",  label: "Route Map"   },
]

const ZONES = ['Western Railway', 'South Central Railway', 'Eastern Railway', 'Southern Railway', 'Northern Railway']
const CATEGORIES  = ["Rajdhani","Shatabdi","Duronto","Garib Rath","Express","Mail","Passenger","Superfast","Jan Shatabdi","Vande Bharat"]
const ROUTE_TYPES = ["Mountain","Plain","Coastal"]

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

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */
function TrainCard({ train, idx }) {
  const t = train
  return (
    <div className="tw-card" style={{ animationDelay: `${idx * 0.06}s` }}>
      <div className="tw-card-rail" />
      {/* Decorative bg number */}
      <span className="tw-card-bg-num">{t.TrainNo}</span>

      <div className="tw-card-top">
        <span className="tw-train-no">#{t.TrainNo || "—"}</span>
        {t.TrainCategory && (
          <span className={`tw-cat-badge ${catClass(t.TrainCategory)}`}>{t.TrainCategory}</span>
        )}
      </div>

      <div className="tw-train-name">{t.TrainName || "Unknown Train"}</div>
      {t.RailwayZone && <div className="tw-train-zone">⬡ {t.RailwayZone}</div>}

      {(t.StartingPoint || t.FinalDestination) && (
        <div className="tw-route">
          <div className="tw-route-city">
            <div className="tw-route-city-name">{t.StartingPoint || "—"}</div>
            <div className="tw-route-city-label">Origin</div>
          </div>
          <div className="tw-route-mid">
            <div className="tw-route-dot" />
            <div className="tw-route-line" />
            <div className="tw-route-dot" />
          </div>
          <div className="tw-route-city" style={{ textAlign: "right" }}>
            <div className="tw-route-city-name">{t.FinalDestination || "—"}</div>
            <div className="tw-route-city-label">Destination</div>
          </div>
        </div>
      )}

      <div className="tw-meta-row">
        {t.TravelTime_hr     != null && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">⌛</span>{t.TravelTime_hr} hrs</span>}
        {t.Distance_km       != null && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">📍</span>{t.Distance_km} km</span>}
        {t.AverageSpeed_kmph != null && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">⚡</span>{t.AverageSpeed_kmph} km/h</span>}
        {t.DaysRunning               && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">📅</span>{t.DaysRunning}</span>}
      </div>

      {t.Rating != null && (
        <div className="tw-rating-bar">
          <div className="tw-rating-track">
            <div className="tw-rating-fill" style={{ width: `${(t.Rating / 5) * 100}%` }} />
          </div>
          <span className="tw-rating-label">★ {t.Rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  )
}

function InfoGrid({ train }) {
  const fields = [
    { label: "Train No",          val: train.TrainNo },
    { label: "Category",          val: train.TrainCategory,          gold: true },
    { label: "Zone",              val: train.RailwayZone },
    { label: "Origin",            val: train.StartingPoint },
    { label: "Destination",       val: train.FinalDestination },
    { label: "Distance",          val: train.Distance_km       != null ? `${train.Distance_km} km`           : null },
    { label: "Travel Time",       val: train.TravelTime_hr     != null ? `${train.TravelTime_hr} hrs`        : null },
    { label: "Avg Speed",         val: train.AverageSpeed_kmph != null ? `${train.AverageSpeed_kmph} km/h`  : null },
    { label: "Days Running",      val: train.DaysRunning },
    { label: "Route Type",        val: train.RouteType },
    { label: "Coaches",           val: train.CoachCount },
    { label: "AC Coaches %",      val: train.ACPercentageCoaches != null ? `${train.ACPercentageCoaches}%`  : null },
    { label: "Avg Stops",         val: train.AvgStops },
    { label: "Fare Range",        val: train.ApproxFareRange_INR },
    { label: "Occupancy",         val: train.OccupancyPercentage != null ? `${train.OccupancyPercentage}%`  : null },
    { label: "Punctuality",       val: train.PunctualityScore   != null ? `${train.PunctualityScore}/100`   : null, green: true },
    { label: "Delay Probability", val: train.DelayProbability   != null ? `${(train.DelayProbability * 100).toFixed(1)}%` : null },
    { label: "Rating",            val: train.Rating             != null ? `★ ${train.Rating.toFixed(1)}/5` : null, gold: true },
    { label: "Electrified",       val: train.ElectrifiedRoute },
    { label: "Year Introduced",   val: train.YearIntroduced },
    { label: "Revenue",           val: train.Revenue_INR        != null ? `₹${train.Revenue_INR.toLocaleString("en-IN")}` : null },
    { label: "Maintenance Score", val: train.MaintenanceScore   != null ? `${train.MaintenanceScore}/100`  : null },
    { label: "Peak Multiplier",   val: train.PeakSeasonMultiplier },
    { label: "Journey Date",      val: train.JourneyDate },
    { label: "Remarks",           val: train.Remarks },
  ].filter(f => f.val != null && f.val !== "")

  return (
    <div className="tw-info-grid">
      {fields.map(f => (
        <div className="tw-info-tile" key={f.label}>
          <div className="tw-info-tile-label">{f.label}</div>
          <div className={`tw-info-tile-val${f.gold ? " gold" : f.green ? " green" : ""}`}>
            {String(f.val)}
          </div>
        </div>
      ))}
    </div>
  )
}

function CompareCard({ train, label }) {
  const rows = [
    { k: "Train No",    v: train.TrainNo },
    { k: "Zone",        v: train.RailwayZone },
    { k: "Category",    v: train.TrainCategory },
    { k: "From",        v: train.StartingPoint },
    { k: "To",          v: train.FinalDestination },
    { k: "Distance",    v: train.Distance_km       != null ? `${train.Distance_km} km`          : null },
    { k: "Travel Time", v: train.TravelTime_hr     != null ? `${train.TravelTime_hr} hrs`       : null },
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
    <div className="tw-compare-card">
      <div style={{ marginBottom: "1rem" }}>
        <div className="tw-train-no" style={{ marginBottom: ".5rem", display: "inline-block" }}>Train {label}</div>
        <div className="tw-single-hero-name" style={{ fontSize: "clamp(1.4rem,4vw,2rem)" }}>
          {train.TrainName || "—"}
        </div>
        {train.RailwayZone && (
          <div className="tw-train-zone" style={{ marginTop: ".2rem" }}>⬡ {train.RailwayZone}</div>
        )}
      </div>
      <table className="tw-compare-table">
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

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const Train = () => {
  const [mode, setMode]       = useState("number")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)

  const [num, setNum]         = useState("")
  const [name, setName]       = useState("")
  const [zone, setZone]       = useState(ZONES[0])
  const [cat, setCat]         = useState(CATEGORIES[0])
  const [rtype, setRtype]     = useState(ROUTE_TYPES[0])
  const [cmp1, setCmp1]       = useState("")
  const [cmp2, setCmp2]       = useState("")
  const [cmpMode, setCmpMode] = useState("number")
  const [mapName, setMapName] = useState("")

  const reset      = () => { setResult(null); setError(null) }
  const switchMode = (m) => { setMode(m); reset() }

  /* ── ALL API CALLS UNCHANGED ── */
  const fetchData = useCallback(async (path) => {
    const url = `${API_URI}${path}`
    console.log("[Train] fetching:", url)
    setLoading(true); setError(null); setResult(null)
    try {
      const res  = await fetch(url, { credentials: "include" })
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
        if (!zone.trim()) return setError("Please select or enter a zone")
        return fetchData(`/api/train/zone?zone=${encodeURIComponent(zone.trim())}`)
      case "category":
        return fetchData(`/api/train/category?cat=${encodeURIComponent(cat)}`)
      case "routetype":
        return fetchData(`/api/train/Routetype?RType=${encodeURIComponent(rtype)}`)
      case "compare":
        if (!cmp1.trim() || !cmp2.trim()) return setError("Both train fields are required")
        if (cmpMode === "number")
          return fetchData(`/api/train/compare/bynumber?train1=${encodeURIComponent(cmp1.trim())}&train2=${encodeURIComponent(cmp2.trim())}`)
        return fetchData(`/api/train/compare/byname?train1=${encodeURIComponent(cmp1.trim())}&train2=${encodeURIComponent(cmp2.trim())}`)
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
          <div className="tw-field">
            <label>Train Number</label>
            <input type="number" placeholder="e.g. 66630" value={num} onChange={e => setNum(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      case "name":
        return (
          <div className="tw-field">
            <label>Train Name</label>
            <input type="text" placeholder="e.g. Madurai Intercity" value={name} onChange={e => setName(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      case "zone":
        return (
          <div className="tw-field">
            <label>Railway Zone</label>
            <select value={zone} onChange={e => setZone(e.target.value)}>
              {ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
        )
      case "category":
        return (
          <div className="tw-field">
            <label>Train Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )
      case "routetype":
        return (
          <div className="tw-field">
            <label>Route Type</label>
            <select value={rtype} onChange={e => setRtype(e.target.value)}>
              {ROUTE_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        )
      case "compare":
        return (
          <>
            <div className="tw-field" style={{ minWidth: 130, maxWidth: 160 }}>
              <label>Compare By</label>
              <select value={cmpMode} onChange={e => setCmpMode(e.target.value)}>
                <option value="number">Number</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="tw-field">
              <label>Train A {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input
                placeholder={cmpMode === "number" ? "66630" : "Madurai Intercity"}
                value={cmp1}
                onChange={e => setCmp1(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
            <div className="tw-field">
              <label>Train B {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input
                placeholder={cmpMode === "number" ? "14331" : "Jaipur Rajdhani"}
                value={cmp2}
                onChange={e => setCmp2(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
          </>
        )
      case "routemap":
        return (
          <div className="tw-field">
            <label>Train Name <span style={{ opacity:.5, fontWeight:400, fontFamily:"DM Sans" }}>(optional)</span></label>
            <input
              type="text"
              placeholder="Leave blank for all routes…"
              value={mapName}
              onChange={e => setMapName(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        )
      default: return null
    }
  }

  const renderResult = () => {
    if (!result) return null

    if (!Array.isArray(result)) {
      if (result.trains && Array.isArray(result.trains)) {
        if (result.trains.length === 0) return <div className="tw-state"><span className="tw-state-icon">🔍</span><div className="tw-state-msg">No trains found</div></div>
        return (
          <>
            <div className="tw-results-header">
              <span className="tw-results-label">Results</span>
              <span className="tw-results-count">{result.count ?? result.trains.length} trains</span>
            </div>
            <div className="tw-grid">
              {result.trains.map((t, i) => <TrainCard key={i} train={t} idx={i} />)}
            </div>
          </>
        )
      }

      if (result.train1 && result.train2) {
        return (
          <>
            <div className="tw-results-header">
              <span className="tw-results-label">Comparison</span>
            </div>
            <div className="tw-compare-grid">
              <CompareCard train={result.train1} label="A" />
              <div className="tw-compare-vs">
                <div className="tw-compare-vs-line" />
                <div className="tw-compare-vs-label">VS</div>
                <div className="tw-compare-vs-line" />
              </div>
              <CompareCard train={result.train2} label="B" />
            </div>
          </>
        )
      }

      // Single train
      return (
        <>
          <div className="tw-results-header">
            <span className="tw-results-label">Train Detail</span>
          </div>
          <div className="tw-single-card">
            <div className="tw-card-top">
              <span className="tw-train-no">#{result.TrainNo || "—"}</span>
              {result.TrainCategory && (
                <span className={`tw-cat-badge ${catClass(result.TrainCategory)}`}>{result.TrainCategory}</span>
              )}
            </div>
            <div className="tw-single-hero-name">{result.TrainName || "Unknown Train"}</div>
            {result.RailwayZone && <div className="tw-train-zone" style={{ marginTop: ".25rem" }}>⬡ {result.RailwayZone}</div>}
            {result.stops && (
              <div className="tw-stops-list">
                {parseStops(result.stops).map((s, i, arr) => (
                  <span key={i} className={`tw-stop-chip${i === 0 ? " first" : i === arr.length - 1 ? " last" : ""}`}>{s}</span>
                ))}
              </div>
            )}
            <InfoGrid train={result} />
          </div>
        </>
      )
    }

    if (result.length === 0) {
      return <div className="tw-state"><span className="tw-state-icon">🔍</span><div className="tw-state-msg">No trains found</div></div>
    }

    const trains = result.trains || result

    if (mode === "routemap") {
      return (
        <>
          <div className="tw-results-header">
            <span className="tw-results-label">Route Map</span>
            <span className="tw-results-count">{trains.length} routes</span>
          </div>
          {trains.map((r, i) => {
            const stops = parseStops(r.stops)
            return (
              <div className="tw-route-map-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="tw-route-map-header">
                  <div>
                    <div className="tw-train-name" style={{ fontSize: "1.1rem", marginBottom: ".15rem" }}>{r.TrainName || `Route ${i + 1}`}</div>
                    {r.TrainNo && <span className="tw-train-no" style={{ display: "inline-block" }}>#{r.TrainNo}</span>}
                  </div>
                  {stops.length > 0 && <span className="tw-results-count">{stops.length} stops</span>}
                </div>
                {stops.length > 0 && (
                  <div className="tw-stops-list">
                    {stops.map((s, si, arr) => (
                      <span key={si} className={`tw-stop-chip${si === 0 ? " first" : si === arr.length - 1 ? " last" : ""}`}>{s}</span>
                    ))}
                  </div>
                )}
                <div className="tw-meta-row">
                  {r.Distance_km && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">📍</span>{r.Distance_km} km</span>}
                  {r.from_lat    && <span className="tw-meta-chip"><span className="tw-meta-chip-icon">🗺</span>{r.from_lat?.toFixed(2)}, {r.from_lng?.toFixed(2)}</span>}
                </div>
              </div>
            )
          })}
        </>
      )
    }

    return (
      <>
        <div className="tw-results-header">
          <span className="tw-results-label">Results</span>
          <span className="tw-results-count">{result.count ?? trains.length} trains</span>
        </div>
        <div className="tw-grid">
          {trains.map((t, i) => <TrainCard key={i} train={t} idx={i} />)}
        </div>
      </>
    )
  }

  return (
    <Navbar>
      <style>{TRAIN_CSS}</style>

      <div className="tw-page">

        {/* HERO */}
        <div className="tw-header">
          <div className="tw-header-eyebrow">Railway Intelligence System</div>
          <h1>
            Train{" "}
            <span className="tw-h1-accent" data-text="Explorer">Explorer</span>
          </h1>
          <div className="tw-header-sub">Search · Compare · Inspect · Discover</div>

          <div className="tw-ticker">
            <div className="tw-ticker-item">
              <span className="tw-ticker-val">500+</span>
              <span className="tw-ticker-label">Trains</span>
            </div>
            <div className="tw-ticker-divider" />
            <div className="tw-ticker-item">
              <span className="tw-ticker-val">7</span>
              <span className="tw-ticker-label">Search Modes</span>
            </div>
            <div className="tw-ticker-divider" />
            <div className="tw-ticker-item">
              <span className="tw-ticker-val">5</span>
              <span className="tw-ticker-label">Zones</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tw-tabs">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`tw-tab${mode === m.id ? " active" : ""}`}
              onClick={() => switchMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* SEARCH PANEL */}
        <div className="tw-search-panel">
          <div className="tw-scan-line" />
          <div className="tw-search-row">
            {renderFields()}
            <button className="tw-search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching…" : "Search →"}
            </button>
          </div>
          {error && <div className="tw-error-msg">{error}</div>}
        </div>

        {/* RAIL DIVIDER */}
        <div className="tw-rail-divider" />

        {/* RESULTS */}
        {loading ? (
          <div className="tw-loader">
            <div className="tw-spinner-wrap">
              <div className="tw-spinner" />
              <div className="tw-spinner-inner" />
              <div className="tw-spinner-dot" />
            </div>
            <div className="tw-loader-text">Fetching train data…</div>
          </div>
        ) : result ? (
          renderResult()
        ) : !error ? (
          <div className="tw-state">
            <span className="tw-state-icon">🚂</span>
            <div className="tw-state-msg">Select a mode and enter your query</div>
          </div>
        ) : null}

      </div>
    </Navbar>
  )
}

export default Train