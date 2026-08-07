"use client";

import { useState } from "react";

export function CodeBlockCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
      className="absolute top-2 right-2 rounded bg-neutral-800/80 px-2.5 py-1 text-xs text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white focus:ring-2 focus:ring-neutral-500 focus:outline-none"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
