"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  preventClose?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, preventClose = false }: ModalProps) => {
  // Close on Escape key (disabled when preventClose is true)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!preventClose && e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, preventClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!preventClose ? onClose : undefined}
            className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/90 backdrop-blur-sm"
          />
          
          {/* Modal Container - Full screen on mobile, centered on larger screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            className="relative w-full h-full sm:max-w-6xl sm:h-[90vh] md:h-[85vh] flex flex-col bg-white dark:bg-slate-900 sm:rounded-2xl border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
            {/* Header - More compact on mobile */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
              <div className="flex flex-col min-w-0 flex-1 mr-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  {title}
                </h3>
              </div>
              {!preventClose && (
                <button
                  onClick={onClose}
                  className="group p-2 sm:p-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 shrink-0"
                  aria-label="Close"
                >
                  <X size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>
            
            {/* Content - Adjusted padding for mobile */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent min-h-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
