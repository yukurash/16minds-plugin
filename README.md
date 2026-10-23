[日本語](README.md) | [English](README.en.md)

# 16-minds

MBTI® の16タイプをモチーフにした人格Agentで、議論・レビュー・意思決定・執筆を行うプラグインです。同じテーマを、異なる価値観・優先順位・口調で扱います。

## できること

| やりたいこと | コマンド・Skill |
|---|---|
| 1人の視点でレビュー・助言が欲しい | [`/mind`](#mind) |
| 2人に意見をぶつけ合わせたい | [`/pair`](#pair) |
| 複数の意見を比較し、落としどころを探したい | [`/minds`](#minds) |
| お題に応じて議論の参加者を選んでほしい | [`/cast`](#cast) |
| 場面や人格に合わせて文章を書きたい・直したい | [`voice-write`](#voice-write) |
| 選択肢から1つ決めてほしい | [`voice-decide`](#voice-decide) |
| 提案への賛否と理由を見たい | [`voice-vote`](#voice-vote) |
| 答えではなく、考えを深める質問が欲しい | [`voice-ask`](#voice-ask) |

## インストール

| 環境 | 対応機能 | 導入・使い方 |
|---|---|---|
| Claude Code | すべてのコマンド・Skill | [Claude Codeガイド](docs/claude-code.md) |
| GitHub Copilot CLI | `voice-write`と16人格の執筆Agent | [Copilot CLIガイド](docs/copilot-cli.md) |
| VS CodeのGitHub Copilot | 同上（UI操作は未検証） | [VS Codeガイド](docs/vscode-copilot.md) |

**Claude Code**の対話画面で実行：

```text
/plugin marketplace add yukurash/16minds-plugin
/plugin install 16-minds@16-minds-marketplace
```

**GitHub Copilot CLI**はターミナルで実行：

```powershell
copilot plugin install yukurash/16minds-plugin:copilot
```

Copilot用は文章機能のみです。導入経路の注意点、更新・削除、ローカル開発時の読み込みは各ガイドを参照してください。追加の外部APIキーは不要ですが、各クライアントの利用契約・モデル設定・利用量制限に従います。

## 議論・レビューのコマンド

以下はClaude Codeのplugin名付き呼び出し例です。4つのコマンドはいずれも`--mode=light|middle|heavy`に対応します。既定は`middle`。短く確認するなら`light`、掘り下げるなら`heavy`を使います。

### /mind

指定した1人格から意見を聞きます。レビューやアイデアへの助言に。[引数・詳細](commands/mind.md)

```text
/16-minds:mind intj このAPI設計、長期で破綻しない？
```

### /pair

2人格で立論・反論を行います。`heavy`では再反論・着地まで進み、`--rival`で相手を自動選択できます。[引数・詳細](commands/pair.md)

```text
/16-minds:pair istj entp --mode=heavy モノリスを分割するか維持するか
/16-minds:pair intj --rival このAPI設計、このまま出していいか
```

### /minds

複数人格の意見を並べ、対立点と落としどころを整理します。既定は全16人格です。[引数・詳細](commands/minds.md)

```text
/16-minds:minds 新サービスの命名案を絞りたい
/16-minds:minds --mode=heavy --types=intj,entj,istp --save 次に採用するDB
```

- `--types=a,b,...`で参加者を指定。`--n=N`は、タイプ未指定時に一覧の先頭から人数を制限します。
- `--save`で結果を`Outputs/<timestamp>-minds-<mode>.md`に保存。`--out=<path>`なら保存先も指定できます。

### /cast

お題に応じて少人数の人格を選び、議論させます。誰を呼ぶか迷うときに。[引数・詳細](commands/cast.md)

```text
/16-minds:cast --n=4 --show この構成のまま開発を続けるべきか
```

`--n`で人数を指定し、`--show`で選抜の根拠を表示します。文章の書き手を選ぶ場合は、次の`voice-write --auto`を使ってください。

## 書く・決める・投票する・問うSkill

以下もClaude Codeでの呼び出し例です。Skillは「ENFPで書き直して」「ENTJで決めて」「全人格で投票して」「ENTPでツッコんで」のような自然文でも利用できます。

### voice-write

1人格で執筆・リライトします。人格を指名するか、`--auto`で目的・相手・媒体に応じた書き手を選びます。指名と`--auto`の併記では指名を優先します。

```text
/16-minds:voice-write --auto --format=reply --show チームへの状況共有メールにする: <事実や下書き>
/16-minds:voice-write infj --rewrite --format=post --length=200字 <元文章>
```

- `--write` / `--rewrite`：新規執筆／リライト。既定は新規執筆。
- `--format=article|essay|post|reply`：出力形式。既定は`article`。
- `--length=200字`：長さの目安。厳密な文字数指定ではありません。
- `--show`：本文とは別に、選んだ人格と選択理由を表示。通常は完成文だけを返します。

人格よりも場面と事実保持を優先します。Copilotでの呼び出しは[CLIガイド](docs/copilot-cli.md)・[VS Codeガイド](docs/vscode-copilot.md)、共通の引数・方針は[執筆仕様](skills/voice-write/references/writing.md)を参照してください。

### voice-decide

指定人格の価値観で、2つ以上の選択肢から1つを決めます。[引数・詳細](skills/voice-decide/SKILL.md)

```text
/16-minds:voice-decide entj A) モノリス維持 B) 段階分割 C) 全面マイクロサービス化
```

### voice-vote

提案への賛成・反対・保留を集計し、可決判定と主な理由を示します。既定は全16人格で、`--types`で投票者を限定できます。[引数・詳細](skills/voice-vote/SKILL.md)

```text
/16-minds:voice-vote --types=entj,istj,entp,esfj --save 定例MTGを週2回から週1回に減らす
```

### voice-ask

答えや助言ではなく、指定人格からの質問でアイデアや計画を掘り下げます。[引数・詳細](skills/voice-ask/SKILL.md)

```text
/16-minds:voice-ask entp AIで議事録を自動要約するSaaSを作りたい
```

## 利用可能なタイプ

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

価値観・口調などの定義は[agents/](agents/)にあります。人格は視点・優先順位・書き方を変えるためのプロンプトであり、心理診断や能力の保証ではありません。重要な判断や対外文書は、利用者が最終確認してください。

## 関連ドキュメント

- [議論の出力例](Outputs/qiita-title-discussion.md)
- [開発・メンテナンス手順](docs/development.md)
- [配役データの実験・検証（16minds-lab）](https://github.com/yukurash/16minds-lab)
- [初期の設計背景（Qiita）](https://qiita.com/yukurash/items/4c4bfc492d91770618b8)

## ライセンス

[MIT](LICENSE) © yukurash

## 商標について

このプラグインは Myers-Briggs Type Indicator® (MBTI®) の権利者である The Myers & Briggs Foundation、および 16Personalities® を提供する NERIS Analytics とは無関係であり、それらから認可・推奨を受けたものではありません。「16タイプ」は心理学一般で用いられる類型表現として参照しています。
