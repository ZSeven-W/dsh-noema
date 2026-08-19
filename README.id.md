<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Memori jangka panjang untuk DeepSeek Harness — memori agen yang tahan lama dan dapat diperiksa, didukung oleh Noema.</strong><br />
  <sub>Recall Sebelum Bekerja &bull; Impor Dari 9 Alat Agen &bull; Pengelolaan Memori di Halaman Pengaturan &bull; Tetap Hidup Saat Crash &bull; Muat Ulang Panas</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Rilis plugin saat ini: <code>0.1.0-rc.1</code> · Diuji dengan DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md"><b>Bahasa Indonesia</b></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — halaman pengaturan memori" width="100%" />
</p>
<p align="center"><sub>Halaman pengaturan Noema Memory — sumber impor, pengelolaan memori, dan status server langsung</sub></p>

## Mengapa DSH Noema

DSH Noema menghubungkan [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) dengan [Noema](https://github.com/ZSeven-W/noema) — sebuah sistem memori non-vektor yang mengutamakan lokal untuk agen coding — sehingga sebuah Agen menyimpan pengetahuan yang tahan lama lintas sesi alih-alih memulai setiap percakapan dari nol.

<table>
<tr>
<td width="50%">

### 🧠 Recall Tahan Lama

Memori tersimpan sebagai berkas Markdown yang dapat diperiksa di bawah `NOEMA_ROOT` (bawaan `~/.agent-memory/`). `noema_recall` memuat konteks yang relevan di awal sesi; `noema_search`, `noema_browse`, `noema_catalog`, dan `noema_recall_graph` menangani pencarian, penjelajahan, dan audit.

</td>
<td width="50%">

### 📥 Impor Dari Alat Lain

`noema_import` membaca berkas memori sepuluh alat coding AI lainnya — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes — membaginya menjadi beberapa bagian, dan menyimpan setiap bagian sebagai memori yang tahan lama. Sebuah buku besar berkunci konten menghapus duplikasi lintas proses dan lintas alat yang berbagi berkas.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Pengelolaan di Halaman Pengaturan

Halaman pengaturan Noema Memory mengonfigurasi perintah server, akar memori, anggaran, batas waktu idle/panggilan, dan bagian panduan — serta sebuah kartu Manage memories mencari, menjelajah, menambah, meninjau, dan menghapus memori tersimpan secara langsung.

</td>
<td width="50%">

### 🩺 Tetap Hidup

Server memori tetap berjalan: batas waktu idle secara bawaan tidak pernah, dan sebuah loop keep-alive memulai ulang proses anak `noema-mcp` di latar belakang ketika ia crash atau keluar, dengan interval pemeriksaan dan backoff pemulaian ulang yang dapat dikonfigurasi.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Ekstraksi Entitas Cerdas

Mesin ekstraksi Noema menggabungkan segmentasi kata jieba dengan sinyal presisi tinggi — kata benda proper bahasa Inggris, nama dan istilah teknis CJK, topik dalam tanda kutip, dan pengulangan — dengan filter stopword dan jalur, sehingga katalog topik PageIndex tetap bersih.

</td>
<td width="50%">

### ⚡ Muat Ulang Panas

Setelah boot pertama, plugin tidak pernah perlu dimulai ulang lagi: `pnpm run build` memuat ulang panas plugin host melalui Cordis HMR, dan `ppnpm run build:client` menukar panas bundel browser melalui kanal SSE client-hmr.

</td>
</tr>
</table>

## Memasang ke DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Atau, untuk pengembangan lokal langsung dari pohon sumber:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

Protokol `link:` membuat symlink dependensi profil ke repositori ini, sehingga build ulang langsung terlihat dan Cordis HMR dapat memantau keluaran yang telah dikompilasi.

Plugin membundel biner `noema-mcp` melalui paket npm opsional per platform. Untuk membangunnya sendiri, jalankan `cargo build --release -p noema-mcp` di dalam submodul `noema` yang dibundel, atau arahkan pengaturan Server command ke build `noema-mcp` mana pun.

## Alat Memori

Alat yang dihadapi model mencerminkan permukaan Noema MCP:

| Alat | Fungsinya |
| --- | --- |
| `noema_recall` | Memanggil kembali memori yang relevan untuk sebuah kueri, dengan anggaran token. |
| `noema_search` | Pencarian teks penuh atas memori tersimpan. |
| `noema_browse` | Menjelajah katalog PageIndex untuk sebuah topik atau entitas. |
| `noema_catalog` | Merender seluruh katalog memori sebagai markdown. |
| `noema_recall_graph` | Recall multi-hop melalui tautan dan entitas bersama. |
| `noema_neighbors` | Satu lompatan graf dari sebuah memori. |
| `noema_explain` | Menjelaskan mengapa sebuah memori dipanggil atau tidak dipanggil kembali. |
| `noema_remember` | Menyimpan fakta, keputusan, batasan, atau preferensi yang tahan lama. |
| `noema_review_list` | Mencantumkan kandidat tinjauan yang tertunda. |
| `noema_review_decide` | Menerima, menolak, mengedit, atau menggabungkan sebuah kandidat. |
| `noema_forget` | Menandai nisan (tombstone) atau menghapus permanen sebuah memori. |
| `noema_policy_get` / `noema_policy_set` | Membaca atau memperbarui kebijakan penulisan. |
| `noema_status` | Status server dan tenant: jumlah, kesehatan indeks, akar penyimpanan. |
| `noema_import` | Mengimpor memori dari alat coding AI lain. |

Setiap alat mengembalikan amplop seragam `{ ok, tool, text }` di mana `text` memuat seluruh keluaran server.

## Mengimpor memori dari alat lain

| ID sumber | Berkas global | Berkas workspace |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + pipeline memori Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` dilewati — ini adalah umpan yang belum dikurasi) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + memori lintas sesi Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` per proyek, dan ringkasan `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (berkas memori WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (upaya terbaik; belum ada penyimpanan memori global yang terdokumentasi) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (plus varian `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, akar memori otomatis `~/.qoder-cn/memory/` dan `~/.qoder-cn/projects/*/memory/` (plus varian `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) dan `~/.hermes/SOUL.md` global | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- Argumen `source` memilih satu alat, atau abaikan untuk menjalankan setiap sumber yang diaktifkan di pengaturan.
- Argumen `path` memilih akar workspace untuk berkas berlingkup proyek (bawaan adalah workspace sesi; berkas workspace hanya dimuat ketika pengaturan Import workspace files aktif).
- Impor dihapus duplikasinya melalui buku besar di `$DSH_HOME/storages/dsh-noema-imports.json`, berkunci jalur berkas + isi bagian — ketika beberapa alat berbagi satu `AGENTS.md` proyek, setiap bagian diimpor tepat satu kali. `force: true` mengimpor ulang semuanya.
- Halaman pengaturan menyediakan kotak centang per sumber, tombol impor saat startup, batas ukuran berkas, dan tombol Import now dengan ringkasan proses terakhir.

## Pengaturan

Buka **Settings → Noema Memory**:

| Pengaturan | Bawaan | Arti |
| --- | --- | --- |
| Enable memory | on | Saklar utama untuk alat `noema_*`. |
| Memory guidance | on | Bagian system-prompt yang mengajarkan penggunaan memori. |
| Start server at boot | on | Munculkan saat DSH dimulai alih-alih saat digunakan pertama kali. |
| Auto-accept new memories | on | `noema_remember` langsung menyimpan. |
| Server command | `bundled` | Biner `noema-mcp` yang dibundel atau jalur/perintah eksekusi kustom. |
| Working directory | — | cwd untuk server (diperlukan untuk `cargo run`). |
| Memory root (NOEMA_ROOT) | — | Tempat memori disimpan; kosong = `~/.agent-memory`. |
| Recall token budget | 1200 | `budget_tokens` bawaan untuk `noema_recall`. |
| Idle timeout (ms) | 0 | Hentikan server setelah idle; 0 = tidak pernah. |
| Keep alive | on | Mulai ulang server di latar belakang ketika ia crash atau keluar. |
| Keep-alive interval (ms) | 5000 | Penundaan minimum antara pemeriksaan kesehatan latar belakang. |
| Call timeout (ms) | 30000 | Tenggat per panggilan alat. |
| Restart delay (ms) | 1000 | Backoff antara penghentian/crash dan pemulaian berikutnya. |

Kartu status menampilkan kesehatan server dengan aksi mulai ulang/hentikan, dan bagian impor mengelola sembilan sumber memori.

## Muat ulang panas

Mesin HMR DSH dapat digunakan sepenuhnya setelah plugin dimuat sekali:

- **Host plugin** — aktifkan entri Cordis HMR di patch profil dengan watch root diarahkan ke keluaran `lib/` paket ini, dan pertahankan dependensi `link:`. Jalankan `pnpm run build` dan DSH yang sedang berjalan akan memuat ulang entri plugin secara otomatis (proses anak server Noema dimulai ulang oleh pemuatan ulang) — tanpa mulai ulang server.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Client bundle** — `ppnpm run build:client` menulis ulang `lib/client.js`; bagian node client-hmr melakukan stat-poll pada setiap graph bundle (bawaan 500ms) dan menyiarkan frame `rebuilt` melalui kanal SSE `/plugins/events`, dan browser menukar panas modul tanpa me-refresh halaman.
- **Settings** — setiap perubahan di halaman pengaturan Noema Memory diterapkan langsung melalui layanan pengaturan.

Satu hal yang tidak dapat dilakukan muat ulang panas adalah memuat plugin yang tidak pernah ada di pohon yang di-boot: komposisi yang sedang berjalan tidak memantau lapisan patch profil (aplikasi web tidak memasang `watchUserPatches`) maupun mengekspos API mutasi pemuat (RPC inventaris plugin bersifat hanya-baca). Oleh karena itu, plugin baru membutuhkan tepat satu kali mulai ulang server, setelah itu loop di atas sepenuhnya panas.

## Pengembangan

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

Pengujian e2e berjalan terhadap `noema/target/debug/noema-mcp` ketika tersedia (jika tidak, akan dilewati).

## Lisensi

MIT
