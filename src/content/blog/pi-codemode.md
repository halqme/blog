---
title: 「MCPはいらない」からの転換：Pi v1のCodeMode入門
description: MCP対応でツールの説明をコンテキストに詰め込まないために、PiはCodeModeをどう使うのか。仕組みから defaultTools での有効化まで紹介します。
pubDate: 2026-10-02
tags:
  - pi
  - ai-agent
  - coding-agent
  - mcp
  - codemode
---

AIエージェントにMCPサーバーを一つ追加すると、できることが増えます。二つ、三つと増やしていけば、外部サービスをまたいだ作業も頼めるようになります。

ただし、エージェントの実装によっては、ツールが増えるたびにツール名や引数の説明までモデルのコンテキストに並びます。仕事を頼む前から、モデルは分厚い「ツールの説明書」を読まなければなりません。

Piは以前、「MCPはいらない」という立場を掲げていました。それがPi 1.0系では、MCPに対応し、ツールを呼ぶための仕組みとして**CodeMode**を組み合わせています。単に考えを翻したのでしょうか。そこには「ツールを全部モデルに見せる」以外の使い方がありました。

> なお、MCPとCodeModeがPiに追加されたのは1.0.0ではなく、その直前の0.99.0です。1.0.0ではCodeModeのプロンプトを軽くする改善や、画像生成への対応が加わりました。ここではPi 1.0.0時点の設計を見ていきます。

## PiのMCP対応は何をするのか

MCP（Model Context Protocol）は、AIエージェントと外部ツールをつなぐための共通プロトコルです。たとえばGitHubやLinearのサーバーを接続すると、Piからそのサービスのツールを見つけて呼び出せます。Piは標準入出力（stdio）とStreamable HTTPに対応し、`mcp.json`でサーバーを設定します。

```sh
# stdioで動くサーバーを追加
pi mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem .

# 接続状態を確認
pi mcp list
```

通常、ツールを接続すると「そのツールをモデルにどう見せるか」も決める必要があります。Piでは `exposure` で方法を選べます。`direct`ならツールをモデルに直接公開し、`deferred`なら検索して必要になったときに読み込みます。既定の `codemode` では、ツールの詳細を最初からモデルに並べず、CodeModeのスクリプトから呼び出せるようにします。

サーバー自体の説明は短くシステムプロンプトに載ります。つまり、MCPサーバーが存在することは伝えつつ、何十個ものツール定義を毎回すべて読ませない設計です。

## CodeModeは「ツールを呼ぶツール」

CodeModeを一言でいうと、**モデルが書いたJavaScriptで、Piのツールを組み合わせて実行する仕組み**です。

通常のツール呼び出しでは、モデルが一つのツールを選び、その結果を受け取ってから次の判断をします。CodeModeでは、モデルが短いスクリプトを書き、その中で必要なツールを検索し、複数の呼び出しをまとめたり、結果を加工したりできます。実行されるのはQuickJSのサンドボックスで、モデルに返るのはスクリプトが返した結果です。

たとえば、Linearから課題を取得して、モデルには識別子とタイトルだけを見せるなら、次のような形です。

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

実際には、まず `searchTools()` や `describeTool()` で利用できるツールと引数を調べてから呼び出します。MCPサーバーごとにツール名や返り値は異なりますが、スクリプトの中で不要な項目を落としてから返せる点は変わりません。

この例なら、Piは250件の課題を受け取っても、そのすべてを会話のコンテキストに流す必要はありません。必要な10件の識別子とタイトルだけを返せます。APIを並列に呼び出して一つにまとめる、といった処理も同じスクリプト内でできます。

## なぜMCPだけでなくCodeModeなのか

PiがMCPに慎重だった理由の一つは、ツール定義と結果がコンテキストを占めること、そして複数のツールをつなぎにくいことでした。Mario Zechnerの以前の記事では、CLIと短いREADMEを使い、エージェントに必要な操作だけを説明する方法が紹介されています。シェルやコードなら、結果をファイルに保存したり、複数の操作をつないだりしやすいからです。

CodeModeは、その「コードでツールを組み合わせる」やり方をPiのツール呼び出しにも持ち込みます。ツールを呼ぶたびにモデルへ結果を返して次の手順を考えさせる代わりに、スクリプトが呼び出しの順番を決め、途中のデータを集約・選別してから、必要な結果だけを会話へ戻せます。ツール説明をコンテキストに抱え続けずに済み、複数の操作をまとめて進められるのが狙いです。

Piの開発チームは、MCP自体の課題がすべて解決したとは述べていません。サーバーの作りやツールの合成しづらさには、今も改善の余地があるという立場です。一方で、MCPは以前より成熟し、ツールを必要なときに読み込む仕組みやCodeModeの実行環境は、Pi全体にも役立つと判断しました。MCPをCodeMode経由で使い、外から批判するだけでなく、エージェントでの使い方を内側から良くしていこうという考えです。

また、CodeModeはMCP専用ではありません。Piの組み込みツールをまとめて呼び出すほか、分類モデルや画像生成モデルをスクリプトから利用することもできます。PiがMCPを取り込んだ背景には、ツール連携だけでなく、こうしたモデルやツールの使い方を共通の実行環境にまとめる狙いもあります。

## CodeModeを有効にする

MCPサーバーを追加し、そのサーバーが既定の `codemode` exposure で接続される場合、PiはCodeModeを自動で有効にします。`pi mcp add`で設定を変更したあと、すでに起動しているPiで使うなら `/reload` を実行してください。

MCPを使わずCodeModeだけを有効にしたい場合は、ユーザー設定の `~/.pi/agent/settings.json`、またはプロジェクト設定の `.pi/settings.json` に次のように書きます。

```json
{
  "defaultTools": ["+codemode"]
}
```

設定名は `defaultTool` ではなく、**`defaultTools`（複数形）**です。`+codemode` は既定の `read`、`bash`、`edit`、`write` を残したまま追加する指定です。`"codemode"` のように `+` を付けずに書くと、既定ツールの選択を置き換えるため注意してください。

一度だけ試すなら、起動時にツールを指定できます。

```sh
pi --tools read,bash,edit,write,codemode
```

`--tools`も有効にするツール一覧を置き換えるオプションなので、既定の4ツールを使い続ける場合はこのようにすべて列挙します。プロジェクト設定はプロジェクトを信頼した場合に読み込まれるため、個人用の設定ならユーザー設定へ書くのが手軽です。

## MCPを「使う」から、必要な分だけ「組み合わせる」へ

CodeModeが変えるのは、MCPの通信方式ではありません。変わるのは、ツールをモデルに見せるタイミングと、ツールの結果をどう扱うかです。モデルは必要な道具を調べ、コードで呼び出し、結果を整えてから答えます。

ただし、サンドボックスだからといって、呼び出すツールの影響までなくなるわけではありません。CodeModeはツール実行の組み立て役であり、権限確認そのものではありません。Piのツール呼び出しの仕組みや、接続先のサーバーが持つ権限は別に確認する必要があります。

「MCPは要らない」と言っていたPiが選んだのは、MCPを以前の形のまま受け入れることではありませんでした。ツールの説明を必要になるまで隠し、コードに得意な仕事はコードに任せる。MCPとCodeModeの組み合わせは、ツールが増えてもモデルの前に説明書を積み上げないための、Piなりの答えです。

## 参考資料

- [You Said No MCP!（Earendil）](https://earendil.com/posts/you-said-no-mcp/) — PiがMCPを取り込んだ背景とCodeModeの設計意図
- [Codemode（Pi公式ドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md)
- [MCP Servers（Pi公式ドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md)
- [Enable codemode（Pi公式CLIドキュメント）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md#enable-codemode)
- [CHANGELOG（Pi公式）](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/CHANGELOG.md) — MCPとCodeModeの導入時期、Pi 1.0.0の変更点
- [What if you don't need MCP at all?（Mario Zechner）](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — MCP以前にCLIとコードを選ぶ発想
