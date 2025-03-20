"use client"

import { Heart } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CoffeeRating } from "@/components/coffee-rating"
import type { CoffeeEntry } from "@/components/coffee-journal"

interface CoffeeEntryListProps {
  entries: CoffeeEntry[]
  onToggleFavorite: (id: string) => void
}

export function CoffeeEntryList({ entries, onToggleFavorite }: CoffeeEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">まだコーヒーの記録がありません。</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{entry.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(entry.date), "yyyy年MM月dd日", { locale: ja })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(entry.id)}
                aria-label={entry.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
              >
                <Heart
                  className={`h-5 w-5 ${entry.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <CoffeeRating rating={entry.rating} readonly size="sm" />
            </div>
            {entry.comment && <p className="text-sm">{entry.comment}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

