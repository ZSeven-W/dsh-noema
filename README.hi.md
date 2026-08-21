<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>DeepSeek Harness के लिए दीर्घकालिक स्मृति — Noema द्वारा समर्थित टिकाऊ, निरीक्षण योग्य एजेंट स्मृति।</strong><br />
  <sub>काम से पहले स्मरण &bull; 9 एजेंट टूल से आयात &bull; सेटिंग्स-पेज स्मृति प्रबंधन &bull; क्रैश कीप-अलाइव &bull; हॉट रीलोड</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · वर्तमान प्लगइन रिलीज़: <code>0.1.0-rc.3</code> · DSH <code>0.1.1-rc.1</code> के साथ परीक्षण किया गया</sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md"><b>हिन्दी</b></a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — मेमोरी सेटिंग्स पेज" width="100%" />
</p>
<p align="center"><sub>Noema मेमोरी सेटिंग्स पेज — इम्पोर्ट स्रोत, मेमोरी प्रबंधन और लाइव सर्वर स्थिति</sub></p>

## DSH Noema क्यों

DSH Noema, [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) को [Noema](https://github.com/ZSeven-W/noema) से जोड़ता है — जो कोडिंग एजेंट के लिए एक स्थानीय-प्रथम, गैर-वेक्टर स्मृति प्रणाली है — ताकि एक एजेंट हर वार्तालाप को शून्य से शुरू करने के बजाय सत्रों के बीच टिकाऊ ज्ञान बनाए रखे।

<table>
<tr>
<td width="50%">

### 🧠 टिकाऊ स्मरण

स्मृतियाँ `NOEMA_ROOT` (डिफ़ॉल्ट `~/.agent-memory/`) के अंतर्गत निरीक्षण योग्य Markdown फ़ाइलों के रूप में बनी रहती हैं। `noema_recall` सत्र की शुरुआत में प्रासंगिक संदर्भ लोड करता है; `noema_search`, `noema_browse`, `noema_catalog` और `noema_recall_graph` खोज, अन्वेषण और लेखा-परीक्षण को कवर करते हैं।

</td>
<td width="50%">

### 📥 अन्य टूल से आयात

`noema_import` दस अन्य AI कोडिंग टूल — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes — की स्मृति फ़ाइलों को पढ़ता है, उन्हें खंडों में विभाजित करता है, और प्रत्येक को एक टिकाऊ स्मृति के रूप में सहेजता है। सामग्री-कुंजी वाला बही-खाता विभिन्न रन और साझा फ़ाइलों वाले टूल के बीच डुप्लिकेट हटाता है।

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ सेटिंग्स-पेज प्रबंधन

Noema Memory सेटिंग्स पेज सर्वर कमांड, स्मृति रूट, बजट, आइडल/कॉल टाइमआउट और मार्गदर्शन अनुभाग को कॉन्फ़िगर करता है — और एक स्मृतियाँ प्रबंधित करें कार्ड संग्रहीत स्मृतियों को सीधे खोजता, ब्राउज़ करता, जोड़ता, समीक्षा करता और हटाता है।

</td>
<td width="50%">

### 🩺 कीप-अलाइव

स्मृति सर्वर चालू रहता है: आइडल टाइमआउट डिफ़ॉल्ट रूप से कभी नहीं होता, और एक कीप-अलाइव लूप क्रैश या बाहर निकलने पर `noema-mcp` चाइल्ड को पृष्ठभूमि में पुनः आरंभ करता है, जिसमें कॉन्फ़िगर करने योग्य जाँच अंतराल और पुनः आरंभ बैकऑफ़ होता है।

</td>
</tr>
<tr>
<td width="50%">

### 🔍 स्मार्ट एंटिटी निष्कर्षण

Noema का निष्कर्षण इंजन jieba शब्द-विभाजन को उच्च-परिशुद्धता संकेतों — अंग्रेज़ी व्यक्तिवाचक संज्ञाएँ, CJK नाम और तकनीकी शब्द, उद्धृत विषय और पुनरावृत्ति — के साथ स्टॉपवर्ड और पथ फ़िल्टर के साथ जोड़ता है, ताकि PageIndex विषय सूची साफ़ रहे।

</td>
<td width="50%">

### ⚡ हॉट रीलोड

पहले बूट के बाद, प्लगइन को फिर कभी पुनः आरंभ करने की आवश्यकता नहीं होती: `pnpm run build` Cordis HMR के माध्यम से होस्ट प्लगइन को हॉट-रीलोड करता है, और `ppnpm run build:client` client-hmr SSE चैनल पर ब्राउज़र बंडल को हॉट-स्वैप करता है।

</td>
</tr>
</table>

## DSH में इंस्टॉल करें

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

या, स्रोत ट्री से सीधे स्थानीय विकास के लिए:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` प्रोटोकॉल प्रोफ़ाइल निर्भरता को इस रिपॉज़िटरी से सिमलिंक करता है, ताकि पुनर्निर्माण तुरंत दिखाई दें और Cordis HMR संकलित आउटपुट पर नज़र रख सके।

प्लगइन प्रति-प्लेटफ़ॉर्म वैकल्पिक npm पैकेजों के माध्यम से `noema-mcp` बाइनरी को बंडल करता है। इसके बजाय इसे स्वयं बनाने के लिए, बंडल किए गए `noema` सबमॉड्यूल के अंदर `cargo build --release -p noema-mcp` चलाएँ, या Server command सेटिंग को किसी भी `noema-mcp` बिल्ड की ओर इंगित करें।

## स्मृति टूल

मॉडल-उन्मुख टूल Noema MCP सतह का प्रतिबिंब हैं:

| टूल | यह क्या करता है |
| --- | --- |
| `noema_recall` | किसी क्वेरी के लिए टोकन बजट के साथ प्रासंगिक स्मृतियाँ स्मरण करता है। |
| `noema_search` | संग्रहीत स्मृतियों पर पूर्ण-पाठ खोज। |
| `noema_browse` | किसी विषय या एंटिटी के लिए PageIndex सूची ब्राउज़ करता है। |
| `noema_catalog` | संपूर्ण स्मृति सूची को markdown के रूप में प्रस्तुत करता है। |
| `noema_recall_graph` | लिंक और साझा एंटिटी के माध्यम से मल्टी-हॉप स्मरण। |
| `noema_neighbors` | किसी स्मृति से एक ग्राफ हॉप। |
| `noema_explain` | बताता है कि कोई स्मृति क्यों स्मरण हुई या नहीं हुई। |
| `noema_remember` | एक टिकाऊ तथ्य, निर्णय, बाधा या प्राथमिकता सहेजता है। |
| `noema_review_list` | लंबित समीक्षा उम्मीदवारों की सूची देता है। |
| `noema_review_decide` | किसी उम्मीदवार को स्वीकार, अस्वीकार, संपादित या विलय करता है। |
| `noema_forget` | किसी स्मृति को टॉम्बस्टोन या हार्ड-डिलीट करता है। |
| `noema_policy_get` / `noema_policy_set` | लेखन नीति पढ़ता या अपडेट करता है। |
| `noema_status` | सर्वर और टेनेंट स्थिति: गणनाएँ, इंडेक्स स्वास्थ्य, स्टोरेज रूट। |
| `noema_import` | अन्य AI कोडिंग टूल से स्मृतियाँ आयात करता है। |

प्रत्येक टूल एक समान एनवेलप `{ ok, tool, text }` लौटाता है जहाँ `text` संपूर्ण सर्वर आउटपुट रखता है।

## अन्य टूल से स्मृतियाँ आयात करें

| स्रोत id | वैश्विक फ़ाइलें | वर्कस्पेस फ़ाइलें |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + Codex स्मृति पाइपलाइन: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` छोड़ दिया जाता है — यह असंपादित फ़ीड है) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + Grok क्रॉस-सेशन स्मृति: `~/.grok/memory/MEMORY.md`, प्रति-प्रोजेक्ट `MEMORY.md`, और `sessions/*.md` सारांश | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (WorkBuddy स्मृति फ़ाइल), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (सर्वोत्तम प्रयास; अभी तक कोई दस्तावेज़ीकृत वैश्विक स्मृति स्टोर नहीं) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (`~/.trae-cn` वेरिएंट सहित) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, ऑटो-मेमोरी रूट `~/.qoder-cn/memory/` और `~/.qoder-cn/projects/*/memory/` (`~/.qoder` वेरिएंट सहित) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) और वैश्विक `~/.hermes/SOUL.md` | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- `source` तर्क एक टूल चुनता है, या सेटिंग्स में सक्षम हर स्रोत को चलाने के लिए इसे छोड़ दें।
- `path` तर्क प्रोजेक्ट-स्कोप्ड फ़ाइलों के लिए वर्कस्पेस रूट चुनता है (डिफ़ॉल्ट सत्र वर्कस्पेस है; वर्कस्पेस फ़ाइलें केवल तभी लोड होती हैं जब Import workspace files सेटिंग चालू हो)।
- आयात `$DSH_HOME/storages/dsh-noema-imports.json` पर स्थित एक बही-खाते के माध्यम से डुप्लिकेट-मुक्त किए जाते हैं, जिसकी कुंजी फ़ाइल पथ + खंड सामग्री है — जब कई टूल एक प्रोजेक्ट `AGENTS.md` साझा करते हैं, तो प्रत्येक खंड ठीक एक बार आयात होता है। `force: true` सब कुछ पुनः आयात करता है।
- सेटिंग्स पेज प्रति-स्रोत चेकबॉक्स, स्टार्टअप-पर-आयात टॉगल, फ़ाइल-आकार सीमा, और पिछले-रन सारांश के साथ एक Import now बटन प्रदान करता है।

## सेटिंग्स

**सेटिंग्स → Noema Memory** खोलें:

| सेटिंग | डिफ़ॉल्ट | अर्थ |
| --- | --- | --- |
| स्मृति सक्षम करें | चालू | `noema_*` टूल के लिए मुख्य स्विच। |
| स्मृति मार्गदर्शन | चालू | स्मृति उपयोग सिखाने वाला सिस्टम-प्रॉम्प्ट अनुभाग। |
| बूट पर सर्वर शुरू करें | चालू | पहले उपयोग के बजाय DSH शुरू होने पर स्पॉन करें। |
| नई स्मृतियाँ स्वतः स्वीकार करें | चालू | `noema_remember` तुरंत स्थायी हो जाता है। |
| सर्वर कमांड | `bundled` | बंडल किया गया `noema-mcp` बाइनरी या कस्टम एक्ज़ीक्यूटेबल पथ/कमांड। |
| कार्य निर्देशिका | — | सर्वर के लिए cwd (`cargo run` के लिए आवश्यक)। |
| स्मृति रूट (NOEMA_ROOT) | — | जहाँ स्मृतियाँ संग्रहीत होती हैं; खाली = `~/.agent-memory`। |
| स्मरण टोकन बजट | 1200 | `noema_recall` के लिए डिफ़ॉल्ट `budget_tokens`। |
| आइडल टाइमआउट (ms) | 0 | आइडल होने पर सर्वर रोकें; 0 = कभी नहीं। |
| कीप-अलाइव | चालू | क्रैश या बाहर निकलने पर सर्वर को पृष्ठभूमि में पुनः आरंभ करें। |
| कीप-अलाइव अंतराल (ms) | 5000 | पृष्ठभूमि स्वास्थ्य जाँचों के बीच न्यूनतम विलंब। |
| कॉल टाइमआउट (ms) | 30000 | प्रति-टूल-कॉल समय-सीमा। |
| पुनः आरंभ विलंब (ms) | 1000 | रुकने/क्रैश और अगली शुरुआत के बीच बैकऑफ़। |

स्थिति कार्ड पुनः आरंभ/रोकने की क्रियाओं के साथ सर्वर स्वास्थ्य दिखाता है, और आयात अनुभाग नौ स्मृति स्रोतों का प्रबंधन करता है।

## हॉट रीलोड

प्लगइन एक बार लोड हो जाने के बाद DSH की HMR मशीनरी पूरी तरह उपयोग योग्य है:

- **होस्ट प्लगइन** — प्रोफ़ाइल पैच में Cordis HMR एंट्री को सक्षम करें, जिसका वॉच रूट इस पैकेज के `lib/` आउटपुट की ओर इंगित हो, और `link:` निर्भरता बनाए रखें। `pnpm run build` चलाएँ और चलता हुआ DSH प्लगइन एंट्री को स्वचालित रूप से पुनः लोड कर देता है (रीलोड से Noema सर्वर चाइल्ड पुनः आरंभ होता है) — कोई सर्वर पुनः आरंभ नहीं।

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **क्लाइंट बंडल** — `ppnpm run build:client` `lib/client.js` को फिर से लिखता है; client-hmr node भाग हर ग्राफ बंडल को stat-पोल करता है (डिफ़ॉल्ट 500ms) और `/plugins/events` SSE चैनल पर एक `rebuilt` फ़्रेम प्रसारित करता है, और ब्राउज़र पृष्ठ रीफ़्रेश के बिना मॉड्यूल को हॉट-स्वैप करता है।
- **सेटिंग्स** — Noema Memory सेटिंग्स पेज पर किया गया हर परिवर्तन सेटिंग्स सेवा के माध्यम से लाइव लागू होता है।

हॉट-रीलोड एक चीज़ नहीं कर सकता: ऐसे प्लगइन को लोड करना जो कभी बूट किए गए ट्री में नहीं था। चलती हुई कंपोज़िशन न तो प्रोफ़ाइल पैच लेयर पर नज़र रखती है (वेब ऐप `watchUserPatches` को वायर नहीं करता) और न ही कोई लोडर म्यूटेशन API उजागर करती है (प्लगइन इन्वेंटरी RPC केवल-पढ़ने योग्य है)। इसलिए एक नए प्लगइन को ठीक एक सर्वर पुनः आरंभ की आवश्यकता होती है, जिसके बाद उपरोक्त लूप पूरी तरह हॉट होता है।

## विकास

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

e2e परीक्षण `noema/target/debug/noema-mcp` के मौजूद होने पर उसके विरुद्ध चलता है (अन्यथा इसे छोड़ दिया जाता है)।

## पारिस्थितिकी तंत्र

- [DSH Crew](https://github.com/ZSeven-W/dsh-crew) — Claude Code / Codex से DSH एजेंट को काम सौंपें
- [DSH iOS](https://github.com/ZSeven-W/dsh-ios) — बातचीत के भीतर चलता iOS सिम्युलेटर — और USB से जुड़ा iPhone
- [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) — बातचीत के भीतर `.op` डिज़ाइन दस्तावेज़ देखें और संपादित करें

## लाइसेंस

MIT
