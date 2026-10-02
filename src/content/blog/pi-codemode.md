---
title: 「MCPはいらない」からの転換：Pi v1のCodeMode入門
description: PiはMCPのツールをどうCodeModeから呼び出すのか。設計の背景と、defaultToolsで有効にする方法を解説します。
pubDate: 2026-10-02
tags:
  - pi
  - ai-agent
  - coding-agent
  - mcp
  - codemode
---

MCPサーバーを追加すると、エージェントに頼める作業が増えます。複数のサーバーをつなげば、サービスをまたいだ作業も任せられます。

一方、接続したツールの定義をすべてモデルへ渡す実装では、ツールが増えるほどプロンプトが膨らみます。モデルは作業を始める前に、ツール名や引数の説明を大量に読み込むことになります。

Piは以前、「MCPはいらない」という立場でした。現在のPi 1.0系ではMCPサーバーに接続し、そのツールをCodeModeから呼び出せます。すべてのツール定義をモデルに最初から渡すのではなく、必要なツールをJavaScriptで組み合わせる設計です。

MCPとCodeModeが初めて追加されたのはPi 1.0.0ではなく、その直前の0.99.0です。1.0.0ではCodeModeのプロンプトを軽くする改良と、スクリプトから画像生成モデルを呼び出す機能が加わりました。以下ではPi 1.0.0時点の設計を紹介します。

## PiのMCP対応は何をするのか

MCP（Model Context Protocol）は、AIエージェントと外部ツールをつなぐための共通プロトコルです。たとえばGitHubやLinearのサーバーを接続すると、Piからそのサービスのツールを見つけて呼び出せます。Piは標準入出力（stdio）とStreamable HTTPに対応し、`mcp.json`でサーバーを設定します。

```sh
# stdioで動くサーバーを追加
pi mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem .

# 接続状態を確認
pi mcp list
```

MCPサーバーのツールをモデルにどう公開するかは、`exposure` 設定で切り替えられます。`direct` はツールをモデルに直接公開します。`deferred` では、モデルが `tool_search` で必要なツールを探し、見つかったツールを次の呼び出しで使えるようにします。既定の `codemode` では、ツールの詳細を最初からモデルに渡さず、CodeModeのスクリプトから呼び出します。

Piはサーバーごとの短い説明をシステムプロンプトに含めます。モデルにサーバーの存在は知らせつつ、個々のツール定義は必要になるまで渡しません。

## CodeModeは「ツールを呼ぶツール」

CodeModeを一言でいうと、**モデルが書いたJavaScriptで、Piのツールを組み合わせて実行する仕組み**です。

通常のツール呼び出しでは、モデルが一つのツールを選び、結果を受け取ってから次の呼び出しを判断します。CodeModeでは、モデルがJavaScriptを書き、そのスクリプトからPiのツールを呼び出します。複数の呼び出しをまとめ、結果を加工してから返すこともできます。スクリプトはQuickJSのサンドボックスで実行され、モデルに返るのはスクリプトが返した値です。

たとえば、Linearから未完了の課題を取得し、先頭10件の識別子とタイトルだけをモデルに返すコードは次のとおりです。

```js
const { issues } = await tools.mcp__linear__list_issues({
  team: "Pi",
  state: "open",
  limit: 250,
});

return issues.slice(0, 10).map(({ identifier, title }) => ({
  identifier,
  title,
}));
```

実際には、最初に `searchTools()` や `describeTool()` で利用できるツールと引数を調べてから呼び出します。ツール名や返り値はMCPサーバーごとに異なりますが、スクリプト内で必要な項目だけを選んでモデルに返せます。

この例では最大250件を取得しますが、会話に返すのは先頭10件の識別子とタイトルだけです。残りの課題情報をモデルのコンテキストに渡さずに済みます。複数のAPIを並列に呼び出し、結果をまとめることもできます。

## なぜMCPにCodeModeを組み合わせたのか

PiがMCPに慎重だった背景には、ツール定義がコンテキストを圧迫し、複数のツールをつなぎにくいという問題意識がありました。Mario Zechnerの以前の記事では、その代案として、CLIと短いREADMEで必要な操作だけを説明する方法が紹介されています。シェルやコードなら、ツールの出力をファイルに保存したり、複数の処理をつないだりできるためです。

CodeModeは、同じ発想をPiのツール呼び出しにも持ち込みます。ツールをモデルに直接公開する方式では、モデルが一つずつ呼び出し、その結果を見て次の操作を決めます。CodeModeなら、スクリプト内で複数のツールを順番に、または並列に呼び出し、途中の結果を整理してからモデルへ返せます。モデルに渡すツール定義や途中結果を減らし、コンテキストを実際の作業に使いやすくするのが狙いです。

Piの開発チームも、CodeModeだけでMCPの課題がすべて解消するとは考えていません。ツール同士を組み合わせにくいことや、サーバーの設計には改善の余地が残ります。それでも、MCPを取り巻く状況が変わり、ツールを必要なときに読み込む仕組みやCodeModeはPi全体にも役立つと判断しました。MCPをPiに組み込み、エージェントでの使い方を改善していく意図も示しています。

CodeModeはMCP専用ではありません。Piの組み込みツールに加え、分類モデルや画像生成モデルもスクリプトから呼び出せます。ツールやモデルを一つのスクリプトで連携できる点も、Piにとって有用でした。

## CodeModeを有効にする

MCPサーバーが `codemode` exposure で接続されると、PiはCodeModeを自動で有効にします。`codemode` は既定の exposure です。Piを起動したあとに外部からMCP設定を変更した場合は、`/reload` を実行してください。

CodeModeはMCPがなくても使えます。ユーザー全体で有効にするなら `~/.pi/agent/settings.json`、プロジェクトだけで使うなら `.pi/settings.json` に次の設定を書きます。

```json
{
  "defaultTools": ["+codemode"]
}
```

設定キーは複数形の **`defaultTools`** です。`["+codemode"]` と書くと、既定の `read`、`bash`、`edit`、`write` を残したままCodeModeを追加できます。`["codemode"]` のように `+` を付けない場合は既定ツールの選択を置き換えるため、注意してください。

一度だけ試すなら、起動時にツールを指定できます。

```sh
pi --tools read,bash,edit,write,codemode
```

`--tools`を使うと既定のツール一覧が置き換わります。既定の4ツールも使う場合は、この例のようにすべて指定してください。`.pi/settings.json` はプロジェクトを信頼したあとに読み込まれます。個人用ならユーザー設定に書くのが手軽です。

## CodeModeで変わるツールの扱い

CodeModeはMCPの通信方式ではなく、ツール定義をいつモデルに見せるか、呼び出し結果をモデルに返す前にどう扱うかを変えます。モデルは必要なツールを探し、スクリプト内で呼び出しやデータ整理をしてから結果を受け取ります。

CodeModeのスクリプトはQuickJSのサンドボックスで動きます。ただし、スクリプトから呼び出すツールの権限まで、このサンドボックスが制限するわけではありません。MCPツールの呼び出しはPiのツール実行経路を通り、設定した拡張の確認処理が適用されます。CodeMode自体が承認を求めるわけではないため、Pi側のツール制御と接続先サーバーの権限を確認してください。

PiはMCPに対応する際、すべてのツール定義を最初からモデルに見せる方式を選びませんでした。必要なツールを探してスクリプトから呼び出し、処理後の結果をモデルに返します。これがPi 1.0のMCPとCodeModeの組み合わせです。

## 参考資料

- [You Said No MCP!（Earendil）](https://earendil.com/posts/you-said-no-mcp/) — PiがMCPを取り込んだ背景とCodeModeの設計意図
- [Codemode（Pi公式ドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md)
- [MCP Servers（Pi公式ドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md)
- [Enable codemode（Pi公式CLIドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md#enable-codemode)
- [CHANGELOG（Pi公式）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/CHANGELOG.md) — MCPとCodeModeの導入時期、Pi 1.0.0の変更点
- [What if you don't need MCP at all?（Mario Zechner）](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — MCP以前にCLIとコードを選ぶ発想
