-- 画像テーブルの作成
CREATE TABLE IF NOT EXISTS public.coffee_images (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    coffee_entry_id uuid REFERENCES public.coffee_entries ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 画像数制限を確認するトリガー関数
CREATE OR REPLACE FUNCTION check_coffee_images_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM public.coffee_images
        WHERE coffee_entry_id = NEW.coffee_entry_id
    ) >= 5 THEN
        RAISE EXCEPTION 'Maximum number of images (5) exceeded for this coffee entry';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 画像数制限トリガーの作成
CREATE TRIGGER check_coffee_images_limit_trigger
    BEFORE INSERT ON public.coffee_images
    FOR EACH ROW
    EXECUTE FUNCTION check_coffee_images_limit();

-- 更新日時を自動更新する関数とトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coffee_images_updated_at
    BEFORE UPDATE ON public.coffee_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシーの設定
ALTER TABLE public.coffee_images ENABLE ROW LEVEL SECURITY;

-- coffee_imagesのポリシー
CREATE POLICY "ユーザーは自分の画像を参照可能" ON public.coffee_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    );

CREATE POLICY "ユーザーは自分の画像を追加可能" ON public.coffee_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    );

CREATE POLICY "ユーザーは自分の画像を削除可能" ON public.coffee_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    ); 