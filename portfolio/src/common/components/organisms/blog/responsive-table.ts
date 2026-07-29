import { createElement, type ComponentProps } from "react";

export function ResponsiveTable({
  children,
}: Pick<ComponentProps<"table">, "children">) {
  return createElement(
    "div",
    {
      className:
        "my-8 max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-border",
    },
    createElement(
      "table",
      {
        className:
          "w-full min-w-160 border-collapse text-left text-base [&_td]:border-b [&_td]:border-border/70 [&_td]:px-4 [&_td]:py-3 [&_th]:border-b [&_th]:border-border [&_th]:bg-muted/60 [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold",
      },
      children,
    ),
  );
}
