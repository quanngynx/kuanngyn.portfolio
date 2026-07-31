import type { ComponentProps, ElementType } from "react";

import { ArticleImage } from "@/common/components/atoms/article-image";

import { ResponsiveTable } from "./responsive-table";

export const blogMdxComponents = {
  ArticleImage,
  ResponsiveTable,
  h1: (props: ComponentProps<"h1">) => (
    <h2 className="mt-14 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="mt-14 scroll-mt-24 text-3xl font-bold tracking-tight"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-10 text-2xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="mt-6 text-lg leading-8 text-foreground/85" {...props} />
  ),
  a: ({ children, ...props }: ComponentProps<"a">) => (
    <a
      className="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-8 border-l-2 border-foreground/30 pl-6 text-lg text-foreground/70 italic"
      {...props}
    />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="my-6 list-disc space-y-3 pl-6 text-lg leading-8"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="my-6 list-decimal space-y-3 pl-6 text-lg leading-8"
      {...props}
    />
  ),
  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-12 border-border" {...props} />
  ),
} satisfies Record<string, ElementType>;
