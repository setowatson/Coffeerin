import { CoffeePost } from "@/components/coffee-post"
import type { CoffeeEntry } from "@/components/coffee-app"

interface CoffeeTimelineProps {
  entries: CoffeeEntry[]
  onToggleFavorite: (id: string) => void
  onToggleLike: (id: string) => void
  onAddComment: (entryId: string, text: string) => void
}

export function CoffeeTimeline({ entries, onToggleFavorite, onToggleLike, onAddComment }: CoffeeTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">まだコーヒーの記録がありません。</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {entries.map((entry) => (
        <CoffeePost
          key={entry.id}
          entry={entry}
          onToggleFavorite={onToggleFavorite}
          onToggleLike={onToggleLike}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  )
}

