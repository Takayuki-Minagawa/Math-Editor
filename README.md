# 数式エディタ (Math Equation Editor)

ブラウザ上で LaTeX 形式の数式を作成できるWebアプリケーションです。
ツールバーのボタンから記号や構造を選択し、リアルタイムプレビューで確認しながら数式を組み立てることができます。

## 主な機能

- **ツールバー入力** -- ギリシャ文字・演算子・分数・積分・行列・書式など、12カテゴリのボタンから LaTeX コマンドを挿入
- **直接入力・貼り付け** -- テキストエリアに LaTeX を直接記述・ペーストすることも可能
- **下書きの自動保存・復元** -- 入力内容をこのブラウザに保存し、再読み込み後も編集を継続（クリアで下書きも削除）
- **書式設定** -- 文字色・背景色・取消線・囲み枠をツールバーから挿入
- **リアルタイムプレビュー** -- 入力内容を即座に数式として描画（エラー表示付き）
- **LaTeX コピー** -- 作成した LaTeX 文字列をクリップボードにコピー
- **MathML コピー** -- 数式を MathML ソースのテキストとしてコピーし、MathML 入力対応ツールで再利用
- **画像コピー** -- プレビュー画像を PNG 形式でクリップボードにコピー（他アプリへ貼り付け可能）
- **Markdown 保存** -- `$$...$$` で囲んだ Markdown ファイル (.md) としてダウンロード
- **画像保存** -- プレビュー画像を PNG ファイル (equation.png) としてダウンロード
- **多言語対応** -- 日本語（デフォルト）/ 英語の切り替えが可能（設定はブラウザに保存）
- **使い方ガイド** -- アプリ内に折りたたみ式のマニュアルを内蔵

## ツールバー カテゴリ

| カテゴリ | 内容 |
|---------|------|
| ギリシャ文字 | α, β, γ, ... , Γ, Δ, Σ, Ω など |
| 演算子 | +, -, ×, ÷, ±, · など |
| 関係 | =, ≠, ≤, ≥, ∈, ⊂ など |
| 構造 | 上付き・下付き文字、分数、平方根、二項係数 |
| 大型演算子 | 総和 (Σ)、積分 (∫)、極限 (lim) など |
| 行列 | 丸括弧・角括弧・行列式 (2×2, 3×3)、場合分け |
| 括弧 | 丸括弧、角括弧、波括弧、絶対値、ノルムなど |
| 矢印 | →, ⇒, ⇔, ↦ など |
| 関数 | sin, cos, tan, log, ln, exp, lim など |
| 装飾 | ハット、バー、ドット、ベクトル、チルダなど |
| 書式 | 文字色、背景色、取消線、囲み枠 |
| その他 | ∞, ∂, ∇, ℝ, ℤ, スペース、テキストモードなど |

## 使い方

1. ツールバーのタブからカテゴリを選択
2. ボタンをクリックして LaTeX コマンドを挿入（テキストエリアに直接入力・貼り付けも可）
   - 色ボタンはカラーパレットを開き、選択した色を `\textcolor{...}` / `\colorbox{...}` として挿入
   - 分数・平方根・括弧・装飾・囲み枠・取消線などは、選択中のテキストをラップして挿入可能
3. 右側のプレビューで数式の表示を確認
4. 以下のいずれかの方法で出力：
   - **LaTeXをコピー** -- LaTeX 文字列をクリップボードにコピー
   - **MathMLをコピー** -- MathML ソースをテキストとしてコピー（貼り付け先の MathML ソース入力で利用）
   - **画像をコピー** -- プレビュー画像（PNG）をクリップボードにコピー
   - **Markdownで保存** -- Markdown ファイル (.md) をダウンロード
   - **画像を保存** -- PNG 画像ファイルをダウンロード
5. 右上の **EN / JA** ボタンで言語を切り替え

詳しい操作方法はアプリ内の「使い方ガイド」セクションをご覧ください。

下書きは同じブラウザ・同じ配信元の `localStorage` に保存されます。サーバーには送信されません。保存領域を利用できない場合は入力欄の下に表示され、編集やコピーは引き続き利用できます。共有ブラウザでは利用後に「クリア」を押してください。複数タブで編集した場合は最後に保存した内容が残ります。

MathML コピーはプレーンテキストです。すべての文書アプリで数式として直接貼り付けられることを保証するものではありません。MathML と PNG の出力には、エラーのない数式が必要です。画像コピーを利用できない環境では「画像を保存」を使用してください。

## 書式入力の例

| LaTeX | 説明 |
|------|------|
| `\textcolor{blue}{x+y}` | 文字色を青に変更 |
| `\colorbox{yellow}{x^2}` | 背景色を黄色でハイライト |
| `\cancel{x+y}` | 左下から右上への取消線 |
| `\boxed{E=mc^2}` | 数式を枠線で囲む |

## 技術構成

- HTML / CSS / JavaScript（フレームワーク不使用）
- 数式描画: [KaTeX 0.19.0](https://github.com/KaTeX/KaTeX/releases/tag/v0.19.0)（CDN 経由、MIT License）
- 画像変換: [html2canvas](https://html2canvas.hertzen.com/)（CDN 経由、MIT License）
- ビルドツール不要 -- 静的ファイルのみで動作
- デプロイ: GitHub Actions → GitHub Pages

## ローカルでの実行

リポジトリをクローンし、`index.html` をブラウザで開くだけで動作します。

```bash
git clone https://github.com/Takayuki-Minagawa/Math-Editor.git
cd Math-Editor
open index.html
```

> KaTeX は CDN から読み込むため、インターネット接続が必要です。

## 開発・検証

Node.js 22 以降で以下を実行します。アプリの利用・公開にビルドは不要です。

```bash
npm ci
npx playwright install chromium
npm test
```

テストはローカルサーバーと npm の固定バージョンの KaTeX / html2canvas を使用し、CDN の稼働状況に依存せず実行します。入力・選択範囲・下書き復元・保存制限・言語切替・MathML / PNG 出力をブラウザで検証します。

CI と同じ Chromium・Firefox・WebKit の3種類で検証する場合は、`npx playwright install chromium firefox webkit` の後に `npm run test:all` を実行します。

## デプロイ

GitHub Actions はすべて Linux（`ubuntu-latest`）で実行します。PR のブラウザテスト、および `main` への push 時のテスト成功後に GitHub Pages へ自動デプロイします。公開対象は `index.html`・`css/`・`js/`・`assets/` のみです。

リポジトリの Settings > Pages > Source を **GitHub Actions** に設定してください。

## ファイル構成

```
Math-Editor/
├── index.html                    # エントリポイント
├── LICENSE                       # MIT License
├── css/
│   └── style.css                 # スタイルシート
├── js/
│   ├── toolbar-data.js           # ツールバーのボタン定義データ
│   ├── i18n.js                   # 多言語対応（日本語/英語）
│   ├── storage.js                # 保存領域を利用できない場合の処理
│   ├── draft.js                  # 下書きの自動保存・復元
│   ├── editor.js                 # テキストエリア管理
│   ├── actions.js                # コピー・保存・通知
│   └── app.js                    # 初期化・ツールバー生成・プレビュー
├── assets/
│   └── favicon.svg               # ファビコン
├── tests/                       # ブラウザ回帰テスト・ローカルサーバー
├── package.json                 # テスト用の依存関係・コマンド
├── playwright.config.js         # ブラウザテスト設定
└── .github/
    └── workflows/
        ├── test.yml              # Linux のブラウザテスト
        └── deploy.yml            # GitHub Pages デプロイ設定
```

## ライセンス

MIT License -- 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## ブラウザ互換性

- **画像コピー機能**: PNG の Clipboard API に対応するブラウザで、HTTPS または localhost が必要です。権限・ブラウザ設定によって制限される場合があります。
- **画像保存機能**: Canvas とファイルダウンロードに対応するモダンブラウザで動作します。
- **自動保存**: `localStorage` が必要です。プライベートブラウジングや `file://` では保存期間・挙動が異なる場合があります。

実装上の参照: [KaTeX の出力・安全設定](https://katex.org/docs/options)、[WebKit の非同期クリップボード API](https://webkit.org/blog/10855/async-clipboard-api/)。

## 謝辞

- [KaTeX](https://katex.org/) -- 高速な数式レンダリングライブラリ（MIT License）
- [html2canvas](https://html2canvas.hertzen.com/) -- DOM を Canvas に変換するライブラリ（MIT License）
