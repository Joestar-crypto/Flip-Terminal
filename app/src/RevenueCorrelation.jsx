import React, { useState, useEffect, useRef, useMemo } from "react";

// ─── Config ──────────────────────────────────────────────────────────────────
const EXCLUDED_CATS = new Set(["Stablecoin Issuer"]);
const EXCLUDED_SLUGS = new Set(["tether","circle","grayscale","polymarket","base","polygon","ethereum","bsc","binance-staked-eth","binance-alpha","binance-staked-sol","blackrock-buidl","securitize","titan-builder","courtyard","solana","arbitrum","avalanche","optimism"]);

const TIMEFRAMES = [
  { label: "90D", days: 90 },
  { label: "180D", days: 180 },
  { label: "1Y", days: 365 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt$(n) {
  if (n == null) return "—";
  if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

async function fetchJ(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url);
      if (r.status === 429) { await new Promise(w=>setTimeout(w,2000*(i+1))); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { if (i<2) await new Promise(w=>setTimeout(w,800*(i+1))); }
  }
  return null;
}

/** Build geckoId resolver from DefiLlama /protocols + CoinGecko /coins/list */
async function buildGeckoResolver() {
  const [protos, cgList] = await Promise.all([
    fetchJ("https://api.llama.fi/protocols"),
    fetchJ("https://api.coingecko.com/api/v3/coins/list"),
  ]);
  if (!protos || !cgList) return null;

  // 1) DefiLlama: slug→gecko_id  &  parent→gecko_id
  const geckoBySlug = new Map();
  const geckoByParent = new Map();
  const symbolBySlug = new Map();
  const symbolByParent = new Map();
  const nameByParent = new Map();
  for (const p of protos) {
    if (p.symbol && p.symbol !== "-") {
      symbolBySlug.set(p.slug, p.symbol);
      if (p.parentProtocol) symbolByParent.set(p.parentProtocol, p.symbol);
    }
    if (p.parentProtocol) {
      const pName = p.parentProtocol.replace("parent#", "");
      nameByParent.set(p.parentProtocol, pName);
    }
    if (p.gecko_id) {
      geckoBySlug.set(p.slug, p.gecko_id);
      if (p.parentProtocol) geckoByParent.set(p.parentProtocol, p.gecko_id);
    }
  }

  // 2) CoinGecko: symbol → all matching coins (for fuzzy name match)
  const cgBySymbol = new Map();
  for (const c of cgList) {
    const s = c.symbol.toUpperCase();
    if (!cgBySymbol.has(s)) cgBySymbol.set(s, []);
    cgBySymbol.get(s).push(c);
  }

  // Resolve: given a fees-API protocol, return geckoId or null
  return function resolve(feeProto) {
    // Try direct slug match
    const g1 = geckoBySlug.get(feeProto.slug);
    if (g1) return g1;

    // Try parent match
    if (feeProto.parentProtocol) {
      const g2 = geckoByParent.get(feeProto.parentProtocol);
      if (g2) return g2;
    }

    // Fallback: symbol + name matching via CoinGecko list
    const sym = symbolBySlug.get(feeProto.slug)
      || (feeProto.parentProtocol && symbolByParent.get(feeProto.parentProtocol));
    if (!sym || sym === "-") return null;

    const candidates = cgBySymbol.get(sym.toUpperCase());
    if (!candidates || !candidates.length) return null;
    if (candidates.length === 1) return candidates[0].id;

    // Multiple matches: pick best by name similarity to protocol name
    const refName = (feeProto.parentProtocol
      ? nameByParent.get(feeProto.parentProtocol)
      : feeProto.slug
    )?.toLowerCase().replace(/[-_]/g, " ") || "";
    const protoName = (feeProto.displayName || feeProto.name || "").toLowerCase();

    let best = null, bestScore = -1;
    for (const c of candidates) {
      // Skip bridged/wrapped variants
      if (/wormhole|bridged|wrapped/i.test(c.name)) continue;
      const cn = c.name.toLowerCase();
      const ci = c.id.toLowerCase().replace(/-/g, " ");
      let score = 0;
      if (cn === refName || cn === protoName) score += 100;
      if (ci.includes(refName) || refName.includes(ci)) score += 50;
      if (cn.includes(refName) || refName.includes(cn)) score += 30;
      if (cn.includes(protoName) || protoName.includes(cn)) score += 30;
      // Prefer shorter IDs (less likely to be obscure forks)
      score -= c.id.length * 0.1;
      if (score > bestScore) { bestScore = score; best = c.id; }
    }
    return bestScore > 0 ? best : null;
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RevenueCorrelation() {
  const [phase, setPhase] = useState("loading");
  const [bubbles, setBubbles] = useState([]);
  const [progress, setProgress] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [hovered, setHovered] = useState(null);
  const [days, setDays] = useState(90);
  const protosRef = useRef(null);
  const resolverRef = useRef(null);
  const initRef = useRef(false);
  const svgRef = useRef(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    loadData(90);
  }, []);

  async function loadData(numDays) {
    try {
      setPhase("loading");
      setProgress("Building token resolver…");

      // Build resolver (fetches /protocols + /coins/list once)
      if (!resolverRef.current) {
        resolverRef.current = await buildGeckoResolver();
        if (!resolverRef.current) throw new Error("Failed to build token resolver");
      }
      const resolve = resolverRef.current;

      setProgress("Loading protocol revenues from DefiLlama…");
      const data = await fetchJ(
        "https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue"
      );
      if (!data?.protocols) throw new Error("Failed to load protocol data");

      // Deduplicate by parent, keep highest revenue
      const byKey = {};
      for (const p of data.protocols) {
        if (EXCLUDED_CATS.has(p.category)) continue;
        if (EXCLUDED_SLUGS.has(p.slug)) continue;
        if (!p.total30d || p.total30d <= 0) continue;
        const key = p.parentProtocol || p.slug;
        if (!byKey[key] || p.total30d > (byKey[key].total30d || 0)) byKey[key] = p;
      }

      // Resolve tokens dynamically, take top 50 with a token
      const pool = Object.values(byKey)
        .sort((a, b) => (b.total30d || 0) - (a.total30d || 0));

      const resolved = [];
      for (const p of pool) {
        const gId = resolve(p);
        if (gId) resolved.push({ ...p, _geckoId: gId });
        if (resolved.length >= 50) break;
      }

      protosRef.current = resolved;
      await fetchPrices(resolved, numDays);
    } catch (e) {
      setErrMsg(e.message || "Unknown error");
      setPhase("error");
    }
  }

  async function fetchPrices(top, numDays) {
    try {
      setPhase("loading");
      setProgress("Fetching token prices…");

      // Use DefiLlama Coins API — batch all tokens in 2 calls (current + historical)
      const coins = top.map(p => `coingecko:${p._geckoId}`).join(",");
      const historicalTs = Math.floor((Date.now() - numDays * 86400000) / 1000);

      const [curData, histData] = await Promise.all([
        fetchJ(`https://coins.llama.fi/prices/current/${coins}`),
        fetchJ(`https://coins.llama.fi/prices/historical/${historicalTs}/${coins}?searchWidth=86400`),
      ]);

      if (!curData?.coins || !histData?.coins) throw new Error("Failed to load price data");

      const enriched = [];
      for (const p of top) {
        const key = `coingecko:${p._geckoId}`;
        const cur = curData.coins[key]?.price;
        const hist = histData.coins[key]?.price;
        if (!cur || !hist || hist <= 0) continue;

        const perf = ((cur - hist) / hist) * 100;
        // Check breakdownMethodology.HoldersRevenue keys for buyback/burn keywords
        const bdm = p.breakdownMethodology?.HoldersRevenue || {};
        const bdmKeys = Object.keys(bdm).join(" ") + " " + Object.values(bdm).join(" ");
        const hasBuyback = /buy\s*-?\s*back|\bburn/i.test(bdmKeys);

        enriched.push({
          name: p.displayName || p.name,
          slug: p.slug,
          category: p.category,
          revenue: p.total30d,
          perf,
          hasBuyback,
          logo: p.logo,
        });
      }

      setProgress(`${enriched.length} protocols loaded`);
      if (enriched.length < 3) throw new Error("Not enough token data returned");

      setBubbles(enriched);
      setPhase("ready");
    } catch (e) {
      setErrMsg(e.message || "Unknown error");
      setPhase("error");
    }
  }

  function handleTimeframe(newDays) {
    if (newDays === days || phase === "loading") return;
    setDays(newDays);
    if (protosRef.current) {
      fetchPrices(protosRef.current, newDays);
    }
  }

  // ── Chart layout ──
  const W = 920, H = 560;
  const margin = { t: 30, r: 30, b: 60, l: 75 };
  const cw = W - margin.l - margin.r;
  const ch = H - margin.t - margin.b;

  const layout = useMemo(() => {
    if (!bubbles.length) return null;

    const revs = bubbles.map(b => b.revenue);
    const perfs = bubbles.map(b => b.perf);
    const logMin = Math.log10(Math.max(Math.min(...revs), 1));
    const logMax = Math.log10(Math.max(...revs));
    const perfMin = Math.min(...perfs, -50);
    const perfMax = Math.max(...perfs, 50);
    const perfPad = Math.max((perfMax - perfMin) * 0.1, 10);

    const xMin = logMin - 0.15;
    const xMax = logMax + 0.15;
    const yMin = perfMin - perfPad;
    const yMax = perfMax + perfPad;

    const xScale = (v) => margin.l + ((Math.log10(Math.max(v, 1)) - xMin) / (xMax - xMin)) * cw;
    const yScale = (v) => margin.t + ch - ((v - yMin) / (yMax - yMin)) * ch;

    // Bubble radius: log scale for better spread across revenue range
    const rMin = 10, rMax = 36;
    const logRevMin = Math.log10(Math.max(Math.min(...revs), 1));
    const logRevMax = Math.log10(Math.max(...revs));
    const rScale = (v) => {
      const t = logRevMax > logRevMin ? (Math.log10(Math.max(v, 1)) - logRevMin) / (logRevMax - logRevMin) : 0.5;
      return rMin + t * (rMax - rMin);
    };

    // X axis ticks (powers of 10)
    const xTicks = [];
    for (let e = Math.ceil(logMin); e <= Math.floor(logMax) + 1; e++) {
      xTicks.push(Math.pow(10, e));
    }

    // Y axis ticks
    const yTicks = [];
    const yStep = Math.max(10, Math.round((yMax - yMin) / 8 / 10) * 10);
    for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep) {
      yTicks.push(v);
    }

    // Linear regression on log(revenue) vs perf
    const xs = bubbles.map(b => Math.log10(Math.max(b.revenue, 1)));
    const ys = bubbles.map(b => b.perf);
    const n = xs.length;
    const sumX = xs.reduce((a, v) => a + v, 0);
    const sumY = ys.reduce((a, v) => a + v, 0);
    const sumXY = xs.reduce((a, v, i) => a + v * ys[i], 0);
    const sumX2 = xs.reduce((a, v) => a + v * v, 0);
    const denom = n * sumX2 - sumX * sumX;
    const slope = denom ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;
    const regY1 = slope * xMin + intercept;
    const regY2 = slope * xMax + intercept;

    // Buyback-only regression
    const bbBubbles = bubbles.filter(b => b.hasBuyback);
    let bbRegY1 = null, bbRegY2 = null;
    if (bbBubbles.length >= 2) {
      const bxs = bbBubbles.map(b => Math.log10(Math.max(b.revenue, 1)));
      const bys = bbBubbles.map(b => b.perf);
      const bn = bxs.length;
      const bSumX = bxs.reduce((a, v) => a + v, 0);
      const bSumY = bys.reduce((a, v) => a + v, 0);
      const bSumXY = bxs.reduce((a, v, i) => a + v * bys[i], 0);
      const bSumX2 = bxs.reduce((a, v) => a + v * v, 0);
      const bDenom = bn * bSumX2 - bSumX * bSumX;
      const bSlope = bDenom ? (bn * bSumXY - bSumX * bSumY) / bDenom : 0;
      const bIntercept = (bSumY - bSlope * bSumX) / bn;
      bbRegY1 = bSlope * xMin + bIntercept;
      bbRegY2 = bSlope * xMax + bIntercept;
    }

    return { xScale, yScale, rScale, xTicks, yTicks, yMin, yMax, xMin, xMax, regY1, regY2, bbRegY1, bbRegY2 };
  }, [bubbles]);

  // Sort: smaller bubbles on top (drawn last = more visible)
  const sorted = useMemo(() =>
    [...bubbles].sort((a, b) => b.revenue - a.revenue),
  [bubbles]);

  const daysLabel = TIMEFRAMES.find(t => t.days === days)?.label || `${days}D`;

  return (
    <div style={{
      padding: "24px 0", color: "#e0e0e0",
      fontFamily: "'Inter','Space Grotesk',sans-serif",
      width: "100%",
    }}>
      <h2 style={{
        textAlign: "center", fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 24, fontWeight: 700, marginBottom: 4, color: "#fff",
        letterSpacing: "-0.5px",
      }}>
        Revenue vs Token Performance
      </h2>

      {/* Timeframe selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.days}
            onClick={() => handleTimeframe(tf.days)}
            style={{
              background: days === tf.days ? "#10b981" : "#1a1a1a",
              color: days === tf.days ? "#000" : "#888",
              border: `1px solid ${days === tf.days ? "#10b981" : "#333"}`,
              padding: "4px 14px",
              borderRadius: 6,
              cursor: phase === "loading" ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Space Grotesk',sans-serif",
              transition: "all .15s",
              opacity: phase === "loading" ? 0.5 : 1,
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#666", marginBottom: 20 }}>
        X: Revenue 30d (log) · Y: Token perf. {daysLabel} · Size: Revenue · 
        <span style={{ color: "#10b981" }}>●</span> Buyback
        <span style={{ color: "#666", margin: "0 4px" }}>·</span>
        <span style={{ color: "#555" }}>●</span> No buyback
      </p>

      {/* Loading */}
      {phase === "loading" && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{
            width: 36, height: 36, margin: "0 auto 20px",
            border: "3px solid #222", borderTop: "3px solid #10b981",
            borderRadius: "50%", animation: "bcSpin .8s linear infinite",
          }} />
          <style>{`@keyframes bcSpin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontSize: 13, color: "#888" }}>{progress}</div>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div style={{ textAlign: "center", padding: 40, color: "#ff5555" }}>
          {errMsg}
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => { initRef.current = false; loadData(days); }}
              style={{
                background: "#222", color: "#10b981", border: "1px solid #333",
                padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                fontSize: 13, fontFamily: "inherit",
              }}
            >Retry</button>
          </div>
        </div>
      )}

      {/* Chart */}
      {phase === "ready" && layout && (
        <div style={{
          display: "flex", justifyContent: "center",
          overflowX: "auto", padding: "0 10px",
        }}>
          <svg
            ref={svgRef}
            width={W} height={H}
            style={{ display: "block", overflow: "visible" }}
          >
            {/* Grid lines */}
            {layout.yTicks.map(v => (
              <line key={`yg-${v}`}
                x1={margin.l} x2={W - margin.r}
                y1={layout.yScale(v)} y2={layout.yScale(v)}
                stroke={v === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
                strokeWidth={v === 0 ? 1.5 : 1}
                strokeDasharray={v === 0 ? "" : "3,3"}
              />
            ))}
            {layout.xTicks.map((v, i) => (
              <line key={`xg-${i}`}
                x1={layout.xScale(v)} x2={layout.xScale(v)}
                y1={margin.t} y2={H - margin.b}
                stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3"
              />
            ))}

            {/* Axes */}
            <line x1={margin.l} x2={W - margin.r}
              y1={H - margin.b} y2={H - margin.b}
              stroke="rgba(255,255,255,0.12)" />
            <line x1={margin.l} x2={margin.l}
              y1={margin.t} y2={H - margin.b}
              stroke="rgba(255,255,255,0.12)" />

            {/* X axis labels */}
            {layout.xTicks.map((v, i) => (
              <text key={`xl-${i}`}
                x={layout.xScale(v)} y={H - margin.b + 20}
                textAnchor="middle" fontSize={10} fill="#777"
                fontFamily="'JetBrains Mono',monospace"
              >{fmt$(v)}</text>
            ))}
            <text
              x={margin.l + cw / 2} y={H - 8}
              textAnchor="middle" fontSize={12} fill="#888"
              fontFamily="'Space Grotesk',sans-serif" fontWeight={600}
            >Revenue (30d)</text>

            {/* Y axis labels */}
            {layout.yTicks.map(v => (
              <text key={`yl-${v}`}
                x={margin.l - 10} y={layout.yScale(v) + 4}
                textAnchor="end" fontSize={10} fill="#777"
                fontFamily="'JetBrains Mono',monospace"
              >{v > 0 ? "+" : ""}{v}%</text>
            ))}
            <text
              x={14} y={margin.t + ch / 2}
              textAnchor="middle" fontSize={12} fill="#888"
              fontFamily="'Space Grotesk',sans-serif" fontWeight={600}
              transform={`rotate(-90, 14, ${margin.t + ch / 2})`}
            >Token Performance ({daysLabel})</text>

            {/* Zero line label */}
            {layout.yMin < 0 && layout.yMax > 0 && (
              <text
                x={W - margin.r + 4} y={layout.yScale(0) + 3}
                fontSize={9} fill="rgba(255,255,255,0.25)"
                fontFamily="'JetBrains Mono',monospace"
              >0%</text>
            )}

            {/* Regression trend line — all */}
            <line
              x1={margin.l} x2={W - margin.r}
              y1={layout.yScale(layout.regY1)} y2={layout.yScale(layout.regY2)}
              stroke="#f0a020" strokeWidth={1.5} strokeDasharray="6,4"
              opacity={0.6}
            />
            <text
              x={W - margin.r - 4}
              y={Math.max(margin.t + 12, Math.min(H - margin.b - 4, layout.yScale(layout.regY2) - 6))}
              textAnchor="end" fontSize={9} fill="#f0a020"
              fontFamily="'Inter',sans-serif" fontWeight={600}
              opacity={0.7}
            >all</text>

            {/* Regression trend line — buyback only */}
            {layout.bbRegY1 != null && (
              <>
                <line
                  x1={margin.l} x2={W - margin.r}
                  y1={layout.yScale(layout.bbRegY1)} y2={layout.yScale(layout.bbRegY2)}
                  stroke="#10b981" strokeWidth={1.5} strokeDasharray="6,4"
                  opacity={0.6}
                />
                <text
                  x={W - margin.r - 4}
                  y={Math.max(margin.t + 12, Math.min(H - margin.b - 4, layout.yScale(layout.bbRegY2) - 6))}
                  textAnchor="end" fontSize={9} fill="#10b981"
                  fontFamily="'Inter',sans-serif" fontWeight={600}
                  opacity={0.7}
                >buyback</text>
              </>
            )}

            {/* Bubbles */}
            {sorted.map((b, i) => {
              const cx = layout.xScale(b.revenue);
              const cy = layout.yScale(b.perf);
              const r = layout.rScale(b.revenue);
              const isHov = hovered === b.slug;
              const green = b.hasBuyback;

              return (
                <g key={b.slug}
                  onMouseEnter={() => setHovered(b.slug)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Glow on hover */}
                  {isHov && (
                    <circle cx={cx} cy={cy} r={r + 6}
                      fill="none"
                      stroke={green ? "#10b981" : "#888"}
                      strokeWidth={2} opacity={0.5}
                    />
                  )}
                  {/* Bubble */}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill={green ? "rgba(16,185,129,0.25)" : "rgba(120,120,120,0.2)"}
                    stroke={green ? "#10b981" : "#555"}
                    strokeWidth={isHov ? 2 : 1}
                    opacity={hovered && !isHov ? 0.3 : 1}
                    style={{ transition: "opacity .15s" }}
                  />
                  {/* Logo */}
                  {b.logo && (() => {
                    const s = Math.max(Math.min(r * 1.1, 28), 14);
                    return (
                      <image
                        href={b.logo}
                        x={cx - s / 2}
                        y={cy - s / 2}
                        width={s}
                        height={s}
                        clipPath={`circle(${s / 2}px)`}
                        style={{ pointerEvents: "none", borderRadius: "50%" }}
                      />
                    );
                  })()}
                  {/* Label for large or hovered */}
                  {(r >= 22 || isHov) && (
                    <text
                      x={cx} y={cy + r + 12}
                      textAnchor="middle" fontSize={9}
                      fill={isHov ? "#fff" : "#888"}
                      fontFamily="'Inter',sans-serif"
                      fontWeight={isHov ? 700 : 500}
                      style={{ pointerEvents: "none" }}
                    >
                      {b.name.length > 18 ? b.name.slice(0, 17) + "…" : b.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating tooltip */}
          {hovered && (() => {
            const b = bubbles.find(b => b.slug === hovered);
            if (!b || !svgRef.current) return null;
            const cx = layout.xScale(b.revenue);
            const cy = layout.yScale(b.perf);
            const r = layout.rScale(b.revenue);
            const svgRect = svgRef.current.getBoundingClientRect();

            return (
              <div style={{
                position: "absolute",
                left: svgRect.left + cx + r + 12,
                top: svgRect.top + cy - 40 + window.scrollY,
                background: "#111", border: "1px solid #333", borderRadius: 10,
                padding: "12px 16px", zIndex: 10000,
                boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                minWidth: 200, pointerEvents: "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  {b.logo && (
                    <img src={b.logo} alt="" style={{
                      width: 22, height: 22, borderRadius: "50%", objectFit: "cover",
                    }} onError={e => e.target.style.display = "none"} />
                  )}
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{b.name}</span>
                  {b.hasBuyback && (
                    <span style={{
                      background: "#10b98122", border: "1px solid #10b98155",
                      color: "#10b981", fontSize: 9, fontWeight: 700,
                      padding: "1px 6px", borderRadius: 3,
                    }}>BUYBACK</span>
                  )}
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "auto auto",
                  gap: "4px 16px", fontSize: 12,
                }}>
                  <span style={{ color: "#666" }}>Revenue 30d</span>
                  <span style={{ color: "#f0a020", fontWeight: 700, textAlign: "right" }}>
                    {fmt$(b.revenue)}
                  </span>
                  <span style={{ color: "#666" }}>Token Perf.</span>
                  <span style={{
                    color: b.perf >= 0 ? "#10b981" : "#ef4444",
                    fontWeight: 700, textAlign: "right",
                  }}>
                    {b.perf >= 0 ? "+" : ""}{b.perf.toFixed(1)}%
                  </span>
                  <span style={{ color: "#666" }}>Category</span>
                  <span style={{ color: "#aaa", textAlign: "right" }}>{b.category}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Summary */}
      {phase === "ready" && (
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#555" }}>
          {bubbles.length} protocols ·{" "}
          {bubbles.filter(b => b.hasBuyback).length} with buyback ·{" "}
          Data: DefiLlama (revenue) + CoinGecko (prices)
        </div>
      )}
    </div>
  );
}
