[日本語](README.md) | [English](README.en.md)

# 16-minds

A Claude Code plugin that summons agents based on the 16 personality types of MBTI® to debate, review, or advise on any topic.

Use it for idea generation, design decisions, life / career choices, code review, ethical dilemmas — anything where opinions are likely to diverge. The premise: diversity of perspective leads to better conclusions.

## Why this exists

Asking Claude for a review tends to produce balanced, averaged answers. What you usually want is several distinctly-biased perspectives clashing — so you can pick up the angles you'd otherwise have missed. 16-minds defines values, thinking patterns, and tone for each of the 16 types as independent prompts, then hits your topic with them in parallel.

## Install

```
/plugin marketplace add yukurash/16minds-plugin
/plugin install 16-minds
```

For local development:

```
/plugin marketplace add <path to your local clone>
/plugin install 16-minds
```

## Commands

| Command | What it does |
|---|---|
| `/mind <type> [--mode=...] <topic>` | A single type's opinion |
| `/pair <a> <b> [--mode=...] <topic>` | Two-type debate (open → rebut → reply / synthesize) |
| `/minds [--mode=...] [--types=a,b,...] [--n=N] [--save] [--out=<path>] <topic>` | All 16 types in parallel + synthesis (heavy adds a rebuttal round). `--save` writes the full result to a file. |

## Skills (action-oriented)

Skills that use personalities to write, decide, vote, and ask — where `/mind` `/minds` `/pair` are for "discussion", these are for "execution."

| Skill | What it does |
|---|---|
| `voice-write` | Write in a chosen type's voice, or rewrite AI-generated text |
| `voice-decide` | Pick one option as a specified type (no fence-sitting) |
| `voice-vote` | Have a group of types vote yes / no / abstain, judge whether it passes |
| `voice-ask` | A specified type asks you sharp questions back (no answers, only questions) |

The design rationale — three principles for stripping AI-ness, per-type output comparisons, real use cases for each Skill — is written up in a Qiita article (Japanese) → [記事から "AIっぽさ" をなくす Skills を作成した - Claude Code プラグイン『16-minds』](https://qiita.com/yukurash/items/4c4bfc492d91770618b8)

### Command examples

Explicit invocation:

```
/voice-write enfp Tips for getting a Qiita article actually read
/voice-write intj --format=post Monday-morning self-pep-talk
/voice-decide istj Next feature for a baby-tracking app: A) AI nutrition analysis B) realtime parent-pair log C) developmental milestone alerts
/voice-vote Cut team standups from twice a week to once --types=entj,istj,entp,esfj,intp
/voice-ask entp I want to monetize my personal-project plugin next year
```

Natural language also works:

```
Rewrite this as ENFP: <paste an AI-flavored draft here>
Decide as ENTJ. A) Keep the monolith B) Carve it up gradually C) Full microservices
Have the team vote: standardize all company laptops to MacBook Pro
Push back as ENTP: a SaaS that auto-summarizes meetings via AI
```

## Modes

| Mode | Content | Use case |
|---|---|---|
| `light` | Score + one-line comment only | Quick diversity check, token savings |
| `middle` (default) | Light pass → expand divergent opinions → synthesis | Balanced first impression |
| `heavy` | + rebuttal round + deeper synthesis | Heavy decisions or article material |

The `/minds` synthesis section always follows this 4-part rubric (a fixed structure to prevent the discussion from going scattershot):

1. Score distribution — min / mode / max in one line
2. Major axes of disagreement (2–3) — each with representative types on either side
3. Easily-overlooked perspectives (1–3) — sourced to the originating type
4. Landing-zone candidates (2–3) — each with "types likely to agree / fit / risk"

## Examples

### Idea generation (the original motivation for this plugin)

```
/minds Which Qiita article title would land hardest?
/minds --mode=heavy Narrow down naming candidates for a new service
/mind enfp Give me 3 ideas for refreshing this weekend
/pair entp infj What side project should I start
```

Real example: [`Outputs/qiita-title-discussion.md`](Outputs/qiita-title-discussion.md) — a full log of using `/minds` on this very repo to debate a Qiita article title (Phase 1 table → Phase 2 deep-dive → Phase 3 synthesis landing on 3 candidates).

### Design decisions / code review

```
/mind intj Will this API design hold up long-term?
/pair istj entp --mode=heavy Split the monolith or keep it
/minds --mode=heavy --types=intj,entj,istp Which DB to adopt next
/minds The pros and cons of AI-driven code review
```

### Life and career choices

```
/minds Change jobs or wait for promotion at the current company
/pair infj entj --mode=heavy Turn the side project into the main gig
/mind enfp --mode=heavy Balance between remote work and office
```

### Sample output (`/mind intj` in light mode)

```
score: 2
stance: Sacrificing long-term optimization for short-term comfort
key_axis: Long-term optimization
concern: Continue this for 3 years and exit cost grows exponentially
```

### Sample output (`/minds --mode=light` first-pass table)

```
| type | score | stance | key_axis | concern |
|---|---|---|---|---|
| intj | 2 | Inefficient in the long run | Long-term optimization | Growing exit cost |
| enfp | 5 | A choice that makes today's self happy is fine | Freedom | Watch for burnout |
| istj | 3 | OK if there's precedent, otherwise cautious | Evidence | Thin validation data |
...
```

## Saving results

`/minds --save` writes the full execution (Phase 1 table, deep-dive, synthesis) to `Outputs/<timestamp>-minds-<mode>.md`. Use `--out=<path>` to specify the destination explicitly. Handy when you want to keep the discussion as article material or a decision log.

## Available types

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

Each type's personality is defined in `agents/<type>.md`. Cognitive functions (dominant + auxiliary), core values, strengths and weaknesses, debate quirks, and characteristic phrasings are all spelled out — so the output has visible individuality.

## Design notes

- Personalities are baked into prompts. No centralized "value vector table" — avoids dual maintenance.
- Subagent calls are always parallel. `/minds` fans out to 16 at most, so sequential dispatch would tank latency.
- Output format is dictated by the calling command. Agents don't carry format specs — this avoids a 16 × 3 combinatorial explosion.
- Subagent output is shown verbatim. No summarizing or paraphrasing (it would erase the personality).

## License

[MIT](LICENSE) © yukurash

## Trademark notice

This plugin is not affiliated with, endorsed by, or authorized by The Myers & Briggs Foundation (holder of the Myers-Briggs Type Indicator® / MBTI® trademark), nor by NERIS Analytics (16Personalities®). The "16 types" are referenced as a general psychological typology.
