# GitHub Copilot CLI

[共通の概要](../README.md) / [Claude Code](claude-code.md) / [VS Code Copilot](vscode-copilot.md)

## 導入・更新・削除

Copilot CLIの認証と利用可能なモデルが必要です。Agent Plugins 1.0、Skills、custom agentsに対応した版を使ってください。

ターミナル:

```powershell
copilot plugin install yukurash/16minds-plugin:copilot
copilot plugin list
```

Copilot用package名は`16-minds-writing`です。Claude用のrepoルートではなく、上の`copilot`サブディレクトリを指定してください。

```powershell
copilot plugin update 16-minds-writing
copilot plugin uninstall 16-minds-writing
```

作業中のpackageは永続インストールせず、そのセッションだけ読み込めます。

```powershell
copilot --plugin-dir 'C:\path\to\16minds-plugin\copilot'
```

## Skillから自動配役・指名執筆する

対話画面で`/`を入力し、`voice-write`を含むSkillを補完から選びます。pluginのnamespaceや表示名はクライアント版に従います。自然文で明示的に指定しても使えます。

```text
voice-write Skillを使って、--auto --format=reply --show で書いて。
相手: チーム。目的: 現在の状況共有。媒体: メール。
材料: <確認済みの事実>
```

```text
voice-write Skillを使って、intj --rewrite --format=article で書き直して。
元文章: <下書き>
```

```text
voice-write Skillを使って、--auto --rewrite --format=post --length=180字。
相手・目的: <説明>
元文章: <下書き>
```

CLIの単発実行でも同じ依頼を`copilot -p "..."`に渡せます。Skillの読み取りとcustom agentへの委譲に必要な権限だけ許可してください。広い`--allow-all-tools`は通常の導入要件ではありません。

引数とエラー処理はClaude版と共通です。既存の4形式とlength目安を保ちます。直接指名と`--auto`を併記した場合は指名が優先されます。

## Agentを直接選ぶ場合

`/agent`の一覧で`16-minds-writer-intj`などを選ぶか、`--agent`に登録IDを指定します。この直接選択は特定人格との会話であり、Skillの`--auto`を実行したことにはなりません。自動配役、format/length解釈、`--show`が必要ならSkillを入口にしてください。

## 対応範囲

- Copilot用は文章機能のみ。Claude用の`/minds`、`/pair`、`/cast`などを提供しません。
- CopilotのAgent定義を使用し、ClaudeのTaskツールや`$ARGUMENTS`変数を要求しません。
- writer Agentはtoolsなし。完成文の材料と制約は親Agentから渡します。
- Agentの登録・委譲に失敗した場合は中断し、通常チャットのロールプレイを成功扱いしません。
- 導入・検証したクライアント版と、未確認の面は[開発・検証情報](development.md)に記録します。GitHub.comのcloud agentへの対応保証は含みません。
