"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Code,
  Home,
  PenTool,
  Target,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/use-case/bookmark-button";
import { cn } from "@/lib/utils";
import type { UseCaseCard } from "@/types";

// Role options with icons
const ROLES = [
  {
    id: "business-owner",
    label: "Business Owner",
    icon: Briefcase,
    description: "Automate operations",
  },
  {
    id: "marketing-sales",
    label: "Marketing / Sales",
    icon: TrendingUp,
    description: "Grow your reach",
  },
  {
    id: "developer",
    label: "Developer",
    icon: Code,
    description: "Build smarter tools",
  },
  {
    id: "home-enthusiast",
    label: "Home Enthusiast",
    icon: Home,
    description: "Smart home automation",
  },
  {
    id: "content-creator",
    label: "Content Creator",
    icon: PenTool,
    description: "Create effortlessly",
  },
  {
    id: "productivity-nerd",
    label: "Productivity Nerd",
    icon: Target,
    description: "Optimize everything",
  },
] as const;

// Quick-pick suggestions for step 2
const QUICK_PICKS = [
  "Automate emails",
  "Schedule social posts",
  "Manage my calendar",
  "Organize files & notes",
  "Monitor my home",
  "Analyze data",
] as const;

// Complexity config matching the use case page
const COMPLEXITY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: {
    label: "Beginner",
    className: "text-emerald-700 border-emerald-200 bg-emerald-50",
  },
  intermediate: {
    label: "Intermediate",
    className: "text-blue-700 border-blue-200 bg-blue-50",
  },
  advanced: {
    label: "Advanced",
    className: "text-purple-700 border-purple-200 bg-purple-50",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  amber: "text-amber-700 bg-amber-50 border-amber-200",
  blue: "text-blue-700 bg-blue-50 border-blue-200",
  green: "text-emerald-700 bg-emerald-50 border-emerald-200",
  purple: "text-purple-700 bg-purple-50 border-purple-200",
  pink: "text-pink-700 bg-pink-50 border-pink-200",
  cyan: "text-cyan-700 bg-cyan-50 border-cyan-200",
  orange: "text-orange-700 bg-orange-50 border-orange-200",
  slate: "text-slate-700 bg-slate-50 border-slate-200",
  indigo: "text-indigo-700 bg-indigo-50 border-indigo-200",
  rose: "text-rose-700 bg-rose-50 border-rose-200",
};

type WizardStep = 1 | 2 | 3;

interface WizardState {
  step: WizardStep;
  role: string | null;
  description: string;
  results: UseCaseCard[] | null;
  isLoading: boolean;
}

interface WorkflowWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowWizard({ isOpen, onClose }: WorkflowWizardProps) {
  const [state, setState] = React.useState<WizardState>({
    step: 1,
    role: null,
    description: "",
    results: null,
    isLoading: false,
  });

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setState({
        step: 1,
        role: null,
        description: "",
        results: null,
        isLoading: false,
      });
    }
  }, [isOpen]);

  const handleRoleSelect = (roleId: string) => {
    setState((prev) => ({ ...prev, role: roleId, step: 2 }));
  };

  const handleQuickPick = (suggestion: string) => {
    setState((prev) => ({ ...prev, description: suggestion }));
  };

  const handleFindWorkflows = async () => {
    if (!state.description.trim()) return;

    setState((prev) => ({ ...prev, isLoading: true, step: 3 }));

    try {
      const response = await fetch("/api/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: state.role,
          description: state.description,
        }),
      });

      const data = await response.json();
      setState((prev) => ({ ...prev, results: data.results, isLoading: false }));
    } catch (error) {
      console.error("Failed to fetch results:", error);
      setState((prev) => ({ ...prev, results: [], isLoading: false }));
    }
  };

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as WizardStep,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-h-[90vh] bg-[#fafaf8] border-stone-200 transition-[max-width] duration-300",
          state.step === 3 ? "max-w-5xl" : "max-w-2xl",
          state.step === 3 ? "overflow-hidden flex flex-col" : "overflow-y-auto"
        )}
        showCloseButton={false}
      >
          {/* Custom close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  state.step === stepNum
                    ? "bg-amber-600 w-6"
                    : state.step > stepNum
                    ? "bg-amber-400"
                    : "bg-stone-300"
                )}
              />
            ))}
          </div>

          {/* Step 1: Role selection */}
          {state.step === 1 && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-stone-900 mb-2">
                  What's your role?
                </h2>
                <p className="text-sm text-stone-600">
                  Help us find the perfect workflows for you
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={cn(
                        "group relative flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all",
                        "bg-white hover:bg-amber-50/50 hover:border-amber-300",
                        "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                        "border-stone-200"
                      )}
                    >
                      <div className="p-3 rounded-full bg-stone-100 group-hover:bg-amber-100 transition-colors">
                        <Icon className="w-6 h-6 text-stone-700 group-hover:text-amber-700" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-stone-900 text-sm mb-0.5">
                          {role.label}
                        </div>
                        <div className="text-xs text-stone-600">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Description input */}
          {state.step === 2 && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-stone-900 mb-2">
                  What would you like to automate?
                </h2>
                <p className="text-sm text-stone-600">
                  Describe your ideal workflow in a few words
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={state.description}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="e.g., I want to automatically send Slack messages when I get important emails"
                  className={cn(
                    "w-full min-h-[120px] px-4 py-3 rounded-lg border border-stone-300",
                    "bg-white text-stone-900 placeholder:text-stone-400",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                    "resize-none"
                  )}
                  autoFocus
                />

                {/* Quick picks */}
                <div className="space-y-2">
                  <p className="text-xs text-stone-600 font-medium">
                    Or choose a quick pick:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PICKS.map((pick) => (
                      <button
                        key={pick}
                        onClick={() => handleQuickPick(pick)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          "border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-300",
                          "text-stone-700 hover:text-amber-700",
                          "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        )}
                      >
                        {pick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleFindWorkflows}
                  disabled={!state.description.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Find Workflows
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {state.step === 3 && (
            <div className="flex flex-col min-h-0 flex-1 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              {/* Fixed header */}
              <div className="text-center shrink-0 pb-4">
                <h2 className="text-2xl font-semibold text-stone-900 mb-2">
                  {state.isLoading ? "Finding workflows..." : "Your Matches"}
                </h2>
                <p className="text-sm text-stone-600">
                  {state.isLoading
                    ? "Searching our directory for the best matches"
                    : `We found ${state.results?.length || 0} workflows for you`}
                </p>
              </div>

              {state.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                </div>
              ) : state.results && state.results.length > 0 ? (
                <>
                  {/* Scrollable results grid */}
                  <div className="overflow-y-auto min-h-0 flex-1 -mx-1 px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {state.results.map((useCase) => (
                        <Link
                          key={useCase.id}
                          href={`/use-case/${useCase.slug}`}
                          onClick={onClose}
                          className="block group"
                        >
                          <div className="h-full p-4 rounded-lg border border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug text-sm line-clamp-2">
                                {useCase.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-medium shrink-0",
                                  COMPLEXITY_CONFIG[useCase.complexity].className
                                )}
                              >
                                {COMPLEXITY_CONFIG[useCase.complexity].label}
                              </Badge>
                            </div>
                            <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                              {useCase.description}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold uppercase",
                                  CATEGORY_COLORS[useCase.category.color] ||
                                    CATEGORY_COLORS.amber
                                )}
                              >
                                {useCase.category.name}
                              </Badge>
                              <div className="flex items-center gap-1.5">
                                <BookmarkButton useCaseId={useCase.id} useCaseTitle={useCase.title} variant="card" />
                                <div className="flex items-center gap-1 text-stone-500">
                                  <ChevronUp className="w-3.5 h-3.5" />
                                  <span className="text-xs font-medium">{useCase.upvotes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Fixed footer */}
                  <div className="shrink-0 pt-4 mt-4 border-t border-stone-200 space-y-3">
                    <div className="text-center">
                      <Link
                        href="/browse"
                        onClick={onClose}
                        className="text-sm text-stone-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1"
                      >
                        Not what you're looking for? Browse all workflows
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-12 space-y-4">
                    <div className="text-stone-600 mb-4">
                      <p className="text-base mb-2">
                        We couldn't find an exact match.
                      </p>
                      <p className="text-sm">
                        But we have many more workflows to explore!
                      </p>
                    </div>
                    <Link href="/browse" onClick={onClose}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                        Browse all workflows
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="shrink-0 flex items-center gap-3 pt-4 border-t border-stone-200">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
    </Dialog>
  );
}

// Trigger button component
export function WorkflowWizardTrigger() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-amber-600 hover:bg-amber-700 text-white"
      >
        Find Your Workflow
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      <WorkflowWizard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
