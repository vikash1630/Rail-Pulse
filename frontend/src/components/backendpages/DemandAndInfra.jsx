import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../pages/Navbar';

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  /* ── Keyframes ── */
  @keyframes di-card-in {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes di-hero-rise {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes di-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes di-glow-pulse {
    0%, 100% { box-shadow: 0 0 10px var(--gold-glow); }
    50%       { box-shadow: 0 0 28px var(--gold-glow), 0 0 56px rgba(201,151,58,.18); }
  }
  @keyframes di-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes di-rail-flow {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 0; }
  }
  @keyframes di-sig-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .4; transform: scale(0.85); }
  }
  @keyframes di-badge-pop {
    0%   { transform: scale(.5); opacity: 0; }
    65%  { transform: scale(1.18); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes di-bg-move {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }
  @keyframes di-bar-grow {
    from { width: 0 !important; }
  }
  @keyframes di-shimmer-line {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes di-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Page Shell ── */
  .di-page {
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    background: var(--ink);
    font-family: var(--font-body);
    color: var(--text-1);
    padding: 1.5rem 1rem 6rem;
    overflow-x: hidden;
  }
  @media (min-width: 560px) {
    .di-page { padding: 2rem 1.5rem 6rem; }
  }
  @media (min-width: 900px) {
    .di-page {
      padding: 3rem 2.5rem 6rem;
      background-image:
        linear-gradient(rgba(201,151,58,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,151,58,.025) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: di-bg-move 12s linear infinite;
    }
  }

  /* ── Eyebrow ── */
  .di-eyebrow {
    font-family: var(--font-mono);
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: .5em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: 1rem;
    overflow: hidden;
    animation: di-fade-in .6s ease both;
  }
  .di-eyebrow::before,
  .di-eyebrow::after {
    content: '';
    flex: 1;
    height: 1px;
    max-width: 56px;
    background: linear-gradient(90deg, transparent, var(--gold-glow));
  }
  .di-eyebrow::after { background: linear-gradient(270deg, transparent, var(--gold-glow)); }

  /* ── Title ── */
  .di-title {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 11vw, 8rem);
    line-height: .92;
    color: var(--gold);
    letter-spacing: .05em;
    margin: 0 0 .5rem;
    animation: di-hero-rise .8s cubic-bezier(.22,1,.36,1) both;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .di-title span {
    -webkit-text-stroke: 2px var(--gold);
    color: transparent;
  }
  .di-subtitle {
    font-family: var(--font-mono);
    font-size: clamp(.7rem, 1.8vw, .88rem);
    color: var(--text-3);
    letter-spacing: .18em;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
    animation: di-fade-in 1s ease .3s both;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Tabs ── */
  .di-tabs {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--ink-4);
    padding-bottom: .75rem;
    max-width: 100%;
  }
  .di-tab {
    font-family: var(--font-mono);
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .2em;
    text-transform: uppercase;
    padding: .7rem 1.4rem;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    min-height: 48px;
  }
  .di-tab:hover {
    color: var(--gold);
    background: var(--gold-pale);
    border-color: var(--gold-glow);
    transform: translateY(-1px);
  }
  .di-tab.active {
    color: var(--gold);
    background: var(--gold-pale);
    border-color: var(--gold);
    animation: di-glow-pulse 2.8s ease infinite;
  }

  /* ── Section Label ── */
  .di-slabel {
    font-family: var(--font-mono);
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: .55rem;
    overflow: hidden;
    min-width: 0;
  }
  .di-slabel::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 12px rgba(201,151,58,.8);
    flex-shrink: 0;
    animation: di-sig-pulse 2s ease infinite;
  }

  /* ── Stat Grid ── */
  .di-stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    max-width: 100%;
  }
  @media (min-width: 560px) {
    .di-stat-grid { grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
  }
  @media (min-width: 900px) {
    .di-stat-grid { grid-template-columns: repeat(5, 1fr); gap: 1.5rem; }
  }
  .di-stat-card {
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 1.4rem 1.2rem;
    animation: di-card-in .55s cubic-bezier(.22,1,.36,1) both;
    transition: border-color .25s, transform .25s;
    position: relative;
    overflow: hidden;
    min-width: 0;
  }
  @media (min-width: 560px) {
    .di-stat-card { padding: 1.8rem 1.6rem; }
  }
  .di-stat-card::after {
    content: '';
    position: absolute;
    top: 0; left: -60%;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,.06), transparent);
    animation: di-shimmer-line 3.5s ease infinite;
  }
  .di-stat-card:hover {
    border-color: var(--gold-glow);
    transform: translateY(-3px);
  }
  .di-stat-label {
    font-family: var(--font-mono);
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: .6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .di-stat-value {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    color: var(--gold);
    line-height: 1;
  }
  .di-stat-value.green { color: var(--sig-green); }
  .di-stat-value.red   { color: var(--sig-red); }
  .di-stat-value.amber { color: var(--sig-amber); }

  /* ── Card ── */
  .di-card {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 28px;
    padding: 1.5rem 1.2rem;
    animation: di-card-in .6s cubic-bezier(.22,1,.36,1) both;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.75rem;
    transition: border-color .25s;
    max-width: 100%;
    min-width: 0;
  }
  @media (min-width: 560px) {
    .di-card { padding: 2rem 1.75rem; }
  }
  @media (min-width: 900px) {
    .di-card {
      padding: 2.5rem;
      transition: border-color .25s, transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s;
    }
    .di-card:hover {
      border-color: var(--gold-glow);
      transform: translateY(-5px) scale(1.004);
      box-shadow: 0 16px 48px rgba(0,0,0,.5), 0 0 32px var(--gold-glow);
    }
  }
  .di-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: .5;
  }

  /* ── Ghost ── */
  .di-ghost { display: none; }
  @media (min-width: 900px) {
    .di-ghost {
      display: block;
      position: absolute;
      bottom: .5rem; right: 1.2rem;
      font-family: var(--font-display);
      font-size: 8rem;
      color: rgba(201,151,58,.035);
      pointer-events: none;
      user-select: none;
      line-height: 1;
    }
  }

  /* ── Search Panel ── */
  .di-search-panel {
    background: var(--ink-2);
    border: 1px solid var(--glass-border);
    border-radius: 28px;
    padding: 1.5rem 1.2rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    transition: border-color .25s, box-shadow .25s;
    max-width: 100%;
  }
  @media (min-width: 560px) {
    .di-search-panel { padding: 2rem 1.75rem; }
  }
  .di-search-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .di-search-panel:focus-within {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow), 0 10px 32px rgba(0,0,0,.28);
  }

  /* ── Input Row ── */
  .di-input-row {
    display: flex;
    gap: .75rem;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .di-input, .di-select {
    flex: 1;
    min-width: 0;
    background: var(--ink-3);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: .9rem 1.25rem;
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-1);
    outline: none;
    min-height: 52px;
    transition: border-color .2s, box-shadow .2s;
    width: 100%;
    max-width: 100%;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  .di-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23c9973a' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1.2rem center;
    padding-right: 2.8rem;
  }
  .di-input:focus, .di-select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
  }
  .di-input::placeholder { color: var(--text-3); }
  .di-select option {
    background: var(--ink-3);
    color: var(--text-1);
    font-size: 1rem;
    padding: .5rem;
  }

  /* ── Button ── */
  .di-btn {
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: .2em;
    text-transform: uppercase;
    border: none;
    border-radius: 16px;
    padding: .9rem 1.8rem;
    cursor: pointer;
    min-height: 52px;
    position: relative;
    overflow: hidden;
    transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s, opacity .2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .di-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent);
    transition: left .4s ease;
  }
  .di-btn:hover::before { left: 160%; }
  .di-btn:hover {
    box-shadow: 0 6px 28px var(--gold-glow);
    transform: translateY(-2px);
  }
  .di-btn:active { transform: scale(.97); }
  .di-btn:disabled { opacity: .38; cursor: not-allowed; transform: none; }

  /* ── Table ── */
  .di-table-wrap {
    overflow-x: auto;
    border-radius: 16px;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
    display: block;
  }
  .di-table {
    width: 100%;
    border-collapse: collapse;
    font-size: .82rem;
    min-width: 380px;
  }
  .di-table th {
    font-family: var(--font-mono);
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--text-3);
    padding: .85rem .8rem;
    text-align: left;
    border-bottom: 1px solid var(--ink-4);
    white-space: nowrap;
  }
  .di-table td {
    padding: .85rem .8rem;
    border-bottom: 1px solid rgba(255,255,255,.04);
    color: var(--text-2);
    line-height: 1.5;
    font-size: .82rem;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .di-table tr:last-child td { border-bottom: none; }
  .di-table tr {
    transition: background .15s;
  }
  .di-table tr:hover td {
    background: var(--ink-3);
    color: var(--text-1);
  }
  .mono { font-family: var(--font-mono); font-size: .76rem; color: var(--text-3); }

  /* ── Badge ── */
  .di-badge {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    font-family: var(--font-mono);
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    padding: .28rem .6rem;
    border-radius: 8px;
    animation: di-badge-pop .35s cubic-bezier(.22,1,.36,1) both;
    white-space: nowrap;
  }
  .di-badge.gold   { background: var(--gold-pale); color: var(--gold); border: 1px solid var(--gold-glow); }
  .di-badge.green  { background: rgba(61,184,122,.12); color: var(--sig-green); border: 1px solid rgba(61,184,122,.3); }
  .di-badge.amber  { background: rgba(212,136,58,.12); color: var(--sig-amber); border: 1px solid rgba(212,136,58,.3); }
  .di-badge.red    { background: rgba(224,82,82,.12); color: var(--sig-red); border: 1px solid rgba(224,82,82,.3); }

  /* ── Sig Dot ── */
  .di-dot {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    animation: di-sig-pulse 1.8s ease infinite;
    flex-shrink: 0;
  }
  .di-dot.green { background: var(--sig-green); }
  .di-dot.amber { background: var(--sig-amber); }
  .di-dot.red   { background: var(--sig-red); }

  /* ── Bar Chart ── */
  .di-bar-list { display: flex; flex-direction: column; gap: .9rem; }
  .di-bar-row  { display: flex; align-items: center; gap: .65rem; min-width: 0; }
  .di-bar-label {
    font-family: var(--font-mono);
    font-size: .65rem;
    color: var(--text-2);
    width: 80px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (min-width: 480px) { .di-bar-label { width: 100px; } }
  @media (min-width: 700px) { .di-bar-label { width: 130px; } }
  .di-bar-track {
    flex: 1;
    height: 11px;
    background: var(--ink-3);
    border-radius: 6px;
    overflow: hidden;
    min-width: 0;
  }
  .di-bar-fill {
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    animation: di-bar-grow 1s cubic-bezier(.22,1,.36,1) both;
    transition: width 1s cubic-bezier(.22,1,.36,1);
  }
  .di-bar-val {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: var(--gold);
    width: 42px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Rail Divider ── */
  .di-divider {
    display: flex;
    align-items: center;
    gap: .7rem;
    margin: 2.25rem 0 2rem;
    color: var(--text-3);
    font-family: var(--font-mono);
    font-size: .7rem;
    letter-spacing: .3em;
    text-transform: uppercase;
    overflow: hidden;
    white-space: nowrap;
  }
  .di-divider::before,
  .di-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: repeating-linear-gradient(
      90deg,
      var(--ink-4) 0, var(--ink-4) 8px,
      transparent 8px, transparent 14px
    );
    animation: di-rail-flow 1.4s linear infinite;
    min-width: 0;
  }

  /* ── Loader ── */
  .di-loader {
    display: flex; flex-direction: column;
    align-items: center; gap: 2.25rem;
    padding: 6rem 1rem;
    animation: di-fade-in .4s ease both;
  }
  .di-spinner { position: relative; width: 72px; height: 72px; }
  .di-spin-outer {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2.5px solid transparent;
    border-top-color: var(--gold);
    border-right-color: var(--gold-light);
    animation: di-spin .9s linear infinite;
  }
  .di-spin-inner {
    position: absolute; inset: 12px; border-radius: 50%;
    border: 1.5px solid rgba(201,151,58,.2);
    border-bottom-color: var(--gold);
    animation: di-spin .7s linear infinite reverse;
  }
  .di-spin-dot {
    position: absolute; inset: 24px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 18px var(--gold);
  }
  .di-loader-txt {
    font-family: var(--font-mono); font-size: .8rem;
    letter-spacing: .4em; text-transform: uppercase;
    color: var(--text-3); animation: di-float 2.2s ease infinite;
  }

  /* ── Empty / Error ── */
  .di-empty {
    text-align: center; padding: 5rem 1rem;
    font-family: var(--font-mono); font-size: .85rem;
    letter-spacing: .22em; text-transform: uppercase; color: var(--text-3);
    animation: di-fade-in .4s ease both;
  }
  .di-empty-icon {
    font-size: 3.5rem; display: block;
    margin-bottom: 1.25rem;
    animation: di-float 3s ease infinite;
  }
  .di-error {
    background: rgba(224,82,82,.07);
    border: 1px solid rgba(224,82,82,.25);
    border-radius: 18px;
    padding: 1.4rem 1.6rem;
    font-family: var(--font-mono); font-size: .82rem;
    color: var(--sig-red); letter-spacing: .1em;
    margin-bottom: 1.5rem;
    word-break: break-word;
    animation: di-fade-in .3s ease both;
  }

  /* ── Two Col ── */
  .di-two-col { display: grid; grid-template-columns: 1fr; gap: 1.5rem; max-width: 100%; }
  @media (min-width: 700px) { .di-two-col { grid-template-columns: 1fr 1fr; } }

  /* ── Range Grid ── */
  .di-range-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .9rem; max-width: 100%; }
  @media (min-width: 560px) { .di-range-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 900px) { .di-range-grid { grid-template-columns: repeat(4, 1fr); } }
  .di-range-item {
    background: var(--ink-3); border: 1px solid var(--glass-border);
    border-radius: 16px; padding: 1.2rem 1.3rem;
    transition: border-color .2s, transform .2s cubic-bezier(.22,1,.36,1);
    min-width: 0; overflow: hidden;
  }
  .di-range-item:hover {
    border-color: var(--gold-glow);
    transform: translateY(-2px);
  }
  .ri-name {
    font-family: var(--font-mono); font-size: .65rem; color: var(--text-3);
    margin-bottom: .35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: .12em; text-transform: uppercase;
  }
  .ri-val {
    font-family: var(--font-display); font-size: 2rem;
    color: var(--gold); line-height: 1;
  }

  /* ── Pagination ── */
  .di-pagination {
    display: flex; gap: .65rem; margin-top: 1.4rem;
    flex-wrap: wrap; align-items: center;
  }
  .di-page-info {
    font-family: var(--font-mono); font-size: .76rem;
    color: var(--text-3); letter-spacing: .1em;
  }

  /* ── Mode Tabs (inner) ── */
  .di-mode-tabs {
    display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.4rem;
  }

  /* ── Highlight card big train name ── */
  .di-train-big {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 5.5vw, 3rem);
    line-height: 1.05;
    margin-bottom: .5rem;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .di-train-meta {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: var(--text-3);
    margin-bottom: .5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: .08em;
  }

  /* ── Full-width button util ── */
  @media (max-width: 560px) {
    .di-btn-fw { width: 100%; justify-content: center; }
  }
`;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
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

const catBadge = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('rajdhani') || c.includes('shatabdi') || c.includes('vande')) return 'gold';
  if (c.includes('express')) return 'green';
  if (c.includes('mail')) return 'amber';
  return 'red';
};

/* ─────────────────────────────────────────────
   Micro Components
───────────────────────────────────────────── */
const Loader = ({ text = 'Loading data' }) => (
  <div className="di-loader">
    <div className="di-spinner">
      <div className="di-spin-outer" />
      <div className="di-spin-inner" />
      <div className="di-spin-dot" />
    </div>
    <div className="di-loader-txt">{text}…</div>
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
   DEMAND OVERVIEW TAB
───────────────────────────────────────────── */
const DemandOverviewTab = () => {
  const [state, setState] = useState({
    catOcc: null, zoneOcc: null, highest: null, lowest: null,
    loading: true, error: null,
  });

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

  const catEntries = Object.entries(catOcc?.trains || {}).sort((a, b) => b[1] - a[1]);
  const zoneEntries = Object.entries(zoneOcc?.trains || {}).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(e => e[1]), 1);
  const maxZone = Math.max(...zoneEntries.map(e => e[1]), 1);

  const ht = highest?.train?.[0];
  const lt = lowest?.train?.[0];

  return (
    <div>
      <div className="di-two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="di-card" style={{ animationDelay: '0s' }}>
          <div className="di-ghost">MAX</div>
          <div className="di-slabel">Highest Occupancy</div>
          {ht ? (
            <>
              <div className="di-train-big" style={{ color: 'var(--sig-amber)' }}>{ht.TrainName}</div>
              <div className="di-train-meta">#{ht.TrainNo} · {ht.TrainCategory} · {ht.RailwayZone}</div>
              <div className="di-train-meta" style={{ marginBottom: '.75rem' }}>
                {ht.StartingPoint} → {ht.FinalDestination} · {ht.Distance_km} km
              </div>
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                <span className="di-badge amber"><span className="di-dot amber" />{ht.OccupancyPercentage != null ? `${ht.OccupancyPercentage}%` : 'N/A'} Occ.</span>
                <span className="di-badge gold">{ht.CoachCount} Coaches</span>
                {ht.PunctualityScore != null && <span className="di-badge green">⏱ {ht.PunctualityScore}</span>}
                {ht.DelayProbability != null && <span className="di-badge red">Delay {(ht.DelayProbability * 100).toFixed(0)}%</span>}
                <span className={`di-badge ${ht.ElectrifiedRoute === 'Yes' ? 'green' : 'red'}`}>
                  {ht.ElectrifiedRoute === 'Yes' ? '⚡ Elec' : 'Non-elec'}
                </span>
              </div>
            </>
          ) : <Empty msg="No data" />}
        </div>

        <div className="di-card" style={{ animationDelay: '.1s' }}>
          <div className="di-ghost">MIN</div>
          <div className="di-slabel">Lowest Occupancy</div>
          {lt ? (
            <>
              <div className="di-train-big" style={{ color: 'var(--sig-green)' }}>{lt.TrainName}</div>
              <div className="di-train-meta">#{lt.TrainNo} · {lt.TrainCategory} · {lt.RailwayZone}</div>
              <div className="di-train-meta" style={{ marginBottom: '.75rem' }}>
                {lt.StartingPoint} → {lt.FinalDestination} · {lt.Distance_km} km
              </div>
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                <span className="di-badge green"><span className="di-dot green" />{lt.OccupancyPercentage != null ? `${lt.OccupancyPercentage}%` : 'N/A'} Occ.</span>
                <span className="di-badge gold">{lt.CoachCount} Coaches</span>
                {lt.PunctualityScore != null && <span className="di-badge gold">⏱ {lt.PunctualityScore}</span>}
                {lt.DelayProbability != null && <span className="di-badge amber">Delay {(lt.DelayProbability * 100).toFixed(0)}%</span>}
                <span className={`di-badge ${lt.ElectrifiedRoute === 'Yes' ? 'green' : 'red'}`}>
                  {lt.ElectrifiedRoute === 'Yes' ? '⚡ Elec' : 'Non-elec'}
                </span>
              </div>
            </>
          ) : <Empty msg="No data" />}
        </div>
      </div>

      <Divider label="Segment Breakdown" />

      <div className="di-two-col">
        <div className="di-card" style={{ animationDelay: '.14s' }}>
          <div className="di-ghost">CAT</div>
          <div className="di-slabel" style={{ marginBottom: '1.2rem' }}>Avg Occupancy · By Category</div>
          <div className="di-bar-list">
            {catEntries.map(([cat, val], i) => (
              <div className="di-bar-row" key={i}>
                <div className="di-bar-label" title={cat}>{cat}</div>
                <div className="di-bar-track">
                  <div className="di-bar-fill" style={{ width: `${(val / maxCat) * 100}%` }} />
                </div>
                <div className="di-bar-val">{val.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="di-card" style={{ animationDelay: '.22s' }}>
          <div className="di-ghost">ZONE</div>
          <div className="di-slabel" style={{ marginBottom: '1.2rem' }}>Avg Occupancy · By Zone</div>
          <div className="di-bar-list">
            {zoneEntries.map(([zone, val], i) => {
              const hot = val > 80;
              return (
                <div className="di-bar-row" key={i}>
                  <div className="di-bar-label" title={zone}>{zone}</div>
                  <div className="di-bar-track">
                    <div
                      className="di-bar-fill"
                      style={{
                        width: `${(val / maxZone) * 100}%`,
                        background: hot
                          ? 'linear-gradient(90deg, var(--sig-amber), #f0a040)'
                          : 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                      }}
                    />
                  </div>
                  <div className="di-bar-val" style={{ color: hot ? 'var(--sig-amber)' : 'var(--gold)' }}>
                    {val.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
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

  const switchMode = (m) => {
    setMode(m); setResult(null); setError(null); setQuery('');
  };

  return (
    <div>
      <div className="di-search-panel">
        <div className="di-slabel" style={{ marginBottom: '1.1rem' }}>Occupancy Lookup</div>
        <div className="di-mode-tabs">
          {[['num', 'By Train No.'], ['name', 'By Train Name']].map(([m, lbl]) => (
            <button key={m} className={`di-tab${mode === m ? ' active' : ''}`}
              onClick={() => switchMode(m)}>
              {lbl}
            </button>
          ))}
        </div>
        <div className="di-input-row">
          <input
            className="di-input"
            placeholder={mode === 'num' ? 'Enter train number…' : 'Enter exact train name…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button className="di-btn di-btn-fw" onClick={search} disabled={loading || !query.trim()}>
            {loading ? '…' : 'Search'}
          </button>
        </div>
      </div>

      {loading && <Loader text="Querying occupancy" />}
      {error && <ErrBox msg={error} />}

      {result && result.length > 0 && (
        <div className="di-card" style={{ animationDelay: '0s' }}>
          <div className="di-ghost">OCC</div>
          <div className="di-slabel" style={{ marginBottom: '1rem' }}>
            Results
            <span className="di-badge gold" style={{ marginLeft: '.6rem' }}>
              {result.length} record{result.length > 1 ? 's' : ''}
            </span>
          </div>
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
                  const badgeCls = occ == null ? 'red' : occ > 85 ? 'amber' : occ > 60 ? 'gold' : 'green';
                  const dotCls = occ == null ? 'red' : occ > 85 ? 'amber' : 'green';
                  return (
                    <tr key={i}>
                      {mode === 'name' && <td className="mono">{t.TrainNo}</td>}
                      <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{t.TrainName}</td>
                      <td>
                        <span className={`di-badge ${badgeCls}`}>
                          <span className={`di-dot ${dotCls}`} />
                          {occ != null ? `${occ}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="mono">{t.CoachCount != null ? t.CoachCount : '—'}</td>
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

const CATEGORIES = ['Sampark Kranti Express (SK)', 'Superfast Express (SF)',
  'Rajdhani Express (RJDH)', 'Special Train (SPL)',
  'Tejas Express (TEJ)', 'Suburban Local (EMU)', 'DEMU (DEMU)',
  'Humsafar Express (HMSFR)', 'Double Decker Express (DD)',
  'Duronto Express (DRNT)', 'Vande Bharat Express (VB)',
  'Jan Shatabdi Express (JSTBD)', 'Shatabdi Express (SHTBD)',
  'Mail Express (ME)', 'MEMU (MEMU)', 'Passenger (PASS)',
  'Garib Rath Express (GR)', 'Intercity Express (IC)',
  'Antyodaya Express (ANTY)']
const ZONES = ['Northeast Frontier Railway (NFR)', 'North Central Railway (NCR)',
  'Metro Railway Kolkata (MTPR)', 'East Coast Railway (ECoR)',
  'South Central Railway (SCR)', 'Konkan Railway (KR)',
  'South Eastern Railway (SER)', 'West Central Railway (WCR)',
  'Southern Railway (SR)', 'Central Railway (CR)',
  'Western Railway (WR)', 'Northern Railway (NR)',
  'Eastern Railway (ER)', 'North Eastern Railway (NER)',
  'South Coast Railway (SCoR)', 'North Western Railway (NWR)',
  'East Central Railway (ECR)', 'South East Central Railway (SECR)',
  'South Western Railway (SWR)'];
/* ─────────────────────────────────────────────
   FLEET FILTER TAB
───────────────────────────────────────────── */
const FleetFilterTab = () => {
  const [filterMode, setFilterMode] = useState('zone');
  const [input, setInput] = useState('');
  const [trains, setTrains] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
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
    setInput(val);
    setTrains(null);
    setError(null);
    if (val) search(val);
  };

  const switchFilter = (m) => {
    setFilterMode(m); setTrains(null); setError(null); setInput('');
  };

  const list = trains?.trains || [];
  const slice = list.slice(page * PAGE, (page + 1) * PAGE);
  const pages = Math.ceil(list.length / PAGE);
  const opts = filterMode === 'zone' ? ZONES : CATEGORIES;

  return (
    <div>
      <div className="di-search-panel">
        <div className="di-slabel" style={{ marginBottom: '1.3rem' }}>Fleet Filter</div>
        <div className="di-mode-tabs">
          {[['zone', 'By Zone'], ['category', 'By Category']].map(([m, lbl]) => (
            <button key={m} className={`di-tab${filterMode === m ? ' active' : ''}`}
              onClick={() => switchFilter(m)}>
              {lbl}
            </button>
          ))}
        </div>
        <div className="di-input-row">
          <select className="di-select" value={input} onChange={handleSelect}>
            <option value="">
              {filterMode === 'zone' ? '— Select a Railway Zone —' : '— Select a Train Category —'}
            </option>
            {opts.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader text="Filtering fleet" />}
      {error && <ErrBox msg={error} />}

      {trains && (
        <div className="di-card" style={{ animationDelay: '0s' }}>
          <div className="di-ghost">FLEET</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
            <div className="di-slabel" style={{ margin: 0 }}>{input}</div>
            <span className="di-badge gold">{trains.count} trains</span>
          </div>
          <div className="di-table-wrap">
            <table className="di-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Route</th>
                  <th>Dist km</th>
                  <th>Travel hr</th>
                  <th>Coaches</th>
                  <th>Occ%</th>
                  <th>Fare ₹</th>
                  <th>Stops</th>
                  <th>Route Type</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((t, i) => {
                  const occ = t.OccupancyPercentage;
                  const delay = t.DelayProbability;
                  const punct = t.PunctualityScore;
                  const occColor = occ == null ? 'var(--text-3)' : occ > 85 ? 'var(--sig-amber)' : occ > 60 ? 'var(--gold)' : 'var(--sig-green)';
                  const delColor = delay == null ? 'var(--text-3)' : delay > 0.35 ? 'var(--sig-red)' : delay > 0.2 ? 'var(--sig-amber)' : 'var(--text-3)';
                  const punctColor = punct == null ? 'var(--text-3)' : punct > 85 ? 'var(--sig-green)' : punct > 70 ? 'var(--gold)' : 'var(--sig-red)';
                  return (
                    <tr key={i}>
                      <td className="mono">{t.TrainNo}</td>
                      <td style={{ color: 'var(--text-1)', fontWeight: 600, minWidth: 120, maxWidth: 160 }}>{t.TrainName}</td>
                      <td><span className={`di-badge ${catBadge(t.TrainCategory)}`}>{t.TrainCategory}</span></td>
                      <td className="mono" style={{ fontSize: '.6rem' }}>
                        {t.StartingPoint} → {t.FinalDestination}
                      </td>
                      <td className="mono" style={{ fontSize: '.66rem', color: 'var(--text-2)' }}>
                        {t.Distance_km != null ? t.Distance_km : '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '.66rem', color: 'var(--text-2)' }}>
                        {t.TravelTime_hr != null ? t.TravelTime_hr.toFixed(1) : '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '.66rem', color: 'var(--text-2)' }}>
                        {t.CoachCount != null ? t.CoachCount : '—'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: occColor }}>
                        {occ != null ? `${occ}%` : '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '.6rem', color: 'var(--text-2)' }}>
                        {t.ApproxFareRange_INR || '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '.66rem', color: 'var(--text-2)' }}>
                        {t.AvgStops != null ? t.AvgStops : '—'}
                      </td>
                      <td className="mono" style={{ fontSize: '.62rem', color: 'var(--text-3)' }}>
                        {t.RouteType || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="di-pagination">
              <button className="di-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="di-page-info">Page {page + 1} / {pages}</span>
              <button className="di-btn" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      )}
      {trains && list.length === 0 && <Empty />}
    </div>
  );
};

/* ─────────────────────────────────────────────
   INFRASTRUCTURE TAB
───────────────────────────────────────────── */
const InfraTab = () => {
  const [data, setData] = useState({ avg: null, highCap: null, coach: null, range: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  return (
    <div>
      <div className="di-slabel">Key Infrastructure Metrics</div>
      <div className="di-stat-grid">
        {kpis.map((k, i) => (
          <div className="di-stat-card" key={i} style={{ animationDelay: `${i * .08}s` }}>
            <div className="di-stat-label">{k.label}</div>
            <div className={`di-stat-value ${k.cls}`}>{k.value ?? '—'}</div>
          </div>
        ))}
      </div>

      <Divider label="Platform Capacity by Station" />

      <div className="di-card" style={{ animationDelay: '.1s' }}>
        <div className="di-ghost">INFRA</div>
        <div className="di-slabel" style={{ marginBottom: '1.2rem' }}>Platform Count Ranking</div>
        <div className="di-bar-list">
          {stations.map((s, i) => (
            <div className="di-bar-row" key={i}>
              <div className="di-bar-label" title={s.StartingPoint}>{s.StartingPoint}</div>
              <div className="di-bar-track">
                <div className="di-bar-fill" style={{ width: `${(s.PlatformCountAtOrigin / maxPlat) * 100}%` }} />
              </div>
              <div className="di-bar-val">{s.PlatformCountAtOrigin}</div>
            </div>
          ))}
        </div>
        {(highCap?.stations?.length > 14) && (
          <button className="di-btn" style={{ marginTop: '1.25rem' }} onClick={() => setShowAll(p => !p)}>
            {showAll ? 'Show Less' : `Show All ${highCap.count}`}
          </button>
        )}
      </div>

      <Divider label="Platform Range per Origin" />

      <div className="di-card" style={{ animationDelay: '.2s' }}>
        <div className="di-ghost">RANGE</div>
        <div className="di-slabel" style={{ marginBottom: '1.2rem' }}>Platform Count</div>
        <div className="di-range-grid">
          {rangeList.map((s, i) => (
            <div className="di-range-item" key={i}>
              <div className="ri-name">{s.StartingPoint}</div>
              <div className="ri-val">
                {s.PlatformRange
                  ? ((+s.PlatformRange.split('-')[0] + +s.PlatformRange.split('-')[1]) / 2)
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: 'Demand Overview' },
  { id: 'lookup', label: 'Train Lookup' },
  { id: 'fleet', label: 'Fleet Filter' },
  { id: 'infra', label: 'Infrastructure' },
];

const DemandAndInfra = () => {
  const [tab, setTab] = useState('overview');

  return (
    <Navbar>
      <style>{CSS}</style>
      <div className="di-page">

        <div style={{ marginBottom: '2rem', animation: 'di-hero-rise .8s cubic-bezier(.22,1,.36,1) both' }}>
          <div className="di-eyebrow">Railway Intelligence System</div>
          <h1 className="di-title">Demand <span>&amp;</span> Infra</h1>
          <div className="di-subtitle">Occupancy · Capacity · Fleet · Platform Analytics</div>
        </div>

        <div className="di-tabs">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              className={`di-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
              style={{ animationDelay: `${i * .07}s` }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <DemandOverviewTab />}
        {tab === 'lookup' && <TrainLookupTab />}
        {tab === 'fleet' && <FleetFilterTab />}
        {tab === 'infra' && <InfraTab />}
      </div>
    </Navbar>
  );
};

export default DemandAndInfra;