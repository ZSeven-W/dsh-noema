<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>DeepSeek Harness를 위한 장기 메모리 — Noema 기반의, 영속적이고 검사 가능한 에이전트 메모리.</strong><br />
  <sub>작업 전 리콜 &bull; 9개 에이전트 도구에서 가져오기 &bull; 설정 페이지 메모리 관리 &bull; 크래시 키프얼라이브 &bull; 핫 리로드</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · 현재 플러그인 릴리스: <code>0.1.0-rc.1</code> · DSH <code>0.1.0-rc.6</code>으로 테스트됨</sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md"><b>한국어</b></a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — 메모리 설정 페이지" width="100%" />
</p>
<p align="center"><sub>Noema 메모리 설정 페이지 — 가져오기 소스, 메모리 관리, 실시간 서버 상태</sub></p>

## DSH Noema를 사용하는 이유

DSH Noema는 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)와 [Noema](https://github.com/ZSeven-W/noema)(코딩 에이전트를 위한 로컬 우선·비벡터 메모리 시스템)를 연결하여, 에이전트가 매 대화를 처음부터 시작하는 대신 세션 간에 영속적인 지식을 유지하도록 합니다.

<table>
<tr>
<td width="50%">

### 🧠 영속적 리콜

메모리는 `NOEMA_ROOT`(기본값 `~/.agent-memory/`) 아래에 검사 가능한 Markdown 파일로 영속화됩니다. `noema_recall`이 세션 시작 시 관련 컨텍스트를 불러오고, `noema_search`, `noema_browse`, `noema_catalog`, `noema_recall_graph`가 검색·탐색·감사를 담당합니다.

</td>
<td width="50%">

### 📥 다른 도구에서 가져오기

`noema_import`는 Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder 등 9개의 다른 AI 코딩 도구의 메모리 파일을 읽어 섹션으로 나눈 뒤 각각을 영속적인 메모리로 저장합니다. 콘텐츠 키 기반 원장이 실행 간, 그리고 파일을 공유하는 도구 간 중복을 제거합니다.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ 설정 페이지 관리

Noema 메모리 설정 페이지에서 서버 명령, 메모리 루트, 예산, 유휴/호출 타임아웃, 가이던스 섹션을 구성할 수 있습니다. 그리고 메모리 관리 카드에서 저장된 메모리를 직접 검색, 탐색, 추가, 검토, 삭제할 수 있습니다.

</td>
<td width="50%">

### 🩺 키프얼라이브

메모리 서버는 계속 가동됩니다. 유휴 타임아웃 기본값은 '없음'이며, 키프얼라이브 루프가 `noema-mcp` 자식 프로세스가 크래시하거나 종료될 때 백그라운드에서 재시작합니다. 체크 간격과 재시작 백오프는 설정할 수 있습니다.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 스마트 엔티티 추출

Noema의 추출 엔진은 jieba 단어 분할과 영어 고유명사, CJK 이름 및 기술 용어, 인용된 토픽, 반복 등의 고정밀 신호를 스톱워드 및 경로 필터와 결합하여 PageIndex 토픽 카탈로그를 깨끗하게 유지합니다.

</td>
<td width="50%">

### ⚡ 핫 리로드

최초 부팅 후에는 플러그인을 다시 시작할 필요가 없습니다. `pnpm run build`가 Cordis HMR을 통해 호스트 플러그인을 핫 리로드하고, `ppnpm run build:client`가 client-hmr SSE 채널을 통해 브라우저 번들을 핫 스왑합니다.

</td>
</tr>
</table>

## DSH에 설치하기

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

또는 소스 트리에서 바로 로컬 개발하는 경우:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` 프로토콜은 프로필 의존성을 이 리포지토리로 심볼릭 링크하므로 재빌드가 즉시 반영되고 Cordis HMR이 컴파일된 출력을 감시할 수 있습니다.

이 플러그인은 플랫폼별 선택적 npm 패키지를 통해 `noema-mcp` 바이너리를 번들합니다. 대신 직접 빌드하려면 번들된 `noema` 서브모듈 안에서 `cargo build --release -p noema-mcp`를 실행하거나, Server command 설정을 임의의 `noema-mcp` 빌드로 지정하세요.

## 메모리 도구

모델용 도구는 Noema MCP 표면을 그대로 반영합니다:

| 도구 | 설명 |
| --- | --- |
| `noema_recall` | 쿼리에 대한 관련 메모리를 토큰 예산과 함께 리콜합니다. |
| `noema_search` | 저장된 메모리에 대해 전체 텍스트 검색을 수행합니다. |
| `noema_browse` | 토픽 또는 엔티티에 대해 PageIndex 카탈로그를 탐색합니다. |
| `noema_catalog` | 전체 메모리 카탈로그를 마크다운으로 렌더링합니다. |
| `noema_recall_graph` | 링크와 공유 엔티티를 통한 멀티홉 리콜. |
| `noema_neighbors` | 메모리에서 그래프 한 홉을 이동합니다. |
| `noema_explain` | 메모리가 리콜되거나 리콜되지 않은 이유를 설명합니다. |
| `noema_remember` | 영속적인 사실, 결정, 제약 또는 선호도를 저장합니다. |
| `noema_review_list` | 보류 중인 검토 후보를 나열합니다. |
| `noema_review_decide` | 후보를 수락, 거부, 편집 또는 병합합니다. |
| `noema_forget` | 메모리를 툼스톤 처리하거나 완전히 삭제합니다. |
| `noema_policy_get` / `noema_policy_set` | 쓰기 정책을 읽거나 업데이트합니다. |
| `noema_status` | 서버 및 테넌트 상태: 개수, 인덱스 상태, 저장소 루트. |
| `noema_import` | 다른 AI 코딩 도구에서 메모리를 가져옵니다. |

각 도구는 통일된 엔벨로프 `{ ok, tool, text }`를 반환하며, `text`가 전체 서버 출력을 담습니다.

## 다른 도구에서 메모리 가져오기

| 소스 id | 전역 파일 | 작업공간 파일 |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + Codex 메모리 파이프라인: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` 건너뜀 — 선별되지 않은 피드임) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + Grok 크로스 세션 메모리: `~/.grok/memory/MEMORY.md`, 프로젝트별 `MEMORY.md`, 그리고 `sessions/*.md` 요약 | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (WorkBuddy 메모리 파일), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (최선 노력. 아직 문서화된 전역 메모리 저장소가 없음) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (`~/.trae-cn` 변형 포함) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, 자동 메모리 루트 `~/.qoder-cn/memory/` 및 `~/.qoder-cn/projects/*/memory/` (`~/.qoder` 변형 포함) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |

- `source` 인자는 하나의 도구를 선택하며, 생략하면 설정에서 활성화된 모든 소스를 실행합니다.
- `path` 인자는 프로젝트 범위 파일에 대한 작업공간 루트를 선택합니다(기본값은 세션 작업공간이며, 작업공간 파일은 Import workspace files 설정이 켜져 있을 때만 로드됩니다).
- 가져오기는 `$DSH_HOME/storages/dsh-noema-imports.json`의 원장을 통해 중복 제거되며, 파일 경로 + 섹션 내용을 키로 사용합니다 — 여러 도구가 하나의 프로젝트 `AGENTS.md`를 공유하면 각 섹션은 정확히 한 번만 가져옵니다. `force: true`는 모든 것을 다시 가져옵니다.
- 설정 페이지에는 소스별 체크박스, 시작 시 가져오기 토글, 파일 크기 상한, 그리고 마지막 실행 요약이 있는 지금 가져오기 버튼이 있습니다.

## 설정

**설정 → Noema 메모리**를 엽니다:

| 설정 | 기본값 | 설명 |
| --- | --- | --- |
| Enable memory | 켬 | `noema_*` 도구의 마스터 스위치. |
| Memory guidance | 켬 | 메모리 사용법을 가르치는 시스템 프롬프트 섹션. |
| Start server at boot | 켬 | 처음 사용할 때가 아니라 DSH 시작 시 서버를 생성합니다. |
| Auto-accept new memories | 켬 | `noema_remember`가 즉시 영속화됩니다. |
| Server command | `bundled` | 번들된 `noema-mcp` 바이너리 또는 사용자 지정 실행 파일 경로/명령. |
| Working directory | — | 서버의 cwd(`cargo run`에 필요). |
| Memory root (NOEMA_ROOT) | — | 메모리가 저장되는 위치. 비어 있으면 = `~/.agent-memory`. |
| Recall token budget | 1200 | `noema_recall`의 기본 `budget_tokens`. |
| Idle timeout (ms) | 0 | 유휴 상태 후 서버를 중지합니다. 0 = 중지 안 함. |
| Keep alive | 켬 | 서버가 크래시하거나 종료될 때 백그라운드에서 재시작합니다. |
| Keep-alive interval (ms) | 5000 | 백그라운드 상태 확인 사이의 최소 지연. |
| Call timeout (ms) | 30000 | 도구 호출별 제한 시간. |
| Restart delay (ms) | 1000 | 중지/크래시와 다음 시작 사이의 백오프. |

상태 카드는 재시작/중지 동작과 함께 서버 상태를 표시하고, 가져오기 섹션은 9개의 메모리 소스를 관리합니다.

## 핫 리로드

플러그인이 한 번 로드되면 DSH의 HMR 기반 시설을 완전히 사용할 수 있습니다.

- **호스트 플러그인** — 프로필 패치에서 Cordis HMR 항목을 활성화하고 watch root를 이 패키지의 `lib/` 출력으로 지정한 뒤, `link:` 의존성을 유지합니다. `pnpm run build`를 실행하면 실행 중인 DSH가 플러그인 항목을 자동으로 다시 로드합니다(리로드 시 Noema 서버 자식 프로세스도 재시작됨) — 서버 재시작이 필요 없습니다.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **클라이언트 번들** — `ppnpm run build:client`가 `lib/client.js`를 다시 씁니다. client-hmr 노드 쪽은 각 graph 번들을 stat 폴링(기본 500ms)하고 `/plugins/events` SSE 채널을 통해 `rebuilt` 프레임을 브로드캐스트하며, 브라우저는 페이지 새로고침 없이 모듈을 핫 스왑합니다.
- **설정** — Noema 메모리 설정 페이지에서 변경한 모든 내용은 settings 서비스를 통해 즉시 적용됩니다.

핫 리로드가 하지 못하는 유일한 일은 부팅된 트리에 한 번도 없었던 플러그인을 로드하는 것입니다. 실행 중인 composition은 프로필 패치 레이어를 감시하지 않으며(웹 앱이 `watchUserPatches`를 연결하지 않음), 로더 변경 API도 노출하지 않습니다(플러그인 인벤토리 RPC는 읽기 전용입니다). 따라서 새 플러그인에는 정확히 한 번의 서버 재시작이 필요하고, 그 후에는 위 루프가 완전히 핫하게 동작합니다.

## 개발

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

e2e 테스트는 `noema/target/debug/noema-mcp`가 있으면 그것을 대상으로 실행됩니다(없으면 건너뜁니다).

## 라이선스

MIT
