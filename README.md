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
coffee-journal/
├── app/                 # Next.js 13+ App Router
├── components/          # Reactコンポーネント
├── lib/                 # ユーティリティ関数
├── hooks/              # カスタムフック
├── public/             # 静的ファイル
└── styles/             # グローバルスタイル
```
