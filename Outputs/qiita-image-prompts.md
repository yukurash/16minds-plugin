# Qiita記事向け画像生成プロンプト集（ChatGPT / DALL·E 用）

記事の各位置に挿し込む想定。お好みで採用してください。各プロンプトは英語/日本語の両方を用意しています（DALL·E は英語の方が安定）。

---

## ① ヘッダー画像（記事トップ用）

**用途**: 記事冒頭のアイキャッチ。16人が円卓を囲んで議論しているコンセプチュアル絵。

### English

> A flat-style conceptual illustration of 16 diverse stylized characters seated around a large circular conference table, each character has a slightly distinct silhouette and color palette (cool blues, warm oranges, muted greens, soft purples), all leaning toward the center where a single glowing terminal-window icon hovers. The scene is calm but charged with discussion — speech-bubble shapes hint at debate without showing text. Minimalist, clean linework, soft gradients, light geometric background suggesting a tech/coding context (subtle circuit lines, monospace grid). 16:9 aspect ratio, no actual readable text in the image.

### 日本語（参考）

> 16人の個性的なキャラクターが大きな円卓を囲み、中央に浮かぶターミナルウィンドウのアイコンに向かって議論しているフラットイラスト。各キャラクターはシルエットと配色（クールブルー、ウォームオレンジ、ミューテッドグリーン、ソフトパープルなど）でわずかに描き分ける。会話のニュアンスを示す吹き出し形状はあるが、文字は読めない抽象的なもの。ミニマルなライン、柔らかいグラデーション、背景にコーディングを示唆する控えめな回路パターン。16:9、画面内に読める文字は入れない。

**ポイント**: 「読める文字を入れない」を強く指定しないと、DALL·Eは謎の英語っぽい文字列を勝手に描き込む。

---

## ② セクション挿絵: 「無難なレビュー vs 16人の喧嘩」のビフォーアフター

**用途**: 「きっかけ ― レビューが無難すぎる問題」の直後に挿入できる対比イラスト。

### English

> A two-panel comic-style illustration, side by side.
> Left panel: A single bland robot character handing over a flat gray speech bubble that reads only "..." — minimalistic, low energy, muted gray-beige tones.
> Right panel: 16 stylized characters in vibrant colors all talking at once, arrows and lines connecting their speech bubbles, energetic and chaotic but readable composition. Bright but not garish palette.
> Both panels share a clean modern flat-vector style. 16:9 total. No real text inside the image — only abstract bubble/arrow shapes.

### 日本語（参考）

> 左右2コマ漫画風イラスト。
> 左コマ: 一体の無個性なロボットが「…」とだけ書かれたグレーの吹き出しを差し出す。彩度を抑えたグレーベージュ系、静かでローエナジー。
> 右コマ: 16人のカラフルなキャラクターが一斉に話しており、吹き出し同士を矢印やラインで繋いだ、賑やかだが整理された構図。明るいがケバくない配色。
> 両コマとも、クリーンなフラットベクタースタイルで統一。全体 16:9。画面内に読める文字は入れない、抽象的な吹き出し・矢印の形のみ。

---

## ③ 概念図: 並列召喚アーキテクチャ図

**用途**: 「② subagent への呼び出しは必ず並列」セクションの図解。Mermaid でも代用できるが、画像にした方が見栄えがいい。

### English

> A clean technical diagram in flat isometric style. At the top, a single user terminal icon labeled with a slash-command prompt. From it, 16 thin arrows fan out simultaneously to 16 small "agent" cards arranged in a grid (4 rows × 4 columns). Each agent card is a stylized portrait silhouette with a distinct color hue (16 different colors). Below the grid, the 16 cards converge back into a single "synthesis" card at the bottom. The overall layout is symmetrical and emphasizes parallel fan-out then merge. Soft background, minimal labels, no readable English/Japanese text — only abstract icons. 16:9.

### 日本語（参考）

> フラットアイソメトリック調のクリーンな技術図。上部に1つのユーザーターミナル（スラッシュコマンドを示すアイコン）、そこから16本の細い矢印が同時に放射状に伸び、4×4のグリッドに並んだ16の "agent" カードに繋がる。各エージェントカードはシルエット風の人型アイコンで、16通りの異なる色相を持つ。グリッドの下で、16カードが1つの "合議" カードに収束する。全体対称、並列ファンアウト→マージを強調。背景は淡く、読めるテキストは入れず、抽象アイコンのみ。16:9。

---

## ④ おまけ: SNS拡散用の正方形バナー

**用途**: X (Twitter) や Qiita のOGP用に正方形で1枚あると見栄えがする。

### English

> A square 1:1 minimalist poster design. Centered: a stylized circular ring composed of 16 small distinct character icons holding hands (or connected by lines), each in a unique color from a harmonious 16-hue palette. In the negative space at center: a clean glowing terminal-cursor icon. Soft pastel-tech background with very subtle grid lines. No readable text in the image — pure visual composition. Modern editorial illustration style.

### 日本語（参考）

> 1:1の正方形ミニマルポスター。中央に16個の小さなキャラクターアイコンが手を繋ぐ（またはラインで繋がる）リング状の構図、各アイコンは調和のとれた16色パレットの異なる色相。リング中央のネガティブスペースに、ターミナルカーソルの淡い発光アイコン。淡いパステルテック系背景にごく控えめなグリッドライン。画面内に読めるテキストは入れない。モダンエディトリアル風。

---

## 共通プロンプト指針

DALL·E / ChatGPT 画像生成で安定させたい場合、以下を後ろに足すと事故が減る：

| 指示 | 効果 |
|---|---|
| `no readable text in the image` | 謎の英字や記号の混入を防ぐ |
| `clean flat illustration style` / `flat isometric` | 写実調になるのを防ぐ |
| `16:9` or `1:1` | アスペクト比固定 |
| `cohesive color palette` | 色がバラつくのを防ぐ |
| `minimalist composition` | ごちゃっとした絵を防ぐ |

逆に避けたい指示：

- 「16人それぞれの正確な性格表現を」→ DALL·Eには細かすぎて崩れる
- 「MBTIの正確な記号を絵に入れて」→ 文字描画は弱いので諦める
