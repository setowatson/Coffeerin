# コーヒー手帳

コーヒー愛好家が飲んだコーヒーを詳細に記録し、分析し、他のユーザーと共有できるソーシャルプラットフォーム

## 技術スタック

### フロントエンド
- Next.js（React）
- TypeScript
- Tailwind CSS
- shadcn/ui コンポーネント
- Vercel（デプロイメント・ホスティング）

### バックエンド
- Supabase
  - PostgreSQL（データベース）
  - Authentication（認証）
  - Storage（画像ストレージ）
  - Realtime（リアルタイム機能）
  - Edge Functions（サーバーレス関数）

### 外部サービス
- Google Maps Platform（位置情報サービス）

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd coffee-journal
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env.local`ファイルを作成し、必要な環境変数を設定してください：
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造

```
coffee-journal/
├── app/                 # Next.js 13+ App Router
├── components/          # Reactコンポーネント
├── lib/                 # ユーティリティ関数
├── hooks/              # カスタムフック
├── public/             # 静的ファイル
└── styles/             # グローバルスタイル
```

## 開発ガイドライン

- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従ってください
- プルリクエストを作成する前に、必ずコードのフォーマットとリントを実行してください
- 新機能の追加時は、まず要件定義書を確認し、必要に応じて更新してください

## ライセンス

MIT 