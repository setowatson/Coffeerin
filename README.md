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

## プロジェクト構造

```
.
├── app/                 # Next.jsのアプリケーションコード
├── components/         # 共通コンポーネント
├── docs/              # ドキュメント
├── hooks/             # カスタムフック
├── lib/               # ユーティリティ関数
├── public/            # 静的ファイル
├── styles/            # スタイルシート
├── .env.local         # 環境変数
├── .gitignore         # Gitの除外設定
├── next.config.mjs    # Next.js設定
├── package.json       # 依存パッケージ
├── postcss.config.mjs # PostCSS設定
├── tailwind.config.ts # Tailwind CSS設定
└── tsconfig.json      # TypeScript設定
```
