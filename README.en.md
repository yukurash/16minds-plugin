[日本語](README.md) | [English](README.en.md)

# 16-minds

A plugin for discussion, review, decisions, and writing with agents inspired by the 16 personality types of MBTI®. Approach the same topic with different values, priorities, and voices.

## What can I do?

| I want to... | Command or skill |
|---|---|
| Get one perspective on a review or idea | [`/mind`](#mind) |
| Have two perspectives challenge each other | [`/pair`](#pair) |
| Compare several opinions and find a way forward | [`/minds`](#minds) |
| Let the plugin choose participants for a topic | [`/cast`](#cast) |
| Write or rewrite for a situation or persona | [`voice-write`](#voice-write) |
| Pick one of several options | [`voice-decide`](#voice-decide) |
| See votes and reasons for a proposal | [`voice-vote`](#voice-vote) |
| Get probing questions instead of answers | [`voice-ask`](#voice-ask) |

## Install

| Client | Supported features | Setup and usage |
|---|---|---|
| Claude Code | All commands and skills | [Claude Code guide](docs/claude-code.md) |
| GitHub Copilot CLI | `voice-write` and 16 writer agents | [Copilot CLI guide](docs/copilot-cli.md) |
| VS Code GitHub Copilot | Same writing package (UI unverified) | [VS Code guide](docs/vscode-copilot.md) |

In the **Claude Code** interactive session:

```text
/plugin marketplace add yukurash/16minds-plugin
/plugin install 16-minds@16-minds-marketplace
```

For **GitHub Copilot CLI**, run in a terminal:

```powershell
copilot plugin install yukurash/16minds-plugin:copilot
```

Copilot supports writing only. The guides are in Japanese with executable examples; see them for installation caveats, updates, removal, and local development. No additional external API key is required, but your client's subscription, model settings, and usage limits still apply.

## Discussion and review commands

These examples use Claude Code's plugin-qualified names. All four commands accept `--mode=light|middle|heavy`, defaulting to `middle`. Use `light` for a quick pass or `heavy` for a deeper discussion.

### /mind

Ask one personality for an opinion, review, or advice. [Arguments and details](commands/mind.md)

```text
/16-minds:mind intj Will this API design hold up long-term?
```

### /pair

Have two personalities present and challenge their positions. `heavy` adds replies and a conclusion; `--rival` chooses the opponent automatically. [Arguments and details](commands/pair.md)

```text
/16-minds:pair istj entp --mode=heavy Split the monolith or keep it
/16-minds:pair intj --rival Is this API design ready to ship?
```

### /minds

Compare opinions, identify disagreements, and synthesize possible ways forward. All 16 personalities participate by default. [Arguments and details](commands/minds.md)

```text
/16-minds:minds Narrow down naming candidates for a new service
/16-minds:minds --mode=heavy --types=intj,entj,istp --save Which DB should we adopt next?
```

- Use `--types=a,b,...` to pick participants. Without it, `--n=N` takes the first N types in the list.
- `--save` writes the result to `Outputs/<timestamp>-minds-<mode>.md`. Use `--out=<path>` to choose the destination.

### /cast

Let the plugin select a smaller group for the topic, then collect their opinions and synthesis. [Arguments and details](commands/cast.md)

```text
/16-minds:cast --n=4 --show Should we keep developing with this architecture?
```

Use `--n` to set the group size and `--show` to display the selection rationale. To choose a writer instead, use `voice-write --auto` below.

## Skills: write, decide, vote, and ask

These examples also use Claude Code. Skills can be requested in natural language, such as "rewrite as ENFP", "decide as ENTJ", "vote with all 16 minds", or "question this as ENTP".

### voice-write

Write or rewrite with one personality. Name the type, or use `--auto` to choose a writer for the purpose, audience, and medium. An explicit type takes precedence over `--auto`.

```text
/16-minds:voice-write --auto --format=reply --show Turn these facts into a team update: <facts>
/16-minds:voice-write infj --rewrite --format=post --length=200字 <draft>
```

- `--write` / `--rewrite`: create new prose or revise a draft. New writing is the default.
- `--format=article|essay|post|reply`: output format, defaulting to `article`.
- `--length=200字`: an approximate character target, not a strict limit.
- `--show`: display the chosen type and selection rationale separately. Normally, only finished prose is returned.

The situation and factual fidelity take priority over persona. For Copilot invocation, see the [CLI guide](docs/copilot-cli.md) or [VS Code guide](docs/vscode-copilot.md). The [writing specification](skills/voice-write/references/writing.md) covers shared arguments and policy.

### voice-decide

Choose one of at least two options using a specified personality's values. [Arguments and details](skills/voice-decide/SKILL.md)

```text
/16-minds:voice-decide entj A) Keep the monolith B) Split gradually C) Full microservices
```

### voice-vote

Collect yes, no, and abstain votes, a pass/fail judgment, and the main reasons. All 16 types vote by default; `--types` narrows the group. [Arguments and details](skills/voice-vote/SKILL.md)

```text
/16-minds:voice-vote --types=entj,istj,entp,esfj --save Cut team standups from twice a week to once
```

### voice-ask

Get questions from a specified personality to examine your idea or plan, rather than answers or advice. [Arguments and details](skills/voice-ask/SKILL.md)

```text
/16-minds:voice-ask entp I want to build a SaaS that auto-summarizes meetings with AI
```

## Available types

`intj`, `intp`, `entj`, `entp`, `infj`, `infp`, `enfj`, `enfp`, `istj`, `isfj`, `estj`, `esfj`, `istp`, `isfp`, `estp`, `esfp`

Each type's personality is defined in `agents/<type>.md`. Cognitive functions (dominant + auxiliary), core values, strengths and weaknesses, debate quirks, and characteristic phrasings are all spelled out — so the output has visible individuality.

Personas are prompts for changing perspective, priorities, and writing style, not psychological assessments or guarantees of ability. Review important decisions and external communications yourself.

## Further reading

- [Example discussion output](Outputs/qiita-title-discussion.md)
- [Development and maintenance](docs/development.md)
- [Casting experiments and validation (16minds-lab)](https://github.com/yukurash/16minds-lab)
- [Original design background (Qiita, Japanese)](https://qiita.com/yukurash/items/4c4bfc492d91770618b8)

## License

[MIT](LICENSE) © yukurash

## Trademark notice

This plugin is not affiliated with, endorsed by, or authorized by The Myers & Briggs Foundation (holder of the Myers-Briggs Type Indicator® / MBTI® trademark), nor by NERIS Analytics (16Personalities®). The "16 types" are referenced as a general psychological typology.
