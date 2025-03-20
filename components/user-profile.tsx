"use client"

import { useState } from "react"
import { Grid, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CoffeePost } from "@/components/coffee-post"
import type { User, CoffeeEntry } from "@/components/coffee-app"

interface UserProfileProps {
  user: User
  entries: CoffeeEntry[]
  onToggleFavorite: (id: string) => void
  onToggleLike: (id: string) => void
  onAddComment: (entryId: string, text: string) => void
}

export function UserProfile({ user, entries, onToggleFavorite, onToggleLike, onAddComment }: UserProfileProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div>
      {/* Profile header */}
      <div className="p-4">
        <div className="flex items-center">
          <Avatar className="h-20 w-20 mr-6">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <div className="flex space-x-4 mt-1">
              <div>
                <span className="font-semibold">{entries.length}</span> 投稿
              </div>
              <div>
                <span className="font-semibold">142</span> フォロワー
              </div>
              <div>
                <span className="font-semibold">98</span> フォロー中
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm">{user.bio}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full">
            プロフィールを編集
          </Button>
        </div>
      </div>

      {/* Profile tabs */}
      <div className="border-t mt-4">
        <div className="flex justify-center">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">投稿</TabsTrigger>
              <TabsTrigger value="saved">保存済み</TabsTrigger>
            </TabsList>

            <div className="flex justify-center border-b py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "text-black" : "text-gray-500"}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "text-black" : "text-gray-500"}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>

            <TabsContent value="posts">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-3 gap-1">
                  {entries.map((entry) => (
                    <div key={entry.id} className="aspect-square">
                      {entry.image ? (
                        <img
                          src={entry.image || "/placeholder.svg"}
                          alt={entry.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm text-gray-500">{entry.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
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
              )}

              {entries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">まだ投稿がありません。</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <div className="text-center py-12">
                <p className="text-muted-foreground">保存した投稿がここに表示されます。</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

