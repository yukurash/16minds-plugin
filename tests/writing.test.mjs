import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { buildFiles, root, splitAgent, sync, types } from '../scripts/build-copilot.mjs';

test('all 16 canonical persona bodies survive in the Copilot package', async () => {
  const files = await buildFiles();
  assert.equal(new Set(types).size, 16);
  for (const type of types) {
    const source = splitAgent(await readFile(path.join(root, 'agents', `${type}.md`), 'utf8'));
    const generated = files.get(`com.github.copilot/agents/16-minds-writer-${type}.agent.md`);
    assert.ok(generated.includes(source.body));
    assert.ok(generated.includes('tools: []'));
    assert.ok(generated.includes('## 執筆時の優先契約'));
    assert.ok(!/^model:/m.test(generated));
  }
});

test('shared skill, decision coverage, contract and legacy options remain available', async () => {
  const files = await buildFiles();
  const policy = files.get('skills/voice-write/references/writing.md');
  for (const type of types) assert.match(policy, new RegExp(`^\\| ${type} \\|`, 'm'));
  for (const option of ['--write', '--rewrite', '--format=', '--length=', '--auto', '--show']) {
    assert.ok(policy.includes(option), `Missing ${option}`);
  }
  for (const format of ['article', 'essay', 'post', 'reply']) assert.ok(policy.includes(format));
  for (const term of ['explicit|auto|context', '事実', '責任範囲', '確認', 'エラー', '捏造しない']) {
    assert.ok(policy.includes(term), `Missing contract term: ${term}`);
  }
  assert.ok(policy.includes('目安の文字数に届かないだけで材料不足とは扱わず'));
  assert.ok(policy.includes('修正経過の説明は完成文に添えない'));
});

test('Copilot package is self-contained, portable metadata is valid and versions match', async () => {
  const files = await buildFiles();
  const manifest = JSON.parse(files.get('plugin.json'));
  const claude = JSON.parse(await readFile(path.join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
  const marketplace = JSON.parse(await readFile(path.join(root, '.claude-plugin', 'marketplace.json'), 'utf8'));
  assert.equal(manifest.version, claude.version);
  assert.equal(marketplace.plugins[0].version, claude.version);
  assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
  for (const [filename, content] of files) {
    assert.ok(content.endsWith('\n') && !content.endsWith('\n\n'), `Unexpected trailing blank lines: ${filename}`);
    assert.ok(!content.includes('$ARGUMENTS'), filename);
    assert.ok(!content.includes('CLAUDE_PLUGIN_ROOT'), filename);
    for (const match of content.matchAll(/\]\((\.\/[^)#]+)\)/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(filename), match[1]));
      assert.ok(files.has(target), `Missing package reference: ${filename} -> ${target}`);
    }
  }
  assert.equal((await readdir(path.join(root, 'commands'))).length, 4);
});

test('malformed source definitions fail instead of generating a fallback persona', () => {
  assert.throws(() => splitAgent('no frontmatter'), /frontmatter/);
  assert.throws(() => splitAgent('---\nname: intj\n---\nbody'), /description/);
});

test('command descriptions containing colons remain quoted YAML scalars', async () => {
  for (const name of ['cast', 'mind', 'minds', 'pair']) {
    const command = await readFile(path.join(root, 'commands', `${name}.md`), 'utf8');
    const description = /^description: (.+)$/m.exec(command)?.[1];
    assert.ok(description, name);
    assert.equal(typeof JSON.parse(description), 'string', name);
  }
});

test('committed Copilot package is synchronized with its source', async () => {
  await sync({ check: true });
});
