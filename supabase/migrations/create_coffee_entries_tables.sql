-- コーヒータイプの列挙型
CREATE TYPE coffee_type AS ENUM (
  'SINGLE_ORIGIN',
  'BLEND',
  'ESPRESSO',
  'DECAF',
  'OTHER'
);

-- 淹れ方の列挙型
CREATE TYPE brew_method AS ENUM (
  'DRIP',
  'FRENCH_PRESS',
  'AEROPRESS',
  'ESPRESSO_MACHINE',
  'HAND_DRIP',
  'COLD_BREW',
  'SIPHON',
  'OTHER'
);

-- 焙煎度の列挙型
CREATE TYPE roast_level AS ENUM (
  'LIGHT',
  'MEDIUM_LIGHT',
  'MEDIUM',
  'MEDIUM_DARK',
  'DARK'
);

-- コーヒー記録テーブル
CREATE TABLE coffee_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  coffee_type coffee_type NOT NULL,
  brew_method brew_method NOT NULL,
  roast_level roast_level NOT NULL,
  tasting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  acidity INTEGER CHECK (acidity >= 1 AND acidity <= 5),
  sweetness INTEGER CHECK (sweetness >= 1 AND sweetness <= 5),
  bitterness INTEGER CHECK (bitterness >= 1 AND bitterness <= 5),
  body INTEGER CHECK (body >= 1 AND body <= 5),
  comment TEXT CHECK (char_length(comment) <= 500),
  place_name TEXT,
  place_id TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- コーヒー画像テーブル
CREATE TABLE coffee_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coffee_entry_id UUID REFERENCES coffee_entries ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- タグテーブル
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- コーヒー記録とタグの中間テーブル
CREATE TABLE coffee_tags (
  coffee_entry_id UUID REFERENCES coffee_entries ON DELETE CASCADE,
  tag_id UUID REFERENCES tags ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (coffee_entry_id, tag_id)
);

-- タイムスタンプ自動更新のトリガー
CREATE TRIGGER handle_coffee_entries_updated_at
  BEFORE UPDATE ON coffee_entries
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime();

-- セキュリティポリシーの設定
ALTER TABLE coffee_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_tags ENABLE ROW LEVEL SECURITY;

-- coffee_entriesのポリシー
CREATE POLICY "ユーザーは自分の記録を作成可能"
  ON coffee_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の記録を参照可能"
  ON coffee_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の記録を更新可能"
  ON coffee_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の記録を削除可能"
  ON coffee_entries FOR DELETE
  USING (auth.uid() = user_id);

-- coffee_imagesのポリシー
CREATE POLICY "ユーザーは自分の記録の画像を作成可能"
  ON coffee_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  ));

CREATE POLICY "ユーザーは自分の記録の画像を参照可能"
  ON coffee_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  ));

CREATE POLICY "ユーザーは自分の記録の画像を削除可能"
  ON coffee_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  ));

-- tagsのポリシー
CREATE POLICY "タグは誰でも作成可能"
  ON tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "タグは誰でも参照可能"
  ON tags FOR SELECT
  USING (true);

-- coffee_tagsのポリシー
CREATE POLICY "ユーザーは自分の記録にタグを付けられる"
  ON coffee_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  ));

CREATE POLICY "ユーザーは自分の記録のタグを参照可能"
  ON coffee_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  ));

CREATE POLICY "ユーザーは自分の記録のタグを削除可能"
  ON coffee_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM coffee_entries
    WHERE id = coffee_entry_id AND user_id = auth.uid()
  )); 