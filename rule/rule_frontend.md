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

## Design Aesthetics (Premium Retro Wiki)

2000年代初頭の攻略Wiki（アットウィキ等）の機能美を現代の技術で再現する。

1. **Classic Wiki Layout**: 
   - 左サイドバー（ナビゲーション）、中央メインコンテンツ、右サイドバー（任意：インフォボックスや広告枠）の3カラム構成。
   - コンテンツ幅は読みやすさを重視し、広すぎないように制限する。
2. **Color Utility**: 
   - 背景は白（#FFFFFF）、見出し背景は淡い青やグレー（#F0F7FF, #EEEEEE）を使用。
   - リンクは伝統的な青（#0000EE）で、ホバー時に下線を表示。
3. **Typography**: 
   - システムフォント（Sans-serif）を優先。装飾よりも「情報の密度」と「読みやすさ」を最優先する。
   - 見出し（H1, H2, H3）には左側に太い縦線やアイコンを配置し、セクションの区切りを明確にする。
4. **Wiki Components**: 
   - **Table**: 表を多用する。枠線（border）は明確に、1行おきに背景色を変える（縞々）。
   - **Infobox**: 記事の右上に概要をまとめたカード形式のコンポーネントを配置。
   - **Breadcrumbs**: 階層構造を常に表示し、現在地を分かりやすくする。
   - **Status Tags**: 更新日時や「New」ラベルをWikiらしい無骨なデザインで配置。
5. **Modernized Feedback**: 
   - 昔のWikiの見た目をしつつ、レスポンスは高速で、ボタンやフォームのインタラクションには現代的なフィードバック（微細な挙動）を加える。
   - モバイルでも崩れないレスポンシブな表の設計。

## TDD & Testing Guidelines

1. **Testing Framework**: Vitest を使用。
2. **Component Testing**: 
   - 複雑なロジックを持つ React コンポーネントは React Testing Library でテストする。
   - 純粋な表示のみのコンポーネントは無理にテストせず、Storybook等での視覚的確認を優先する。
3. **Hook Testing**: カスタム Hook は `renderHook` を用いて単体テストを行う。

## CMS & Admin Guidelines

1. **Admin Directory**: 管理機能は `src/pages/admin/` 配下に配置する。
2. **Editor**: Markdown エディタを統合し、プレビュー機能を持たせる。
3. **Security**: シンプルな認証（Basic認証や環境変数によるトークンチェック）を導入する。