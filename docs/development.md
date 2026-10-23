# 開発・検証

## 元データと生成物

- 人格の正: `agents/*.md`。既存のClaude用人格を別物として書き直しません。
- Skillと執筆契約の正: `skills/voice-write/`。
- Copilot配布物: `copilot/`。単独でインストール可能で、repo外への参照やsymlinkはありません。
- Copilotの実行アダプター: `scripts/build-copilot.mjs`。人格本文は維持し、metadata、writer契約、委譲手順だけを変えます。

生成物を直接編集せず、元データまたはアダプターを直してください。利用者のPCでの生成作業は不要です。

Node.js 24で、repoルートから:

```powershell
node scripts\build-copilot.mjs
node scripts\build-copilot.mjs --check
node --test tests\writing.test.mjs
claude plugin validate .claude-plugin\plugin.json
claude plugin validate .claude-plugin\marketplace.json
```

macOS/Linuxではパス区切りを`/`に変えます。Node以外の追加npm依存はありません。

GitHub Actionsは構造検査だけを実施します。秘密のモデル認証や外部モデル呼び出しはCIに入れません。構造検査の合格は、人格の適性や文章品質の保証ではありません。

## 実動確認の観点

各クライアントでSkillの発見、参照ファイルの読み込み、1人格へのネイティブ委譲、本文の出力を区別して確認します。

- 指名、新規執筆、リライト、4形式、length、auto、show。
- 指名とauto併記、人格未指定、曖昧な目的、未知の引数、競合するモード。
- 原因、期限、保証、本人の体験を勝手に追加していないか。
- 全16人格の登録と呼び出し、参照先の欠落、同名の既存カスタマイズとの衝突。

モデル出力は確率的です。指示だけで捏造を完全に防げると保証せず、重要な文章は送信前に人が確認してください。

## 確認状況

- Claude Code 2.1.221: 両manifestの検査、Skillと参照仕様の読込、自動配役・指名執筆、登録診断で全16人格へのネイティブAgent呼び出しと正常完了を確認。
- GitHub Copilot CLI 1.0.94-3: Agent Plugins 1.0のlocal mount、Skill読込、自動配役、登録診断で全16writerへのネイティブtask委譲を確認。
- 両CLIで代表8ケースを確認: 指名とautoの併記、人格未指定、不正format、モード競合、length=0、リライト、article指定、format未指定時のarticle既定値。不正入力や人格未指定ではwriterを起動しないことと、返答内容を確認。
- 全16登録の診断は個別指名による呼び出し確認であり、全人格が自動配役されることや全場面の作文品質を保証しません。モデル依存の処理なので、これらの結果も将来の全実行での一致を保証するものではありません。
- VS Code Copilot: package構造は公式のAgent Plugins 1.0形式に準拠。現時点でUIの導入・選択操作は未確認。CLIの結果をUIの検証済みとは扱いません。

ここに記事用の比較入力、生ログ、原稿を置かないでください。通常の製品テストだけを管理します。
