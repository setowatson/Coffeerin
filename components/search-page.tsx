"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User as UserType, CoffeeEntry } from "@/components/coffee-app"

interface SearchPageProps {
  entries: CoffeeEntry[]
  users: UserType[]
}

export function SearchPage({ entries, users }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"coffee" | "location" | "users" | "tags">("coffee")

  // Extract all unique tags from entries
  const allTags = Array.from(
    new Set(entries.filter((entry) => entry.tags && entry.tags.length > 0).flatMap((entry) => entry.tags || [])),
  )

  const filteredEntries = entries.filter((entry) => {
    if (searchType === "coffee") {
      return entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (searchType === "location") {
      return entry.location.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (searchType === "tags" && searchTerm) {
      return entry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    return false
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="検索..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs
        defaultValue="coffee"
        className="w-full"
        onValueChange={(value) => setSearchType(value as "coffee" | "location" | "users" | "tags")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coffee">コーヒー</TabsTrigger>
          <TabsTrigger value="location">場所</TabsTrigger>
          <TabsTrigger value="tags">タグ</TabsTrigger>
          <TabsTrigger value="users">ユーザー</TabsTrigger>
        </TabsList>

        <TabsContent value="coffee" className="mt-4">
          {searchTerm && (
            <div className="text-sm text-muted-foreground mb-4">
              {filteredEntries.length === 0
                ? "検索結果はありません"
                : `${filteredEntries.length}件の結果が見つかりました`}
            </div>
          )}

          <div className="grid grid-cols-3 gap-1">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="aspect-square">
                {entry.image ? (
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2">
                    <span className="text-xs text-center text-gray-500">{entry.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          {searchTerm && (
            <div className="text-sm text-muted-foreground mb-4">
              {filteredEntries.length === 0
                ? "検索結果はありません"
                : `${filteredEntries.length}件の結果が見つかりました`}
            </div>
          )}

          <div className="grid grid-cols-3 gap-1">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="aspect-square">
                {entry.image ? (
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2">
                    <span className="text-xs text-center text-gray-500">{entry.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          {searchTerm ? (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {filteredTags.length === 0 ? "検索結果はありません" : `${filteredTags.length}件のタグが見つかりました`}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {filteredTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {filteredTags.length > 0 && filteredEntries.length > 0 && (
                <>
                  <h3 className="text-sm font-medium mb-2">関連する投稿</h3>
                  <div className="grid grid-cols-3 gap-1">
                    {filteredEntries.map((entry) => (
                      <div key={entry.id} className="aspect-square">
                        {entry.image ? (
                          <img
                            src={entry.image || "/placeholder.svg"}
                            alt={entry.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2">
                            <span className="text-xs text-center text-gray-500">{entry.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h3 className="text-sm font-medium mb-2">人気のタグ</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(tag)
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          {searchTerm && (
            <div className="text-sm text-muted-foreground mb-4">
              {filteredUsers.length === 0 ? "検索結果はありません" : `${filteredUsers.length}件の結果が見つかりました`}
            </div>
          )}

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.name}</p>
                  </div>
                </div>
                <Button variant={user.isFollowing ? "outline" : "default"} size="sm">
                  {user.isFollowing ? "フォロー中" : "フォローする"}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

