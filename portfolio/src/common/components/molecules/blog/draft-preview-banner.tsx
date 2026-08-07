import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export function DraftPreviewBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/90 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-primary" />
        <span>Draft Preview Mode - Unpublished Article</span>
      </div>
      <Link
        href="/api/draft/disable"
        className="rounded border border-border bg-primary/10 px-2.5 py-1 text-primary transition-colors hover:bg-primary/20"
      >
        Exit Preview
      </Link>
    </div>
  )
}
