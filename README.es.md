<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Memoria a largo plazo para DeepSeek Harness — memoria de agente duradera e inspeccionable respaldada por Noema.</strong><br />
  <sub>Recordar antes de trabajar &bull; Importar desde 9 herramientas de agente &bull; Gestión de memoria desde la página de ajustes &bull; Mantenimiento activo ante fallos &bull; Recarga en caliente</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Versión actual del plugin: <code>0.1.0-rc.1</code> · Probado con DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md"><b>Español</b></a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

## Por qué DSH Noema

DSH Noema conecta [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) con [Noema](https://github.com/ZSeven-W/noema) — un sistema de memoria local-first y no vectorial para agentes de programación — para que un agente conserve conocimiento duradero entre sesiones en lugar de empezar cada conversación desde cero.

<table>
<tr>
<td width="50%">

### 🧠 Recuerdo duradero

Las memorias persisten como archivos Markdown inspeccionables bajo `NOEMA_ROOT` (por defecto `~/.agent-memory/`). `noema_recall` carga el contexto relevante al inicio de una sesión; `noema_search`, `noema_browse`, `noema_catalog` y `noema_recall_graph` cubren la búsqueda, la exploración y la auditoría.

</td>
<td width="50%">

### 📥 Importar desde otras herramientas

`noema_import` lee los archivos de memoria de otras nueve herramientas de programación con IA — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder — los divide en secciones y guarda cada una como una memoria duradera. Un registro indexado por contenido deduplica entre ejecuciones y entre herramientas que comparten archivos.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Gestión desde la página de ajustes

La página de ajustes de Noema Memory configura el comando del servidor, la raíz de memoria, los presupuestos, los tiempos de espera de inactividad/llamada y la sección de orientación — y una tarjeta «Gestionar memorias» permite buscar, examinar, añadir, revisar y eliminar directamente las memorias almacenadas.

</td>
<td width="50%">

### 🩺 Mantenimiento activo

El servidor de memoria permanece activo: el tiempo de espera de inactividad es «nunca» por defecto, y un bucle de mantenimiento reinicia el proceso hijo `noema-mcp` en segundo plano cuando falla o termina, con un intervalo de comprobación y un retroceso de reinicio configurables.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Extracción inteligente de entidades

El motor de extracción de Noema combina la segmentación de palabras jieba con señales de alta precisión — nombres propios en inglés, nombres CJK y términos técnicos, temas entre comillas y repetición — junto con filtros de palabras vacías y rutas, para que el catálogo de temas de PageIndex se mantenga limpio.

</td>
<td width="50%">

### ⚡ Recarga en caliente

Tras el primer arranque, el plugin ya no necesita reiniciarse: `pnpm run build` recarga en caliente el plugin anfitrión mediante Cordis HMR, y `ppnpm run build:client` intercambia en caliente el bundle del navegador a través del canal SSE client-hmr.

</td>
</tr>
</table>

## Instalar en DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

O, para el desarrollo local directamente desde el árbol de código fuente:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

El protocolo `link:` crea un enlace simbólico de la dependencia del perfil a este repositorio, de modo que las recompilaciones se ven de inmediato y Cordis HMR puede vigilar la salida compilada.

El plugin incluye el binario `noema-mcp` mediante paquetes npm opcionales por plataforma. Para compilarlo usted mismo, ejecute `cargo build --release -p noema-mcp` dentro del submódulo `noema` incluido, o apunte el ajuste Server command a cualquier compilación de `noema-mcp`.

## Herramientas de memoria

Las herramientas orientadas al modelo reflejan la superficie Noema MCP:

| Herramienta | Qué hace |
| --- | --- |
| `noema_recall` | Recuerda las memorias relevantes para una consulta, con un presupuesto de tokens. |
| `noema_search` | Búsqueda de texto completo sobre las memorias almacenadas. |
| `noema_browse` | Examina el catálogo PageIndex por tema o entidad. |
| `noema_catalog` | Renderiza el catálogo de memoria completo como markdown. |
| `noema_recall_graph` | Recuerdo multi-salto a través de enlaces y entidades compartidas. |
| `noema_neighbors` | Un salto de grafo desde una memoria. |
| `noema_explain` | Explica por qué una memoria fue o no fue recordada. |
| `noema_remember` | Guarda un hecho, una decisión, una restricción o una preferencia duraderos. |
| `noema_review_list` | Lista los candidatos pendientes de revisión. |
| `noema_review_decide` | Acepta, rechaza, edita o fusiona un candidato. |
| `noema_forget` | Marca como borrada (tombstone) o elimina definitivamente una memoria. |
| `noema_policy_get` / `noema_policy_set` | Lee o actualiza la política de escritura. |
| `noema_status` | Estado del servidor y del inquilino: recuentos, salud del índice, raíz de almacenamiento. |
| `noema_import` | Importa memorias de otras herramientas de programación con IA. |

Cada herramienta devuelve una envoltura uniforme `{ ok, tool, text }` donde `text` contiene la salida completa del servidor.

## Importar memorias de otras herramientas

| Id de origen | Archivos globales | Archivos del workspace |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + el pipeline de memoria de Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` omitido — es la fuente sin depurar) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + la memoria entre sesiones de Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` por proyecto y los resúmenes `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (archivo de memoria de WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (mejor esfuerzo; todavía no hay un almacén de memoria global documentado) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (además de las variantes `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, las raíces de memoria automática `~/.qoder-cn/memory/` y `~/.qoder-cn/projects/*/memory/` (además de las variantes `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |

- El argumento `source` selecciona una herramienta, u omítalo para ejecutar todas las fuentes habilitadas en los ajustes.
- El argumento `path` selecciona la raíz del workspace para los archivos con ámbito de proyecto (por defecto el workspace de la sesión; los archivos del workspace solo se cargan cuando el ajuste Import workspace files está activado).
- Las importaciones se deduplican mediante un registro en `$DSH_HOME/storages/dsh-noema-imports.json`, indexado por ruta de archivo + contenido de la sección — cuando varias herramientas comparten un `AGENTS.md` de proyecto, cada sección se importa exactamente una vez. `force: true` reimporta todo.
- La página de ajustes expone casillas por origen, un interruptor de importación al inicio, un límite de tamaño de archivo y un botón Importar ahora con un resumen de la última ejecución.

## Ajustes

Abra **Ajustes → Noema Memory**:

| Ajuste | Predeterminado | Significado |
| --- | --- | --- |
| Enable memory | on | Interruptor maestro de las herramientas `noema_*`. |
| Memory guidance | on | Sección del prompt del sistema que enseña el uso de la memoria. |
| Start server at boot | on | Se inicia al arrancar DSH en lugar de en el primer uso. |
| Auto-accept new memories | on | `noema_remember` persiste de inmediato. |
| Server command | `bundled` | Binario `noema-mcp` incluido o una ruta/comando ejecutable personalizado. |
| Working directory | — | cwd para el servidor (necesario para `cargo run`). |
| Memory root (NOEMA_ROOT) | — | Dónde se almacenan las memorias; vacío = `~/.agent-memory`. |
| Recall token budget | 1200 | `budget_tokens` por defecto para `noema_recall`. |
| Idle timeout (ms) | 0 | Detiene el servidor tras inactividad; 0 = nunca. |
| Keep alive | on | Reinicia el servidor en segundo plano cuando falla o termina. |
| Keep-alive interval (ms) | 5000 | Retraso mínimo entre comprobaciones de salud en segundo plano. |
| Call timeout (ms) | 30000 | Plazo límite por llamada de herramienta. |
| Restart delay (ms) | 1000 | Retroceso entre una parada/fallo y el siguiente inicio. |

La tarjeta de estado muestra la salud del servidor con acciones de reiniciar/detener, y la sección de importación gestiona las nueve fuentes de memoria.

## Recarga en caliente

La maquinaria HMR de DSH es totalmente utilizable una vez que el plugin se ha cargado una vez:

- **Plugin anfitrión** — active la entrada Cordis HMR en el parche del perfil con su raíz de vigilancia apuntando a la salida `lib/` de este paquete y mantenga la dependencia `link:`. Ejecute `pnpm run build` y el DSH en ejecución recargará automáticamente la entrada del plugin (el proceso hijo del servidor Noema se reinicia con la recarga) — sin reiniciar el servidor.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Bundle de cliente** — `ppnpm run build:client` reescribe `lib/client.js`; la mitad node de client-hmr sondea periódicamente cada bundle de grafo (500 ms por defecto) y emite una trama `rebuilt` por el canal SSE `/plugins/events`, y el navegador intercambia el módulo en caliente sin recargar la página.
- **Ajustes** — cada cambio realizado en la página de ajustes de Noema Memory se aplica en vivo a través del servicio de ajustes.

Lo único que la recarga en caliente no puede hacer es cargar un plugin que nunca estuvo en el árbol arrancado: la composición en ejecución no vigila la capa de parche del perfil (la aplicación web no conecta `watchUserPatches`) ni expone una API de mutación del cargador (el RPC de inventario de plugins es de solo lectura). Por lo tanto, un plugin nuevo necesita exactamente un reinicio del servidor, tras lo cual el bucle anterior es totalmente en caliente.

## Desarrollar

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

La prueba e2e se ejecuta contra `noema/target/debug/noema-mcp` cuando está presente (de lo contrario se omite).

## Licencia

MIT
