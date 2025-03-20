-- 列挙型の作成
DO $$ BEGIN
    CREATE TYPE coffee_type AS ENUM (
        'SINGLE_ORIGIN',
        'BLEND',
        'ESPRESSO',
        'DECAF',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE roast_level AS ENUM (
        'LIGHT',
        'MEDIUM_LIGHT',
        'MEDIUM',
        'MEDIUM_DARK',
        'DARK'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 一時的な列の追加
ALTER TABLE coffee_entries
ADD COLUMN IF NOT EXISTS coffee_type_enum coffee_type,
ADD COLUMN IF NOT EXISTS brew_method_enum brew_method,
ADD COLUMN IF NOT EXISTS roast_level_enum roast_level,
ADD COLUMN IF NOT EXISTS latitude decimal(10,8),
ADD COLUMN IF NOT EXISTS longitude decimal(11,8),
ADD COLUMN IF NOT EXISTS tasting_date date;

-- 既存データの移行
UPDATE coffee_entries
SET coffee_type_enum = coffee_type::coffee_type,
    brew_method_enum = brew_method::brew_method,
    roast_level_enum = roast_level::roast_level,
    tasting_date = date;

-- 古い列の削除と制約の設定
ALTER TABLE coffee_entries
DROP COLUMN IF EXISTS coffee_type,
DROP COLUMN IF EXISTS brew_method,
DROP COLUMN IF EXISTS roast_level,
DROP COLUMN IF EXISTS date;

-- NOT NULL制約とデフォルト値の設定
ALTER TABLE coffee_entries
ALTER COLUMN coffee_type_enum SET NOT NULL,
ALTER COLUMN brew_method_enum SET NOT NULL,
ALTER COLUMN roast_level_enum SET NOT NULL,
ALTER COLUMN tasting_date SET NOT NULL,
ALTER COLUMN tasting_date SET DEFAULT CURRENT_DATE;

-- 列名の変更
ALTER TABLE coffee_entries RENAME COLUMN coffee_type_enum TO coffee_type;
ALTER TABLE coffee_entries RENAME COLUMN brew_method_enum TO brew_method;
ALTER TABLE coffee_entries RENAME COLUMN roast_level_enum TO roast_level;

-- タイムスタンプのデフォルト値を更新
ALTER TABLE coffee_entries
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- 場所名のカラム名を統一
ALTER TABLE coffee_entries RENAME COLUMN location TO place_name;