export type CoffeeType = 'SINGLE_ORIGIN' | 'BLEND' | 'ESPRESSO' | 'DECAF' | 'OTHER';

export type BrewMethod = 'DRIP' | 'FRENCH_PRESS' | 'AEROPRESS' | 'ESPRESSO_MACHINE' | 'HAND_DRIP' | 'COLD_BREW' | 'SIPHON' | 'OTHER';

export type RoastLevel = 'LIGHT' | 'MEDIUM_LIGHT' | 'MEDIUM' | 'MEDIUM_DARK' | 'DARK';

export interface TasteProfile {
  acidity?: number;
  sweetness?: number;
  bitterness?: number;
  body?: number;
}

export interface CoffeeEntry {
  id: string;
  userId: string;
  name: string;
  coffeeType: CoffeeType;
  brewMethod: BrewMethod;
  roastLevel: RoastLevel;
  tastingDate: string;
  rating: number;
  tasteProfile?: TasteProfile;
  comment?: string;
  placeName?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeImage {
  id: string;
  coffeeEntryId: string;
  imageUrl: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export const COFFEE_TYPE_LABELS: Record<CoffeeType, string> = {
  SINGLE_ORIGIN: 'シングルオリジン',
  BLEND: 'ブレンド',
  ESPRESSO: 'エスプレッソ',
  DECAF: 'カフェインレス',
  OTHER: 'その他'
};

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
  DRIP: 'ドリップ',
  FRENCH_PRESS: 'フレンチプレス',
  AEROPRESS: 'エアロプレス',
  ESPRESSO_MACHINE: 'エスプレッソマシン',
  HAND_DRIP: 'ハンドドリップ',
  COLD_BREW: '水出し',
  SIPHON: 'サイフォン',
  OTHER: 'その他'
};

export const ROAST_LEVEL_LABELS: Record<RoastLevel, string> = {
  LIGHT: 'ライトロースト',
  MEDIUM_LIGHT: 'ミディアムライトロースト',
  MEDIUM: 'ミディアムロースト',
  MEDIUM_DARK: 'ミディアムダークロースト',
  DARK: 'ダークロースト'
}; 