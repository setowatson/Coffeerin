"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MapSearchProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelected: (place: { name: string; placeId: string }) => void
}

// Mock Google Places API results for demonstration
const mockPlaces = [
  { name: "スターバックスコーヒー 渋谷店", placeId: "place123" },
  { name: "上島珈琲店 新宿店", placeId: "place456" },
  { name: "猿田彦珈琲 表参道店", placeId: "place789" },
  { name: "ブルーボトルコーヒー 清澄白河店", placeId: "place101" },
]

export function MapSearch({ value, onChange, onPlaceSelected }: MapSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof mockPlaces>([])

  // In a real app, this would use the Google Places API
  useEffect(() => {
    if (value.length > 1) {
      const filtered = mockPlaces.filter((place) => place.name.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  const handleSelectPlace = (place: (typeof mockPlaces)[0]) => {
    onChange(place.name)
    onPlaceSelected(place)
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="カフェ名や店舗名"
          className="pl-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 1 && setSuggestions.length > 0 && setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (
        <Card className="absolute z-10 w-full mt-1 p-2 max-h-60 overflow-auto">
          {suggestions.map((place) => (
            <Button
              key={place.placeId}
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => handleSelectPlace(place)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {place.name}
            </Button>
          ))}
        </Card>
      )}
    </div>
  )
}

