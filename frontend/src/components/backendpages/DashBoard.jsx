import React, { useEffect, useState } from "react"
import Navbar from "../../pages/Navbar"

const API_URI = "https://rail-pulse-backend.onrender.com"

const DB_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  @keyframes tw-spin        { to { transform: rotate(360deg); } }
  @keyframes tw-spin-rev    { to { transform: rotate(-360deg); } }
  @keyframes tw-card-in     { from { opacity:0; transform:translateY(22px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes tw-glow-pulse  { 0%,100%{box-shadow:0 0 20px rgba(201,151,58,.15),0 0 60px rgba(201,151,58,.05)} 50%{box-shadow:0 0 40px rgba(201,151,58,.35),0 0 120px rgba(201,151,58,.12)} }
  @keyframes tw-rail-flow   { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes tw-shimmer     { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes tw-float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes tw-scan        { 0%{top:0%;opacity:.7} 100%{top:100%;opacity:0} }
  @keyframes tw-badge-pop   { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.14)} 100%{transform:scale(1);opacity:1} }
  @keyframes tw-bg-move     { 0%{background-position:0 0} 100%{background-position:60px 60px} }
  @keyframes tw-orb-drift   { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.06)} 66%{transform:translate(-20px,40px) scale(.95)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes tw-title-in    { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes tw-hero-rise   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tw-bar-grow    { from{width:0} }
  @keyframes tw-counter-up  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sig-pulse      { 0%,100%{opacity:1;box-shadow:0 0 7px currentColor} 50%{opacity:.35;box-shadow:none} }
  @keyframes tw-number-in   { from{letter-spacing:.6em;opacity:0} to{letter-spacing:.06em;opacity:1} }

  /* ── BASE ── */
  *, *::before, *::after { box-sizing: border-box; }

  .db-page {
    min-height: 100vh;
    padding: 2.5rem 1.5rem 6rem;
    max-width: 1320px;
    margin: 0 auto;
    position: relative;
    overflow-x: clip;
    font-family: 'DM Sans', sans-serif;
    color: #f0eeeb;
  }

  .db-page::before {
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
  .db-page::after {
    content: '';
    position: fixed;
    top: -200px; right: -200px;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,.065) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: tw-orb-drift 20s ease-in-out infinite;
  }
  .db-page > * { position: relative; z-index: 1; }

  /* ── HEADER ── */
  .db-header {
    margin-bottom: 4rem;
    padding-top: 1.5rem;
    animation: tw-hero-rise .8s cubic-bezier(.22,1,.36,1) both;
  }
  .db-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .75rem;
    letter-spacing: .5em;
    text-transform: uppercase;
    color: var(--gold, #c9973a);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: .8rem;
    opacity: .85;
  }
  .db-eyebrow::before,
  .db-eyebrow::after {
    content: '';
    height: 1px;
    flex: 1;
    max-width: 80px;
  }
  .db-eyebrow::before { background: linear-gradient(90deg,  var(--gold, #c9973a), transparent); }
  .db-eyebrow::after  { background: linear-gradient(270deg, var(--gold, #c9973a), transparent); }

  .db-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 12vw, 9rem);
    font-weight: 400;
    color: var(--text-1, #f0eeeb);
    letter-spacing: .04em;
    line-height: .88;
    text-transform: uppercase;
    margin: 0 0 .6rem;
  }
  .db-title .db-accent {
    color: transparent;
    -webkit-text-stroke: 1.5px var(--gold, #c9973a);
    position: relative;
  }
  .db-title .db-accent::after {
    content: attr(data-text);
    position: absolute;
    left: 0; top: 0;
    color: var(--gold, #c9973a);
    clip-path: inset(0 60% 0 0);
    animation: tw-title-in 2s cubic-bezier(.22,1,.36,1) .4s both;
  }
  .db-subtitle {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.75rem, 1.5vw, 1rem);
    color: var(--text-3, #6b7280);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-top: .8rem;
  }

  /* ── TICKER ── */
  .db-ticker {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
    align-items: center;
  }
  .db-ticker-item { display: flex; align-items: baseline; gap: .5rem; }
  .db-ticker-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    color: var(--gold-light, #e8b454);
    letter-spacing: .06em;
    line-height: 1;
    animation: tw-number-in .7s ease both;
  }
  .db-ticker-label {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.65rem, 1.2vw, .8rem);
    color: var(--text-3, #6b7280);
    letter-spacing: .2em;
    text-transform: uppercase;
  }
  .db-ticker-divider {
    width: 1px; height: 36px;
    background: var(--glass-border, rgba(255,255,255,.08));
    align-self: center;
  }

  /* ── STATUS BAR ── */
  .db-status-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding: 1.1rem 1.8rem;
    background: var(--ink-2, #0d1016);
    border: 1px solid var(--glass-border, rgba(255,255,255,.08));
    border-radius: 16px;
    font-family: 'Space Mono', monospace;
    font-size: clamp(.62rem, 1vw, .78rem);
    letter-spacing: .12em;
    color: var(--text-3, #6b7280);
    position: relative;
    overflow: hidden;
  }
  .db-status-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.3), transparent);
  }
  .db-status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: sig-pulse 2s ease-in-out infinite;
  }
  .db-status-dot.green { background: var(--sig-green, #3db87a); color: var(--sig-green, #3db87a); }
  .db-status-dot.gold  { background: var(--gold, #c9973a);      color: var(--gold, #c9973a);      animation-delay: .5s; }
  .db-status-dot.amber { background: var(--sig-amber, #d4883a); color: var(--sig-amber, #d4883a); animation-delay: 1s; }
  .db-status-item { display: flex; align-items: center; gap: .6rem; }
  .db-status-val  { color: var(--text-1, #f0eeeb); font-weight: 700; }

  /* ── RAIL DIVIDER ── */
  .db-rail-divider {
    height: 30px; margin: 2.5rem 0;
    position: relative; overflow: hidden;
  }
  .db-rail-divider::before {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0; height: 2px;
    background: repeating-linear-gradient(90deg,
      var(--glass-border, rgba(255,255,255,.08)) 0px,
      var(--glass-border, rgba(255,255,255,.08)) 20px,
      transparent 20px, transparent 30px
    );
    transform: translateY(-50%);
    animation: tw-rail-flow 2s linear infinite;
  }
  .db-rail-divider::after {
    content: '▶';
    position: absolute;
    right: 0; top: 50%;
    transform: translateY(-50%);
    color: var(--gold, #c9973a);
    font-size: .9rem;
    animation: tw-float 2s ease-in-out infinite;
  }

  /* ── SECTION LABEL ── */
  .db-section-label {
    display: flex;
    align-items: center;
    gap: .7rem;
    font-family: 'Space Mono', monospace;
    font-size: clamp(.65rem, 1.1vw, .82rem);
    font-weight: 700;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: var(--text-3, #6b7280);
    margin-bottom: 1.4rem;
  }
  .db-section-label::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold, #c9973a);
    box-shadow: 0 0 10px rgba(201,151,58,.7);
    flex-shrink: 0;
  }

  /* ── HERO STAT GRID ── */
  .db-hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 900px) {
    .db-hero-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.4rem;
    }
  }

  .db-hero-stat {
    background: var(--ink-2, #0d1016);
    border: 1px solid var(--glass-border, rgba(255,255,255,.08));
    border-radius: 22px;
    padding: 2rem 1.8rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    cursor: default;
    transition: border-color .3s, box-shadow .35s, transform .35s;
  }
  .db-hero-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(201,151,58,.5) 50%, transparent 100%);
    opacity: 0;
    transition: opacity .3s;
  }
  .db-card-rail {
    position: absolute;
    left: 0; top: 15%; bottom: 15%;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: linear-gradient(to bottom, var(--gold, #c9973a), var(--gold-light, #e8b454));
    box-shadow: 0 0 14px rgba(201,151,58,.4);
    opacity: 0;
    transition: opacity .3s;
  }
  @media (min-width: 900px) {
    .db-hero-stat:hover {
      border-color: rgba(201,151,58,.4);
      box-shadow: 0 24px 70px rgba(0,0,0,.55), 0 0 50px rgba(201,151,58,.09);
      transform: translateY(-6px) scale(1.018);
    }
    .db-hero-stat:hover::before { opacity: 1; }
    .db-hero-stat:hover .db-card-rail { opacity: 1; }
    .db-hero-stat::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 55%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.028), transparent);
      transition: left .6s ease;
      pointer-events: none;
    }
    .db-hero-stat:hover::after { left: 160%; }
  }
  .db-hero-stat-ghost {
    position: absolute;
    bottom: -14px; right: 8px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 8vw, 7.5rem);
    color: rgba(201,151,58,.04);
    pointer-events: none;
    line-height: 1;
    user-select: none;
    transition: color .3s, transform .3s;
  }
  @media (min-width: 900px) {
    .db-hero-stat:hover .db-hero-stat-ghost {
      color: rgba(201,151,58,.09);
      transform: scale(1.06);
    }
  }
  .db-hero-stat-label {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.62rem, 1vw, .78rem);
    font-weight: 700;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--text-3, #6b7280);
    margin-bottom: .7rem;
  }
  .db-hero-stat-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6.5vw, 5rem);
    line-height: 1;
    letter-spacing: .06em;
    animation: tw-counter-up .7s cubic-bezier(.22,1,.36,1) both;
  }
  .db-hero-stat-sub {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.58rem, .9vw, .72rem);
    color: var(--text-3, #6b7280);
    margin-top: .45rem;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  /* ── KPI GRID ── */
  .db-kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 560px) { .db-kpi-grid { grid-template-columns: repeat(3, 1fr); gap: 1.1rem; } }
  @media (min-width: 900px) { .db-kpi-grid { grid-template-columns: repeat(4, 1fr); gap: 1.3rem; } }
  @media (min-width: 1100px) { .db-kpi-grid { grid-template-columns: repeat(6, 1fr); } }

  .db-kpi-card {
    background: var(--ink-3, #161920);
    border: 1px solid var(--glass-border, rgba(255,255,255,.08));
    border-radius: 18px;
    padding: 1.4rem 1.2rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    cursor: default;
  }
  .db-kpi-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.2), transparent);
    opacity: 0; transition: opacity .25s;
  }
  @media (min-width: 900px) {
    .db-kpi-card:hover {
      transform: translateY(-4px);
      border-color: rgba(201,151,58,.3);
      box-shadow: 0 10px 36px rgba(0,0,0,.4), 0 0 18px rgba(201,151,58,.07);
    }
    .db-kpi-card:hover::before { opacity: 1; }
    .db-kpi-card::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 55%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.03), transparent);
      transition: left .5s ease;
      pointer-events: none;
    }
    .db-kpi-card:hover::after { left: 160%; }
  }
  .db-kpi-label {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.58rem, .9vw, .72rem);
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--text-3, #6b7280);
    margin-bottom: .55rem;
  }
  .db-kpi-value {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.05rem, 1.8vw, 1.4rem);
    font-weight: 700;
    line-height: 1.3;
  }
  .db-kpi-unit {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.52rem, .8vw, .65rem);
    color: var(--text-3, #6b7280);
    margin-top: .3rem;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .c-gold  { color: var(--gold-light,  #e8b454); }
  .c-green { color: var(--sig-green,   #3db87a); }
  .c-red   { color: var(--sig-red,     #e05252); }
  .c-amber { color: var(--sig-amber,   #d4883a); }

  /* ── TWO-COL ── */
  .db-cols {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.4rem;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 700px) { .db-cols { grid-template-columns: 1fr 1fr; } }

  /* ── PANEL ── */
  .db-panel {
    background: var(--ink-2, #0d1016);
    border: 1px solid var(--glass-border, rgba(255,255,255,.08));
    border-radius: 24px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .3s, box-shadow .3s;
  }
  .db-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--gold, #c9973a) 40%, var(--gold-light, #e8b454) 60%, transparent 100%);
    box-shadow: 0 0 16px rgba(201,151,58,.25);
  }
  .db-scan-line {
    position: absolute;
    left: 0; right: 0; top: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.25), transparent);
    pointer-events: none;
    z-index: 10;
  }
  @media (min-width: 900px) {
    .db-scan-line { animation: tw-scan 4s ease-in-out infinite; }
    .db-panel:hover {
      border-color: rgba(201,151,58,.2);
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
    }
  }

  /* ── CATEGORY BARS ── */
  .db-cat-list { display: flex; flex-direction: column; gap: .9rem; }
  .db-cat-row  { display: flex; align-items: center; gap: .9rem; }
  .db-cat-name {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.6rem, .9vw, .72rem);
    letter-spacing: .1em;
    color: var(--text-2, #9ca3af);
    width: 120px;
    flex-shrink: 0;
    text-transform: uppercase;
  }
  .db-cat-bar-bg {
    flex: 1;
    height: 10px;
    background: var(--ink-4, #1f222c);
    border-radius: 5px;
    overflow: hidden;
  }
  .db-cat-bar-fill {
    height: 100%;
    border-radius: 5px;
    animation: tw-bar-grow .9s cubic-bezier(.22,1,.36,1) both;
  }
  .db-cat-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    color: var(--text-2, #9ca3af);
    width: 52px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── ZONE GRID ── */
  .db-zone-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .7rem;
  }
  .db-zone-item {
    background: var(--ink-3, #161920);
    border: 1px solid var(--glass-border, rgba(255,255,255,.08));
    border-radius: 14px;
    padding: 1rem 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .6rem;
    animation: tw-card-in .5s cubic-bezier(.22,1,.36,1) both;
    transition: all .2s cubic-bezier(.22,1,.36,1);
  }
  @media (min-width: 900px) {
    .db-zone-item:hover {
      border-color: rgba(201,151,58,.3);
      background: var(--ink-5, #292d3a);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,.3);
    }
  }
  .db-zone-name {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.58rem, .85vw, .7rem);
    color: var(--text-2, #9ca3af);
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .db-zone-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    color: var(--gold, #c9973a);
    line-height: 1;
    text-shadow: 0 0 14px rgba(201,151,58,.4);
  }

  /* ── TABLE ── */
  .db-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .db-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 580px;
  }
  .db-table th {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.6rem, .9vw, .72rem);
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--text-3, #6b7280);
    padding: .9rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--ink-4, #1f222c);
    white-space: nowrap;
  }
  .db-table td {
    padding: 1rem 1rem;
    border-bottom: 1px solid var(--ink-4, #1f222c);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(.88rem, 1.2vw, 1rem);
    color: var(--text-2, #9ca3af);
    vertical-align: middle;
  }
  .db-table tr:last-child td { border-bottom: none; }
  @media (min-width: 900px) {
    .db-table tbody tr { transition: background .2s; }
    .db-table tbody tr:hover td {
      background: var(--ink-3, #161920);
      color: var(--text-1, #f0eeeb);
    }
  }

  .db-train-no {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.7rem, 1vw, .84rem);
    color: var(--gold, #c9973a);
    font-weight: 700;
    display: inline-block;
    background: var(--gold-pale, rgba(201,151,58,.1));
    border: 1px solid rgba(201,151,58,.2);
    padding: .25rem .65rem;
    border-radius: 6px;
    white-space: nowrap;
  }
  .db-train-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.05rem, 1.5vw, 1.3rem);
    color: var(--text-1, #f0eeeb);
    letter-spacing: .05em;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
  }

  .db-cat-badge {
    font-family: 'Space Mono', monospace;
    font-size: clamp(.54rem, .8vw, .66rem);
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: .3rem .8rem;
    border-radius: 8px;
    white-space: nowrap;
    animation: tw-badge-pop .4s cubic-bezier(.22,1,.36,1) both;
    border: 1px solid transparent;
  }
  .badge-gold  { background: rgba(201,151,58,.12); color: #e8b454; border-color: rgba(201,151,58,.25); }
  .badge-green { background: rgba(61,184,122,.09);  color: #3db87a; border-color: rgba(61,184,122,.22); }
  .badge-amber { background: rgba(212,136,58,.09);  color: #d4883a; border-color: rgba(212,136,58,.22); }
  .badge-muted { background: rgba(255,255,255,.04); color: #9ca3af; border-color: rgba(255,255,255,.08); }

  .db-score-bar { display: flex; align-items: center; gap: .6rem; }
  .db-score-bg  { width: 72px; height: 6px; background: var(--ink-4, #1f222c); border-radius: 3px; overflow: hidden; }
  .db-score-fill { height: 100%; border-radius: 3px; animation: tw-bar-grow .8s cubic-bezier(.22,1,.36,1) both; }
  .db-score-num { font-family: 'Space Mono', monospace; font-size: clamp(.64rem, .9vw, .76rem); font-weight: 700; }

  /* ── LOADER ── */
  .db-loader {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 7rem 2rem; gap: 2.5rem;
  }
  .db-spinner-wrap { position: relative; width: 72px; height: 72px; }
  .db-spinner-outer {
    width: 72px; height: 72px;
    border: 2px solid var(--glass-border, rgba(255,255,255,.08));
    border-top-color: var(--gold, #c9973a);
    border-right-color: var(--gold-light, #e8b454);
    border-radius: 50%;
    animation: tw-spin .75s linear infinite;
  }
  .db-spinner-inner {
    position: absolute;
    top: 11px; left: 11px; right: 11px; bottom: 11px;
    border: 1px solid rgba(201,151,58,.2);
    border-bottom-color: var(--gold, #c9973a);
    border-radius: 50%;
    animation: tw-spin-rev .5s linear infinite;
  }
  .db-spinner-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--gold, #c9973a);
    box-shadow: 0 0 16px var(--gold, #c9973a);
    transform: translate(-50%,-50%);
  }
  .db-loader-text {
    font-family: 'Space Mono', monospace;
    font-size: .78rem;
    color: var(--text-3, #6b7280);
    letter-spacing: .35em;
    text-transform: uppercase;
    animation: tw-float 1.5s ease-in-out infinite;
  }

  .db-error {
    background: rgba(224,82,82,.06);
    border: 1px solid rgba(224,82,82,.25);
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: .85rem;
    letter-spacing: .1em;
    color: #e05252;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .75rem;
  }

  .db-footer {
    margin-top: 5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: .75rem;
    font-family: 'Space Mono', monospace;
    font-size: clamp(.55rem, .8vw, .68rem);
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--text-3, #6b7280);
    border-top: 1px solid var(--ink-4, #1f222c);
    padding-top: 1.75rem;
  }
  .db-footer-accent { color: var(--gold, #c9973a); opacity: .5; }

  /* ── MOBILE ── */
  @media (max-width: 559px) {
    .db-page { padding: 1.4rem 1rem 5rem; }
    .db-title { font-size: clamp(3.2rem, 14vw, 5rem); }
    .db-panel { padding: 1.4rem 1.1rem; border-radius: 18px; }
    .db-hero-stat { padding: 1.4rem 1.1rem; border-radius: 16px; }
    .db-kpi-grid { gap: .7rem; }
    .db-kpi-card { padding: 1.1rem .9rem; border-radius: 14px; }
    .db-hero-stat-value { font-size: 2.8rem; }
    .db-ticker { gap: 1.1rem; }
    .db-ticker-val { font-size: 2rem; }
    .db-status-bar { padding: .85rem 1.1rem; gap: .9rem; font-size: .62rem; }
    .db-zone-grid { grid-template-columns: 1fr; }
    .db-cat-name { width: 90px; }
    .db-table th, .db-table td { padding: .75rem .65rem; }
    .db-score-bg { width: 50px; }
  }

  /* ── TABLET ── */
  @media (min-width: 560px) and (max-width: 899px) {
    .db-hero-stat-value { font-size: clamp(2.6rem, 6vw, 3.5rem); }
    .db-zone-grid { grid-template-columns: repeat(3, 1fr); }
  }
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

/* ── Sub-components ── */
const Loader = () => (
  <div className="db-loader">
    <div className="db-spinner-wrap">
      <div className="db-spinner-outer" />
      <div className="db-spinner-inner" />
      <div className="db-spinner-dot"   />
    </div>
    <div className="db-loader-text">Loading Intelligence…</div>
  </div>
)

const ErrorPanel = ({ msg }) => (
  <div className="db-error">⚠ &nbsp;{msg || "Failed to fetch dashboard data."}</div>
)

const RailDivider = () => <div className="db-rail-divider" />

const SectionLabel = ({ children }) => (
  <div className="db-section-label">{children}</div>
)

/* ── Main ── */
const DashBoard = () => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [tick,    setTick]    = useState(new Date())

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
      <div className="db-page">

        {/* ── HEADER ── */}
        <div className="db-header">
          <div className="db-eyebrow">Railway Intelligence System</div>
          <h1 className="db-title">
            Network{" "}
            <span className="db-accent" data-text="Overview">Overview</span>
          </h1>
          <p className="db-subtitle">Live Operations Dashboard — Indian Railway Analytics</p>

          {data && (
            <div className="db-ticker">
              <div className="db-ticker-item">
                <span className="db-ticker-val">{fmt(data.Total_Trains)}</span>
                <span className="db-ticker-label">Trains</span>
              </div>
              <div className="db-ticker-divider" />
              <div className="db-ticker-item">
                <span className="db-ticker-val">{fmt(data.Unique_Railway_Zones)}</span>
                <span className="db-ticker-label">Zones</span>
              </div>
              <div className="db-ticker-divider" />
              <div className="db-ticker-item">
                <span className="db-ticker-val">{fmt(totalStations)}</span>
                <span className="db-ticker-label">Stations</span>
              </div>
              <div className="db-ticker-divider" />
              <div className="db-ticker-item">
                <span className="db-ticker-val">{fmt(data.Unique_Routes)}</span>
                <span className="db-ticker-label">Routes</span>
              </div>
            </div>
          )}

          <div className="db-status-bar" style={{ marginTop: "1.75rem" }}>
            <div className="db-status-item">
              <div className="db-status-dot green" />
              <span>SYSTEMS NOMINAL</span>
            </div>
            <div className="db-status-item">
              <div className="db-status-dot gold" />
              <span>DATA FEED <span className="db-status-val">LIVE</span></span>
            </div>
            <div className="db-status-item">
              <div className="db-status-dot amber" />
              <span>IST <span className="db-status-val">{timeStr}</span></span>
            </div>
            <div className="db-status-item" style={{ marginLeft: "auto" }}>
              <span>{dateStr}</span>
            </div>
          </div>
        </div>

        {loading && <Loader />}
        {!loading && error && <ErrorPanel msg={error} />}

        {!loading && !error && data && (
          <>
            {/* ── HERO STATS ── */}
            <SectionLabel>Core Network Metrics</SectionLabel>
            <div className="db-hero-grid">
              {[
                { label: "Total Trains",   value: fmt(data.Total_Trains),           color: "c-gold",  ghost: "TR", sub: "across network",      d: 0    },
                { label: "Railway Zones",  value: fmt(data.Unique_Railway_Zones),   color: "c-green", ghost: "ZN", sub: "operational zones",    d: .08  },
                { label: "Unique Routes",  value: fmt(data.Unique_Routes),          color: "c-gold",  ghost: "RT", sub: "distinct itineraries", d: .16  },
                { label: "Total Stations", value: fmt(totalStations),               color: "c-amber", ghost: "ST", sub: "network stations",     d: .24  },
              ].map(s => (
                <div key={s.label} className="db-hero-stat" style={{ animationDelay: `${s.d}s` }}>
                  <div className="db-card-rail" />
                  <div className="db-hero-stat-ghost">{s.ghost}</div>
                  <div className="db-hero-stat-label">{s.label}</div>
                  <div className={`db-hero-stat-value ${s.color}`}>{s.value}</div>
                  <div className="db-hero-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <RailDivider />

            {/* ── KPI GRID ── */}
            <SectionLabel>Performance Averages</SectionLabel>
            <div className="db-kpi-grid">
              {[
                { label: "Avg Speed",     value: `${fmt(data.Average_Speed, 1)} km/h`,        color: "c-gold",  unit: "fleet average",    d: 0    },
                { label: "Avg Distance",  value: `${fmt(data.Average_Distance, 0)} km`,        color: "c-green", unit: "per route",         d: .05  },
                { label: "Avg Occupancy", value: `${fmt(data.Average_Occupancy, 1)}%`,         color: (data.Average_Occupancy ?? 0) > 85 ? "c-amber" : "c-green", unit: "seat utilisation", d: .10 },
                { label: "Punctuality",   value: `${fmt(data.Average_Punctuality, 1)}`,        color: (data.Average_Punctuality ?? 0) > 75 ? "c-green" : (data.Average_Punctuality ?? 0) > 50 ? "c-gold" : "c-amber", unit: "score / 100", d: .15 },
                ...(avgDelay  != null ? [{ label: "Delay Risk",  value: `${fmt(avgDelay, 1)}%`,     color: "c-red",   unit: "avg probability", d: .20 }] : []),
                ...(electPct  != null ? [{ label: "Electrified", value: `${fmt(electPct, 1)}%`,     color: "c-green", unit: "routes on grid",  d: .25 }] : []),
                ...(avgRating != null ? [{ label: "Avg Rating",  value: `${fmt(avgRating, 2)} / 5`, color: "c-gold",  unit: "passenger score", d: .30 }] : []),
                ...(totalRev  != null ? [{ label: "Revenue",     value: fmtCr(totalRev),             color: "c-green", unit: "total network",   d: .35 }] : []),
                { label: "Categories", value: `${catEntries.length}`,  color: "c-amber", unit: "train types",   d: .40 },
                { label: "Zones",      value: `${zoneEntries.length}`, color: "c-gold",  unit: "tracked zones", d: .45 },
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

            <RailDivider />

            {/* ── FLEET COMPOSITION ── */}
            <SectionLabel>Fleet Composition</SectionLabel>
            <div className="db-cols">
              <div className="db-panel">
                <div className="db-scan-line" />
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

              <div className="db-panel">
                <div className="db-scan-line" />
                <SectionLabel>Railway Zones</SectionLabel>
                <div className="db-zone-grid">
                  {zoneEntries.map(([zone, count], i) => (
                    <div key={zone} className="db-zone-item" style={{ animationDelay: `${i * .045}s` }}>
                      <div>
                        <div className="db-zone-name">{zone}</div>
                        <div style={{ marginTop: ".35rem" }}>
                          <div className="db-cat-bar-bg" style={{ height: "3px" }}>
                            <div className="db-cat-bar-fill" style={{ width: `${(count / maxZone) * 100}%`, background: "#c9973a", animationDelay: `${i * .05}s` }} />
                          </div>
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
                <RailDivider />
                <SectionLabel>Top Punctual Trains</SectionLabel>
                <div className="db-panel" style={{ marginBottom: "1.75rem" }}>
                  <div className="db-scan-line" />
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
                          <tr key={t.TrainNo} style={{ animationDelay: `${i * .07}s` }}>
                            <td><span className="db-train-no">{t.TrainNo}</span></td>
                            <td><div className="db-train-name">{t.TrainName}</div></td>
                            <td><span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span></td>
                            <td style={{ fontSize: "clamp(.76rem, 1vw, .9rem)", color: "#6b7280", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t.StartingPoint} → {t.FinalDestination}
                            </td>
                            <td>
                              <div className="db-score-bar">
                                <div className="db-score-bg">
                                  <div className="db-score-fill" style={{ width: `${t.PunctualityScore ?? 0}%`, background: scoreColor(t.PunctualityScore, 100), animationDelay: `${i * .08}s` }} />
                                </div>
                                <span className="db-score-num" style={{ color: scoreColor(t.PunctualityScore, 100) }}>{fmt(t.PunctualityScore, 1)}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.65rem,.9vw,.78rem)", color: "#c9973a" }}>
                              {fmt(t.AverageSpeed_kmph, 1)}<span style={{ color: "#6b7280" }}> km/h</span>
                            </td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.65rem,.9vw,.78rem)", color: "#6b7280" }}>{fmt(t.Distance_km)} km</td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.58rem,.8vw,.7rem)", color: "#6b7280" }}>{t.RailwayZone}</td>
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
                <SectionLabel>High Delay Risk — Flagged Trains</SectionLabel>
                <div className="db-panel" style={{ border: "1px solid rgba(224,82,82,.2)" }}>
                  <div className="db-scan-line" />
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
                          <tr key={t.TrainNo} style={{ animationDelay: `${i * .07}s` }}>
                            <td><span className="db-train-no" style={{ color: "#e05252", borderColor: "rgba(224,82,82,.2)", background: "rgba(224,82,82,.08)" }}>{t.TrainNo}</span></td>
                            <td><div className="db-train-name">{t.TrainName}</div></td>
                            <td><span className={`db-cat-badge ${catBadgeClass(t.TrainCategory)}`}>{t.TrainCategory}</span></td>
                            <td style={{ fontSize: "clamp(.76rem,1vw,.9rem)", color: "#6b7280", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t.StartingPoint} → {t.FinalDestination}
                            </td>
                            <td>
                              <div className="db-score-bar">
                                <div className="db-score-bg">
                                  <div className="db-score-fill" style={{ width: `${t.DelayProbability ?? 0}%`, background: "#e05252", animationDelay: `${i * .08}s` }} />
                                </div>
                                <span className="db-score-num" style={{ color: "#e05252" }}>{fmt(t.DelayProbability, 1)}%</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.65rem,.9vw,.78rem)", color: "#c9973a" }}>
                              {fmt(t.AverageSpeed_kmph, 1)}<span style={{ color: "#6b7280" }}> km/h</span>
                            </td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.65rem,.9vw,.78rem)", color: "#6b7280" }}>{fmt(t.Distance_km)} km</td>
                            <td style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(.58rem,.8vw,.7rem)", color: "#6b7280" }}>{t.RailwayZone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="db-footer">
              <span>Railway Intelligence System © 2025</span>
              <span className="db-footer-accent">▶ ALL SYSTEMS OPERATIONAL</span>
              <span>Dataset · 1005 Trains · Powered by RI/Core</span>
            </div>
          </>
        )}
      </div>
    </Navbar>
  )
}

export default DashBoard