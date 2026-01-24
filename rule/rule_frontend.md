# フロントエンドルール (Frontend Rules)

## Architecture & Tech Stack

- **Framework**: Astro (SSR)
- **UI Framework**: React
- **Styling**: Tailwind CSS (v4)
- **Architecture**: **Feature-Sliced Design (FSD) Inspired**

## Directory Structure Strategy

**機能（Feature）** を軸に分割し、コロケーション（Co-location）を徹底する。Astroの `src/pages` はルーティングに専念させ、ロジックは `features` に寄せる。

- **Structure Example**:

```text
frontend/
├── src/
│   ├── pages/                 # Routing (Astro Pages)
│   ├── components/            # Shared UI Components (Design System)
│   │   └── ui/                # Primitive UI (Button, Card)
│   ├── features/              # Business Logic & Feature Components
│   │   ├── blog/              # Example Feature
│   │   │   ├── components/    # Feature-specific UI (React/Astro)
│   │   │   ├── hooks/         # Custom Hooks
│   │   │   ├── api.ts         # API Calls
│   │   │   └── types.ts       # Feature types
│   ├── layouts/               # Global Layouts (BaseLayout.astro)
│   ├── lib/                   # Utility Functions, API Client
│   └── styles/                # Global Styles
```

## Component Design (Astro + React)

Astroの **Island Architecture** を最大限活かすため、以下の指針を守ること。

### 1. Astro Components (Server-Only by Default)

- **原則**: 静的なコンテンツや、ビルド時・リクエスト時にサーバーで完結するデータ取得は Astro コンポーネントで行う。
- **責務**:
  - SEO用のメタデータ処理。
  - バックエンドAPIからの初期データ取得（SSR）。
  - 静的レイアウトの構築。

### 2. React Components (Client Islands)

- **宣言**: インタラクティブな要素が必要な場合のみ React コンポーネントを使用し、`client:load` や `client:visible` 等のディレクティブで有効化する。
- **責務**:
  - ユーザーインタラクション（いいねボタン、コメント入力）。
  - クライアントサイドの状態管理。

### 3. Composition Pattern (Children passing)

Astroコンポーネントの中で Reactコンポーネントを呼び出し、その `children` として別のAstroコンポーネントやHTMLを渡すことで、JavaScriptの送信量を最小限に抑える。

## State Management Rules

1. **URL as a Source of Truth**: 検索条件やページネーションは URL Search Params で管理する。
2. **Server State**: SSR時に Astro.props や API から取得したデータを使用する。
3. **Client State**: コンポーネント固有のUI状態のみ React の `useState` 等を使用する。

## Styling Guidelines (Tailwind CSS v4)

- **Utility-First**: 原則として Tailwind のクラスのみでスタイリングする。
- **Responsive**: `md:`, `lg:` を活用したモバイルファースト設計。
- **Modern CSS**: v4 の機能を活用し、`theme()` 関数や新しい構文を適切に使用する。