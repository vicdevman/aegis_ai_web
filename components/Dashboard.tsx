"use client";
import { useEffect, useState } from "react";
import { useAegisSocket, LogEntry } from "@/hooks/useAegisSocket";
import { api } from "@/lib/api";
import type { Position } from "@/types";
import {
  Activity,
  Server,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  Power,
  Box,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Terminal,
  Maximize2,
  Search,
  Copy,
  Trash2,
  Wallet,
  Info,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Modal } from "@/components/Modal";
import clsx from "clsx";
import Image from "next/image";

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span className="relative flex h-3 w-3 mr-2">
      {connected && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      )}
      <span
        className={clsx(
          "relative inline-flex rounded-full h-3 w-3",
          connected ? "bg-emerald-500" : "bg-rose-500",
        )}
      ></span>
    </span>
  );
}

// Color-coded badge styling for log types
const getLogBadgeStyle = (log: LogEntry): string => {
  const baseClasses = "shrink-0 font-semibold text-[10px] uppercase tracking-wider px-2 py-1 rounded-md";

  // First check subType for SYSTEM_MESSAGE events
  if (log.type === "SYSTEM_MESSAGE" && log.subType) {
    const subTypeStyles: Record<string, string> = {
      info: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
      opportunity: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      submitting: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
      approved: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      opening: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
      opened: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      skip: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
      watcher_started: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
      watcher_stopped: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
      break_even: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
    };
    return clsx(baseClasses, subTypeStyles[log.subType] || subTypeStyles.info);
  }

  // Main event type styles
  const typeStyles: Record<string, string> = {
    BOT_STATUS: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
    PORTFOLIO_UPDATE: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    MARKET_UPDATE: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    SYSTEM_MESSAGE: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
    TRADE_OPENED: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    TRADE_CLOSED: "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400",
    POSITION_UPDATE: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
    ERROR: "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400",
    RISK_APPROVED: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    RISK_REJECTED: "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400",
  };
  return clsx(baseClasses, typeStyles[log.type] || "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400");
};

// Get icon for log entry
const getLogIcon = (log: LogEntry) => {
  if (log.type === "ERROR") return <AlertCircle size={14} />;
  if (log.type === "TRADE_OPENED") return <Play size={14} />;
  if (log.type === "TRADE_CLOSED") return <CheckCircle2 size={14} />;
  if (log.type === "PORTFOLIO_UPDATE") return <Wallet size={14} />;
  if (log.type === "MARKET_UPDATE") return <Activity size={14} />;
  if (log.type === "SYSTEM_MESSAGE") {
    const iconMap: Record<string, React.ReactNode> = {
      opportunity: <Sparkles size={14} />,
      approved: <CheckCircle2 size={14} />,
      submitting: <Zap size={14} />,
      skip: <Pause size={14} />,
      break_even: <ShieldCheck size={14} />,
    };
    return iconMap[log.subType || ""] || <Info size={14} />;
  }
  return <Info size={14} />;
};

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300/60 dark:hover:border-slate-700/60">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-slate-200 dark:ring-white/5">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          {value}
        </h3>
        {sub && (
          <p
            className={clsx(
              "text-sm font-medium flex items-center gap-1",
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trend === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400",
            )}
          >
            {trend === "up" && <ArrowUpRight size={14} />}
            {trend === "down" && <ArrowDownRight size={14} />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { state, setPositions, setPortfolio } = useAegisSocket();
  const [serverStatus, setServerStatus] = useState<Record<string, unknown>>({});
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = state.logs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.subType?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Helper to update portfolio from status response
    const updatePortfolioFromStatus = (status: Record<string, unknown>) => {
      if (typeof status.portfolioBalance === "number") {
        setPortfolio({
          message: `Portfolio balance: $${status.portfolioBalance.toFixed(2)} USD`,
          balance: status.portfolioBalance,
          currencies: {},
          summary: "",
        });
      }
    };

    // Load initial data on mount
    api.status().then((status) => {
      setServerStatus(status);
      updatePortfolioFromStatus(status);
    }).catch(() => {});
    api.positions().then((positions) => {
      if (Array.isArray(positions)) {
        const posMap = positions.reduce((acc: Record<string, Position>, pos: Position) => {
          acc[pos.id] = pos;
          return acc;
        }, {});
        setPositions(posMap);
      }
    }).catch(() => {});

    // Poll status every 5 seconds
    const t = setInterval(
      () => api.status().then((status) => {
        setServerStatus(status);
        updatePortfolioFromStatus(status);
      }).catch(() => {}),
      5000,
    );
    return () => clearInterval(t);
  }, [setPortfolio, setPositions]);

  const pnlColor =
    (state.dailyPnL ?? 0) >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";
  const activePos = Object.values(state.positions);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-indigo-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo_color_black.png"
              alt="aegisAi Logo"
              width={500}
              height={500}
              className="w-5 h-5 block dark:hidden"
            />
            <Image
              src="/logo_color_white.png"
              alt="aegisAi Logo"
              width={500}
              height={500}
              className="w-5 h-5 hidden dark:block"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              aegisAi
            </span>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-white/10 transition-colors">
            {(serverStatus["mode"] as string) ?? "paper"}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 px-3 sm:px-4 py-2 rounded-full ring-1 ring-slate-200 dark:ring-white/5 transition-colors">
            <StatusDot connected={state.connected} />
            <span className="hidden sm:inline">{state.connected ? "System Online" : "Disconnected"}</span>
            <span className="sm:hidden">{state.connected ? "Online" : "Offline"}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* <MetricCard
            label="BTC Price"
            value={
              state.market
                ? `$${Number(state.market.price).toLocaleString()}`
                : "—"
            }
            sub="XBTUSD"
            icon={Activity}
          /> */}
          <MetricCard
            label="Balance"
            value={state.portfolio?.balance != null ? `$${state.portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
            sub={state.portfolio?.summary || "Waiting..."}
            icon={Wallet}
          />
          <MetricCard
            label="Daily PnL"
            value={`$${state.dailyPnL.toFixed(2)}`}
            sub={state.dailyPnL >= 0 ? "Today" : "Today"}
            icon={state.dailyPnL >= 0 ? TrendingUp : TrendingDown}
            trend={state.dailyPnL >= 0 ? "up" : "down"}
          />
          <MetricCard
            label="Positions"
            value={String(activePos.length)}
            sub={`${serverStatus["activeWatchers"] ?? 0} watchers`}
            icon={Box}
          />
          <MetricCard
            label="Server Uptime"
            value={`${serverStatus["uptime"] ?? 0}s`}
            sub="Bot Instance"
            icon={Server}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">


   {/* Side Column: Log */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <section className="h-full flex flex-col rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 overflow-hidden ring-1 shadow-slate-200 dark:shadow-none ring-slate-100 dark:ring-white/5 transition-colors">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Terminal
                    className="text-indigo-600 dark:text-indigo-400"
                    size={16}
                  />
                  <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                    System Logs
                  </h2>
                </div>
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95"
                  title="Expand Logs"
                >
                  <Maximize2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto font-mono text-[10px] sm:text-xs space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {state.logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-slate-400 dark:text-slate-600">
                    <Clock size={18} className="sm:w-5 sm:h-5 mb-2 opacity-50" />
                    <span className="text-xs sm:text-sm">Awaiting system events...</span>
                  </div>
                ) : (
                  state.logs.slice(0, 30).map((log, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 sm:gap-3 opacity-90 hover:opacity-100 transition-opacity group"
                    >
                      <span className="text-slate-400 dark:text-slate-500 shrink-0 text-[9px] sm:text-[10px] tabular-nums pt-1">
                        [{new Date(log.ts).toLocaleTimeString()}]
                      </span>
                      <span className={getLogBadgeStyle(log)}>
                        {log.subType && log.type === "SYSTEM_MESSAGE" ? log.subType : log.type}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 break-words text-xs sm:text-sm leading-relaxed pt-0.5">
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Controls & Positions */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Bot Controls */}
            <section className="p-4 sm:p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm transition-colors">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <SlidersHorizontal
                  className="text-slate-600 dark:text-slate-400"
                  size={18}
                />
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Execution Controls
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() =>
                    api
                      .startBot()
                      .then(() => api.status().then(setServerStatus))
                  }
                  className="group relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium tracking-wide border transition-all bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:scale-[1.02] cursor-pointer text-sm sm:text-base"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px] group-hover:animate-pulse" />
                  <span className="hidden sm:inline">Start Bot</span>
                  <span className="sm:hidden">Start</span>
                </button>
                <button
                  onClick={() =>
                    api.stopBot().then(() => api.status().then(setServerStatus))
                  }
                  className="group relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium tracking-wide border transition-all bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/30 hover:scale-[1.02] cursor-pointer text-sm sm:text-base"
                >
                  <Power size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Stop Bot</span>
                  <span className="sm:hidden">Stop</span>
                </button>
             
              </div>
            </section>

            {/* Active Positions */}
            <section>
              <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
                <Box className="text-slate-600 dark:text-slate-400" size={18} />
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Active Positions
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {activePos.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700/50 flex flex-col items-center justify-center text-slate-500">
                    <Box size={28} className="sm:w-8 sm:h-8 mb-3 opacity-20" />
                    <p className="text-xs sm:text-sm font-medium">No active positions</p>
                  </div>
                ) : (
                  activePos.map((pos) => {
                    const currentPnl = pos.pnl ?? 0;
                    const isLong = pos.direction === "buy";
                    return (  
                      <div
                        key={pos.id}
                        className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-y-4 sm:gap-x-6"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={clsx(
                              "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest",
                              isLong
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
                            )}
                          >
                            {pos.direction}
                          </div>
                          <span className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                            {pos.pair}
                          </span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              Entry
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              ${pos.entryPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              Current
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              ${(pos.currentPrice ?? pos.entryPrice).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              SL / TP
                            </span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">
                              ${pos.stopLoss.toFixed(0)} / ${pos.takeProfit.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              PnL
                            </span>
                            <span
                              className={clsx(
                                "font-semibold",
                                currentPnl >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              {currentPnl >= 0 ? "+" : ""}${currentPnl.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

       
        </div>
      </main>

      {/* Expanded Logs Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Extended System Intelligence Logs"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Modal Header Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 sticky pt-2 sm:pt-4 -top-4 sm:-top-6 z-10 bg-white dark:bg-slate-900/80 backdrop-blur-md pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/50 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const logText = state.logs
                    .map((l) => `[${new Date(l.ts).toLocaleString()}] ${l.type}: ${l.message}`)
                    .join("\n");
                  navigator.clipboard.writeText(logText);
                }}
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm transition-all active:scale-95"
              >
                <Copy size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Copy All</span>
                <span className="sm:hidden">Copy</span>
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-1.5 sm:space-y-2 font-mono text-xs sm:text-sm">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-slate-400">
                <Search size={32} className="sm:w-10 sm:h-10 mb-3 sm:mb-4 opacity-20" />
                <p className="text-sm sm:text-base">No logs found matching your search</p>
              </div>
            ) : (
              filteredLogs.map((log, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 tabular-nums text-[10px] sm:text-xs">
                      [{new Date(log.ts).toLocaleString()}]
                    </span>
                    <span className={clsx(getLogBadgeStyle(log), "flex items-center gap-1 py-0.5 sm:py-1 text-[10px] sm:text-xs")}>
                      {getLogIcon(log)}
                      <span className="hidden sm:inline">{log.subType && log.type === "SYSTEM_MESSAGE" ? log.subType : log.type}</span>
                      <span className="sm:hidden">{log.subType && log.type === "SYSTEM_MESSAGE" ? log.subType.slice(0, 8) : log.type.slice(0, 8)}</span>
                    </span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 break-words leading-relaxed flex-1 text-xs sm:text-sm pl-0 sm:pl-0">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
