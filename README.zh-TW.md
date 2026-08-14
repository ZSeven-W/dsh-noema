<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>DeepSeek Harness 的長期記憶 —— 由 Noema 支持的持久、可檢查的代理記憶。</strong><br />
  <sub>工作前召回 &bull; 從 9 種代理工具匯入 &bull; 設定頁記憶管理 &bull; 崩潰保活 &bull; 熱重載</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · 目前外掛程式版本：<code>0.1.0-rc.1</code> · 已通過 DSH <code>0.1.0-rc.6</code> 測試</sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md"><b>繁體中文</b></a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

## 為什麼選擇 DSH Noema

DSH Noema 將 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 與 [Noema](https://github.com/ZSeven-W/noema) —— 一個面向編碼代理的本地優先、非向量記憶系統 —— 連接起來，讓代理能夠跨工作階段保留持久知識，而不是每次對話都從零開始。

<table>
<tr>
<td width="50%">

### 🧠 持久召回

記憶以可檢查的 Markdown 檔案形式持久化儲存在 `NOEMA_ROOT` 下（預設 `~/.agent-memory/`）。`noema_recall` 在工作階段開始時載入相關上下文；`noema_search`、`noema_browse`、`noema_catalog` 和 `noema_recall_graph` 涵蓋查詢、探索與稽核。

</td>
<td width="50%">

### 📥 從其他工具匯入

`noema_import` 讀取其他九種 AI 編碼工具的記憶檔案 —— Codex、Claude Code、opencode、Cursor、Grok、WorkBuddy、Antigravity、Trae、Qoder —— 將其拆分為小節，並把每一節儲存為一條持久記憶。以內容為鍵的帳本會在多次執行之間以及共用檔案的各種工具之間去除重複。

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ 設定頁管理

Noema Memory 設定頁可設定伺服器指令、記憶根目錄、預算、閒置/呼叫逾時以及引導說明區塊 —— 而 Manage memories 卡片可直接搜尋、瀏覽、新增、審核和刪除已儲存的記憶。

</td>
<td width="50%">

### 🩺 保活

記憶伺服器保持運行：閒置逾時預設為永不逾時，保活迴圈會在 `noema-mcp` 子程序崩潰或退出時於背景重新啟動它，檢查間隔和重新啟動退避皆可設定。

</td>
</tr>
<tr>
<td width="50%">

### 🔍 智慧實體抽取

Noema 的抽取引擎將 jieba 斷詞與高精度訊號 —— 英文專有名詞、CJK 名稱與技術術語、加上引號的主題以及重複出現 —— 相結合，並搭配停用詞與路徑篩選，使 PageIndex 主題目錄保持乾淨。

</td>
<td width="50%">

### ⚡ 熱重載

首次啟動後，外掛程式就再也無需重新啟動：`npm run build` 透過 Cordis HMR 熱重載主機外掛程式，`npm run build:client` 則透過 client-hmr 的 SSE 通道熱替換瀏覽器套件。

</td>
</tr>
</table>

## 安裝到 DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

或者，直接從原始碼樹進行本地開發：

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` 通訊協定會將 profile 的相依項目符號連結到此存放庫，因此重新建置的結果立即可見，Cordis HMR 也能監看編譯後的輸出。

此外掛程式透過各平台的可選 npm 套件捆綁 `noema-mcp` 二進位檔。若要自行建置，可在捆綁的 `noema` 子模組中執行 `cargo build --release -p noema-mcp`，或將 Server command 設定指向任意 `noema-mcp` 建置產物。

## 記憶工具

面向模型的工具與 Noema MCP 介面一一對應：

| 工具 | 作用 |
| --- | --- |
| `noema_recall` | 針對查詢召回相關記憶，可指定 token 預算。 |
| `noema_search` | 對已儲存的記憶進行全文搜尋。 |
| `noema_browse` | 按主題或實體瀏覽 PageIndex 目錄。 |
| `noema_catalog` | 將完整記憶目錄渲染為 markdown。 |
| `noema_recall_graph` | 透過連結與共用實體進行多跳召回。 |
| `noema_neighbors` | 從某條記憶出發進行一跳圖走訪。 |
| `noema_explain` | 解釋某條記憶為何被召回或未被召回。 |
| `noema_remember` | 儲存持久的事實、決策、約束或偏好。 |
| `noema_review_list` | 列出待審核的候選項目。 |
| `noema_review_decide` | 接受、拒絕、編輯或合併候選項目。 |
| `noema_forget` | 將記憶標記刪除或硬刪除。 |
| `noema_policy_get` / `noema_policy_set` | 讀取或更新寫入策略。 |
| `noema_status` | 伺服器與租用戶狀態：計數、索引健康度、儲存根目錄。 |
| `noema_import` | 從其他 AI 編碼工具匯入記憶。 |

每個工具都會傳回統一的封裝結構 `{ ok, tool, text }`，其中 `text` 承載伺服器的完整輸出。

## 從其他工具匯入記憶

| 來源 id | 全域檔案 | 工作區檔案 |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + Codex 記憶管線：`~/.codex/memories/MEMORY.md`、`memory_summary.md`、`rollout_summaries/*.md`、`extensions/ad_hoc/notes/*.md`（跳過 `raw_memories.md` —— 它是未經整理的原始輸入） | `AGENTS.md`、`AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`、`~/.claude/CLAUDE.local.md`、`~/.claude/MEMORY.md` | `CLAUDE.md`、`CLAUDE.local.md`、`MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`、`~/.cursorrules` | `.cursor/rules/*.mdc`、`.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + Grok 跨工作階段記憶：`~/.grok/memory/MEMORY.md`、每個專案的 `MEMORY.md` 以及 `sessions/*.md` 摘要 | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md`（WorkBuddy 記憶檔案）、`~/.workbuddy/AGENTS.md`、`~/.workbuddy/memory.md`、`~/.config/workbuddy/AGENTS.md`、`~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`、`CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`、`~/.config/antigravity/AGENTS.md`、`~/Library/Application Support/Antigravity/AGENTS.md`（盡力而為；目前尚無文件化的全域記憶儲存） | `AGENTS.md`、`AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`、`~/.trae/memory/`、`~/.trae/rules/`（以及 `~/.trae-cn` 變體） | `AGENTS.md`、`.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`、`~/.qoder-cn/rules/`、自動記憶根目錄 `~/.qoder-cn/memory/` 和 `~/.qoder-cn/projects/*/memory/`（以及 `~/.qoder` 變體） | `AGENTS.md`、`AGENTS.local.md`、`.qoder/rules/` |

- `source` 參數用於選擇某個工具，省略它則會執行設定中啟用的所有來源。
- `path` 參數用於選擇專案級檔案的工作區根目錄（預設使用工作階段工作區；只有在開啟 Import workspace files 設定時，工作區檔案才會被載入）。
- 匯入透過位於 `$DSH_HOME/storages/dsh-noema-imports.json` 的帳本去除重複，以檔案路徑 + 小節內容為鍵 —— 當多個工具共用同一個專案 `AGENTS.md` 時，每個小節只會匯入一次。`force: true` 會重新匯入全部內容。
- 設定頁提供每個來源的核取方塊、啟動時匯入開關、檔案大小上限，以及一個帶有上次執行摘要的 Import now 按鈕。

## 設定

開啟 **設定 → Noema Memory**：

| 設定 | 預設值 | 含義 |
| --- | --- | --- |
| Enable memory | on | `noema_*` 工具的總開關。 |
| Memory guidance | on | 系統提示詞中教授記憶用法的部分。 |
| Start server at boot | on | 在 DSH 啟動時啟動，而非首次使用時才啟動。 |
| Auto-accept new memories | on | `noema_remember` 立即持久化。 |
| Server command | `bundled` | 捆綁的 `noema-mcp` 二進位檔或自訂可執行檔路徑/指令。 |
| Working directory | — | 伺服器的工作目錄（執行 `cargo run` 時需要）。 |
| Memory root (NOEMA_ROOT) | — | 記憶的儲存位置；留空 = `~/.agent-memory`。 |
| Recall token budget | 1200 | `noema_recall` 的預設 `budget_tokens`。 |
| Idle timeout (ms) | 0 | 閒置後停止伺服器；0 = 永不停止。 |
| Keep alive | on | 伺服器崩潰或退出時於背景重新啟動。 |
| Keep-alive interval (ms) | 5000 | 背景健康檢查之間的最小間隔。 |
| Call timeout (ms) | 30000 | 每次工具呼叫的逾時時間。 |
| Restart delay (ms) | 1000 | 停止/崩潰與下次啟動之間的退避時間。 |

狀態卡片會顯示伺服器健康狀態，並提供重新啟動/停止操作；匯入區塊用於管理九個記憶來源。

## 熱重載

外掛程式載入過一次之後，DSH 的 HMR 機制即可完全使用：

- **主機外掛程式** —— 在 profile patch 中啟用 Cordis HMR 項目，並將其監看根目錄指向本套件的 `lib/` 輸出目錄，同時保留 `link:` 相依項目。執行 `npm run build` 後，正在執行的 DSH 會自動重載外掛程式入口（重載會重新啟動 Noema 伺服器子程序）—— 無需重新啟動伺服器。

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **用戶端套件** —— `npm run build:client` 會重寫 `lib/client.js`；client-hmr 的 node 端會輪詢每個 graph 套件的 stat（預設 500ms），並透過 `/plugins/events` SSE 通道廣播 `rebuilt` 幀，瀏覽器便可在不重新整理頁面的情況下熱替換模組。
- **設定** —— 在 Noema Memory 設定頁上所做的每項更改都會透過設定服務即時生效。

熱重載唯一做不到的是載入一個從未出現在啟動樹中的外掛程式：執行中的組合既不監看 profile patch 層（Web 應用未接入 `watchUserPatches`），也不暴露載入器變更 API（外掛程式清單 RPC 是唯讀的）。因此，一個全新的外掛程式恰好需要重新啟動伺服器一次，之後上述迴圈便完全可熱重載。

## 開發

```sh
npm install
npm run build     # host tsc + client tsdown bundle
npm test          # build + node --test tests/
```

e2e 測試會在存在 `noema/target/debug/noema-mcp` 時針對它執行（否則會被跳過）。

## 授權條款

MIT
