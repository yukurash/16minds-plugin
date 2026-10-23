[日本語](README.md) | [English](README.en.md)

# 16-minds

MBTI® の16タイプの人格のエージェントを召喚して、議論・レビュー・助言・執筆に使うプラグイン。Claude Codeでは既存の全機能、GitHub Copilotでは文章キャスティングを提供します。

アイデア出し・設計判断・ライフ／キャリア選択・コードレビュー・倫理的トピックなど、意見が割れそうなお題に使えます。視点の多様性が、より良い結論につながる、という前提でデザインされています。

## なぜ作ったか

Claude にレビューを頼むと、無難で平均的な答えが返ってきがちです。本当に欲しいのは、立場の違う複数の人格が意図的に偏った意見をぶつけ合った結果から、自分が見落としていた視点を拾うことです。16-minds はそのために、16タイプそれぞれの価値観・思考傾向・口調を独立したプロンプトで定義し、並列にお題をぶつけます。

## 環境別の導入・使い方

| 環境 | 対応範囲 | ガイド |
|---|---|---|
| Claude Code | 討論コマンド・既存Skill・文章の自動配役 | [Claude Code](docs/claude-code.md) |
| GitHub Copilot CLI | `voice-write`と16人格の執筆Agent | [Copilot CLI](docs/copilot-cli.md) |
| VS CodeのGitHub Copilot | Copilot用packageのSkill・執筆Agent | [VS Code Copilot](docs/vscode-copilot.md) |

Skillは共通仕様、Agentのmetadataと委譲手順は環境別です。CopilotにClaude用の討論コマンドをそのまま移植したものではありません。利用契約とモデル設定は各クライアントに従い、追加の外部APIキーは不要です。サービス自体が無制限無料になるわけではありません。

## インストール（Claude Code）

```
/plugin marketplace add yukurash/16minds-plugin
/plugin install 16-minds
```

ローカル開発なら：

```
/plugin marketplace add <このリポジトリをクローンしたパス>
/plugin install 16-minds
```

## コマンド

| コマンド | 動作 |
|---|---|
| `/mind <type> [--mode=...] <topic>` | 単一タイプの意見 |
| `/pair <a> <b> [--mode=...] <topic>` | 2タイプのディベート（立論 → 反論 → 再反論／着地） |
| `/pair <a> --rival [--mode=...] <topic>` | 論敵を `casting.json` から自動で決めてディベート |
| `/minds [--mode=...] [--types=a,b,...] [--n=N] [--save] [--out=<path>] <topic>` | 全16タイプ並列＋合議（heavy では反論ラウンド付き）。`--save` で結果をファイル保存。 |
| `/cast [--n=N] [--mode=...] [--show] <topic>` | お題を8種別に分類し、実測値で選んだ数人だけを招集 |

## Skill（動作系）

人格を使って書く・決める・投票させる・問わせるためのスキル群。`/mind` `/minds` `/pair` が「議論用」なのに対し、こちらは「実行用」。

| Skill | 何する |
|---|---|
| `voice-write` | 指定人格で執筆・リライト。`--auto`で目的・相手・媒体から書き手を配役 |
| `voice-decide` | 指定人格として選択肢から1つ決める（中立禁止） |
| `voice-vote` | 指定人格群で賛成/反対/保留を投票し可決判定 |
| `voice-ask` | 指定人格があなたに鋭い質問を返す（答えない、問う） |

設計思想（AI臭を抜く3原則・人格別の出力比較・各Skillの実用シーン）は Qiita 記事で詳しく書いています → [記事から "AIっぽさ" をなくす Skills を作成した - Claude Code プラグイン『16-minds』](https://qiita.com/yukurash/items/4c4bfc492d91770618b8)

`voice-write` v0.4では、一律の「中立禁止」「結論先出し禁止」などを廃止しました。必要な敬語・説明・箇条書きを残し、人格よりも場面と事実保持を優先します。既存の指名・write/rewrite・format・lengthは維持しますが、文章の傾向はこの意図的な変更の影響を受けます。

### 文章のキャスティング

```text
/16-minds:voice-write --auto --format=reply --show チームへの状況共有メールにする: <事実や下書き>
/16-minds:voice-write --auto --rewrite --format=post <媒体・相手・残す事実と元文章>
/16-minds:voice-write infj --rewrite --length=200字 <元文章>
```

上はClaude Codeのplugin名付き表記です。Copilotの呼び出しは各ガイドを参照してください。

- 自動配役は`--auto`で明示的に有効化。指名した人格があれば指名を優先します。
- 目的、相手、媒体、関係性と重視することから1人格を選びます。毎回16人は呼びません。
- `--show`は選択理由を本文の外に表示。通常は完成文だけです。
- 原因・数字・期限・体験・約束は勝手に補いません。用途や責任が判断できなければ確認し、Agentが使えなければ失敗を明示します。
- 全16人格は選択候補であって、用途別の最適性が実証された分類表ではありません。

開発・生成物の検査方法は[メンテナンス手順](docs/development.md)を参照してください。

### コマンド例

明示呼び出し：

```
/voice-write enfp Qiita記事を読まれるためのコツ
/voice-write intj --format=post 月曜の自分への激励
/voice-decide istj 育児アプリ次の新機能 A) AI栄養解析 B) 夫婦共有ログ C) 発達通知
/voice-vote 定例MTGを週2回から週1回に減らす --types=entj,istj,entp,esfj,intp
/voice-ask entp 個人開発を来年マネタイズしたい
```

自然言語でも発火：

```
ENFPで書き直して: <ここにAIっぽい記事を貼る>
ENTJで決めて。A) モノリス維持 B) 段階分割 C) 全面マイクロサービス化
チームに投票させて: 全社員PCをMacBook Pro統一にする
ENTPでツッコんで: AIで議事録を自動要約するSaaS
```

## モード

| モード | 内容 | 用途 |
|---|---|---|
| `light` | score + 一行コメントのみ | サクッと多様性を見たい・トークン節約 |
| `middle`（既定） | 軽量パス → 発散意見の深掘り → 合議 | 第一印象を満たすバランス重視 |
| `heavy` | + 反論ラウンド + 合議の練り直し | 重い意思決定や記事ネタに |

`/minds` の合議は以下の4セクション固定（発散を避けるための定型ルブリック）：

1. score 分布 — 最低・最頻・最高を一文で
2. 主要な対立軸（2〜3個） — 各軸の代表タイプ群を併記
3. 見落とされがちな視点（1〜3個） — 出典タイプを明記
4. 落としどころ候補（2〜3案） — 各案に「賛同しそうなタイプ／適性／リスク」を付ける

## 使用例

### アイデア出し（このプラグインを作った主な動機）

```
/minds Qiita記事のタイトル候補、刺さるのはどれ？
/minds --mode=heavy 新サービスの命名案を絞りたい
/mind enfp 今週末のリフレッシュ案を3つ出して
/pair entp infj 副業で何を始めるか
```

実例: [`Outputs/qiita-title-discussion.md`](Outputs/qiita-title-discussion.md) — このREADMEがあるリポジトリ自身を題材に、Qiita記事のタイトルを `/minds` で議論させた完全ログ（Phase 1表 → Phase 2深掘り → Phase 3合議の3案に着地）。

### 設計判断 / コードレビュー

```
/mind intj この API 設計、長期で破綻しない？
/pair istj entp --mode=heavy モノリスから分割するか維持するか
/minds --mode=heavy --types=intj,entj,istp 次に採用する DB
/minds AIによるコードレビューの是非
```

### ライフ・キャリア選択

```
/minds 転職するか今の会社で昇進を待つか
/pair infj entj --mode=heavy 副業を本業化するか
/mind enfp --mode=heavy リモートワークと出社のバランス
```

### サンプル出力（`/mind intj` の light モード）

```
score: 2
stance: 短期の心地よさのために長期の最適化を犠牲にしている
key_axis: 長期最適化
concern: この選択を3年続けたとき、撤退コストが指数的に膨らむ
```

### サンプル出力（`/minds --mode=light` の一次評価表イメージ）

```
| type | score | stance | key_axis | concern |
|---|---|---|---|---|
| intj | 2 | 長期で見れば非効率 | 長期最適化 | 撤退コストの増大 |
| enfp | 5 | 今の自分が嬉しい選択でよい | 自由 | 燃え尽きへの目配り |
| istj | 3 | 前例があるなら可、なければ慎重に | 実証 | 検証データが薄い |
...
```

## 結果の保存

`/minds --save` で実行結果（Phase 1表・深掘り・合議すべて）を `Outputs/<timestamp>-minds-<mode>.md` に保存します。`--out=<path>` で保存先を明示指定も可能。記事ネタや意思決定ログとして残したいときに。

## 利用可能なタイプ

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

各タイプの人格は `agents/<type>.md` に定義されています。主機能・補助機能を含む認知特性、価値観の核、強み・弱み、議論での癖、典型的な言い回しまで明示してあるので、出力に視覚的な個性が出ます。

## 測ってみた結果（正直な話）

`/cast` と `--rival` の根拠を作るために、16人格を総当たりで走らせて実測しました。
ハーネス・生ログ・事前登録した手順はすべて [16minds-lab](https://github.com/yukurash/16minds-lab) にあります。

- 適性: 16タイプ × 8タスク × 3反復 = 384セル
- 相性: 16C2 = 120ペアのディベート総当たり
- 題材: 実在のサイト（[yukurash.github.io](https://yukurash.github.io/)）の `index.html` に欠陥を4件仕込んだもの

出てきた結果は、正直に言うと**このプラグインの売り文句に不利なもの**でした。

| 測ったもの | 結果 |
|---|---|
| 何を見つけるか（仕込んだ欠陥の検出率） | **16タイプでほぼ差がない**（0.62〜0.74） |
| 何を優先し、どう書くか（総合順位） | 差がある。同じ人格でもタスクにより10位ぶん動く |
| ペアの相性 | ほぼ平坦。個人差とタイプ間距離を足しても分散の37%しか説明できない |

つまり **人格を変えても、見つけるものは大きく変わりません**。変わるのは
優先順位のつけ方と書き方です。`/cast` はそこを合わせるための機能であって、
見落としを減らすためのものではありません。網羅性が欲しいときは `/minds` で全員呼ぶのが確実です。

相性については、個別ペアの測定値は根拠として使えませんでした（各ペア1回の測定で、
分散の62.9%が測定ノイズと区別できない）。`--rival` は再現した2つの効果
——相手自身の議論生産性と、タイプ間の距離（4文字中の相違数）——だけから決めています。

## 設計メモ

- 人格はプロンプトに直書き。中央集権的な「価値観ベクトル表」のようなデータ構造は持ちません（二重管理を避けるため）。
- subagent への呼び出しは必ず並列。`/minds` は最大16並列まで広がるので、逐次にするとレイテンシが大幅に悪化します。
- subagent の出力フォーマットは呼び出し元コマンドが指定。agent 側にはフォーマット仕様を持たせず、16タイプ × 3モードの組み合わせ爆発を避けています。
- subagent の出力は加工せずそのまま表示。要約や言い換えは禁止（人格の口調が消えてしまうため）。

## ライセンス

[MIT](LICENSE) © yukurash

## 商標について

このプラグインは Myers-Briggs Type Indicator® (MBTI®) の権利者である The Myers & Briggs Foundation、および 16Personalities® を提供する NERIS Analytics とは無関係であり、それらから認可・推奨を受けたものではありません。「16タイプ」は心理学一般で用いられる類型表現として参照しています。
