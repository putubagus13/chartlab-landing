import type { SiteContent } from "./types";
import { shared } from "./shared";

const [starter, pro, mentor] = shared.packages;

export const siteEn: SiteContent = {
  meta: {
    homeTitle: 'ChartLab — Free Crypto Trading Platform with Backtesting',
    homeDescription:
      'ChartLab by Disatu: a free trading platform to analyze the crypto market. Backtest your system, see the statistics, and find the best R:R.',
  },
  ui: {
    buyEbook: "Buy E-Book",
    buyPackage: "Buy Package",
    mostPopular: "Most Popular",
    freeBacktestBadge: "Includes the ChartLab guide",
    openApp: 'Open ChartLab',
    tryFree: 'Try ChartLab Free',
    freeBadge: 'Every feature free',
    seeApp: "Watch the preview",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    skipToContent: "Skip to content",
    themeLight: "Light theme",
    themeDark: "Dark theme",
    themeSystem: "System theme",
    switchLanguage: "Switch language",
    visualLabel:
      "Animated three-dimensional lines that change shape every few seconds. Move your cursor to interact",
    whatYouLearn: "What you'll learn",
    howToGetAccess: "How to get started",
    sampleData: "sample data",
  },
  brand: { name: "ChartLab", tagline: "Learn, test, and trust your data." },
  nav: [
    { label: 'Trading Workflow', hash: 'workflow' },
    { label: 'ChartLab', hash: 'chartlab' },
  ],
  hero: {
    eyebrow: 'ChartLab · Crypto Trading Platform',
    title: 'Analyze the crypto market and test your system. Every feature free.',
    subtitle:
      'ChartLab is a trading platform for analyzing the crypto market. Backtest your system, read the statistics, and find the best R:R, at no cost.',
    bundleNote: 'Every feature is free, backtesting included.',
  },
  ebook: {
    title: "Crypto Trading E-Book",
    subtitle:
      "A practical guide from market basics to building and testing your own strategy.",
    chapters: [
      "Crypto market basics and how orders work",
      "Reading charts without relying on gut feeling",
      "Risk management and position sizing",
      "Designing strategy rules you can test",
      "Backtesting: reading results and avoiding traps",
      "Execution discipline and trading journals",
    ],
    packages: [
      {
        ...starter,
        name: "Starter",
        tagline: "Start from the right foundation.",
        features: [
          "Full e-book (PDF)",
          "ChartLab usage guide",
          "E-book content updates",
        ],
        includesBacktestAccess: true,
      },
      {
        ...pro,
        name: "Pro",
        tagline: "Most chosen by serious learners.",
        features: [
          "Full e-book (PDF)",
          "ChartLab usage guide",
          "Ready-to-use strategy templates",
          "E-book content updates",
        ],
        includesBacktestAccess: true,
      },
      {
        ...mentor,
        name: "Mentor",
        tagline: "With hands-on guidance.",
        features: [
          "Everything in Pro",
          "ChartLab usage guide",
          "One live Q&A session",
          "Strategy review",
        ],
        includesBacktestAccess: true,
      },
    ],
  },
  chartlab: {
    title: 'ChartLab: analyze and test your strategy in one place',
    subtitle: 'ChartLab brings chart analysis and backtesting together in one platform. Every feature is free.',
    videoSrc: shared.videoSrc,
    videoPoster: shared.videoPoster,
    videoLabel: 'ChartLab tutorial video',
    videoNote: 'A short walkthrough, from Bar Replay to trade history. On-screen captions are in Indonesian.',
    features: [
      { title: 'Built-in backtesting', description: 'Test your trading system on historical data with Bar Replay, as if the market were live.', icon: shared.icons[4] },
      { title: 'Backtest statistics', description: 'See how your system performs in clear statistics, not gut feeling.', icon: shared.icons[0] },
      { title: 'Best R:R recommendation', description: 'ChartLab analyzes the system you built and recommends the best risk:reward ratio.', icon: shared.icons[5] },
      { title: 'Full chart analysis', description: 'Indicators, multiple timeframes, and a multi-pair watchlist to read the market.', icon: shared.icons[2] },
      { title: 'Orders with SL, TP, and trailing stop', description: 'Set entry, stop loss, take profit, and trailing stop right on the chart.', icon: shared.icons[3] },
      { title: 'Automatic trade journal', description: 'Trade history with chart screenshots, tags, and a note on why you took each trade.', icon: shared.icons[1] },
    ],
    steps: [
      { title: 'Open ChartLab', description: 'Go in from your browser. It is free, at no cost.' },
      { title: 'Build and test your system', description: 'Add indicators, run Bar Replay, then open trades with SL and TP.' },
      { title: 'Read the stats and R:R', description: 'Review your backtest statistics and the best R:R recommended for your system.' },
    ],
  },
  workflow: {
    tag: "The right way to trade",
    title: "Five stages before you risk real money",
    subtitle:
      "Most beginners jump straight to the market. Follow this order instead: learn, build a system, prove it, verify it live, and secure your profit.",
    stepWord: "Step",
    hubLabel: "Your edge",
    next: "Next step",
    cta: 'Try ChartLab free',
    note: "Sample data for illustration only. Not financial advice.",
    steps: [
      {
        id: "learn",
        label: "Learn the markets",
        title: "Build your foundation from three angles",
        description:
          "Before any trade, learn to read the market from more than one lens. No single method is enough on its own.",
        points: [
          {
            label: "Technical analysis",
            text: "Read price, trend, support and resistance, and volume to time entries and exits.",
          },
          {
            label: "Fundamental analysis",
            text: "Judge a project’s real value: team, tokenomics, adoption, and the macro picture.",
          },
          {
            label: "On-chain data",
            text: "Follow wallets, exchange flows, and network activity to see what large holders actually do.",
          },
        ],
      },
      {
        id: "system",
        label: "Define your system",
        title: "Turn knowledge into written rules",
        description:
          "Combine what you learned into one trading system with no room for guessing or mood.",
        points: [
          {
            label: "Entry rules",
            text: "The exact conditions that must be true before you buy or sell.",
          },
          {
            label: "Exit and stop loss",
            text: "The price level where the trade idea is proven wrong and you get out.",
          },
          {
            label: "Money management",
            text: "Decide before the first trade how much capital you risk per trade (for example 1%), how big each position is, and when you stop for the day.",
          },
        ],
      },
      {
        id: "backtest",
        label: "Backtest",
        title: "Prove the system on past data",
        description:
          'Run your rules in ChartLab with Bar Replay, trade by trade. Read the statistics and find the best R:R. Only a system that survives the numbers moves on.',
        points: [
          {
            label: 'Backtest statistics', text: 'Check the statistics, for example win rate and worst drawdown, and whether your money management keeps it survivable.',
          },
          {
            label: 'Best R:R', text: 'ChartLab recommends the best risk:reward ratio for the system you built. Treat it as a guide, not a promise.',
          },
          {
            label: "Not profitable yet?",
            text: "Go back to step 2, adjust the rules, and test again before risking a cent.",
          },
        ],
      },
      {
        id: "live",
        label: "Real market",
        title: "Go live and verify the system",
        description:
          "Past results are no guarantee. Trade the real market with the rules you already wrote, and compare what happens with the backtest.",
        points: [
          {
            label: "Verify in real conditions",
            text: "Check that fills, fees, and slippage match what the backtest assumed.",
          },
          {
            label: "Follow the rules",
            text: "No changing the plan mid-trade because of fear or excitement.",
          },
          {
            label: "Keep a journal",
            text: "Record every trade so you can compare real results with the backtest.",
          },
        ],
      },
      {
        id: "profit",
        label: "Take profit",
        title: "Secure the gains you earned",
        description:
          "A profit you never take is only a number on a screen. Plan your exits before you enter.",
        points: [
          {
            label: "Scale out in levels",
            text: "Take part of the position at TP1, TP2, and TP3 instead of all or nothing.",
          },
          {
            label: "Trail your stop",
            text: "Move the stop behind price so winners are protected.",
          },
          {
            label: "Review and repeat",
            text: "Review the journal, refine the rules where results drifted, and run the cycle again.",
          },
        ],
      },
    ],
  },
  offer: {
    title: 'Sharper analysis. Tested systems. Free.',
    subtitle: 'ChartLab brings market analysis and backtesting together in one free platform.',
  },
  chartlabPage: {
    title: "ChartLab — Free Crypto Trading Platform",
    description: "Analyze the crypto market, backtest your system, and find the best R:R in ChartLab. Every feature is free.",
    loading: "Loading ChartLab…",
    fallback: "ChartLab could not load on this page. Open it in a new tab to use it directly.",
    openNewTab: "Open in a new tab",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    credit: "Chart by Vela (LuxAlgo)",
  },
  footer: { note: "© Disatu. Educational content, not financial advice." },
};
