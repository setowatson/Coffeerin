"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { CoffeeEntryList } from "@/components/coffee-entry-list"
import type { CoffeeEntry } from "@/components/coffee-journal"

interface CoffeeSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  entries: CoffeeEntry[]
  onToggleFavorite: (id: string) => void
}

export function CoffeeSearch({ searchTerm, onSearchChange, entries, onToggleFavorite }: CoffeeSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="コーヒー名や感想で検索..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {searchTerm && (
        <div className="text-sm text-muted-foreground mb-2">
          {entries.length === 0 ? "検索結果はありません" : `${entries.length}件の結果が見つかりました`}
        </div>
      )}

      <CoffeeEntryList entries={entries} onToggleFavorite={onToggleFavorite} />
    </div>
  )
}

