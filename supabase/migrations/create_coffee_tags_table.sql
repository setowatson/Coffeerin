-- コーヒー記録とタグの中間テーブルの作成
CREATE TABLE IF NOT EXISTS public.coffee_tags (
    coffee_entry_id uuid REFERENCES public.coffee_entries ON DELETE CASCADE NOT NULL,
    tag_id uuid REFERENCES public.tags ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (coffee_entry_id, tag_id)
);

-- タグ数制限を確認するトリガー関数
CREATE OR REPLACE FUNCTION check_coffee_tags_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM public.coffee_tags
        WHERE coffee_entry_id = NEW.coffee_entry_id
    ) >= 10 THEN
        RAISE EXCEPTION 'Maximum number of tags (10) exceeded for this coffee entry';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- タグ数制限トリガーの作成
CREATE TRIGGER check_coffee_tags_limit_trigger
    BEFORE INSERT ON public.coffee_tags
    FOR EACH ROW
    EXECUTE FUNCTION check_coffee_tags_limit();

-- RLSポリシーの設定
ALTER TABLE public.coffee_tags ENABLE ROW LEVEL SECURITY;

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