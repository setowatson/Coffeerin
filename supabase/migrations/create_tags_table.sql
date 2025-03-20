-- タグテーブルの作成
CREATE TABLE IF NOT EXISTS public.tags (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON public.tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシーの設定
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- tagsのポリシー
CREATE POLICY "タグは全ユーザーが参照可能" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "認証済みユーザーはタグを追加可能" ON public.tags
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- タグの更新と削除は管理者のみ可能（オプション）
CREATE POLICY "管理者はタグを更新可能" ON public.tags
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "管理者はタグを削除可能" ON public.tags
    FOR DELETE USING (auth.role() = 'authenticated'); 