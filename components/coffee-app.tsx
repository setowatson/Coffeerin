"use client"

import { useState } from "react"
import { CoffeeTimeline } from "@/components/coffee-timeline"
import { CoffeeNavigation } from "@/components/coffee-navigation"
import { CoffeeEntryForm } from "@/components/coffee-entry-form"
import { UserProfile } from "@/components/user-profile"
import { SearchPage } from "@/components/search-page"
import { NotificationsPage } from "@/components/notifications-page"
import { CoffeeStatistics } from "@/components/coffee-statistics"

export type User = {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  isFollowing: boolean
}

export type TasteProfile = {
  acidity: number
  sweetness: number
  bitterness: number
  body: number
}

export type CoffeeEntry = {
  id: string
  user: User
  name: string
  coffeeType?: string
  brewMethod?: string
  roastLevel?: string
  location: string
  placeId?: string
  rating: number
  tasteProfile?: TasteProfile
  tags?: string[]
  date: string
  comment?: string
  image?: string
  isFavorite: boolean
  likes: number
  hasLiked: boolean
  comments: Comment[]
}

export type Comment = {
  id: string
  user: User
  text: string
  timestamp: string
}

export type Page = "timeline" | "search" | "add" | "notifications" | "profile" | "statistics"

export function CoffeeApp() {
  const currentUser: User = {
    id: "current-user",
    name: "コーヒー好き",
    username: "coffee_lover",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "コーヒーを愛する人。毎日違う豆を試しています。",
    isFollowing: false,
  }

  const [currentPage, setCurrentPage] = useState<Page>("timeline")

  // Mock users
  const users: User[] = [
    {
      id: "user1",
      name: "田中 コーヒー",
      username: "tanaka_coffee",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
    {
      id: "user2",
      name: "佐藤 カフェ",
      username: "sato_cafe",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: false,
    },
    {
      id: "user3",
      name: "鈴木 ロースト",
      username: "suzuki_roast",
      avatar: "/placeholder.svg?height=40&width=40",
      isFollowing: true,
    },
  ]

  // Mock entries
  const [entries, setEntries] = useState<CoffeeEntry[]>([
    {
      id: "1",
      user: users[0],
      name: "エチオピア イルガチェフェ",
      coffeeType: "single_origin",
      brewMethod: "pour_over",
      roastLevel: "light",
      location: "スペシャルティコーヒーショップ",
      placeId: "place123",
      rating: 5,
      tasteProfile: {
        acidity: 4,
        sweetness: 5,
        bitterness: 2,
        body: 3,
      },
      tags: ["エチオピア", "フルーティー", "ベリー系"],
      date: "2024-03-20",
      comment: "フルーティーな香りと酸味が特徴的。今まで飲んだ中で最高のコーヒーかも！",
      image: "/placeholder.svg?height=400&width=400",
      isFavorite: true,
      likes: 24,
      hasLiked: false,
      comments: [
        {
          id: "c1",
          user: users[1],
          text: "私も大好きです！次回試してみます！",
          timestamp: "2024-03-20T14:30:00Z",
        },
      ],
    },
    {
      id: "2",
      user: users[1],
      name: "グアテマラ アンティグア",
      coffeeType: "single_origin",
      brewMethod: "french_press",
      roastLevel: "medium",
      location: "カフェ・モカ",
      placeId: "place456",
      rating: 4,
      tasteProfile: {
        acidity: 3,
        sweetness: 4,
        bitterness: 3,
        body: 4,
      },
      tags: ["グアテマラ", "チョコレート", "ナッツ"],
      date: "2024-03-18",
      comment: "チョコレートのような風味があり、バランスが良い。朝の一杯に最適。",
      image: "/placeholder.svg?height=400&width=400",
      isFavorite: false,
      likes: 15,
      hasLiked: true,
      comments: [],
    },
    {
      id: "3",
      user: users[2],
      name: "ブラジル サントス",
      coffeeType: "blend",
      brewMethod: "drip",
      roastLevel: "medium_dark",
      location: "自宅",
      rating: 3,
      tasteProfile: {
        acidity: 2,
        sweetness: 3,
        bitterness: 4,
        body: 4,
      },
      tags: ["ブラジル", "ナッツ", "キャラメル"],
      date: "2024-03-15",
      comment: "ナッツのような風味。普段使いに良い。",
      isFavorite: true,
      likes: 8,
      hasLiked: false,
      comments: [
        {
          id: "c2",
          user: users[0],
          text: "どんな抽出方法で淹れましたか？",
          timestamp: "2024-03-15T10:15:00Z",
        },
        {
          id: "c3",
          user: users[2],
          text: "ペーパードリップで、少し細めに挽いてみました！",
          timestamp: "2024-03-15T11:20:00Z",
        },
      ],
    },
  ])

  const addEntry = (entry: Omit<CoffeeEntry, "id" | "user" | "likes" | "hasLiked" | "comments">) => {
    const newEntry: CoffeeEntry = {
      ...entry,
      id: Date.now().toString(),
      user: currentUser,
      likes: 0,
      hasLiked: false,
      comments: [],
    }
    setEntries([newEntry, ...entries])
    setCurrentPage("timeline")
  }

  const toggleFavorite = (id: string) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry)))
  }

  const toggleLike = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              hasLiked: !entry.hasLiked,
              likes: entry.hasLiked ? entry.likes - 1 : entry.likes + 1,
            }
          : entry,
      ),
    )
  }

  const addComment = (entryId: string, text: string) => {
    if (!text.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      text,
      timestamp: new Date().toISOString(),
    }

    setEntries(
      entries.map((entry) => (entry.id === entryId ? { ...entry, comments: [...entry.comments, newComment] } : entry)),
    )
  }

  const toggleFollow = (userId: string) => {
    // In a real app, this would update the server
    // For now, we'll just update the local state
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "timeline":
        return (
          <CoffeeTimeline
            entries={entries}
            onToggleFavorite={toggleFavorite}
            onToggleLike={toggleLike}
            onAddComment={addComment}
          />
        )
      case "search":
        return <SearchPage entries={entries} users={users} />
      case "add":
        return <CoffeeEntryForm onSubmit={addEntry} />
      case "notifications":
        return <NotificationsPage />
      case "profile":
        return (
          <UserProfile
            user={currentUser}
            entries={entries.filter((entry) => entry.user.id === currentUser.id)}
            onToggleFavorite={toggleFavorite}
            onToggleLike={toggleLike}
            onAddComment={addComment}
          />
        )
      case "statistics":
        return <CoffeeStatistics entries={entries.filter((entry) => entry.user.id === currentUser.id)} />
      default:
        return (
          <CoffeeTimeline
            entries={entries}
            onToggleFavorite={toggleFavorite}
            onToggleLike={toggleLike}
            onAddComment={addComment}
          />
        )
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="border-b p-4 text-center sticky top-0 bg-white z-10">
        <h1 className="text-xl font-semibold">コーヒー手帳</h1>
      </header>

      <main className="flex-1 overflow-auto pb-16">{renderCurrentPage()}</main>

      <CoffeeNavigation currentPage={currentPage} onChangePage={setCurrentPage} />
    </div>
  )
}

