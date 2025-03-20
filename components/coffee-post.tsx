"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"
import { Heart, MessageCircle, Bookmark, Send, MapPin, Coffee } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CoffeeRating } from "@/components/coffee-rating"
import { TasteProfileChart } from "@/components/taste-profile-chart"
import type { CoffeeEntry } from "@/components/coffee-app"

interface CoffeePostProps {
  entry: CoffeeEntry
  onToggleFavorite: (id: string) => void
  onToggleLike: (id: string) => void
  onAddComment: (entryId: string, text: string) => void
}

export function CoffeePost({ entry, onToggleFavorite, onToggleLike, onAddComment }: CoffeePostProps) {
  const [commentText, setCommentText] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    onAddComment(entry.id, commentText)
    setCommentText("")
  }

  const displayedComments = showAllComments ? entry.comments : entry.comments.slice(-2)

  const getCoffeeTypeLabel = (type: string | undefined) => {
    if (!type) return ""

    const types: Record<string, string> = {
      single_origin: "シングルオリジン",
      blend: "ブレンド",
      espresso: "エスプレッソ",
      decaf: "カフェインレス",
      other: "その他",
    }

    return types[type] || type
  }

  const getBrewMethodLabel = (method: string | undefined) => {
    if (!method) return ""

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

  const getRoastLevelLabel = (level: string | undefined) => {
    if (!level) return ""

    const levels: Record<string, string> = {
      light: "ライトロースト",
      medium_light: "ミディアムライトロースト",
      medium: "ミディアムロースト",
      medium_dark: "ミディアムダークロースト",
      dark: "ダークロースト",
    }

    return levels[level] || level
  }

  return (
    <article className="pb-4">
      {/* Post header */}
      <div className="flex items-center p-3">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
          <AvatarFallback>{entry.user.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{entry.user.username}</p>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {entry.location}
          </div>
        </div>
      </div>

      {/* Post image */}
      {entry.image && (
        <div className="relative aspect-square bg-gray-100">
          <img src={entry.image || "/placeholder.svg"} alt={entry.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Post actions */}
      <div className="flex items-center px-4 pt-2">
        <Button variant="ghost" size="icon" onClick={() => onToggleLike(entry.id)} className="rounded-full">
          <Heart className={`h-6 w-6 ${entry.hasLiked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="sr-only">いいね</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">コメント</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Send className="h-6 w-6" />
          <span className="sr-only">シェア</span>
        </Button>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(entry.id)} className="rounded-full">
            <Bookmark className={`h-6 w-6 ${entry.isFavorite ? "fill-black" : ""}`} />
            <span className="sr-only">保存</span>
          </Button>
        </div>
      </div>

      {/* Likes count */}
      <div className="px-4 pt-1">
        <p className="text-sm font-semibold">{entry.likes}件のいいね</p>
      </div>

      {/* Post content */}
      <div className="px-4 pt-1">
        <div className="flex items-center">
          <p className="text-sm font-semibold mr-2">{entry.name}</p>
          <CoffeeRating rating={entry.rating} readonly size="sm" />
        </div>

        {/* Coffee details */}
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-xs text-gray-500 flex items-center"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Coffee className="h-3 w-3 mr-1" />
            {showDetails ? "詳細を隠す" : "詳細を表示"}
          </Button>

          {showDetails && (
            <div className="mt-2 text-sm space-y-2 bg-gray-50 p-3 rounded-md">
              {entry.coffeeType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">コーヒータイプ:</span>
                  <span>{getCoffeeTypeLabel(entry.coffeeType)}</span>
                </div>
              )}

              {entry.brewMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">淹れ方:</span>
                  <span>{getBrewMethodLabel(entry.brewMethod)}</span>
                </div>
              )}

              {entry.roastLevel && (
                <div className="flex justify-between">
                  <span className="text-gray-500">焙煎度:</span>
                  <span>{getRoastLevelLabel(entry.roastLevel)}</span>
                </div>
              )}

              {entry.tasteProfile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">味わいプロファイル:</p>
                  <TasteProfileChart profile={entry.tasteProfile} />
                </div>
              )}

              {entry.placeId && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">場所:</p>
                  <div className="bg-gray-100 h-24 rounded-md flex items-center justify-center">
                    <p className="text-xs text-gray-500">Google Mapが表示されます</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {entry.comment && (
          <p className="text-sm mt-2">
            <span className="font-semibold mr-1">{entry.user.username}</span>
            {entry.comment}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">{format(parseISO(entry.date), "yyyy年MM月dd日", { locale: ja })}</p>
      </div>

      {/* Comments */}
      {entry.comments.length > 0 && (
        <div className="px-4 pt-2">
          {entry.comments.length > 2 && !showAllComments && (
            <button className="text-sm text-gray-500" onClick={() => setShowAllComments(true)}>
              {entry.comments.length}件のコメントをすべて見る
            </button>
          )}

          {displayedComments.map((comment) => (
            <div key={comment.id} className="mt-1 text-sm">
              <span className="font-semibold mr-1">{comment.user.username}</span>
              {comment.text}
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <form onSubmit={handleSubmitComment} className="px-4 pt-3 flex">
        <Input
          type="text"
          placeholder="コメントを追加..."
          className="text-sm"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" variant="ghost" size="sm" className="ml-2" disabled={!commentText.trim()}>
          投稿
        </Button>
      </form>
    </article>
  )
}

