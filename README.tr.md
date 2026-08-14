<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>DeepSeek Harness için uzun süreli bellek — Noema destekli, kalıcı ve denetlenebilir ajan belleği.</strong><br />
  <sub>Çalışmadan Önce Hatırla &bull; 9 Ajan Aracından İçe Aktar &bull; Ayarlar Sayfasından Bellek Yönetimi &bull; Çökme Durumunda Ayakta Kalma &bull; Canlı Yeniden Yükleme</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Güncel eklenti sürümü: <code>0.1.0-rc.1</code> · DSH <code>0.1.0-rc.6</code> ile test edildi</sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md"><b>Türkçe</b></a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

## Neden DSH Noema

DSH Noema, [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) ile [Noema](https://github.com/ZSeven-W/noema) — kodlama ajanları için yerel öncelikli, vektör tabanlı olmayan bir bellek sistemi — arasında köprü kurar; böylece bir Ajan her konuşmaya sıfırdan başlamak yerine oturumlar arasında kalıcı bilgiyi korur.

<table>
<tr>
<td width="50%">

### 🧠 Kalıcı Hatırlama

Anılar, `NOEMA_ROOT` altında (varsayılan `~/.agent-memory/`) denetlenebilir Markdown dosyaları olarak saklanır. `noema_recall` oturum başında ilgili bağlamı yükler; `noema_search`, `noema_browse`, `noema_catalog` ve `noema_recall_graph` ise arama, keşif ve denetimi kapsar.

</td>
<td width="50%">

### 📥 Diğer Araçlardan İçe Aktarma

`noema_import` dokuz farklı yapay zeka kodlama aracının bellek dosyalarını okur — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder — bunları bölümlere ayırır ve her birini kalıcı bir anı olarak kaydeder. İçerik anahtarlı bir defter, çalıştırmalar arasında ve dosyaları paylaşan araçlar arasında yinelemeleri giderir.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Ayarlar Sayfasından Yönetim

Noema Memory ayarlar sayfası; sunucu komutunu, bellek kökünü, bütçeleri, boşta kalma/çağrı zaman aşımlarını ve rehberlik bölümünü yapılandırır — ve Manage memories kartı, saklanan anıları doğrudan arar, göz atar, ekler, inceler ve siler.

</td>
<td width="50%">

### 🩺 Ayakta Kalma

Bellek sunucusu ayakta kalır: boşta kalma zaman aşımı varsayılan olarak asla kapanmaz ve bir ayakta kalma döngüsü, çöktüğünde ya da çıktığında `noema-mcp` alt sürecini arka planda yeniden başlatır; yapılandırılabilir kontrol aralığı ve yeniden başlatma geri çekilmesiyle.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Akıllı Varlık Çıkarımı

Noema'nın çıkarım motoru; jieba sözcük bölümlemeyi yüksek hassasiyetli sinyallerle — İngilizce özel adlar, CJK adları ve teknik terimler, tırnak içindeki konular ve yineleme — durma sözcükleri ve yol filtreleriyle birleştirir; böylece PageIndex konu kataloğu temiz kalır.

</td>
<td width="50%">

### ⚡ Canlı Yeniden Yükleme

İlk başlatmadan sonra eklenti bir daha asla yeniden başlatma gerektirmez: `pnpm run build` ana eklentiyi Cordis HMR üzerinden canlı olarak yeniden yükler ve `ppnpm run build:client` tarayıcı paketini client-hmr SSE kanalı üzerinden canlı olarak değiştirir.

</td>
</tr>
</table>

## DSH'ye Kurulum

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Ya da kaynak ağacından doğrudan yerel geliştirme için:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` protokolü profil bağımlılığını bu depoya sembolik bağlar; böylece yeniden derlemeler anında görünür olur ve Cordis HMR derlenen çıktıyı izleyebilir.

Eklenti, `noema-mcp` ikili dosyasını platform bazlı isteğe bağlı npm paketleri aracılığıyla paketler. Bunun yerine kendiniz derlemek için, paketlenmiş `noema` alt modülünün içinde `cargo build --release -p noema-mcp` çalıştırın ya da Server command ayarını herhangi bir `noema-mcp` derlemesine yönlendirin.

## Bellek Araçları

Modele yönelik araçlar Noema MCP yüzeyini yansıtır:

| Araç | Ne yapar |
| --- | --- |
| `noema_recall` | Bir sorgu için ilgili anıları, bir token bütçesiyle hatırlar. |
| `noema_search` | Saklanan anılar üzerinde tam metin arama yapar. |
| `noema_browse` | Bir konu ya da varlık için PageIndex kataloğuna göz atar. |
| `noema_catalog` | Bellek kataloğunun tamamını markdown olarak işler. |
| `noema_recall_graph` | Bağlantılar ve paylaşılan varlıklar üzerinden çok adımlı hatırlama yapar. |
| `noema_neighbors` | Bir anıdan tek grafik adımı atar. |
| `noema_explain` | Bir anının neden hatırlanıp hatırlanmadığını açıklar. |
| `noema_remember` | Kalıcı bir olgu, karar, kısıt ya da tercihi kaydeder. |
| `noema_review_list` | Bekleyen inceleme adaylarını listeler. |
| `noema_review_decide` | Bir adayı kabul eder, reddeder, düzenler ya da birleştirir. |
| `noema_forget` | Bir anıyı mezar taşıyla işaretler ya da kalıcı olarak siler. |
| `noema_policy_get` / `noema_policy_set` | Yazma politikasını okur ya da günceller. |
| `noema_status` | Sunucu ve kiracı durumu: sayılar, dizin sağlığı, depolama kökü. |
| `noema_import` | Diğer yapay zeka kodlama araçlarından anıları içe aktarır. |

Her araç, `text` alanının sunucunun tam çıktısını taşıdığı tek tip bir zarf `{ ok, tool, text }` döndürür.

## Diğer araçlardan anıları içe aktarma

| Kaynak kimliği | Genel dosyalar | Çalışma alanı dosyaları |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + Codex bellek hattı: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` atlanır — bu, düzenlenmemiş beslemedir) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + Grok oturumlar arası belleği: `~/.grok/memory/MEMORY.md`, proje bazlı `MEMORY.md` ve `sessions/*.md` özetleri | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (WorkBuddy bellek dosyası), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (en iyi çabayla; henüz belgelenmiş genel bir bellek deposu yok) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (artı `~/.trae-cn` varyantları) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, otomatik bellek kökleri `~/.qoder-cn/memory/` ve `~/.qoder-cn/projects/*/memory/` (artı `~/.qoder` varyantları) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |

- `source` bağımsız değişkeni tek bir aracı seçer ya da ayarlarda etkinleştirilen her kaynağı çalıştırmak için onu atlayın.
- `path` bağımsız değişkeni proje kapsamlı dosyalar için çalışma alanı kökünü seçer (varsayılan oturum çalışma alanıdır; çalışma alanı dosyaları yalnızca Import workspace files ayarı açıkken yüklenir).
- İçe aktarmalar, dosya yolu + bölüm içeriğine göre anahtarlanmış `$DSH_HOME/storages/dsh-noema-imports.json` konumundaki bir defter aracılığıyla yinelenmeden arındırılır — birkaç araç aynı proje `AGENTS.md` dosyasını paylaştığında her bölüm tam olarak bir kez içe aktarılır. `force: true` her şeyi yeniden içe aktarır.
- Ayarlar sayfası; kaynak bazlı onay kutuları, başlangıçta içe aktarma anahtarı, dosya boyutu sınırı ve son çalıştırma özetiyle birlikte bir Import now düğmesi sunar.

## Ayarlar

**Ayarlar → Noema Memory** bölümünü açın:

| Ayar | Varsayılan | Anlamı |
| --- | --- | --- |
| Enable memory | on | `noema_*` araçlarının ana anahtarı. |
| Memory guidance | on | Bellek kullanımını öğreten sistem-istemi bölümü. |
| Start server at boot | on | İlk kullanım yerine DSH başlangıcında başlatır. |
| Auto-accept new memories | on | `noema_remember` hemen kalıcılaştırır. |
| Server command | `bundled` | Paketlenmiş `noema-mcp` ikili dosyası ya da özel bir yürütülebilir yol/komut. |
| Working directory | — | Sunucu için cwd (`cargo run` için gereklidir). |
| Memory root (NOEMA_ROOT) | — | Anıların saklandığı yer; boş = `~/.agent-memory`. |
| Recall token budget | 1200 | `noema_recall` için varsayılan `budget_tokens`. |
| Idle timeout (ms) | 0 | Boşta kaldıktan sonra sunucuyu durdurur; 0 = asla. |
| Keep alive | on | Sunucu çöktüğünde ya da çıktığında arka planda yeniden başlatır. |
| Keep-alive interval (ms) | 5000 | Arka plan sağlık kontrolleri arasındaki minimum gecikme. |
| Call timeout (ms) | 30000 | Araç çağrısı başına süre sınırı. |
| Restart delay (ms) | 1000 | Bir durdurma/çökme ile sonraki başlatma arasındaki geri çekilme. |

Durum kartı, yeniden başlatma/durdurma eylemleriyle birlikte sunucu sağlığını gösterir ve içe aktarma bölümü dokuz bellek kaynağını yönetir.

## Canlı yeniden yükleme

DSH'nin HMR mekanizması, eklenti bir kez yüklendikten sonra tamamen kullanılabilir:

- **Ana eklenti** — profil yamasındaki Cordis HMR girdisini, izleme kökü bu paketin `lib/` çıktısına işaret edecek şekilde etkinleştirin ve `link:` bağımlılığını koruyun. `pnpm run build` çalıştırın; çalışan DSH eklenti girdisini otomatik olarak yeniden yükler (Noema sunucu alt süreci yeniden yükleme tarafından yeniden başlatılır) — sunucuyu yeniden başlatmaya gerek yok.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **İstemci paketi** — `ppnpm run build:client` `lib/client.js` dosyasını yeniden yazar; client-hmr'ın node tarafı her grafik paketini stat-poll ile yoklar (varsayılan 500ms) ve `/plugins/events` SSE kanalı üzerinden bir `rebuilt` çerçevesi yayınlar; tarayıcı, sayfa yenilemeden modülü canlı olarak değiştirir.
- **Ayarlar** — Noema Memory ayarlar sayfasında yapılan her değişiklik, ayarlar hizmeti aracılığıyla canlı olarak uygulanır.

Canlı yeniden yüklemenin yapamayacağı tek şey, hiçbir zaman başlatılan ağaçta olmayan bir eklentiyi yüklemektir: çalışan bileşim ne profil yama katmanını izler (web uygulaması `watchUserPatches` bağlamaz) ne de bir yükleyici mutasyon API'si sunar (eklenti envanter RPC'si salt okunurdur). Bu nedenle yeni bir eklenti tam olarak bir kez sunucunun yeniden başlatılmasını gerektirir; bundan sonra yukarıdaki döngü tamamen canlıdır.

## Geliştirme

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

e2e testi, mevcut olduğunda `noema/target/debug/noema-mcp` karşısında çalışır (aksi takdirde atlanır).

## Lisans

MIT
