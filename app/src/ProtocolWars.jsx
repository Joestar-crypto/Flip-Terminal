import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Brand colors from DeFiLlama logo backgrounds ────────────────────────────
const PROTOCOL_BRAND_COLORS = {
  // ── DEX ──────────────────────────────────────────────────────────────────
  "uniswap":        "#FF007A",  // Uniswap — iconic hot pink
  "curve-finance":  "#3A7BFF",  // Curve — electric blue from logo
  "curve-dex":      "#3A7BFF",
  "balancer":       "#A855F7",  // Balancer — violet purple gradient accent
  "aerodrome":      "#FF2D55",  // Aerodrome — red like a runway light
  "pancakeswap":    "#1FC7D4",  // PancakeSwap — signature teal/cyan
  "fluid":          "#4C8FFF",  // Fluid — blue wordmark
  "fluid-dex":      "#4C8FFF",
  "native":         "#A78BFA",  // Native — purple gradient brand
  "sushiswap":      "#FA52A0",  // SushiSwap — pink-magenta from their logo
  "kyberswap":      "#31CB9E",  // KyberSwap — green crystal
  "dodo":           "#FFE800",  // DODO — bright yellow bird
  "orca":           "#7B5EA7",  // Orca — deep purple from their whale logo
  "raydium":        "#4E44CE",  // Raydium — deep indigo/purple
  "meteora":        "#E07D3C",  // Meteora — warm amber/orange
  "pump":           "#A3E635",  // Pump.fun — lime green
  "camelot":        "#F5C542",  // Camelot — gold/yellow medieval
  "lifinity":       "#00C2FF",  // Lifinity — cyan blue
  "openbook-dex":   "#F97316",  // OpenBook — orange
  // ── Lending ──────────────────────────────────────────────────────────────
  "aave":           "#B6509E",  // Aave — purple-pink ghost
  "compound":       "#00D395",  // Compound — green
  "compound-v2":    "#00D395",
  "compound-v3":    "#00D395",
  "morpho":         "#1A74FB",  // Morpho — royal blue
  "spark":          "#E95B2E",  // Spark — orange flame (SparkDAO)
  "kamino":         "#39D0D8",  // Kamino — cyan-teal
  "kamino-lend":    "#39D0D8",
  "jupiter-lend":   "#C7A43A",  // Jupiter — gold
  "moonwell":       "#A855F7",  // Moonwell — purple moon
  "radiant":        "#3B82F6",  // Radiant Capital — blue
  "venus":          "#F0B90B",  // Venus — Binance-gold yellow
  "alpaca-finance": "#F6D440",  // Alpaca — bright yellow alpaca
  "tranchess":      "#D4A843",  // Tranchess — antique gold
  "dolomite":       "#5B8DEF",  // Dolomite — sky blue
  "euler":          "#E84040",  // Euler — red
  "marginfi":       "#B45BFF",  // MarginFi — vivid purple
  "maple":          "#F97316",  // Maple — orange (maple leaf)
  "solend":         "#7C5CFC",  // Solend — soft purple
  "seamless-protocol": "#00E5BE", // Seamless — teal
  "drift":          "#FF6B4A",  // Drift — orange-red
  // ── Perps ─────────────────────────────────────────────────────────────────
  "hyperliquid":                "#00E3AB",  // Hyperliquid — bright seafoam green
  "hyperliquid-perps":          "#00E3AB",
  "gmx":                        "#1FCAC5",  // GMX — teal
  "gmx-v2-perps":               "#1FCAC5",
  "gains-network":              "#00AFFF",  // Gains Network — vivid sky blue
  "aster":                      "#FF6B35",  // Aster — orange
  "aster-perps":                "#FF6B35",
  "edgex":                      "#06B6D4",  // edgeX — cyan
  "edgex-perps":                "#06B6D4",
  "lighter":                    "#6366F1",  // Lighter — indigo
  "lighter-perps":              "#6366F1",
  "lighter-v2":                 "#6366F1",
  "jupiter-perpetual-exchange": "#C7A43A",  // Jupiter Perps — gold
  "aevo":                       "#9B59FF",  // Aevo — purple
  "dydx":                       "#6966FF",  // dYdX — periwinkle indigo
  "vertex-protocol":            "#18A999",  // Vertex — teal
  "mango":                      "#F0A429",  // Mango — mango orange
  "synthetix":                  "#00D1FF",  // Synthetix — cyan
  "kwenta":                     "#C9046C",  // Kwenta — deep pink-magenta
  // ── Oracles ──────────────────────────────────────────────────────────────
  "chainlink":      "#2A5ADA",  // Chainlink — deep blue hexagon
  "redstone":       "#E84142",  // RedStone — red
  "pyth-network":   "#9945FF",  // Pyth — Solana purple
  "pyth":           "#9945FF",
  "api3":           "#0E60CE",  // API3 — cobalt blue
  "band-protocol":  "#4A6EE0",  // Band Protocol — medium blue
  "tellor":         "#20D9C0",  // Tellor — teal-green
  "uma":            "#FF4A4A",  // UMA — red
  "dia":            "#3B5BDB",  // DIA — dark blue
  // ── Liquid Staking ───────────────────────────────────────────────────────
  "lido":           "#F6A823",  // Lido — amber/gold
  "rocket-pool":    "#FF6B4A",  // Rocket Pool — orange-red rocket
  "frax-ether":     "#888FAD",  // Frax — grey/silver wordmark
  "ether.fi":       "#7C3AED",  // EtherFi — purple
  "mantle-lsd":     "#25C2A0",  // Mantle — teal
  "jito-liquid-staking":     "#97D230",  // Jito — lime green
  "marinade-liquid-staking": "#E05A2B",  // Marinade — burnt orange
  "jupiter-staked-sol":      "#C89B3C",  // JupSOL — gold
  "sanctum-validator-lsts":  "#9333EA",  // Sanctum — purple
  "binance-staked-sol":      "#F0B90B",  // Binance — yellow
  "stader":         "#0A84FF",  // Stader — blue
  "ankr":           "#358DED",  // Ankr — blue
  // ── Stablecoins ──────────────────────────────────────────────────────────────
  "tether":              "#26A17B",  // USDT — signature green
  "usd-coin":            "#2775CA",  // USDC — blue
  "dai":                 "#F4B731",  // DAI — yellow
  "ethena-usd":          "#7B61FF",  // USDe — Ethena purple
  "first-digital-usd":   "#1B62ED",  // FDUSD — blue
  "frax":                "#888FAD",  // FRAX — grey
  "paypal-usd":          "#003087",  // PYUSD — PayPal blue
  // ── Chains ───────────────────────────────────────────────────────────────────
  "Ethereum":  "#627EEA",
  "Solana":    "#9945FF",
  "Base":      "#0052FF",
  "Arbitrum":  "#12AAFF",
  "BSC":       "#F3BA2F",
  "Tron":      "#FF060A",
  "Sui":       "#6FBCF0",
  "Aptos":     "#49C2FF",
};

const FALLBACK_COLORS = [
  "#f0a020","#06b6d4","#f59e0b","#10b981","#ef4444",
  "#3b82f6","#f97316","#14b8a6","#ec4899","#84cc16",
];

// ─── Stablecoin ID lookup ─────────────────────────────────────────────────────
const STABLECOIN_SLUG_TO_SYMBOL = {
  "tether":            "USDT",
  "usd-coin":          "USDC",
  "dai":               "DAI",
  "ethena-usd":        "USDe",
  "first-digital-usd": "FDUSD",
  "frax":              "FRAX",
  "paypal-usd":        "PYUSD",
};
let _stblListCache = null;
async function fetchStablecoinList() {
  if (_stblListCache) return _stblListCache;
  const r = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true");
  const d = await r.json();
  _stblListCache = d.peggedAssets || [];
  return _stblListCache;
}

function getColor(slug, index) {
  return PROTOCOL_BRAND_COLORS[slug] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

// ─── Data-type metadata ───────────────────────────────────────────────────────
const DT = {
  volume:       { arena: "Daily Volume Market Share",       valueLabel: "Daily Vol" },
  perpsVolume:  { arena: "Perps Volume Market Share",       valueLabel: "Volume" },
  tvl:          { arena: "TVL Market Share",                valueLabel: "TVL" },
  fees:         { arena: "Daily Fees Market Share",         valueLabel: "Daily Fees" },
  borrowed:     { arena: "Active Loans Market Share",       valueLabel: "Active Loans" },
  openInterest: { arena: "Open Interest Market Share",      valueLabel: "Open Interest" },
  stablecoin:   { arena: "Stablecoin Market Cap Share",     valueLabel: "Mkt Cap" },
  chainTvl:     { arena: "Chain TVL Market Share",          valueLabel: "TVL" },
  chainVolume:  { arena: "Chain DEX Volume Market Share",   valueLabel: "Daily Vol" },
  chainRevenue: { arena: "Chain Daily Revenue Share",       valueLabel: "Revenue" },
};

// ─── Segments & rivalries ─────────────────────────────────────────────────────
const SEGMENTS = {
  DEX: {
    label: "DEX",
    dataType: "volume",
    rivalries: [],
  },
  Lending: {
    label: "Lending",
    dataType: "tvl",
    rivalries: [],
  },
  Perps: {
    label: "Perps",
    dataType: "fees",
    rivalries: [],
    defaultSlugs: ["hyperliquid-perps", "aster-perps", "edgex-perps", "lighter-perps", "jupiter-perpetual-exchange"],
  },
  Oracles: {
    label: "Oracles",
    dataType: "fees",
    rivalries: [],
    defaultSlugs: ["chainlink", "redstone", "pyth", "api3", "band-protocol"],
  },
  "Liquid Staking": {
    label: "Liquid Staking",
    dataType: "tvl",
    rivalries: [],
    defaultSlugs: ["lido", "ether.fi", "rocket-pool", "jito-liquid-staking", "mantle-lsd"],
  },
  Stablecoins: {
    label: "Stablecoins",
    dataType: "stablecoin",
    rivalries: [],
    defaultSlugs: ["tether", "usd-coin", "dai", "ethena-usd", "first-digital-usd"],
  },
  Blockchains: {
    label: "Blockchains",
    dataType: "chainTvl",
    rivalries: [],
    defaultSlugs: ["Ethereum", "Solana", "Base", "Arbitrum", "BSC"],
  },
};

// ─── Chain logo URLs ─────────────────────────────────────────────────────────
const CHAIN_LOGOS = {
  Ethereum: "https://icons.llama.fi/ethereum.jpg",
  Base:     "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  Solana:   "https://icons.llama.fi/solana.jpg",
  Arbitrum: "https://icons.llama.fi/arbitrum.png",
  BSC:      "https://icons.llama.fi/bsc.jpg",
  MegaETH:  "https://icons.llamao.fi/icons/chains/rsz_megaeth.jpg",
};

// ─── Top 5 Lending protocols per chain — by TVL ─────────────────────────────
const LENDING_CHAINS = {
  Ethereum: {
    color: "#627EEA",
    slugs: ["aave", "spark", "morpho", "maple", "compound-v3"],
  },
  Solana: {
    color: "#9945FF",
    slugs: ["kamino-lend", "marginfi", "maple", "solend", "jupiter-lend"],
  },
  Base: {
    color: "#0052FF",
    slugs: ["moonwell", "aave", "compound-v3", "morpho", "fluid"],
  },
  Arbitrum: {
    color: "#12AAFF",
    slugs: ["aave", "radiant", "compound-v3", "fluid", "spark"],
  },
  BSC: {
    color: "#F3BA2F",
    slugs: ["venus", "aave", "alpaca-finance", "tranchess", "compound-v3"],
  },
  MegaETH: {
    color: "#C026D3",
    slugs: ["aave-v3", "avon-megavault", "canonic", "quantus-lend"],
  },
};

// ─── Top 5 DEXs per chain — aggregated parent protocols (by 30d volume) ──────
const DEX_CHAINS = {
  Ethereum: {
    color: "#627EEA",
    slugs: ["uniswap", "fluid", "balancer", "curve-finance", "native"],
  },
  Base: {
    color: "#0052FF",
    slugs: ["aerodrome", "uniswap", "pancakeswap", "fluid", "curve-finance"],
  },
  Solana: {
    color: "#9945FF",
    slugs: ["pump", "orca", "raydium", "meteora", "jupiter"],
  },
  Arbitrum: {
    color: "#12AAFF",
    slugs: ["uniswap", "pancakeswap", "fluid", "camelot", "native"],
  },
  BSC: {
    color: "#F3BA2F",
    slugs: ["pancakeswap", "uniswap", "native", "curve-finance", "balancer"],
  },
  MegaETH: {
    color: "#C026D3",
    slugs: ["kumbaya", "prism-dex", "sectorone-dlmm", "currentx-v3", "warpx-v3"],
  },
};

const TIME_RANGES = [
  { label: "7D",  days: 7   },
  { label: "30D", days: 30  },
  { label: "90D", days: 90  },
  { label: "6M",  days: 182 },
  { label: "1Y",  days: 365 },
];

// ─── Solana DEX sub-modes ─────────────────────────────────────────────────────
const SOLANA_DEX_MODES = {
  all: {
    label: "All",
    slugs: ["pump", "orca", "raydium", "meteora", "jupiter"],
  },
  memecoins: {
    label: "Memecoins",
    slugs: ["pump", "meteora", "raydium", "orca", "jupiter"],
  },
  blue_chips: {
    label: "Blue-chip",
    slugs: ["orca", "raydium", "jupiter", "lifinity", "invariant"],
  },
};

// ─── Autocomplete catalogs — chain-specific for DEX & Lending ────────────────
const CHAIN_DEX_PROTOCOLS = {
  Ethereum: [
    { slug: "uniswap",       name: "Uniswap" },
    { slug: "fluid",         name: "Fluid" },
    { slug: "balancer",      name: "Balancer" },
    { slug: "curve-finance", name: "Curve Finance" },
    { slug: "native",        name: "Native" },
    { slug: "sushiswap",     name: "SushiSwap" },
    { slug: "pancakeswap",   name: "PancakeSwap" },
    { slug: "kyberswap",     name: "KyberSwap" },
    { slug: "dodo",          name: "DODO" },
  ],
  Base: [
    { slug: "aerodrome",     name: "Aerodrome" },
    { slug: "uniswap",       name: "Uniswap" },
    { slug: "pancakeswap",   name: "PancakeSwap" },
    { slug: "fluid",         name: "Fluid" },
    { slug: "curve-finance", name: "Curve Finance" },
    { slug: "sushiswap",     name: "SushiSwap" },
    { slug: "kyberswap",     name: "KyberSwap" },
    { slug: "balancer",      name: "Balancer" },
  ],
  Solana: [
    { slug: "pump",          name: "Pump.fun" },
    { slug: "orca",          name: "Orca" },
    { slug: "raydium",       name: "Raydium" },
    { slug: "meteora",       name: "Meteora" },
    { slug: "fluid-dex",     name: "Fluid DEX" },
    { slug: "lifinity",      name: "Lifinity" },
    { slug: "openbook-dex",  name: "OpenBook" },
  ],
  Arbitrum: [
    { slug: "uniswap",       name: "Uniswap" },
    { slug: "pancakeswap",   name: "PancakeSwap" },
    { slug: "fluid",         name: "Fluid" },
    { slug: "camelot",       name: "Camelot" },
    { slug: "native",        name: "Native" },
    { slug: "curve-finance", name: "Curve Finance" },
    { slug: "balancer",      name: "Balancer" },
    { slug: "sushiswap",     name: "SushiSwap" },
    { slug: "kyberswap",     name: "KyberSwap" },
  ],
  BSC: [
    { slug: "pancakeswap",   name: "PancakeSwap" },
    { slug: "uniswap",       name: "Uniswap" },
    { slug: "native",        name: "Native" },
    { slug: "curve-finance", name: "Curve Finance" },
    { slug: "balancer",      name: "Balancer" },
    { slug: "sushiswap",     name: "SushiSwap" },
    { slug: "kyberswap",     name: "KyberSwap" },
    { slug: "dodo",          name: "DODO" },
  ],
  MegaETH: [
    { slug: "kumbaya",       name: "Kumbaya" },
    { slug: "prism-dex",     name: "Prism DEX" },
    { slug: "sectorone-dlmm", name: "SectorOne DLMM" },
    { slug: "currentx-v3",  name: "CurrentX V3" },
    { slug: "warpx-v3",     name: "WarpX V3" },
    { slug: "skate-amm",    name: "Skate AMM" },
    { slug: "megaswap",     name: "Megaswap" },
  ],
};

const CHAIN_LENDING_PROTOCOLS = {
  Ethereum: [
    { slug: "aave",           name: "Aave" },
    { slug: "compound-v3",    name: "Compound V3" },
    { slug: "morpho",         name: "Morpho" },
    { slug: "spark",          name: "Spark" },
    { slug: "maple",          name: "Maple" },
    { slug: "fluid",          name: "Fluid" },
    { slug: "compound-v2",    name: "Compound V2" },
    { slug: "euler",          name: "Euler" },
    { slug: "radiant",        name: "Radiant" },
    { slug: "dolomite",       name: "Dolomite" },
  ],
  Solana: [
    { slug: "kamino-lend",    name: "Kamino Lend" },
    { slug: "marginfi",       name: "MarginFi" },
    { slug: "maple",          name: "Maple" },
    { slug: "solend",         name: "Solend" },
    { slug: "drift",          name: "Drift" },
    { slug: "save",           name: "Save" },
  ],
  Base: [
    { slug: "moonwell",       name: "Moonwell" },
    { slug: "aave",           name: "Aave" },
    { slug: "compound-v3",    name: "Compound V3" },
    { slug: "morpho",         name: "Morpho" },
    { slug: "fluid",          name: "Fluid" },
    { slug: "euler",          name: "Euler" },
    { slug: "seamless-protocol", name: "Seamless" },
  ],
  Arbitrum: [
    { slug: "aave",           name: "Aave" },
    { slug: "radiant",        name: "Radiant" },
    { slug: "compound-v3",    name: "Compound V3" },
    { slug: "fluid",          name: "Fluid" },
    { slug: "spark",          name: "Spark" },
    { slug: "dolomite",       name: "Dolomite" },
    { slug: "morpho",         name: "Morpho" },
  ],
  BSC: [
    { slug: "venus",          name: "Venus" },
    { slug: "aave",           name: "Aave" },
    { slug: "alpaca-finance", name: "Alpaca Finance" },
    { slug: "tranchess",      name: "Tranchess" },
    { slug: "compound-v3",    name: "Compound V3" },
    { slug: "moonwell",       name: "Moonwell" },
  ],
  MegaETH: [
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "avon-megavault",  name: "Avon MegaVault" },
    { slug: "canonic",         name: "Canonic" },
    { slug: "quantus-lend",    name: "Quantus Lend" },
  ],
};

const SEGMENT_PROTOCOLS = {
  Perps: [
    { slug: "hyperliquid-perps",          name: "Hyperliquid" },
    { slug: "aster-perps",                name: "Aster" },
    { slug: "edgex-perps",                name: "edgeX" },
    { slug: "lighter-perps",              name: "Lighter" },
    { slug: "jupiter-perpetual-exchange", name: "Jupiter Perps" },
    { slug: "gmx-v2-perps",               name: "GMX V2" },
    { slug: "drift-trade",                name: "Drift" },
    { slug: "dydx",                       name: "dYdX" },
    { slug: "gains-network",              name: "Gains Network" },
    { slug: "vertex-protocol",            name: "Vertex" },
  ],
  Oracles: [
    { slug: "chainlink",      name: "Chainlink" },
    { slug: "redstone",       name: "RedStone" },
    { slug: "pyth-network",   name: "Pyth Network" },
    { slug: "api3",           name: "API3" },
    { slug: "band-protocol",  name: "Band Protocol" },
    { slug: "tellor",         name: "Tellor" },
    { slug: "uma",            name: "UMA" },
    { slug: "dia",            name: "DIA" },
  ],
  "Liquid Staking": [
    { slug: "lido",                     name: "Lido" },
    { slug: "ether.fi",                 name: "EtherFi" },
    { slug: "rocket-pool",              name: "Rocket Pool" },
    { slug: "frax-ether",               name: "Frax Ether" },
    { slug: "mantle-lsd",               name: "Mantle LSD" },
    { slug: "jito-liquid-staking",      name: "Jito" },
    { slug: "marinade-liquid-staking",  name: "Marinade" },
    { slug: "jupiter-staked-sol",       name: "JupSOL" },
    { slug: "sanctum-validator-lsts",   name: "Sanctum" },
    { slug: "binance-staked-sol",       name: "Binance Staked SOL" },
    { slug: "stader",                   name: "Stader" },
    { slug: "ankr",                     name: "Ankr" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatUSD(n) {
  if (n == null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}
function formatDate(ts) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function slugToDisplay(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
function getTodayTs() { return Math.floor(Date.now() / 1000); }
// Start of today in UTC (seconds) — used as upper bound to exclude incomplete today's data
function getStartOfTodayUTC() { return Math.floor(Date.now() / 86400000) * 86400; }

// ─── Per-protocol data fetcher ────────────────────────────────────────────────
// Returns { series, name, logo }
async function fetchSlugData(slug, dataType, cutoff, chain) {
  const ceiling = getStartOfTodayUTC(); // exclude today's incomplete data point
  if (dataType === "volume") {
    const res = await fetch(`https://api.llama.fi/summary/dexs/${slug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    let series;
    if (chain && d.totalDataChartBreakdown?.length) {
      series = d.totalDataChartBreakdown
        .map(([ts, breakdown]) => {
          const chainData = breakdown[chain];
          const val = chainData ? Object.values(chainData).reduce((a, b) => a + Number(b), 0) : 0;
          return { date: Number(ts), value: val };
        })
        .filter(x => x.date >= cutoff && x.date < ceiling);
      if (!series.some(x => x.value > 0)) throw new Error(`No ${chain} data`);
    } else {
      series = (d.totalDataChart || [])
        .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
        .filter(x => x.date >= cutoff && x.date < ceiling);
    }
    if (!series.length) throw new Error("No data");
    return { series, name: d.name, logo: d.logo };
  }
  if (dataType === "perpsVolume") {
    // Map -perps slugs / special cases to their dexs adapter slug
    const PERPS_VOL_SLUG = {
      "jupiter-perpetual-exchange": "jupiter",
      "edgex-perps": null,  // no dexs adapter — volume paywalled
    };
    const hasMapping = Object.prototype.hasOwnProperty.call(PERPS_VOL_SLUG, slug);
    const volSlug = hasMapping ? PERPS_VOL_SLUG[slug] : (slug.endsWith("-perps") ? slug.slice(0, -6) : slug);
    if (!volSlug) throw new Error("Volume not available");
    const res = await fetch(`https://api.llama.fi/summary/dexs/${volSlug}`);
    if (!res.ok) throw new Error("No volume data");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: d.name, logo: d.logo };
  }
  if (dataType === "openInterest") {
    // For -perps slugs, strip suffix to get the parent protocol (whose TVL = collateral/OI)
    const oiSlug = slug.endsWith("-perps") ? slug.slice(0, -6) : slug;
    const res = await fetch(`https://api.llama.fi/protocol/${oiSlug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const raw = (d.tvl || []);
    const series = raw
      .filter(x => x.date >= cutoff && x.date < ceiling)
      .map(x => ({ date: x.date, value: x.totalLiquidityUSD ?? x.value ?? 0 }));
    if (!series.length) throw new Error("No data in range");
    return { series, name: d.name, logo: d.logo };
  }
  if (dataType === "fees") {
    const res = await fetch(`https://api.llama.fi/summary/fees/${slug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: d.name, logo: d.logo };
  }
  // borrowed (active loans) — DeFiLlama chainTvls["${chain}-borrowed"].tvl
  if (dataType === "borrowed") {
    const res = await fetch(`https://api.llama.fi/protocol/${slug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    let raw = [];
    if (chain && d.chainTvls?.[`${chain}-borrowed`]?.tvl?.length)
      raw = d.chainTvls[`${chain}-borrowed`].tvl;
    else if (d.chainTvls?.["borrowed"]?.tvl?.length)
      raw = d.chainTvls["borrowed"].tvl;
    if (!raw.length) throw new Error(`No active loan data`);
    const series = raw
      .filter(x => x.date >= cutoff && x.date < ceiling)
      .map(x => ({ date: x.date, value: x.totalLiquidityUSD ?? x.value ?? 0 }));
    if (!series.length) throw new Error("No borrow data in range");
    return { series, name: d.name, logo: d.logo };
  }
  if (dataType === "stablecoin") {
    const list = await fetchStablecoinList();
    const targetSym = STABLECOIN_SLUG_TO_SYMBOL[slug];
    const coin = list.find(c => targetSym ? c.symbol === targetSym : c.name.toLowerCase().replace(/\s+/g, "-") === slug);
    if (!coin) throw new Error("Stablecoin not found");
    const res = await fetch(`https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=${coin.id}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = d
      .map(x => ({ date: Number(x.date), value: x.totalCirculating?.peggedUSD ?? 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: coin.name, logo: coin.logo };
  }
  if (dataType === "chainTvl") {
    const res = await fetch(`https://api.llama.fi/v2/historicalChainTvl/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = d
      .map(x => ({ date: Number(x.date), value: x.tvl ?? 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: slug, logo: CHAIN_LOGOS[slug] ?? null };
  }
  if (dataType === "chainVolume") {
    const res = await fetch(`https://api.llama.fi/overview/dexs/${encodeURIComponent(slug)}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: slug, logo: CHAIN_LOGOS[slug] ?? null };
  }
  if (dataType === "chainRevenue") {
    const res = await fetch(`https://api.llama.fi/overview/fees/${encodeURIComponent(slug)}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: slug, logo: CHAIN_LOGOS[slug] ?? null };
  }
  // tvl
  const res = await fetch(`https://api.llama.fi/protocol/${slug}`);
  if (!res.ok) throw new Error("Not found");
  const d = await res.json();
  const raw = (chain && d.chainTvls?.[chain]?.tvl) ? d.chainTvls[chain].tvl : (d.tvl || []);
  const series = raw
    .filter(x => x.date >= cutoff && x.date < ceiling)
    .map(x => ({ date: x.date, value: x.totalLiquidityUSD ?? x.value ?? 0 }));
  if (!series.length) throw new Error("No data in range");
  return { series, name: d.name, logo: d.logo };
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, protocols, rawDataBySlug, dataType }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#100f0c", border: "1px solid #221e16",
      borderRadius: 6, padding: "12px 16px", minWidth: 200,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <div style={{ color: "#5a4a30", fontSize: 11, marginBottom: 8 }}>{label}</div>
      {payload.map((entry) => {
        const slug = entry.dataKey;
        const pct = entry.value;
        const rawEntry = rawDataBySlug?.[slug]?.find?.(d => formatDate(d.date) === label);
        const abs = rawEntry?.value;
        return (
          <div key={slug} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
            <span style={{ color: "#a08060", fontSize: 12, flex: 1 }}>
              {protocols.find(p => p.slug === slug)?.name || slugToDisplay(slug)}
            </span>
            <span style={{ color: entry.color, fontWeight: 700, fontSize: 14 }}>
              {pct != null ? `${pct.toFixed(1)}%` : "—"}
            </span>
            {abs != null && (
              <span style={{ color: "#666", fontSize: 11 }}>{formatUSD(abs)}</span>
            )}
          </div>
        );
      })}
      <div style={{ color: "#5a4a30", fontSize: 10, marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {DT[dataType]?.valueLabel} share
      </div>
    </div>
  );
}

// ─── Fighter Card ─────────────────────────────────────────────────────────────
function FighterCard({ protocol, color, isLeading, chartData, dataType }) {
  const currentShare = chartData?.length ? chartData[chartData.length - 1]?.[protocol.slug] : null;
  const share30dAgo = (() => {
    if (!chartData?.length) return null;
    return chartData[Math.max(0, chartData.length - 31)]?.[protocol.slug] ?? null;
  })();
  const delta = currentShare != null && share30dAgo != null ? currentShare - share30dAgo : null;

  const dominantDays = chartData?.reduce((acc, d) => {
    const vals = Object.entries(d).filter(([k]) => k !== "label" && k !== "ts");
    if (!vals.length) return acc;
    const max = vals.reduce((a, b) => (b[1] > a[1] ? b : a));
    return max[0] === protocol.slug ? acc + 1 : acc;
  }, 0) ?? 0;

  const today = getTodayTs();
  const lastDataDate = protocol.rawData?.[protocol.rawData.length - 1]?.date;
  const isLive = lastDataDate && (today - lastDataDate) < 86400 * 1.5;

  return (
    <div style={{
      background: isLeading ? `linear-gradient(135deg, #141210 0%, ${color}18 100%)` : "#141210",
      border: `1px solid ${isLeading ? color + "bb" : "#221e16"}`, 
      borderRadius: 7, padding: "7px 10px",
      flex: "1 1 100px", minWidth: 90,
      position: "relative", transition: "all 0.3s ease",
      boxShadow: isLeading ? `0 2px 16px ${color}22` : "none",
    }}>
      {isLeading && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: color, color: "#000", fontSize: 10,
          fontWeight: 800, padding: "2px 8px", borderRadius: 99, letterSpacing: 1,
        }}>LEADING</div>
      )}
      {isLive && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
          <span style={{ color: "#ef4444", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <img
            src={dataType === "stablecoin" ? `https://icons.llama.fi/${protocol.slug}.png` : (protocol.logo || `https://icons.llama.fi/${protocol.slug}.png`)}
            alt={protocol.name}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", background: "#fff" }}
          />
        <div style={{
            width: 22, height: 22, borderRadius: "50%",
          background: color + "33", border: `1px solid ${color}66`,
          display: "none", alignItems: "center", justifyContent: "center",
          color, fontWeight: 800, fontSize: 10,
        }}>
          {protocol.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>
            {protocol.name || slugToDisplay(protocol.slug)}
          </div>
        </div>
      </div>

      <div style={{ color, fontSize: 22, fontWeight: 900, lineHeight: 1, marginBottom: 2 }}>
        {currentShare != null ? `${currentShare.toFixed(1)}%` : "—"}
      </div>
      <div style={{ color: "#5a4a30", fontSize: 10, marginBottom: 5 }}>market share</div>

      {delta != null && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          background: delta >= 0 ? "#10b98122" : "#ef444422",
          border: `1px solid ${delta >= 0 ? "#10b98155" : "#ef444455"}`,
          borderRadius: 5, padding: "2px 6px", marginBottom: 6,
          fontSize: 10, fontWeight: 600,
          color: delta >= 0 ? "#10b981" : "#ef4444",
        }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}pp
        </div>
      )}

      <div style={{ color: "#5a4a30", fontSize: 10, marginTop: 2 }}>
        Led <span style={{ color: "#a08060", fontWeight: 700 }}>{dominantDays}d</span>
      </div>
      {protocol.currentValue != null && (
        <div style={{ color: "#5a4a30", fontSize: 10, marginTop: 1 }}>
          <span style={{ color: "#a08060", fontWeight: 600 }}>{formatUSD(protocol.currentValue)}</span>
        </div>
      )}
    </div>
  );
}

// ─── Battle Stats ─────────────────────────────────────────────────────────────
function BattleStats({ chartData, protocols, colors }) {
  if (!chartData?.length || !protocols?.length) return null;

  const latest = chartData[chartData.length - 1];
  const leader = protocols.reduce((best, p) => {
    const v = latest?.[p.slug] ?? 0;
    return v > (best.v ?? 0) ? { slug: p.slug, name: p.name, v } : best;
  }, {});

  let biggestSwing = null;
  for (let i = 1; i < chartData.length; i++) {
    for (const p of protocols) {
      const prev = chartData[i - 1]?.[p.slug];
      const curr = chartData[i]?.[p.slug];
      if (prev != null && curr != null) {
        const diff = curr - prev;
        if (!biggestSwing || Math.abs(diff) > Math.abs(biggestSwing.diff))
          biggestSwing = { name: p.name, slug: p.slug, diff, label: chartData[i].label };
      }
    }
  }

  const domCounts = {};
  protocols.forEach(p => { domCounts[p.slug] = 0; });
  chartData.forEach(d => {
    const vals = protocols.map(p => ({ slug: p.slug, v: d[p.slug] ?? 0 }));
    const top = vals.reduce((a, b) => b.v > a.v ? b : a, vals[0]);
    if (top) domCounts[top.slug] = (domCounts[top.slug] || 0) + 1;
  });
  const mostConsistent = protocols.reduce((best, p) =>
    domCounts[p.slug] > (domCounts[best?.slug] ?? -1) ? p : best, null);

  const momentum = protocols.map(p => {
    const recent = chartData.slice(-7);
    if (recent.length < 2) return { ...p, trend: 0 };
    return { ...p, trend: (recent[recent.length - 1]?.[p.slug] ?? 0) - (recent[0]?.[p.slug] ?? 0) };
  });

  const idxOf = slug => protocols.findIndex(p => p.slug === slug);

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 12,
      background: "#100f0c", border: "1px solid #1c1810",
      borderRadius: 12, padding: "16px 20px", marginTop: 16,
    }}>
      <StatPill icon="🏆" label="Leading Now"
        value={leader.name || slugToDisplay(leader.slug)}
        sub={`${leader.v?.toFixed(1)}% share`}
        color={colors[idxOf(leader.slug)] || "#f0a020"} />
      {biggestSwing && (
        <StatPill icon="⚡" label="Biggest Swing"
          value={`${biggestSwing.name || slugToDisplay(biggestSwing.slug)} on ${biggestSwing.label}`}
          sub={`${biggestSwing.diff > 0 ? "+" : ""}${biggestSwing.diff.toFixed(1)}pp`}
          color={colors[idxOf(biggestSwing.slug)] || "#f59e0b"} />
      )}
      {mostConsistent && (
        <StatPill icon="📊" label="Most Consistent"
          value={mostConsistent.name || slugToDisplay(mostConsistent.slug)}
          sub={`Led ${domCounts[mostConsistent.slug]}d`}
          color={colors[idxOf(mostConsistent.slug)] || "#06b6d4"} />
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {momentum.map((p, i) => {
          const color = colors[i] || "#888";
          return (
            <div key={p.slug} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#141210", border: `1px solid ${color}33`,
              borderRadius: 5, padding: "5px 11px",
            }}>
              <span style={{ color, fontSize: 12, fontWeight: 700 }}>
                {p.name || slugToDisplay(p.slug)}
              </span>
              <span style={{ fontSize: 16, color: p.trend > 0.5 ? "#10b981" : p.trend < -0.5 ? "#ef4444" : "#5a4a30" }}>
                {p.trend > 0.5 ? "↑" : p.trend < -0.5 ? "↓" : "→"}
              </span>
              <span style={{ fontSize: 11, color: p.trend > 0.5 ? "#10b981" : p.trend < -0.5 ? "#ef4444" : "#5a4a30" }}>
                {p.trend > 0 ? "+" : ""}{p.trend.toFixed(1)}pp 7D
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "#141210", border: `1px solid ${color}33`, borderRadius: 7, padding: "10px 14px", minWidth: 160 }}>
      <div style={{ color: "#5a4a30", fontSize: 11, marginBottom: 2 }}>{icon} {label}</div>
      <div style={{ color, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{value}</div>
      <div style={{ color: "#5a4a30", fontSize: 11 }}>{sub}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = 20, radius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg,#141210 25%,#221e16 50%,#141210 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", ...style,
    }} />
  );
}

// ─── AI Trend Analysis ─────────────────────────────────────────────────────────
// ─── Linear regression helper ────────────────────────────────────────────────
function linReg(vals) {
  const n = vals.length;
  if (n < 2) return { slope: 0 };
  const meanX = (n - 1) / 2;
  const meanY = vals.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  vals.forEach((y, i) => { num += (i - meanX) * (y - meanY); den += (i - meanX) ** 2; });
  return { slope: den === 0 ? 0 : num / den };
}

function generateAnalysis(chartData, protocols) {
  if (!chartData?.length || !protocols?.length || protocols.length < 2) return null;

  const stats = protocols.map(p => {
    const vals = chartData.map(d => d[p.slug]).filter(v => v != null);
    if (vals.length < 3) return { slug: p.slug, name: p.name, current: 0, insufficient: true };

    const current = vals[vals.length - 1];
    const peak    = Math.max(...vals);
    const { slope } = linReg(vals);

    const t = Math.max(3, Math.floor(vals.length / 3));
    const avgStart = vals.slice(0, t).reduce((a, b) => a + b, 0) / t;
    const avgEnd   = vals.slice(-t).reduce((a, b) => a + b, 0) / t;
    const mediumDelta = avgEnd - avgStart;

    const w = Math.min(14, Math.floor(vals.length / 2));
    const lastW = vals.slice(-w);
    const prevW = vals.slice(-w * 2, -w);
    const recentDelta = prevW.length
      ? lastW.reduce((a, b) => a + b, 0) / lastW.length - prevW.reduce((a, b) => a + b, 0) / prevW.length
      : 0;

    let peakIdx = 0;
    vals.forEach((v, i) => { if (v >= vals[peakIdx]) peakIdx = i; });
    const daysSincePeak = vals.length - 1 - peakIdx;

    return { slug: p.slug, name: p.name, current, peak, slope, mediumDelta, recentDelta, daysSincePeak, insufficient: false };
  }).filter(Boolean);

  if (stats.length < 2) return null;

  const leader = [...stats].filter(s => !s.insufficient).sort((a, b) => b.current - a.current)[0];

  const gaining = [];
  const losing  = [];
  const neutral = [];

  stats.forEach(p => {
    if (p.insufficient) {
      neutral.push({ ...p, label: "⏳ Not enough data", body: `${p.name} doesn't have enough data points in this time range for a reliable trend analysis. Try a shorter timeframe.` });
      return;
    }

    const isLeader = p.slug === leader?.slug;
    const structUp   = p.slope > 0.015 && p.mediumDelta > 0.8;
    const structDown = p.slope < -0.015 && p.mediumDelta < -0.8;
    const recentlyDipping    = p.recentDelta < -0.5;
    const recentlyRecovering = p.recentDelta > 0.5;

    if (structUp) {
      let label, body;
      if (isLeader && recentlyDipping) {
        label = "👑 Dominant — short-term pressure";
        body  = `${p.name} has been the structural winner across this entire period, consistently building its lead. It holds ${p.current.toFixed(1)}% today. Recent days show a slight dip, but this doesn't change the overall direction — the long-term trend remains firmly in its favour.`;
      } else if (isLeader) {
        label = "👑 Dominant & reinforcing";
        body  = `${p.name} is the clear structural winner of this period. At ${p.current.toFixed(1)}%, it has been steadily pulling away from competitors throughout the entire timeframe, with no sign of structural reversal.`;
      } else if (p.current < 15) {
        label = "💎 Quietly gaining ground";
        body  = `${p.name} sits at a modest ${p.current.toFixed(1)}% share but has been on a consistent uptrend for the whole period. It may look small, but the direction is clear — this is a project accumulating dominance under the radar.`;
      } else {
        label = recentlyDipping ? "📈 Gaining — temporary pullback" : "📈 Structurally gaining";
        body  = recentlyDipping
          ? `${p.name} has been gaining market share consistently throughout this period and holds ${p.current.toFixed(1)}%. The recent dip is a short-term move against an otherwise positive structural trend.`
          : `${p.name} has been on a steady upward trajectory for the full period and currently sits at ${p.current.toFixed(1)}%. The trend is consistent and shows no signs of reversal.`;
      }
      gaining.push({ name: p.name, slug: p.slug, current: p.current, slope: p.slope, recentDelta: p.recentDelta, label, body });

    } else if (structDown) {
      let label, body;
      const pastPeak = p.daysSincePeak > 14 && p.peak - p.current > 2;
      if (isLeader) {
        label = "📉 Still leading — losing grip";
        body  = `${p.name} is the current leader at ${p.current.toFixed(1)}%, but don't be fooled by the rank — it has been ceding market share throughout this entire period. ${recentlyRecovering ? "A recent bounce doesn't change the structural picture." : "The erosion is ongoing with no reversal signal yet."} Something is chipping away at its dominance.`;
      } else if (pastPeak) {
        label = "🔻 Past its peak";
        body  = `${p.name} peaked at ${p.peak.toFixed(1)}% and has been trending down consistently since, now sitting at ${p.current.toFixed(1)}%. ${recentlyRecovering ? "There's a short-term bounce underway, but the structural decline hasn't reversed." : "The downtrend is intact across the whole period."} This is a project losing relevance in relative terms.`;
      } else {
        label = "⚠️ Losing share consistently";
        body  = `${p.name} has been in a steady decline throughout this period, now at ${p.current.toFixed(1)}%. ${recentlyRecovering ? "A recent short-term bounce is visible, but it hasn't changed the overall direction." : "The trend is consistent and uninterrupted."} Competitors are absorbing its share.`;
      }
      losing.push({ name: p.name, slug: p.slug, current: p.current, slope: p.slope, recentDelta: p.recentDelta, label, body });

    } else {
      let label, body;
      if (isLeader) {
        label = "🏰 Stable dominant position";
        body  = `${p.name} holds ${p.current.toFixed(1)}% with no meaningful gain or loss across the period. This is consolidated dominance — it's not that nobody is trying, it's that ${p.name} is proving resilient to competitive pressure.`;
      } else if (p.current < 5) {
        label = "📊 Marginal presence";
        body  = `${p.name} holds a small ${p.current.toFixed(1)}% share without a clear directional trend in this window. It's neither gaining nor losing ground in a structurally significant way — more of a background player at this stage.`;
      } else {
        label = recentlyRecovering ? "↗️ Stabilising — possible recovery" : recentlyDipping ? "↘️ Consolidating — watch closely" : "➡️ Holding steady";
        body  = recentlyRecovering
          ? `${p.name} has no strong structural trend but is showing early signs of a potential recovery, with recent weeks turning positive. Worth watching — at ${p.current.toFixed(1)}%, any sustained move upward could signal a shift.`
          : recentlyDipping
          ? `${p.name} holds ${p.current.toFixed(1)}% with a broadly flat long-term trend, but recent weeks have been softer. Not yet a structural decline, but something to monitor.`
          : `${p.name} has been broadly range-bound throughout this period, holding around ${p.current.toFixed(1)}%. No dominant trend in either direction — maintaining its slice of the market without meaningfully gaining or losing ground.`;
      }
      neutral.push({ name: p.name, slug: p.slug, current: p.current, slope: p.slope, recentDelta: p.recentDelta, label, body });
    }
  });

  gaining.sort((a, b) => b.slope - a.slope);
  losing.sort((a, b)  => a.slope - b.slope);

  const validStats = stats.filter(s => !s.insufficient);
  const hhi = validStats.reduce((s, p) => s + (p.current / 100) ** 2, 0);
  let marketNote = null;
  if (leader && leader.current > 60) {
    const grip = leader.slope > 0.015 ? "and actively reinforcing it" : leader.slope < -0.015 ? "though it is slowly losing that grip" : "with a stable hold";
    marketNote = { icon: "🏰", text: `${leader.name} controls the majority of this market (${leader.current.toFixed(1)}%), ${grip}. For any challenger to matter, it needs a structural catalyst — incremental gains won't be enough.` };
  } else if (hhi < 0.2 && validStats.length >= 3) {
    marketNote = { icon: "🌊", text: "No single protocol dominates here — the market is genuinely contested. In this kind of fragmented structure, whoever maintains the most consistent upward trend will gradually pull ahead." };
  }

  return { gaining, neutral, losing, marketNote };
}

// ─── Context data helpers ─────────────────────────────────────────────────────
const CTX_CACHE_KEY = "pw_ctx_v3";
const CTX_TTL = 24 * 60 * 60 * 1000;

function ctxCache(key) {
  try {
    const store = JSON.parse(localStorage.getItem(CTX_CACHE_KEY) || "{}");
    const entry = store[key];
    if (entry && Date.now() - entry.ts < CTX_TTL) return entry.data;
  } catch {}
  return null;
}
function ctxSet(key, data) {
  try {
    const store = JSON.parse(localStorage.getItem(CTX_CACHE_KEY) || "{}");
    store[key] = { ts: Date.now(), data };
    localStorage.setItem(CTX_CACHE_KEY, JSON.stringify(store));
  } catch {}
}

// Fetch protocol metadata from DeFiLlama (hallmarks, raises, chains, etc.)
async function fetchProtocolContext(slugs) {
  const out = {};
  const toFetch = slugs.filter(s => {
    const c = ctxCache(`proto:${s}`);
    if (c) { out[s] = c; return false; }
    return true;
  });
  if (toFetch.length) {
    const results = await Promise.allSettled(
      toFetch.map(async slug => {
        const res = await fetch(`https://api.llama.fi/protocol/${slug}`);
        if (!res.ok) return { slug, hallmarks: [], raises: [], gecko_id: null, chains: [], forkedFrom: null };
        const d = await res.json();
        return {
          slug,
          hallmarks: Array.isArray(d.hallmarks) ? d.hallmarks : [],
          raises: Array.isArray(d.raises) ? d.raises : [],
          gecko_id: d.gecko_id || null,
          chains: d.chains || [],
          forkedFrom: d.forkedFrom || null,
          symbol: d.symbol || null,
        };
      })
    );
    results.forEach(r => {
      if (r.status === "fulfilled") {
        out[r.value.slug] = r.value;
        ctxSet(`proto:${r.value.slug}`, r.value);
      }
    });
  }
  slugs.forEach(s => { if (!out[s]) out[s] = { slug: s, hallmarks: [], raises: [], gecko_id: null, chains: [], forkedFrom: null }; });
  return out;
}

// Detect incentive campaign events from DeFiLlama yield chart history
async function fetchYieldEvents(slugs) {
  const out = {};
  // First get pool list to find relevant pools per protocol
  const cached = ctxCache("yield_pools_list");
  let allPools;
  if (cached) { allPools = cached; } else {
    try {
      const r = await fetch("https://yields.llama.fi/pools");
      if (!r.ok) return out;
      allPools = (await r.json()).data || [];
      ctxSet("yield_pools_list", allPools.filter(p => p.tvlUsd > 1e6).map(p => ({ pool: p.pool, project: p.project, symbol: p.symbol, chain: p.chain, tvlUsd: p.tvlUsd, apyReward: p.apyReward, rewardTokens: p.rewardTokens })));
    } catch { return out; }
  }
  // For each slug, find matching pools (try multiple project name variants)
  const slugToProjects = (slug) => {
    const base = slug.replace(/-v[0-9]+$/, "");
    return [slug, slug + "-v3", slug + "-v2", slug + "-v1", base, base.replace(/-/g, "")];
  };
  for (const slug of slugs) {
    const variants = slugToProjects(slug);
    const matchedPools = allPools
      .filter(p => variants.some(v => p.project === v || p.project?.startsWith(v + "-")))
      .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
      .slice(0, 3); // Top 3 by TVL
    if (!matchedPools.length) continue;
    const events = [];
    // Check chart history for each pool to detect incentive changes
    for (const pool of matchedPools) {
      const ck = `ychart:${pool.pool}`;
      let chartData = ctxCache(ck);
      if (!chartData) {
        try {
          const r = await fetch(`https://yields.llama.fi/chart/${pool.pool}`);
          if (!r.ok) continue;
          const cd = await r.json();
          chartData = cd.data || [];
          ctxSet(ck, chartData.slice(-90)); // Keep only last 90 days
        } catch { continue; }
      }
      if (chartData.length < 7) continue;
      const recent = chartData.slice(-60);
      // Detect incentive campaign END: apyReward drops from >0.5% to <0.1%
      for (let i = 1; i < recent.length; i++) {
        const prev = recent[i - 1].apyReward || 0;
        const curr = recent[i].apyReward || 0;
        if (prev > 0.5 && curr < 0.1) {
          events.push({ type: "incentive_end", date: recent[i].timestamp?.slice(0, 10), pool: pool.symbol, chain: pool.chain, prevReward: prev });
        }
      }
      // Detect incentive campaign START: apyReward jumps from <0.1% to >0.5%
      for (let i = 1; i < recent.length; i++) {
        const prev = recent[i - 1].apyReward || 0;
        const curr = recent[i].apyReward || 0;
        if (prev < 0.1 && curr > 0.5) {
          events.push({ type: "incentive_start", date: recent[i].timestamp?.slice(0, 10), pool: pool.symbol, chain: pool.chain, newReward: curr });
        }
      }
      // Detect significant reward reduction (>50% drop in 7 days)
      if (recent.length >= 7) {
        const weekAgoReward = recent[recent.length - 7].apyReward || 0;
        const nowReward = recent[recent.length - 1].apyReward || 0;
        if (weekAgoReward > 1 && nowReward < weekAgoReward * 0.5) {
          events.push({ type: "incentive_cut", date: recent[recent.length - 1].timestamp?.slice(0, 10), pool: pool.symbol, chain: pool.chain, from: weekAgoReward, to: nowReward });
        }
      }
    }
    if (events.length) out[slug] = events;
  }
  return out;
}

// Fetch DeFiLlama hacks (gracefully handles 429)
async function fetchHacksData() {
  const cached = ctxCache("hacks");
  if (cached) return cached;
  try {
    const r = await fetch("https://api.llama.fi/hacks");
    if (!r.ok) return [];
    const d = await r.json();
    const data = Array.isArray(d) ? d : [];
    ctxSet("hacks", data);
    return data;
  } catch { return []; }
}

function fmtAmt(n) {
  if (!n || n <= 0) return "";
  return n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(0)}M` : `$${n.toLocaleString()}`;
}

function fmtDate(ts) {
  const d = typeof ts === "number" && ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function buildReasons(protocol, contextData) {
  const reasons = [];
  const slug = protocol.slug || "";
  const ctx = contextData?.[slug];
  if (!ctx) return [];

  const rangeStart = ctx.rangeStart || 0;
  const rangeEnd = ctx.rangeEnd || (Date.now() / 1000);

  // 1) DeFiLlama hallmarks — curated protocol events (hacks, launches, depegs, upgrades)
  if (ctx.hallmarks?.length) {
    ctx.hallmarks.forEach(([ts, desc]) => {
      if (ts >= rangeStart - 30 * 86400 && ts <= rangeEnd + 15 * 86400) {
        reasons.push({ date: ts, type: "event", text: `${desc} (${fmtDate(ts)})` });
      }
    });
  }

  // 2) Fundraising rounds — from DeFiLlama protocol data
  if (ctx.raises?.length) {
    ctx.raises.forEach(raise => {
      const ts = raise.date;
      if (ts >= rangeStart - 30 * 86400 && ts <= rangeEnd + 15 * 86400) {
        const amt = raise.amount ? `$${raise.amount}M` : "";
        const round = raise.round ? raise.round.trim() : "";
        const investors = raise.leadInvestors?.filter(Boolean).slice(0, 3).join(", ") || "";
        let text = "Fundraising";
        if (amt) text += ` ${amt}`;
        if (round) text += ` (${round})`;
        if (investors) text += ` — ${investors}`;
        text += ` (${fmtDate(ts)})`;
        reasons.push({ date: ts, type: "raise", text });
      }
    });
  }

  // 3) Hacks — confirmed security incidents
  if (ctx.hacks?.length) {
    ctx.hacks.forEach(hack => {
      const ts = typeof hack.date === "number" ? hack.date : Math.floor(new Date(hack.date).getTime() / 1000);
      if (ts >= rangeStart - 30 * 86400 && ts <= rangeEnd + 15 * 86400) {
        const amt = fmtAmt(hack.amount);
        reasons.push({ date: ts, type: "hack", text: `Security exploit${amt ? ` — ${amt} lost` : ""}${hack.technique ? `, via ${hack.technique}` : ""} (${fmtDate(ts)})` });
      }
    });
  }

  // 4) Incentive campaign events — from yield chart history
  if (ctx.yieldEvents?.length) {
    ctx.yieldEvents.forEach(ev => {
      const ts = ev.date ? Math.floor(new Date(ev.date).getTime() / 1000) : rangeEnd;
      if (ev.type === "incentive_end") {
        reasons.push({ date: ts, type: "event", text: `Incentive rewards ended on ${ev.pool}${ev.chain !== "Ethereum" ? ` (${ev.chain})` : ""} (${fmtDate(ts)})` });
      } else if (ev.type === "incentive_start") {
        reasons.push({ date: ts, type: "raise", text: `New incentive campaign launched on ${ev.pool}${ev.chain !== "Ethereum" ? ` (${ev.chain})` : ""} — +${ev.newReward.toFixed(1)}% reward APY (${fmtDate(ts)})` });
      } else if (ev.type === "incentive_cut") {
        reasons.push({ date: ts, type: "event", text: `Incentive rewards cut on ${ev.pool}${ev.chain !== "Ethereum" ? ` (${ev.chain})` : ""}: ${ev.from.toFixed(1)}% → ${ev.to.toFixed(1)}% (${fmtDate(ts)})` });
      }
    });
  }

  // Deduplicate, sort by date, limit
  const seen = new Set();
  const unique = reasons.filter(r => {
    const key = r.text.slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => (b.date || 0) - (a.date || 0));
  return unique.slice(0, 5);
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ProtocolWars() {
  const [activeSegment, setActiveSegment] = useState("DEX");
  const [activeRivalry, setActiveRivalry] = useState(0);
  const [dexChain, setDexChain] = useState("Ethereum");
  const [lendingChain, setLendingChain] = useState("Ethereum");
  const [lendingMetric, setLendingMetric] = useState("tvl"); // "tvl" | "loans"
  const [dexMetric, setDexMetric] = useState("volume"); // "volume" | "tvl"
  const [perpsMetric, setPerpsMetric] = useState("fees"); // "fees" | "openInterest" | "volume"
  const [blockchainsMetric, setBlockchainsMetric] = useState("chainTvl"); // "chainTvl" | "chainVolume" | "chainRevenue"
  const [timeRange, setTimeRange] = useState(90);
  const [customInput, setCustomInput] = useState("");
  const [slugs, setSlugs] = useState(DEX_CHAINS.Ethereum.slugs);
  const [protocols, setProtocols] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [rawDataBySlug, setRawDataBySlug] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [protocolMeta, setProtocolMeta] = useState({});
  const [stacked, setStacked] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [solanaDexMode, setSolanaDexMode] = useState("all");
  const [hiddenSlugs, setHiddenSlugs] = useState(new Set());
  const [contextData, setContextData] = useState({});
  const fetchIdRef = useRef(0);
  const protocolMetaRef = useRef({});
  useEffect(() => { protocolMetaRef.current = protocolMeta; }, [protocolMeta]);

  // current rivalry context
  const currentRivalry = SEGMENTS[activeSegment]?.rivalries[activeRivalry];
  const currentDataType =
    activeSegment === "Lending" && lendingMetric === "loans"
      ? "borrowed"
      : activeSegment === "DEX" && dexMetric === "tvl"
        ? "tvl"
        : activeSegment === "Perps"
          ? (perpsMetric === "openInterest" ? "openInterest" : perpsMetric === "volume" ? "perpsVolume" : "fees")
          : activeSegment === "Blockchains"
            ? blockchainsMetric
            : (SEGMENTS[activeSegment]?.dataType || "tvl");
  const currentChain =
    activeSegment === "DEX" ? dexChain :
    activeSegment === "Lending" ? lendingChain :
    (currentRivalry?.chain || null);

  useEffect(() => {
    fetch("https://api.llama.fi/protocols")
      .then(r => r.json())
      .then(data => {
        const meta = {};
        data.forEach(p => { meta[p.slug] = { name: p.name, logo: p.logo }; });
        setProtocolMeta(meta);
      })
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async (currentSlugs, days, dataType, chain) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setErrors({});

    const cutoff = getTodayTs() - days * 86400;
    const newErrors = {};
    const rawBySlug = {};
    const apiMeta = {};

    await Promise.all(
      currentSlugs.map(async slug => {
        try {
          const result = await fetchSlugData(slug, dataType, cutoff, chain);
          rawBySlug[slug] = result.series;
          apiMeta[slug] = { name: result.name, logo: result.logo };
        } catch (e) {
          newErrors[slug] = e.message || "Error";
        }
      })
    );

    if (fetchId !== fetchIdRef.current) return;

    try {
      const validSlugs = currentSlugs.filter(s => rawBySlug[s] && !newErrors[s]);
      if (validSlugs.length === 0) {
        setErrors(newErrors);
        setChartData([]);
        setProtocols([]);
        setLoading(false);
        return;
      }

      // Date alignment — find union, fallback to intersection if needed
      const dateSets = validSlugs.map(s => new Set(rawBySlug[s].map(d => d.date)));
      let commonDates = [...dateSets[0]]
        .filter(d => dateSets.every(set => set.has(d)))
        .sort((a, b) => a - b);

      if (commonDates.length < 5) {
        const allDates = new Set();
        validSlugs.forEach(s => rawBySlug[s].forEach(d => allDates.add(d.date)));
        commonDates = [...allDates].filter(d => d >= cutoff).sort((a, b) => a - b);
      }

      // Value lookup maps
      const valueMaps = {};
      validSlugs.forEach(slug => {
        valueMaps[slug] = {};
        rawBySlug[slug].forEach(d => { valueMaps[slug][d.date] = d.value; });
      });

      // Forward-fill interpolation
      const interpolate = (slug) => {
        const out = {};
        let last = null;
        commonDates.forEach(d => {
          if (valueMaps[slug][d] != null) { last = valueMaps[slug][d]; out[d] = last; }
          else if (last != null) out[d] = last;
        });
        return out;
      };

      const interp = {};
      validSlugs.forEach(slug => { interp[slug] = interpolate(slug); });

      // Build percentage share chart data
      const chart = commonDates.map(ts => {
        const vals = {};
        let total = 0;
        validSlugs.forEach(s => { vals[s] = interp[s][ts] ?? 0; total += vals[s]; });
        if (total === 0) return null;
        const row = { label: formatDate(ts), ts };
        validSlugs.forEach(s => { row[s] = parseFloat(((vals[s] / total) * 100).toFixed(2)); });
        return row;
      }).filter(Boolean);

      const meta = protocolMetaRef.current;
      const protocolObjs = validSlugs.map(slug => ({
        slug,
        name: meta[slug]?.name || apiMeta[slug]?.name || slugToDisplay(slug),
        logo: (dataType === "stablecoin" && apiMeta[slug]?.logo) ? apiMeta[slug].logo : (meta[slug]?.logo || apiMeta[slug]?.logo || null),
        currentValue: rawBySlug[slug]?.[rawBySlug[slug].length - 1]?.value ?? null,
        rawData: rawBySlug[slug],
      }));

      if (fetchId !== fetchIdRef.current) return;
      setErrors(newErrors);
      setRawDataBySlug(rawBySlug);
      setChartData(chart);
      setProtocols(protocolObjs);

      // Fetch context data in background (non-blocking)
      (async () => {
        try {
          if (fetchId !== fetchIdRef.current) return;
          const rangeStart = chart[0]?.ts || 0;
          const rangeEnd = chart[chart.length - 1]?.ts || (Date.now() / 1000);
          const [protoCtx, yieldEvents, hacksData] = await Promise.all([
            fetchProtocolContext(validSlugs),
            fetchYieldEvents(validSlugs),
            fetchHacksData(),
          ]);
          if (fetchId !== fetchIdRef.current) return;

          // Fuzzy match hacks to slugs
          const matchHacks = (slug, name) => {
            const n = (name || slug).toLowerCase().replace(/\s+(v[0-9]|finance|protocol|swap|dex|exchange).*$/i, "").trim();
            const s0 = slug.split("-")[0];
            return hacksData.filter(h => {
              const hn = (h.name || "").toLowerCase().replace(/\s+(v[0-9]|finance|protocol|swap|dex|exchange).*$/i, "").trim();
              if (hn.length < 3 || n.length < 3) return false;
              return hn === n || hn.startsWith(n) || n.startsWith(hn) || slug.startsWith(hn) || hn.startsWith(s0);
            });
          };

          if (fetchId !== fetchIdRef.current) return;
          const ctxMap = {};
          validSlugs.forEach(s => {
            const meta = protocolObjs.find(p => p.slug === s);
            ctxMap[s] = {
              hallmarks: protoCtx[s]?.hallmarks || [],
              raises: protoCtx[s]?.raises || [],
              chains: protoCtx[s]?.chains || [],
              forkedFrom: protoCtx[s]?.forkedFrom,
              hacks: matchHacks(s, meta?.name),
              yieldEvents: yieldEvents[s] || [],
              rangeStart,
              rangeEnd,
            };
          });
          setContextData(ctxMap);
        } catch {}
      })();
    } catch {
      if (fetchId !== fetchIdRef.current) return;
      setErrors({ _global: "Failed to process data." });
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  }, []);

  // When /protocols meta arrives, patch names+logos onto existing protocols without re-fetching data
  useEffect(() => {
    if (!Object.keys(protocolMeta).length) return;
    setProtocols(prev => prev.map(p => ({
      ...p,
      name: protocolMeta[p.slug]?.name || p.name,
      logo: protocolMeta[p.slug]?.logo || p.logo,
    })));
  }, [protocolMeta]);

  useEffect(() => {
    if (slugs.length > 0) {
      const rivalry = SEGMENTS[activeSegment]?.rivalries[activeRivalry];
      const chain =
        activeSegment === "DEX" ? dexChain :
        activeSegment === "Lending" ? lendingChain :
        (rivalry?.chain || null);
      const dataType =
        activeSegment === "Lending" && lendingMetric === "loans"
          ? "borrowed"
          : activeSegment === "DEX" && dexMetric === "tvl"
            ? "tvl"
            : activeSegment === "Perps"
              ? (perpsMetric === "openInterest" ? "openInterest" : perpsMetric === "volume" ? "perpsVolume" : "fees")
              : activeSegment === "Blockchains"
                ? blockchainsMetric
                : (SEGMENTS[activeSegment]?.dataType || "tvl");
      fetchData(slugs, timeRange, dataType, chain);
    }
  }, [slugs, timeRange, activeSegment, activeRivalry, dexChain, lendingChain, lendingMetric, dexMetric, perpsMetric, blockchainsMetric, fetchData]);

  const handleSegmentChange = seg => {
    setActiveSegment(seg);
    setActiveRivalry(0);
    setHiddenSlugs(new Set());
    if (seg === "DEX") {
      // keep current lending chain if it exists in DEX_CHAINS, else first
      const preferred = (lendingChain && DEX_CHAINS[lendingChain]) ? lendingChain : Object.keys(DEX_CHAINS)[0];
      setDexChain(preferred);
      setLendingChain(null);
      if (preferred === "Solana") {
        setSolanaDexMode("all");
        setSlugs(SOLANA_DEX_MODES.all.slugs);
      } else {
        setSlugs(DEX_CHAINS[preferred].slugs);
      }
    } else if (seg === "Lending") {
      // keep current dex chain if it exists in LENDING_CHAINS, else Ethereum
      const preferred = (dexChain && LENDING_CHAINS[dexChain]) ? dexChain : "Ethereum";
      setDexChain(null);
      setLendingChain(preferred);
      if (preferred === "MegaETH") setLendingMetric("tvl");
      setSlugs(LENDING_CHAINS[preferred].slugs);
    } else if (seg === "Perps") {
      setDexChain(null);
      setLendingChain(null);
      setPerpsMetric("fees");
      setSlugs(SEGMENTS.Perps.defaultSlugs);
    } else {
      setDexChain(null);
      setLendingChain(null);
      const seg_data = SEGMENTS[seg];
      if (seg === "Blockchains") setBlockchainsMetric("chainTvl");
      setSlugs(seg_data.defaultSlugs ?? seg_data.rivalries[0]?.slugs ?? []);
    }
  };
  const handleRivalryChange = idx => {
    setActiveRivalry(idx);
    setSlugs(SEGMENTS[activeSegment].rivalries[idx].slugs);
  };
  const handleChainSelect = chainName => {
    setDexChain(chainName);
    setHiddenSlugs(new Set());
    if (chainName === "Solana") {
      setSolanaDexMode("all");
      setSlugs(SOLANA_DEX_MODES.all.slugs);
    } else {
      setSlugs(DEX_CHAINS[chainName].slugs);
    }
  };
  const handleSolanaModeSelect = mode => {
    setSolanaDexMode(mode);
    setHiddenSlugs(new Set());
    setSlugs(SOLANA_DEX_MODES[mode].slugs);
  };
  const handleLendingChainSelect = chainName => {
    setLendingChain(chainName);
    setHiddenSlugs(new Set());
    if (chainName === "MegaETH") setLendingMetric("tvl");
    setSlugs(LENDING_CHAINS[chainName].slugs);
  };
  const handleAddSlug = () => {
    const t = customInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !slugs.includes(t)) setSlugs(prev => [...prev, t]);
    setCustomInput("");
    setShowSuggestions(false);
  };
  const handleRemoveSlug = slug => setSlugs(prev => prev.filter(s => s !== slug));

  const leadingSlug = (() => {
    if (!chartData?.length || !protocols?.length) return null;
    const last = chartData[chartData.length - 1];
    return protocols.reduce((best, p) =>
      (last?.[p.slug] ?? 0) > (last?.[best?.slug] ?? 0) ? p : best, protocols[0])?.slug;
  })();

  const protocolColors = protocols.map((p, i) => getColor(p.slug, i));
  const colorBySlug = Object.fromEntries(protocols.map((p, i) => [p.slug, getColor(p.slug, i)]));
  const visibleProtocols = protocols.filter(p => {
    if (hiddenSlugs.has(p.slug)) return false;
    if (chartData.length > 0 && !chartData.some(d => (d[p.slug] ?? 0) > 0)) return false;
    return true;
  });

  // When stacked + some protocols hidden, renormalize so visible always sums to 100%
  const displayData = useMemo(() => {
    if (!stacked || hiddenSlugs.size === 0) return chartData;
    const visibleSlugs = visibleProtocols.map(p => p.slug);
    return chartData.map(row => {
      const total = visibleSlugs.reduce((s, slug) => s + (row[slug] ?? 0), 0);
      if (total === 0) return row;
      const newRow = { label: row.label, ts: row.ts };
      visibleSlugs.forEach(slug => {
        newRow[slug] = parseFloat(((row[slug] ?? 0) / total * 100).toFixed(2));
      });
      return newRow;
    });
  }, [chartData, stacked, hiddenSlugs, visibleProtocols]);

  const suggestionCatalog =
    activeSegment === "DEX" && dexChain === "Solana" && solanaDexMode === "memecoins"
      ? [
          { slug: "pump",      name: "Pump.fun" },
          { slug: "meteora",   name: "Meteora" },
          { slug: "raydium",   name: "Raydium" },
          { slug: "moonshot",  name: "Moonshot" },
          { slug: "bonk",      name: "Bonk" },
          { slug: "fluxbeam",  name: "FluxBeam" },
        ]
    : activeSegment === "DEX" && dexChain === "Solana" && solanaDexMode === "blue_chips"
      ? [
          { slug: "orca",         name: "Orca" },
          { slug: "raydium",      name: "Raydium" },
          { slug: "jupiter",      name: "Jupiter" },
          { slug: "lifinity",     name: "Lifinity" },
          { slug: "openbook-dex", name: "OpenBook" },
          { slug: "invariant",    name: "Invariant" },
        ]
    : activeSegment === "DEX"     ? (CHAIN_DEX_PROTOCOLS[dexChain] || [])
    : activeSegment === "Lending" ? (CHAIN_LENDING_PROTOCOLS[lendingChain] || [])
    : (SEGMENT_PROTOCOLS[activeSegment] || []);
  const suggestionQuery = customInput.trim().toLowerCase();
  const filteredSuggestions = suggestionCatalog
    .filter(p => !slugs.includes(p.slug) && (
      suggestionQuery === "" ||
      p.name.toLowerCase().includes(suggestionQuery) ||
      p.slug.includes(suggestionQuery)
    ))
    .slice(0, 7);

  const chainSelectorJSX = (activeSegment === "DEX" || activeSegment === "Lending") ? (() => {
    const chainsConfig = activeSegment === "DEX" ? DEX_CHAINS : LENDING_CHAINS;
    const activeChain = activeSegment === "DEX" ? dexChain : lendingChain;
    const handleSelect = activeSegment === "DEX" ? handleChainSelect : handleLendingChainSelect;
    const label = activeSegment === "DEX" ? "Top 5 DEXs" : "Top 5 Lending";
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Chain — {label}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(chainsConfig).map(([chainName, cfg]) => {
            const active = activeChain === chainName;
            const logoUrl = CHAIN_LOGOS[chainName];
            return (
              <button key={chainName} onClick={() => handleSelect(chainName)} style={{
                background: active ? cfg.color + "18" : "#141210",
                border: `1.5px solid ${active ? cfg.color + "99" : "#221e16"}`,
                color: active ? cfg.color : "#5a4a30",
                borderRadius: 6, padding: "6px 13px", cursor: "pointer",
                fontWeight: 600, fontSize: 12, transition: "all .15s", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: active ? `0 2px 12px ${cfg.color}28` : "none",
              }}>
                <img src={logoUrl} alt={chainName} style={{
                  width: 22, height: 22, borderRadius: "50%", objectFit: "cover",
                  filter: active ? "none" : "grayscale(60%) opacity(0.7)",
                  transition: "filter .2s", flexShrink: 0,
                }} />
                {chainName}
              </button>
            );
          })}
        </div>
        {/* Lending Metric Toggle */}
        {activeSegment === "Lending" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Metric —</span>
            <div style={{ display: "flex", gap: 2, background: "#141210", border: "1px solid #221e16", borderRadius: 5, padding: "2px" }}>
              {[{ key: "tvl", label: "TVL" }, { key: "loans", label: "Active Loans" }]
                .filter(({ key }) => !(key === "loans" && lendingChain === "MegaETH"))
                .map(({ key, label }) => (
                <button key={key} onClick={() => { setLendingMetric(key); setHiddenSlugs(new Set()); }} style={{
                  background: lendingMetric === key ? "#f0a020" : "transparent",
                  border: "none",
                  color: lendingMetric === key ? "#0c0a06" : "#6a5838",
                  borderRadius: 3, padding: "3px 11px", cursor: "pointer",
                  fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {/* DEX Metric Toggle */}
        {activeSegment === "DEX" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Metric —</span>
            <div style={{ display: "flex", gap: 2, background: "#141210", border: "1px solid #221e16", borderRadius: 5, padding: "2px" }}>
              {[{ key: "volume", label: "Volume" }, { key: "tvl", label: "TVL" }].map(({ key, label }) => (
                <button key={key} onClick={() => { setDexMetric(key); setHiddenSlugs(new Set()); }} style={{
                  background: dexMetric === key ? "#f0a020" : "transparent",
                  border: "none",
                  color: dexMetric === key ? "#0c0a06" : "#6a5838",
                  borderRadius: 3, padding: "3px 11px", cursor: "pointer",
                  fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {/* Solana DEX sub-filter */}
        {activeSegment === "DEX" && dexChain === "Solana" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Focus —</span>
            {Object.entries(SOLANA_DEX_MODES).map(([key, cfg]) => {
              const active = solanaDexMode === key;
              return (
                <button key={key} onClick={() => handleSolanaModeSelect(key)} style={{
                  background: active ? "#f0a02018" : "#141210",
                  border: `1px solid ${active ? "#f0a02088" : "#221e16"}`,
                  color: active ? "#fcd34d" : "#5a4a30",
                  borderRadius: 5, padding: "4px 12px", cursor: "pointer",
                  fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {key === "memecoins" && <span style={{ fontSize: 13 }}>🐸</span>}
                  {key === "blue_chips" && <span style={{ fontSize: 13 }}>🔵</span>}
                  {key === "all" && <span style={{ fontSize: 13 }}>⚡</span>}
                  {cfg.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  })() : null;

  const chainBadgeColor =
    (dexChain && DEX_CHAINS[dexChain]?.color) ||
    (lendingChain && LENDING_CHAINS[lendingChain]?.color) ||
    "#f0a020";
  const chainBadgeJSX = currentChain ? (
    <span style={{
      background: chainBadgeColor + "22",
      border: `1px solid ${chainBadgeColor}66`,
      color: chainBadgeColor,
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
    }}>{currentChain}</span>
  ) : null;

  const aiInsights = generateAnalysis(chartData, visibleProtocols);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse 85% 50% at 50% -2%, rgba(240,160,32,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 98% 98%, rgba(234,88,12,0.08) 0%, transparent 55%), radial-gradient(ellipse 35% 30% at 2% 60%, rgba(251,191,36,0.04) 0%, transparent 50%) #0c0b08", color: "#f0e6cb", fontFamily: "'Space Grotesk','Inter',-apple-system,sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@900&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        html, body { background-color: #0c0b08 !important; background-image: radial-gradient(ellipse 85% 50% at 50% -2%, rgba(240,160,32,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 98% 98%, rgba(234,88,12,0.08) 0%, transparent 55%) !important; background-attachment: fixed !important; margin: 0; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loadbar { 0%{left:-45%;width:45%} 100%{left:100%;width:45%} }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:#0c0b08}
        ::-webkit-scrollbar-thumb{background:#2a1e10;border-radius:2px}
        input{outline:none} input:focus{border-color:#f0a020 !important}
        button:hover{opacity:.8}
        .mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
        .hero-overlay__credit {
          padding: 0.28rem 0.6rem 0.28rem 1.0rem;
          border-radius: 999px;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f0a020;
          background: rgba(240, 160, 32, 0.06);
          border: 1px solid rgba(240, 160, 32, 0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
          backdrop-filter: blur(1px);
          flex-shrink: 0;
          margin-left: auto;
        }
        .hero-overlay__credit:hover {
          border-color: rgba(240, 160, 32, 0.65);
          background: rgba(240, 160, 32, 0.11);
          transform: translateY(-1px);
          opacity: 1 !important;
        }
        .hero-overlay__credit-label {
          letter-spacing: inherit;
          white-space: nowrap;
        }
        .hero-overlay__credit-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(240, 160, 32, 0.3);
          box-shadow: 0 0 14px rgba(240, 160, 32, 0.15);
          margin-right: -0.2rem;
          flex: 0 0 32px;
        }
        .hero-overlay__credit-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "rgba(14, 12, 9, 0.94)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(240, 160, 32, 0.18)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.35)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", alignItems: "center", minHeight: 60, padding: "0 20px", gap: 28 }}>
          {/* Brand mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
            <img src="/versus_favicon.svg" alt="VS" style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(240,160,32,0.5))" }} />
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{
                  fontFamily: "'Orbitron', 'Bebas Neue', sans-serif",
                  fontSize: 26, fontWeight: 900,
                  background: "linear-gradient(90deg, #fbbf24 0%, #f0a020 60%, #e05d20 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  letterSpacing: 3, textTransform: "uppercase",
                  filter: "drop-shadow(0 0 10px rgba(240,160,32,0.45))",
                }}>
                  Flip
                </span>
                <span style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  fontSize: 22, fontWeight: 400,
                  color: "#5a3e18",
                  letterSpacing: 7, textTransform: "uppercase",
                }}>
                  Terminal
                </span>
              </div>
              <div style={{ color: "#7a6248", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 1, fontStyle: "italic" }}>
                Watch your favorite protocol get flipped
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: "rgba(240,160,32,0.2)", flexShrink: 0 }} />

          {/* Segment pills */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {Object.entries(SEGMENTS).map(([key, seg]) => (
              <button key={key} onClick={() => handleSegmentChange(key)} style={{
                background: activeSegment === key
                  ? "linear-gradient(135deg, rgba(240,160,32,0.14) 0%, rgba(234,88,12,0.08) 100%)"
                  : "transparent",
                border: activeSegment === key ? "1px solid rgba(240,160,32,0.45)" : "1px solid transparent",
                borderRadius: 8,
                color: activeSegment === key ? "#fcd34d" : "#a08060",
                padding: "6px 16px", cursor: "pointer",
                fontWeight: activeSegment === key ? 700 : 400,
                fontSize: 13,
                letterSpacing: 0.3,
                boxShadow: activeSegment === key ? "0 0 12px rgba(240,160,32,0.15), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
                transition: "all .18s", fontFamily: "inherit",
              }}>{seg.label}</button>
            ))}
          </div>

          {/* Credit badge */}
          <a
            href="https://x.com/JoestarCrypto"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-overlay__credit"
          >
            <span className="hero-overlay__credit-label">Made by Joestar</span>
            <span className="hero-overlay__credit-avatar">
              <img src="/Jojo2.webp" alt="Joestar" />
            </span>
          </a>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px" }}>

        {/* ── Chain Selector (DEX and Lending) ── */}
        {chainSelectorJSX}

        {/* Rivalry selector */}
        {SEGMENTS[activeSegment].rivalries.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {SEGMENTS[activeSegment].rivalries.map((r, idx) => (
              <button key={idx} onClick={() => handleRivalryChange(idx)} style={{
                background: !dexChain && !lendingChain && activeRivalry === idx ? "#f0a02018" : "#141210",
                border: `1px solid ${!dexChain && !lendingChain && activeRivalry === idx ? "#f0a020" : "#221e16"}`,
                color: !dexChain && !lendingChain && activeRivalry === idx ? "#fcd34d" : "#5a4a30",
                borderRadius: 5, padding: "5px 13px", cursor: "pointer",
                fontSize: 12, fontWeight: 600, transition: "all .15s", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {r.chain && CHAIN_LOGOS[r.chain] && (
                  <img src={CHAIN_LOGOS[r.chain]} alt={r.chain}
                    style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                )}
                {r.name}
              </button>
            ))}
          </div>
        )}

        {/* Perps Top 5 label */}
        {activeSegment === "Perps" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Top 5 Perps · by OI</span>
            {JSON.stringify([...slugs].sort()) !== JSON.stringify([...SEGMENTS.Perps.defaultSlugs].sort()) && (
              <button onClick={() => { setSlugs(SEGMENTS.Perps.defaultSlugs); setHiddenSlugs(new Set()); }} style={{
                background: "transparent", border: "1px solid #221e16", borderRadius: 4, color: "#5a4a30",
                fontSize: 10, fontWeight: 600, letterSpacing: 1, padding: "2px 8px", cursor: "pointer",
                textTransform: "uppercase", fontFamily: "inherit",
              }}>⚡ Reset</button>
            )}
          </div>
        )}

        {/* Perps Metric Toggle */}
        {activeSegment === "Perps" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Metric —</span>
            <div style={{ display: "flex", gap: 2, background: "#141210", border: "1px solid #221e16", borderRadius: 5, padding: "2px" }}>
              {[
                { key: "volume",       label: "Volume" },
                { key: "openInterest", label: "Open Interest" },
                { key: "fees",         label: "Fees" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => { setPerpsMetric(key); setHiddenSlugs(new Set()); }} style={{
                  background: perpsMetric === key ? "#f0a020" : "transparent",
                  border: "none",
                  color: perpsMetric === key ? "#0c0a06" : "#6a5838",
                  borderRadius: 3, padding: "3px 11px", cursor: "pointer",
                  fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Blockchains Metric Toggle */}
        {activeSegment === "Blockchains" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ color: "#6a5838", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Metric —</span>
            <div style={{ display: "flex", gap: 2, background: "#141210", border: "1px solid #221e16", borderRadius: 5, padding: "2px" }}>
              {[
                { key: "chainTvl",     label: "TVL" },
                { key: "chainVolume",  label: "DEX Volume" },
                { key: "chainRevenue", label: "Revenue" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => { setBlockchainsMetric(key); setHiddenSlugs(new Set()); }} style={{
                  background: blockchainsMetric === key ? "#f0a020" : "transparent",
                  border: "none",
                  color: blockchainsMetric === key ? "#0c0a06" : "#6a5838",
                  borderRadius: 3, padding: "3px 11px", cursor: "pointer",
                  fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {errors._global && (
          <div style={{ background: "#ef444422", border: "1px solid #ef444466", borderRadius: 10, padding: "12px 16px", color: "#ef4444", marginBottom: 16, fontSize: 14 }}>
            {errors._global}
          </div>
        )}

        {/* Fighter Cards */}
        {loading ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "stretch" }}>
            {slugs.map((_, i) => (
              <div key={i} style={{ flex: "1 1 100px", minWidth: 90, background: "#141210", borderRadius: 7, padding: "7px 10px" }}>
                <Skeleton height={22} width={22} radius={5} style={{ marginBottom: 8 }} />
                <Skeleton height={12} width="70%" style={{ marginBottom: 5 }} />
                <Skeleton height={28} width="50%" style={{ marginBottom: 5 }} />
                <Skeleton height={10} width="60%" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "stretch", animation: "fadeIn .4s ease" }}>
            {[...visibleProtocols]
              .sort((a, b) => {
                const last = chartData[chartData.length - 1];
                return (last?.[b.slug] ?? 0) - (last?.[a.slug] ?? 0);
              })
              .map(p => (
                <FighterCard
                  key={p.slug}
                  protocol={p}
                  color={colorBySlug[p.slug]}
                  isLeading={p.slug === leadingSlug}
                  chartData={chartData}
                  dataType={currentDataType}
                />
              ))}
          </div>
        )}

        {/* The Arena */}
        <div style={{ background: "#100f0c", border: "1px solid #221e16", borderRadius: 8, padding: "16px 16px 12px", marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingLeft: 4, paddingRight: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#6a5838", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 700 }}>The Arena</span>
              <span style={{ background: "#f0a02018", border: "1px solid #f0a02030", color: "#f0a020", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, letterSpacing: 0.5 }}>
                {DT[currentDataType]?.arena || "Market Share %"}
              </span>
              {chainBadgeJSX}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 2, background: "#141210", border: "1px solid #221e16", borderRadius: 5, padding: "2px" }}>
                {TIME_RANGES.map(({ label, days }) => (
                  <button key={label} onClick={() => setTimeRange(days)} style={{
                    background: timeRange === days ? "#f0a020" : "transparent",
                    border: "none",
                    color: timeRange === days ? "#0c0a06" : "#5a4a30",
                    borderRadius: 3, padding: "3px 9px", cursor: "pointer",
                    fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
              </div>
              <button onClick={() => setShowAIPanel(s => !s)} style={{
                background: showAIPanel ? "#f0a02020" : "#141210",
                border: `1px solid ${showAIPanel ? "#f0a02088" : "#221e16"}`,
                color: showAIPanel ? "#fbbf24" : "#5a4a30",
                borderRadius: 5, padding: "3px 11px", cursor: "pointer",
                fontWeight: 600, fontSize: 11, fontFamily: "inherit", transition: "all .15s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <img
                  src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64"
                  alt="Claude"
                  style={{ width: 13, height: 13, borderRadius: 2, flexShrink: 0 }}
                />
                Ask Claude
              </button>
              <button onClick={() => setStacked(s => !s)} style={{
                background: stacked ? "#f0a02018" : "#141210",
                border: `1px solid ${stacked ? "#f0a02088" : "#221e16"}`,
                color: stacked ? "#f0a020" : "#5a4a30",
                borderRadius: 5, padding: "3px 10px", cursor: "pointer",
                fontWeight: 600, fontSize: 11, fontFamily: "inherit", transition: "all .15s",
              }}>{stacked ? "Unstack" : "Stack to 100%"}</button>
              <span style={{ color: "#382e1e", fontSize: 10 }}>
                {chartData.length > 0 ? `${chartData[0]?.label} → ${chartData[chartData.length - 1]?.label}` : ""}
              </span>
            </div>
          </div>

          {/* ── Protocol toggles ── */}
          <div style={{ padding: "6px 4px 10px", borderBottom: "1px solid #221e16", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {protocols.filter(p => chartData.length === 0 || chartData.some(d => (d[p.slug] ?? 0) > 0)).map(p => {
                const color = colorBySlug[p.slug] || "#666";
                const isHidden = hiddenSlugs.has(p.slug);
                return (
                  <button
                    key={p.slug}
                    onClick={() => setHiddenSlugs(prev => {
                      const next = new Set(prev);
                      if (next.has(p.slug)) next.delete(p.slug); else next.add(p.slug);
                      return next;
                    })}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: isHidden ? "#100f0c" : color + "12",
                      border: `1px solid ${isHidden ? "#221e16" : color + "55"}`, 
                      borderRadius: 4, padding: "3px 9px 3px 7px", fontSize: 11,
                      cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                      opacity: isHidden ? 0.4 : 1,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: isHidden ? "#382e1e" : color, flexShrink: 0 }} />
                    <span style={{ color: isHidden ? "#5a4a30" : "#fcd34d" }}>{p.name || slugToDisplay(p.slug)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ color: "#5a4a30", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Loading data…</div>
              <div style={{ width: "60%", height: 3, background: "#221e16", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                <div style={{
                  position: "absolute", top: 0, height: "100%", width: "45%",
                  background: "linear-gradient(90deg, transparent, #f0a020, #e05d20, transparent)",
                  animation: "loadbar 1.4s ease-in-out infinite",
                }} />
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#5a4a30", fontSize: 13 }}>
              No data found for selected protocols in this range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  {visibleProtocols.map(p => {
                    const color = colorBySlug[p.slug];
                    return (
                      <linearGradient key={p.slug} id={`grad-${p.slug}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={stacked ? 0.6 : 0.25} />
                        <stop offset="95%" stopColor={color} stopOpacity={stacked ? 0.3 : 0.02} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#221e16" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#5a4a30", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#5a4a30", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={stacked ? [0, 100] : [0, dataMax => Math.min(100, Math.ceil(dataMax / 5) * 5 + 5)]} />
                <Tooltip
                  content={<CustomTooltip protocols={visibleProtocols} rawDataBySlug={rawDataBySlug} dataType={currentDataType} />}
                  cursor={{ stroke: "#221e16", strokeWidth: 1 }}
                />
                <Legend
                  formatter={value => (
                    <span style={{ color: "#5a4a30", fontSize: 11 }}>
                      {visibleProtocols.find(p => p.slug === value)?.name || slugToDisplay(value)}
                    </span>
                  )}
                  wrapperStyle={{ paddingTop: 8 }}
                />
                {visibleProtocols.map(p => {
                  const color = colorBySlug[p.slug];
                  return (
                    <Area
                      key={p.slug}
                      type="monotone"
                      dataKey={p.slug}
                      stackId={stacked ? "1" : undefined}
                      stroke={color}
                      strokeWidth={stacked ? 1 : 2.5}
                      fill={`url(#grad-${p.slug})`}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* AI Analysis Panel */}
        {showAIPanel && (
          <div style={{
            background: "#100f0c", border: "1px solid #f0a02020",
            borderRadius: 8, padding: "18px 22px", marginBottom: 16,
            animation: "fadeIn .3s ease",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0a020">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                <span style={{ color: "#f0a020", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>AI Trend Analysis</span>
                <span style={{ background: "#f0a02018", border: "1px solid #f0a02033", color: "#f0a020", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: 1 }}>BETA</span>
              </div>
              <button onClick={() => setShowAIPanel(false)} style={{ background: "none", border: "none", color: "#5a4a30", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 2px", fontFamily: "inherit" }}>×</button>
            </div>

            {loading || chartData.length === 0 ? (
              <div style={{ color: "#5a4a30", fontSize: 13 }}>No data to analyze yet.</div>
            ) : !aiInsights ? (
              <div style={{ color: "#5a4a30", fontSize: 13 }}>Not enough data points for a meaningful analysis.</div>
            ) : (
              <>
                {/* Three-column: gaining | neutral | losing */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

                  {/* ── GAINING ── */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                      <span style={{ color: "#10b981", fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Gaining</span>
                    </div>
                    {aiInsights.gaining.length === 0 ? (
                      <div style={{ color: "#5a4a30", fontSize: 12, fontStyle: "italic" }}>No clear gainer.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {aiInsights.gaining.map((ins, i) => (
                          <div key={i} style={{ background: "#10b98108", border: "1px solid #10b98128", borderRadius: 6, padding: "10px 13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                              <span style={{ color: "#34d399", fontWeight: 700, fontSize: 13 }}>{ins.name}</span>
                              <span style={{ background: "#10b98118", border: "1px solid #10b98133", color: "#10b981", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 6 }}>{ins.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                              <span style={{ color: "#34d399", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{ins.current.toFixed(1)}%</span>
                              <span style={{ color: "#1a6645", fontSize: 11, alignSelf: "flex-end", marginBottom: 1 }}>share</span>
                            </div>
                            <p style={{ color: "#6b8f7a", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                            {(() => { const rs = buildReasons(ins, contextData); return rs.length ? (
                              <div style={{ marginTop: 8, borderTop: "1px solid #10b98115", paddingTop: 7 }}>
                                <div style={{ color: "#4a7a60", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>Context</div>
                                {rs.map((r, j) => (
                                  <div key={j} style={{ color: "#6b8f7a", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "#f0a02040" : r.type === "raise" ? "#10b98140" : "#5a4a3040"}` }}>{r.text}</div>
                                ))}
                              </div>
                            ) : null; })()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── NEUTRAL ── */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a4a30" }} />
                      <span style={{ color: "#5a4a30", fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Holding / Unclear</span>
                    </div>
                    {aiInsights.neutral.length === 0 ? (
                      <div style={{ color: "#5a4a30", fontSize: 12, fontStyle: "italic" }}>No neutral protocol.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {aiInsights.neutral.map((ins, i) => (
                          <div key={i} style={{ background: "#1a150e", border: "1px solid #2a2010", borderRadius: 6, padding: "10px 13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                              <span style={{ color: "#a08060", fontWeight: 700, fontSize: 13 }}>{ins.name}</span>
                              <span style={{ background: "#a0806018", border: "1px solid #a0806033", color: "#5a4a30", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 6 }}>{ins.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                              <span style={{ color: "#a08060", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{ins.current.toFixed(1)}%</span>
                              <span style={{ color: "#5a4a30", fontSize: 11, alignSelf: "flex-end", marginBottom: 1 }}>share</span>
                            </div>
                            <p style={{ color: "#5a4a30", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                            {(() => { const rs = buildReasons(ins, contextData); return rs.length ? (
                              <div style={{ marginTop: 8, borderTop: "1px solid #2a201015", paddingTop: 7 }}>
                                <div style={{ color: "#5a4a30", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>Context</div>
                                {rs.map((r, j) => (
                                  <div key={j} style={{ color: "#6a5838", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "#f0a02040" : r.type === "raise" ? "#10b98140" : "#5a4a3040"}` }}>{r.text}</div>
                                ))}
                              </div>
                            ) : null; })()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── LOSING ── */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                      <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Losing</span>
                    </div>
                    {aiInsights.losing.length === 0 ? (
                      <div style={{ color: "#5a4a30", fontSize: 12, fontStyle: "italic" }}>No clear loser.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {aiInsights.losing.map((ins, i) => (
                          <div key={i} style={{ background: "#ef444408", border: "1px solid #ef444428", borderRadius: 6, padding: "10px 13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                              <span style={{ color: "#f87171", fontWeight: 700, fontSize: 13 }}>{ins.name}</span>
                              <span style={{ background: "#ef444418", border: "1px solid #ef444433", color: "#ef4444", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 6 }}>{ins.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                              <span style={{ color: "#f87171", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{ins.current.toFixed(1)}%</span>
                              <span style={{ color: "#6b2222", fontSize: 11, alignSelf: "flex-end", marginBottom: 1 }}>share</span>
                            </div>
                            <p style={{ color: "#8f6b6b", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                            {(() => { const rs = buildReasons(ins, contextData); return rs.length ? (
                              <div style={{ marginTop: 8, borderTop: "1px solid #ef444415", paddingTop: 7 }}>
                                <div style={{ color: "#8f5555", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>Context</div>
                                {rs.map((r, j) => (
                                  <div key={j} style={{ color: "#8f6b6b", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "#f0a02040" : r.type === "raise" ? "#10b98140" : "#5a4a3040"}` }}>{r.text}</div>
                                ))}
                              </div>
                            ) : null; })()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Market structure note */}
                {aiInsights.marketNote && (
                  <div style={{
                    marginTop: 12, background: "#f0a02010", border: "1px solid #f0a02028",
                    borderRadius: 6, padding: "10px 14px",
                    display: "flex", alignItems: "flex-start", gap: 8,
                  }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{aiInsights.marketNote.icon}</span>
                    <p style={{ color: "#6a5838", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{aiInsights.marketNote.text}</p>
                  </div>
                )}
              </>
            )}

            <div style={{ color: "#5a4a30", fontSize: 10, marginTop: 14, textAlign: "right" }}>
              {chartData.length} data points · Context data refreshed daily · Not financial advice
            </div>
          </div>
        )}

        {/* Battle Stats removed */}

        {/* Disclaimer */}
        <div style={{ textAlign: "center", color: "#5a4a30", fontSize: 10, marginTop: 24, borderTop: "1px solid #221e16", paddingTop: 16 }}>
          Data: DeFiLlama • Not financial advice • {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}



