import { CoffeeEntryList } from "@/components/coffee-entry-list"
import type { CoffeeEntry } from "@/components/coffee-journal"

interface CoffeeFavoritesProps {
  entries: CoffeeEntry[]
  onToggleFavorite: (id: string) => void
}

export function CoffeeFavorites({ entries, onToggleFavorite }: CoffeeFavoritesProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">お気に入りのコーヒーがまだありません。</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">お気に入りのコーヒー</h2>
      <CoffeeEntryList entries={entries} onToggleFavorite={onToggleFavorite} />
    </div>
  )
}

