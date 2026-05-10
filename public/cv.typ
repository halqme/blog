#set page(paper: "a4", margin: (x: 12mm, y: 14mm))
#set text(font: "UDEV Gothic 35JPDOC", size: 9.5pt, fill: rgb("1F2937"))
#set par(justify: true, leading: 0.55em)
#set document(title: "HALQME Portfolio", author: "HAL")

// Color Palette (Portfolio site aligned - Neutral grays)
#let primary = rgb("000000")
#let text-main = rgb("111827")
#let subtext = rgb("4B5563")
#let muted = rgb("6B7280")
#let border-color = rgb("E5E7EB")

// Link styling
#show link: it => text(fill: primary, weight: "medium")[#it]

// Headings
#show heading.where(level: 1): it => {
  v(0.5em)
  block(
    width: 100%,
    stroke: (bottom: 1.5pt + border-color),
    inset: (bottom: 0.3em),
    text(size: 13pt, weight: "bold", fill: text-main, tracking: 0.05em, it.body)
  )
  v(0.4em)
}

#show heading.where(level: 2): it => {
  v(0.4em)
  text(size: 11.5pt, weight: "bold", fill: text-main, it.body)
  v(0.2em)
}

#show heading.where(level: 3): it => {
  v(0.2em)
  text(size: 10pt, weight: "bold", fill: text-main, it.body)
  v(0.2em)
}

// Variables
#let name = "Miharu KOIKE"
#let email = "halqme@icloud.com"
#let github = "https://github.com/HALQME"
#let website = "https://0w0.foo"

// ファイルメタデータ（ビルド時に自動更新）
#let file-hash = "2c752b"
#let last-updated = "2026-05-10"

#show: page.with(footer: {
  align(right)[
    #text(size: 7.5pt, fill: muted)[
      updated: #last-updated \##file-hash |  https://0w0.foo/cv.pdf
    ]
  ]
})

// Components
#let item(title, link_url, role, period, tech, body, obsession) = {
  v(0.2em)
  block(breakable: false, width: 100%)[
    // Title and Date
    #grid(
      columns: (1fr, auto),
      gutter: 1em,
      [
        #if link_url != "" [
          #text(size: 11pt, weight: "bold")[#link(link_url)[#title]]
        ] else [
          #text(size: 11pt, weight: "bold", fill: text-main)[#title]
        ]
      ],
      [
        #align(right)[#text(size: 9pt, fill: subtext, weight: "medium", period)]
      ]
    )

    // Role and Tech Stack
    #if role != "" or tech != "" [
      #v(0.3em)
      #text(size: 8.5pt, fill: subtext)[
        #if role != "" [
          #text(fill: primary, weight: "bold")[#role]
        ]
        #if role != "" and tech != "" [  •  ]
        #if tech != "" [#tech]
      ]
    ]

    // Description
    #text(size: 9pt, fill: text-main)[#body]

    // Obsession / Highlights
    #if obsession != [] and obsession != "" [
      #set par(leading: 0.6em)
      #pad(left: 0.6em)[#text(size: 8.5pt, fill: muted)[#obsession]]
    ]
  ]
  v(0.4em)
}

#let job-item(title, period, role: "") = {
  v(0.2em)
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    [
      #text(size: 10pt)[#title]
      #if role != "" [
        #v(0.1em)
        #text(size: 8.5pt, fill: subtext)[#text(fill: primary, weight: "bold")[#role]]
      ]
    ],
    [#align(right)[#text(size: 9pt, fill: subtext)[#period]]]
  )
  v(0.3em)
}

// Header
#align(center)[
  #text(size: 18pt, weight: "black", fill: text-main, tracking: 0.05em)[#name]

  #v(0.6em)
  #text(size: 10pt, fill: subtext)[
    #link("mailto:" + email)[#email]  |
    #link(github)[GitHub: HALQME]  |
    #link(website)[Portfolio: 0w0.foo]
  ]
]

#v(1.5em)

// Layout: Use 2 columns for the content below header
#show: columns.with(2, gutter: 3%)

= 開発

== 技術スタック

=== *フロントエンド*
- React / React Router
- Vue 3
- UnoCSS / Tailwind CSS

=== *バックエンド*
- Bun / Node.js
  - Hono
- Go?

=== *インフラ/運用*
- Cloudflare
- GitHub Actions (CI/CD)
- SQLite / LibSQL (Turso)
- Docker


== 個人開発

#item(
  "Fai",
  "https://github.com/HALQME/Fai",
  "個人開発",
  "2025/07~",
  "Swift",
  [AppleのFoundationModels Frameworkを活用したCLIツール。],
  [プラットフォームネイティブの最適化に注力。外部APIに依存せず、OSが提供する推論フレームワークを直接利用することで、セキュアかつ効率的なローカルAI体験の構築を目指した。Foundation Modelsのガードレールが厳格なため、自由なチャットの利用は難しかった。]
)

#item(
  "omu-aikido-app",
  "https://github.com/omu-aikido/omu-aikido-app",
  "個人開発",
  "2024/12~",
  "Vue 3 / TypeScript / Hono / Drizzle",
  [大阪公立大学合気道部の稽古管理・部活動運営をデジタルでサポートするアプリケーションおよびシステムの構築。],
  [最新のWeb標準技術を取り入れた高い品質基準と開発体験の両立。フロントエンドにVue 3とUnoCSS、バックエンドにHono (Cloudflare Workers) とlibSQLを、認証にClerkを採用。エッジコンピューティングによる低レイテンシとスケーラビリティ、コストパフォーマンスの高さを確保した。CI/CDパイプラインや自動テストを導入し、堅牢で保守性の高いシステム運用を徹底している。]
)

#item(
  "ポートフォリオサイト",
  "https://github.com/HALQME/blog",
  "個人開発",
  "current",
  "Astro / UnoCSS / Nix / Typst",
  [自身の経歴や制作物、ブログ記事を発信する静的サイト。],
  [AstroとUnoCSSを用いた高速な静的サイト。開発環境はNix Flakeによりパッケージや日本語フォントを含め再現性を確保。GitHub Actionsを活用し、Cloudflare Pagesへの自動デプロイやTypstによる本履歴書PDFのビルドパイプラインを構築している。]
)

== コントリビューション

#item(
  "Moodle Plus",
  "https://github.com/tomo0611/moodle-plus",
  "Contributor",
  "2024/04~2024/11",
  "TypeScript",
  [複数大学で導入されているLMS (Moodle) のUI/UXを改善するブラウザ拡張機能。],
  [大学の先輩のプロジェクトにコントリビュータとして参加し、所属学部独自のシステムに対応できるようなパッチを作成・提供した。]
)

== 卒業研究

未定。

3回生前期には世界モデル仮説を前提として、GPT-OSSが事前のトレーニングやIn-Context Learningなしにオセロのルールを理解し、それに則った手を選択することが可能かを検証した。
結果として、適切なトークン分割を行うことで合法手の回答を生成する可能性が高まるものの、「有効な手」を明確に打つことは不可能であるという点で、LLMの性能とその限界を見極めることに成功した。

== Agentic Codingの模索

設計、実装、テストなどの工程をAIエージェントに任せる「Agentic Coding」の可能性を探求する個人プロジェクト群。

#item(
  "btuin",
  "https://github.com/HALQME/btuin",
  "Agent開発",
  "2025/11~",
  "TypeScript (Bun)",
  [Bunランタイム上で動作する宣言的ターミナルUIフレームワークの構築。],
  [仮想DOMを排したリアクティビティモデルの採用と、BunのネイティブAPI (TTY/FFI) の直接利用により極めて高速な描画を実現。同時に、ホットリロードやブラウザベースのインスペクタを実装し、TUI領域にモダンなフロントエンド開発体験をもたらすアーキテクチャを設計した。]
)

#item(
  "slide_bun",
  "https://github.com/HALQME/slide_bun",
  "Agent開発",
  "2026/01~",
  "TypeScript (Bun)",
  [Markdownからスライドを生成するCLIツールの開発。],
  [Marpのようにスライドの内容をMarkdownで宣言的に記述できると共に、デザインの自由度を意図的に制限することで、迷わないスライド生成を実現。BroadcastChannel APIによるタブ間通信により、レーザーポインター機能やスライド送りの同期機能を実装し、快適なプレゼンテーション体験を提供する設計とした。]
)

#item(
  "mee",
  "https://github.com/HALQME/mee",
  "Agent開発",
  "2026/02~",
  "Go",
  [プラグインシステムを備え、クロスプラットフォームで動作するコマンドランチャーの開発。],
  [Goroutineを活用した非同期ファジー検索を実装し、大量の項目でも遅延のない操作性を確保。さらに、YaegiインタプリタによるGoプラグインシステムを導入し、コアの軽量さを保ったままユーザーが自由に拡張できる設計とした。名称の由来は、ホームポジションから打ちやすいヤギの鳴き声「メエェ」である。]
)

= 学歴

#v(0.5em)
#grid(
  columns: (auto, 1fr),
  gutter: 1.5em,
  [
    #text(weight: "bold", size: 10pt)[大阪公立大学] \
    #text(size: 9pt, fill: subtext)[現代システム科学域 心理学類]
  ],
  [
    #align(right)[#text(size: 9pt, fill: subtext)[2023/04 \~ 現在]]
  ]
)

#v(1em)
#grid(
  columns: (auto, 1fr),
  gutter: 1.5em,
  [
    #text(weight: "bold", size: 10pt)[大阪府立北野高等学校] \
    #text(size: 9pt, fill: subtext)[文理学科]
  ],
  [
    #align(right)[#text(size: 9pt, fill: subtext)[2020/04 \~ 2023/03]]
  ]
)
