'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profile);
      } catch (error) {
        setError('プロフィールの読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/signin');
    } catch (error) {
      setError('ログアウトに失敗しました。');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">プロフィール</h1>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/profile/edit')}
          >
            編集
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
          >
            ログアウト
          </Button>
        </div>
      </div>

      {profile && (
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {profile.avatar_url && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h2 className="text-xl font-semibold">{profile.display_name}</h2>
              <p className="text-gray-500">@{profile.username}</p>
            </div>
          </div>

          {profile.bio && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">投稿</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">フォロワー</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">フォロー中</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 