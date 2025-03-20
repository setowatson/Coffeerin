"use client"

import { useEffect, useRef } from "react"
import type { TasteProfile } from "@/components/coffee-app"

interface TasteProfileChartProps {
  profile: TasteProfile
}

export function TasteProfileChart({ profile }: TasteProfileChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw background
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb" // gray-200
    ctx.lineWidth = 1

    // Draw axes
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Draw radar background
    const sides = 4
    const angleStep = (Math.PI * 2) / sides

    for (let r = 1; r <= 5; r++) {
      const scaledRadius = (radius / 5) * r
      ctx.beginPath()
      for (let i = 0; i <= sides; i++) {
        const angle = i * angleStep - Math.PI / 4
        const x = centerX + scaledRadius * Math.cos(angle)
        const y = centerY + scaledRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#e5e7eb" // gray-200
      ctx.stroke()
    }

    // Draw data
    const values = [profile.acidity, profile.sweetness, profile.bitterness, profile.body]

    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const angle = (i % sides) * angleStep - Math.PI / 4
      const value = values[i % sides]
      const scaledRadius = (radius / 5) * value
      const x = centerX + scaledRadius * Math.cos(angle)
      const y = centerY + scaledRadius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#f59e0b" // amber-500
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = "rgba(245, 158, 11, 0.2)" // amber-500 with opacity
    ctx.fill()

    // Draw labels
    const labels = ["酸味", "甘み", "苦味", "コク"]
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 4
      const x = centerX + (radius + 15) * Math.cos(angle)
      const y = centerY + (radius + 15) * Math.sin(angle)
      ctx.fillText(labels[i], x, y)
    }
  }, [profile])

  return <canvas ref={canvasRef} width={200} height={200} className="w-full h-auto max-w-[200px] mx-auto" />
}

