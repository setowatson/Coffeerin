"use client"

import { Star } from "lucide-react"

interface CoffeeRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export function CoffeeRating({ rating, onRatingChange, readonly = false, size = "md" }: CoffeeRatingProps) {
  const maxRating = 5

  const handleClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`${sizeClass[size]} ${
            index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          } ${!readonly ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  )
}

