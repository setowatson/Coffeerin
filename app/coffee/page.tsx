'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  CoffeeEntry,
  COFFEE_TYPE_LABELS,
  BREW_METHOD_LABELS,
  ROAST_LEVEL_LABELS
} from '@/types/coffee';

export default function CoffeePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadCoffeeEntries();
  }, []);

  const loadCoffeeEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const { data: entriesData, error: entriesError } = await supabase
        .from('coffee_entries')
        .select(`
          *,
          coffee_images (
            image_url
          ),
          coffee_tags (
            tags (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      const formattedEntries = entriesData.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        name: entry.name,
        coffeeType: entry.coffee_type,
        brewMethod: entry.brew_method,
        roastLevel: entry.roast_level,
        tastingDate: entry.tasting_date,
        rating: entry.rating,
        tasteProfile: {
          acidity: entry.acidity,
          sweetness: entry.sweetness,
          bitterness: entry.bitterness,
          body: entry.body
        },
        comment: entry.comment,
        placeName: entry.place_name,
        placeId: entry.place_id,
        latitude: entry.latitude,
        longitude: entry.longitude,
        images: entry.coffee_images?.map((img: any) => img.image_url) || [],
        tags: entry.coffee_tags?.map((tag: any) => tag.tags.name) || [],
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      }));

      setEntries(formattedEntries);
    } catch (error) {
      setError('コーヒー記録の読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('この記録を削除してもよろしいですか？')) return;

    try {
      const { error } = await supabase
        .from('coffee_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error) {
      setError('記録の削除に失敗しました。');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">コーヒー記録</h1>
        <Button onClick={() => router.push('/coffee/new')}>
          新しい記録を追加
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {entry.images && entry.images[0] && (
              <div className="relative h-48">
                <Image
                  src={entry.images[0]}
                  alt={entry.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{entry.name}</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-400 text-lg">{'★'.repeat(entry.rating)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>コーヒータイプ:</div>
                <div>{COFFEE_TYPE_LABELS[entry.coffeeType]}</div>
                <div>淹れ方:</div>
                <div>{BREW_METHOD_LABELS[entry.brewMethod]}</div>
                <div>焙煎度:</div>
                <div>{ROAST_LEVEL_LABELS[entry.roastLevel]}</div>
                <div>飲んだ日:</div>
                <div>{format(new Date(entry.tastingDate), 'yyyy年MM月dd日')}</div>
              </div>

              {entry.tasteProfile && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>酸味: {'●'.repeat(entry.tasteProfile.acidity || 0)}</div>
                  <div>甘み: {'●'.repeat(entry.tasteProfile.sweetness || 0)}</div>
                  <div>苦味: {'●'.repeat(entry.tasteProfile.bitterness || 0)}</div>
                  <div>コク: {'●'.repeat(entry.tasteProfile.body || 0)}</div>
                </div>
              )}

              {entry.comment && (
                <p className="text-gray-600 text-sm line-clamp-3">{entry.comment}</p>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/coffee/${entry.id}/edit`)}
                >
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          まだコーヒー記録がありません。新しい記録を追加してみましょう！
        </div>
      )}
    </div>
  );
} 