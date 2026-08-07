"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/common/utils/ui";

gsap.registerPlugin(useGSAP);

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useGSAP(
    () => {
      if (!panelRef.current || !chevronRef.current) return;

      if (isOpen) {
        gsap.to(chevronRef.current, {
          rotate: 180,
          duration: 0.25,
          ease: "power2.out",
        });

        gsap.fromTo(
          panelRef.current,
          { autoAlpha: 0, scale: 0.95, y: -6 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );

        const optionEls = panelRef.current.querySelectorAll(
          ".select-option-item",
        );
        if (optionEls.length > 0) {
          gsap.fromTo(
            optionEls,
            { autoAlpha: 0, y: -4 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.2,
              stagger: 0.04,
              ease: "power2.out",
            },
          );
        }
      } else {
        gsap.to(chevronRef.current, {
          rotate: 0,
          duration: 0.2,
          ease: "power2.out",
        });

        gsap.to(panelRef.current, {
          autoAlpha: 0,
          scale: 0.95,
          y: -4,
          duration: 0.15,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-9 min-w-40 items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors select-none hover:border-primary/50 focus:border-primary focus:outline-none"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          ref={chevronRef}
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors"
        />
      </button>

      <div
        ref={panelRef}
        role="listbox"
        className="invisible absolute right-0 z-50 mt-1.5 min-w-40 origin-top-right rounded-xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-md"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "select-option-item flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors select-none",
                isSelected
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span>{option.label}</span>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
