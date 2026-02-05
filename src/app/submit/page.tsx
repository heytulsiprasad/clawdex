"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Link2,
  Mail,
  MessageSquare,
  Twitter,
  Github,
  Youtube,
  Globe,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Send,
  Search,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import type { SourcePlatform } from "@/types";

/* ── Platform detection ─────────────────────────────────────────────────────── */

const PLATFORMS: {
  value: SourcePlatform;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    value: "twitter",
    label: "Twitter / X",
    icon: <Twitter className="size-3" />,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    value: "reddit",
    label: "Reddit",
    icon: <MessageSquare className="size-3" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: <Youtube className="size-3" />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    value: "github",
    label: "GitHub",
    icon: <Github className="size-3" />,
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  {
    value: "other",
    label: "Other",
    icon: <Globe className="size-3" />,
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
  },
];

function detectPlatform(url: string): SourcePlatform | null {
  if (!url) return null;
  if (/x\.com|twitter\.com/i.test(url)) return "twitter";
  if (/reddit\.com/i.test(url)) return "reddit";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/github\.com/i.test(url)) return "github";
  try {
    new URL(url);
    return "other";
  } catch {
    return null;
  }
}

function getPlatformConfig(platform: SourcePlatform) {
  return PLATFORMS.find((p) => p.value === platform) || PLATFORMS[4];
}

/* ── Process steps ──────────────────────────────────────────────────────────── */

const STEPS = [
  {
    icon: <Send className="size-3.5" />,
    title: "Submit",
    desc: "Paste a link to any OpenClaw use case you've found",
  },
  {
    icon: <Search className="size-3.5" />,
    title: "Review",
    desc: "We verify and enrich the submission with metadata",
  },
  {
    icon: <BookOpen className="size-3.5" />,
    title: "Published",
    desc: "It appears in the directory for everyone to discover",
  },
];

/* ── Main component ─────────────────────────────────────────────────────────── */

export default function SubmitPage() {
  const [url, setUrl] = useState("");
  const [platformOverride, setPlatformOverride] = useState<string>("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const detectedPlatform = detectPlatform(url);
  const activePlatform = (platformOverride ||
    detectedPlatform) as SourcePlatform | null;
  const platformConfig = activePlatform
    ? getPlatformConfig(activePlatform)
    : null;

  const canSubmit = url.trim() && detectedPlatform !== null && status !== "loading";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setStatus("loading");
      setErrorMsg("");

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceUrl: url.trim(),
            sourcePlatform: activePlatform,
            submitterEmail: email.trim() || undefined,
            notes: notes.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Submission failed");
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    },
    [canSubmit, url, activePlatform, email, notes]
  );

  const resetForm = () => {
    setUrl("");
    setPlatformOverride("");
    setEmail("");
    setNotes("");
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-50 px-3 py-1">
              <ShieldCheck className="size-3 text-amber-600" />
              <span className="text-[11px] font-medium tracking-wide text-amber-700">
                Community-powered submissions
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
              Submit a Use Case
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Found an OpenClaw use case in the wild? Share the link and
              we&apos;ll add it to the directory with proper credit.
            </p>
          </div>
        </div>

        {/* ── Form Card ────────────────────────────────────── */}
        <div className="mx-auto mt-10 max-w-lg px-4 sm:px-6">
          {status === "success" ? (
            /* ── Success State ───────────────────────────── */
            <div className="rounded-xl border border-stone-200/80 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/60">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                Submission received
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                We&apos;ll review it and add it to the directory shortly.
                {email && " You\u2019ll get a notification when it\u2019s live."}
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="h-9 border-stone-200 text-[13px] text-muted-foreground hover:text-foreground hover:bg-stone-50"
                >
                  Submit another
                </Button>
                <Button
                  asChild
                  className="h-9 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[13px] hover:from-amber-600 hover:to-orange-600 shadow-sm"
                >
                  <Link href="/browse">
                    Browse use cases
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            /* ── Form ────────────────────────────────────── */
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8"
            >
              {/* URL Field */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                  <Link2 className="size-3.5 text-muted-foreground" />
                  Source URL
                  <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://x.com/user/status/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className={cn(
                      "h-10 bg-white border-stone-200 text-[13px] placeholder:text-stone-400 pr-24",
                      "focus-visible:border-amber-400 focus-visible:ring-amber-400/10"
                    )}
                  />
                  {/* Detected platform badge */}
                  {platformConfig && (
                    <div
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all",
                        platformConfig.bg,
                        platformConfig.border,
                        platformConfig.color
                      )}
                    >
                      {platformConfig.icon}
                      {platformConfig.label}
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground/60">
                  Paste a link to a tweet, post, repo, or video
                </p>
              </div>

              {/* Platform Override */}
              <div className="mt-5">
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                  Platform
                  <span className="text-[11px] text-muted-foreground/50">
                    (auto-detected)
                  </span>
                </label>
                <Select
                  value={platformOverride}
                  onValueChange={setPlatformOverride}
                >
                  <SelectTrigger className="h-9 w-full bg-white border-stone-200 text-[13px] text-foreground">
                    <SelectValue placeholder="Override if incorrect" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <span className={p.color}>{p.icon}</span>
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="mt-5">
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                  <Mail className="size-3.5" />
                  Email
                  <span className="text-[11px] text-muted-foreground/50">
                    (optional)
                  </span>
                </label>
                <Input
                  type="email"
                  placeholder="Get notified when published"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 bg-white border-stone-200 text-[13px] placeholder:text-stone-400 focus-visible:border-amber-400 focus-visible:ring-amber-400/10"
                />
              </div>

              {/* Notes */}
              <div className="mt-5">
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                  <MessageSquare className="size-3.5" />
                  Notes
                  <span className="text-[11px] text-muted-foreground/50">
                    (optional)
                  </span>
                </label>
                <textarea
                  placeholder="Any context about this use case..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={cn(
                    "w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-[13px] text-foreground placeholder:text-stone-400 shadow-xs outline-none transition-[color,box-shadow] resize-none",
                    "focus-visible:border-amber-400 focus-visible:ring-amber-400/10 focus-visible:ring-[3px]"
                  )}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-[12px] font-medium text-red-700">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "mt-6 h-10 w-full text-[13px] font-semibold shadow-sm transition-all",
                  "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-md",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                )}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Submit Use Case
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ── Process Steps ────────────────────────────── */}
          <div className="mt-10">
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50">
              How it works
            </p>
            <div className="grid grid-cols-3 gap-3">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="relative rounded-lg border border-stone-200/60 bg-stone-50/50 px-3 py-3 text-center"
                >
                  {/* Step number */}
                  <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white text-muted-foreground">
                    {step.icon}
                  </div>
                  <p className="text-[12px] font-semibold text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/60">
                    {step.desc}
                  </p>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute right-0 top-[26px] hidden h-[1px] w-3 translate-x-full bg-stone-200 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
