"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CircleAlert, Copy, Share2 } from "lucide-react";

import { createArticleShareUrls, shareOrCopyArticle } from "./article-share";

export interface ArticleShareLabels {
  group: string;
  copy: string;
  copied: string;
  failed: string;
  mobile: string;
  facebook: string;
  x: string;
}

interface ArticleShareActionsProps {
  articleUrl: string;
  articleTitle: string;
  labels: ArticleShareLabels;
}

type CopyState = "idle" | "copied" | "failed";

const actionClassName =
  "flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ArticleShareActions({
  articleUrl,
  articleTitle,
  labels,
}: ArticleShareActionsProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const copyResetTimer = useRef<number | null>(null);
  const shareUrls = createArticleShareUrls(articleUrl, articleTitle);

  useEffect(
    () => () => {
      if (copyResetTimer.current) window.clearTimeout(copyResetTimer.current);
    },
    [],
  );

  const copyArticleLink = useCallback(async () => {
    if (copyResetTimer.current) {
      window.clearTimeout(copyResetTimer.current);
    }

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(articleUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    copyResetTimer.current = window.setTimeout(
      () => setCopyState("idle"),
      2000,
    );
  }, [articleUrl]);

  const copyLabel =
    copyState === "copied"
      ? labels.copied
      : copyState === "failed"
        ? labels.failed
        : labels.copy;

  const shareArticle = useCallback(async () => {
    if (copyResetTimer.current) {
      window.clearTimeout(copyResetTimer.current);
    }

    try {
      const result = await shareOrCopyArticle(
        navigator,
        articleTitle,
        articleUrl,
      );
      setCopyState(result === "copied" ? "copied" : "idle");
    } catch {
      setCopyState("failed");
    }

    copyResetTimer.current = window.setTimeout(
      () => setCopyState("idle"),
      2000,
    );
  }, [articleTitle, articleUrl]);

  return (
    <>
      <div className="mb-8 flex justify-end xl:hidden">
        <button
          type="button"
          aria-label={copyState === "idle" ? labels.mobile : copyLabel}
          title={copyState === "idle" ? labels.mobile : copyLabel}
          onClick={shareArticle}
          className="flex h-10 items-center gap-2 rounded-full border border-border/80 bg-background px-4 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          {copyState === "copied" ? (
            <Check aria-hidden="true" className="size-4" />
          ) : copyState === "failed" ? (
            <CircleAlert aria-hidden="true" className="size-4" />
          ) : (
            <Share2 aria-hidden="true" className="size-4" />
          )}
          <span>{copyState === "idle" ? labels.mobile : copyLabel}</span>
        </button>
      </div>

      <div
        role="group"
        aria-label={labels.group}
        className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
      >
        <button
          type="button"
          aria-label={copyLabel}
          title={copyLabel}
          onClick={copyArticleLink}
          className={actionClassName}
        >
          {copyState === "copied" ? (
            <Check aria-hidden="true" className="size-4" />
          ) : copyState === "failed" ? (
            <CircleAlert aria-hidden="true" className="size-4" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
        </button>

        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.facebook}
          title={labels.facebook}
          className={actionClassName}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 fill-current"
          >
            <path d="M14 8.5V6.8c0-.8.5-1 1-1h2.9V2h-4c-3.8 0-4.9 2.8-4.9 4.6v1.9H6v4h3V22h5v-9.5h3.4l.6-4H14Z" />
          </svg>
        </a>

        <a
          href={shareUrls.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.x}
          title={labels.x}
          className={actionClassName}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 fill-current"
          >
            <path d="M18.2 2h3.5l-7.6 8.7L23 22h-7l-5.5-7.2L4.2 22H.7l8.2-9.4L.4 2h7.2l5 6.6L18.2 2Zm-1.3 18h1.9L6.6 3.9h-2L16.9 20Z" />
          </svg>
        </a>
      </div>

      <span aria-live="polite" className="sr-only">
        {copyState === "idle" ? "" : copyLabel}
      </span>
    </>
  );
}
