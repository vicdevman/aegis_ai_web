"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  ArrowRight,
  Activity,
  Lock,
  Globe,
  Cpu,
  Target,
  Wallet,
  Clock,
} from "lucide-react";
import Image from "next/image";

interface LandingPageProps {
  onEnter: () => void;
}

const easing = [0.23, 1, 0.32, 1];

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[80px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <Image
              src="/logo_color_white.png"
              alt="aegisAi"
              width={500}
              height={500}
              className="w-5 h-5"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">aegis</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
          <button 
            onClick={onEnter}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            className="text-center"
          >
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-sm text-slate-400">Autonomous Trading Intelligence</span>
            </div> */}

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
              <span className="text-slate-100">Your capital,</span>
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-violet-400 to-emerald-400">
                automated.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Aegis AI monitors markets, analyzes patterns, and executes trades 
              with institutional-grade risk management.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onEnter}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-medium hover:scale-[1.02] transition-transform"
              >
                See It In Action
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              {/* <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Lock size={14} />
                <span>Paper trading available</span>
              </div> */}
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easing }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]"
          >
            {[
              { value: "24/7", label: "Active" },
              { value: "<1s", label: "Latency" },
              { value: "Paper/Live", label: "Modes" },
              { value: "BTC/ETH/SOL", label: "Assets" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0f] px-4 py-5 text-center">
                <div className="text-xl font-semibold text-slate-200">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative z-10 px-6 lg:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-2">Core Systems</h2>
            <p className="text-slate-500">Built for precision execution</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large Card - Strategy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Cpu size={20} className="text-cyan-400" />
                </div>
      
              </div>
              <h3 className="text-lg font-medium mb-2">AI Strategy Engine</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Machine learning models analyze market microstructure, identify optimal entry points, 
                and adapt to changing conditions in real-time.
              </p>
            </motion.div>

            {/* Small Card - Risk */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <Shield size={20} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Risk Router</h3>
              <p className="text-sm text-slate-500">
                Position sizing, stop-loss, and take-profit calculated per-trade.
              </p>
            </motion.div>

            {/* Small Card - Execution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Zap size={20} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Execution</h3>
              <p className="text-sm text-slate-500">
                Direct Kraken API integration for sub-second order placement.
              </p>
            </motion.div>

            {/* Large Card - Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Wallet size={20} className="text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400">Real-time</span>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Live Portfolio</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Track balance, open positions, PnL, and trade history with live WebSocket updates 
                every second from the exchange.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-violet-500/10 to-emerald-500/10" />
            <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl" />
            
            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />
            <div className="absolute inset-[-1px] rounded-3xl bg-linear-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20 blur-sm -z-10" />
            
            <div className="relative p-8 lg:p-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Activity size={14} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">System Online</span>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-semibold mb-3">
                Ready to see it work?
              </h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Watch live market analysis, position tracking, and automated execution 
                in the dashboard.
              </p>
              
              <button
                onClick={onEnter}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-medium hover:scale-[1.02] transition-transform"
              >
                Launch Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Globe size={14} />
            <span>Kraken Exchange</span>
          </div>
          <div className="text-slate-600 text-sm">
            2026 Aegis
          </div>
        </div>
      </footer>
    </div>
  );
}
