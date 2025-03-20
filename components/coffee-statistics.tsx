"use client"

import { useState } from "react"
import { format, parseISO, subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns"
import { ja } from "date-fns/locale"
import { Coffee, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { CoffeeEntry } from "@/components/coffee-app"

interface CoffeeStatisticsProps {
  entries: CoffeeEntry[]
}

export function CoffeeStatistics({ entries }: CoffeeStatisticsProps) {
  const [timeRange, setTimeRange] = useState<"all" | "month" | "3months" | "6months">("all")

  const getFilteredEntries = () => {
    const now = new Date()

    switch (timeRange) {
      case "month":
        return entries.filter((entry) => {
          const entryDate = parseISO(entry.date)
          return isWithinInterval(entryDate, {
            start: startOfMonth(now),
            end: endOfMonth(now),
          })
        })
      case "3months":
        return entries.filter((entry) => {
          const entryDate = parseISO(entry.date)
          return entryDate >= subMonths(now, 3)
        })
      case "6months":
        return entries.filter((entry) => {
          const entryDate = parseISO(entry.date)
          return entryDate >= subMonths(now, 6)
        })
      default:
        return entries
    }
  }

  const filteredEntries = getFilteredEntries()

  // Calculate statistics
  const totalEntries = filteredEntries.length
  const averageRating =
    totalEntries > 0 ? filteredEntries.reduce((sum, entry) => sum + entry.rating, 0) / totalEntries : 0

  // Count by coffee type
  const coffeeTypeCounts: Record<string, number> = {}
  filteredEntries.forEach((entry) => {
    if (entry.coffeeType) {
      coffeeTypeCounts[entry.coffeeType] = (coffeeTypeCounts[entry.coffeeType] || 0) + 1
    }
  })

  // Count by brew method
  const brewMethodCounts: Record<string, number> = {}
  filteredEntries.forEach((entry) => {
    if (entry.brewMethod) {
      brewMethodCounts[entry.brewMethod] = (brewMethodCounts[entry.brewMethod] || 0) + 1
    }
  })

  // Get most used tags
  const tagCounts: Record<string, number> = {}
  filteredEntries.forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag)

  // Calculate average taste profile
  const avgTasteProfile = {
    acidity: 0,
    sweetness: 0,
    bitterness: 0,
    body: 0,
  }

  let entriesWithTasteProfile = 0

  filteredEntries.forEach((entry) => {
    if (entry.tasteProfile) {
      avgTasteProfile.acidity += entry.tasteProfile.acidity
      avgTasteProfile.sweetness += entry.tasteProfile.sweetness
      avgTasteProfile.bitterness += entry.tasteProfile.bitterness
      avgTasteProfile.body += entry.tasteProfile.body
      entriesWithTasteProfile++
    }
  })

  if (entriesWithTasteProfile > 0) {
    avgTasteProfile.acidity /= entriesWithTasteProfile
    avgTasteProfile.sweetness /= entriesWithTasteProfile
    avgTasteProfile.bitterness /= entriesWithTasteProfile
    avgTasteProfile.body /= entriesWithTasteProfile
  }

  const getCoffeeTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      single_origin: "シングルオリジン",
      blend: "ブレンド",
      espresso: "エスプレッソ",
      decaf: "カフェインレス",
      other: "その他",
    }

    return types[type] || type
  }

  const getBrewMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      drip: "ドリップ",
      french_press: "フレンチプレス",
      aeropress: "エアロプレス",
      espresso_machine: "エスプレッソマシン",
      pour_over: "ハンドドリップ",
      cold_brew: "水出し",
      siphon: "サイフォン",
      other: "その他",
    }

    return methods[method] || method
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">コーヒー統計</h2>

        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="期間" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="month">今月</SelectItem>
            <SelectItem value="3months">過去3ヶ月</SelectItem>
            <SelectItem value="6months">過去6ヶ月</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm flex items-center">
              <Coffee className="h-4 w-4 mr-1" />
              総記録数
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">{totalEntries}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              平均評価
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="types">種類</TabsTrigger>
          <TabsTrigger value="methods">淹れ方</TabsTrigger>
          <TabsTrigger value="tags">タグ</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">コーヒータイプ別</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {Object.entries(coffeeTypeCounts).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(coffeeTypeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span>{getCoffeeTypeLabel(type)}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{
                                width: `${(count / totalEntries) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">データがありません</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">淹れ方別</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {Object.entries(brewMethodCounts).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(brewMethodCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([method, count]) => (
                      <div key={method} className="flex justify-between items-center">
                        <span>{getBrewMethodLabel(method)}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{
                                width: `${(count / totalEntries) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">データがありません</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">よく使うタグ</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {topTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">データがありません</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">平均味わいプロファイル</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {entriesWithTasteProfile > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">酸味</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(avgTasteProfile.acidity / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">甘み</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(avgTasteProfile.sweetness / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">苦味</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(avgTasteProfile.bitterness / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">コク</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(avgTasteProfile.body / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">データがありません</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader className="p-4">
          <CardTitle className="text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            最近のコーヒー
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {filteredEntries.length > 0 ? (
            <div className="space-y-3">
              {filteredEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs text-gray-500">
                      {format(parseISO(entry.date), "yyyy年MM月dd日", { locale: ja })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{entry.rating}</span>
                    <Coffee className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">データがありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

