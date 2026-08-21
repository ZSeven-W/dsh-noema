<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Mémoire à long terme pour DeepSeek Harness — mémoire d'agent durable et inspectable propulsée par Noema.</strong><br />
  <sub>Rappel avant le travail &bull; Import depuis 9 outils d'agent &bull; Gestion de la mémoire via la page des paramètres &bull; Maintien en vie après plantage &bull; Rechargement à chaud</sub>
</p>

<p align="center">
  <sub>npm : <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Version actuelle du plugin : <code>0.1.0-rc.2</code> · Testé avec DSH <code>0.1.1-rc.1</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md"><b>Français</b></a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — page de réglages mémoire" width="100%" />
</p>
<p align="center"><sub>La page de réglages Noema Memory — sources d'import, gestion des mémoires et état du serveur en direct</sub></p>

## Pourquoi DSH Noema

DSH Noema connecte [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) à [Noema](https://github.com/ZSeven-W/noema) — un système de mémoire local-first et non vectoriel pour les agents de codage — afin qu'un agent conserve des connaissances durables entre les sessions au lieu de repartir de zéro à chaque conversation.

<table>
<tr>
<td width="50%">

### 🧠 Rappel durable

Les souvenirs persistent sous forme de fichiers Markdown inspectables sous `NOEMA_ROOT` (par défaut `~/.agent-memory/`). `noema_recall` charge le contexte pertinent au début d'une session ; `noema_search`, `noema_browse`, `noema_catalog` et `noema_recall_graph` couvrent la recherche, l'exploration et l'audit.

</td>
<td width="50%">

### 📥 Import depuis d'autres outils

`noema_import` lit les fichiers de mémoire de dix autres outils de codage IA — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes — les découpe en sections et enregistre chacune comme une mémoire durable. Un registre indexé par le contenu déduplique les importations entre les exécutions et entre les outils qui partagent des fichiers.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Gestion via la page des paramètres

La page des paramètres Noema Memory configure la commande du serveur, la racine de la mémoire, les budgets, les délais d'inactivité et d'appel, et la section de consignes — et une carte Gérer les souvenirs permet de rechercher, parcourir, ajouter, examiner et supprimer directement les souvenirs stockés.

</td>
<td width="50%">

### 🩺 Maintien en vie

Le serveur de mémoire reste actif : le délai d'inactivité est « jamais » par défaut, et une boucle de maintien en vie redémarre le processus enfant `noema-mcp` en arrière-plan en cas de plantage ou de sortie, avec un intervalle de vérification et un délai d'attente de redémarrage configurables.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Extraction intelligente d'entités

Le moteur d'extraction de Noema combine la segmentation de mots jieba avec des signaux de haute précision — noms propres anglais, noms CJK et termes techniques, sujets entre guillemets et répétition — ainsi que des filtres de mots vides et de chemins, pour que le catalogue de sujets PageIndex reste propre.

</td>
<td width="50%">

### ⚡ Rechargement à chaud

Après le premier démarrage, le plugin n'a plus jamais besoin d'être redémarré : `pnpm run build` recharge à chaud le plugin hôte via Cordis HMR, et `ppnpm run build:client` remplace à chaud le bundle navigateur via le canal SSE client-hmr.

</td>
</tr>
</table>

## Installer dans DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Ou, pour le développement local directement depuis l'arborescence source :

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

Le protocole `link:` crée un lien symbolique de la dépendance du profil vers ce dépôt, de sorte que les recompilations sont visibles immédiatement et que Cordis HMR peut surveiller la sortie compilée.

Le plugin regroupe le binaire `noema-mcp` via des packages npm optionnels par plateforme. Pour le compiler vous-même, exécutez `cargo build --release -p noema-mcp` dans le sous-module `noema` intégré, ou pointez le paramètre Server command vers n'importe quelle compilation de `noema-mcp`.

## Outils de mémoire

Les outils côté modèle reflètent la surface Noema MCP :

| Outil | Rôle |
| --- | --- |
| `noema_recall` | Rappelle les souvenirs pertinents pour une requête, avec un budget de tokens. |
| `noema_search` | Recherche plein texte sur les souvenirs stockés. |
| `noema_browse` | Parcourt le catalogue PageIndex pour un sujet ou une entité. |
| `noema_catalog` | Rend l'intégralité du catalogue de mémoire en markdown. |
| `noema_recall_graph` | Rappel multi-sauts à travers les liens et les entités partagées. |
| `noema_neighbors` | Un saut de graphe depuis une mémoire. |
| `noema_explain` | Explique pourquoi une mémoire a été ou n'a pas été rappelée. |
| `noema_remember` | Enregistre un fait, une décision, une contrainte ou une préférence durables. |
| `noema_review_list` | Liste les candidats en attente d'examen. |
| `noema_review_decide` | Accepte, rejette, modifie ou fusionne un candidat. |
| `noema_forget` | Marque comme supprimée (tombstone) ou supprime définitivement une mémoire. |
| `noema_policy_get` / `noema_policy_set` | Lit ou met à jour la politique d'écriture. |
| `noema_status` | État du serveur et du locataire : comptages, santé de l'index, racine de stockage. |
| `noema_import` | Importe les souvenirs d'autres outils de codage IA. |

Chaque outil renvoie une enveloppe uniforme `{ ok, tool, text }` où `text` contient la sortie complète du serveur.

## Importer les souvenirs d'autres outils

| ID source | Fichiers globaux | Fichiers du workspace |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + le pipeline de mémoire Codex : `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` ignoré — c'est le flux non curé) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + la mémoire inter-sessions Grok : `~/.grok/memory/MEMORY.md`, `MEMORY.md` par projet et les résumés `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (fichier de mémoire WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (au mieux ; aucun stockage de mémoire global documenté pour l'instant) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (ainsi que les variantes `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, les racines de mémoire automatique `~/.qoder-cn/memory/` et `~/.qoder-cn/projects/*/memory/` (ainsi que les variantes `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) et le fichier global `~/.hermes/SOUL.md` | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- L'argument `source` sélectionne un outil, ou omettez-le pour exécuter toutes les sources activées dans les paramètres.
- L'argument `path` sélectionne la racine du workspace pour les fichiers au niveau du projet (par défaut le workspace de la session ; les fichiers du workspace ne se chargent que lorsque le paramètre Import workspace files est activé).
- Les importations sont dédupliquées via un registre situé à `$DSH_HOME/storages/dsh-noema-imports.json`, indexé par chemin de fichier + contenu de section — lorsque plusieurs outils partagent un même `AGENTS.md` de projet, chaque section n'est importée qu'une seule fois. `force: true` réimporte tout.
- La page des paramètres expose des cases à cocher par source, un interrupteur d'import au démarrage, une limite de taille de fichier et un bouton Importer maintenant avec un résumé de la dernière exécution.

## Paramètres

Ouvrez **Paramètres → Noema Memory** :

| Paramètre | Défaut | Signification |
| --- | --- | --- |
| Enable memory | on | Interrupteur principal des outils `noema_*`. |
| Memory guidance | on | Section du prompt système enseignant l'utilisation de la mémoire. |
| Start server at boot | on | Lance au démarrage de DSH plutôt qu'à la première utilisation. |
| Auto-accept new memories | on | `noema_remember` persiste immédiatement. |
| Server command | `bundled` | Binaire `noema-mcp` intégré ou un chemin/commande d'exécutable personnalisé. |
| Working directory | — | cwd pour le serveur (nécessaire pour `cargo run`). |
| Memory root (NOEMA_ROOT) | — | Où les souvenirs sont stockés ; vide = `~/.agent-memory`. |
| Recall token budget | 1200 | `budget_tokens` par défaut pour `noema_recall`. |
| Idle timeout (ms) | 0 | Arrête le serveur après inactivité ; 0 = jamais. |
| Keep alive | on | Redémarre le serveur en arrière-plan en cas de plantage ou de sortie. |
| Keep-alive interval (ms) | 5000 | Délai minimum entre les vérifications de santé en arrière-plan. |
| Call timeout (ms) | 30000 | Délai limite par appel d'outil. |
| Restart delay (ms) | 1000 | Attente entre un arrêt ou un plantage et le prochain démarrage. |

La carte d'état affiche la santé du serveur avec des actions redémarrer/arrêter, et la section d'import gère les neuf sources de mémoire.

## Rechargement à chaud

Le mécanisme HMR de DSH est pleinement utilisable une fois que le plugin a été chargé une première fois :

- **Plugin hôte** — activez l'entrée Cordis HMR dans le patch du profil avec sa racine de surveillance pointée vers la sortie `lib/` de ce package, et conservez la dépendance `link:`. Exécutez `pnpm run build` et le DSH en cours recharge automatiquement l'entrée du plugin (le processus enfant du serveur Noema est redémarré par le rechargement) — sans redémarrer le serveur.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Bundle client** — `ppnpm run build:client` réécrit `lib/client.js` ; la moitié node de client-hmr interroge périodiquement chaque bundle de graphe (500 ms par défaut) et diffuse une trame `rebuilt` sur le canal SSE `/plugins/events`, et le navigateur remplace le module à chaud sans rafraîchir la page.
- **Paramètres** — chaque modification effectuée sur la page des paramètres Noema Memory s'applique en direct via le service de paramètres.

La seule chose que le rechargement à chaud ne peut pas faire est de charger un plugin qui n'a jamais été dans l'arborescence démarrée : la composition en cours ne surveille pas la couche de patch du profil (l'application web ne connecte pas `watchUserPatches`) et n'expose pas d'API de mutation du chargeur (le RPC d'inventaire des plugins est en lecture seule). Un nouveau plugin nécessite donc exactement un redémarrage du serveur, après quoi la boucle ci-dessus est entièrement à chaud.

## Développer

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

Le test e2e s'exécute contre `noema/target/debug/noema-mcp` lorsqu'il est présent (il est ignoré sinon).

## Écosystème

- [DSH Crew](https://github.com/ZSeven-W/dsh-crew) — déléguer des tâches aux agents DSH depuis Claude Code / Codex
- [DSH iOS](https://github.com/ZSeven-W/dsh-ios) — un simulateur iOS — et un iPhone en USB — vivants dans la conversation
- [DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil) — inspecter et modifier des documents `.op` dans une conversation

## Licence

MIT
