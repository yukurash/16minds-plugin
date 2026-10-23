# Claude Code

[共通の概要](../README.md) / [Copilot CLI](copilot-cli.md) / [VS Code Copilot](vscode-copilot.md)

## 導入・更新

Claude Codeの認証とplugin対応版が必要です。未ログインならターミナルで`claude auth login`を実行してください。認証情報をチャットやrepoに貼らないでください。

Claude Codeの対話画面:

```text
/plugin marketplace add yukurash/16minds-plugin
/plugin install 16-minds@16-minds-marketplace
```

既存導入では`/plugin`画面からmarketplaceとpluginを更新し、新しいセッションで読み直してください。削除は`/plugin uninstall 16-minds@16-minds-marketplace`。他のpluginやグローバル設定を変更する必要はありません。

ローカルの作業版は、そのセッションだけ読み込めます。

```powershell
claude --plugin-dir 'C:\path\to\16minds-plugin'
```

## 呼び出し

plugin名付きの`/16-minds:voice-write`を基本にします。短縮名の見え方はインストール方法や同名Skillの有無によるため、`/`の補完で確認してください。

```text
/16-minds:voice-write --auto --format=reply --show <相手・目的・事実>
/16-minds:voice-write intj --rewrite --format=article <元文章>
/16-minds:voice-write --auto --rewrite --format=post --length=180字 <相手・目的・元文章>
```

- `--auto`: 場面から1人格を配役。目的・媒体は自然文で添えてください。
- 指名: 16タイプのtype引数。`--auto`と併記しても指名が優先。
- `--show`: 本文とは別にtype、selection、purpose、medium、format、reasonを表示。
- `--write`が既定。`--rewrite`では元文章を渡す必要があります。
- formatは`article|essay|post|reply`。`--length=<正の整数>字`は目安であり、厳密な文字数制約ではありません。
- `--auto`なしで指名も文脈の人格もなければ、従来通り聞き返します。

別人格でもう一案が必要なら、同じ材料を保ち、typeを変えて再度呼び出します。全16人格を同時に起動する必要はありません。

## 仕組みと注意

Skillが共通の執筆仕様を読み、既存の人格Agent（通常`16-minds:<type>`）へ1回委譲します。原文にない原因・期限・体験・約束を追加せず、人格の弱点を再現するために失礼な文章にしません。

`/agents`に人格がいなければpluginの有効化と再読み込みを確認してください。利用中の版がAgent/Taskへの委譲を制限している場合も、主Agent内の模倣に黙って切り替えず、エラーとして扱います。

この機能は通常のclaude.aiチャットへのplugin導入を意味しません。
