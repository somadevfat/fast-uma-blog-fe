# 憲法 破ったら死刑

- 日本語ですべてやり取りを行う。

# Fast Uma Blog Frontend Style Guide (Astro + React + FSD Inspired)

## 1. 基本原則

- **言語**: 日本語でコミュニケーションすること。
- **フレームワーク**: Astro (SSR優先)。
- **インタラクション**: React コンポーネントを使用し、`client:*` ディレクティブで Island 化する。
- **スタイリング**: Tailwind CSS v4 (Utility-first)。

## 2. ディレクトリ構造とレイヤー責務

FSD (Feature-Sliced Design) の考え方を取り入れた構造：

- **src/features/{feature_name}/**:
  - 機能（blog, interactions等）単位でロジックとUIをカプセル化する。
  - `components/`: その機能独自のUI（React/Astro）。
  - `api/`: その機能が使用するAPIエンドポイントへのfetch関数を定義。
  - `types/`: 機能に関連する型定義。
- **src/components/ui/**:
  - ボタン、インプット、カードなど、特定のビジネスロジックを持たない共有UI。
- **src/pages/**:
  - Astro のルーティング定義。
  - ここでは極力ロジックを書かず、features 配下のコンポーネントを配置するだけにする。

## 3. コーディング規約

- **API Call**: コンポーネント内で直接 `fetch` を使用せず、必ず feature 配下の `api/` で定義された関数を呼び出す。
- **Islands Architecture**:
  - 静的な部分は Astro コンポーネントで構築し、JSの転送量を削減する。
  - インタラクティブな部分（ボタン、フォーム）のみ React コンポーネントにし、適切な `client:*` 指示子（`load`, `visible`等）を付与する。
- **Tailwind CSS**: クラスの並び順は Prettier 等の自動整形に任せ、恣意的な CSS ファイルの作成は避ける。

## 4. テスト方針

- Vitest + React Testing Library を使用する。
- `*.test.tsx` は対象のコンポーネントと同じディレクトリに配置する（Colocation）。
- コンポーネントの振る舞い（ユーザー操作と表示の更新）をテストの主眼とする。
