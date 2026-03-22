import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Brand colors from DeFiLlama logo backgrounds ────────────────────────────
const PROTOCOL_BRAND_COLORS = {
  // ── Prediction Markets ─────────────────────────────────────────────────
  "polymarket":      "#0072F5",  // Polymarket — bright blue
  "kalshi":          "#00C896",  // Kalshi — teal/green
  "azuro":           "#5B4FE9",  // Azuro — purple
  "overtime-markets": "#F97316", // Overtime — orange
  "parcl":           "#22D3AA",  // Parcl — mint
  "opinion-rain":    "#0EA5E9",  // Opinion Rain — sky blue
  "predict-fun":     "#F59E0B",  // Predict Fun — amber
  // ── DEX ──────────────────────────────────────────────────────────────────
  "uniswap":        "#FF007A",  // Uniswap — iconic hot pink
  "curve-finance":  "#F5D100",  // Curve — golden yellow wavy-curve logo
  "curve-dex":      "#F5D100",
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
  "solfi":          "#9945FF",  // SolFi — Solana purple
  "tristero":       "#F97316",  // Tristero — orange
  "b402":           "#2563EB",  // b402 — blue
  "opinion":        "#8B5CF6",  // Opinion (BSC) — purple
  "four.meme":      "#22C55E",  // four.meme — meme-launch green
  "kumbaya":        "#E879F9",  // Kumbaya (MegaETH) — fuchsia
  "prism-dex":      "#38BDF8",  // Prism DEX — sky blue
  "sectorone-dlmm": "#34D399",  // SectorOne DLMM — emerald
  "currentx-v3":    "#FB923C",  // CurrentX V3 — orange
  "warpx-v3":       "#A78BFA",  // WarpX V3 — lavender
  "thena":          "#FF3CBF",  // THENA — hot pink
  "biswap":         "#F59E0B",  // Biswap — amber
  // ── Lending ──────────────────────────────────────────────────────────────
  "aave":           "#7c3aed",  // Aave — vivid violet
  "compound":       "#00D395",  // Compound — green
  "compound-v2":    "#00D395",
  "compound-v3":    "#00D395",
  "morpho":         "#006eff",  // Morpho — deep saturated blue
  "spark":          "#E95B2E",  // Spark — orange flame (SparkDAO)
  "kamino":         "#1e6eb5",  // Kamino — mid-blue (between deep navy and icy accent)
  "kamino-lend":    "#1e6eb5",
  "jupiter-lend":   "#39cdd1",  // Jupiter — teal (sampled from logo)
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
  // ── Lending variant slugs (versioned / chain-specific) ───────────────────
  "aave-v3":          "#7c3aed",  // Aave V3 → Aave violet
  "sparklend":        "#E95B2E",  // SparkLend → Spark orange
  "morpho-v1":        "#006eff",  // Morpho V1 → Morpho blue
  "fluid-lending":    "#4C8FFF",  // Fluid Lending → Fluid blue
  "fluid-v2":         "#4C8FFF",
  "euler-v2":         "#E84040",  // Euler V2 → Euler red
  "seamless-v2":      "#00E5BE",  // Seamless V2 → Seamless teal
  "moonwell-lending": "#A855F7",  // Moonwell Lending → purple moon
  "drift-trade":      "#FF6B4A",  // Drift Trade → Drift orange-red
  "marginfi-lending": "#B45BFF",  // MarginFi Lending → vivid purple
  "lista-lending":    "#00A97C",  // Lista DAO — branded teal-green
  "loopscale":        "#7C3AED",  // Loopscale — purple
  "project-0":        "#22C5A0",  // Project 0 — teal
  "save":             "#2563EB",  // Save — blue
  "avon-megavault":   "#8B5CF6",  // Avon MegaVault — purple
  "canonic":          "#06B6D4",  // Canonic — cyan
  "quantus-lend":     "#10B981",  // Quantus Lend — green
  // ── Aggregators ───────────────────────────────────────────────────────────
  "kyberswap-aggregator": "#31CB9E",  // KyberSwap — green
  "jupiter-aggregator":   "#00BFA5",  // Jupiter Aggregator — teal
  "cowswap":              "#FF3B7F",  // CoWSwap — magenta
  "okx-swap":             "#E8E8E8",  // OKX — silver white
  "odos":                 "#4B5EFC",  // ODOS — indigo blue
  "paraswap":             "#44D7B6",  // Velora/ParaSwap — teal
  "openocean":            "#FF6E00",  // OpenOcean — orange
  "1inch":                "#D82122",  // 1inch — red
  // ── Launchpads ────────────────────────────────────────────────────────────
  "pump.fun":             "#79E600",  // pump.fun — neon green
  "pinksale":             "#FF69B4",  // PinkSale — hot pink
  "sunpump":              "#FF8C00",  // SunPump — orange
  "virtuals-protocol":    "#6B7FD7",  // Virtuals Protocol — blue-purple
  "believe":              "#F59E0B",  // Believe — amber
  // ── Data Availability ─────────────────────────────────────────────────────
  "eigenda":  "#A855F7",  // EigenDA — purple
  "celestia": "#7B2DFF",  // Celestia — deep purple brand
  "avail":    "#14B8A6",  // Avail — teal
  "dac":      "#94A3B8",  // Data Availability Committees — slate
  "customda": "#64748B",  // Custom DA — dark slate
  "espresso": "#B45309",  // Espresso — coffee brown
  // ── Perps ─────────────────────────────────────────────────────────────────
  "hyperliquid":                "#00E3AB",  // Hyperliquid — bright seafoam green
  "hyperliquid-perps":          "#00E3AB",
  "gmx":                        "#1FCAC5",  // GMX — teal
  "gmx-v2-perps":               "#1FCAC5",
  "gains-network":              "#00B171",  // Gains Network — signature green
  "aster":                      "#FF6B35",  // Aster — orange
  "aster-perps":                "#FF6B35",
  "edgex":                      "#06B6D4",  // edgeX — cyan
  "edgex-perps":                "#06B6D4",
  "lighter":                    "#6366F1",  // Lighter — indigo
  "lighter-perps":              "#6366F1",
  "lighter-v2":                 "#6366F1",
  "jupiter-perpetual-exchange": "#39cdd1",  // Jupiter Perps — teal (sampled from logo)
  "grvt":                       "#C084FC",  // GRVT — purple
  "grvt-perps":                 "#C084FC",
  "tradexyz":                   "#F472B6",  // tradeXYZ — pink
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
  "jupiter-staked-sol":      "#39cdd1",  // JupSOL — teal (sampled from logo)
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
  "MegaETH":   "#dfd9d9",
  "Monad":     "#836EF9",
  // ── Lowercase chain aliases ──────────────────────────────────────────────
  "ethereum":  "#627EEA",
  "near":      "#00C08B",  // NEAR — branded teal-green
  // ── TCG / Physical TCG ─────────────────────────────────────────────────────
  "courtyard":       "#C99D30",  // Courtyard — premium gold
  "collector-crypt": "#7C3AED",  // Collector Crypt — deep purple
  "chapool":         "#EF4444",  // Chapool — red (Chinese platform)
  "phygitals":       "#3B82F6",  // Phygitals — blue/tech
  "emporium":        "#10B981",  // Emporium — emerald
  "collex":          "#EC4899",  // Collex — pink
  // ── RWA ──────────────────────────────────────────────────────────────────────
  "tether-gold":         "#F5D100",  // Tether Gold — gold
  "blackrock-buidl":     "#1E3A5F",  // BlackRock BUIDL — dark navy
  "ondo-yield-assets":   "#1A6CF4",  // Ondo Finance — blue
  "centrifuge-protocol": "#E87C35",  // Centrifuge — orange
  "superstate-ustb":     "#6366F1",  // Superstate — indigo
  "spiko":               "#0EA5E9",  // Spiko — sky blue
  "anemoy-capital":      "#14B8A6",  // Anemoy — teal
  // ── ETF Products ─────────────────────────────────────────────────────────────
  "IBIT": "#000000",   // BlackRock iShares Bitcoin — black
  "FBTC": "#417632",   // Fidelity Bitcoin — green
  "GBTC": "#5B6770",   // Grayscale Bitcoin Trust — gray
  "ETHA": "#1E3A5F",   // BlackRock iShares Ethereum — navy
  "BTC":  "#9B9B9B",   // Grayscale Bitcoin Mini Trust — silver
};

const FALLBACK_COLORS = [
  "#f0a020","#06b6d4","#f59e0b","#10b981","#ef4444",
  "#3b82f6","#f97316","#14b8a6","#ec4899","#84cc16",
];

// ─── Stablecoin logo fallbacks (used when API returns null) ──────────────────
const STABLECOIN_LOGOS = {
  "tether":            "https://coin-images.coingecko.com/coins/images/325/large/Tether.png",
  "usd-coin":          "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png",
  "dai":               "https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  "ethena-usd":        "https://coin-images.coingecko.com/coins/images/33613/large/usde.png",
  "first-digital-usd": "https://coin-images.coingecko.com/coins/images/31079/large/FDUSD_icon_black.png",
  "frax":              "https://coin-images.coingecko.com/coins/images/13422/large/LFRAX.png",
  "paypal-usd":        "https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Token_Logo_2x.png",
};

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
  volume:            { arena: "Daily Volume Market Share",          valueLabel: "Daily Vol" },
  perpsVolume:       { arena: "Perps Volume Market Share",           valueLabel: "Volume" },
  tvl:               { arena: "TVL Market Share",                    valueLabel: "TVL" },
  fees:              { arena: "Daily Fees Market Share",             valueLabel: "Daily Fees" },
  borrowed:          { arena: "Active Loans Market Share",           valueLabel: "Active Loans" },
  openInterest:      { arena: "Open Interest Market Share",          valueLabel: "Open Interest" },
  stablecoin:        { arena: "Stablecoin Market Cap Share",         valueLabel: "Mkt Cap" },
  chainTvl:          { arena: "Chain TVL Market Share",              valueLabel: "TVL" },
  chainVolume:       { arena: "Chain DEX Volume Market Share",       valueLabel: "Daily Vol" },
  chainRevenue:      { arena: "Chain Daily Revenue Share",           valueLabel: "Revenue" },
  chainStables:      { arena: "Chain Stablecoin Supply Share",       valueLabel: "Stbl Supply" },
  aggregatorVolume:  { arena: "Aggregator Volume Market Share",         valueLabel: "Volume" },
  daL2beat:          { arena: "DA Layer TVL Secured",                        valueLabel: "TVL Secured" },
  daDataPosted:      { arena: "DA Layer Data Posted (Daily)",               valueLabel: "Data Posted" },
  treasury:          { arena: "Onchain Capital TVL Market Share",          valueLabel: "TVL" },
  etf:               { arena: "ETF AUM Market Share",                      valueLabel: "AUM" },
  dat:               { arena: "Digital Asset Treasury Share",              valueLabel: "Portfolio" },
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
    defaultSlugs: ["hyperliquid-perps", "edgex-perps", "aster-perps", "lighter-perps", "grvt-perps"],
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
  "Consumer": {
    label: "Consumer",
    dataType: "volume",
    rivalries: [],
    defaultSlugs: ["polymarket", "kalshi", "azuro", "overtime-markets", "parcl", "opinion-rain", "predict-fun"],
  },
  "Launchpads": {
    label: "Launchpads",
    dataType: "fees",
    rivalries: [],
    defaultSlugs: ["pump.fun", "pinksale", "virtuals-protocol", "sunpump", "four.meme", "believe"],
  },
  "TCG": {
    label: "TCG",
    dataType: "fees",
    rivalries: [],
    defaultSlugs: ["courtyard", "collector-crypt", "chapool", "phygitals", "emporium"],
  },
  "RWA": {
    label: "RWA",
    dataType: "tvl",
    rivalries: [],
    defaultSlugs: ["tether-gold", "blackrock-buidl", "ondo-yield-assets", "centrifuge-protocol", "superstate-ustb"],
  },
  "ETF": {
    label: "ETF",
    dataType: "etf",
    rivalries: [],
    defaultSlugs: ["IBIT", "FBTC", "GBTC", "ETHA", "BTC"],
  },
  "DAT": {
    label: "DAT",
    dataType: "dat",
    rivalries: [],
    defaultSlugs: [],  // dynamically loaded from /treasuries
  },
  Aggregators: {
    label: "Aggregators",
    dataType: "aggregatorVolume",
    rivalries: [],
    defaultSlugs: ["kyberswap-aggregator", "jupiter-aggregator", "cowswap", "okx-swap", "odos"],
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
  Monad:    "https://icons.llamao.fi/icons/chains/rsz_monad.jpg",
};

// ─── Top 5 Lending protocols per chain — by TVL (DeFiLlama API) ────────────
const LENDING_CHAINS = {
  Ethereum: {
    color: "#627EEA",
    slugs: ["aave-v3", "sparklend", "morpho-v1", "compound-v3", "fluid-lending"],
  },
  Solana: {
    color: "#9945FF",
    slugs: ["maple", "kamino-lend", "jupiter-lend", "project-0", "loopscale"],
  },
  Base: {
    color: "#0052FF",
    slugs: ["aave-v3", "morpho-v1", "compound-v3", "fluid-lending", "euler-v2"],
  },
  Arbitrum: {
    color: "#12AAFF",
    slugs: ["aave-v3", "fluid-lending", "spark", "morpho-v1", "compound-v3"],
  },
  BSC: {
    color: "#F3BA2F",
    slugs: ["venus", "lista-lending", "aave-v3", "alpaca-finance", "tranchess"],
  },
  MegaETH: {
    color: "#dfd9d9",
    slugs: ["aave-v3", "avon-megavault", "canonic", "quantus-lend"],
  },
};

// ─── Top 5 DEXs per chain — aggregated parent protocols (by 30d volume) ──────
const DEX_CHAINS = {
  Ethereum: {
    color: "#627EEA",
    slugs: ["uniswap", "fluid", "balancer", "curve-finance", "native"],
  },
  Solana: {
    color: "#9945FF",
    slugs: ["raydium", "pump", "orca", "meteora", "solfi"],
  },
  Base: {
    color: "#0052FF",
    slugs: ["aerodrome", "uniswap", "pancakeswap", "tristero", "b402"],
  },
  Arbitrum: {
    color: "#12AAFF",
    slugs: ["uniswap", "pancakeswap", "fluid", "camelot", "native"],
  },
  BSC: {
    color: "#F3BA2F",
    slugs: ["pancakeswap", "uniswap", "opinion", "four.meme", "native"],
  },
  MegaETH: {
    color: "#dfd9d9",
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
  Solana: [
    { slug: "raydium",       name: "Raydium" },
    { slug: "pump",          name: "Pump.fun" },
    { slug: "orca",          name: "Orca" },
    { slug: "meteora",       name: "Meteora" },
    { slug: "solfi",         name: "SolFi" },
    { slug: "lifinity",      name: "Lifinity" },
    { slug: "openbook-dex",  name: "OpenBook" },
  ],
  Base: [
    { slug: "aerodrome",     name: "Aerodrome" },
    { slug: "uniswap",       name: "Uniswap" },
    { slug: "pancakeswap",   name: "PancakeSwap" },
    { slug: "tristero",      name: "Tristero" },
    { slug: "b402",          name: "b402" },
    { slug: "balancer",      name: "Balancer" },
    { slug: "sushiswap",     name: "SushiSwap" },
    { slug: "curve-finance", name: "Curve Finance" },
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
    { slug: "opinion",       name: "OPINION" },
    { slug: "four.meme",     name: "four.meme" },
    { slug: "native",        name: "Native" },
    { slug: "thena",         name: "THENA" },
    { slug: "biswap",        name: "Biswap" },
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
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "sparklend",       name: "SparkLend" },
    { slug: "morpho-v1",       name: "Morpho V1" },
    { slug: "compound-v3",     name: "Compound V3" },
    { slug: "fluid-lending",   name: "Fluid Lending" },
    { slug: "euler-v2",        name: "Euler V2" },
    { slug: "maple",           name: "Maple" },
    { slug: "dolomite",        name: "Dolomite" },
  ],
  Solana: [
    { slug: "maple",           name: "Maple" },
    { slug: "kamino-lend",     name: "Kamino Lend" },
    { slug: "jupiter-lend",    name: "Jupiter Lend" },
    { slug: "project-0",       name: "Project 0" },
    { slug: "loopscale",       name: "Loopscale" },
    { slug: "save",            name: "Save" },
    { slug: "marginfi-lending", name: "marginfi Lending" },
  ],
  Base: [
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "morpho-v1",       name: "Morpho V1" },
    { slug: "compound-v3",     name: "Compound V3" },
    { slug: "fluid-lending",   name: "Fluid Lending" },
    { slug: "euler-v2",        name: "Euler V2" },
    { slug: "seamless-v2",     name: "Seamless V2" },
    { slug: "moonwell-lending", name: "Moonwell Lending" },
  ],
  Arbitrum: [
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "fluid-lending",   name: "Fluid Lending" },
    { slug: "spark",           name: "Spark" },
    { slug: "morpho-v1",       name: "Morpho V1" },
    { slug: "compound-v3",     name: "Compound V3" },
    { slug: "dolomite",        name: "Dolomite" },
    { slug: "euler-v2",        name: "Euler V2" },
  ],
  BSC: [
    { slug: "venus",           name: "Venus" },
    { slug: "lista-lending",   name: "Lista Lending" },
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "alpaca-finance",  name: "Alpaca Finance" },
    { slug: "tranchess",       name: "Tranchess" },
  ],
  MegaETH: [
    { slug: "aave-v3",         name: "Aave V3" },
    { slug: "avon-megavault",  name: "Avon MegaVault" },
    { slug: "canonic",         name: "Canonic" },
    { slug: "quantus-lend",    name: "Quantus Lend" },
  ],
};

const SEGMENT_PROTOCOLS = {
  "Consumer": [
    { slug: "polymarket",       name: "Polymarket" },
    { slug: "kalshi",           name: "Kalshi" },
    { slug: "azuro",            name: "Azuro" },
    { slug: "overtime-markets", name: "Overtime Markets" },
    { slug: "parcl",            name: "Parcl" },
    { slug: "opinion-rain",     name: "Opinion Rain" },
    { slug: "predict-fun",      name: "Predict Fun" },
    { slug: "limitless-exchange",name: "Limitless" },
    { slug: "gnosis-conditional-tokens", name: "Gnosis" },
  ],
  "Launchpads": [
    { slug: "pump.fun",          name: "pump.fun" },
    { slug: "pinksale",          name: "PinkSale" },
    { slug: "virtuals-protocol", name: "Virtuals" },
    { slug: "sunpump",           name: "SunPump" },
    { slug: "four.meme",         name: "four.meme" },
    { slug: "believe",           name: "Believe" },
  ],
  Perps: [
    { slug: "hyperliquid-perps",          name: "Hyperliquid" },
    { slug: "edgex-perps",                name: "edgeX" },
    { slug: "aster-perps",                name: "Aster" },
    { slug: "lighter-perps",              name: "Lighter" },
    { slug: "grvt-perps",                 name: "GRVT" },
    { slug: "tradexyz",                   name: "tradeXYZ" },
    { slug: "gmx-v2-perps",               name: "GMX V2" },
    { slug: "drift-trade",                name: "Drift" },
    { slug: "dydx",                       name: "dYdX" },
    { slug: "vertex-protocol",            name: "Vertex" },
    { slug: "jupiter-perpetual-exchange", name: "Jupiter Perps" },
  ],
  Aggregators: [
    { slug: "kyberswap-aggregator", name: "KyberSwap" },
    { slug: "jupiter-aggregator",   name: "Jupiter" },
    { slug: "cowswap",              name: "CoWSwap" },
    { slug: "okx-swap",             name: "OKX Swap" },
    { slug: "odos",                 name: "ODOS" },
    { slug: "paraswap",             name: "Velora" },
    { slug: "openocean",            name: "OpenOcean" },
    { slug: "1inch",                name: "1inch" },
  ],
  "TCG": [
    { slug: "courtyard",       name: "Courtyard" },
    { slug: "collector-crypt", name: "Collector Crypt" },
    { slug: "chapool",         name: "Chapool" },
    { slug: "phygitals",       name: "Phygitals" },
    { slug: "emporium",        name: "Emporium" },
  ],
  "RWA": [
    { slug: "tether-gold",         name: "Tether Gold" },
    { slug: "blackrock-buidl",     name: "BlackRock BUIDL" },
    { slug: "ondo-yield-assets",   name: "Ondo" },
    { slug: "centrifuge-protocol", name: "Centrifuge" },
    { slug: "superstate-ustb",     name: "Superstate" },
    { slug: "spiko",               name: "Spiko" },
    { slug: "anemoy-capital",      name: "Anemoy" },
  ],
  "ETF": [
    { slug: "IBIT", name: "iShares Bitcoin" },
    { slug: "FBTC", name: "Fidelity Bitcoin" },
    { slug: "GBTC", name: "Grayscale Bitcoin" },
    { slug: "ETHA", name: "iShares Ethereum" },
    { slug: "BTC",  name: "Grayscale Mini" },
  ],
  "DAT": [],  // dynamically loaded from /treasuries
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
function formatBytes(n) {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} TB`;
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)} GB`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)} MB`;
  return `${n.toFixed(0)} B`;
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

// ─── Digital Asset Treasuries cache ─────────────────────────────────────────
let _treasuriesCache = null;
let _treasuriesCacheTs = 0;
async function fetchAllTreasuries() {
  if (_treasuriesCache && Date.now() - _treasuriesCacheTs < 3600000) return _treasuriesCache;
  const r = await fetch("https://api.llama.fi/treasuries");
  if (!r.ok) throw new Error("Treasuries API unreachable");
  _treasuriesCache = await r.json();
  _treasuriesCacheTs = Date.now();
  return _treasuriesCache;
}

// ─── ETF data cache (etfs.llama.fi) ─────────────────────────────────────────
let _etfCache = null;
let _etfCacheTs = 0;
async function fetchETFData() {
  if (_etfCache && Date.now() - _etfCacheTs < 3600000) return _etfCache;
  const [snapshot, flows] = await Promise.all([
    fetch("https://etfs.llama.fi/snapshot").then(r => { if (!r.ok) throw new Error("ETF API unavailable"); return r.json(); }),
    fetch("https://etfs.llama.fi/flows").then(r => r.ok ? r.json() : []),
  ]);
  _etfCache = { snapshot, flows };
  _etfCacheTs = Date.now();
  return _etfCache;
}

// ─── BTC price history cache (CoinGecko, for DAT portfolio scaling) ───────────
let _btcPriceCache = null;
let _btcPriceCacheTs = 0;
async function fetchBTCPriceHistory() {
  if (_btcPriceCache && Date.now() - _btcPriceCacheTs < 3600000) return _btcPriceCache;
  const r = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily");
  if (!r.ok) throw new Error("BTC price history unavailable");
  const d = await r.json();
  _btcPriceCache = d.prices ?? [];
  _btcPriceCacheTs = Date.now();
  return _btcPriceCache;
}

// ─── L2beat DA adoption cache ─────────────────────────────────────────────────
let _l2beatDACache = null;
let _l2beatDACacheTs = 0;
async function fetchL2beatDA() {
  if (_l2beatDACache && (Date.now() - _l2beatDACacheTs < 600000)) return _l2beatDACache;
  const r = await fetch("https://l2beat.com/api/scaling/summary");
  if (!r.ok) throw new Error("L2beat unreachable");
  const d = await r.json();
  const tvs = {}, count = {};
  Object.values(d.projects).forEach(p => {
    const daBadges = (p.badges || []).filter(b => b.type === "DA");
    const tvl = p.tvs?.breakdown?.total || 0;
    daBadges.forEach(b => {
      const slug = (b.action?.type === "publicDaHighlight" ? b.action.slug : null) || b.id.toLowerCase();
      tvs[slug] = (tvs[slug] || 0) + tvl;
      count[slug] = (count[slug] || 0) + 1;
    });
  });
  _l2beatDACache = { tvs, count };
  _l2beatDACacheTs = Date.now();
  return _l2beatDACache;
}

const DA_META = {
  ethereum: { name: "Ethereum L1", logo: "https://icons.llama.fi/ethereum.jpg",                                                                    color: "#627EEA" },
  eigenda:  { name: "EigenDA",     logo: "https://coin-images.coingecko.com/coins/images/37441/large/eigencloud.jpg",                color: "#6C4ADB" },
  celestia: { name: "Celestia",   logo: "https://coin-images.coingecko.com/coins/images/31967/large/tia.jpg",                       color: "#7B2FBE" },
  avail:    { name: "Avail",       logo: "https://coin-images.coingecko.com/coins/images/37372/large/avail-logo-200-200.png",        color: "#30CF9A" },
  near:     { name: "NEAR DA",      logo: "https://icons.llama.fi/near.jpg",                                                                         color: "#00C08B" },
  dac:      { name: "DAC",         color: "#F0A500",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23F0A500'/%3E%3Cpath d='M18 7l-9 4v7c0 5 3.4 9.7 9 11.3 5.6-1.6 9-6.3 9-11.3v-7z' fill='rgba(0,0,0,0.3)'/%3E%3Ccircle cx='14' cy='17' r='2' fill='white'/%3E%3Ccircle cx='22' cy='17' r='2' fill='white'/%3E%3Ccircle cx='18' cy='23' r='2' fill='white'/%3E%3C/svg%3E" },
  customda: { name: "Custom DA",   color: "#64748B",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%2364748B'/%3E%3Ccircle cx='11' cy='11' r='2.5' fill='white'/%3E%3Ccircle cx='25' cy='11' r='2.5' fill='white'/%3E%3Ccircle cx='11' cy='25' r='2.5' fill='white'/%3E%3Ccircle cx='25' cy='25' r='2.5' fill='white'/%3E%3Ccircle cx='18' cy='18' r='2.5' fill='white'/%3E%3Cline x1='11' y1='11' x2='18' y2='18' stroke='rgba(255,255,255,0.5)' stroke-width='1.2'/%3E%3Cline x1='25' y1='11' x2='18' y2='18' stroke='rgba(255,255,255,0.5)' stroke-width='1.2'/%3E%3Cline x1='11' y1='25' x2='18' y2='18' stroke='rgba(255,255,255,0.5)' stroke-width='1.2'/%3E%3Cline x1='25' y1='25' x2='18' y2='18' stroke='rgba(255,255,255,0.5)' stroke-width='1.2'/%3E%3C/svg%3E" },
  espresso: { name: "Espresso",    logo: "https://icons.llama.fi/espresso-sequencer.jpg",   color: "#FF6B35" },
};

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
      "grvt-perps":  null,  // no public dexs adapter
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
    // Use DeFiLlama open-interest summary endpoint (works for perps and prediction markets)
    const oiSlug = slug.endsWith("-perps") ? slug.slice(0, -6) : slug;
    const res = await fetch(`https://api.llama.fi/summary/open-interest/${oiSlug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
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
  if (dataType === "aggregatorVolume") {
    const res = await fetch(`https://api.llama.fi/summary/aggregators/${slug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data");
    return { series, name: d.name, logo: d.logo };
  }
  if (dataType === "daL2beat") {
    // Map each DA slug to the best available historical TVL source
    const DA_TVL_SOURCES = {
      ethereum: { type: "chain",     id: "Ethereum"   },
      // EigenDA: L2beat TVS = TVL of all L2s secured by EigenDA (367 daily pts, 1y range)
      eigenda:  { type: "l2beat",    id: "eigenda"    },
      near:     { type: "chain",     id: "Near"       },
      // Celestia has 0 DeFi TVL on-chain; use CoinGecko market cap as economic-security proxy
      celestia: { type: "coingecko", id: "celestia"   },
    };
    const src = DA_TVL_SOURCES[slug];
    if (!src) throw new Error("No historical TVL data for this DA layer");
    const daMeta = DA_META[slug] || { name: slug, logo: null };
    let series;
    if (src.type === "chain") {
      const res = await fetch(`https://api.llama.fi/v2/historicalChainTvl/${encodeURIComponent(src.id)}`);
      if (!res.ok) throw new Error("Not found");
      const d = await res.json();
      series = d
        .map(x => ({ date: Number(x.date), value: x.tvl ?? 0 }))
        .filter(x => x.date >= cutoff && x.date < ceiling);
    } else if (src.type === "l2beat") {
      // L2beat TVS filtered by DA layer — external column = total L2 TVL secured by this DA
      const res = await fetch(`https://l2beat.com/api/scaling/tvs?da=${src.id}&range=1y`, {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json", "Referer": "https://l2beat.com/" },
      });
      if (!res.ok) throw new Error("L2beat unavailable");
      const d = await res.json();
      const chart = d.data?.chart;
      if (!chart?.data?.length) throw new Error("No L2beat TVS data");
      // types: [timestamp, native, canonical, external, ethPrice] — external is broadest TVS
      series = chart.data
        .map(([ts, , , external]) => ({ date: Number(ts), value: external ?? 0 }))
        .filter(x => x.date >= cutoff && x.date < ceiling);
    } else if (src.type === "protocol") {
      const res = await fetch(`https://api.llama.fi/protocol/${src.id}`);
      if (!res.ok) throw new Error("Not found");
      const d = await res.json();
      series = (d.tvl || [])
        .filter(x => x.date >= cutoff && x.date < ceiling)
        .map(x => ({ date: x.date, value: x.totalLiquidityUSD ?? 0 }));
    } else {
      // CoinGecko market cap — free API supports up to 365 days
      const days = Math.min(365, Math.ceil((getStartOfTodayUTC() - cutoff) / 86400) + 2);
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${src.id}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
      if (!res.ok) throw new Error("CoinGecko unavailable");
      const d = await res.json();
      series = (d.market_caps || [])
        .map(([ts, v]) => ({ date: Math.floor(ts / 1000), value: v ?? 0 }))
        .filter(x => x.date >= cutoff && x.date < ceiling);
    }
    if (!series || !series.length) throw new Error("No DA TVL data in range");
    return { series, name: daMeta.name, logo: daMeta.logo };
  }
  if (dataType === "daDataPosted") {
    // DeFiLlama fees = proxy for DA layer usage/activity (all sources, CORS-friendly)
    const DA_FEES_SLUGS = {
      celestia: "celestia",
      near:     "near",
      ethereum: "ethereum",
      eigenda:  "eigenlayer", // EigenLayer/EigenCloud fees — best available proxy for EigenDA activity
    };
    const feesSlug = DA_FEES_SLUGS[slug];
    if (!feesSlug) throw new Error("No public data-posted history available for this DA layer");
    const res = await fetch(`https://api.llama.fi/summary/fees/${feesSlug}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const daMeta = DA_META[slug] || { name: d.name, logo: d.logo };
    const series = (d.totalDataChart || [])
      .map(([ts, v]) => ({ date: Number(ts), value: Number(v) || 0 }))
      .filter(x => x.date >= cutoff && x.date < ceiling);
    if (!series.length) throw new Error("No data in range");
    return { series, name: daMeta.name, logo: daMeta.logo };
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
    return { series, name: coin.name, logo: STABLECOIN_LOGOS[slug] || coin.logo };
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
  if (dataType === "chainStables") {
    const res = await fetch(`https://stablecoins.llama.fi/stablecoincharts/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Not found");
    const d = await res.json();
    const series = (Array.isArray(d) ? d : [])
      .map(x => ({ date: Number(x.date), value: Object.values(x.totalCirculating || {}).reduce((a, b) => a + (Number(b) || 0), 0) }))
      .filter(x => x.date >= cutoff && x.date < ceiling && x.value > 0);
    if (!series.length) throw new Error("No data");
    return { series, name: slug, logo: CHAIN_LOGOS[slug] ?? null };
  }
  if (dataType === "etf") {
    const { snapshot, flows } = await fetchETFData();
    const etf = snapshot.find(x => x.ticker === slug);
    if (!etf) throw new Error("ETF ticker not found: " + slug);
    const asset = etf.asset;
    const totalAssetAum = snapshot.filter(x => x.asset === asset).reduce((s, x) => s + (x.aum || 0), 0);
    const etfShare = totalAssetAum > 0 ? etf.aum / totalAssetAum : 0;
    const assetFlows = flows
      .filter(f => f.gecko_id === asset)
      .map(f => ({ ts: Math.floor(new Date(f.day + "T00:00:00Z").getTime() / 1000), flow: f.total_flow_usd || 0 }))
      .sort((a, b) => a.ts - b.ts);
    const series = [];
    let runningTotal = totalAssetAum;
    for (let i = assetFlows.length - 1; i >= 0; i--) {
      const { ts, flow } = assetFlows[i];
      runningTotal -= flow;
      if (ts >= cutoff && ts < ceiling) series.push({ date: ts, value: Math.max(0, runningTotal) * etfShare });
    }
    series.push({ date: ceiling - 86400, value: etf.aum });
    series.sort((a, b) => a.date - b.date);
    const filtered = series.filter(x => x.date >= cutoff && x.date < ceiling);
    if (!filtered.length) throw new Error("No ETF data in range for " + slug);
    return { series: filtered, name: slug + (etf.issuer ? " (" + etf.issuer + ")" : ""), logo: null };
  }
  if (dataType === "dat") {
    const all = await fetchAllTreasuries();
    const p = all.find(x => x.slug === slug);
    if (!p || typeof p.tvl !== "number" || p.tvl < 1e6) throw new Error("No treasury data for " + slug);
    const currentTvl = p.tvl;
    const btcPrices = await fetchBTCPriceHistory();
    if (!btcPrices?.length) return { series: [{ date: ceiling - 86400, value: currentTvl }], name: p.name, logo: p.logo ?? null };
    const latestBtcPrice = btcPrices[btcPrices.length - 1][1];
    const series = btcPrices
      .map(([ts_ms, price]) => ({ date: Math.floor(ts_ms / 1000), value: currentTvl * (price / latestBtcPrice) }))
      .filter(x => x.date >= cutoff && x.date < ceiling && x.value > 0);
    if (!series.length) throw new Error("No DAT data in range for " + slug);
    return { series, name: p.name, logo: p.logo ?? null };
  }
  if (dataType === "treasury") {
    // treasury dataType is deprecated — fall through to tvl
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
      background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6, padding: "12px 16px", minWidth: 200,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 8 }}>{label}</div>
      {payload.map((entry) => {
        const slug = entry.dataKey;
        const pct = entry.value;
        const rawEntry = rawDataBySlug?.[slug]?.find?.(d => formatDate(d.date) === label);
        const abs = rawEntry?.value;
        return (
          <div key={slug} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, flex: 1 }}>
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
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {DT[dataType]?.valueLabel} share
      </div>
    </div>
  );
}

// ─── Fighter Card ─────────────────────────────────────────────────────────────
function FighterCard({ protocol, color, isLeading, chartData, dataType, onClick }) {
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

  return (
    <div
      onClick={onClick}
      style={{
        background: "#0e0e0e",
        border: `1px solid ${isLeading ? color + "cc" : "rgba(255,255,255,0.15)"}`,
        borderRadius: 7, padding: "7px 10px",
        flex: "1 1 100px", minWidth: 90,
        position: "relative", transition: "all 0.3s ease",
        boxShadow: isLeading ? `0 4px 20px ${color}44` : "none",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {isLeading && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,255,255,0.08)", color: "#f0f0f0", fontSize: 10,
          fontWeight: 700, padding: "2px 8px", borderRadius: 99, letterSpacing: 1,
          border: "1px solid rgba(255,255,255,0.2)",
        }}>LEADING</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <img
            src={protocol.logo || STABLECOIN_LOGOS[protocol.slug] || `https://icons.llama.fi/${protocol.slug}.png`}
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
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginBottom: 5 }}>market share</div>

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

      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 2 }}>
        Led <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>{dominantDays}d</span>
      </div>
      {protocol.currentValue != null && (
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 1 }}>
          <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{formatUSD(protocol.currentValue)}</span>
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
      background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "16px 20px", marginTop: 16,
    }}>
      <StatPill icon="🏆" label="Leading Now"
        value={leader.name || slugToDisplay(leader.slug)}
        sub={`${leader.v?.toFixed(1)}% share`}
        color={colors[idxOf(leader.slug)] || "rgba(255,255,255,0.5)"} />
      {biggestSwing && (
        <StatPill icon="⚡" label="Biggest Swing"
          value={`${biggestSwing.name || slugToDisplay(biggestSwing.slug)} on ${biggestSwing.label}`}
          sub={`${biggestSwing.diff > 0 ? "+" : ""}${biggestSwing.diff.toFixed(1)}%`}
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
              background: "#0e0e0e", border: `1px solid ${color}33`,
              borderRadius: 5, padding: "5px 11px",
            }}>
              <span style={{ color, fontSize: 12, fontWeight: 700 }}>
                {p.name || slugToDisplay(p.slug)}
              </span>
              <span style={{ fontSize: 16, color: p.trend > 0.5 ? "#10b981" : p.trend < -0.5 ? "#ef4444" : "rgba(255,255,255,0.55)" }}>
                {p.trend > 0.5 ? "↑" : p.trend < -0.5 ? "↓" : "→"}
              </span>
              <span style={{ fontSize: 11, color: p.trend > 0.5 ? "#10b981" : p.trend < -0.5 ? "#ef4444" : "rgba(255,255,255,0.55)" }}>
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
    <div style={{ background: "#0e0e0e", border: `1px solid ${color}33`, borderRadius: 7, padding: "10px 14px", minWidth: 160 }}>
      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginBottom: 2 }}>{icon} {label}</div>
      <div style={{ color, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{sub}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = 20, radius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg,#111 25%,#1c1c1c 50%,#111 75%)",
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


// ─── 1v1 Matchups ─────────────────────────────────────────────────────────────
const MATCHUPS = [
  {
    id: "megaeth-monad",
    left:  { slug: "MegaETH", label: "MegaETH", color: getColor("MegaETH", 0) },
    right: { slug: "Monad",   label: "Monad",   color: getColor("Monad",   1) },
    category: "L2 Speed War",
    metrics: [
      { key: "chainTvl",    label: "TVL",       dataType: "chainTvl"    },
      { key: "chainVolume", label: "DEX Volume", dataType: "chainVolume" },
    ],
  },
  {
    id: "hyperliquid-aster",
    left:  { slug: "hyperliquid-perps", label: "Hyperliquid", color: getColor("hyperliquid-perps", 0) },
    right: { slug: "aster-perps",       label: "Aster",       color: getColor("aster-perps",       1) },
    category: "Perps Supremacy",
    metrics: [
      { key: "openInterest", label: "Open Interest", dataType: "openInterest" },
      { key: "perpsVolume",  label: "Volume",         dataType: "perpsVolume"  },
      { key: "fees",         label: "Fees",           dataType: "fees"         },
    ],
  },
  {
    id: "uniswap-fluid",
    left:  { slug: "uniswap", label: "Uniswap", color: getColor("uniswap", 0) },
    right: { slug: "fluid",   label: "Fluid",   color: getColor("fluid",   1) },
    category: "DEX Dominance",
    metrics: [
      { key: "volume", label: "DEX Volume", dataType: "volume" },
    ],
  },
  {
    id: "kamino-jupiter",
    left:  { slug: "kamino-lend",  label: "Kamino",      color: getColor("kamino-lend",  0) },
    right: { slug: "jupiter-lend", label: "JupiterLend", color: getColor("jupiter-lend", 1) },
    category: "Solana Lending",
    metrics: [
      { key: "tvl",      label: "TVL",          dataType: "tvl"      },
      { key: "borrowed", label: "Active Loans", dataType: "borrowed" },
    ],
  },
  {
    id: "aave-morpho",
    left:  { slug: "aave",   label: "Aave",   color: getColor("aave",   0) },
    right: { slug: "morpho", label: "Morpho", color: getColor("morpho", 1) },
    category: "Lending Giants",
    metrics: [
      { key: "tvl",      label: "TVL",          dataType: "tvl"      },
      { key: "borrowed", label: "Active Loans", dataType: "borrowed" },
    ],
  },
  {
    id: "ethereum-solana",
    left:  { slug: "Ethereum", label: "Ethereum", color: getColor("Ethereum", 0) },
    right: { slug: "Solana",   label: "Solana",   color: getColor("Solana",   1) },
    category: "Chain Wars",
    metrics: [
      { key: "chainRevenue", label: "Revenue",           dataType: "chainRevenue" },
      { key: "chainVolume",  label: "DEX Volume",        dataType: "chainVolume"  },
      { key: "chainStables", label: "Stablecoin Supply", dataType: "chainStables" },
      { key: "chainTvl",    label: "TVL",                dataType: "chainTvl"    },
    ],
  },
  {
    id: "polymarket-kalshi",
    left:  { slug: "polymarket", label: "Polymarket", color: getColor("polymarket", 0) },
    right: { slug: "kalshi",     label: "Kalshi",     color: getColor("kalshi",     1) },
    category: "Prediction Wars",
    metrics: [
      { key: "volume",       label: "Volume",        dataType: "volume"       },
      { key: "openInterest", label: "Open Interest", dataType: "openInterest" },
    ],
  },
];

// ─── MatchupBattle: one self-contained battle card ────────────────────────────
function MatchupBattle({ matchup, onViewProtocol }) {
  const [metricData, setMetricData]       = useState({});
  const [metricLoading, setMetricLoading] = useState(() => {
    const init = {};
    matchup.metrics.forEach(m => { init[m.key] = true; });
    return init;
  });
  const [logos, setLogos]                 = useState({});
  const [activeMetricKey, setActiveMetricKey] = useState(matchup.metrics[0]?.key);
  const [timeRange, setTimeRange]         = useState(90);
  const [showBattleAI, setShowBattleAI]   = useState(false);
  const fetchIdRef = useRef(0);
  const savedScrollRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (savedScrollRef.current !== null) {
      window.scrollTo(0, savedScrollRef.current);
      savedScrollRef.current = null;
    }
  }, [showBattleAI]);

  useEffect(() => {
    const fetchId = ++fetchIdRef.current;
    setMetricData({});
    const init = {};
    matchup.metrics.forEach(m => { init[m.key] = true; });
    setMetricLoading(init);
    const cutoff = getTodayTs() - timeRange * 86400;
    const { left, right } = matchup;

    matchup.metrics.forEach(async metric => {
      try {
        const [lr, rr] = await Promise.all([
          fetchSlugData(left.slug,  metric.dataType, cutoff, null).catch(() => null),
          fetchSlugData(right.slug, metric.dataType, cutoff, null).catch(() => null),
        ]);
        if (fetchId !== fetchIdRef.current) return;
        if (lr?.logo) setLogos(p => ({ ...p, [left.slug]:  lr.logo }));
        if (rr?.logo) setLogos(p => ({ ...p, [right.slug]: rr.logo }));
        if (!lr?.series?.length || !rr?.series?.length) {
          setMetricLoading(prev => ({ ...prev, [metric.key]: false }));
          return;
        }
        const allDates = new Set([...lr.series.map(d => d.date), ...rr.series.map(d => d.date)]);
        const dates = [...allDates].filter(d => d >= cutoff).sort((a, b) => a - b);
        const lm = {}, rm = {};
        lr.series.forEach(d => { lm[d.date] = d.value; });
        rr.series.forEach(d => { rm[d.date] = d.value; });
        let ll = null, rl = null;
        const chart = dates.map(ts => {
          if (lm[ts] != null) ll = lm[ts];
          if (rm[ts] != null) rl = rm[ts];
          const lv = ll ?? 0, rv = rl ?? 0, tot = lv + rv;
          if (tot === 0) return null;
          return { label: formatDate(ts), ts, [left.slug]: parseFloat(((lv / tot) * 100).toFixed(2)), [right.slug]: parseFloat(((rv / tot) * 100).toFixed(2)) };
        }).filter(Boolean);
        setMetricData(prev => ({ ...prev, [metric.key]: chart }));
      } catch {}
      finally { if (fetchId === fetchIdRef.current) setMetricLoading(prev => ({ ...prev, [metric.key]: false })); }
    });
  }, [matchup.id, timeRange]);

  // Overall winner from first metric
  const fd = metricData[matchup.metrics[0]?.key] || [];
  const lr = fd[fd.length - 1];
  const lOv = lr?.[matchup.left.slug], rOv = lr?.[matchup.right.slug];
  const overallWinner = lOv != null && rOv != null ? (lOv > rOv ? "left" : lOv < rOv ? "right" : "tie") : null;

  // Active metric data
  const activeMetric = matchup.metrics.find(m => m.key === activeMetricKey) || matchup.metrics[0];
  const data      = metricData[activeMetric?.key] || [];
  const isLoading = metricLoading[activeMetric?.key];
  const last      = data[data.length - 1];
  const lShare    = last?.[matchup.left.slug]  ?? null;
  const rShare    = last?.[matchup.right.slug] ?? null;
  const mw        = lShare != null ? (lShare > rShare ? "left" : lShare < rShare ? "right" : "tie") : null;

  const shareOnX = async () => {
    const text = generateTweetText(matchup, data, activeMetric, lShare, rShare);
    if (!chartRef.current) {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      return;
    }
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#111',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          return;
        }
        // Download screenshot then open X with pre-filled text
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'protocol-wars.png';
        a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => {
          window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        }, 400);
      }, 'image/png');
    } catch (_) {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <>
    <div className="arena-neon-wrap" style={{ borderRadius: 14 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 12, overflow: "hidden" }}>
      {/* ── Fight Banner ── */}
      <div style={{
        position: "relative", overflow: "hidden", marginBottom: 0,
        background: `radial-gradient(ellipse 60% 100% at 0% 50%, ${matchup.left.color}28 0%, transparent 70%), radial-gradient(ellipse 60% 100% at 100% 50%, ${matchup.right.color}28 0%, transparent 70%), #0a0a0a`,
        padding: "8px 20px", flexShrink: 0,
      }}>
        {/* Diagonal slash overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(108deg, transparent 47%, rgba(255,255,255,0.04) 50%, transparent 53%)",
        }} />

        {/* Category pill */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span style={{
            display: "inline-block", fontFamily: "'Orbitron',sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)", padding: "4px 18px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)",
          }}>{matchup.category}</span>
        </div>

        {/* Fighters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* LEFT */}
          <div
            onClick={() => onViewProtocol && onViewProtocol(matchup.left.slug)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, cursor: onViewProtocol ? "pointer" : "default" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {logos[matchup.left.slug] ? (
                <img src={logos[matchup.left.slug]} alt="" style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  border: `2px solid ${matchup.left.color}${overallWinner === "left" ? "cc" : "44"}`,
                  boxShadow: overallWinner === "left" ? `0 0 20px ${matchup.left.color}55` : "none",
                  transition: "box-shadow 0.6s",
                }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: 9, background: matchup.left.color + "22", border: `2px solid ${matchup.left.color}44`, flexShrink: 0 }} />
              )}
              <div>
                <div style={{
                  fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 14, letterSpacing: 1,
                  color: matchup.left.color,
                  textShadow: overallWinner === "left" ? `0 0 20px ${matchup.left.color}88` : "none",
                }}>{matchup.left.label}</div>
                {overallWinner === "left" && (
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: matchup.left.color, marginTop: 2 }}>⚡ DOMINATING</div>
                )}
              </div>
            </div>
          </div>

          {/* VS */}
          <div style={{ flexShrink: 0, textAlign: "center", paddingBottom: 4 }}>
            <div style={{
              fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: 4, lineHeight: 1,
              background: "linear-gradient(180deg, #ffffff 0%, #c0c0c0 60%, #888888 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(255,255,255,0.3)) drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
            }}>VS</div>
          </div>

          {/* RIGHT */}
          <div
            onClick={() => onViewProtocol && onViewProtocol(matchup.right.slug)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, cursor: onViewProtocol ? "pointer" : "default" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexDirection: "row-reverse" }}>
              {logos[matchup.right.slug] ? (
                <img src={logos[matchup.right.slug]} alt="" style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  border: `2px solid ${matchup.right.color}${overallWinner === "right" ? "cc" : "44"}`,
                  boxShadow: overallWinner === "right" ? `0 0 20px ${matchup.right.color}55` : "none",
                  transition: "box-shadow 0.6s",
                }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: 9, background: matchup.right.color + "22", border: `2px solid ${matchup.right.color}44`, flexShrink: 0 }} />
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 14, letterSpacing: 1,
                  color: matchup.right.color,
                  textShadow: overallWinner === "right" ? `0 0 20px ${matchup.right.color}88` : "none",
                }}>{matchup.right.label}</div>
                {overallWinner === "right" && (
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: matchup.right.color, marginTop: 2 }}>DOMINATING ⚡</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric tabs + Timeframe row ── */}
      <div style={{
        display: "flex", flexDirection: "column",
        padding: "10px 16px", background: "#0e0e0e",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        gap: 8, flexShrink: 0,
      }}>
        {/* Row 1: Metric tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {matchup.metrics.map(m => {
            const d = metricData[m.key] || [];
            const lastPt = d[d.length - 1];
            const lPct = lastPt?.[matchup.left.slug] ?? null;
            const rPct = lastPt?.[matchup.right.slug] ?? null;
            const isActive = activeMetricKey === m.key;
            return (
              <button key={m.key} onClick={() => setActiveMetricKey(m.key)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                flex: 1,
                background: isActive ? "rgba(255,255,255,0.1)" : "#0e0e0e",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 6, color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                padding: "6px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit",
                letterSpacing: 0.5, transition: "all .15s",
              }}>
                <span>{m.label}</span>
                {lPct != null && (
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0 }}>
                    <span style={{ color: matchup.left.color }}>{lPct.toFixed(0)}%</span>
                    <span style={{ color: "rgba(255,255,255,0.25)" }}> · </span>
                    <span style={{ color: matchup.right.color }}>{rPct.toFixed(0)}%</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Row 2: Time ranges + actions */}
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {TIME_RANGES.map(r => (
            <button key={r.days} onClick={() => setTimeRange(r.days)} style={{
              background: timeRange === r.days ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${timeRange === r.days ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 4, color: timeRange === r.days ? "#ffffff" : "rgba(255,255,255,0.45)",
              padding: "3px 9px", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "inherit",
              transition: "all .15s",
            }}>{r.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { savedScrollRef.current = window.scrollY; setShowBattleAI(s => !s); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: showBattleAI ? "rgba(255,255,255,0.1)" : "#0e0e0e",

              border: `1px solid ${showBattleAI ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 6, color: showBattleAI ? "#ffffff" : "rgba(255,255,255,0.7)",
              padding: "3px 13px", cursor: "pointer", fontSize: 11, fontWeight: 700,
              fontFamily: "inherit", letterSpacing: 0.5, transition: "all .15s", flexShrink: 0,
            }}
          >
            <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64" alt="Claude" style={{ width: 13, height: 13, borderRadius: 2, flexShrink: 0 }} />
            Ask Claude
          </button>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
          <button
            onClick={shareOnX}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 6, color: "rgba(255,255,255,0.7)",
              padding: "3px 13px", cursor: "pointer", fontSize: 11, fontWeight: 700,
              fontFamily: "inherit", letterSpacing: 0.5, transition: "all .15s", flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share
          </button>
        </div>
      </div>

      {/* ── Chart ── */}
      <div ref={chartRef} style={{
        background: "#111",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        height: 380, display: "flex", flexDirection: "column",
        paddingBottom: 16,
      }}>
        {!isLoading && lShare != null && (
          <>
            <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{activeMetric?.label}</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{
                  fontFamily: "'Orbitron',sans-serif", fontWeight: 900,
                  fontSize: mw === "left" ? 20 : 15, color: matchup.left.color,
                  filter: mw === "left" ? `drop-shadow(0 0 10px ${matchup.left.color}66)` : "none",
                  transition: "font-size 0.4s",
                }}>{lShare.toFixed(1)}%</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 900 }}>·</span>
                <span style={{
                  fontFamily: "'Orbitron',sans-serif", fontWeight: 900,
                  fontSize: mw === "right" ? 20 : 15, color: matchup.right.color,
                  filter: mw === "right" ? `drop-shadow(0 0 10px ${matchup.right.color}66)` : "none",
                  transition: "font-size 0.4s",
                }}>{rShare.toFixed(1)}%</span>
              </div>
            </div>
            <div style={{ height: 3, display: "flex" }}>
              <div style={{ width: `${lShare}%`, background: `linear-gradient(90deg, ${matchup.left.color}88, ${matchup.left.color})`, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
              <div style={{ flex: 1, background: `linear-gradient(90deg, ${matchup.right.color}, ${matchup.right.color}88)` }} />
            </div>
          </>
        )}
        <div style={{ padding: "6px 8px 0", position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: 4, textTransform: "uppercase", userSelect: "none", fontStyle: "italic", background: "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.07) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.06))" }}>Flip-Index.xyz</span>
          </div>
          {isLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 3, fontFamily: "'Orbitron',sans-serif" }}>LOADING…</span>
            </div>
          ) : data.length > 0 ? (
            <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -28 }}>
                <defs>
                  <linearGradient id={`grad-b-${matchup.id}-${activeMetric?.key}-l`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={matchup.left.color}  stopOpacity={0.9} />
                    <stop offset="95%" stopColor={matchup.left.color}  stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id={`grad-b-${matchup.id}-${activeMetric?.key}-r`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={matchup.right.color} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={matchup.right.color} stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="label" hide />
                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(0)}%`} domain={[0, 100]} />
                <Tooltip
                  formatter={(v, k) => [`${v.toFixed(2)}%`, k === matchup.left.slug ? matchup.left.label : matchup.right.label]}
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12 }}
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey={matchup.left.slug}  stackId="1" stroke={matchup.left.color}  strokeWidth={1} fill={`url(#grad-b-${matchup.id}-${activeMetric?.key}-l)`} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: matchup.left.color }}  isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey={matchup.right.slug} stackId="1" stroke={matchup.right.color} strokeWidth={1} fill={`url(#grad-b-${matchup.id}-${activeMetric?.key}-r)`} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: matchup.right.color }} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 3, fontFamily: "'Orbitron',sans-serif" }}>NO DATA</span>
            </div>
          )}
        </div>
      </div>{/* end chartRef */}
      </div>{/* end inner flex */}
      </div>{/* end arena-neon-wrap */}

      {/* ── Ask Claude panel ── */}
      {showBattleAI && (() => {
        const analysis = generateBattleAnalysis(matchup, data, activeMetric);
        const winColor = analysis?.winner === "left" ? matchup.left.color : analysis?.winner === "right" ? matchup.right.color : "rgba(255,255,255,0.4)";
        return (
          <div style={{
            marginTop: 2, borderRadius: 12,
            background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
              <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64" alt="Claude" style={{ width: 18, height: 18, borderRadius: 3 }} />
              <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#e8e8e8", fontStyle: "italic" }}>Analysis — {activeMetric?.label}</span>
              <button onClick={() => setShowBattleAI(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 2px", fontFamily: "inherit" }}>×</button>
            </div>

            {!analysis ? (
              <div style={{ padding: "24px 20px", color: "rgba(255,255,255,0.55)", fontSize: 12, textAlign: "center" }}>
                Not enough data to analyse this chart yet. Try a different timeframe.
              </div>
            ) : (
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>

                {/* Current score bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: matchup.left.color, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{analysis.winNow.toFixed(1)}%</span>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden", display: "flex" }}>
                    <div style={{ flex: analysis.winNow, background: matchup.left.color, opacity: 0.85 }} />
                    <div style={{ flex: analysis.losNow, background: matchup.right.color, opacity: 0.85 }} />
                  </div>
                  <span style={{ color: matchup.right.color, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{analysis.losNow.toFixed(1)}%</span>
                </div>

                {/* Analysis paragraphs */}
                {analysis.lines.map((line, i) => (
                  <p key={i} style={{
                    margin: 0,
                    color: i === 0 ? "#e8e8e8" : "rgba(255,255,255,0.78)",
                    fontSize: 14,
                    lineHeight: 1.75,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}>{line}</p>
                ))}

              </div>
            )}
          </div>
        );
      })()}
    </>
  );
}


// ─── Battle 1v1 AI analysis (single active metric) ─────────────────────────
function generateBattleAnalysis(matchup, data, metric) {
  if (!data || data.length < 4 || !metric) return null;

  const lSlug = matchup.left.slug;
  const rSlug = matchup.right.slug;
  const lVals = data.map(d => d[lSlug]).filter(v => v != null);
  const rVals = data.map(d => d[rSlug]).filter(v => v != null);
  if (lVals.length < 4) return null;

  const lName = matchup.left.label;
  const rName = matchup.right.label;

  // Current share
  const last  = data[data.length - 1];
  const lNow  = last?.[lSlug] ?? 0;
  const rNow  = last?.[rSlug] ?? 0;
  const first = data[0];
  const lStart = first?.[lSlug] ?? lNow;
  const rStart = first?.[rSlug] ?? rNow;

  // Trend (full period slope)
  const { slope: lSlope } = linReg(lVals);
  const { slope: rSlope } = linReg(rVals);

  // Delta over period
  const lDelta = lNow - lStart; // +pp gained / -pp lost
  const rDelta = rNow - rStart;

  // Short-term momentum (last ~14 pts vs previous ~14 pts)
  const w = Math.min(14, Math.floor(lVals.length / 2));
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const lRecent = avg(lVals.slice(-w)) - avg(lVals.slice(-w * 2, -w));
  const rRecent = avg(rVals.slice(-w)) - avg(rVals.slice(-w * 2, -w));

  // Rolling max / find flip points
  let flips = 0;
  let prev = lVals[0] > rVals[0] ? "left" : "right";
  lVals.forEach((lv, i) => {
    const cur = lv > (rVals[i] ?? 0) ? "left" : "right";
    if (cur !== prev) { flips++; prev = cur; }
  });

  const winner = lNow > rNow ? "left" : lNow < rNow ? "right" : "tie";
  const winName = winner === "left" ? lName : winner === "right" ? rName : null;
  const losName = winner === "left" ? rName : winner === "right" ? lName : null;
  const winNow  = winner === "left" ? lNow  : rNow;
  const losNow  = winner === "left" ? rNow  : lNow;
  const winDelta = winner === "left" ? lDelta : rDelta;
  const losDelta = winner === "left" ? rDelta : lDelta;
  const winSlope = winner === "left" ? lSlope : rSlope;
  const losSlope = winner === "left" ? rSlope : lSlope;
  const winRecent = winner === "left" ? lRecent : rRecent;
  const losRecent = winner === "left" ? rRecent : lRecent;

  // Build focused paragraphs
  const lines = [];

  if (winner === "tie") {
    lines.push(`${lName} and ${rName} are exactly tied at ${lNow.toFixed(1)}% each on ${metric.label} right now.`);
    if (lSlope > 0.015) lines.push(`${lName} has the structural momentum — it has been steadily gaining share over the period.`);
    else if (rSlope > 0.015) lines.push(`${rName} has the structural momentum — it has been steadily gaining share over the period.`);
    else lines.push(`Neither protocol shows a clear structural trend — both have been flat throughout the period.`);
    return { winner, winName, losName, winNow, losNow, lDelta, rDelta, lRecent, rRecent, flips, lines };
  }

  // 1. Current state
  const gap = Math.abs(winNow - losNow);
  const gapDesc = gap > 25 ? "overwhelmingly dominates" : gap > 15 ? "dominates" : gap > 7 ? "leads comfortably" : gap > 3 ? "holds a clear edge" : "narrowly leads";
  lines.push(`${winName} ${gapDesc} this chart with ${winNow.toFixed(1)}% against ${losNow.toFixed(1)}% for ${losName}.`);

  // 2. Direction over the full period
  const winDir = winDelta > 1 ? `has been gaining ground` : winDelta < -1 ? `has been giving back share` : `has stayed roughly flat`;
  const losDir = losDelta > 1 ? `has also been climbing` : losDelta < -1 ? `has been losing ground` : `has stayed largely unchanged`;
  lines.push(`Over this period, ${winName} ${winDir} while ${losName} ${losDir}.`);

  // 3. Structural trend
  if (winSlope > 0.02 && losSlope < -0.01) {
    lines.push(`The structural picture is clear: ${winName} is in a sustained uptrend while ${losName} is on a consistent decline. This isn't noise — it's the underlying direction of the market.`);
  } else if (winSlope < -0.02 && losSlope > 0.01) {
    lines.push(`Despite leading today, ${winName}'s trend line is pointed downward — ${losName} is the one with positive structural momentum. A leadership flip becomes realistic if this continues.`);
  } else if (winSlope > 0.01) {
    lines.push(`${winName}'s lead looks structurally solid — the long-term trend is pointed in the right direction.`);
  } else if (winSlope < -0.01) {
    lines.push(`${winName} leads, but it's been gradually losing grip. ${losName} is slowly closing the gap and the direction of travel matters here.`);
  } else {
    lines.push(`Neither side has shown strong directional conviction — both have been broadly range-bound across this window.`);
  }

  // 4. Recent momentum (last ~14 data points)
  if (losRecent > 1.5 && winRecent < -1) {
    lines.push(`The most telling signal right now is recent momentum: ${losName} has been accelerating over the last couple of weeks while ${winName} has pulled back. That shift is worth watching closely.`);
  } else if (winRecent > 1.5) {
    lines.push(`Short-term momentum is firmly with ${winName} — it has been accelerating its lead in recent weeks, not coasting on it.`);
  } else if (losRecent > 1) {
    lines.push(`${losName} has shown some signs of life recently. Not enough to change the narrative yet, but the direction is shifting.`);
  }

  // 5. Flips (if volatile)
  if (flips >= 3) {
    lines.push(`This chart has seen ${flips} lead changes over the period — the rivalry is genuinely competitive and the outcome could flip again.`);
  } else if (flips === 0) {
    lines.push(`${winName} has been ahead from start to finish. No contest, no drama — just consistent dominance.`);
  }

  return { winner, winName, losName, winNow, losNow, lDelta, rDelta, lRecent, rRecent, flips, lines };
}

// ─── Tweet text generator (spicy) ────────────────────────────────────────────
function generateTweetText(matchup, data, metric, lShare, rShare) {
  if (!data?.length || lShare == null || rShare == null) {
    return `${matchup.left.label} vs ${matchup.right.label} — the battle everyone's watching 👀 #ProtocolWars #DeFi`;
  }
  const winner = lShare >= rShare ? matchup.left : matchup.right;
  const loser  = lShare >= rShare ? matchup.right : matchup.left;
  const wPct   = Math.max(lShare, rShare);
  const lPct   = Math.min(lShare, rShare);
  const gap    = wPct - lPct;
  const label  = metric?.label ?? "this metric";

  const sets = gap > 30
    ? [
        `${winner.label} is running CIRCLES around ${loser.label} on ${label}. ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}% — pure domination 🩸 #ProtocolWars #DeFi`,
        `${loser.label} fans should avoid the ${label} chart right now. ${winner.label} up ${wPct.toFixed(1)}% to ${lPct.toFixed(1)}% 💀 #DeFi #Crypto`,
        `${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}% on ${label}. ${winner.label} didn't come to play. ${loser.label} is getting cooked 🔥 #ProtocolWars`,
      ]
    : gap > 15
    ? [
        `${winner.label} is absolutely cooking ${loser.label} on ${label} — ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}%. The gap is very real 🔥 #ProtocolWars #DeFi`,
        `The ${label} chart doesn't lie: ${winner.label} ${wPct.toFixed(1)}% · ${loser.label} ${lPct.toFixed(1)}%. That's dominance, not luck. #DeFi #Crypto`,
        `${winner.label} is pulling away from ${loser.label} on ${label}. ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}% — momentum is a hell of a drug 📈 #DeFi`,
      ]
    : gap > 5
    ? [
        `${winner.label} leads ${loser.label} on ${label}: ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}%. Edge is there — but ${loser.label} is not done yet ⚔️ #ProtocolWars #DeFi`,
        `${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}% on ${label}. ${winner.label} ahead, but this one isn't settled 👀 #DeFi #Crypto`,
        `${winner.label} holds the lead on ${label} but ${loser.label} is breathing down their neck. ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}% 😤 #ProtocolWars`,
      ]
    : [
        `${winner.label} vs ${loser.label} on ${label}: ${wPct.toFixed(1)}% to ${lPct.toFixed(1)}%. You cannot get closer than this 🤯 Who flips first? #ProtocolWars #DeFi`,
        `${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}%. ${winner.label} barely ahead of ${loser.label} on ${label} — this is about to get ugly 🔪 #DeFi #Crypto`,
        `The ${label} chart between ${winner.label} and ${loser.label} is RAZOR thin. ${wPct.toFixed(1)}% vs ${lPct.toFixed(1)}%. A flip could happen any day 💥 #ProtocolWars`,
      ];

  return sets[Math.floor(Math.random() * sets.length)];
}
function BattleCard({ matchup, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [logos, setLogos] = useState({});
  const [shares, setShares] = useState(null); // { left: 63.7, right: 36.3 }

  useEffect(() => {
    let cancelled = false;
    const cutoff = getTodayTs() - 30 * 86400;
    const metric = matchup.metrics[0];
    if (!metric) return;
    Promise.all([
      fetchSlugData(matchup.left.slug,  metric.dataType, cutoff, null).catch(() => null),
      fetchSlugData(matchup.right.slug, metric.dataType, cutoff, null).catch(() => null),
    ]).then(([lr, rr]) => {
      if (cancelled) return;
      if (lr?.logo) setLogos(p => ({ ...p, [matchup.left.slug]:  lr.logo }));
      if (rr?.logo) setLogos(p => ({ ...p, [matchup.right.slug]: rr.logo }));
      if (!lr?.series?.length || !rr?.series?.length) return;
      const lv = lr.series[lr.series.length - 1]?.value ?? 0;
      const rv = rr.series[rr.series.length - 1]?.value ?? 0;
      const tot = lv + rv;
      if (tot === 0) return;
      setShares({ left: parseFloat(((lv / tot) * 100).toFixed(1)), right: parseFloat(((rv / tot) * 100).toFixed(1)) });
    });
    return () => { cancelled = true; };
  }, [matchup.id]);

  const lift = isActive || hovered;

  const ProtoSide = ({ proto, pct, flexVal = 1 }) => {
    const logo = logos[proto.slug];
    const initials = proto.label.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();
    return (
      <div style={{ flex: flexVal, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "0 10px", overflow: "hidden", transition: "flex 0.4s ease" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", background: proto.color + "2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {logo
            ? <img src={logo} alt={proto.label} style={{ width: 24, height: 24, objectFit: "contain", display: "block" }} />
            : <span style={{ color: proto.color, fontWeight: 800, fontSize: 8 }}>{initials}</span>
          }
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#e0e0e0", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{proto.label}</div>
        <div style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: 14, color: proto.color, lineHeight: 1 }}>{pct != null ? `${pct}%` : "—"}</div>
      </div>
    );
  };

  const card = (
    <div
      role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 88, borderRadius: isActive ? 12 : 14, overflow: "hidden", cursor: "pointer",
        background: "#111",
        border: isActive ? "none" : `1px solid ${lift ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)"}`,
        transform: lift ? "translateY(-3px)" : "translateY(0)",
        transition: "transform .2s, border-color .2s",
        position: "relative", display: "flex", flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Color atmosphere split */}
      <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
        <div style={{ flex: shares?.left ?? 1, background: matchup.left.color,  opacity: lift ? 0.28 : 0.18, transition: "flex 0.4s ease, opacity .2s" }} />
        <div style={{ flex: shares?.right ?? 1, background: matchup.right.color, opacity: lift ? 0.28 : 0.18, transition: "flex 0.4s ease, opacity .2s" }} />
      </div>

      {/* Category tag */}
      <div style={{ position: "absolute", top: 7, left: 0, right: 0, textAlign: "center", fontSize: 7, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>
        {matchup.category}
      </div>

      {/* Content row */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", paddingTop: 14, paddingBottom: 2 }}>
        <ProtoSide proto={matchup.left}  pct={shares?.left}  flexVal={shares?.left  ?? 50} />

        {/* Center divider + VS pill */}
        <div style={{ position: "relative", flexShrink: 0, alignSelf: "stretch", display: "flex", alignItems: "center", width: 0 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(255,255,255,0.15)", transform: "translateX(-50%)" }} />
          <div style={{ position: "relative", zIndex: 1, background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 5px", fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 700, letterSpacing: 1, transform: "translateX(-50%)" }}>VS</div>
        </div>

        <ProtoSide proto={matchup.right} pct={shares?.right} flexVal={shares?.right ?? 50} />
      </div>

      {/* Bottom dominance bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, display: "flex" }}>
        <div style={{ flex: shares?.left  ?? 50, background: matchup.left.color,  opacity: 0.8 }} />
        <div style={{ flex: shares?.right ?? 50, background: matchup.right.color, opacity: 0.8 }} />
      </div>
    </div>
  );
  return isActive ? (
    <div className="arena-neon-wrap" style={{ borderRadius: 16, height: 88, transform: lift ? "translateY(-3px)" : "translateY(0)", transition: "transform .2s" }}>
      {card}
    </div>
  ) : (
    <div style={{ transform: lift ? "translateY(-3px)" : "translateY(0)", transition: "transform .2s" }}>
      {card}
    </div>
  );
}

// ─── OneVOneView: renders inside the main arena-bg (no own wrapper) ───────────
function OneVOneView({ onBack, selectedMatchupId, setSelectedMatchupId, onViewProtocol }) {
  const selectedMatchup = MATCHUPS.find(m => m.id === selectedMatchupId);

  return (
    <>
      {/* Fixed header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, color: "#ffffff", padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              ← Back
            </button>
          <span style={{ fontFamily: "'Orbitron',sans-serif", color: "#e8e8e8", fontSize: 13, fontWeight: 900, letterSpacing: 4 }}>1v1 ARENA</span>
        </div>
      </div>

      <div style={{ paddingTop: 70, paddingBottom: 24, paddingLeft: 16, paddingRight: 16, maxWidth: 960, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Arena hero title ── */}
        <div style={{ textAlign: "center", marginBottom: 8, paddingTop: 32, paddingBottom: 8 }}>
          <div style={{
            fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 68,
            background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.4) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(255,255,255,0.2)) drop-shadow(0 6px 24px rgba(0,0,0,0.9))",
            lineHeight: 1, letterSpacing: 12,
          }}>ARENA</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 5, textTransform: "uppercase", marginTop: 10, fontFamily: "'Orbitron',sans-serif" }}>
            {MATCHUPS.length} ACTIVE BATTLES · MARKET SHARE DOMINANCE
          </div>
        </div>

        {/* ── Battle selector ── wrapping grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingBottom: 4, paddingTop: 4 }}>
          {MATCHUPS.map(m => (
            <div key={m.id} style={{ flex: "1 1 140px", minWidth: 130, maxWidth: 190 }}>
              <BattleCard
                matchup={m}
                isActive={m.id === selectedMatchupId}
                onClick={() => setSelectedMatchupId(m.id)}
              />
            </div>
          ))}
        </div>

          {selectedMatchup && <MatchupBattle key={selectedMatchup.id} matchup={selectedMatchup} onViewProtocol={onViewProtocol} />}
      </div>
    </>
  );
}

// ─── Protocol Explorer (full-page, V1/V2/V3 aggregated) ──────────────────────
const EXPLORER_METRICS = [
  { key: "tvl",         label: "TVL",            dataType: "tvl",         fmt: formatUSD },
  { key: "fees",        label: "Daily Fees",      dataType: "fees",        fmt: formatUSD },
  { key: "volume",      label: "DEX Volume",      dataType: "volume",      fmt: formatUSD },
  { key: "perpsVolume", label: "Perps Volume",    dataType: "perpsVolume", fmt: formatUSD },
  { key: "openInterest",label: "Open Interest",   dataType: "openInterest",fmt: formatUSD },
  { key: "borrowed",    label: "Active Loans",    dataType: "borrowed",    fmt: formatUSD },
];

function ProtocolExplorer({ slug, protocolMeta, protocolsByParent, onBack }) {
  const [metricData, setMetricData] = useState({});
  const [timeRange, setTimeRange]   = useState(365);
  const [done, setDone]             = useState(false);
  const fetchRef = useRef(0);

  // Find all related slugs (all versions sharing the same parent)
  const parentId  = protocolMeta[slug]?.parentProtocol;
  const allSlugs  = useMemo(() => {
    if (!parentId) return [slug];
    const siblings = protocolsByParent[parentId] || [];
    return siblings.length > 1 ? siblings : [slug];
  }, [slug, parentId, protocolsByParent]);

  const mainMeta = protocolMeta[slug] || {};
  const name = mainMeta.name || slugToDisplay(slug);
  const logo = mainMeta.logo || allSlugs.map(s => protocolMeta[s]?.logo).find(Boolean);
  const isAggregated = allSlugs.length > 1;

  useEffect(() => {
    const fetchId = ++fetchRef.current;
    setMetricData({});
    setDone(false);
    const cutoff = getTodayTs() - timeRange * 86400;

    let pending = EXPLORER_METRICS.length;
    const finish = () => { pending--; if (pending <= 0 && fetchRef.current === fetchId) setDone(true); };

    EXPLORER_METRICS.forEach(async m => {
      try {
        const results = await Promise.allSettled(
          allSlugs.map(s => fetchSlugData(s, m.dataType, cutoff, null))
        );
        if (fetchRef.current !== fetchId) return;
        const series = results
          .filter(r => r.status === "fulfilled" && r.value?.series?.length)
          .map(r => r.value.series);
        if (series.length === 0) { finish(); return; }
        // Sum by date across all versions
        const byDate = {};
        series.forEach(s => s.forEach(({ date, value }) => { byDate[date] = (byDate[date] || 0) + value; }));
        const agg = Object.entries(byDate)
          .map(([d, v]) => ({ date: Number(d), value: v }))
          .sort((a, b) => a.date - b.date)
          .filter(d => d.date >= cutoff);
        if (agg.length) setMetricData(prev => ({ ...prev, [m.key]: agg }));
      } catch {}
      finish();
    });
  }, [slug, timeRange, allSlugs]);

  const available = EXPLORER_METRICS.filter(m => metricData[m.key]?.length > 0);
  const accentColor = PROTOCOL_BRAND_COLORS[slug] || "#6366f1";

  return (
    <>
      {/* Fixed header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, color: "#ffffff", padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            ← Back
          </button>
          {logo && <img src={logo} alt={name} onError={e => { e.target.style.display = "none"; }} style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover", border: `1.5px solid ${accentColor}55` }} />}
          <span style={{ fontFamily: "'Orbitron',sans-serif", color: "#e8e8e8", fontSize: 13, fontWeight: 900, letterSpacing: 4 }}>{name.toUpperCase()}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ paddingTop: 70, paddingBottom: 40, paddingLeft: 24, paddingRight: 24, maxWidth: 1200, margin: "0 auto", width: "100%", animation: "fadeIn .3s ease" }}>

        {/* Protocol identity */}
        <div style={{ paddingTop: 28, paddingBottom: 24, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={logo || `https://icons.llama.fi/${slug}.png`} alt={name}
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              style={{ width: 60, height: 60, borderRadius: 14, objectFit: "cover", border: `2px solid ${accentColor}55` }} />
            <div style={{ display: "none", width: 60, height: 60, borderRadius: 14, background: accentColor + "22", border: `2px solid ${accentColor}44`, alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: accentColor }}>{name[0]?.toUpperCase()}</div>
          </div>
          <div>
            <h1 style={{ color: "#ffffff", fontWeight: 800, fontSize: 32, margin: "0 0 5px 0", lineHeight: 1 }}>{name}</h1>
            {isAggregated ? (
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                Aggregated · {allSlugs.slice(0, 5).map(s => protocolMeta[s]?.name || s).join(" · ")}{allSlugs.length > 5 ? ` +${allSlugs.length - 5} more` : ""}
              </div>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{slug}</div>
            )}
          </div>
        </div>

      {/* Time range selector */}
      <div style={{ display: "flex", gap: 2, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: 2, alignSelf: "flex-start", marginBottom: 20 }}>
        {[{ l: "90D", d: 90 }, { l: "180D", d: 180 }, { l: "1Y", d: 365 }, { l: "2Y", d: 730 }, { l: "3Y", d: 1095 }, { l: "ALL", d: 3650 }].map(({ l, d }) => (
          <button key={l} onClick={() => setTimeRange(d)} style={{
            background: timeRange === d ? "rgba(255,255,255,0.1)" : "transparent",
            border: timeRange === d ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
            color: timeRange === d ? "#fff" : "rgba(255,255,255,0.55)",
            borderRadius: 4, padding: "4px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
          }}>{l}</button>
        ))}
      </div>

      {/* Metrics grid */}
      {!done && available.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          Loading metrics…
        </div>
      ) : available.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No data found for this protocol</div>
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 4 }}>Try searching for a specific version like "aave-v3"</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {available.map(m => {
            const series = metricData[m.key];
            const latest = series[series.length - 1]?.value;
            const first  = series[0]?.value;
            const pct    = first > 0 ? ((latest - first) / first) * 100 : null;
            const chartPts = series.map(d => ({ date: formatDate(d.date), value: d.value }));
            return (
              <div key={m.key} style={{
                background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "20px 22px",
              }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>{m.fmt(latest)}</div>
                {pct != null && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5,
                    color: pct >= 0 ? "#10b981" : "#ef4444", fontSize: 12, fontWeight: 600 }}>
                    {pct >= 0 ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
                    <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400, fontSize: 11 }}> vs {timeRange}d ago</span>
                  </div>
                )}
                <ResponsiveContainer width="100%" height={160} style={{ marginTop: 14 }}>
                  <AreaChart data={chartPts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`xg-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accentColor} stopOpacity="0.35"/>
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12 }}
                      labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                      formatter={v => [m.fmt(v), m.label]}
                    />
                    <Area type="monotone" dataKey="value" stroke={accentColor} strokeWidth={2} fill={`url(#xg-${m.key})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
      </div>{/* end scrollable body */}
    </>
  );
}

// ─── FlipIndex title (HTML + inline SVG, no canvas) ─────────────────────────
function FlipIndexTitle() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, lineHeight: 1 }}>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 24, color: "#ffffff", letterSpacing: "-0.01em" }}>Flip</span>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300, fontSize: 24, color: "rgba(255,255,255,0.58)", letterSpacing: "-0.01em" }}>Inde</span>
      {/* X logo */}
      <svg width="18" height="18" viewBox="52 62 96 76" style={{ marginLeft: 2, overflow: "visible" }}>
        {/* main curve */}
        <path d="M52,138 C72,138 88,62 112,62" stroke="rgba(255,255,255,0.92)" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* secondary curve */}
        <path d="M52,62 C76,62 92,138 148,138" stroke="rgba(255,255,255,0.28)" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        {/* main dot */}
        <circle cx="112" cy="62" r="7" fill="#ffffff"/>
        {/* secondary dot */}
        <circle cx="52" cy="138" r="4.5" fill="rgba(255,255,255,0.35)"/>
      </svg>
    </div>
  );
}

// ─── Main app ───────────────────────────────────────────────────────────────
export default function ProtocolWars() {
  const [view, setView] = useState("main"); // "main" | "1v1"
  const [selectedMatchupId, setSelectedMatchupId] = useState(MATCHUPS[0].id);
  const [activeSegment, setActiveSegment] = useState("DEX");
  const [activeRivalry, setActiveRivalry] = useState(0);
  const [dexChain, setDexChain] = useState("Ethereum");
  const [lendingChain, setLendingChain] = useState("Ethereum");
  const [lendingMetric, setLendingMetric] = useState("tvl"); // "tvl" | "loans"
  const [dexMetric, setDexMetric] = useState("volume"); // "volume" | "tvl"
  const [perpsMetric, setPerpsMetric] = useState("fees"); // "fees" | "openInterest" | "volume"
  const [blockchainsMetric, setBlockchainsMetric] = useState("chainTvl"); // "chainTvl" | "chainVolume" | "chainRevenue"
  const [consumerMetric, setConsumerMetric] = useState("volume"); // "volume" | "fees" | "openInterest"
  const [aggregatorsMetric, setAggregatorsMetric] = useState("aggregatorVolume"); // "aggregatorVolume" | "fees"
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchProtocolSlug, setSearchProtocolSlug] = useState(null);
  const [prevView, setPrevView] = useState("main");
  const searchRef = useRef(null);
  // Close search dropdown on outside click
  useEffect(() => {
    const handler = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [timeRange, setTimeRange] = useState(90);
  const [customInput, setCustomInput] = useState("");
  const [slugs, setSlugs] = useState(DEX_CHAINS.Ethereum.slugs);
  const [protocols, setProtocols] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [rawDataBySlug, setRawDataBySlug] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [protocolMeta, setProtocolMeta] = useState({});
  const [protocolsByParent, setProtocolsByParent] = useState({});
  const [stacked, setStacked] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [hiddenSlugs, setHiddenSlugs] = useState(new Set());
  const [contextData, setContextData] = useState({});
  const fetchIdRef = useRef(0);
  const protocolMetaRef = useRef({});
  const canvasRef = useRef(null);
  useEffect(() => { protocolMetaRef.current = protocolMeta; }, [protocolMeta]);

  // ── Canvas halo + dot-grain background ──
  useEffect(() => {
    const bg = canvasRef.current;
    if (!bg) return;
    const bx = bg.getContext('2d');

    // Each halo: base position + oscillation amplitude/frequency/phase
    const HALOS = [
      { bx:.50, by:.45, rw:.55, rh:.42, a:.38, color:'255,255,255', ax:.38, ay:.32, fx:.31, fy:.19, ph:0.0 },
      { bx:.35, by:.30, rw:.38, rh:.30, a:.22, color:'255,255,255', ax:.30, ay:.28, fx:.22, fy:.37, ph:2.1 },
      { bx:.70, by:.60, rw:.32, rh:.26, a:.18, color:'210,230,255', ax:.28, ay:.25, fx:.17, fy:.26, ph:4.3 },
    ];

    let grainCanvas = null;
    let rafId = null;

    function buildGrain(W, H) {
      const grain = document.createElement('canvas');
      grain.width = W; grain.height = H;
      const gx = grain.getContext('2d');
      const SPACING = 14;
      for (let py = SPACING / 2; py < H; py += SPACING) {
        for (let px = SPACING / 2; px < W; px += SPACING) {
          const jx = (Math.random() - 0.5) * 1.5;
          const jy = (Math.random() - 0.5) * 1.5;
          gx.beginPath();
          gx.arc(px + jx, py + jy, 0.9, 0, Math.PI * 2);
          gx.fillStyle = 'rgba(255,255,255,0.18)';
          gx.fill();
        }
      }
      return grain;
    }

    function render(ts) {
      rafId = requestAnimationFrame(render);
      const t = ts * 0.001; // convert to seconds

      const W = bg.width, H = bg.height;
      bx.clearRect(0, 0, W, H);
      bx.fillStyle = '#0e0e0e';
      bx.fillRect(0, 0, W, H);

      HALOS.forEach(h => {
        // Lissajous drift — smooth, looping, clearly visible
        const cx = (h.bx + Math.sin(t * h.fx + h.ph) * h.ax) * W;
        const cy = (h.by + Math.cos(t * h.fy + h.ph) * h.ay) * H;
        const rx = h.rw * W, ry = h.rh * H;
        bx.save();
        bx.scale(1, ry / rx);
        const g = bx.createRadialGradient(cx, cy * (rx / ry), 0, cx, cy * (rx / ry), rx);
        g.addColorStop(0,   `rgba(${h.color},${h.a})`);
        g.addColorStop(0.3, `rgba(${h.color},${h.a * 0.7})`);
        g.addColorStop(0.7, `rgba(${h.color},${h.a * 0.2})`);
        g.addColorStop(1,   `rgba(${h.color},0)`);
        bx.fillStyle = g;
        bx.fillRect(0, 0, W, H * (rx / ry));
        bx.restore();
      });

      // Overlay pre-rendered grain
      if (grainCanvas) bx.drawImage(grainCanvas, 0, 0);

      // Vignette (lighter so halos stay visible at edges)
      const vig = bx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H * 0.95);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.45)');
      bx.fillStyle = vig;
      bx.fillRect(0, 0, W, H);
    }

    function resize() {
      bg.width  = window.innerWidth;
      bg.height = window.innerHeight;
      grainCanvas = buildGrain(bg.width, bg.height);
    }

    resize();
    rafId = requestAnimationFrame(render);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
            : activeSegment === "Consumer"
              ? consumerMetric
              : activeSegment === "Aggregators"
                ? aggregatorsMetric
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
        const byParent = {};
        data.forEach(p => {
          meta[p.slug] = { name: p.name, logo: p.logo, parentProtocol: p.parentProtocol };
          if (p.parentProtocol) {
            if (!byParent[p.parentProtocol]) byParent[p.parentProtocol] = [];
            byParent[p.parentProtocol].push(p.slug);
          }
        });
        setProtocolMeta(meta);
        setProtocolsByParent(byParent);
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
        validSlugs.forEach(s => { vals[s] = Math.max(0, interp[s][ts] ?? 0); total += vals[s]; });
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
                : activeSegment === "Consumer"
                  ? consumerMetric
                  : activeSegment === "Aggregators"
                    ? aggregatorsMetric
                    : (SEGMENTS[activeSegment]?.dataType || "tvl");
      fetchData(slugs, timeRange, dataType, chain);
    }
  }, [slugs, timeRange, activeSegment, activeRivalry, dexChain, lendingChain, lendingMetric, dexMetric, perpsMetric, blockchainsMetric, consumerMetric, aggregatorsMetric, fetchData]);

  const handleSegmentChange = seg => {
    setActiveSegment(seg);
    setActiveRivalry(0);
    setHiddenSlugs(new Set());
    if (seg === "DEX") {
      // keep current lending chain if it exists in DEX_CHAINS, else first
      const preferred = (lendingChain && DEX_CHAINS[lendingChain]) ? lendingChain : Object.keys(DEX_CHAINS)[0];
      setDexChain(preferred);
      setLendingChain(null);
      setSlugs(DEX_CHAINS[preferred].slugs);
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
    } else if (seg === "Aggregators") {
      setDexChain(null);
      setLendingChain(null);
      setAggregatorsMetric("aggregatorVolume");
      setSlugs(SEGMENTS.Aggregators.defaultSlugs);
    } else if (seg === "ETF") {
      setDexChain(null);
      setLendingChain(null);
      setSlugs(SEGMENTS.ETF.defaultSlugs);
      fetchETFData().then(({ snapshot }) => {
        const top5 = [...snapshot]
          .filter(x => x.aum > 0)
          .sort((a, b) => b.aum - a.aum)
          .slice(0, 5)
          .map(e => e.ticker);
        if (top5.length > 0) setSlugs(top5);
      }).catch(() => {});
    } else if (seg === "DAT") {
      setDexChain(null);
      setLendingChain(null);
      setSlugs([]);
      fetchAllTreasuries().then(all => {
        const top5 = all
          .filter(p => typeof p.tvl === "number" && p.tvl > 1e6)
          .sort((a, b) => b.tvl - a.tvl)
          .slice(0, 5)
          .map(p => p.slug);
        setSlugs(top5);
      }).catch(() => setSlugs([]));
    } else {
      setDexChain(null);
      setLendingChain(null);
      const seg_data = SEGMENTS[seg];
      if (seg === "Blockchains") setBlockchainsMetric("chainTvl");
      if (seg === "Consumer") setConsumerMetric("volume");
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
    setSlugs(DEX_CHAINS[chainName].slugs);
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
    activeSegment === "DEX"     ? (CHAIN_DEX_PROTOCOLS[dexChain] || [])
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
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Chain — {label}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(chainsConfig).map(([chainName, cfg]) => {
            const active = activeChain === chainName;
            const logoUrl = CHAIN_LOGOS[chainName];
            return (
              <button key={chainName} onClick={() => handleSelect(chainName)} style={{
                background: "#0e0e0e",
                border: `1.5px solid ${active ? cfg.color + "ff" : "rgba(255,255,255,0.1)"}`,

                color: "#ffffff",
                borderRadius: 6, padding: "6px 13px", cursor: "pointer",
                fontWeight: 600, fontSize: 12, transition: "all .15s", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: active ? `0 2px 12px ${cfg.color}28` : "none",
              }}>
                <img src={logoUrl} alt={chainName} style={{
                  width: 22, height: 22, borderRadius: "50%", objectFit: "cover",
                  filter: active ? "none" : "saturate(80%) opacity(0.85)",
                  transition: "filter .2s", flexShrink: 0,
                }} />
                {chainName}
              </button>
            );
          })}
        </div>
      </div>
    );
  })() : null;

  const chainBadgeColor =
    (dexChain && DEX_CHAINS[dexChain]?.color) ||
    (lendingChain && LENDING_CHAINS[lendingChain]?.color) ||
    "rgba(255,255,255,0.6)";
  const chainBadgeJSX = currentChain ? (
    <span style={{
      background: chainBadgeColor + "22",
      border: `1px solid ${chainBadgeColor}66`,
      color: chainBadgeColor,
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
    }}>{currentChain}</span>
  ) : null;

  const aiInsights = generateAnalysis(chartData, visibleProtocols);

  // ── 1v1 view routing ──
  // (rendered inside the same arena-bg canvas wrapper below)

  return (
    <div className="arena-bg" style={{ color: "#f0e6cb", fontFamily: "'Space Grotesk','Inter',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@600&family=Orbitron:wght@900&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        html, body { background-color: #0e0e0e !important; background-image: none !important; margin: 0; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loadbar { 0%{left:-45%;width:45%} 100%{left:100%;width:45%} }
        @keyframes flicker { 0%,100%{opacity:1;text-shadow:0 0 8px #ff9500,0 0 20px #ff5500,0 0 40px #ff2200} 25%{opacity:.9;text-shadow:0 0 12px #ffb700,0 0 30px #ff6600,0 0 60px #ff3300} 50%{opacity:1;text-shadow:0 0 6px #ff8800,0 0 18px #ff4800,0 0 36px #ff1500} 75%{opacity:.95;text-shadow:0 0 10px #ffaa00,0 0 25px #ff5800,0 0 50px #ff2800} }
        @keyframes flamePulse { 0%,100%{box-shadow:0 0 12px #ff6600,0 0 28px #ff3300,0 0 50px rgba(255,80,0,0.4),inset 0 0 15px rgba(255,120,0,0.15)} 50%{box-shadow:0 0 20px #ff8800,0 0 45px #ff4400,0 0 80px rgba(255,100,0,0.5),inset 0 0 25px rgba(255,140,0,0.2)} }
        @keyframes arenaRotate { from{--arena-angle:0deg} to{--arena-angle:360deg} }
        @property --arena-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
        .btn-1v1-wrap{position:relative;border-radius:10px;padding:1.5px;background:conic-gradient(from var(--arena-angle),#FF007A,#7c3aed,#0072F5,#00D395,#F5D100,#FF6B4A,#A855F7,#FF007A);animation:arenaRotate 3s linear infinite;margin-bottom:10px;}
        .btn-1v1-inner{display:block;width:100%;text-align:left;background:#0e0e0e;border:none;border-radius:8px;color:#d4d4d8;padding:12px 10px 12px 14px;cursor:pointer;font-family:inherit;transition:background .15s,color .15s;position:relative;}
        .btn-1v1-inner:hover{background:#161618;color:#ffffff;}
        .arena-neon-wrap{position:relative;padding:1.5px;background:conic-gradient(from var(--arena-angle),#FF007A,#7c3aed,#0072F5,#00D395,#F5D100,#FF6B4A,#A855F7,#FF007A);animation:arenaRotate 3s linear infinite;}
        .arena-neon-back{display:inline-block;border-radius:10px;padding:1.5px;background:conic-gradient(from var(--arena-angle),#FF007A,#7c3aed,#0072F5,#00D395,#F5D100,#FF6B4A,#A855F7,#FF007A);animation:arenaRotate 3s linear infinite;}
        .btn-arena{display:inline-flex;align-items:stretch;height:52px;border-radius:12px;background:#ffffff;border:none;cursor:pointer;overflow:hidden;transition:transform 0.18s,box-shadow 0.18s;box-shadow:0 0 0 0 rgba(255,255,255,0);padding:0;}
        .btn-arena:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,255,255,0.12);}
        .btn-arena:active{transform:scale(0.97);}
        .btn-arena-main{display:flex;flex-direction:column;justify-content:center;padding:0 24px;height:100%;border-right:1px solid rgba(0,0,0,0.1);}
        .btn-arena-top{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:0.12em;color:#0d0f18;line-height:1;}
        .btn-arena-bot{font-family:'Inter',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.4);margin-top:3px;}
        .btn-arena-side{display:flex;align-items:center;justify-content:center;padding:0 16px;height:100%;background:rgba(0,0,0,0.06);font-size:18px;color:rgba(0,0,0,0.4);font-weight:300;line-height:1;transition:background 0.18s;}
        .btn-arena:hover .btn-arena-side{background:rgba(0,0,0,0.1);}
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:#0e0e0e}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}
        input{outline:none} input:focus{border-color:rgba(255,255,255,0.4) !important}
        button:hover{opacity:.8}
        /* ── Arena Background ── */
        .arena-bg {
          position: relative; width: 100%; min-height: 100vh; overflow: hidden;
          background: #0e0e0e;
        }
        .arena-bg canvas {
          position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
        }
        .arena-content{position:relative;z-index:30;}
        .mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
        .hero-overlay__credit {
          padding: 0.28rem 0.6rem 0.28rem 1.0rem; border-radius: 999px;
          font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15); text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
          backdrop-filter: blur(1px); flex-shrink: 0; margin-left: auto;
        }
        .hero-overlay__credit:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.09); transform: translateY(-1px); opacity: 1 !important; }
        .hero-overlay__credit-label { letter-spacing: inherit; white-space: nowrap; }
        .hero-overlay__credit-avatar { width:32px;height:32px;border-radius:50%;overflow:hidden;border:1px solid rgba(255,255,255,0.15);box-shadow:0 0 8px rgba(255,255,255,0.05);margin-right:-0.2rem;flex:0 0 32px; }
        .hero-overlay__credit-avatar img { width:100%;height:100%;object-fit:cover;display:block; }
      `}</style>

      {/* ── Canvas background ── */}
      <canvas ref={canvasRef} />

      {/* ── Page content ── */}
      <div className="arena-content">
      {view === "1v1" ? (
        <OneVOneView
          onBack={() => { setView("main"); window.scrollTo(0, 0); }}
          selectedMatchupId={selectedMatchupId}
          setSelectedMatchupId={setSelectedMatchupId}
          onViewProtocol={(slug) => { setPrevView("1v1"); setSearchProtocolSlug(slug); setView("protocol"); }}
        />
      ) : view === "protocol" ? (
        <ProtocolExplorer
          slug={searchProtocolSlug}
          protocolMeta={protocolMeta}
          protocolsByParent={protocolsByParent}
          onBack={() => { setView(prevView); setSearchProtocolSlug(null); setSearchQuery(""); setPrevView("main"); }}
        />
      ) : (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── Horizontal title bar ── FIXED */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: 60, zIndex: 200,
          display: "flex", alignItems: "center", gap: 10,
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,6,0.98)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        }}>
          <FlipIndexTitle />
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", fontStyle: "italic", marginLeft: 4 }}>Watch your favorite protocol get flipped</span>
          <div style={{ marginLeft: "auto" }}>
            <a href="https://x.com/JoestarCrypto" target="_blank" rel="noopener noreferrer" className="hero-overlay__credit">
              <span className="hero-overlay__credit-label">Made by Joestar</span>
              <span className="hero-overlay__credit-avatar">
                <img src="/Jojo2.webp" alt="Joestar" />
              </span>
            </a>
          </div>
        </div>

        {/* spacer so content starts below fixed header */}
        <div style={{ height: 60, flexShrink: 0 }} />

        <div style={{ flex: 1, display: "flex" }}>

        {/* ── Sidebar ── */}
        <nav style={{
          width: 200, flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.07)",
          position: "sticky", top: 0, alignSelf: "flex-start",
          height: "100vh", overflowY: "auto",
          display: "flex", flexDirection: "column",
          background: "rgba(6,6,6,0.99)",
        }}>
          {/* 1v1 button — top of sidebar */}
          <div style={{ padding: "10px 8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
            <div className="btn-1v1-wrap">
              <button onClick={() => setView("1v1")} className="btn-1v1-inner">
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.1em", lineHeight: 1, color: "inherit" }}>1v1</div>
                <div style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(180,180,190,0.6)", marginTop: 5 }}>Arena Battles</div>
              </button>
            </div>

            {/* Search bar */}
            <div ref={searchRef} style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: searchOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${searchOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8, padding: "7px 10px",
              transition: "all .18s", cursor: "text",
            }} onClick={() => setSearchOpen(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search protocol…"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#e2e2e2", fontSize: 11, fontFamily: "inherit",
                  width: "100%", caretColor: "#ffffff",
                }}
              />
              {searchQuery && (
                <button onClick={e => { e.stopPropagation(); setSearchQuery(""); setSearchOpen(false); setSearchProtocolSlug(null); }} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1, padding: 0, fontFamily: "inherit",
                }}>×</button>
              )}
            </div>
            {searchOpen && searchQuery.length >= 2 && (() => {
              const q = searchQuery.toLowerCase();
              const results = Object.entries(protocolMeta)
                .filter(([slug, m]) => m.name?.toLowerCase().includes(q) || slug.includes(q))
                .slice(0, 8);
              return results.length > 0 ? (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
                  background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                  boxShadow: "0 8px 28px rgba(0,0,0,0.7)", padding: 4,
                }}>
                  {results.map(([slug, m]) => (
                    <button key={slug} onClick={() => {
                      setSearchProtocolSlug(slug);
                      setView("protocol");
                      setSearchQuery(m.name || slug);
                      setSearchOpen(false);
                    }} style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "6px 8px", borderRadius: 5, textAlign: "left", fontFamily: "inherit",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <img src={m.logo || `https://icons.llama.fi/${slug}.png`} alt="" onError={e => { e.target.style.display = "none"; }}
                        style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                      <span style={{ color: "#e2e2e2", fontSize: 12 }}>{m.name || slug}</span>
                    </button>
                  ))}
                </div>
              ) : null;
            })()}
            </div>
          </div>

          {/* Nav groups */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 0 16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { group: "TRADING",        items: ["DEX", "Aggregators", "Perps"] },
              { group: "FINANCE",        items: ["Lending", "Liquid Staking", "Stablecoins", "RWA", "ETF", "DAT"] },
              { group: "INFRASTRUCTURE", items: ["Blockchains", "Oracles"] },
              { group: "CONSUMER",       items: ["Consumer", "Launchpads", "TCG"] },
            ].map(({ group, items }) => (
              <div key={group} style={{ marginBottom: 22 }}>
                <div style={{
                  color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, paddingLeft: 12,
                }}>{group}</div>
                {items.map(key => {
                  const seg = SEGMENTS[key];
                  if (!seg) return null;
                  const isActive = activeSegment === key && view !== "protocol";
                  return (
                    <button key={key} onClick={() => { handleSegmentChange(key); if (view === "protocol") { setView("main"); setSearchProtocolSlug(null); setSearchQuery(""); } }} style={{
                      display: "block", width: "100%", textAlign: "left",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      border: "none", borderRadius: isActive ? "8px 0 0 8px" : 8,
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                      padding: "10px 10px 10px 14px", cursor: "pointer",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 14, transition: "all .15s", fontFamily: "inherit",
                      marginBottom: 2, position: "relative",
                    }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "transparent"; } }}
                    >
                      {isActive && (
                        <div style={{
                          position: "absolute", left: 2, top: "20%", bottom: "20%",
                          width: 3, background: "#ffffff", borderRadius: 2,
                        }} />
                      )}
                      {seg.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

        </nav>

        {/* ── Main area ── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>

        {/* ── Chain Selector (DEX and Lending) ── */}
        {chainSelectorJSX}

        {/* Rivalry selector */}
        {SEGMENTS[activeSegment].rivalries.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {SEGMENTS[activeSegment].rivalries.map((r, idx) => (
              <button key={idx} onClick={() => handleRivalryChange(idx)} style={{
                background: !dexChain && !lendingChain && activeRivalry === idx ? "rgba(255,255,255,0.1)" : "#0e0e0e",
                border: `1px solid ${!dexChain && !lendingChain && activeRivalry === idx ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)"}`,
                color: !dexChain && !lendingChain && activeRivalry === idx ? "#ffffff" : "rgba(255,255,255,0.7)",
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
        {errors._global && (
          <div style={{ background: "#ef444422", border: "1px solid #ef444466", borderRadius: 10, padding: "12px 16px", color: "#ef4444", marginBottom: 16, fontSize: 14 }}>
            {errors._global}
          </div>
        )}

        {/* Fighter Cards */}
        {loading ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "stretch" }}>
            {slugs.map((_, i) => (
              <div key={i} style={{ flex: "1 1 100px", minWidth: 90, background: "#0e0e0e", borderRadius: 7, padding: "7px 10px" }}>
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
                  onClick={() => { setPrevView("main"); setSearchProtocolSlug(p.slug); setView("protocol"); }}
                />
              ))}
          </div>
        )}

        {/* ── Controls Bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {(activeSegment === "DEX" || activeSegment === "Lending" || activeSegment === "Perps" || activeSegment === "Blockchains" || activeSegment === "Consumer" || activeSegment === "Aggregators") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Metric</span>
              <div style={{ display: "flex", gap: 2, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "2px" }}>
                {activeSegment === "DEX" && [{ key: "volume", label: "Volume" }, { key: "tvl", label: "TVL" }].map(({ key, label }) => (
                  <button key={key} onClick={() => { setDexMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: dexMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: dexMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: dexMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
                {activeSegment === "Lending" && [{ key: "tvl", label: "TVL" }, { key: "loans", label: "Active Loans" }]
                  .filter(({ key }) => !(key === "loans" && lendingChain === "MegaETH"))
                  .map(({ key, label }) => (
                  <button key={key} onClick={() => { setLendingMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: lendingMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: lendingMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: lendingMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
                {activeSegment === "Perps" && [
                  { key: "volume", label: "Volume" },
                  { key: "openInterest", label: "Open Interest" },
                  { key: "fees", label: "Fees" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => { setPerpsMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: perpsMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: perpsMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: perpsMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
                {activeSegment === "Blockchains" && [
                  { key: "chainTvl", label: "TVL" },
                  { key: "chainVolume", label: "DEX Volume" },
                  { key: "chainRevenue", label: "Revenue" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => { setBlockchainsMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: blockchainsMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: blockchainsMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: blockchainsMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
                {activeSegment === "Consumer" && [
                  { key: "volume",       label: "Volume" },
                  { key: "fees",         label: "Fees" },
                  { key: "openInterest", label: "Open Interest" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => { setConsumerMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: consumerMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: consumerMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: consumerMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
                {activeSegment === "Aggregators" && [
                  { key: "aggregatorVolume", label: "Volume" },
                  { key: "fees",             label: "Fees" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => { setAggregatorsMetric(key); setHiddenSlugs(new Set()); }} style={{
                    background: aggregatorsMetric === key ? "rgba(255,255,255,0.1)" : "transparent",
                    border: aggregatorsMetric === key ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    color: aggregatorsMetric === key ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3,
                    padding: "3px 11px", cursor: "pointer", fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
                  }}>{label}</button>
                ))}

              </div>
              {activeSegment === "Perps" && JSON.stringify([...slugs].sort()) !== JSON.stringify([...SEGMENTS.Perps.defaultSlugs].sort()) && (
                <button onClick={() => { setSlugs(SEGMENTS.Perps.defaultSlugs); setHiddenSlugs(new Set()); }} style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, color: "rgba(255,255,255,0.65)",
                  fontSize: 10, fontWeight: 600, letterSpacing: 1, padding: "2px 8px", cursor: "pointer",
                  textTransform: "uppercase", fontFamily: "inherit",
                }}>⚡ Reset</button>
              )}
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 2, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "2px" }}>
            {TIME_RANGES.map(({ label, days }) => (
              <button key={label} onClick={() => setTimeRange(days)} style={{
                background: timeRange === days ? "rgba(255,255,255,0.1)" : "transparent",
                border: timeRange === days ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                color: timeRange === days ? "#ffffff" : "rgba(255,255,255,0.7)", borderRadius: 3, padding: "3px 9px", cursor: "pointer",
                fontWeight: 600, fontSize: 11, transition: "all .15s", fontFamily: "inherit",
              }}>{label}</button>
            ))}
          </div>
          <button onClick={() => setShowAIPanel(s => !s)} style={{
            background: showAIPanel ? "rgba(255,255,255,0.1)" : "#111",
            border: `1px solid ${showAIPanel ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)"}`,

            color: "#ffffff",
            borderRadius: 5, padding: "3px 11px", cursor: "pointer",
            fontWeight: 600, fontSize: 11, fontFamily: "inherit", transition: "all .15s",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64" alt="Claude" style={{ width: 13, height: 13, borderRadius: 2, flexShrink: 0 }} />
            Ask Claude
          </button>
          <button onClick={() => setStacked(s => !s)} style={{
            background: stacked ? "rgba(255,255,255,0.1)" : "#111",
            border: `1px solid ${stacked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)"}`,

            color: stacked ? "#ffffff" : "rgba(255,255,255,0.7)",
            borderRadius: 5, padding: "3px 10px", cursor: "pointer",
            fontWeight: 600, fontSize: 11, fontFamily: "inherit", transition: "all .15s",
          }}>{stacked ? "Unstack" : "Stack to 100%"}</button>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
            {chartData.length > 0 ? `${chartData[0]?.label} → ${chartData[chartData.length - 1]?.label}` : ""}
          </span>
        </div>

        {/* The Arena */}
        <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "16px 16px 12px", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 4, paddingRight: 4 }}>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 700 }}>The Arena</span>
            <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, letterSpacing: 0.5 }}>
              {DT[currentDataType]?.arena || "Market Share %"}
            </span>
            {chainBadgeJSX}
          </div>

          {loading ? (
            <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Loading data…</div>
              <div style={{ width: "60%", height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                <div style={{
                  position: "absolute", top: 0, height: "100%", width: "45%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), rgba(255,255,255,0.7), transparent)",
                  animation: "loadbar 1.4s ease-in-out infinite",
                }} />
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              No data found for selected protocols in this range.
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Watermark */}
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none", zIndex: 1,
              }}>
                <span style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: 4,
                  textTransform: "uppercase", userSelect: "none", fontStyle: "italic",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.07) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.06))",
                }}>Flip-Index.xyz</span>
              </div>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.max(0, Math.floor(displayData.length / 6) - 1)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={stacked ? [0, 100] : [0, dataMax => Math.min(100, Math.ceil(dataMax / 5) * 5 + 5)]} />
                <Tooltip
                  content={<CustomTooltip protocols={visibleProtocols} rawDataBySlug={rawDataBySlug} dataType={currentDataType} />}
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
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
            {/* ── Interactive Legend ── */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
              {protocols
                .filter(p => chartData.length === 0 || chartData.some(d => (d[p.slug] ?? 0) > 0))
                .map(p => {
                  const color = colorBySlug[p.slug] || "#666";
                  const isHidden = hiddenSlugs.has(p.slug);
                  const lastShare = chartData[chartData.length - 1]?.[p.slug];
                  return (
                    <div key={p.slug} style={{
                      display: "flex", alignItems: "center",
                      background: isHidden ? "#0e0e0e" : color + "12",
                      border: `1px solid ${isHidden ? "rgba(255,255,255,0.08)" : color + "55"}`,

                      borderRadius: 5, overflow: "hidden", transition: "all .15s",
                      opacity: isHidden ? 0.45 : 1,
                    }}>
                      <button
                        onClick={() => setHiddenSlugs(prev => {
                          const next = new Set(prev);
                          if (next.has(p.slug)) next.delete(p.slug); else next.add(p.slug);
                          return next;
                        })}
                        style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, padding: "4px 7px 4px 6px" }}
                        title={isHidden ? "Show" : "Hide"}
                      >
                        <img
                          src={p.logo || STABLECOIN_LOGOS[p.slug] || `https://icons.llama.fi/${p.slug}.png`}
                          alt=""
                          onError={e => { e.target.style.display = "none"; }}
                          style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                        />
                        <span style={{ color: isHidden ? "rgba(255,255,255,0.55)" : "#e2e2e2", fontSize: 11, fontWeight: 600 }}>
                          {p.name || slugToDisplay(p.slug)}
                        </span>
                        {lastShare != null && !isHidden && (
                          <span style={{ color, fontSize: 10, fontWeight: 700 }}>{lastShare.toFixed(1)}%</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveSlug(p.slug)}
                        title="Remove from comparison"
                        style={{
                          background: "transparent", border: "none",
                          borderLeft: `1px solid ${isHidden ? "rgba(255,255,255,0.08)" : color + "33"}`,
                          cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "4px 6px",
                          fontSize: 12, lineHeight: 1, fontFamily: "inherit",
                        }}
                      >×</button>
                    </div>
                  );
                })}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowSuggestions(s => !s)}
                  style={{
                    background: showSuggestions ? "rgba(255,255,255,0.1)" : "#111",
                    border: `1px solid ${showSuggestions ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,

                    borderRadius: 5, padding: "4px 10px", cursor: "pointer",
                    color: showSuggestions ? "#ffffff" : "rgba(255,255,255,0.7)",
                    fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >+ Add</button>
                {showSuggestions && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 6px)", left: 0, zIndex: 50,
                    background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7,
                    minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.6)", padding: 6,
                  }}>
                    <input
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddSlug()}
                      placeholder="Protocol slug…"
                      autoFocus
                      style={{
                        width: "100%", background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 4, color: "#e2e2e2", fontSize: 12, padding: "5px 9px",
                        fontFamily: "inherit", marginBottom: 4,
                      }}
                    />
                    {filteredSuggestions.map(s => (
                      <button key={s.slug} onClick={() => { if (!slugs.includes(s.slug)) setSlugs(prev => [...prev, s.slug]); setCustomInput(""); setShowSuggestions(false); }} style={{
                        display: "block", width: "100%", textAlign: "left",
                        background: "transparent", border: "none", borderRadius: 3,
                        color: "rgba(255,255,255,0.55)", fontSize: 12, padding: "5px 8px", cursor: "pointer", fontFamily: "inherit",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >{s.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          )}
        </div>

        {/* AI Analysis Panel */}
        {showAIPanel && (
          <div style={{
            background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "18px 22px", marginBottom: 16,
            animation: "fadeIn .3s ease",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.55)">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>AI Trend Analysis</span>
                <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: 1 }}>BETA</span>
              </div>
              <button onClick={() => setShowAIPanel(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 2px", fontFamily: "inherit" }}>×</button>
            </div>

            {loading || chartData.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>No data to analyze yet.</div>
            ) : !aiInsights ? (
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Not enough data points for a meaningful analysis.</div>
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
                      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontStyle: "italic" }}>No clear gainer.</div>
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
                                  <div key={j} style={{ color: "#6b8f7a", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "rgba(255,255,255,0.15)" : r.type === "raise" ? "#10b98140" : "rgba(255,255,255,0.1)"}` }}>{r.text}</div>
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
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
                      <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Holding / Unclear</span>
                    </div>
                    {aiInsights.neutral.length === 0 ? (
                      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontStyle: "italic" }}>No neutral protocol.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {aiInsights.neutral.map((ins, i) => (
                          <div key={i} style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "10px 13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 13 }}>{ins.name}</span>
                              <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 6 }}>{ins.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{ins.current.toFixed(1)}%</span>
                              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, alignSelf: "flex-end", marginBottom: 1 }}>share</span>
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                            {(() => { const rs = buildReasons(ins, contextData); return rs.length ? (
                              <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 7 }}>
                                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>Context</div>
                                {rs.map((r, j) => (
                                  <div key={j} style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "rgba(255,255,255,0.15)" : r.type === "raise" ? "#10b98140" : "rgba(255,255,255,0.1)"}` }}>{r.text}</div>
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
                      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontStyle: "italic" }}>No clear loser.</div>
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
                                  <div key={j} style={{ color: "#8f6b6b", fontSize: 11, lineHeight: 1.55, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${r.type === "hack" ? "#ef444440" : r.type === "governance" ? "rgba(255,255,255,0.15)" : r.type === "raise" ? "#10b98140" : "rgba(255,255,255,0.1)"}` }}>{r.text}</div>
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
                    marginTop: 12, background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: "10px 14px",
                    display: "flex", alignItems: "flex-start", gap: 8,
                  }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{aiInsights.marketNote.icon}</span>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{aiInsights.marketNote.text}</p>
                  </div>
                )}
              </>
            )}

            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 14, textAlign: "right" }}>
              {chartData.length} data points · Context data refreshed daily · Not financial advice
            </div>
          </div>
        )}

        {/* Battle Stats removed */}

        </div>
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
            Data: DeFiLlama • Not financial advice • {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </footer>
        </div>
      </div>
      </div>
  )}{/* end conditional main/1v1 */}
      </div>{/* end arena-content */}
    </div>
  );
}



