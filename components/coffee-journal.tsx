"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoffeeEntryForm } from "@/components/coffee-entry-form"
import { CoffeeEntryList } from "@/components/coffee-entry-list"
import { CoffeeSearch } from "@/components/coffee-search"
import { CoffeeFavorites } from "@/components/coffee-favorites"

export type CoffeeEntry = {
  id: string
  name: string
  rating: number
  date: string
  comment?: string
  isFavorite: boolean
}

export function CoffeeJournal() {
  const [entries, setEntries] = useState<CoffeeEntry[]>([
    {
      id: "1",
      name: "エチオピア イルガチェフェ",
      rating: 5,
      date: "2024-03-20",
      comment: "フルーティーな香りと酸味が特徴的。とても美味しい。",
      isFavorite: true,
    },
    {
      id: "2",
      name: "グアテマラ アンティグア",
      rating: 4,
      date: "2024-03-18",
      comment: "チョコレートのような風味があり、バランスが良い。",
      isFavorite: false,
    },
    {
      id: "3",
      name: "ブラジル サントス",
      rating: 3,
      date: "2024-03-15",
      comment: "ナッツのような風味。普段使いに良い。",
      isFavorite: true,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const addEntry = (entry: Omit<CoffeeEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setEntries([newEntry, ...entries])
  }

  const toggleFavorite = (id: string) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry)))
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.comment && entry.comment.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const favoriteEntries = entries.filter((entry) => entry.isFavorite)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add">記録する</TabsTrigger>
          <TabsTrigger value="history">履歴</TabsTrigger>
          <TabsTrigger value="favorites">お気に入り</TabsTrigger>
          <TabsTrigger value="search">検索</TabsTrigger>
        </TabsList>
        <TabsContent value="add" className="mt-6">
          <CoffeeEntryForm onSubmit={addEntry} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <CoffeeEntryList entries={entries} onToggleFavorite={toggleFavorite} />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <CoffeeFavorites entries={favoriteEntries} onToggleFavorite={toggleFavorite} />
        </TabsContent>
        <TabsContent value="search" className="mt-6">
          <CoffeeSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            entries={filteredEntries}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

