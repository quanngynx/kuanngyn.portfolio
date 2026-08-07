"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/common/utils/ui";

import { CustomSelect } from "@/common/components/molecules/custom-select";

interface Props {
  availableTags: string[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export function BlogFilterToolbar({ availableTags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentKind = searchParams.get("kind") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentTags = searchParams.getAll("tag");
  const currentQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(currentQuery);

  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        newParams.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else if (
          value !== null &&
          value !== "" &&
          value !== "all" &&
          value !== "newest"
        ) {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams],
  );

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const queryString = createQueryString(updates);
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  const handleTagToggle = (tag: string) => {
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tag: nextTags });
  };

  return (
    <div className="mt-8 mb-4 space-y-4 rounded-2xl border border-border bg-card/40 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Kind Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "blog", "case-study"].map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => updateFilters({ kind })}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium uppercase transition-colors",
                currentKind === kind
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {kind}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                updateFilters({ q: e.target.value });
              }}
              placeholder="Search articles..."
              className="h-9 rounded-xl border border-border bg-background pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <CustomSelect
            value={currentSort}
            onChange={(sort) => updateFilters({ sort })}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Available Tags Multi-Select */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
          <span className="mr-1 flex items-center gap-1 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3 w-3" /> Tags:
          </span>
          {availableTags.map((tag) => {
            const isSelected = currentTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs transition-colors",
                  isSelected
                    ? "border border-primary/40 bg-primary/20 font-medium text-primary"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
