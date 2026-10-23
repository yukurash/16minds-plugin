# GitHub Copilotでの実行

- このSkillへの明示的な依頼だけを対象にする。依頼文とSkillの引数を読み、Claude固有の引数展開やplugin root変数に依存しない。
- 配役したtypeを、登録済みのカスタムAgent `16-minds-writer-<type>` に対応させる。人格定義はこのpackage内に含まれる。
- CLIではネイティブのカスタムAgent委譲、VS CodeではCopilot harnessのsubagent機構を使い、選んだAgentを1回呼ぶ。使用できるツール名は環境に従う。ClaudeのTaskツールを要求しない。
- 渡すもの: 共通仕様の執筆契約全文、確定したtype、目的・相手・媒体・形式・長さ、守る事実・意図・制約、区切られた元文章や材料。Agentに親の会話が自動共有されると仮定しない。
- 執筆Agentはツールなしで文章を返す。追加のファイル読み取りや他Agentの呼び出しは親が完了してから委譲する。
- 登録Agentが見つからない、またはカスタムAgentへの委譲が無効な場合は、pluginの有効化とAgent一覧を確認するよう明示して中断する。CLIの`/agent`やVS CodeのAgent pickerでの直接選択は別操作として案内できるが、自動配役の成功に数えない。
