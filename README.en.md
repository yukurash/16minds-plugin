[日本語](README.md) | [English](README.en.md)

# 16-minds

> A Claude Code plugin that summons agents based on the 16 personality types of MBTI® to debate, review, or advise on any topic.

> ℹ️ This plugin is not affiliated with, endorsed by, or authorized by The Myers & Briggs Foundation (holder of the Myers-Briggs Type Indicator® / MBTI® trademark), nor by NERIS Analytics (16Personalities®). The "16 types" are referenced as a general psychological typology.

Use it not just for code review but for **design decisions, lifestyle choices, ethical dilemmas, career questions — anything where opinions are likely to diverge**. The premise: diversity of perspective leads to better conclusions.

## Why this exists

Asking Claude for a review tends to produce balanced, averaged answers. What you usually want is several distinctly-biased perspectives clashing — so you can pick up the angles you'd otherwise have missed. 16-minds defines **values, thinking patterns, and tone** for each of the 16 types as independent prompts, then hits your topic with them in parallel.

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
| `/minds [--mode=...] [--types=a,b,...] [--n=N] <topic>` | All 16 types in parallel + synthesis (heavy adds a rebuttal round) |

## Modes

| Mode | Content | Use case |
|---|---|---|
| `light` | Score + one-line comment only | Quick diversity check, token savings |
| `middle` (default) | Light pass → expand divergent opinions → synthesis | Balanced first impression |
| `heavy` | + rebuttal round + deeper synthesis | Heavy decisions or article material |

## Examples

```
/mind intj What do you think about this API design?
/mind enfp --mode=heavy Balancing remote work and office presence
/pair istj entp --mode=heavy A major refactor of the codebase
/minds The pros and cons of AI-driven code review
/minds --mode=heavy --types=intj,enfp,istp,infj This tech stack choice
/minds --n=4 Bread or rice for breakfast?
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

## Available types

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

Each type's personality is defined in `agents/<type>.md`. Cognitive functions (dominant + auxiliary), core values, strengths and weaknesses, debate quirks, and characteristic phrasings are all spelled out — so the output has visible individuality.

## Design notes

- **Personalities are baked into prompts.** No centralized "value vector table" — avoids dual maintenance.
- **Subagent calls are always parallel.** `/minds` fans out to 16 at most, so sequential dispatch would tank latency.
- **Output format is dictated by the calling command.** Agents don't carry format specs — this avoids a 16 × 3 combinatorial explosion.
- **Subagent output is shown verbatim.** No summarizing or paraphrasing (it would erase the personality).

## License

[MIT](LICENSE) © yukurash

## Trademark notice

This plugin is not affiliated with, endorsed by, or authorized by The Myers & Briggs Foundation (holder of the Myers-Briggs Type Indicator® / MBTI® trademark), nor by NERIS Analytics (16Personalities®). The "16 types" are referenced as a general psychological typology.
