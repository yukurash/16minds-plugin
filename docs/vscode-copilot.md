# VS CodeのGitHub Copilot

[共通の概要](../README.md) / [Claude Code](claude-code.md) / [Copilot CLI](copilot-cli.md)

## Copilotの実行環境を選ぶ

Agent plugins、Skills、custom agentsを扱えるVS CodeとCopilotが必要です。Session Targetに複数のharnessがある場合はCopilotを選びます。ClaudeのモデルをCopilotで選ぶことと、Claude Code用pluginを使うことは別です。

## 導入

初版ではCopilot CLIでpackageを導入し、VS Codeで検出する経路を使います。

```powershell
copilot plugin install yukurash/16minds-plugin:copilot
```

この直接導入は検証したCLIでは動作しますが、将来廃止予定の警告が出ます。対象版と導入経路の制限は[Copilot CLIの導入手順](copilot-cli.md)を確認してください。

VS CodeのAgent Pluginsのインストール済み一覧で`16-minds-writing`を確認し、有効にしてください。公式資料ではCLIで導入されたpluginをVS Codeも検出します。リモート開発の場合は、CLIの導入先とVS Codeの実行場所が同じか確認してください。

ローカル開発時は、VS Codeの`chat.pluginLocations`でclone内の`copilot`ディレクトリを登録する方法もあります。これはユーザー設定の変更になるため、内容を確認して自分で登録してください。

導入経路ごとにpluginの管理画面が異なることがあります。CLIで入れたものはCLIで更新・削除し、同じpackageを別経路でも重複導入しないようにします。

## Skillを使う

1. Agent CustomizationsのSkillsまたはConfigure Skillsで`voice-write`を確認。
2. チャットの`/`補完から選ぶか、自然文で「voice-write Skillを使って」と明示。
3. `--auto`またはtype指名、形式、目的・相手、下書きや事実を渡す。

```text
voice-write Skillを使って、--auto --rewrite --format=reply --show。
相手: チーム。媒体: チャット。目的: <伝えたいこと>
元文章: <下書き>
```

```text
voice-write Skillを使って、infp --format=essay --length=300字。
読み手と目的: <説明>
材料: <本人が提供した経験や考え>
```

通常は完成文、`--show`なら本文外に選択理由が出ます。別人格を試すときは、同じ材料と制約を保ちtypeだけ変えて再度Skillを使います。

## Agent pickerとの違い

Agent pickerで`16-minds-writer-<type>`を選ぶ操作は直接指名です。自動配役の入口はSkillです。選択したAgentが次の依頼にも残る場合があるので、通常の開発に戻るときはAgentを切り替えてください。

## 見つからない場合

- Copilot harness、pluginの有効状態、導入先と実行場所を確認する。
- VS Codeの版、組織のpluginポリシー、Workspace Trust、subagent機能の設定を確認する。
- 必要に応じてチャットを新規作成・再読み込みし、SkillsとAgentの両方に登録されたか確認する。
- Skillだけ読み込めても人格Agentへの委譲が使えなければ、対応完了ではありません。

CLIでの合格はVS CodeのUI検証の代わりではありません。実施状況は[検証情報](development.md)を参照してください。
