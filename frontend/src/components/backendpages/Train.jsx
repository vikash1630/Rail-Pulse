import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Navbar from "../../pages/Navbar"

const API_URI = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")

const TRAIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

  /* ── KEYFRAMES ── */
  @keyframes tw-spin       { to { transform: rotate(360deg); } }
  @keyframes tw-card-in    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes tw-glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(201,151,58,.15)} 50%{box-shadow:0 0 40px rgba(201,151,58,.35)} }
  @keyframes tw-rail-flow  { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes tw-shimmer    { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes tw-float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes tw-scan       { 0%{top:0%;opacity:.5} 100%{top:100%;opacity:0} }
  @keyframes tw-badge-pop  { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes tw-bg-move    { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes tw-orb-drift  { 0%{transform:translate(0,0)} 33%{transform:translate(35px,-25px)} 66%{transform:translate(-18px,35px)} 100%{transform:translate(0,0)} }
  @keyframes tw-hero-rise  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tw-modal-in   { from{opacity:0;transform:translateY(30px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes tw-overlay-in { from{opacity:0} to{opacity:1} }
  @keyframes tw-dot-pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* ── RESET ── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── PAGE SHELL ── */
  .tw-page {
    min-height: 100vh;
    /* Mobile: padding-top leaves room for hamburger button */
    padding: 1.4rem .9rem 5rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    font-family: 'Barlow Condensed', sans-serif;
    color: #f0eeeb;
  }

  .tw-page::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,151,58,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,151,58,.035) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: tw-bg-move 9s linear infinite;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  }
  .tw-page::after {
    content: '';
    position: fixed; top: -180px; right: -180px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,.065) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: tw-orb-drift 18s ease-in-out infinite;
  }
  .tw-page > * { position: relative; z-index: 1; }

  /* ── HERO HEADER ── */
  .tw-header {
    margin-bottom: 2.2rem;
    padding-top: .5rem;
    animation: tw-hero-rise .75s cubic-bezier(.22,1,.36,1) both;
  }

  .tw-header-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .88rem);
    letter-spacing: .35em; text-transform: uppercase;
    color: #c9973a; margin-bottom: .8rem;
    display: flex; align-items: center; gap: .7rem; opacity: .85;
  }
  .tw-header-eyebrow::before, .tw-header-eyebrow::after {
    content: ''; height: 1px; flex: 1; max-width: 55px;
  }
  .tw-header-eyebrow::before { background: linear-gradient(90deg, #c9973a, transparent); }
  .tw-header-eyebrow::after  { background: linear-gradient(270deg, #c9973a, transparent); }

  .tw-header h1 {
    font-family: 'Bebas Neue', sans-serif;
    /* LARGE — readable 4-5m away */
    font-size: clamp(4.5rem, 20vw, 9rem);
    font-weight: 400; color: #f0eeeb;
    letter-spacing: .05em; line-height: .88;
    text-transform: uppercase; margin: 0 0 .3rem;
  }
  .tw-header h1 .tw-h1-accent {
    color: transparent; -webkit-text-stroke: 1.5px #c9973a;
  }

  .tw-header-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .92rem);
    color: #6b7280; margin-top: .6rem;
    letter-spacing: .15em; text-transform: uppercase;
  }

  /* Ticker — 2×2 on mobile */
  .tw-ticker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .6rem;
    margin-top: 1.4rem;
    width: 100%;
  }
  .tw-ticker-card {
    background: rgba(13,16,22,.92);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 14px; padding: .9rem .8rem;
    text-align: center; position: relative; overflow: hidden; min-width: 0;
  }
  .tw-ticker-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a, transparent);
  }
  .tw-ticker-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 8vw, 3.8rem);
    color: #e8b454; line-height: 1; letter-spacing: .05em; display: block;
  }
  .tw-ticker-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.8vw, .78rem);
    color: #6b7280; letter-spacing: .2em; text-transform: uppercase; margin-top: .25rem;
  }

  /* ── RAIL DIVIDER ── */
  .tw-rail-divider { height: 22px; margin: 1.4rem 0; position: relative; overflow: hidden; }
  .tw-rail-divider::before {
    content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0px, rgba(255,255,255,.07) 20px, transparent 20px, transparent 30px);
    transform: translateY(-50%); animation: tw-rail-flow 2s linear infinite;
  }
  .tw-rail-divider::after {
    content: '▶'; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    color: #c9973a; font-size: .85rem; animation: tw-float 2s ease-in-out infinite;
  }

  /* ── TABS — 3-col grid on mobile ── */
  .tw-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .4rem; margin-bottom: 1.6rem; width: 100%;
  }
  .tw-tab {
    padding: .85rem .4rem; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .8rem);
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: #6b7280; background: rgba(22,25,32,.98);
    border: 1px solid rgba(255,255,255,.07);
    cursor: pointer; transition: color .2s, border-color .2s, transform .18s, background .2s;
    text-align: center; white-space: nowrap;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    min-height: 48px; /* min tap target */
  }
  .tw-tab:active { transform: scale(.95); }
  .tw-tab:hover  { color: #f0eeeb; border-color: rgba(201,151,58,.25); }
  .tw-tab.active {
    background: rgba(201,151,58,.1); color: #e8b454;
    border-color: rgba(201,151,58,.35);
    box-shadow: 0 0 24px rgba(201,151,58,.1);
    animation: tw-glow-pulse 3s ease-in-out infinite;
  }
  .tw-tab.active::after {
    /* no absolute positioning — just a bottom border trick */
    content: none;
  }

  /* ── SEARCH PANEL ── */
  .tw-search-panel {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 1.4rem 1rem;
    margin-bottom: 1.6rem; position: relative; overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    width: 100%;
  }
  .tw-search-panel:focus-within { border-color: rgba(201,151,58,.3); box-shadow: 0 0 50px rgba(201,151,58,.06); }
  .tw-search-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #c9973a 40%, #e8b454 60%, transparent 100%);
    box-shadow: 0 0 12px rgba(201,151,58,.25);
  }
  .tw-scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
    animation: tw-scan 5s ease-in-out infinite; pointer-events: none; z-index: 0;
  }

  /* Fields stack vertically on mobile */
  .tw-search-row { display: flex; flex-direction: column; gap: .7rem; }

  .tw-field { display: flex; flex-direction: column; gap: .4rem; width: 100%; }
  .tw-field label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.9vw, .82rem);
    font-weight: 700; letter-spacing: .22em; text-transform: uppercase;
    color: #6b7280; display: flex; align-items: center; gap: .45rem;
  }
  .tw-field label::before {
    content: ''; display: block; width: 5px; height: 5px;
    border-radius: 50%; background: #c9973a; box-shadow: 0 0 7px #c9973a; flex-shrink: 0;
  }
  .tw-field input, .tw-field select {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #f0eeeb;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.1rem, 3vw, 1.35rem); font-weight: 600;
    padding: .85rem 1rem; outline: none;
    transition: border-color .22s, box-shadow .22s; width: 100%;
    -webkit-appearance: none; min-height: 52px;
    /* Larger touch target */
  }
  .tw-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23c9973a'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center;
    padding-right: 2.5rem; cursor: pointer;
  }
  .tw-field input::placeholder { color: #4b5563; }
  .tw-field input:focus, .tw-field select:focus {
    border-color: rgba(201,151,58,.45);
    box-shadow: 0 0 0 3px rgba(201,151,58,.08);
  }
  .tw-field select option { background: #161920; }

  .tw-search-btn {
    padding: 1rem 1.6rem;
    background: linear-gradient(135deg, #c9973a 0%, #e8b454 100%);
    color: #07080b; border: none; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.78rem, 2.2vw, .95rem);
    font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; transition: transform .18s, box-shadow .2s, opacity .2s;
    width: 100%; /* full width on mobile */
    box-shadow: 0 4px 20px rgba(201,151,58,.25);
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    min-height: 52px;
  }
  .tw-search-btn:active { transform: scale(.97); }
  .tw-search-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  .tw-error-msg {
    margin-top: .8rem;
    background: rgba(224,82,82,.06); border: 1px solid rgba(224,82,82,.25);
    border-radius: 12px; padding: .85rem 1rem;
    color: #e05252; font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.7rem, 1.9vw, .85rem); letter-spacing: .07em;
    display: flex; align-items: center; gap: .6rem;
  }
  .tw-error-msg::before { content: '⚠'; flex-shrink: 0; }

  /* ── STATES ── */
  .tw-state { text-align: center; padding: 4rem 2rem; }
  .tw-state-icon { font-size: clamp(2.5rem, 8vw, 3.5rem); display: block; margin-bottom: 1rem; animation: tw-float 3s ease-in-out infinite; }
  .tw-state-msg {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.75rem, 2vw, .92rem);
    color: #6b7280; letter-spacing: .2em; text-transform: uppercase;
  }

  /* ── LOADER ── */
  .tw-loader { display: flex; flex-direction: column; align-items: center; padding: 4.5rem 2rem; gap: 1.8rem; }
  .tw-spinner-wrap { position: relative; width: 60px; height: 60px; }
  .tw-spinner {
    width: 60px; height: 60px;
    border: 2px solid rgba(255,255,255,.07);
    border-top-color: #c9973a; border-right-color: #e8b454;
    border-radius: 50%; animation: tw-spin .75s linear infinite;
  }
  .tw-spinner-inner {
    position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;
    border: 1px solid rgba(201,151,58,.18); border-bottom-color: #c9973a;
    border-radius: 50%; animation: tw-spin .5s linear infinite reverse;
  }
  .tw-spinner-dot {
    position: absolute; top: 50%; left: 50%;
    width: 8px; height: 8px; border-radius: 50%;
    background: #c9973a; box-shadow: 0 0 14px #c9973a;
    transform: translate(-50%,-50%);
  }
  .tw-loader-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.72rem, 2vw, .88rem);
    color: #6b7280; letter-spacing: .28em; text-transform: uppercase;
    animation: tw-float 1.5s ease-in-out infinite;
  }

  /* ── RESULTS HEADER ── */
  .tw-results-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.2rem; padding-bottom: .65rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .tw-results-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.7rem, 1.9vw, .85rem);
    font-weight: 700; letter-spacing: .28em; text-transform: uppercase;
    color: #6b7280; display: flex; align-items: center; gap: .6rem;
  }
  .tw-results-label::before { content: ''; width: 14px; height: 2px; background: #c9973a; border-radius: 99px; }
  .tw-results-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1rem, 3vw, 1.3rem); color: #e8b454; letter-spacing: .1em;
    background: rgba(201,151,58,.1); padding: .2rem 1rem;
    border-radius: 99px; border: 1px solid rgba(201,151,58,.22);
    animation: tw-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── CARD GRID — 1-col mobile, 2-col tablet, 3-col desktop ── */
  .tw-grid { display: grid; grid-template-columns: 1fr; gap: .85rem; }

  /* ── TRAIN CARD ── */
  .tw-card {
    background: rgba(13,16,22,.95);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 1.2rem;
    position: relative; overflow: hidden; min-width: 0;
    transition: border-color .25s, transform .2s, box-shadow .25s;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
  }
  .tw-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.5), transparent);
    opacity: 0; transition: opacity .25s;
  }
  .tw-card:active { transform: scale(.98); border-color: rgba(201,151,58,.3); }
  .tw-card:active::before { opacity: 1; }

  .tw-card-rail {
    position: absolute; left: 0; top: 18%; bottom: 18%; width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(to bottom, #c9973a, #e8b454);
    box-shadow: 0 0 10px rgba(201,151,58,.4); opacity: 0; transition: opacity .25s;
  }
  .tw-card:active .tw-card-rail { opacity: 1; }

  .tw-card-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: .75rem; gap: .5rem; flex-wrap: nowrap; min-width: 0;
  }
  .tw-train-no {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.75rem, 2vw, .9rem); font-weight: 700;
    color: #c9973a; background: rgba(201,151,58,.1);
    border: 1px solid rgba(201,151,58,.2); padding: .3rem .7rem; border-radius: 7px;
    flex-shrink: 0; white-space: nowrap;
  }
  .tw-cat-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .7rem); font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    padding: .28rem .65rem; border-radius: 7px; white-space: nowrap; flex-shrink: 0;
    border: 1px solid transparent;
    animation: tw-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
  }
  .tw-cat-badge.rajdhani  { background:rgba(201,151,58,.12); color:#e8b454;  border-color:rgba(201,151,58,.25); }
  .tw-cat-badge.superfast { background:rgba(201,151,58,.12); color:#e8b454;  border-color:rgba(201,151,58,.25); }
  .tw-cat-badge.express   { background:rgba(61,184,122,.09);  color:#3db87a;  border-color:rgba(61,184,122,.22); }
  .tw-cat-badge.mail      { background:rgba(212,136,58,.09);  color:#d4883a;  border-color:rgba(212,136,58,.22); }
  .tw-cat-badge.passenger { background:rgba(255,255,255,.04); color:#9ca3af;  border-color:rgba(255,255,255,.09); }
  .tw-cat-badge.default   { background:rgba(255,255,255,.04); color:#9ca3af;  border-color:rgba(255,255,255,.09); }

  .tw-train-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2rem);
    color: #f0eeeb; letter-spacing: .04em; line-height: 1;
    margin-bottom: .2rem; text-transform: uppercase;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .tw-train-zone {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .78rem);
    color: #6b7280; letter-spacing: .1em; text-transform: uppercase;
  }

  .tw-route {
    display: flex; align-items: center; gap: .6rem;
    margin: .85rem 0; padding: .9rem .9rem;
    background: rgba(22,25,32,.98); border-radius: 12px;
    border: 1px solid rgba(255,255,255,.07); min-width: 0;
  }
  .tw-route-city { flex: 1; min-width: 0; }
  .tw-route-city-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1rem, 3vw, 1.3rem); font-weight: 700;
    color: #f0eeeb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tw-route-city-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.55rem, 1.4vw, .65rem); color: #4b5563;
    letter-spacing: .15em; text-transform: uppercase; margin-top: .1rem;
  }
  .tw-route-mid { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
  .tw-route-dot { width: 7px; height: 7px; border-radius: 50%; background: #c9973a; box-shadow: 0 0 8px rgba(201,151,58,.5); }
  .tw-route-line { width: 32px; height: 2px; background: linear-gradient(90deg, #c9973a, #e8b454); border-radius: 99px; opacity: .5; }

  .tw-meta-row { display: flex; gap: .4rem; flex-wrap: wrap; margin-top: .7rem; }
  .tw-meta-chip {
    display: flex; align-items: center; gap: .3rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.7vw, .75rem);
    color: #9ca3af; background: rgba(22,25,32,.98);
    border: 1px solid rgba(255,255,255,.07);
    padding: .3rem .65rem; border-radius: 7px; white-space: nowrap;
  }

  .tw-rating-bar { display: flex; align-items: center; gap: .6rem; margin-top: .85rem; }
  .tw-rating-track { flex: 1; height: 5px; background: rgba(31,34,44,1); border-radius: 99px; overflow: hidden; }
  .tw-rating-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #c9973a 0%, #e8b454 100%); }
  .tw-rating-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1rem, 2.8vw, 1.3rem); color: #e8b454; letter-spacing: .06em; flex-shrink: 0;
  }

  /* ── SINGLE CARD ── */
  .tw-single-card {
    background: rgba(13,16,22,.95); border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px; padding: 1.6rem 1.2rem;
    position: relative; overflow: hidden;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .tw-single-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a 35%, #e8b454 65%, transparent);
    box-shadow: 0 0 16px rgba(201,151,58,.3);
  }
  .tw-single-hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 7vw, 3.5rem);
    color: #f0eeeb; letter-spacing: .05em; text-transform: uppercase; line-height: 1;
    margin-bottom: .25rem;
  }

  /* Info grid */
  .tw-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-top: 1.2rem; }
  .tw-info-tile {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px; padding: .9rem .9rem; min-width: 0;
    transition: border-color .2s; -webkit-tap-highlight-color: transparent;
  }
  .tw-info-tile-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.6vw, .7rem); font-weight: 700;
    letter-spacing: .18em; text-transform: uppercase; color: #4b5563; margin-bottom: .3rem;
  }
  .tw-info-tile-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1rem, 3vw, 1.3rem); font-weight: 700; color: #f0eeeb; line-height: 1.2;
    word-break: break-word;
  }
  .tw-info-tile-val.gold  { color: #e8b454; }
  .tw-info-tile-val.green { color: #3db87a; }
  .tw-info-tile-val.amber { color: #d4883a; }

  /* Stops */
  .tw-stops-list { display: flex; gap: .35rem; flex-wrap: wrap; margin-top: .85rem; }
  .tw-stop-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.7vw, .75rem);
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    color: #9ca3af; padding: .28rem .65rem; border-radius: 6px;
  }
  .tw-stop-chip.first, .tw-stop-chip.last {
    border-color: rgba(201,151,58,.28); color: #e8b454;
    background: rgba(201,151,58,.1); font-weight: 700;
  }

  /* ── COMPARE ── */
  .tw-compare-grid { display: grid; grid-template-columns: 1fr; gap: .85rem; }
  .tw-compare-vs {
    display: flex; align-items: center; justify-content: center;
    gap: .75rem; padding: .75rem 0;
  }
  .tw-compare-vs-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.6rem, 5vw, 2.2rem); color: #c9973a; opacity: .55; letter-spacing: .15em;
  }
  .tw-compare-vs-line { background: rgba(255,255,255,.07); height: 1px; width: 36px; }

  .tw-compare-card {
    background: rgba(13,16,22,.95); border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px; padding: 1.3rem 1.1rem;
    position: relative; overflow: hidden;
    animation: tw-card-in .4s cubic-bezier(.22,1,.36,1) both;
  }
  .tw-compare-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.3), transparent);
  }
  .tw-compare-table { width: 100%; border-collapse: collapse; }
  .tw-compare-table tr { border-bottom: 1px solid rgba(255,255,255,.06); }
  .tw-compare-table tr:last-child { border-bottom: none; }
  .tw-compare-table td { padding: .6rem 0; vertical-align: top; }
  .tw-compare-table td:first-child {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.6vw, .72rem); letter-spacing: .14em; text-transform: uppercase;
    color: #6b7280; width: 42%; padding-right: .7rem;
  }
  .tw-compare-table td:last-child {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(.95rem, 2.8vw, 1.2rem); font-weight: 600; color: #f0eeeb;
  }

  /* ── ROUTE MAP ── */
  .tw-route-map-card {
    background: rgba(13,16,22,.95); border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px; padding: 1.2rem; margin-bottom: .7rem;
    position: relative; overflow: hidden;
    animation: tw-card-in .4s cubic-bezier(.22,1,.36,1) both;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .tw-route-map-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
  }
  .tw-route-map-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: .85rem; flex-wrap: wrap; gap: .5rem;
  }

  /* ════════════════════════════════════════════
     TRAIN DETAIL MODAL
  ════════════════════════════════════════════ */
  .tw-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(7,8,11,.88);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    /* HIGHEST z-index — always above navbar hamburger */
    z-index: 9999;
    display: flex; align-items: flex-end; justify-content: center;
    animation: tw-overlay-in .22s ease both;
    padding: 0;
  }
  @media (min-width: 700px) {
    .tw-modal-backdrop { align-items: center; padding: 1.5rem; }
  }

  .tw-modal {
    background: #0d1016; border: 1px solid rgba(255,255,255,.08);
    border-radius: 24px 24px 0 0;
    width: 100%; max-width: 860px; max-height: 92vh;
    overflow-y: auto; overflow-x: hidden;
    position: relative;
    animation: tw-modal-in .32s cubic-bezier(.22,1,.36,1) both;
    scrollbar-width: thin; scrollbar-color: rgba(201,151,58,.3) transparent;
  }
  @media (min-width: 700px) {
    .tw-modal { border-radius: 24px; max-height: 88vh; }
  }
  .tw-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9973a 30%, #e8b454 70%, transparent);
    box-shadow: 0 0 24px rgba(201,151,58,.35); border-radius: 24px 24px 0 0;
  }

  /* Drag handle — mobile only */
  .tw-modal-handle {
    position: absolute; top: .6rem; left: 50%; transform: translateX(-50%);
    width: 36px; height: 4px;
    background: rgba(255,255,255,.12); border-radius: 99px;
  }
  @media (min-width: 700px) { .tw-modal-handle { display: none; } }

  /* Modal header */
  .tw-modal-header {
    position: sticky; top: 0; z-index: 10;
    background: #0d1016; border-bottom: 1px solid rgba(255,255,255,.07);
    padding: 1.3rem 1.4rem 1.1rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  }
  .tw-modal-title-block { display: flex; flex-direction: column; gap: .3rem; padding-top: .5rem; min-width: 0; }
  .tw-modal-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.6rem, 1.7vw, .75rem); letter-spacing: .28em; text-transform: uppercase;
    color: #c9973a; display: flex; align-items: center; gap: .5rem;
  }
  .tw-modal-eyebrow::before { content: ''; display: inline-block; width: 12px; height: 1px; background: #c9973a; }
  .tw-modal-train-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 7vw, 3.2rem); line-height: 1;
    letter-spacing: .04em; color: #f0eeeb; text-transform: uppercase;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .tw-modal-badges { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .3rem; }

  .tw-modal-close {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #9ca3af; font-size: 1.3rem;
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; margin-top: .4rem;
    transition: background .2s, color .2s, border-color .2s;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
  }
  .tw-modal-close:active { background: rgba(224,82,82,.12); color: #e05252; border-color: rgba(224,82,82,.28); }

  /* Modal body */
  .tw-modal-body { padding: 1.4rem; }

  /* Modal route hero */
  .tw-modal-route {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px; padding: 1.2rem;
    display: flex; align-items: center; gap: .8rem;
    margin-bottom: 1.4rem; min-width: 0; overflow: hidden;
  }
  .tw-modal-route-city { flex: 1; min-width: 0; }
  .tw-modal-route-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.4rem, 5vw, 2.2rem); color: #f0eeeb;
    letter-spacing: .04em; line-height: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tw-modal-route-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.56rem, 1.5vw, .68rem); color: #4b5563;
    letter-spacing: .18em; text-transform: uppercase; margin-top: .22rem;
  }
  .tw-modal-route-mid { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
  .tw-modal-route-dot { width: 9px; height: 9px; border-radius: 50%; background: #c9973a; box-shadow: 0 0 10px rgba(201,151,58,.5); }
  .tw-modal-route-line { width: 40px; height: 2px; background: linear-gradient(90deg, #c9973a, #e8b454); border-radius: 99px; opacity: .55; }

  /* Modal section label */
  .tw-modal-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.65rem, 1.8vw, .8rem); font-weight: 700;
    letter-spacing: .28em; text-transform: uppercase; color: #c9973a;
    margin-bottom: .8rem; display: flex; align-items: center; gap: .55rem;
  }
  .tw-modal-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201,151,58,.3), transparent); }

  /* Modal stats grid */
  .tw-modal-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: .65rem; margin-bottom: 1.4rem;
  }
  @media (min-width: 480px) { .tw-modal-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 700px) { .tw-modal-stats { grid-template-columns: repeat(4, 1fr); } }

  .tw-modal-stat {
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    border-radius: 14px; padding: 1rem; min-width: 0;
  }
  .tw-modal-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.58rem, 1.5vw, .7rem); letter-spacing: .18em; text-transform: uppercase;
    color: #4b5563; margin-bottom: .35rem;
  }
  .tw-modal-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.4rem, 4.5vw, 2rem); line-height: 1; letter-spacing: .04em; color: #f0eeeb;
    word-break: break-word;
  }
  .tw-modal-stat-val.gold  { color: #e8b454; }
  .tw-modal-stat-val.green { color: #3db87a; }
  .tw-modal-stat-val.amber { color: #d4883a; }
  .tw-modal-stat-val.red   { color: #e05252; }
  .tw-modal-stat-val.blue  { color: #60a5fa; }

  /* Modal stops */
  .tw-modal-stops-wrap { margin-bottom: 1.4rem; }
  .tw-modal-stops-list { display: flex; gap: .35rem; flex-wrap: wrap; }
  .tw-modal-stop {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.7vw, .76rem);
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.07);
    color: #9ca3af; padding: .3rem .7rem; border-radius: 6px;
  }
  .tw-modal-stop.first, .tw-modal-stop.last {
    border-color: rgba(201,151,58,.28); color: #e8b454;
    background: rgba(201,151,58,.1); font-weight: 700;
  }

  /* Modal loading / error */
  .tw-modal-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 2rem; gap: 1.4rem;
  }
  .tw-modal-spinner {
    width: 50px; height: 50px;
    border: 2px solid rgba(255,255,255,.07);
    border-top-color: #c9973a; border-right-color: #e8b454;
    border-radius: 50%; animation: tw-spin .75s linear infinite;
  }
  .tw-modal-loading-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.9vw, .82rem); color: #6b7280;
    letter-spacing: .22em; text-transform: uppercase;
  }
  .tw-modal-error-msg {
    margin: 1.5rem; background: rgba(224,82,82,.06); border: 1px solid rgba(224,82,82,.25);
    border-radius: 12px; padding: 1rem 1.2rem; color: #e05252;
    font-family: 'JetBrains Mono', monospace; font-size: clamp(.7rem, 1.9vw, .85rem);
    display: flex; align-items: center; gap: .6rem;
  }

  /* ════════════════════════════════════════════
     HAMBURGER SAFE ZONE
     Navbar hamburger lives at top-right: top:1rem right:1rem size:48px
     We make the modal backdrop ignore pointer events in that zone
     by adding a transparent pointer-events:none pseudo-element shield.
     The hamburger's own z-index is already higher than the modal
     via z-index:9999+1 on the hamburger (handled in Navbar.jsx),
     so we simply ensure the modal doesn't capture that touch area.
  ════════════════════════════════════════════ */

  /* ════════════════════════════════════════════
     RESPONSIVE — tablet 600px+, desktop 900px+
  ════════════════════════════════════════════ */
  @media (min-width: 480px) {
    .tw-ticker { grid-template-columns: repeat(4, 1fr); }
  }

  @media (min-width: 600px) {
    .tw-page { padding: 1.8rem 1.5rem 6rem; }
    .tw-tabs { grid-template-columns: repeat(4, 1fr); }
    .tw-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .tw-info-grid { grid-template-columns: repeat(3, 1fr); }
    .tw-search-row { flex-direction: row; flex-wrap: wrap; }
    .tw-field { flex: 1; min-width: 160px; }
    .tw-search-btn { width: auto; flex-shrink: 0; padding: 1rem 1.8rem; }
  }

  @media (min-width: 900px) {
    .tw-page { padding: 2.2rem 2rem 7rem; }
    .tw-tabs { grid-template-columns: repeat(7, 1fr); }
    .tw-grid { grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
    .tw-info-grid { grid-template-columns: repeat(4, 1fr); gap: .75rem; }
    .tw-compare-grid { grid-template-columns: 1fr auto 1fr; gap: 1.2rem; align-items: start; }
    .tw-compare-vs { flex-direction: column; padding-top: 3rem; }
    .tw-compare-vs-line { width: 1px; height: 36px; }

    .tw-card:hover { border-color: rgba(201,151,58,.32); transform: translateY(-4px) scale(1.01); box-shadow: 0 18px 55px rgba(0,0,0,.48); }
    .tw-card:hover::before { opacity: 1; }
    .tw-card:hover .tw-card-rail { opacity: 1; }
    .tw-route-map-card:hover { border-color: rgba(201,151,58,.25); transform: translateY(-2px); }
    .tw-modal-stat:hover { border-color: rgba(201,151,58,.25); transform: translateY(-2px); }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }

  /* ── CLIENT FILTER BAR ── */
  .tw-filter-bar {
    display: flex; gap: .6rem; align-items: center;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .tw-filter-input {
    flex: 1; min-width: 180px;
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 10px; color: #f0eeeb;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1rem, 2.8vw, 1.2rem); font-weight: 600;
    padding: .65rem .9rem; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .tw-filter-input::placeholder { color: #4b5563; }
  .tw-filter-input:focus { border-color: rgba(201,151,58,.4); box-shadow: 0 0 0 3px rgba(201,151,58,.07); }
  .tw-filter-clear {
    background: rgba(224,82,82,.08); border: 1px solid rgba(224,82,82,.2);
    border-radius: 10px; color: #e05252;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.7vw, .75rem); font-weight: 700; letter-spacing: .1em;
    padding: .65rem .9rem; cursor: pointer; white-space: nowrap;
    transition: background .2s, border-color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .tw-filter-clear:active { background: rgba(224,82,82,.18); }

  /* ── PAGINATION ── */
  .tw-pagination {
    display: flex; align-items: center; justify-content: center;
    gap: .5rem; margin-top: 1.8rem; flex-wrap: wrap;
  }
  .tw-page-btn {
    min-width: 42px; height: 42px; padding: 0 .7rem;
    background: rgba(22,25,32,.98); border: 1px solid rgba(255,255,255,.08);
    border-radius: 10px; color: #9ca3af;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.68rem, 1.8vw, .82rem); font-weight: 700;
    cursor: pointer; transition: background .18s, border-color .18s, color .18s, transform .15s;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent; touch-action: manipulation;
  }
  .tw-page-btn:active { transform: scale(.94); }
  .tw-page-btn:hover  { border-color: rgba(201,151,58,.28); color: #e8b454; }
  .tw-page-btn.active {
    background: rgba(201,151,58,.12); border-color: rgba(201,151,58,.35);
    color: #e8b454; box-shadow: 0 0 18px rgba(201,151,58,.1);
  }
  .tw-page-btn:disabled { opacity: .3; cursor: not-allowed; transform: none; }
  .tw-page-info {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(.62rem, 1.7vw, .75rem); color: #4b5563; letter-spacing: .12em;
    padding: 0 .4rem;
  }
`

// ─── Constants ───────────────────────────────────────────────────────────────
const MODES = [
  { id: "number",    label: "By Number"   },
  { id: "name",      label: "By Name"     },
  { id: "zone",      label: "By Zone"     },
  { id: "category",  label: "By Category" },
  { id: "routetype", label: "Route Type"  },
  { id: "compare",   label: "Compare"     },
  { id: "routemap",  label: "Route Map"   },
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

// ─── Train Detail Modal ───────────────────────────────────────────────────────
function TrainDetailModal({ trainNo, onClose }) {
  const [status, setStatus] = useState("loading")
  const [train,  setTrain]  = useState(null)
  const [errMsg, setErrMsg] = useState("")

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Fetch train data
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

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  const stops = train ? parseStops(train.stops) : []

  const stats = train ? [
    { label: "Train No",     val: train.TrainNo,                                                                  color: "gold"  },
    { label: "Distance",     val: train.Distance_km        != null ? `${train.Distance_km} km`          : null              },
    { label: "Travel Time",  val: train.TravelTime_hr      != null ? `${train.TravelTime_hr} hrs`       : null              },
    { label: "Avg Speed",    val: train.AverageSpeed_kmph  != null ? `${train.AverageSpeed_kmph} km/h`  : null              },
    { label: "Coaches",      val: train.CoachCount                                                                           },
    { label: "AC %",         val: train.ACPercentageCoaches!= null ? `${train.ACPercentageCoaches}%`    : null              },
    { label: "Occupancy",    val: train.OccupancyPercentage!= null ? `${train.OccupancyPercentage}%`    : null              },
    { label: "Punctuality",  val: train.PunctualityScore   != null ? `${train.PunctualityScore}/100`    : null, color: "green" },
    { label: "Delay Prob",   val: train.DelayProbability   != null ? `${(train.DelayProbability * 100).toFixed(1)}%` : null, color: "amber" },
    { label: "Rating",       val: train.Rating             != null ? `★ ${train.Rating.toFixed(1)}`     : null, color: "gold"  },
    { label: "Fare Range",   val: train.ApproxFareRange_INR                                                                  },
    { label: "Revenue",      val: train.Revenue_INR        != null ? `₹${(train.Revenue_INR/1e5).toFixed(1)}L` : null, color: "blue" },
    { label: "Maintenance",  val: train.MaintenanceScore   != null ? `${train.MaintenanceScore}/100`    : null              },
    { label: "Peak ×",       val: train.PeakSeasonMultiplier                                                                 },
    { label: "Year",         val: train.YearIntroduced                                                                       },
    { label: "Electrified",  val: train.ElectrifiedRoute                                                                     },
    { label: "Days Running", val: train.DaysRunning                                                                          },
    { label: "Route Type",   val: train.RouteType                                                                            },
    { label: "Avg Stops",    val: train.AvgStops                                                                             },
    { label: "Remarks",      val: train.Remarks                                                                              },
  ].filter(s => s.val != null && s.val !== "") : []

  return (
    <div
      className="tw-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="tw-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="tw-modal-header">
          <div className="tw-modal-handle" />
          <div className="tw-modal-title-block">
            <div className="tw-modal-eyebrow">Train Detail</div>
            {status === "success" && train ? (
              <>
                <div className="tw-modal-train-name">{train.TrainName || "Unknown Train"}</div>
                <div className="tw-modal-badges">
                  <span className="tw-train-no">#{train.TrainNo}</span>
                  {train.TrainCategory && (
                    <span className={`tw-cat-badge ${catClass(train.TrainCategory)}`}>{train.TrainCategory}</span>
                  )}
                  {train.RailwayZone && (
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(.6rem,1.5vw,.72rem)", color:"#6b7280", letterSpacing:".1em", textTransform:"uppercase", alignSelf:"center" }}>
                      ⬡ {train.RailwayZone}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="tw-modal-train-name" style={{ color: "#6b7280" }}>#{trainNo}</div>
            )}
          </div>
          <button className="tw-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="tw-modal-loading">
            <div className="tw-modal-spinner" />
            <div className="tw-modal-loading-text">Fetching train data…</div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="tw-modal-error-msg" style={{ margin: "1.5rem" }}>⚠ {errMsg}</div>
        )}

        {/* Success body */}
        {status === "success" && train && (
          <div className="tw-modal-body">

            {/* Route hero */}
            {(train.StartingPoint || train.FinalDestination) && (
              <div className="tw-modal-route">
                <div className="tw-modal-route-city">
                  <div className="tw-modal-route-name">{train.StartingPoint || "—"}</div>
                  <div className="tw-modal-route-label">Origin</div>
                </div>
                <div className="tw-modal-route-mid">
                  <div className="tw-modal-route-dot" />
                  <div className="tw-modal-route-line" />
                  <div className="tw-modal-route-dot" />
                </div>
                <div className="tw-modal-route-city" style={{ textAlign: "right" }}>
                  <div className="tw-modal-route-name">{train.FinalDestination || "—"}</div>
                  <div className="tw-modal-route-label">Destination</div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="tw-modal-section-label">Performance &amp; Details</div>
            <div className="tw-modal-stats">
              {stats.map(s => (
                <div className="tw-modal-stat" key={s.label}>
                  <div className="tw-modal-stat-label">{s.label}</div>
                  <div className={`tw-modal-stat-val${s.color ? ` ${s.color}` : ""}`}>{String(s.val)}</div>
                </div>
              ))}
            </div>

            {/* Stops */}
            {stops.length > 0 && (
              <div className="tw-modal-stops-wrap">
                <div className="tw-modal-section-label">Route Stops ({stops.length})</div>
                <div className="tw-modal-stops-list">
                  {stops.map((s, i, arr) => (
                    <span key={i} className={`tw-modal-stop${i === 0 ? " first" : i === arr.length - 1 ? " last" : ""}`}>
                      {s}
                    </span>
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
      className="tw-card"
      style={{ animationDelay: `${Math.min(idx, 8) * 0.055}s` }}
      onClick={() => onCardClick(t.TrainNo)}
    >
      <div className="tw-card-rail" />
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
        {t.TravelTime_hr     != null && <span className="tw-meta-chip">⌛ {t.TravelTime_hr} hrs</span>}
        {t.Distance_km       != null && <span className="tw-meta-chip">📍 {t.Distance_km} km</span>}
        {t.AverageSpeed_kmph != null && <span className="tw-meta-chip">⚡ {t.AverageSpeed_kmph} km/h</span>}
        {t.DaysRunning               && <span className="tw-meta-chip">📅 {t.DaysRunning}</span>}
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
})

// ─── Info Grid ────────────────────────────────────────────────────────────────
function InfoGrid({ train }) {
  const fields = [
    { label: "Train No",          val: train.TrainNo },
    { label: "Category",          val: train.TrainCategory,          gold: true  },
    { label: "Zone",              val: train.RailwayZone                          },
    { label: "Origin",            val: train.StartingPoint                        },
    { label: "Destination",       val: train.FinalDestination                     },
    { label: "Distance",          val: train.Distance_km        != null ? `${train.Distance_km} km`           : null },
    { label: "Travel Time",       val: train.TravelTime_hr      != null ? `${train.TravelTime_hr} hrs`        : null },
    { label: "Avg Speed",         val: train.AverageSpeed_kmph  != null ? `${train.AverageSpeed_kmph} km/h`   : null },
    { label: "Days Running",      val: train.DaysRunning                           },
    { label: "Route Type",        val: train.RouteType                             },
    { label: "Coaches",           val: train.CoachCount                            },
    { label: "AC Coaches %",      val: train.ACPercentageCoaches != null ? `${train.ACPercentageCoaches}%`    : null },
    { label: "Avg Stops",         val: train.AvgStops                              },
    { label: "Fare Range",        val: train.ApproxFareRange_INR                   },
    { label: "Occupancy",         val: train.OccupancyPercentage != null ? `${train.OccupancyPercentage}%`    : null },
    { label: "Punctuality",       val: train.PunctualityScore   != null ? `${train.PunctualityScore}/100`     : null, green: true },
    { label: "Delay Probability", val: train.DelayProbability   != null ? `${(train.DelayProbability * 100).toFixed(1)}%` : null },
    { label: "Rating",            val: train.Rating             != null ? `★ ${train.Rating.toFixed(1)}/5`   : null, gold: true  },
    { label: "Electrified",       val: train.ElectrifiedRoute                      },
    { label: "Year Introduced",   val: train.YearIntroduced                        },
    { label: "Revenue",           val: train.Revenue_INR        != null ? `₹${train.Revenue_INR.toLocaleString("en-IN")}` : null },
    { label: "Maintenance Score", val: train.MaintenanceScore   != null ? `${train.MaintenanceScore}/100`     : null },
    { label: "Peak Multiplier",   val: train.PeakSeasonMultiplier                  },
    { label: "Journey Date",      val: train.JourneyDate                           },
    { label: "Remarks",           val: train.Remarks                               },
  ].filter(f => f.val != null && f.val !== "")

  return (
    <div className="tw-info-grid">
      {fields.map(f => (
        <div className="tw-info-tile" key={f.label}>
          <div className="tw-info-tile-label">{f.label}</div>
          <div className={`tw-info-tile-val${f.gold ? " gold" : f.green ? " green" : ""}`}>{String(f.val)}</div>
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
    { k: "Distance",    v: train.Distance_km       != null ? `${train.Distance_km} km`          : null },
    { k: "Travel Time", v: train.TravelTime_hr     != null ? `${train.TravelTime_hr} hrs`       : null },
    { k: "Avg Speed",   v: train.AverageSpeed_kmph != null ? `${train.AverageSpeed_kmph} km/h`  : null },
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
        <span className="tw-train-no" style={{ display: "inline-block", marginBottom: ".5rem" }}>Train {label}</span>
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

// ─── Pagination constants ─────────────────────────────────────────────────────
const PAGE_SIZE = 24  // cards per page — small enough to render instantly

// ─── PaginatedGrid — handles filter + pagination for large lists ──────────────
function PaginatedGrid({ trains, onCardClick }) {
  const [page,   setPage]   = useState(0)
  const [filter, setFilter] = useState("")
  const filterRef = useRef(null)

  // Reset page when trains or filter changes
  useEffect(() => { setPage(0) }, [trains, filter])

  const filtered = useMemo(() => {
    if (!filter.trim()) return trains
    const q = filter.trim().toLowerCase()
    return trains.filter(t =>
      (t.TrainName  && t.TrainName.toLowerCase().includes(q)) ||
      (t.TrainNo    && String(t.TrainNo).includes(q)) ||
      (t.StartingPoint    && t.StartingPoint.toLowerCase().includes(q)) ||
      (t.FinalDestination && t.FinalDestination.toLowerCase().includes(q)) ||
      (t.RailwayZone      && t.RailwayZone.toLowerCase().includes(q))
    )
  }, [trains, filter])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages - 1)
  const pageTrains  = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  // Build page number buttons — show at most 5 around current
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i)
    const around = new Set([0, totalPages - 1, safePage, safePage - 1, safePage + 1].filter(n => n >= 0 && n < totalPages))
    return Array.from(around).sort((a, b) => a - b)
  }, [totalPages, safePage])

  const scrollToResults = () => {
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const goToPage = (p) => {
    setPage(p)
    scrollToResults()
  }

  return (
    <>
      {/* Filter bar */}
      <div className="tw-filter-bar" ref={filterRef}>
        <input
          className="tw-filter-input"
          placeholder="Filter by name, number, zone, city…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filter && (
          <button className="tw-filter-clear" onClick={() => setFilter("")}>✕ Clear</button>
        )}
      </div>

      {/* Count after filter */}
      <div className="tw-results-header" style={{ marginBottom: ".85rem" }}>
        <span className="tw-results-label">
          {filter ? `${filtered.length} matches` : `${trains.length} trains`}
        </span>
        <span className="tw-results-count">
          Page {safePage + 1} / {totalPages}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="tw-state">
          <span className="tw-state-icon">🔍</span>
          <div className="tw-state-msg">No trains match "{filter}"</div>
        </div>
      ) : (
        <>
          <div className="tw-grid">
            {pageTrains.map((t, i) => (
              <TrainCard key={`${t.TrainNo}-${i}`} train={t} idx={i} onCardClick={onCardClick} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="tw-pagination">
              <button
                className="tw-page-btn"
                onClick={() => goToPage(0)}
                disabled={safePage === 0}
              >«</button>
              <button
                className="tw-page-btn"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 0}
              >‹</button>

              {pageNums.map((n, idx) => {
                const prev = pageNums[idx - 1]
                return (
                  <React.Fragment key={n}>
                    {prev !== undefined && n - prev > 1 && (
                      <span className="tw-page-info">…</span>
                    )}
                    <button
                      className={`tw-page-btn${n === safePage ? " active" : ""}`}
                      onClick={() => goToPage(n)}
                    >
                      {n + 1}
                    </button>
                  </React.Fragment>
                )
              })}

              <button
                className="tw-page-btn"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages - 1}
              >›</button>
              <button
                className="tw-page-btn"
                onClick={() => goToPage(totalPages - 1)}
                disabled={safePage >= totalPages - 1}
              >»</button>
            </div>
          )}
        </>
      )}
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Train = () => {
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
          <div className="tw-field">
            <label>Train Number</label>
            <input type="number" placeholder="e.g. 77836" value={num}
              onChange={e => setNum(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      case "name":
        return (
          <div className="tw-field">
            <label>Train Name</label>
            <input type="text" placeholder="e.g. Madurai Intercity" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={onKeyDown} />
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
            <div className="tw-field" style={{ maxWidth: 180 }}>
              <label>Compare By</label>
              <select value={cmpMode} onChange={e => setCmpMode(e.target.value)}>
                <option value="number">Number</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="tw-field">
              <label>Train A {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input placeholder={cmpMode === "number" ? "77836" : "Madurai Intercity"}
                value={cmp1} onChange={e => setCmp1(e.target.value)} onKeyDown={onKeyDown} />
            </div>
            <div className="tw-field">
              <label>Train B {cmpMode === "number" ? "(No.)" : "(Name)"}</label>
              <input placeholder={cmpMode === "number" ? "14331" : "Jaipur Rajdhani"}
                value={cmp2} onChange={e => setCmp2(e.target.value)} onKeyDown={onKeyDown} />
            </div>
          </>
        )
      case "routemap":
        return (
          <div className="tw-field">
            <label>Train Name <span style={{ opacity:.5, fontWeight:400 }}>(optional)</span></label>
            <input type="text" placeholder="Leave blank for all routes…" value={mapName}
              onChange={e => setMapName(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        )
      default: return null
    }
  }

  const renderResult = () => {
    if (!result) return null

    // List result (trains array wrapped)
    if (result.trains && Array.isArray(result.trains)) {
      if (result.trains.length === 0)
        return <div className="tw-state"><span className="tw-state-icon">🔍</span><div className="tw-state-msg">No trains found</div></div>
      return <PaginatedGrid trains={result.trains} onCardClick={openModal} />
    }

    // Compare result
    if (result.train1 && result.train2) {
      return (
        <>
          <div className="tw-results-header"><span className="tw-results-label">Comparison</span></div>
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

    // Raw array (route map)
    if (Array.isArray(result)) {
      if (result.length === 0)
        return <div className="tw-state"><span className="tw-state-icon">🔍</span><div className="tw-state-msg">No results found</div></div>

      if (mode === "routemap") {
        // Route map cards are simpler — paginate them too
        const RouteCard = ({ r, i }) => {
          const stops = parseStops(r.stops)
          return (
            <div key={i} className="tw-route-map-card"
              onClick={() => r.TrainNo && setModalTrainNo(r.TrainNo)}>
              <div className="tw-route-map-header">
                <div>
                  <div className="tw-train-name" style={{ fontSize:"clamp(1.2rem,3.5vw,1.6rem)", marginBottom:".15rem" }}>{r.TrainName || `Route ${i+1}`}</div>
                  {r.TrainNo && <span className="tw-train-no" style={{ display:"inline-block" }}>#{r.TrainNo}</span>}
                </div>
                {stops.length > 0 && <span className="tw-results-count">{stops.length} stops</span>}
              </div>
              {stops.length > 0 && (
                <div className="tw-stops-list">
                  {stops.map((s, si, arr) => (
                    <span key={si} className={`tw-stop-chip${si===0?" first":si===arr.length-1?" last":""}`}>{s}</span>
                  ))}
                </div>
              )}
              <div className="tw-meta-row">
                {r.Distance_km && <span className="tw-meta-chip">📍 {r.Distance_km} km</span>}
              </div>
            </div>
          )
        }
        // Paginate route map using the same train list shape
        const routeAsTrains = result.map(r => ({ ...r, TrainName: r.TrainName || "Route", _isRoute: true }))
        return <PaginatedGrid trains={routeAsTrains} onCardClick={(no) => no && openModal(no)} />
      }

      return <PaginatedGrid trains={result} onCardClick={openModal} />
    }

    // Single train result
    return (
      <>
        <div className="tw-results-header"><span className="tw-results-label">Train Detail</span></div>
        <div className="tw-single-card" onClick={() => openModal(result.TrainNo)}>
          <div className="tw-card-top">
            <span className="tw-train-no">#{result.TrainNo || "—"}</span>
            {result.TrainCategory && (
              <span className={`tw-cat-badge ${catClass(result.TrainCategory)}`}>{result.TrainCategory}</span>
            )}
          </div>
          <div className="tw-single-hero-name">{result.TrainName || "Unknown Train"}</div>
          {result.RailwayZone && <div className="tw-train-zone" style={{ marginTop:".25rem" }}>⬡ {result.RailwayZone}</div>}
          {result.stops && (
            <div className="tw-stops-list">
              {parseStops(result.stops).map((s, i, arr) => (
                <span key={i} className={`tw-stop-chip${i===0?" first":i===arr.length-1?" last":""}`}>{s}</span>
              ))}
            </div>
          )}
          <InfoGrid train={result} />
        </div>
      </>
    )
  }

  return (
    <Navbar>
      <style>{TRAIN_CSS}</style>

      <div className="tw-page">

        {/* Hero */}
        <div className="tw-header">
          <div className="tw-header-eyebrow">Railway Intelligence System</div>
          <h1>
            Train <span className="tw-h1-accent">Explorer</span>
          </h1>
          <div className="tw-header-sub">Search · Compare · Inspect · Discover</div>
          <div className="tw-ticker">
            <div className="tw-ticker-card">
              <span className="tw-ticker-val">49K+</span>
              <div className="tw-ticker-label">Trains</div>
            </div>
            <div className="tw-ticker-card">
              <span className="tw-ticker-val">7</span>
              <div className="tw-ticker-label">Modes</div>
            </div>
            <div className="tw-ticker-card">
              <span className="tw-ticker-val">18+</span>
              <div className="tw-ticker-label">Zones</div>
            </div>
            <div className="tw-ticker-card">
              <span className="tw-ticker-val">19</span>
              <div className="tw-ticker-label">Categories</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tw-tabs">
          {MODES.map(m => (
            <button key={m.id}
              className={`tw-tab${mode === m.id ? " active" : ""}`}
              onClick={() => switchMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Search Panel */}
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

        {/* Rail divider */}
        <div className="tw-rail-divider" />

        {/* Results */}
        {loading ? (
          <div className="tw-loader">
            <div className="tw-spinner-wrap">
              <div className="tw-spinner" />
              <div className="tw-spinner-inner" />
              <div className="tw-spinner-dot" />
            </div>
            <div className="tw-loader-text">Fetching train data…</div>
          </div>
        ) : result ? renderResult()
          : !error ? (
            <div className="tw-state">
              <span className="tw-state-icon">🚂</span>
              <div className="tw-state-msg">Select a mode and search</div>
            </div>
          ) : null}

      </div>

      {/* Modal — outside tw-page, overlays everything */}
      {modalTrainNo && (
        <TrainDetailModal
          trainNo={modalTrainNo}
          onClose={() => setModalTrainNo(null)}
        />
      )}

    </Navbar>
  )
}

export default Train