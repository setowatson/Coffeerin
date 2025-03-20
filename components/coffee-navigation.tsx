"use client"

import { Home, Search, PlusSquare, Heart, User, BarChart3 } from "lucide-react"
import type { Page } from "@/components/coffee-app"

interface CoffeeNavigationProps {
  currentPage: Page
  onChangePage: (page: Page) => void
}

export function CoffeeNavigation({ currentPage, onChangePage }: CoffeeNavigationProps) {
  const navItems = [
    { icon: Home, label: "ホーム", value: "timeline" as Page },
    { icon: Search, label: "検索", value: "search" as Page },
    { icon: PlusSquare, label: "追加", value: "add" as Page },
    { icon: Heart, label: "通知", value: "notifications" as Page },
    { icon: BarChart3, label: "統計", value: "statistics" as Page },
    { icon: User, label: "プロフィール", value: "profile" as Page },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-14 z-10">
      {navItems.map((item) => (
        <button
          key={item.value}
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPage === item.value ? "text-black" : "text-gray-500"
          }`}
          onClick={() => onChangePage(item.value)}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

