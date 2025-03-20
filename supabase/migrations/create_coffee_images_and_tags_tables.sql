-- 画像テーブルの作成
CREATE TABLE IF NOT EXISTS public.coffee_images (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    coffee_entry_id uuid REFERENCES public.coffee_entries ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT max_images_per_entry CHECK (
        (SELECT COUNT(*) FROM public.coffee_images ci 
         WHERE ci.coffee_entry_id = coffee_entry_id) <= 5
    )
);

-- タグテーブルの作成
CREATE TABLE IF NOT EXISTS public.tags (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- コーヒー記録とタグの中間テーブルの作成
CREATE TABLE IF NOT EXISTS public.coffee_tags (
    coffee_entry_id uuid REFERENCES public.coffee_entries ON DELETE CASCADE NOT NULL,
    tag_id uuid REFERENCES public.tags ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (coffee_entry_id, tag_id),
    CONSTRAINT max_tags_per_entry CHECK (
        (SELECT COUNT(*) FROM public.coffee_tags ct 
         WHERE ct.coffee_entry_id = coffee_entry_id) <= 10
    )
);

-- RLSポリシーの設定
ALTER TABLE public.coffee_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_tags ENABLE ROW LEVEL SECURITY;

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

-- tagsのポリシー
CREATE POLICY "タグは全ユーザーが参照可能" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "認証済みユーザーはタグを追加可能" ON public.tags
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- coffee_tagsのポリシー
CREATE POLICY "ユーザーは自分のタグ付けを参照可能" ON public.coffee_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    );

CREATE POLICY "ユーザーは自分のタグ付けを追加可能" ON public.coffee_tags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    );

CREATE POLICY "ユーザーは自分のタグ付けを削除可能" ON public.coffee_tags
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.coffee_entries ce
            WHERE ce.id = coffee_entry_id
            AND ce.user_id = auth.uid()
        )
    );

-- 更新日時を自動更新する関数とトリガーの作成
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

CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON public.tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 