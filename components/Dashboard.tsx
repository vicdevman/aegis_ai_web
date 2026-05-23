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
  Wallet,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
  LayoutDashboard,
  History,
  Info,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

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
  icon: React.ComponentType<any>;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300/60 dark:hover:border-slate-700/60">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-slate-200 dark:ring-white/5">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1 wrap-break-word max-w-full">
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
          currencies: (status as any).currencies || [],
          summary: "",
        });
      }
    };

    let mounted = true;
    const fetchInitial = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [statusRes, positionsRes] = await Promise.allSettled([api.status(), api.positions()]);
        if (!mounted) return;

        if (statusRes.status === "fulfilled") {
          setServerStatus(statusRes.value);
          updatePortfolioFromStatus(statusRes.value);
        } else {
          setLoadError("Failed to load server status");
        }

        if (positionsRes.status === "fulfilled") {
          const positions = positionsRes.value;
          if (Array.isArray(positions)) {
            const posMap = positions.reduce((acc: Record<string, Position>, pos: Position) => {
              acc[pos.id] = pos;
              return acc;
            }, {});
            setPositions(posMap);
          }
        } else {
          setLoadError((e) => (e ? e + "; failed to load positions" : "Failed to load positions"));
        }
      } catch (e) {
        setLoadError("Unexpected error while loading data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInitial();

    // Poll status every 5 seconds
    const t = setInterval(async () => {
      try {
        const status = await api.status();
        if (mounted) {
          setServerStatus(status);
          updatePortfolioFromStatus(status);
        }
      } catch (e) {
        // ignore polling errors, keep last good state
      }
    }, 5000);
    return () => { mounted = false; clearInterval(t); };
  }, [setPortfolio, setPositions]);

  const pnlColor =
    (state.dailyPnL ?? 0) >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";
  const activePos = Object.values(state.positions);

  // Fallback formatter when backend doesn't provide `_formatted`
  const formatPrice = (n: number | undefined) => {
    if (n == null || Number.isNaN(n)) return "—";
    const abs = Math.abs(n);
    if (abs >= 1) return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-indigo-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      {/* Header with Centered Navigation - Desktop */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo-bg.ico"
                alt="aegisAi"
                width={500}
                height={500}
                className="w-5 h-5 block dark:hidden"
              />
              <Image
                src="/logo-bg.ico"
                alt="aegisAi"
                width={500}
                height={500}
                className="w-5 h-5 hidden dark:block"
              />
              <span className="font-semibold tracking-tight">Aegis</span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-full p-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <History size={16} />
                History
              </Link>
            </nav>

            {/* Status */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hidden sm:block">Live</span>
              </div>
              <span className="hidden lg:inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-white/10">
                {(serverStatus["mode"] as string) ?? "paper"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/50 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-900 dark:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link
            href="/history"
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <History size={20} />
            <span className="text-[10px] font-medium">History</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-20 md:pb-8">
        {loadError && (
          <div className="rounded-xl p-3 bg-rose-50 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-rose-600" />
              <div>
                <div className="text-sm font-semibold text-rose-700">Failed to load initial data</div>
                <div className="text-xs text-rose-600">{loadError}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // re-trigger effect by calling fetch via simple page reload alternative
                  // but better trigger same fetch: call api again
                  setLoading(true);
                  setLoadError(null);
                  api.status()
                    .then((s) => {
                      setServerStatus(s);
                      if (typeof (s as any).portfolioBalance === "number") {
                        setPortfolio({
                          message: `Portfolio balance: $${(s as any).portfolioBalance.toFixed(2)} USD`,
                          balance: (s as any).portfolioBalance,
                          currencies: (s as any).currencies || [],
                          summary: "",
                        });
                      }
                    })
                    .catch(() => setLoadError("Retry failed"))
                    .finally(() => setLoading(false));
                }}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {loading ? (
            // Skeleton placeholders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/40 p-6 h-24" />
            ))
          ) : (
            <>
              <MetricCard
                label="Balance"
                value={state.portfolio?.balance != null ? `$${state.portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                sub={state.portfolio?.summary}
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
            </>
          )}
        </div>

        {/* Assets breakdown (shows all currency balances from portfolio) */}
        {Array.isArray(state.portfolio?.currencies) && state.portfolio.currencies.length > 0 && (
          <div className="mt-3">
            <section className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Assets</h3>
                <p className="text-xs text-slate-500">Full breakdown</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {state.portfolio.currencies.map((c) => (
                  <div key={c.currency} className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left">
                    <div className="text-xs text-slate-500">{c.currency}</div>
                    <div className="font-medium text-sm text-slate-900 dark:text-white wrap-break-word">{Number(c.total).toLocaleString(undefined, { maximumFractionDigits: 8 })}</div>
                    {typeof c.free === 'number' || typeof c.used === 'number' ? (
                      <div className="text-[11px] text-slate-500 mt-1">
                        {typeof c.free === 'number' ? `free: ${c.free}` : ''} {typeof c.used === 'number' ? `used: ${c.used}` : ''}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

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
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto font-mono text-[10px] sm:text-xs space-y-2 sm:space-y-3 max-h-100 sm:max-h-150 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ))}
                  </div>
                ) : state.logs.length === 0 ? (
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
                      <span className="text-slate-700 dark:text-slate-300 wrap-break-word text-xs sm:text-sm leading-relaxed pt-0.5">
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
                  <Zap size={16} className="sm:w-4.5 sm:h-4.5 group-hover:animate-pulse" />
                  <span className="hidden sm:inline">Start Bot</span>
                  <span className="sm:hidden">Start</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      setPassword("");
                      setPasswordError("");
                    }}
                    className="group relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium tracking-wide border transition-all bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/30 hover:scale-[1.02] cursor-pointer text-sm sm:text-base"
                  >
                    <Power size={16} className="sm:w-4.5 sm:h-4.5" />
                    <span className="hidden sm:inline">Stop Bot</span>
                    <span className="sm:hidden">Stop</span>
                  </button>

                  {/* Password Popup */}
                  {isPasswordModalOpen && (
                    <div className="absolute top-full left-0 mt-2 z-50 w-64 sm:w-72 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        Enter password to stop bot
                      </p>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (password === "vicdevman123") {
                              setIsPasswordModalOpen(false);
                              setPassword("");
                              api.stopBot().then(() => api.status().then(setServerStatus));
                            } else {
                              setPasswordError("Wrong password");
                            }
                          }
                        }}
                        placeholder="Password..."
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg py-2 px-3 text-sm outline-none transition-all mb-2"
                        autoFocus
                      />
                      {passwordError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 mb-2">
                          {passwordError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsPasswordModalOpen(false);
                            setPassword("");
                            setPasswordError("");
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (password === "vicdevman123") {
                              setIsPasswordModalOpen(false);
                              setPassword("");
                              api.stopBot().then(() => api.status().then(setServerStatus));
                            } else {
                              setPasswordError("Wrong password");
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  )}
                </div>
             
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
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="h-20 rounded-lg bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
                    ))}
                  </div>
                ) : activePos.length === 0 ? (
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
                              ${pos._formatted?.entryPrice ?? formatPrice(pos.entryPrice)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              Current
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              ${pos._formatted?.currentPrice ?? formatPrice(pos.currentPrice ?? pos.entryPrice)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              SL / TP
                            </span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">
                              ${pos._formatted?.stopLoss ?? formatPrice(pos.stopLoss)} / ${pos._formatted?.takeProfit ?? formatPrice(pos.takeProfit)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wider">
                              PnL
                            </span>
                            <span
                              className={clsx(
                                "font-semibold",
                                (pos.pnl ?? 0) >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              {pos._formatted?.pnl ?? `${(pos.pnl ?? 0) >= 0 ? '+' : ''}$${(pos.pnl ?? 0).toFixed(4)}`}
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
                  <span className="text-slate-700 dark:text-slate-200 wrap-break-word leading-relaxed flex-1 text-xs sm:text-sm pl-0 sm:pl-0">
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
