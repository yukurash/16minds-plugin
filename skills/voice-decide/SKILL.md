---
name: voice-decide
description: Use when the user provides multiple options and wants a specific 16-minds (MBTI) personality to make the decision in that personality's judgment style. Triggers on Japanese phrases like 「ENTJで決めて」「INFPならどっち選ぶ」「INTJとして判断して」, English equivalents like "decide as ESTJ" / "which would ENFP pick", or 16-minds commands with a `--decide` flag. Requires both a personality and 2+ options to be present or extractable from the request.
---

ユーザーが voice-decide Skill を発動しました。**目的: 指定人格として、提示された選択肢から1つを選び、その人格の価値観で理由を述べる。**

## 引数の解釈

引数 `$ARGUMENTS` から以下を取り出す：

1. **人格タイプ**: 16タイプのいずれか1つ。未指定なら聞き返す。
2. **モード**:
   - `--mode=light`: 決断1行 + 理由1〜2文（既定: 即答用途）
   - `--mode=middle`: 決断 + 理由3〜5文 + リスク認識
   - `--mode=heavy`: 決断 + 理由 + 採用しなかった選択肢への評価 + 撤回条件
3. **選択肢**: 残りの文字列から `A) ... B) ... C) ...` 形式、または箇条書き、または「Xか、Yか、Zか」のような自然言語形式で抽出する。最低2つ必要。
4. **文脈情報**: 選択肢以外の前提条件（期限、制約、目的など）があれば、それも subagent に渡す。

## エラー処理

- 選択肢が1つ以下の場合:
  ```
  Usage: <人格> で決めるには2つ以上の選択肢が必要です。
  Example: 「ENTJで決めて。A) 来月リリース、機能8割 B) 再来月リリース、機能100%」
  ```
- 人格指定が無い場合: 利用可能タイプを出して聞き返す。
- 不明なタイプ名・モード: エラーを返して終了。

## 実行: 該当人格 subagent を Task で1回呼び出す

`Task` ツールで、指定された人格の subagent を1回呼び出す。subagent への入力には以下を含める：

### subagent に渡す本文

```
あなたは指定された人格として、以下の選択肢から1つを選んでください。中立・保留・「ケースバイケース」のような逃げは禁止です。あなたの価値観で必ず1つに決めてください。

【選択肢】:
<ここに選択肢を列挙>

【前提条件・文脈】（あれば）:
<期限・制約・目的など>

【出力フォーマット】（モードによって変える）:
```

### light モード出力フォーマット指定

```
decision: <選択肢のラベル（A/B/C など）。1文字または短いタグで>
reasoning: <なぜこれを選んだか。あなたの価値観の軸が見える1〜2文で。あなたの口調を保つ>
```

### middle モード出力フォーマット指定

```
decision: <選択肢のラベル>
reasoning: <あなたの価値観からその決断に至る筋道を3〜5文で。あなたの口調で>
risk: <この決断で取りこぼすもの・将来後悔しうる点を1〜2文で>
```

### heavy モード出力フォーマット指定

```
decision: <選択肢のラベル>
reasoning: <あなたの価値観からその決断に至る筋道を5〜8文で。あなたの口調で>
rejected:
  - <選択肢X>: <なぜこれを選ばなかったか、しかし何がこの案の良い点だったかを1〜2文で>
  - <選択肢Y>: <同上>
risk: <この決断で取りこぼすもの・将来後悔しうる点を2〜3文で>
revisit_when: <どんな状況変化が起きたらこの決断を撤回すべきかを1〜2文で>
```

## 出力

subagent が返した内容を **そのまま** 表示する。先頭に `### <TYPE>（<mode>）の決断` のような見出しを1行だけ付けてよい。

決断の中立化（要約や中和）は一切行わない。人格の偏りこそがこの Skill の価値。

## 注意

- 1つの選択肢を必ず選ばせること。subagent が「両方良い」「決められない」のような出力をした場合は、再度プロンプトを送って強制的に1つに絞らせる。
- 他人格との比較を聞かれたら、別タイプを引数に取って再実行を提案する。
- 既存の `/mind` コマンドは「意見を聞く」用途。こちらは「決断を強制する」用途であり、出力の射程が異なる。
