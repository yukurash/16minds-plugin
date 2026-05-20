---
name: voice-vote
description: Use when the user wants all 16 personality types (16-minds plugin) to vote on a proposal — yes/no/abstain — to see stakeholder distribution, detect hidden objections, or simulate organizational consensus. Triggers on Japanese phrases like 「全人格で投票」「16人格に賛否を聞いて」「ステークホルダーシミュ」「これ通せそう？」, English equivalents like "vote with all 16 minds" / "stakeholder simulation", or `--vote` flag on 16-minds commands. Different from /minds (which is for opinion divergence) — this is for binary judgment aggregation.
---

ユーザーが voice-vote Skill を発動しました。**目的: 16人格全員で賛成/反対/保留を投票させ、可決判定と層別の論点を可視化する。**

## 引数の解釈

引数 `$ARGUMENTS` から以下を取り出す：

1. **提案文**: 投票対象。1文〜数段落の自由形式。
2. **モード**（オプション）:
   - `--mode=light`（既定）: 投票結果 + 賛否上位3理由のみ
   - `--mode=heavy`: 投票結果 + 全人格の賛否理由をフル表示 + 反対層の深掘り
3. **対象限定**: `--types=intj,enfp,...` で投票者を絞れる（既定は全16）
4. **保存**: `--save` または `--out=<path>` で結果を `Outputs/` に保存

## エラー処理

- 提案文が空の場合:
  ```
  Usage: /voice-vote [--mode=light|heavy] [--types=a,b,...] [--save] <提案文>
  Example: 「全社員PCをMacBook Pro統一にする」を16人格で投票
  ```
- 不明なタイプ名・モード: エラーを返して終了。

## 実行フロー

### Phase 1: 全人格に並列投票（全モード共通）

対象人格全員（既定16）を **並列に** `Task` ツールで呼び出す。**同一メッセージ内で複数の Task 呼び出しを行うこと。** 逐次呼び出しは禁止。

各 subagent に渡す本文：

```
以下の提案に対し、あなたの人格の価値観から賛成/反対/保留のいずれかを投じてください。中立は禁止、立場を必ず取ること。挨拶・前置きは不要です。

【提案】:
<ここに提案文>

【出力フォーマット】（必ずこの4行で答える）:
vote: <yes | no | abstain のいずれか>
key_axis: <あなたの判断に最も効いた価値観の軸（あなたの人格定義に出てくる言葉で）>
reason: <あなたの口調で1〜2文。なぜその投票になったかを端的に>
condition: <投票を覆す条件があれば1文。無ければ "none">
```

### Phase 2: 集計と表示（全モード共通）

全人格の結果が揃ったら、以下の構成で表示する：

```
### 投票結果

| 集計 | 人格 |
|---|---|
| 賛成 (N) | <タイプ群をカンマ区切り> |
| 反対 (N) | <タイプ群をカンマ区切り> |
| 保留 (N) | <タイプ群をカンマ区切り> |

### 可決判定

<賛成 > 反対 → 可決 / 賛成 < 反対 → 否決 / 同数 → 拮抗（要再検討） を1行で>
<賛成率 = 賛成 / 全投票数 を併記>

### 主要な賛成理由（key_axis 別に2〜3個）
- <key_axis A> (代表: <タイプ群>): <なぜこの軸で賛成になるかを1文で>
- <key_axis B> (代表: <タイプ群>): <同上>

### 主要な反対理由（key_axis 別に2〜3個）
- <key_axis X> (代表: <タイプ群>): <1文で>
- <key_axis Y> (代表: <タイプ群>): <同上>

### 保留層の論点（あれば）
- <保留した人格が何を懸念しているかを1〜2文で>
```

### Phase 3: 反対層の深掘り（heavy のみ）

反対投票したタイプを **並列に** `Task` で再呼び出し。各 subagent には自分の Phase 1 出力を渡し、以下を求める：

```
あなたは先ほどこの提案に反対しました。今度は、提案を通すために最低限満たすべき条件を1つだけ挙げてください。妥協できる条件です。

【あなたの反対理由】: <Phase 1 の reason>
【出力フォーマット】:
minimum_condition: <提案を受け入れる最低条件を1文で>
```

結果を以下のように表示：

```
### 反対層が出した「最低条件」（heavy）

- <タイプ>: <minimum_condition>
- <タイプ>: <minimum_condition>
...

### 統合: 反対層を取り込む修正案

<反対層の minimum_condition を眺めて、メインの assistant が中立的に「これらを全部満たす修正案」を1〜2案、3〜5文で提示する。subagent は呼ばない。>
```

## 出力構成のまとめ

- light: 投票結果表 + 可決判定 + 主要賛否理由 + 保留層論点
- heavy: 上記 + 反対層の最低条件 + 統合修正案

## 保存（`--save` / `--out=<path>` 指定時）

`/minds` と同様に、画面表示と同じ内容を `Outputs/<YYYYMMDD-HHMMSS>-vote-<mode>.md` に書き出す。`--out` 指定があればそのパスを使う。`Outputs/` が無ければ作成する。保存後 `保存しました: <絶対パス>` を1行で報告。

## 注意

- 全人格の呼び出しは必ず並列。逐次は禁止。
- 「保留」を選んだ人格はカウントするが、可決判定の分母には含めない（賛成 vs 反対 で判定）。
- このSkillは「全員の意見を聞く」のではなく「**意思決定に通せそうかの判定**」が目的。`/minds` の発散用途とは射程を分けること。
- 反対層に偏りがある場合（例: 全員 NT 系が反対）、それは Phase 2 の `key_axis` から自然に見えるはず。明示的にラベル化しなくてよい。
