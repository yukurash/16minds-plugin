import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const types = [
  'intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp',
];

export function splitAgent(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(source);
  if (!match) throw new Error('Agent must have frontmatter and a nonempty body.');
  const name = /^name: ([a-z]+)$/m.exec(match[1])?.[1];
  const description = /^description: (.+)$/m.exec(match[1])?.[1];
  if (!name || !description) throw new Error('Agent name or description is missing.');
  return { name, description, body: match[2].replaceAll('\r\n', '\n').trim() };
}

export async function buildFiles() {
  const manifest = JSON.parse(await readFile(path.join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
  const files = new Map();
  files.set('plugin.json', `${JSON.stringify({
    $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
    name: '16-minds-writing',
    version: manifest.version,
    description: 'Situation-aware writing with 16 personality agents for GitHub Copilot.',
    author: manifest.author,
    repository: 'https://github.com/yukurash/16minds-plugin',
    license: 'MIT',
  }, null, 2)}\n`);
  for (const relative of ['SKILL.md', 'references/writing.md']) {
    files.set(`skills/voice-write/${relative}`, (await readFile(
      path.join(root, 'skills', 'voice-write', ...relative.split('/')), 'utf8')).replaceAll('\r\n', '\n'));
  }
  files.set('skills/voice-write/references/runtime.md', `# GitHub Copilotでの実行

- このSkillへの明示的な依頼だけを対象にする。依頼文とSkillの引数を読み、Claude固有の引数展開やplugin root変数に依存しない。
- 配役したtypeを、登録済みのカスタムAgent \`16-minds-writer-<type>\` に対応させる。人格定義はこのpackage内に含まれる。
- CLIではネイティブのカスタムAgent委譲、VS CodeではCopilot harnessのsubagent機構を使い、選んだAgentを1回呼ぶ。使用できるツール名は環境に従う。ClaudeのTaskツールを要求しない。
- 渡すもの: 共通仕様の執筆契約全文、確定したtype、目的・相手・媒体・形式・長さ、守る事実・意図・制約、区切られた元文章や材料。Agentに親の会話が自動共有されると仮定しない。
- 執筆Agentはツールなしで文章を返す。追加のファイル読み取りや他Agentの呼び出しは親が完了してから委譲する。
- 登録Agentが見つからない、またはカスタムAgentへの委譲が無効な場合は、pluginの有効化とAgent一覧を確認するよう明示して中断する。CLIの\`/agent\`やVS CodeのAgent pickerでの直接選択は別操作として案内できるが、自動配役の成功に数えない。
`);
  const contract = (await readFile(path.join(root, 'skills', 'voice-write', 'references', 'writing.md'), 'utf8')).replaceAll('\r\n', '\n');
  const writerContract = contract.split('## 執筆Agentへ渡す契約\n')[1]?.split('\n## 完成文の検査と表示')[0];
  if (!writerContract) throw new Error('Shared writer contract is missing.');
  const agentFiles = (await readdir(path.join(root, 'agents'))).filter(name => name.endsWith('.md'));
  if (agentFiles.length !== types.length) throw new Error('Expected exactly 16 source agents.');
  for (const type of types) {
    const agent = splitAgent(await readFile(path.join(root, 'agents', `${type}.md`), 'utf8'));
    if (agent.name !== type) throw new Error(`Mismatched source agent: ${type}`);
    const id = `16-minds-writer-${type}`;
    files.set(`com.github.copilot/agents/${id}.agent.md`, `---
name: ${id}
description: ${JSON.stringify(`Use only for voice-write casting or an explicit ${type.toUpperCase()} writing request. ${agent.description.split(' Invoke ONLY')[0]}`)}
tools: []
---

${agent.body}

## 執筆時の優先契約

このAgentは文章執筆用。上の議論向けの癖より、次の共通契約とユーザーの目的・事実を優先する。
${writerContract.trim()}
`);
  }
  return files;
}

export async function sync({ check = false } = {}) {
  const files = await buildFiles();
  const destination = path.join(root, 'copilot');
  for (const [relative, content] of files) {
    const filename = path.join(destination, ...relative.split('/'));
    if (check) {
      let actual;
      try {
        actual = await readFile(filename, 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        throw new Error(`Generated file is missing: copilot/${relative}`);
      }
      if (actual.replaceAll('\r\n', '\n') !== content) throw new Error(`Generated file is stale: copilot/${relative}`);
    } else {
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, content);
    }
  }
  const agents = await readdir(path.join(destination, 'com.github.copilot', 'agents'));
  if (agents.length !== types.length) throw new Error('Unexpected generated agent files; inspect before removing them.');
  console.log(`${check ? 'Checked' : 'Generated'} ${files.size} Copilot package files.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check') || args.length > 1) {
    throw new Error('Usage: node scripts/build-copilot.mjs [--check]');
  }
  await sync({ check: args.includes('--check') });
}
