"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PositionHistory } from "@/types";
import {
  History,
  BarChart3,
  Target,
  Percent,
  TrendingUp,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [tradeHistory, setTradeHistory] = useState<PositionHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    api.positionHistory().then((history) => {
      if (Array.isArray(history)) {
        setTradeHistory(history as PositionHistory[]);
      }
    }).catch(() => {});
  }, []);

  // Stats
  const totalTrades = tradeHistory.length;
  const winningTrades = tradeHistory.filter((t) => (t.pnl || 0) > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : "0";
  const avgPnl = totalTrades > 0 
    ? (tradeHistory.reduce((sum, t) => sum + (t.pnl || 0), 0) / totalTrades).toFixed(2) 
    : "0.00";
  const totalPnl = tradeHistory.reduce((sum, t) => sum + (t.pnl || 0), 0).toFixed(2);

  // Pagination
  const totalPages = Math.ceil(tradeHistory.length / itemsPerPage);
  const paginatedTrades = tradeHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-indigo-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      {/* Header with Centered Navigation - Desktop */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo_color_black.png"
                alt="aegisAi"
                width={500}
                height={500}
                className="w-5 h-5 block dark:hidden"
              />
              <Image
                src="/logo_color_white.png"
                alt="aegisAi"
                width={500}
                height={500}
                className="w-5 h-5 hidden dark:block"
              />
              <span className="font-semibold tracking-tight">aegis</span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-full p-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
              >
                <History size={16} />
                History
              </Link>
            </nav>

            {/* Status & Mode */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hidden sm:block">Live</span>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/50 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link
            href="/history"
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-900 dark:text-white"
          >
            <History size={20} />
            <span className="text-[10px] font-medium">History</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 md:pb-8">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
            <History size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Trade History</h1>
            <p className="text-sm text-slate-500">Complete record of all closed positions</p>
          </div>
          <span className="ml-auto text-sm text-slate-500">
            {totalTrades} total trades
          </span>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <BarChart3 size={16} />
              <span className="text-xs">Total Trades</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">{totalTrades}</div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <Target size={16} />
              <span className="text-xs">Win Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">{winRate}%</div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <Percent size={16} />
              <span className="text-xs">Avg PnL</span>
            </div>
            <div className={clsx("text-2xl sm:text-3xl font-semibold", Number(avgPnl) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
              ${avgPnl}
            </div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <TrendingUp size={16} />
              <span className="text-xs">Total PnL</span>
            </div>
            <div className={clsx("text-2xl sm:text-3xl font-semibold", Number(totalPnl) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
              ${totalPnl}
            </div>
          </div>
        </motion.div>

        {/* Trades Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
        >
          {tradeHistory.length === 0 ? (
            <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-slate-500">
              <History size={40} className="mb-4 opacity-20" />
              <p className="text-base">No trade history yet</p>
              <p className="text-sm mt-1">Trades will appear here once positions are closed</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="col-span-2">Pair</div>
                <div className="col-span-1">Direction</div>
                <div className="col-span-2">Entry Price</div>
                <div className="col-span-2">Exit Price</div>
                <div className="col-span-2">Close Reason</div>
                <div className="col-span-2 text-right">PnL</div>
                <div className="col-span-1 text-right">Date</div>
              </div>

              {/* Mobile Header */}
              <div className="sm:hidden grid grid-cols-4 gap-2 px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>Pair</div>
                <div>Dir</div>
                <div className="text-right">PnL</div>
                <div className="text-right">Date</div>
              </div>

              {/* Trades */}
              <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {paginatedTrades.map((trade) => {
                  const isProfit = (trade.pnl || 0) >= 0;
                  const isLong = trade.direction === "buy";
                  return (
                    <div
                      key={trade.id}
                      className="grid grid-cols-4 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors items-center"
                    >
                      {/* Pair */}
                      <div className="col-span-1 sm:col-span-2">
                        <span className="font-medium text-sm">{trade.pair}</span>
                      </div>

                      {/* Direction */}
                      <div className="col-span-1 sm:col-span-1">
                        <span className={clsx(
                          "text-[10px] font-medium px-2 py-0.5 rounded",
                          isLong
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                        )}>
                          {isLong ? "LONG" : "SHORT"}
                        </span>
                      </div>

                      {/* Entry - Desktop */}
                      <div className="hidden sm:block col-span-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          ${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Exit - Desktop */}
                      <div className="hidden sm:block col-span-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          ${(trade.currentPrice || trade.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Close Reason - Desktop */}
                      <div className="hidden sm:flex col-span-2">
                        <span className={clsx(
                          "text-[10px] px-2 py-0.5 rounded-full",
                          trade.closeReason === "TAKE_PROFIT" && "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                          trade.closeReason === "STOP_LOSS" && "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400",
                          trade.closeReason === "MANUAL" && "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
                        )}>
                          {trade.closeReason?.replace("_", " ") || "CLOSED"}
                        </span>
                      </div>

                      {/* PnL */}
                      <div className="col-span-1 sm:col-span-2 text-right">
                        <div className={clsx(
                          "text-sm font-semibold",
                          isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        )}>
                          {isProfit ? "+" : ""}${(trade.pnl || 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(trade.pnlPct || 0).toFixed(2)}%
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-1 sm:col-span-1 text-right">
                        <span className="text-xs text-slate-500">
                          {new Date(trade.closedAt || trade.openedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="text-sm text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
