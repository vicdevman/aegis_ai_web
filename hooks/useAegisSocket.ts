"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { AegisEvent, MarketData, Position, BotState, PortfolioUpdatePayload, SystemMessagePayload, TradeOpenedPayload, TradeClosedPayload, PositionUpdatePayload, BotStatusPayload } from "@/types";

const WS_URL = process.env["NEXT_PUBLIC_WS_URL"] ?? "https://aegisai.mooo.com";

export interface LogEntry {
  type: string;
  subType?: string;
  message: string;
  ts: number;
  payload?: unknown;
}

export interface AegisSocketState {
  connected: boolean;
  market: MarketData | null;
  positions: Record<string, Position>;
  botStatus: Partial<BotState>;
  logs: LogEntry[];
  dailyPnL: number;
  portfolio: PortfolioUpdatePayload | null;
}

export function useAegisSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<AegisSocketState>({
    connected: false,
    market: null,
    positions: {},
    botStatus: {},
    logs: [],
    dailyPnL: 0,
    portfolio: null,
  });

  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setState(s => ({ ...s, connected: true }));
    });
    socket.on("disconnect", () => {
      setState(s => ({ ...s, connected: false }));
    });

    // Helper to extract human-readable message from payload
    const extractMessage = (payload: unknown): string => {
      if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
      }
      return JSON.stringify(payload).slice(0, 200);
    };

    // Helper to extract subType from SYSTEM_MESSAGE
    const extractSubType = (payload: unknown): string | undefined => {
      if (payload && typeof payload === "object" && "type" in payload && typeof payload.type === "string") {
        return payload.type;
      }
      return undefined;
    };

    socket.on("aegis_event", (event: AegisEvent) => {
      setState(s => {
        const message = extractMessage(event.payload);
        const subType = extractSubType(event.payload);
        const logEntry: LogEntry = {
          type: event.type,
          subType,
          message,
          ts: event.timestamp,
          payload: event.payload,
        };
        const logs = [logEntry, ...s.logs].slice(0, 200);

        switch (event.type) {
          case "MARKET_UPDATE": {
            const payload = event.payload as { snapshots?: MarketData[]; message: string };
            return { ...s, logs, market: payload.snapshots?.[0] ?? s.market };
          }

          case "PORTFOLIO_UPDATE": {
            const payload = event.payload as PortfolioUpdatePayload;
            return { ...s, logs, portfolio: payload };
          }

          case "SYSTEM_MESSAGE": {
            // SYSTEM_MESSAGE is purely for logging, no state change needed
            return { ...s, logs };
          }

          case "TRADE_OPENED": {
            const payload = event.payload as TradeOpenedPayload;
            const pos = payload.position;
            return { ...s, logs, positions: { ...s.positions, [pos.id]: pos } };
          }

          case "POSITION_UPDATE": {
            const payload = event.payload as PositionUpdatePayload;
            const existing = s.positions[payload.id];
            if (!existing) return { ...s, logs };
            const updated: Position = {
              ...existing,
              currentPrice: payload.currentPrice,
              stopLoss: payload.stopLoss,
              takeProfit: payload.takeProfit,
              pnl: payload.pnl,
              pnlPct: payload.pnlPct,
            };
            return { ...s, logs, positions: { ...s.positions, [payload.id]: updated } };
          }

          case "TRADE_CLOSED": {
            const payload = event.payload as TradeClosedPayload;
            const pos = payload.position;
            const next = { ...s.positions };
            delete next[pos.id];
            return { ...s, logs, positions: next, dailyPnL: s.dailyPnL + (payload.pnl ?? 0) };
          }

          case "BOT_STATUS": {
            const payload = event.payload as BotStatusPayload;
            return { ...s, logs, botStatus: { ...s.botStatus, running: payload.running, mode: payload.mode, strategy: payload.strategy } };
          }

          case "ERROR": {
            // Error events have human-readable messages now
            return { ...s, logs };
          }

          default:
            return { ...s, logs };
        }
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  // Allow external code to set initial positions (e.g., from REST API on load)
  const setPositions = useCallback((positions: Record<string, Position>) => {
    setState(s => ({ ...s, positions }));
  }, []);

  // Allow external code to update portfolio (e.g., from status API)
  const setPortfolio = useCallback((portfolio: PortfolioUpdatePayload) => {
    setState(s => ({ ...s, portfolio }));
  }, []);

  return { state, socket: socketRef.current, setPositions, setPortfolio };
}
