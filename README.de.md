<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Langzeitgedächtnis für DeepSeek Harness — dauerhaftes, überprüfbares Agenten-Gedächtnis auf Basis von Noema.</strong><br />
  <sub>Abruf vor der Arbeit &bull; Import aus 9 Agent-Tools &bull; Gedächtnisverwaltung über die Einstellungsseite &bull; Keep-Alive bei Abstürzen &bull; Hot Reload</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Aktuelle Plugin-Version: <code>0.1.0-rc.3</code> · Getestet mit DSH <code>0.1.1-rc.1</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md"><b>Deutsch</b></a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema – Speicher-Einstellungsseite" width="100%" />
</p>
<p align="center"><sub>Die Noema-Memory-Einstellungsseite – Importquellen, Speicherverwaltung und Live-Serverstatus</sub></p>

## Warum DSH Noema

DSH Noema verbindet [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) mit [Noema](https://github.com/ZSeven-W/noema) — einem local-first, nicht-vektorbasierten Gedächtnissystem für Coding-Agents —, sodass ein Agent über Sitzungen hinweg dauerhaftes Wissen behält, statt jedes Gespräch bei null zu beginnen.

<table>
<tr>
<td width="50%">

### 🧠 Dauerhafter Abruf

Erinnerungen bleiben als überprüfbare Markdown-Dateien unter `NOEMA_ROOT` (Standard `~/.agent-memory/`) erhalten. `noema_recall` lädt zu Beginn einer Sitzung relevanten Kontext; `noema_search`, `noema_browse`, `noema_catalog` und `noema_recall_graph` decken Suche, Erkundung und Überprüfung ab.

</td>
<td width="50%">

### 📥 Import aus anderen Tools

`noema_import` liest die Gedächtnisdateien von zehn anderen KI-Coding-Tools — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes —, teilt sie in Abschnitte auf und speichert jeden als dauerhafte Erinnerung. Ein inhaltsbasiertes Ledger dedupliziert über Läufe hinweg sowie über Tools, die Dateien gemeinsam nutzen.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Verwaltung über die Einstellungsseite

Die Einstellungsseite „Noema Memory“ konfiguriert den Serverbefehl, den Speicher-Root, die Budgets, die Idle-/Call-Timeouts und den Anleitungsabschnitt — und eine Karte „Erinnerungen verwalten“ durchsucht, durchstöbert, fügt hinzu, prüft und löscht gespeicherte Erinnerungen direkt.

</td>
<td width="50%">

### 🩺 Keep-Alive

Der Gedächtnisserver bleibt aktiv: Der Idle-Timeout ist standardmäßig auf „nie“ gesetzt, und eine Keep-Alive-Schleife startet den `noema-mcp`-Kindprozess im Hintergrund neu, wenn er abstürzt oder beendet wird — mit konfigurierbarem Prüfintervall und Neustart-Backoff.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Intelligente Entitäts-Extraktion

Die Extraktions-Engine von Noema kombiniert die Wortsegmentierung von jieba mit hochpräzisen Signalen — englische Eigennamen, CJK-Namen und Fachbegriffe, Themen in Anführungszeichen und Wiederholungen — mit Stopwort- und Pfadfiltern, sodass der PageIndex-Themenkatalog sauber bleibt.

</td>
<td width="50%">

### ⚡ Hot Reload

Nach dem ersten Start benötigt das Plugin nie wieder einen Neustart: `pnpm run build` lädt das Host-Plugin über Cordis HMR per Hot Reload neu, und `ppnpm run build:client` tauscht das Browser-Bundle über den client-hmr-SSE-Kanal im laufenden Betrieb aus.

</td>
</tr>
</table>

## In DSH installieren

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Oder für die lokale Entwicklung direkt aus dem Quellcode-Verzeichnis:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

Das `link:`-Protokoll verknüpft die Profilabhängigkeit per Symlink mit diesem Repository, sodass Neubuilds sofort sichtbar sind und Cordis HMR den kompilierten Output überwachen kann.

Das Plugin bündelt die `noema-mcp`-Binärdatei über optionale, plattformspezifische npm-Pakete. Um sie stattdessen selbst zu bauen, führe `cargo build --release -p noema-mcp` im gebündelten `noema`-Submodul aus oder verweise die Einstellung „Serverbefehl“ auf einen beliebigen `noema-mcp`-Build.

## Gedächtnis-Tools

Die dem Modell zugewandten Tools spiegeln die Noema-MCP-Oberfläche wider:

| Tool | Was es tut |
| --- | --- |
| `noema_recall` | Ruft relevante Erinnerungen für eine Anfrage ab, mit einem Token-Budget. |
| `noema_search` | Volltextsuche über gespeicherte Erinnerungen. |
| `noema_browse` | Durchsucht den PageIndex-Katalog nach einem Thema oder einer Entität. |
| `noema_catalog` | Rendert den vollständigen Gedächtniskatalog als Markdown. |
| `noema_recall_graph` | Mehrstufiger Abruf über Verknüpfungen und gemeinsame Entitäten. |
| `noema_neighbors` | Ein Graph-Schritt von einer Erinnerung aus. |
| `noema_explain` | Erklärt, warum eine Erinnerung abgerufen wurde oder nicht. |
| `noema_remember` | Speichert eine dauerhafte Tatsache, Entscheidung, Einschränkung oder Präferenz. |
| `noema_review_list` | Listet ausstehende Prüf-Kandidaten auf. |
| `noema_review_decide` | Akzeptiert, lehnt ab, bearbeitet oder führt einen Kandidaten zusammen. |
| `noema_forget` | Markiert eine Erinnerung als gelöscht oder löscht sie endgültig. |
| `noema_policy_get` / `noema_policy_set` | Liest oder aktualisiert die Schreibrichtlinie. |
| `noema_status` | Server- und Mandantenstatus: Anzahl, Index-Gesundheit, Speicher-Root. |
| `noema_import` | Importiert Erinnerungen aus anderen KI-Coding-Tools. |

Jedes Tool gibt einen einheitlichen Umschlag `{ ok, tool, text }` zurück, wobei `text` die vollständige Serverausgabe enthält.

## Erinnerungen aus anderen Tools importieren

| Quell-ID | Globale Dateien | Workspace-Dateien |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + die Codex-Memory-Pipeline: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` wird übersprungen — es ist der unkuratierte Feed) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + das sitzungsübergreifende Grok-Gedächtnis: `~/.grok/memory/MEMORY.md`, projektbezogene `MEMORY.md` und Zusammenfassungen in `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (WorkBuddy-Gedächtnisdatei), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (Best-Effort; noch kein dokumentierter globaler Gedächtnisspeicher) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (plus die `~/.trae-cn`-Varianten) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, die Auto-Memory-Roots `~/.qoder-cn/memory/` und `~/.qoder-cn/projects/*/memory/` (plus die `~/.qoder`-Varianten) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) und die globale `~/.hermes/SOUL.md` | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- Das Argument `source` wählt ein Tool aus; lasse es weg, um jede in den Einstellungen aktivierte Quelle auszuführen.
- Das Argument `path` wählt das Workspace-Root für projektbezogene Dateien (Standard: der Sitzungs-Workspace; Workspace-Dateien werden nur geladen, wenn die Einstellung „Workspace-Dateien importieren“ aktiviert ist).
- Importe werden über ein Ledger unter `$DSH_HOME/storages/dsh-noema-imports.json` dedupliziert, das nach Dateipfad + Abschnittsinhalt indexiert ist — wenn mehrere Tools ein Projekt-`AGENTS.md` gemeinsam nutzen, wird jeder Abschnitt genau einmal importiert. `force: true` importiert alles erneut.
- Die Einstellungsseite bietet Kontrollkästchen pro Quelle, einen Schalter für den Import beim Start, eine Dateigrößen-Obergrenze und eine Schaltfläche „Jetzt importieren“ mit einer Zusammenfassung des letzten Laufs.

## Einstellungen

Öffne **Einstellungen → Noema Memory**:

| Einstellung | Standard | Bedeutung |
| --- | --- | --- |
| Gedächtnis aktivieren | an | Hauptschalter für die `noema_*`-Tools. |
| Gedächtnis-Anleitung | an | System-Prompt-Abschnitt, der die Nutzung des Gedächtnisses erklärt. |
| Server beim Start starten | an | Startet beim DSH-Start statt bei der ersten Nutzung. |
| Neue Erinnerungen automatisch akzeptieren | an | `noema_remember` speichert sofort dauerhaft. |
| Serverbefehl | `bundled` | Gebündelte `noema-mcp`-Binärdatei oder ein benutzerdefinierter ausführbarer Pfad/Befehl. |
| Arbeitsverzeichnis | — | cwd für den Server (erforderlich für `cargo run`). |
| Speicher-Root (NOEMA_ROOT) | — | Wo Erinnerungen gespeichert werden; leer = `~/.agent-memory`. |
| Abruf-Token-Budget | 1200 | Standard-`budget_tokens` für `noema_recall`. |
| Idle-Timeout (ms) | 0 | Stoppt den Server nach Leerlauf; 0 = nie. |
| Keep alive | an | Startet den Server im Hintergrund neu, wenn er abstürzt oder beendet wird. |
| Keep-alive-Intervall (ms) | 5000 | Minimale Verzögerung zwischen Health-Checks im Hintergrund. |
| Call-Timeout (ms) | 30000 | Frist pro Tool-Aufruf. |
| Neustart-Verzögerung (ms) | 1000 | Backoff zwischen einem Stopp/Absturz und dem nächsten Start. |

Die Statuskarte zeigt den Serverzustand mit Neustart-/Stopp-Aktionen, und der Import-Abschnitt verwaltet die neun Gedächtnisquellen.

## Hot Reload

Die HMR-Mechanik von DSH ist vollständig nutzbar, sobald das Plugin einmal geladen wurde:

- **Host-Plugin** — aktiviere den Cordis-HMR-Eintrag im Profil-Patch, wobei die Watch-Root auf die `lib/`-Ausgabe dieses Pakets zeigt, und behalte die `link:`-Abhängigkeit bei. Führe `pnpm run build` aus, und das laufende DSH lädt den Plugin-Eintrag automatisch neu (der Noema-Server-Kindprozess wird durch den Reload neu gestartet) — ohne Server-Neustart.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Client-Bundle** — `ppnpm run build:client` schreibt `lib/client.js` neu; die Node-Hälfte des client-hmr prüft jedes Graph-Bundle per stat-Polling (Standard 500 ms) und sendet einen `rebuilt`-Frame über den SSE-Kanal `/plugins/events`, und der Browser tauscht das Modul ohne Seitenaktualisierung im laufenden Betrieb aus.
- **Einstellungen** — jede Änderung auf der Einstellungsseite „Noema Memory“ wird über den Einstellungsdienst live angewendet.

Das Einzige, was Hot Reload nicht kann, ist das Laden eines Plugins, das nie im gebooteten Baum war: Die laufende Komposition überwacht weder die Profil-Patch-Ebene (die Web-App verdrahtet `watchUserPatches` nicht) noch legt sie eine Loader-Mutations-API offen (das Plugin-Inventar-RPC ist schreibgeschützt). Ein neues Plugin benötigt daher genau einen Server-Neustart, danach ist die obige Schleife vollständig „hot“.

## Entwicklung

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

Der E2E-Test läuft gegen `noema/target/debug/noema-mcp`, wenn vorhanden (andernfalls wird er übersprungen).

## Ökosystem

- [DSH Android](https://github.com/ZSeven-W/dsh-android) — ein Live-Android-Emulator oder USB-Gerät in der Konversation, vollständig über adb gesteuert
- [DSH Crew](https://github.com/ZSeven-W/dsh-crew) — Arbeit aus Claude Code / Codex an DSH-Agenten delegieren
- [DSH iOS](https://github.com/ZSeven-W/dsh-ios) — ein lebender iOS-Simulator — und ein iPhone per USB — in der Konversation
- [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) — `.op`-Designdokumente in einer Konversation prüfen und bearbeiten

## Lizenz

MIT
