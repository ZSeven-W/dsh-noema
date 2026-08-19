<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Bộ nhớ dài hạn cho DeepSeek Harness — bộ nhớ agent bền vững, có thể kiểm tra, được hỗ trợ bởi Noema.</strong><br />
  <sub>Truy Hồi Trước Khi Làm Việc &bull; Nhập Từ 9 Công Cụ Agent &bull; Quản Lý Bộ Nhớ Trên Trang Cài Đặt &bull; Duy Trì Khi Gặp Sự Cố &bull; Tải Lại Nóng</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Phiên bản plugin hiện tại: <code>0.1.0-rc.2</code> · Đã kiểm thử với DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md"><b>Tiếng Việt</b></a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — trang cài đặt bộ nhớ" width="100%" />
</p>
<p align="center"><sub>Trang cài đặt Noema Memory — nguồn nhập, quản lý bộ nhớ và trạng thái máy chủ trực tiếp</sub></p>

## Tại sao DSH Noema

DSH Noema kết nối [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) với [Noema](https://github.com/ZSeven-W/noema) — một hệ thống bộ nhớ ưu tiên cục bộ, phi vector dành cho các coding agent — để một Agent giữ lại tri thức bền vững xuyên suốt các phiên làm việc thay vì bắt đầu mỗi cuộc trò chuyện từ con số không.

<table>
<tr>
<td width="50%">

### 🧠 Truy Hồi Bền Vững

Ký ức được lưu trữ dưới dạng các tệp Markdown có thể kiểm tra trong `NOEMA_ROOT` (mặc định `~/.agent-memory/`). `noema_recall` nạp ngữ cảnh liên quan khi bắt đầu phiên; `noema_search`, `noema_browse`, `noema_catalog` và `noema_recall_graph` phụ trách tra cứu, khám phá và kiểm toán.

</td>
<td width="50%">

### 📥 Nhập Từ Các Công Cụ Khác

`noema_import` đọc các tệp bộ nhớ của mười công cụ AI coding khác — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes — chia chúng thành các phần và lưu mỗi phần như một ký ức bền vững. Một sổ cái khóa theo nội dung sẽ khử trùng lặp giữa các lần chạy và giữa các công cụ dùng chung tệp.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Quản Lý Trên Trang Cài Đặt

Trang cài đặt Noema Memory cấu hình lệnh máy chủ, thư mục gốc bộ nhớ, ngân sách, thời gian chờ rảnh/gọi, và phần hướng dẫn — đồng thời một thẻ Manage memories cho phép tìm kiếm, duyệt, thêm, xem xét và xóa trực tiếp các ký ức đã lưu.

</td>
<td width="50%">

### 🩺 Duy Trì Hoạt Động

Máy chủ bộ nhớ luôn hoạt động: thời gian chờ rảnh mặc định là không bao giờ, và một vòng lặp duy trì sẽ khởi động lại tiến trình con `noema-mcp` trong nền khi nó gặp sự cố hoặc thoát, với khoảng kiểm tra và độ trễ khởi động lại có thể cấu hình.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Trích Xuất Thực Thể Thông Minh

Công cụ trích xuất của Noema kết hợp phân tách từ jieba với các tín hiệu độ chính xác cao — danh từ riêng tiếng Anh, tên và thuật ngữ kỹ thuật CJK, chủ đề trong dấu ngoặc kép và sự lặp lại — cùng với bộ lọc stopword và đường dẫn, giúp danh mục chủ đề PageIndex luôn sạch sẽ.

</td>
<td width="50%">

### ⚡ Tải Lại Nóng

Sau lần khởi động đầu tiên, plugin không bao giờ cần khởi động lại: `pnpm run build` tải lại nóng plugin host qua Cordis HMR, và `ppnpm run build:client` hoán đổi nóng gói trình duyệt qua kênh SSE client-hmr.

</td>
</tr>
</table>

## Cài đặt vào DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Hoặc, để phát triển cục bộ trực tiếp từ cây mã nguồn:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

Giao thức `link:` tạo symlink phụ thuộc profile đến kho lưu trữ này, nhờ đó các lần build lại được nhìn thấy ngay lập tức và Cordis HMR có thể theo dõi đầu ra đã biên dịch.

Plugin đóng gói nhị phân `noema-mcp` thông qua các gói npm tùy chọn theo từng nền tảng. Để tự build thay thế, hãy chạy `cargo build --release -p noema-mcp` bên trong submodule `noema` đi kèm, hoặc trỏ cài đặt Server command tới bất kỳ bản build `noema-mcp` nào.

## Công Cụ Bộ Nhớ

Các công cụ dành cho mô hình phản ánh bề mặt Noema MCP:

| Công cụ | Chức năng |
| --- | --- |
| `noema_recall` | Truy hồi các ký ức liên quan cho một truy vấn, kèm ngân sách token. |
| `noema_search` | Tìm kiếm toàn văn trên các ký ức đã lưu. |
| `noema_browse` | Duyệt danh mục PageIndex theo chủ đề hoặc thực thể. |
| `noema_catalog` | Hiển thị toàn bộ danh mục ký ức dưới dạng markdown. |
| `noema_recall_graph` | Truy hồi nhiều bước qua các liên kết và thực thể dùng chung. |
| `noema_neighbors` | Một bước đồ thị từ một ký ức. |
| `noema_explain` | Giải thích vì sao một ký ức được hoặc không được truy hồi. |
| `noema_remember` | Lưu một sự kiện, quyết định, ràng buộc hoặc sở thích bền vững. |
| `noema_review_list` | Liệt kê các ứng viên đang chờ xem xét. |
| `noema_review_decide` | Chấp nhận, từ chối, chỉnh sửa hoặc gộp một ứng viên. |
| `noema_forget` | Đánh dấu xóa (tombstone) hoặc xóa vĩnh viễn một ký ức. |
| `noema_policy_get` / `noema_policy_set` | Đọc hoặc cập nhật chính sách ghi. |
| `noema_status` | Trạng thái máy chủ và tenant: số lượng, tình trạng chỉ mục, thư mục gốc lưu trữ. |
| `noema_import` | Nhập ký ức từ các công cụ AI coding khác. |

Mỗi công cụ trả về một lớp bọc đồng nhất `{ ok, tool, text }` trong đó `text` chứa toàn bộ đầu ra của máy chủ.

## Nhập ký ức từ các công cụ khác

| ID nguồn | Tệp toàn cục | Tệp workspace |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + quy trình bộ nhớ Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` bị bỏ qua — đây là nguồn chưa được tinh lọc) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + bộ nhớ xuyên phiên của Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` theo từng dự án, và các bản tóm tắt `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (tệp bộ nhớ WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (nỗ lực tối đa; chưa có kho bộ nhớ toàn cục được ghi nhận) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (cộng với các biến thể `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, các thư mục gốc bộ nhớ tự động `~/.qoder-cn/memory/` và `~/.qoder-cn/projects/*/memory/` (cộng với các biến thể `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) và tệp toàn cục `~/.hermes/SOUL.md` | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- Đối số `source` chọn một công cụ, hoặc bỏ qua để chạy mọi nguồn đã được bật trong cài đặt.
- Đối số `path` chọn thư mục gốc workspace cho các tệp theo phạm vi dự án (mặc định là workspace của phiên; các tệp workspace chỉ được nạp khi cài đặt Import workspace files được bật).
- Các lần nhập được khử trùng lặp thông qua sổ cái tại `$DSH_HOME/storages/dsh-noema-imports.json`, khóa theo đường dẫn tệp + nội dung phần — khi nhiều công cụ dùng chung một `AGENTS.md` của dự án, mỗi phần chỉ được nhập đúng một lần. `force: true` sẽ nhập lại toàn bộ.
- Trang cài đặt cung cấp các ô chọn theo từng nguồn, một nút bật nhập khi khởi động, một giới hạn kích thước tệp và một nút Import now kèm tóm tắt lần chạy gần nhất.

## Cấu hình

Mở **Settings → Noema Memory**:

| Cài đặt | Mặc định | Ý nghĩa |
| --- | --- | --- |
| Enable memory | on | Công tắc chính cho các công cụ `noema_*`. |
| Memory guidance | on | Phần system-prompt hướng dẫn cách dùng bộ nhớ. |
| Start server at boot | on | Khởi động khi DSH bắt đầu thay vì khi dùng lần đầu. |
| Auto-accept new memories | on | `noema_remember` lưu ngay lập tức. |
| Server command | `bundled` | Nhị phân `noema-mcp` đi kèm hoặc đường dẫn/lệnh thực thi tùy chỉnh. |
| Working directory | — | cwd cho máy chủ (cần cho `cargo run`). |
| Memory root (NOEMA_ROOT) | — | Nơi lưu trữ ký ức; để trống = `~/.agent-memory`. |
| Recall token budget | 1200 | `budget_tokens` mặc định cho `noema_recall`. |
| Idle timeout (ms) | 0 | Dừng máy chủ sau thời gian rảnh; 0 = không bao giờ. |
| Keep alive | on | Khởi động lại máy chủ trong nền khi nó gặp sự cố hoặc thoát. |
| Keep-alive interval (ms) | 5000 | Độ trễ tối thiểu giữa các lần kiểm tra sức khỏe nền. |
| Call timeout (ms) | 30000 | Hạn chót cho mỗi lần gọi công cụ. |
| Restart delay (ms) | 1000 | Độ lùi giữa một lần dừng/sự cố và lần khởi động tiếp theo. |

Thẻ trạng thái hiển thị tình trạng máy chủ cùng các hành động khởi động lại/dừng, và phần nhập quản lý chín nguồn bộ nhớ.

## Tải lại nóng

Cơ chế HMR của DSH có thể dùng đầy đủ sau khi plugin đã được nạp một lần:

- **Host plugin** — bật mục Cordis HMR trong bản vá profile với watch root trỏ tới đầu ra `lib/` của gói này, và giữ phụ thuộc `link:`. Chạy `pnpm run build` và DSH đang chạy sẽ tự động tải lại mục plugin (tiến trình con máy chủ Noema được khởi động lại bởi lần tải lại) — không cần khởi động lại máy chủ.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Client bundle** — `ppnpm run build:client` ghi lại `lib/client.js`; nửa node của client-hmr định kỳ stat-poll mọi graph bundle (mặc định 500ms) và phát một khung `rebuilt` qua kênh SSE `/plugins/events`, và trình duyệt hoán đổi nóng mô-đun mà không cần tải lại trang.
- **Settings** — mọi thay đổi trên trang cài đặt Noema Memory được áp dụng ngay lập tức thông qua dịch vụ cài đặt.

Điều duy nhất mà tải lại nóng không thể làm là nạp một plugin chưa từng nằm trong cây đã khởi động: thành phần đang chạy không theo dõi lớp bản vá profile (ứng dụng web không nối `watchUserPatches`) cũng như không cung cấp API biến đổi bộ nạp (RPC kho plugin là chỉ đọc). Do đó, một plugin mới cần đúng một lần khởi động lại máy chủ, sau đó vòng lặp ở trên hoàn toàn là nóng.

## Phát triển

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

Bài kiểm thử e2e chạy với `noema/target/debug/noema-mcp` khi có mặt (nếu không sẽ bị bỏ qua).

## Giấy phép

MIT
