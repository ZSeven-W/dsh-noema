<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>DeepSeek Harness のための長期記憶 — Noema が支える、永続的で検証可能なエージェントメモリ。</strong><br />
  <sub>作業前のリコール &bull; 9 つのエージェントツールからのインポート &bull; 設定ページでのメモリ管理 &bull; クラッシュ時のキープアライブ &bull; ホットリロード</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · 現在のプラグインリリース: <code>0.1.0-rc.1</code> · DSH <code>0.1.0-rc.6</code> でテスト済み</sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md"><b>日本語</b></a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

## DSH Noema を使う理由

DSH Noema は、[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) と [Noema](https://github.com/ZSeven-W/noema)（コーディングエージェント向けのローカルファーストで非ベクトル型のメモリシステム）を接続し、エージェントが会話のたびにゼロから始めるのではなく、セッションをまたいで永続的な知識を保持できるようにします。

<table>
<tr>
<td width="50%">

### 🧠 永続的なリコール

メモリは `NOEMA_ROOT`（デフォルト `~/.agent-memory/`）配下に、検証可能な Markdown ファイルとして永続化されます。`noema_recall` がセッション開始時に関連コンテキストを読み込み、`noema_search`、`noema_browse`、`noema_catalog`、`noema_recall_graph` が検索・探索・監査を担います。

</td>
<td width="50%">

### 📥 他のツールからインポート

`noema_import` は、Codex、Claude Code、opencode、Cursor、Grok、WorkBuddy、Antigravity、Trae、Qoder という 9 つの他の AI コーディングツールのメモリファイルを読み込み、セクションに分割して、それぞれを永続的なメモリとして保存します。コンテンツをキーとする台帳が、実行間およびファイルを共有するツール間で重複を排除します。

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ 設定ページでの管理

Noema メモリ設定ページでは、サーバーコマンド、メモリルート、バジェット、アイドル/呼び出しタイムアウト、ガイダンスセクションを設定できます。さらに、メモリ管理カードから保存済みメモリの検索、閲覧、追加、レビュー、削除を直接行えます。

</td>
<td width="50%">

### 🩺 キープアライブ

メモリサーバーは稼働し続けます。アイドルタイムアウトのデフォルトは「なし」で、キープアライブのループが、`noema-mcp` 子プロセスがクラッシュまたは終了した際にバックグラウンドで再起動します。チェック間隔と再起動バックオフは設定可能です。

</td>
</tr>
<tr>
<td width="50%">

### 🔍 スマートなエンティティ抽出

Noema の抽出エンジンは、jieba の単語分割と、英語の固有名詞、CJK の名前や技術用語、引用符で囲まれたトピック、繰り返しといった高精度シグナルを、ストップワードおよびパスフィルターと組み合わせることで、PageIndex のトピックカタログをクリーンに保ちます。

</td>
<td width="50%">

### ⚡ ホットリロード

最初の起動後、プラグインの再起動は二度と不要です。`npm run build` が Cordis HMR を通じてホストプラグインをホットリロードし、`npm run build:client` が client-hmr の SSE チャネル経由でブラウザバンドルをホットスワップします。

</td>
</tr>
</table>

## DSH へのインストール

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

または、ソースツリーから直接ローカル開発する場合:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` プロトコルはプロファイルの依存関係をこのリポジトリへシンボリックリンクするため、再ビルドの内容が即座に反映され、Cordis HMR がコンパイル済み出力を監視できます。

このプラグインは、プラットフォームごとのオプショナル npm パッケージを通じて `noema-mcp` バイナリをバンドルしています。代わりに自分でビルドするには、バンドルされた `noema` サブモジュール内で `cargo build --release -p noema-mcp` を実行するか、Server command 設定を任意の `noema-mcp` ビルドに向けてください。

## メモリツール

モデル向けツールは Noema MCP のサーフェスに対応しています:

| ツール | 説明 |
| --- | --- |
| `noema_recall` | クエリに関連するメモリを、トークンバジェット付きでリコールします。 |
| `noema_search` | 保存済みメモリを全文検索します。 |
| `noema_browse` | トピックやエンティティの PageIndex カタログを閲覧します。 |
| `noema_catalog` | 全メモリカタログを Markdown として描画します。 |
| `noema_recall_graph` | リンクと共有エンティティをたどるマルチホップリコール。 |
| `noema_neighbors` | メモリからグラフを 1 ホップ展開します。 |
| `noema_explain` | メモリがリコールされた/されなかった理由を説明します。 |
| `noema_remember` | 永続的な事実、決定、制約、または好みを保存します。 |
| `noema_review_list` | 保留中のレビュー候補を一覧表示します。 |
| `noema_review_decide` | 候補を承認、却下、編集、またはマージします。 |
| `noema_forget` | メモリをトゥームストーン化または完全削除します。 |
| `noema_policy_get` / `noema_policy_set` | 書き込みポリシーを読み取りまたは更新します。 |
| `noema_status` | サーバーとテナントのステータス: 件数、インデックスの健全性、ストレージルート。 |
| `noema_import` | 他の AI コーディングツールからメモリをインポートします。 |

各ツールは統一されたエンベロープ `{ ok, tool, text }` を返し、`text` がサーバーの全出力を保持します。

## 他のツールからメモリをインポート

| ソース id | グローバルファイル | ワークスペースファイル |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + Codex メモリパイプライン: `~/.codex/memories/MEMORY.md`、`memory_summary.md`、`rollout_summaries/*.md`、`extensions/ad_hoc/notes/*.md`（`raw_memories.md` はスキップ — 未整理のフィードのため） | `AGENTS.md`、`AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`、`~/.claude/CLAUDE.local.md`、`~/.claude/MEMORY.md` | `CLAUDE.md`、`CLAUDE.local.md`、`MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`、`~/.cursorrules` | `.cursor/rules/*.mdc`、`.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + Grok のクロスセッションメモリ: `~/.grok/memory/MEMORY.md`、プロジェクトごとの `MEMORY.md`、および `sessions/*.md` サマリー | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md`（WorkBuddy メモリファイル）、`~/.workbuddy/AGENTS.md`、`~/.workbuddy/memory.md`、`~/.config/workbuddy/AGENTS.md`、`~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`、`CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`、`~/.config/antigravity/AGENTS.md`、`~/Library/Application Support/Antigravity/AGENTS.md`（ベストエフォート。文書化されたグローバルメモリストアはまだありません） | `AGENTS.md`、`AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`、`~/.trae/memory/`、`~/.trae/rules/`（`~/.trae-cn` バリアントを含む） | `AGENTS.md`、`.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`、`~/.qoder-cn/rules/`、自動メモリルート `~/.qoder-cn/memory/` と `~/.qoder-cn/projects/*/memory/`（`~/.qoder` バリアントを含む） | `AGENTS.md`、`AGENTS.local.md`、`.qoder/rules/` |

- `source` 引数で単一のツールを選択します。省略すると、設定で有効化されているすべてのソースを実行します。
- `path` 引数は、プロジェクトスコープのファイルに対するワークスペースルートを選択します（デフォルトはセッションワークスペース。ワークスペースファイルは Import workspace files 設定がオンのときのみ読み込まれます）。
- インポートは `$DSH_HOME/storages/dsh-noema-imports.json` の台帳を通じて重複排除されます。台帳はファイルパス + セクション内容をキーとします — 複数のツールが同じプロジェクトの `AGENTS.md` を共有する場合、各セクションはちょうど 1 回だけインポートされます。`force: true` で全件を再インポートします。
- 設定ページには、ソースごとのチェックボックス、起動時インポートのトグル、ファイルサイズ上限、および前回実行のサマリー付きの「今すぐインポート」ボタンがあります。

## 設定

**設定 → Noema メモリ** を開きます:

| 設定 | デフォルト | 説明 |
| --- | --- | --- |
| Enable memory | オン | `noema_*` ツールのマスタースイッチ。 |
| Memory guidance | オン | メモリの使い方を教えるシステムプロンプトセクション。 |
| Start server at boot | オン | 初回使用時ではなく、DSH 起動時にサーバーを起動します。 |
| Auto-accept new memories | オン | `noema_remember` が即座に永続化します。 |
| Server command | `bundled` | バンドルされた `noema-mcp` バイナリ、またはカスタムの実行ファイルパス/コマンド。 |
| Working directory | — | サーバーの cwd（`cargo run` に必要）。 |
| Memory root (NOEMA_ROOT) | — | メモリの保存場所。空の場合 = `~/.agent-memory`。 |
| Recall token budget | 1200 | `noema_recall` のデフォルト `budget_tokens`。 |
| Idle timeout (ms) | 0 | アイドル後にサーバーを停止します。0 = 停止しません。 |
| Keep alive | オン | サーバーがクラッシュまたは終了したときにバックグラウンドで再起動します。 |
| Keep-alive interval (ms) | 5000 | バックグラウンドのヘルスチェック間の最小遅延。 |
| Call timeout (ms) | 30000 | ツール呼び出しごとの期限。 |
| Restart delay (ms) | 1000 | 停止/クラッシュから次の起動までのバックオフ。 |

ステータスカードは再起動/停止のアクション付きでサーバーのヘルスを表示し、インポートセクションが 9 つのメモリソースを管理します。

## ホットリロード

プラグインが一度ロードされると、DSH の HMR 機構をフルに利用できます。

- **ホストプラグイン** — profile patch 内で Cordis HMR エントリを有効にし、その watch root をこのパッケージの `lib/` 出力に向け、`link:` 依存関係を維持します。`npm run build` を実行すると、稼働中の DSH がプラグインエントリを自動的にリロードします（Noema サーバーの子プロセスもリロードにより再起動されます）— サーバーの再起動は不要です。

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **クライアントバンドル** — `npm run build:client` が `lib/client.js` を書き換えます。client-hmr の node 側は各 graph bundle を stat ポーリングし（デフォルト 500ms）、`/plugins/events` SSE チャネル経由で `rebuilt` フレームをブロードキャストし、ブラウザはページをリフレッシュせずにモジュールをホットスワップします。
- **設定** — Noema メモリ設定ページで行った変更はすべて、settings サービスを通じて即座に反映されます。

ホットリロードにできない唯一のことは、起動済みツリーに一度も含まれていなかったプラグインのロードです。稼働中の composition は profile patch レイヤーを監視しておらず（web アプリは `watchUserPatches` を接続していません）、ローダー変更 API も公開していません（プラグインインベントリ RPC は読み取り専用です）。そのため、新しいプラグインにはちょうど 1 回のサーバー再起動が必要で、その後は上記のループが完全にホットになります。

## 開発

```sh
npm install
npm run build     # host tsc + client tsdown bundle
npm test          # build + node --test tests/
```

e2e テストは、`noema/target/debug/noema-mcp` が存在する場合にそれに対して実行されます（存在しない場合はスキップされます）。

## ライセンス

MIT
