"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Upload, Coffee, Tag } from "lucide-react"
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CoffeeRating } from "@/components/coffee-rating"
import type { CoffeeEntry } from "@/components/coffee-app"
import { MapSearch } from "@/components/map-search"
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import {
  CoffeeType,
  BrewMethod,
  RoastLevel,
  COFFEE_TYPE_LABELS,
  BREW_METHOD_LABELS,
  ROAST_LEVEL_LABELS,
} from '@/types/coffee'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "コーヒー名を入力してください。",
  }),
  coffeeType: z.string().min(1, {
    message: "コーヒータイプを選択してください。",
  }),
  brewMethod: z.string().min(1, {
    message: "淹れ方を選択してください。",
  }),
  roastLevel: z.string().min(1, {
    message: "焙煎度を選択してください。",
  }),
  location: z.string().min(1, {
    message: "場所を入力してください。",
  }),
  placeId: z.string().optional(),
  rating: z.number().min(1).max(5),
  acidity: z.number().min(1).max(5),
  sweetness: z.number().min(1).max(5),
  bitterness: z.number().min(1).max(5),
  body: z.number().min(1).max(5),
  date: z.date(),
  comment: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CoffeeEntryFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function CoffeeEntryForm({ initialData, isEdit = false }: CoffeeEntryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      coffeeType: initialData?.coffee_type || "SINGLE_ORIGIN",
      brewMethod: initialData?.brew_method || "DRIP",
      roastLevel: initialData?.roast_level || "MEDIUM",
      location: initialData?.location || "",
      placeId: initialData?.placeId || "",
      rating: initialData?.rating || 3,
      acidity: initialData?.acidity || 3,
      sweetness: initialData?.sweetness || 3,
      bitterness: initialData?.bitterness || 3,
      body: initialData?.body || 3,
      date: initialData?.tasting_date ? new Date(initialData.tasting_date) : new Date(),
      comment: initialData?.comment || "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      if (tags.length >= 10) {
        setError('タグは最大10個までです。')
        return
      }
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handlePlaceSelected = (place: { name: string; placeId: string }) => {
    form.setValue("location", place.name)
    form.setValue("placeId", place.placeId)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('認証エラー')

      const coffeeData = {
        user_id: user.id,
        name: form.getValues("name"),
        coffee_type: form.getValues("coffeeType"),
        brew_method: form.getValues("brewMethod"),
        roast_level: form.getValues("roastLevel"),
        tasting_date: format(form.getValues("date"), "yyyy-MM-dd"),
        rating: form.getValues("rating"),
        acidity: form.getValues("acidity"),
        sweetness: form.getValues("sweetness"),
        bitterness: form.getValues("bitterness"),
        body: form.getValues("body"),
        comment: form.getValues("comment"),
      }

      let coffeeEntryId
      if (isEdit && initialData?.id) {
        const { error: updateError } = await supabase
          .from('coffee_entries')
          .update(coffeeData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
        coffeeEntryId = initialData.id
      } else {
        const { data: newEntry, error: insertError } = await supabase
          .from('coffee_entries')
          .insert(coffeeData)
          .select('id')
          .single()

        if (insertError) throw insertError
        coffeeEntryId = newEntry.id
      }

      // 画像の関連付け
      if (imagePreview) {
        const { error: imageError } = await supabase
          .from('coffee_images')
          .insert({
            coffee_entry_id: coffeeEntryId,
            image_url: imagePreview,
          })

        if (imageError) throw imageError
      }

      // タグの関連付け
      const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          // タグが存在するか確認
          const { data: existingTags } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single()

          if (existingTags) {
            return existingTags.id
          }

          // 新しいタグを作成
          const { data: newTag, error: tagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single()

          if (tagError) throw tagError
          return newTag.id
        })
      )

      if (tagIds.length > 0) {
        const tagData = tagIds.map(tagId => ({
          coffee_entry_id: coffeeEntryId,
          tag_id: tagId
        }))

        const { error: tagLinkError } = await supabase
          .from('coffee_tags')
          .insert(tagData)

        if (tagLinkError) throw tagLinkError
      }

      router.push('/coffee')
    } catch (error) {
      setError('コーヒー記録の保存に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">新しいコーヒーを記録</h2>

      {/* Image upload preview */}
      <div className="mb-6">
        {imagePreview ? (
          <div className="relative aspect-square mb-2">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => setImagePreview(null)}
            >
              削除
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">クリックして写真をアップロード</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (最大 10MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Coffee className="mr-2 h-5 w-5" />
              コーヒー情報
            </h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コーヒー名 / 豆の種類</FormLabel>
                  <FormControl>
                    <Input placeholder="例: エチオピア イルガチェフェ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coffeeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>コーヒータイプ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(COFFEE_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brewMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>淹れ方</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(BREW_METHOD_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roastLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>焙煎度</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ROAST_LEVEL_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              場所情報
            </h3>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>場所</FormLabel>
                  <FormControl>
                    <MapSearch value={field.value} onChange={field.onChange} onPlaceSelected={handlePlaceSelected} />
                  </FormControl>
                  <FormDescription>カフェ名や店舗名を入力すると候補が表示されます</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">評価</h3>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>総合評価</FormLabel>
                  <FormControl>
                    <CoffeeRating rating={field.value} onRatingChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-medium">味わいプロファイル</h4>

              <FormField
                control={form.control}
                name="acidity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>酸味</FormLabel>
                      <span className="text-sm">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sweetness"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>甘み</FormLabel>
                      <span className="text-sm">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bitterness"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>苦味</FormLabel>
                      <span className="text-sm">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>コク</FormLabel>
                      <span className="text-sm">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              タグ
            </h3>

            <div>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="タグを追加 (Enterで確定)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} className="ml-2" disabled={!tagInput.trim()}>
                  追加
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button type="button" className="ml-1 text-xs" onClick={() => removeTag(tag)}>
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>飲んだ日付</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "yyyy年MM月dd日") : <span>日付を選択</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>コメント (オプション)</FormLabel>
                <FormControl>
                  <Textarea placeholder="味や香りの特徴、感想など" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>自由に感想やメモを残せます</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '保存中...' : isEdit ? '更新' : '記録する'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

