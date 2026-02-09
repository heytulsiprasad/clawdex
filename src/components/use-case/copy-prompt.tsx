"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyPromptProps {
  prompt: string;
  className?: string;
}

export function CopyPrompt({ prompt, className }: CopyPromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = prompt;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/80 to-white overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-amber-200/60 bg-amber-50/50">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-amber-600" />
          <span className="text-[13px] font-semibold text-amber-800">
            Copy to Your Agent
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1",
            "active:scale-[0.97]",
            copied
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-amber-300 bg-white text-amber-700 hover:bg-amber-100 hover:border-amber-400 cursor-pointer"
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Prompt content */}
      <div className="px-5 py-4">
        <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-stone-700 font-mono">
          {prompt}
        </pre>
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t border-amber-100 bg-amber-50/30">
        <p className="text-[11px] text-amber-600/70">
          Paste this to your OpenClaw agent via WhatsApp, Telegram, Discord, or
          any chat
        </p>
      </div>
    </div>
  );
}

// Compact version for use on browse cards
export function QuickCopyButton({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // silent fail
      }
    },
    [prompt]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy prompt"}
      className={cn(
        "relative flex items-center justify-center rounded-md border p-1.5",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400",
        "active:scale-[0.92] active:duration-75",
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border-stone-200 bg-stone-50/80 text-stone-500 hover:border-amber-200 hover:bg-amber-50/60 hover:text-amber-600",
        className
      )}
    >
      {copied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
