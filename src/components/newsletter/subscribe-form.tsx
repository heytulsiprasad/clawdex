"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SubscribeSource = "hero" | "footer" | "popup";

interface SubscribeFormProps {
  source: SubscribeSource;
  variant?: "hero" | "footer";
}

export function SubscribeForm({ source, variant = "hero" }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setMessage(
        data.message === "Already subscribed"
          ? "You're already subscribed!"
          : "You're in. We'll send the best new use cases weekly."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p className="text-[13px] font-medium text-amber-600">
        {message}
      </p>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit}>
        <p className="mb-2 text-[13px] font-medium text-foreground/80">
          Weekly use case roundup
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-8 w-full max-w-[220px] rounded-md border border-stone-200 bg-white px-3 text-[13px] text-foreground placeholder:text-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-1 focus:ring-amber-400/10"
          />
          <Button
            type="submit"
            size="sm"
            disabled={status === "loading"}
            className="h-8 bg-stone-100 text-foreground/80 hover:bg-stone-200 hover:text-foreground border border-stone-200 text-[13px]"
          >
            {status === "loading" ? "..." : "→"}
          </Button>
        </div>
        {status === "error" && (
          <p className="mt-1.5 text-[12px] text-red-500">{message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-2">
      <div className="flex gap-2 justify-center">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 w-full max-w-[260px] rounded-lg border border-stone-200 bg-white px-3.5 text-[13px] text-foreground placeholder:text-stone-400 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[13px] hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-md transition-all"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-[12px] text-red-500">{message}</p>
      )}
    </form>
  );
}
