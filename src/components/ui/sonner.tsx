"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Emerald-themed Toaster — globally styled so ALL toast() calls
 * automatically get Emerald success, red error colours, no need
 * to pass style to each individual toast.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      richColors={false}
      className="toaster group"
      toastOptions={{
        style: {
          fontFamily: "inherit",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "12px",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
          border: "none",
          padding: "14px 18px",
        },
        classNames: {
          toast: "items-start gap-3",
          title: "text-[14px] font-semibold leading-tight",
          description: "text-[12px] opacity-80 mt-0.5",
          closeButton: "!bg-white/20 !border-none !text-white hover:!scale-110 transition",
        },
      }}
      style={{
        // ── Success ─────────────────────────────────────────────────────────
        "--success-bg": "#059669",
        "--success-text": "#ffffff",
        "--success-border": "transparent",

        // ── Error ────────────────────────────────────────────────────────────
        "--error-bg": "#dc2626",
        "--error-text": "#ffffff",
        "--error-border": "transparent",

        // ── Info (default) ──────────────────────────────────────────────────
        "--normal-bg": "#111827",
        "--normal-text": "#ffffff",
        "--normal-border": "transparent",

        // ── Warning ─────────────────────────────────────────────────────────
        "--warning-bg": "#d97706",
        "--warning-text": "#ffffff",
        "--warning-border": "transparent",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
