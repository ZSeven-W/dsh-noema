<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>หน่วยความจำระยะยาวสำหรับ DeepSeek Harness — หน่วยความจำเอเจนต์ที่คงทนและตรวจสอบได้ ซึ่งขับเคลื่อนโดย Noema</strong><br />
  <sub>เรียกคืนก่อนทำงาน &bull; นำเข้าจากเครื่องมือเอเจนต์ 9 ตัว &bull; จัดการหน่วยความจำผ่านหน้าตั้งค่า &bull; รักษาสถานะหลังครัช &bull; รีโหลดอัตโนมัติ</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · ปลั๊กอินรุ่นปัจจุบัน: <code>0.1.0-rc.1</code> · ทดสอบกับ DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md"><b>ไทย</b></a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

## ทำไมต้อง DSH Noema

DSH Noema เชื่อมต่อ [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) เข้ากับ [Noema](https://github.com/ZSeven-W/noema) — ระบบหน่วยความจำแบบ local-first ที่ไม่ใช้เวกเตอร์สำหรับเอเจนต์เขียนโค้ด — เพื่อให้เอเจนต์เก็บความรู้ที่คงทนข้ามเซสชัน แทนที่จะเริ่มบทสนทนาทุกครั้งจากศูนย์

<table>
<tr>
<td width="50%">

### 🧠 การเรียกคืนที่คงทน

หน่วยความจำถูกจัดเก็บเป็นไฟล์ Markdown ที่ตรวจสอบได้ภายใต้ `NOEMA_ROOT` (ค่าเริ่มต้น `~/.agent-memory/`) `noema_recall` โหลดบริบทที่เกี่ยวข้องเมื่อเริ่มเซสชัน; `noema_search`, `noema_browse`, `noema_catalog` และ `noema_recall_graph` ครอบคลุมการค้นหา การสำรวจ และการตรวจสอบ

</td>
<td width="50%">

### 📥 นำเข้าจากเครื่องมืออื่น

`noema_import` อ่านไฟล์หน่วยความจำของเครื่องมือเขียนโค้ด AI อีกเก้าตัว — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder — แบ่งเป็นส่วนๆ และบันทึกแต่ละส่วนเป็นหน่วยความจำที่คงทน บัญชีแยกประเภทที่ใช้คีย์จากเนื้อหาจะกำจัดรายการซ้ำทั้งระหว่างการรันและระหว่างเครื่องมือที่ใช้ไฟล์ร่วมกัน

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ จัดการผ่านหน้าตั้งค่า

หน้าการตั้งค่า Noema Memory ใช้กำหนดค่าคำสั่งเซิร์ฟเวอร์ รูทของหน่วยความจำ งบประมาณ ระยะหมดเวลาว่าง/เรียกใช้ และส่วนคำแนะนำ — และการ์ด Manage memories ใช้ค้นหา เรียกดู เพิ่ม ตรวจทาน และลบหน่วยความจำที่เก็บไว้ได้โดยตรง

</td>
<td width="50%">

### 🩺 การรักษาสถานะ

เซิร์ฟเวอร์หน่วยความจำยังคงทำงานอยู่เสมอ: ระยะหมดเวลาว่างมีค่าเริ่มต้นเป็นไม่ปิด และลูป keep-alive จะรีสตาร์ตโพรเซสลูก `noema-mcp` ในเบื้องหลังเมื่อมันครัชหรือออก โดยมีช่วงตรวจสอบและระยะถอยหลังในการรีสตาร์ตที่กำหนดค่าได้

</td>
</tr>
<tr>
<td width="50%">

### 🔍 การสกัดเอนทิตี้อัจฉริยะ

เอ็นจินการสกัดของ Noema ผสานการตัดคำ jieba เข้ากับสัญญาณความแม่นยำสูง — คำนามเฉพาะภาษาอังกฤษ ชื่อและศัพท์เทคนิค CJK หัวข้อในเครื่องหมายคำพูด และการซ้ำ — พร้อมตัวกรองคำหยุดและพาธ เพื่อให้แคตตาล็อกหัวข้อ PageIndex สะอาดอยู่เสมอ

</td>
<td width="50%">

### ⚡ รีโหลดอัตโนมัติ

หลังการบูตครั้งแรก ปลั๊กอินไม่จำเป็นต้องรีสตาร์ตอีกเลย: `pnpm run build` รีโหลดปลั๊กอินโฮสต์แบบอัตโนมัติผ่าน Cordis HMR และ `ppnpm run build:client` สลับชุดบันเดิลเบราว์เซอร์แบบอัตโนมัติผ่านช่องทาง client-hmr SSE

</td>
</tr>
</table>

## ติดตั้งลงใน DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

หรือสำหรับการพัฒนาท้องถิ่นโดยตรงจากซอร์ส:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

โปรโตคอล `link:` สร้างซิมลิงก์จากไฟล์ dependency ของโปรไฟล์ไปยังรีโพนี้ ทำให้ผลลัพธ์การ build ใหม่เห็นได้ทันที และ Cordis HMR เฝ้าดูผลลัพธ์ที่คอมไพล์แล้วได้

ปลั๊กอินรวมไบนารี `noema-mcp` ผ่านแพ็กเกจ npm แบบออปชันนัลแยกตามแพลตฟอร์ม หากต้องการ build เอง ให้รัน `cargo build --release -p noema-mcp` ภายในซับโมดูล `noema` ที่รวมมาด้วย หรือชี้การตั้งค่า Server command ไปยัง build ของ `noema-mcp` ใดก็ได้

## เครื่องมือหน่วยความจำ

เครื่องมือที่หันเข้าหาโมเดลสะท้อนพื้นผิว Noema MCP:

| เครื่องมือ | หน้าที่ |
| --- | --- |
| `noema_recall` | เรียกคืนหน่วยความจำที่เกี่ยวข้องกับคำค้น พร้อมงบประมาณ token |
| `noema_search` | ค้นหาแบบ full-text บนหน่วยความจำที่เก็บไว้ |
| `noema_browse` | เรียกดูแคตตาล็อก PageIndex สำหรับหัวข้อหรือเอนทิตี |
| `noema_catalog` | แสดงแคตตาล็อกหน่วยความจำทั้งหมดเป็น markdown |
| `noema_recall_graph` | เรียกคืนแบบหลายฮอปผ่านลิงก์และเอนทิตีที่ใช้ร่วมกัน |
| `noema_neighbors` | กระโดดหนึ่งฮอปในกราฟจากหน่วยความจำหนึ่ง |
| `noema_explain` | อธิบายว่าทำไมหน่วยความจำหนึ่งจึงถูกหรือไม่ถูกเรียกคืน |
| `noema_remember` | บันทึกข้อเท็จจริง การตัดสินใจ ข้อจำกัด หรือความต้องการที่คงทน |
| `noema_review_list` | แสดงรายการผู้สมัครที่รอการตรวจทาน |
| `noema_review_decide` | ยอมรับ ปฏิเสธ แก้ไข หรือรวมผู้สมัคร |
| `noema_forget` | ทำเครื่องหมาย tombstone หรือลบถาวรหน่วยความจำ |
| `noema_policy_get` / `noema_policy_set` | อ่านหรืออัปเดตนโยบายการเขียน |
| `noema_status` | สถานะเซิร์ฟเวอร์และเทแนนต์: จำนวน สุขภาพดัชนี รูทที่เก็บ |
| `noema_import` | นำเข้าหน่วยความจำจากเครื่องมือเขียนโค้ด AI อื่น |

เครื่องมือแต่ละตัวคืนค่าซองจดหมายรูปแบบเดียวกัน `{ ok, tool, text }` โดยที่ `text` บรรจุผลลัพธ์ทั้งหมดจากเซิร์ฟเวอร์

## นำเข้าหน่วยความจำจากเครื่องมืออื่น

| ไอดีแหล่งที่มา | ไฟล์ส่วนกลาง | ไฟล์ในพื้นที่ทำงาน |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + ไปป์ไลน์หน่วยความจำ Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (ข้าม `raw_memories.md` — เป็นฟีดที่ยังไม่คัดกรอง) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + หน่วยความจำข้ามเซสชันของ Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` ต่อโปรเจกต์ และสรุป `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (ไฟล์หน่วยความจำ WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (ทำเท่าที่ทำได้; ยังไม่มีที่เก็บหน่วยความจำส่วนกลางที่ระบุเป็นเอกสาร) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (รวมถึงตัวแปร `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, รูทหน่วยความจำอัตโนมัติ `~/.qoder-cn/memory/` และ `~/.qoder-cn/projects/*/memory/` (รวมถึงตัวแปร `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |

- อาร์กิวเมนต์ `source` เลือกเครื่องมือหนึ่งตัว หรือละไว้เพื่อรันทุกแหล่งที่เปิดใช้งานในการตั้งค่า
- อาร์กิวเมนต์ `path` เลือกรูทของพื้นที่ทำงานสำหรับไฟล์ที่อยู่ในขอบเขตโปรเจกต์ (ค่าเริ่มต้นคือพื้นที่ทำงานของเซสชัน; ไฟล์ในพื้นที่ทำงานจะโหลดเฉพาะเมื่อเปิดการตั้งค่า Import workspace files)
- การนำเข้าถูกกำจัดรายการซ้ำผ่านบัญชีแยกประเภทที่ `$DSH_HOME/storages/dsh-noema-imports.json` โดยใช้คีย์พาธไฟล์ + เนื้อหาส่วน — เมื่อหลายเครื่องมือใช้ `AGENTS.md` ของโปรเจกต์เดียวกัน แต่ละส่วนจะถูกนำเข้าเพียงครั้งเดียว `force: true` นำเข้าทุกอย่างใหม่ทั้งหมด
- หน้าการตั้งค่าแสดงช่องทำเครื่องหมายแยกตามแหล่ง ปุ่มสลับนำเข้าเมื่อเริ่มต้น ขีดจำกัดขนาดไฟล์ และปุ่ม Import now พร้อมสรุปการรันครั้งล่าสุด

## การตั้งค่า

เปิด **การตั้งค่า → Noema Memory**:

| การตั้งค่า | ค่าเริ่มต้น | ความหมาย |
| --- | --- | --- |
| Enable memory | on | สวิตช์หลักสำหรับเครื่องมือ `noema_*` |
| Memory guidance | on | ส่วน system-prompt ที่สอนการใช้งานหน่วยความจำ |
| Start server at boot | on | เริ่มเมื่อ DSH เริ่ม แทนที่จะรอใช้ครั้งแรก |
| Auto-accept new memories | on | `noema_remember` บันทึกถาวรทันที |
| Server command | `bundled` | ไบนารี `noema-mcp` ที่รวมมา หรือพาธ/คำสั่งของโปรแกรมที่กำหนดเอง |
| Working directory | — | cwd สำหรับเซิร์ฟเวอร์ (จำเป็นสำหรับ `cargo run`) |
| Memory root (NOEMA_ROOT) | — | ตำแหน่งเก็บหน่วยความจำ; เว้นว่าง = `~/.agent-memory` |
| Recall token budget | 1200 | ค่า `budget_tokens` เริ่มต้นสำหรับ `noema_recall` |
| Idle timeout (ms) | 0 | หยุดเซิร์ฟเวอร์เมื่อว่าง; 0 = ไม่หยุด |
| Keep alive | on | รีสตาร์ตเซิร์ฟเวอร์ในเบื้องหลังเมื่อมันครัชหรือออก |
| Keep-alive interval (ms) | 5000 | หน่วงเวลาต่ำสุดระหว่างการตรวจสุขภาพในเบื้องหลัง |
| Call timeout (ms) | 30000 | กำหนดเวลาเส้นตายต่อการเรียกเครื่องมือ |
| Restart delay (ms) | 1000 | ระยะถอยหลังระหว่างการหยุด/ครัชกับการเริ่มครั้งถัดไป |

การ์ดสถานะแสดงสุขภาพของเซิร์ฟเวอร์พร้อมการกระทำรีสตาร์ต/หยุด และส่วนนำเข้าจัดการแหล่งหน่วยความจำทั้งเก้า

## การรีโหลดอัตโนมัติ

กลไก HMR ของ DSH ใช้งานได้เต็มรูปแบบเมื่อปลั๊กอินถูกโหลดแล้วหนึ่งครั้ง:

- **ปลั๊กอินโฮสต์** — เปิดรายการ Cordis HMR ใน patch ของโปรไฟล์ โดยให้ watch root ชี้ไปที่ผลลัพธ์ `lib/` ของแพ็กเกจนี้ และคง dependency `link:` ไว้ รัน `pnpm run build` แล้ว DSH ที่กำลังทำงานจะรีโหลดรายการปลั๊กอินโดยอัตโนมัติ (โพรเซสลูกเซิร์ฟเวอร์ Noema ถูกเริ่มใหม่โดยการรีโหลด) — ไม่ต้องรีสตาร์ตเซิร์ฟเวอร์

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **บันเดิลฝั่งไคลเอนต์** — `ppnpm run build:client` เขียน `lib/client.js` ใหม่; ครึ่งโหนดของ client-hmr ทำ stat-poll บันเดิลกราฟทุกรายการ (ค่าเริ่มต้น 500ms) และกระจายเฟรม `rebuilt` ผ่านช่อง SSE `/plugins/events` จากนั้นเบราว์เซอร์สลับโมดูลแบบอัตโนมัติโดยไม่ต้องรีเฟรชหน้า
- **การตั้งค่า** — ทุกการเปลี่ยนแปลงที่ทำในหน้าการตั้งค่า Noema Memory มีผลทันทีผ่านบริการการตั้งค่า

สิ่งเดียวที่การรีโหลดอัตโนมัติทำไม่ได้คือการโหลดปลั๊กอินที่ไม่เคยอยู่ในทรีที่บูต: คอมโพสิชันที่กำลังทำงานไม่เฝ้าดูเลเยอร์ patch ของโปรไฟล์ (เว็บแอปไม่ได้ต่อ `watchUserPatches`) และไม่เปิดเผย API กลายพันธุ์ตัวโหลด (RPC ของคลังปลั๊กอินเป็นแบบอ่านอย่างเดียว) ปลั๊กอินใหม่จึงต้องรีสตาร์ตเซิร์ฟเวอร์เพียงหนึ่งครั้ง หลังจากนั้นลูปข้างต้นก็รีโหลดอัตโนมัติเต็มรูปแบบ

## การพัฒนา

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

การทดสอบ e2e รันกับ `noema/target/debug/noema-mcp` เมื่อมีไฟล์อยู่ (มิฉะนั้นจะถูกข้าม)

## ใบอนุญาต

MIT
