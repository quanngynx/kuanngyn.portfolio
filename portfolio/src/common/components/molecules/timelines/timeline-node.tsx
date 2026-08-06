import { cn } from "@/common/utils/ui";
import { BlurReveal } from "../../effects/blur-reveal";
import { RoadmapItem } from "../../organisms/roadmap/roadmap";

interface TimelineNodeProps {
  item: RoadmapItem;
  isEven: boolean;
  isSelected?: boolean;
  onSelect: (item: RoadmapItem) => void;
}

const TimelineNode = ({
  item,
  isEven,
  isSelected = false,
  onSelect,
}: TimelineNodeProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between",
        isEven ? "flex-row" : "flex-row-reverse",
      )}
    >
      <div className="hidden w-[calc(50%-3rem)] md:block" />

      <div
        className={cn(
          "absolute left-6 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border/50 bg-background shadow-lg transition-all duration-500 group-hover:border-primary/50 md:left-1/2 md:h-10 md:w-10",
          isSelected &&
            "scale-110 border-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]",
        )}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] md:h-3 md:w-3" />
      </div>

      <div
        className={cn(
          "group relative w-full pl-16 md:w-[calc(50%-3rem)] md:pl-0",
        )}
      >
        <BlurReveal>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "relative w-full cursor-pointer overflow-hidden border border-border/50 bg-secondary/5 p-8 text-left backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-700 ease-out md:p-10",
              "hover:-translate-y-1 hover:border-border hover:bg-secondary/20 hover:shadow-2xl",
              isSelected && "border-primary/60 bg-secondary/20 shadow-xl",
              isEven ? "md:text-right" : "md:text-left",
            )}
          >
            <span
              className={cn(
                "mb-4 flex font-mono text-xs tracking-widest text-muted-foreground uppercase max-sm:hidden",
                isEven ? "md:justify-end" : "md:justify-start",
              )}
            >
              {item.id}
            </span>

            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="mt-2 font-serif text-4xl font-semibold tracking-tighter text-foreground uppercase italic transition-colors duration-500 group-hover:text-primary md:text-5xl lg:text-6xl">
                {item.year}
              </h3>

              <p
                className="mt-2 ml-0 max-w-sm text-sm leading-relaxed text-muted-foreground md:max-w-md md:text-base"
                style={{ marginLeft: isEven ? "auto" : "0" }}
              >
                {item.description}
              </p>

              <div
                className={cn(
                  "mt-6 flex flex-wrap gap-2",
                  isEven ? "md:justify-end" : "justify-start",
                )}
              >
                {item.stack.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[10rem] font-black text-foreground/3 italic transition-transform duration-700 select-none",
                isEven ? "-left-12" : "-right-12 text-right",
              )}
            >
              {item.year.slice(2)}
            </div>
          </button>
        </BlurReveal>
      </div>
    </div>
  );
};

export { TimelineNode };
