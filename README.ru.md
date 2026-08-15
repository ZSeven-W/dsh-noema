<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Долговременная память для DeepSeek Harness — надёжная, проверяемая память агента на базе Noema.</strong><br />
  <sub>Вспоминание до начала работы &bull; Импорт из 9 агентных инструментов &bull; Управление памятью на странице настроек &bull; Поддержание работы после сбоев &bull; Горячая перезагрузка</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Текущий выпуск плагина: <code>0.1.0-rc.1</code> · Проверено с DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md"><b>Русский</b></a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — страница настроек памяти" width="100%" />
</p>
<p align="center"><sub>Страница настроек Noema Memory — источники импорта, управление памятью и живой статус сервера</sub></p>

## Зачем нужен DSH Noema

DSH Noema связывает [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) с [Noema](https://github.com/ZSeven-W/noema) — локальной, невекторной системой памяти для агентов программирования, — чтобы агент сохранял долговечные знания между сессиями, а не начинал каждый разговор с нуля.

<table>
<tr>
<td width="50%">

### 🧠 Долговечное вспоминание

Воспоминания хранятся как проверяемые Markdown-файлы в `NOEMA_ROOT` (по умолчанию `~/.agent-memory/`). `noema_recall` загружает релевантный контекст в начале сессии; `noema_search`, `noema_browse`, `noema_catalog` и `noema_recall_graph` отвечают за поиск, исследование и аудит.

</td>
<td width="50%">

### 📥 Импорт из других инструментов

`noema_import` читает файлы памяти девяти других ИИ-инструментов программирования — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder — разделяет их на секции и сохраняет каждую как долговечное воспоминание. Реестр с ключом по содержимому устраняет дубликаты между запусками и между инструментами, использующими общие файлы.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Управление на странице настроек

Страница настроек Noema Memory настраивает команду сервера, корень памяти, бюджеты, тайм-ауты простоя/вызовов и раздел инструкций — а карточка «Управление воспоминаниями» позволяет напрямую искать, просматривать, добавлять, проверять и удалять сохранённые воспоминания.

</td>
<td width="50%">

### 🩺 Поддержание работы

Сервер памяти остаётся запущенным: тайм-аут простоя по умолчанию отключён, а цикл поддержания работы перезапускает дочерний `noema-mcp` в фоновом режиме при сбое или завершении, с настраиваемым интервалом проверки и задержкой перезапуска.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Умное извлечение сущностей

Движок извлечения Noema сочетает сегментацию слов jieba с высокоточными сигналами — английские имена собственные, имена и технические термины на CJK, темы в кавычках и повторения — с фильтрами стоп-слов и путей, благодаря чему каталог тем PageIndex остаётся чистым.

</td>
<td width="50%">

### ⚡ Горячая перезагрузка

После первого запуска плагину больше никогда не требуется перезапуск: `pnpm run build` горячо перезагружает хостовый плагин через Cordis HMR, а `ppnpm run build:client` горячо подменяет браузерный бандл по SSE-каналу client-hmr.

</td>
</tr>
</table>

## Установка в DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Или, для локальной разработки прямо из дерева исходников:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

Протокол `link:` создаёт символическую ссылку зависимости профиля на этот репозиторий, поэтому пересборки видны сразу, и Cordis HMR может отслеживать скомпилированный вывод.

Плагин включает бинарник `noema-mcp` через необязательные npm-пакеты для каждой платформы. Чтобы собрать его самостоятельно, выполните `cargo build --release -p noema-mcp` внутри входящего в состав подмодуля `noema` или укажите в настройке Server command любой собранный `noema-mcp`.

## Инструменты памяти

Инструменты, обращённые к модели, повторяют поверхность Noema MCP:

| Инструмент | Что он делает |
| --- | --- |
| `noema_recall` | Вспоминает релевантные воспоминания по запросу с бюджетом токенов. |
| `noema_search` | Полнотекстовый поиск по сохранённым воспоминаниям. |
| `noema_browse` | Просматривает каталог PageIndex по теме или сущности. |
| `noema_catalog` | Выводит весь каталог памяти как markdown. |
| `noema_recall_graph` | Многошаговое вспоминание через связи и общие сущности. |
| `noema_neighbors` | Один шаг по графу от воспоминания. |
| `noema_explain` | Объясняет, почему воспоминание было или не было вспомнено. |
| `noema_remember` | Сохраняет долговечный факт, решение, ограничение или предпочтение. |
| `noema_review_list` | Перечисляет кандидатов, ожидающих проверки. |
| `noema_review_decide` | Принимает, отклоняет, редактирует или объединяет кандидата. |
| `noema_forget` | Помечает надгробием или полностью удаляет воспоминание. |
| `noema_policy_get` / `noema_policy_set` | Читает или обновляет политику записи. |
| `noema_status` | Статус сервера и арендатора: счётчики, здоровье индекса, корень хранилища. |
| `noema_import` | Импортирует воспоминания из других ИИ-инструментов программирования. |

Каждый инструмент возвращает единый конверт `{ ok, tool, text }`, где `text` несёт полный вывод сервера.

## Импорт воспоминаний из других инструментов

| Идентификатор источника | Глобальные файлы | Файлы рабочей области |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + конвейер памяти Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` пропускается — это некурируемая лента) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + кросс-сессионная память Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` по проектам и сводки `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (файл памяти WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (по мере возможности; документированного глобального хранилища памяти пока нет) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (плюс варианты `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, корни автопамяти `~/.qoder-cn/memory/` и `~/.qoder-cn/projects/*/memory/` (плюс варианты `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |

- Аргумент `source` выбирает один инструмент; опустите его, чтобы запустить все источники, включённые в настройках.
- Аргумент `path` выбирает корень рабочей области для файлов на уровне проекта (по умолчанию — рабочая область сессии; файлы рабочей области загружаются только когда включена настройка Import workspace files).
- Импорты дедуплицируются через реестр по пути `$DSH_HOME/storages/dsh-noema-imports.json` с ключом «путь к файлу + содержимое секции» — когда несколько инструментов используют один и тот же проектный `AGENTS.md`, каждая секция импортируется ровно один раз. `force: true` импортирует всё заново.
- Страница настроек предоставляет флажки для каждого источника, переключатель импорта при запуске, лимит размера файла и кнопку «Импортировать сейчас» со сводкой последнего запуска.

## Настройки

Откройте **Настройки → Noema Memory**:

| Настройка | По умолчанию | Значение |
| --- | --- | --- |
| Включить память | вкл | Главный переключатель для инструментов `noema_*`. |
| Инструкции по памяти | вкл | Раздел системного промпта, обучающий использованию памяти. |
| Запускать сервер при старте | вкл | Запускать при старте DSH, а не при первом использовании. |
| Автоматически принимать новые воспоминания | вкл | `noema_remember` сохраняет сразу. |
| Команда сервера | `bundled` | Входящий бинарник `noema-mcp` или пользовательский путь/команда исполняемого файла. |
| Рабочий каталог | — | cwd для сервера (нужен для `cargo run`). |
| Корень памяти (NOEMA_ROOT) | — | Где хранятся воспоминания; пусто = `~/.agent-memory`. |
| Бюджет токенов вспоминания | 1200 | `budget_tokens` по умолчанию для `noema_recall`. |
| Тайм-аут простоя (ms) | 0 | Останавливать сервер после простоя; 0 = никогда. |
| Поддержание работы | вкл | Перезапускать сервер в фоновом режиме при сбое или завершении. |
| Интервал поддержания (ms) | 5000 | Минимальная задержка между фоновыми проверками здоровья. |
| Тайм-аут вызова (ms) | 30000 | Предельный срок одного вызова инструмента. |
| Задержка перезапуска (ms) | 1000 | Откат между остановкой/сбоем и следующим запуском. |

Карточка статуса показывает здоровье сервера с действиями перезапуска/остановки, а раздел импорта управляет девятью источниками памяти.

## Горячая перезагрузка

Механизм HMR в DSH полностью пригоден к использованию после того, как плагин был загружен хотя бы раз:

- **Хостовый плагин** — включите запись Cordis HMR в patch профиля, указав корень наблюдения на вывод `lib/` этого пакета, и сохраните зависимость `link:`. Выполните `pnpm run build`, и работающий DSH автоматически перезагрузит запись плагина (дочерний сервер Noema перезапускается при перезагрузке) — без перезапуска сервера.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Клиентский бандл** — `ppnpm run build:client` переписывает `lib/client.js`; часть client-hmr на стороне node периодически опрашивает каждый graph-бандл (по умолчанию 500 мс) и транслирует кадр `rebuilt` по SSE-каналу `/plugins/events`, а браузер горячо подменяет модуль без перезагрузки страницы.
- **Настройки** — каждое изменение на странице настроек Noema Memory применяется в реальном времени через сервис настроек.

Единственное, чего горячая перезагрузка не может, — загрузить плагин, которого никогда не было в загруженном дереве: работающая композиция не следит за слоем patch профиля (веб-приложение не подключает `watchUserPatches`) и не предоставляет API изменения загрузчика (RPC инвентаря плагинов доступен только для чтения). Поэтому свежий плагин требует ровно одного перезапуска сервера, после чего описанный выше цикл полностью горячий.

## Разработка

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

e2e-тест запускается против `noema/target/debug/noema-mcp`, когда он присутствует (иначе пропускается).

## Лицензия

MIT
