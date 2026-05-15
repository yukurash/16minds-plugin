---
description: Get one personality type's opinion on a topic. Usage: /mind <type> [--mode=light|middle|heavy] <topic>
---

ユーザーが `/mind` を実行しました。

引数: $ARGUMENTS

## 引数の解釈

1. `--mode=light` / `--mode=middle` / `--mode=heavy`（あるいはスペース区切りの `--mode light` 形式）があれば取り出してモードとする。指定が無ければ `middle`。
2. 残った引数の最初の単語をタイプ名として取り出し、小文字に正規化する（例: `INTJ` → `intj`）。
3. 残りの文字列を「お題」として扱う。

## 利用可能なタイプ

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

## エラー処理

- 引数が空、あるいはタイプ名のみでお題が無い場合:
  ```
  Usage: /mind <type> [--mode=light|middle|heavy] <topic>
  Example: /mind intj このAPI設計どう思う？
  Example: /mind enfp --mode=heavy リモートワークと出社のバランス
  ```
- タイプ名が上記リストに無い場合: `利用可能なタイプ: intj, intp, entj, entp, infj, infp, enfj, enfp, istj, isfj, estj, esfj, istp, isfp, estp, esfp` と返して終了。
- モード名が `light` / `middle` / `heavy` のいずれでもない場合: そのことを伝えて終了。

## 実行

指定タイプの subagent を Task ツールで1回だけ呼び出す。プロンプトには以下を含めること：

- お題（ユーザーが渡した文字列をそのまま）
- 「あなたは指定された人格としてこのお題に対する意見を述べてください」という指示
- 下記のモード別「出力フォーマット指定」をそのまま貼り付ける

### light モード出力フォーマット指定

```
お題に対し、以下の4行のみで答えてください。挨拶・前置き・まとめは一切不要です。

score: <1〜5の整数。あなたの価値観から見た総合評価。5=完全賛成、3=条件付き、1=完全反対>
stance: <一行の立場宣言>
key_axis: <判断に最も効いたあなたの価値観の軸（あなたの人格定義に出てくる言葉で）>
concern: <あなたの価値観から見た最大の懸念を一行>
```

### middle モード出力フォーマット指定

```
お題に対し、以下の構成で約150〜250字で答えてください。あなたの口調を必ず保ってください。挨拶・前置き・まとめは不要です。

stance: <一行の立場宣言>
reasoning: <あなたの価値観からその立場に至る筋道を2〜3文で。あなたの口調で>
watchpoint: <あなたの価値観から見た見落としやすい点・推しポイント・引っかかりを1〜2文で>
```

### heavy モード出力フォーマット指定

```
お題に対し、以下の構成で約300〜500字で答えてください。あなたの口調を必ず保ってください。挨拶・前置き・まとめは不要です。

stance: <一行の立場宣言>
reasoning: <あなたの価値観からその立場に至る筋道を、具体例や反例を交えて3〜5文で>
strongest_case: <あなたの立場が最も強くなるケース・前提条件を1〜2文で>
weakest_case: <あなたの立場が崩れるケース・前提条件を1〜2文で（自分でも認める弱点）>
```

## 出力

subagent が返した内容をそのまま、加工せず表示する。先頭に `### <TYPE>（<mode>）` のような見出しを1行だけ付けてよい。
