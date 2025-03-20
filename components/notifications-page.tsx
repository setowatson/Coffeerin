import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus } from "lucide-react"

export function NotificationsPage() {
  const notifications = [
    {
      id: "1",
      type: "like",
      user: {
        name: "田中 コーヒー",
        username: "tanaka_coffee",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "あなたの投稿にいいねしました",
      time: "2時間前",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      type: "comment",
      user: {
        name: "佐藤 カフェ",
        username: "sato_cafe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "「素晴らしいコーヒーですね！」とコメントしました",
      time: "5時間前",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      type: "follow",
      user: {
        name: "鈴木 ロースト",
        username: "suzuki_roast",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "あなたをフォローしました",
      time: "1日前",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">通知</h2>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
              <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center">
                <p className="text-sm">
                  <span className="font-semibold">{notification.user.username}</span> {notification.content}
                </p>
                <span className="ml-2">{getIcon(notification.type)}</span>
              </div>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>

            {notification.image && (
              <div className="ml-2 w-10 h-10">
                <img src={notification.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

