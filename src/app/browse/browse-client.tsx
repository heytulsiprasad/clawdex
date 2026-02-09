"use client";

import { useState, useMemo, useCallback, Suspense, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  ArrowUpDown,
  Sparkles,
  Inbox,
  Zap,
  Clock,
} from "lucide-react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { cn } from "@/lib/utils";
import { PERSONAS } from "@/lib/data/personas";
import type { Complexity, UseCaseCard, CategoryView, PersonaTag, UseCaseType } from "@/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const COMPLEXITY_OPTIONS: { value: Complexity; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "intermediate", label: "Intermediate", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "advanced", label: "Advanced", color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const TYPE_OPTIONS: { value: UseCaseType; label: string }[] = [
  { value: "workflow", label: "Workflow" },
  { value: "skill", label: "Skill" },
  { value: "cron-job", label: "Cron Job" },
  { value: "multi-agent", label: "Multi-Agent" },
  { value: "hardware", label: "Hardware" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "most-upvoted", label: "Most Upvoted" },
] as const;

const CATEGORY_DOT_COLORS: Record<string, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
  slate: "bg-slate-500",
  indigo: "bg-indigo-500",
  rose: "bg-rose-500",
};

const SEARCH_SUGGESTIONS = [
  "smart home automation",
  "email workflows",
  "social media scheduling",
  "calendar management",
  "data analysis",
];

// ─── Filter Presets ─────────────────────────────────────────────────────────

interface FilterPreset {
  label: string;
  icon: React.ElementType;
  apply: () => {
    complexity?: Complexity | null;
    categories?: string[];
    sort?: string;
  };
}

// ─── Filter Sidebar Content ─────────────────────────────────────────────────

function FilterContent({
  categories,
  selectedCategories,
  toggleCategory,
  selectedComplexity,
  setComplexity,
  selectedPersonas,
  togglePersona,
  selectedIntegrations,
  toggleIntegration,
  availableIntegrations,
  selectedType,
  setType,
  clearAll,
  totalActive,
}: {
  categories: CategoryView[];
  selectedCategories: string[];
  toggleCategory: (slug: string) => void;
  selectedComplexity: Complexity | null;
  setComplexity: (c: Complexity | null) => void;
  selectedPersonas: PersonaTag[];
  togglePersona: (persona: PersonaTag) => void;
  selectedIntegrations: string[];
  toggleIntegration: (integration: string) => void;
  availableIntegrations: string[];
  selectedType: UseCaseType | null;
  setType: (t: UseCaseType | null) => void;
  clearAll: () => void;
  totalActive: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          <span className="text-[13px] font-semibold text-foreground">Filters</span>
          {totalActive > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-100 px-1.5 text-[10px] font-bold text-amber-700">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <Separator className="bg-stone-200/60" />

      {/* Personas */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Persona
        </p>
        <div className="flex flex-col gap-1.5">
          {PERSONAS.map((persona) => {
            const isSelected = selectedPersonas.includes(persona.id);
            return (
              <label
                key={persona.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all",
                  isSelected
                    ? "bg-amber-50/80 border border-amber-200/60"
                    : "border border-transparent hover:bg-stone-50"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => togglePersona(persona.id)}
                  className="size-3.5"
                />
                <span className="flex-1 text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                  {persona.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator className="bg-stone-200/60" />

      {/* Categories */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.slug);
            return (
              <label
                key={cat.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all",
                  isSelected
                    ? "bg-amber-50/80 border border-amber-200/60"
                    : "border border-transparent hover:bg-stone-50"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleCategory(cat.slug)}
                  className="size-3.5"
                />
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    CATEGORY_DOT_COLORS[cat.color] || "bg-stone-400"
                  )}
                />
                <span className="flex-1 text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] tabular-nums text-muted-foreground/40">
                  {cat.useCaseCount}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator className="bg-stone-200/60" />

      {/* Type */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const isActive = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setType(isActive ? null : opt.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all",
                  isActive
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "border-stone-200 text-muted-foreground hover:border-stone-300 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-stone-200/60" />

      {/* Complexity */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Complexity
        </p>
        <div className="flex flex-wrap gap-2">
          {COMPLEXITY_OPTIONS.map((opt) => {
            const isActive = selectedComplexity === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setComplexity(isActive ? null : opt.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all",
                  isActive
                    ? opt.color
                    : "border-stone-200 text-muted-foreground hover:border-stone-300 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrations */}
      {availableIntegrations.length > 0 && (
        <>
          <Separator className="bg-stone-200/60" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
              Integrations
            </p>
            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
              {availableIntegrations.slice(0, 15).map((integration) => {
                const isSelected = selectedIntegrations.includes(integration);
                return (
                  <label
                    key={integration}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all",
                      isSelected
                        ? "bg-amber-50/80 border border-amber-200/60"
                        : "border border-transparent hover:bg-stone-50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleIntegration(integration)}
                      className="size-3.5"
                    />
                    <span className="flex-1 text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                      {integration}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Active Filter Chips ────────────────────────────────────────────────────

function ActiveChips({
  categories,
  selectedCategories,
  selectedComplexity,
  selectedPersonas,
  selectedIntegrations,
  selectedType,
  searchQuery,
  toggleCategory,
  setComplexity,
  togglePersona,
  toggleIntegration,
  setType,
  clearSearch,
}: {
  categories: CategoryView[];
  selectedCategories: string[];
  selectedComplexity: Complexity | null;
  selectedPersonas: PersonaTag[];
  selectedIntegrations: string[];
  selectedType: UseCaseType | null;
  searchQuery: string;
  toggleCategory: (slug: string) => void;
  setComplexity: (c: Complexity | null) => void;
  togglePersona: (p: PersonaTag) => void;
  toggleIntegration: (i: string) => void;
  setType: (t: UseCaseType | null) => void;
  clearSearch: () => void;
}) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (searchQuery) {
    chips.push({
      key: "search",
      label: `"${searchQuery}"`,
      onRemove: clearSearch,
    });
  }

  selectedPersonas.forEach((personaId) => {
    const persona = PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      chips.push({
        key: `persona-${personaId}`,
        label: persona.label,
        onRemove: () => togglePersona(personaId),
      });
    }
  });

  selectedCategories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) {
      chips.push({
        key: `cat-${slug}`,
        label: cat.name,
        onRemove: () => toggleCategory(slug),
      });
    }
  });

  if (selectedType) {
    const typeOpt = TYPE_OPTIONS.find((o) => o.value === selectedType);
    if (typeOpt) {
      chips.push({
        key: "type",
        label: typeOpt.label,
        onRemove: () => setType(null),
      });
    }
  }

  if (selectedComplexity) {
    const opt = COMPLEXITY_OPTIONS.find((o) => o.value === selectedComplexity);
    if (opt) {
      chips.push({
        key: "complexity",
        label: opt.label,
        onRemove: () => setComplexity(null),
      });
    }
  }

  selectedIntegrations.forEach((integration) => {
    chips.push({
      key: `int-${integration}`,
      label: integration,
      onRemove: () => toggleIntegration(integration),
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium text-muted-foreground/50 mr-0.5">
        Active:
      </span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-md border border-amber-200/80 bg-amber-50/60 px-2 py-0.5 text-[11px] font-medium text-amber-800"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-sm p-0.5 hover:bg-amber-200/40 transition-colors"
          >
            <X className="size-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-50 border border-stone-200/60">
        <Inbox className="size-5 text-stone-400" />
      </div>
      <p className="text-[15px] font-semibold text-foreground mb-1">
        No use cases found
      </p>
      <p className="text-[13px] text-muted-foreground mb-5 text-center max-w-xs">
        Try adjusting your filters or search term to discover more use cases.
      </p>
      <Button
        onClick={onClear}
        variant="outline"
        size="sm"
        className="h-8 text-[12px] border-stone-200 hover:bg-stone-50"
      >
        Clear all filters
      </Button>
    </div>
  );
}

// ─── Search Suggestions Dropdown ────────────────────────────────────────────

function SearchSuggestions({
  onSelect,
  isVisible,
}: {
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 overflow-hidden">
      <div className="p-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50 px-2 py-1">
          Popular Searches
        </p>
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-2 py-1.5 text-[13px] text-foreground/80 hover:bg-stone-50 rounded transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Filter Presets ─────────────────────────────────────────────────────────

function FilterPresets({
  onApplyPreset,
  categories,
}: {
  onApplyPreset: (preset: { complexity?: Complexity | null; categories?: string[]; sort?: string }) => void;
  categories: CategoryView[];
}) {
  const presets: FilterPreset[] = [
    {
      label: "Beginner Friendly",
      icon: Sparkles,
      apply: () => ({ complexity: "beginner" as Complexity }),
    },
    {
      label: "Business Automation",
      icon: Zap,
      apply: () => {
        const automationCat = categories.find((c) => c.slug === "automation-workflows");
        return automationCat ? { categories: [automationCat.slug] } : {};
      },
    },
    {
      label: "Quick Setups",
      icon: Clock,
      apply: () => ({ complexity: "beginner" as Complexity, sort: "newest" }),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.label}
            onClick={() => onApplyPreset(preset.apply())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[12px] font-medium text-stone-700 transition-all hover:shadow-sm"
          >
            <Icon className="size-3" />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Browse Inner (needs Suspense boundary for useSearchParams) ─────────────

function BrowseInner({
  useCases,
  categories,
}: {
  useCases: UseCaseCard[];
  categories: CategoryView[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Read initial state from URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category");
  const initialPersona = searchParams.get("persona");

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaTag[]>(
    initialPersona ? [initialPersona as PersonaTag] : []
  );
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | null>(null);
  const [selectedType, setSelectedType] = useState<UseCaseType | null>(null);
  const [sort, setSort] = useState<string>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract unique integrations from all use cases
  const availableIntegrations = useMemo(() => {
    const integrationSet = new Set<string>();
    useCases.forEach((uc) => {
      uc.integrations?.forEach((int) => int && integrationSet.add(int.name));
    });
    return Array.from(integrationSet).sort();
  }, [useCases]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(useCases, {
      keys: ["title", "description"],
      threshold: 0.4,
      includeScore: true,
    });
  }, [useCases]);

  const totalActiveFilters =
    selectedCategories.length +
    selectedPersonas.length +
    selectedIntegrations.length +
    (selectedComplexity ? 1 : 0) +
    (selectedType ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // ─── Handlers ─────────────────────────────────────────────

  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  }, []);

  const togglePersona = useCallback((persona: PersonaTag) => {
    setSelectedPersonas((prev) =>
      prev.includes(persona)
        ? prev.filter((p) => p !== persona)
        : [...prev, persona]
    );
  }, []);

  const toggleIntegration = useCallback((integration: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integration)
        ? prev.filter((i) => i !== integration)
        : [...prev, integration]
    );
  }, []);

  const handleSetComplexity = useCallback((c: Complexity | null) => {
    setSelectedComplexity(c);
  }, []);

  const handleSetType = useCallback((t: UseCaseType | null) => {
    setSelectedType(t);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(searchInput);
      setShowSuggestions(false);
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      router.replace(`/browse?${params.toString()}`, { scroll: false });
    },
    [searchInput, searchParams, router]
  );

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchInput(suggestion);
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", suggestion);
    router.replace(`/browse?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchInput("");
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`/browse?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const clearAll = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPersonas([]);
    setSelectedIntegrations([]);
    setSelectedComplexity(null);
    setSelectedType(null);
    setSearchQuery("");
    setSearchInput("");
    setShowSuggestions(false);
    router.replace("/browse", { scroll: false });
  }, [router]);

  const applyPreset = useCallback((preset: { complexity?: Complexity | null; categories?: string[]; sort?: string }) => {
    if (preset.complexity !== undefined) {
      setSelectedComplexity(preset.complexity);
    }
    if (preset.categories) {
      setSelectedCategories(preset.categories);
    }
    if (preset.sort) {
      setSort(preset.sort);
    }
  }, []);

  // Handle click outside for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Filtered & Sorted Data ───────────────────────────────

  const filteredUseCases = useMemo(() => {
    // Filter out use cases with broken Sanity references (null category, etc.)
    let results = useCases.filter((uc) => uc.category != null);

    // Search with Fuse.js
    if (searchQuery) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map((r) => r.item);
    }

    // Persona filter
    if (selectedPersonas.length > 0) {
      results = results.filter((uc) =>
        selectedPersonas.some((persona) => uc.personas.includes(persona))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((uc) =>
        selectedCategories.includes(uc.category.slug)
      );
    }

    // Type filter
    if (selectedType) {
      results = results.filter((uc) => uc.type === selectedType);
    }

    // Complexity filter
    if (selectedComplexity) {
      results = results.filter((uc) => uc.complexity === selectedComplexity);
    }

    // Integration filter
    if (selectedIntegrations.length > 0) {
      results = results.filter((uc) =>
        uc.integrations?.some((int) => int && selectedIntegrations.includes(int.name))
      );
    }

    // Sort
    if (sort === "popular" || sort === "most-upvoted") {
      results.sort((a, b) => b.upvotes - a.upvotes);
    }
    // "newest" keeps default order (already sorted by _createdAt desc from GROQ)

    return results;
  }, [useCases, fuse, searchQuery, selectedPersonas, selectedCategories, selectedType, selectedComplexity, selectedIntegrations, sort]);

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-16">
        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-100">
                  <Sparkles className="size-2.5 text-amber-600" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600/70">
                  Directory
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                Browse Use Cases
              </h1>
              <p className="mt-1.5 text-[14px] text-muted-foreground">
                {filteredUseCases.length} use case{filteredUseCases.length !== 1 ? "s" : ""}{" "}
                {totalActiveFilters > 0 ? "matching your filters" : "and counting"}
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="w-full sm:w-auto relative">
              <div className="relative flex items-center" ref={searchInputRef}>
                <Search className="absolute left-3 size-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => !searchInput && setShowSuggestions(true)}
                  placeholder="Search use cases..."
                  className="h-9 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-[13px] text-foreground placeholder:text-stone-400 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10 sm:w-[280px]"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2.5 rounded-sm p-0.5 text-stone-400 hover:text-foreground transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <SearchSuggestions
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions && !searchInput}
                />
              </div>
            </form>
          </div>
        </div>

        {/* ── Subtle divider ───────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300/40 to-transparent" />
        </div>

        {/* ── Main Content ─────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
          <div className="flex gap-8 lg:gap-10">
            {/* ── Desktop Sidebar ──────────────────────────────── */}
            <aside className="hidden w-[240px] shrink-0 lg:block">
              <div className="sticky top-24">
                <FilterPresets onApplyPreset={applyPreset} categories={categories} />
                <FilterContent
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  selectedComplexity={selectedComplexity}
                  setComplexity={handleSetComplexity}
                  selectedPersonas={selectedPersonas}
                  togglePersona={togglePersona}
                  selectedIntegrations={selectedIntegrations}
                  toggleIntegration={toggleIntegration}
                  availableIntegrations={availableIntegrations}
                  selectedType={selectedType}
                  setType={handleSetType}
                  clearAll={clearAll}
                  totalActive={totalActiveFilters}
                />
              </div>
            </aside>

            {/* ── Results Area ─────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: Sort + Mobile filter button + Active chips */}
              <div className="mb-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Mobile filter trigger */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 border-stone-200 text-[12px] text-muted-foreground hover:text-foreground lg:hidden"
                      >
                        <SlidersHorizontal className="size-3" />
                        Filters
                        {totalActiveFilters > 0 && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[10px] font-bold text-amber-700">
                            {totalActiveFilters}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-6 overflow-y-auto">
                      <SheetHeader className="p-0 mb-6">
                        <SheetTitle className="text-[15px]">Filter Use Cases</SheetTitle>
                      </SheetHeader>
                      <FilterPresets onApplyPreset={applyPreset} categories={categories} />
                      <FilterContent
                        categories={categories}
                        selectedCategories={selectedCategories}
                        toggleCategory={(slug) => {
                          toggleCategory(slug);
                        }}
                        selectedComplexity={selectedComplexity}
                        setComplexity={handleSetComplexity}
                        selectedPersonas={selectedPersonas}
                        togglePersona={togglePersona}
                        selectedIntegrations={selectedIntegrations}
                        toggleIntegration={toggleIntegration}
                        availableIntegrations={availableIntegrations}
                        selectedType={selectedType}
                        setType={handleSetType}
                        clearAll={() => {
                          clearAll();
                          setMobileFiltersOpen(false);
                        }}
                        totalActive={totalActiveFilters}
                      />
                    </SheetContent>
                  </Sheet>

                  {/* Result count on mobile */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <LayoutGrid className="size-3 text-muted-foreground/40" />
                    <span className="text-[12px] text-muted-foreground/60 tabular-nums">
                      {filteredUseCases.length} result{filteredUseCases.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Sort */}
                  <div className="hidden items-center gap-2 sm:flex ml-auto">
                    <ArrowUpDown className="size-3 text-muted-foreground/40" />
                    <Select value={sort} onValueChange={setSort}>
                      <SelectTrigger className="h-8 w-[150px] border-stone-200 text-[12px] text-muted-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="text-[13px]"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active filter chips */}
                <ActiveChips
                  categories={categories}
                  selectedCategories={selectedCategories}
                  selectedComplexity={selectedComplexity}
                  selectedPersonas={selectedPersonas}
                  selectedIntegrations={selectedIntegrations}
                  selectedType={selectedType}
                  searchQuery={searchQuery}
                  toggleCategory={toggleCategory}
                  setComplexity={handleSetComplexity}
                  togglePersona={togglePersona}
                  toggleIntegration={toggleIntegration}
                  setType={handleSetType}
                  clearSearch={clearSearch}
                />
              </div>

              {/* ── Grid ───────────────────────────────────────── */}
              {filteredUseCases.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredUseCases.map((useCase) => (
                    <UseCaseCardComponent key={useCase.id} useCase={useCase} />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={clearAll} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Export (with Suspense for useSearchParams) ──────────────────────────────

export function BrowseClient({
  useCases,
  categories,
}: {
  useCases: UseCaseCard[];
  categories: CategoryView[];
}) {
  return (
    <Suspense>
      <BrowseInner useCases={useCases} categories={categories} />
    </Suspense>
  );
}
