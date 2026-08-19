<p align="center">
  <img src="./docs/images/dsh-noema-logo.png" alt="DSH Noema" width="120" />
</p>

<h1 align="center">DSH Noema</h1>

<p align="center">
  <strong>Memória de longo prazo para o DeepSeek Harness — memória de agente duradoura e inspecionável, baseada no Noema.</strong><br />
  <sub>Recordar antes de trabalhar &bull; Importar de 9 ferramentas de agente &bull; Gestão de memória na página de definições &bull; Keep-alive contra falhas &bull; Hot reload</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><code>@zseven-w/dsh-noema</code></a> · Versão atual do plugin: <code>0.1.0-rc.2</code> · Testado com DSH <code>0.1.0-rc.6</code></sub>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh.md">简体中文</a> · <a href="./README.zh-TW.md">繁體中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.fr.md">Français</a> · <a href="./README.es.md">Español</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.pt.md"><b>Português</b></a> · <a href="./README.ru.md">Русский</a> · <a href="./README.hi.md">हिन्दी</a> · <a href="./README.tr.md">Türkçe</a> · <a href="./README.th.md">ไทย</a> · <a href="./README.vi.md">Tiếng Việt</a> · <a href="./README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zseven-w/dsh-noema"><img src="https://img.shields.io/npm/v/%40zseven-w%2Fdsh-noema?style=flat&color=cfb537" alt="npm" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/stargazers"><img src="https://img.shields.io/github/stars/ZSeven-W/dsh-noema?style=flat&color=cfb537" alt="Stars" /></a>
  <a href="https://github.com/ZSeven-W/dsh-noema/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZSeven-W/dsh-noema?color=64748b" alt="License" /></a>
</p>

<br />

<p align="center">
  <img src="./docs/images/dsh-noema-overview.png" alt="DSH Noema — página de configurações de memória" width="100%" />
</p>
<p align="center"><sub>A página de configurações do Noema Memory — fontes de importação, gestão de memórias e estado do servidor em tempo real</sub></p>

## Porquê o DSH Noema

O DSH Noema liga o [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) ao [Noema](https://github.com/ZSeven-W/noema) — um sistema de memória local-first e não vetorial para agentes de programação — para que um agente mantenha conhecimento duradouro entre sessões, em vez de começar cada conversa do zero.

<table>
<tr>
<td width="50%">

### 🧠 Recordação duradoura

As memórias persistem como ficheiros Markdown inspecionáveis sob `NOEMA_ROOT` (predefinição `~/.agent-memory/`). O `noema_recall` carrega o contexto relevante no início de uma sessão; o `noema_search`, o `noema_browse`, o `noema_catalog` e o `noema_recall_graph` cobrem a pesquisa, a exploração e a auditoria.

</td>
<td width="50%">

### 📥 Importar de outras ferramentas

O `noema_import` lê os ficheiros de memória de dez outras ferramentas de programação com IA — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes —, divide-os em secções e guarda cada uma como uma memória duradoura. Um registo (ledger) indexado por conteúdo elimina duplicados entre execuções e entre ferramentas que partilham ficheiros.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Gestão na página de definições

A página de definições Noema Memory configura o comando do servidor, a raiz da memória, os orçamentos, os tempos limite de inatividade/chamada e a secção de orientação — e um cartão «Gerir memórias» pesquisa, explora, adiciona, revê e elimina diretamente as memórias armazenadas.

</td>
<td width="50%">

### 🩺 Keep-alive

O servidor de memória mantém-se ativo: o tempo limite de inatividade é, por predefinição, nunca, e um ciclo keep-alive reinicia o processo filho `noema-mcp` em segundo plano quando este falha ou termina, com um intervalo de verificação e um backoff de reinício configuráveis.

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Extração inteligente de entidades

O motor de extração do Noema combina a segmentação de palavras jieba com sinais de alta precisão — nomes próprios ingleses, nomes e termos técnicos CJK, tópicos entre aspas e repetição — com filtros de palavras vazias e de caminhos, para que o catálogo de tópicos do PageIndex se mantenha limpo.

</td>
<td width="50%">

### ⚡ Hot reload

Após o primeiro arranque, o plugin nunca mais precisa de ser reiniciado: `pnpm run build` recarrega o plugin do host através do Cordis HMR, e `ppnpm run build:client` troca o bundle do navegador a quente através do canal SSE do client-hmr.

</td>
</tr>
</table>

## Instalar no DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Ou, para desenvolvimento local diretamente a partir da árvore de código-fonte:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

O protocolo `link:` cria uma ligação simbólica da dependência do perfil para este repositório, para que as reconstruções sejam visíveis imediatamente e o Cordis HMR possa vigiar o output compilado.

O plugin inclui o binário `noema-mcp` através de pacotes npm opcionais por plataforma. Para o compilares tu próprio, executa `cargo build --release -p noema-mcp` dentro do submódulo `noema` incluído, ou aponta a definição «Comando do servidor» para qualquer build do `noema-mcp`.

## Ferramentas de memória

As ferramentas voltadas para o modelo espelham a superfície Noema MCP:

| Ferramenta | O que faz |
| --- | --- |
| `noema_recall` | Recorda memórias relevantes para uma consulta, com um orçamento de tokens. |
| `noema_search` | Pesquisa de texto integral sobre as memórias armazenadas. |
| `noema_browse` | Explora o catálogo PageIndex de um tópico ou entidade. |
| `noema_catalog` | Renderiza o catálogo completo de memórias como markdown. |
| `noema_recall_graph` | Recordação multi-salto através de ligações e entidades partilhadas. |
| `noema_neighbors` | Um salto no grafo a partir de uma memória. |
| `noema_explain` | Explica porque é que uma memória foi ou não recordada. |
| `noema_remember` | Guarda um facto, decisão, restrição ou preferência duradouros. |
| `noema_review_list` | Lista os candidatos de revisão pendentes. |
| `noema_review_decide` | Aceita, rejeita, edita ou funde um candidato. |
| `noema_forget` | Marca como eliminada ou elimina definitivamente uma memória. |
| `noema_policy_get` / `noema_policy_set` | Lê ou atualiza a política de escrita. |
| `noema_status` | Estado do servidor e do tenant: contagens, saúde do índice, raiz de armazenamento. |
| `noema_import` | Importa memórias de outras ferramentas de programação com IA. |

Cada ferramenta devolve um envelope uniforme `{ ok, tool, text }`, em que `text` transporta toda a saída do servidor.

## Importar memórias de outras ferramentas

| ID da origem | Ficheiros globais | Ficheiros do workspace |
| --- | --- | --- |
| `codex` | `~/.codex/AGENTS.md` + o pipeline de memória do Codex: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` ignorado — é o feed não curado) | `AGENTS.md`, `AGENTS.local.md` |
| `claude-code` | `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` | `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md` |
| `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` |
| `cursor` | `~/.cursor/rules/*.mdc`, `~/.cursorrules` | `.cursor/rules/*.mdc`, `.cursorrules` |
| `grok` | `~/.grok/AGENTS.md` + a memória entre sessões do Grok: `~/.grok/memory/MEMORY.md`, `MEMORY.md` por projeto e resumos `sessions/*.md` | `AGENTS.md` |
| `workbuddy` | `~/.codebuddy/CODEBUDDY.md` (ficheiro de memória do WorkBuddy), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` | `AGENTS.md`, `CODEBUDDY.md` |
| `antigravity` | `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (melhor esforço; ainda sem armazenamento global de memória documentado) | `AGENTS.md`, `AGENTS.local.md` |
| `trae` | `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (mais as variantes `~/.trae-cn`) | `AGENTS.md`, `.trae/rules/` |
| `qoder` | `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, as raízes de memória automática `~/.qoder-cn/memory/` e `~/.qoder-cn/projects/*/memory/` (mais as variantes `~/.qoder`) | `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/` |
| `hermes` | `~/.hermes/memories/` (`MEMORY.md` + `USER.md`) e o ficheiro global `~/.hermes/SOUL.md` | `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md` |

- O argumento `source` seleciona uma ferramenta; omite-o para executar todas as origens ativadas nas definições.
- O argumento `path` seleciona a raiz do workspace para ficheiros de âmbito do projeto (predefinição: o workspace da sessão; os ficheiros do workspace só são carregados quando a definição «Importar ficheiros do workspace» está ativada).
- As importações são deduplicadas através de um registo em `$DSH_HOME/storages/dsh-noema-imports.json`, indexado por caminho do ficheiro + conteúdo da secção — quando várias ferramentas partilham um `AGENTS.md` de projeto, cada secção é importada exatamente uma vez. `force: true` reimporta tudo.
- A página de definições expõe caixas de seleção por origem, um interruptor de importação no arranque, um limite de tamanho de ficheiro e um botão «Importar agora» com um resumo da última execução.

## Definições

Abre **Definições → Noema Memory**:

| Definição | Predefinição | Significado |
| --- | --- | --- |
| Ativar memória | ligado | Interruptor principal para as ferramentas `noema_*`. |
| Orientação de memória | ligado | Secção do prompt de sistema que ensina a utilização da memória. |
| Iniciar servidor no arranque | ligado | Inicia no arranque do DSH em vez de na primeira utilização. |
| Aceitar novas memórias automaticamente | ligado | O `noema_remember` persiste imediatamente. |
| Comando do servidor | `bundled` | Binário `noema-mcp` incluído ou um caminho/comando executável personalizado. |
| Diretório de trabalho | — | cwd do servidor (necessário para `cargo run`). |
| Raiz da memória (NOEMA_ROOT) | — | Onde as memórias são armazenadas; vazio = `~/.agent-memory`. |
| Orçamento de tokens de recordação | 1200 | `budget_tokens` predefinido para o `noema_recall`. |
| Tempo limite de inatividade (ms) | 0 | Para o servidor após inatividade; 0 = nunca. |
| Keep alive | ligado | Reinicia o servidor em segundo plano quando este falha ou termina. |
| Intervalo keep-alive (ms) | 5000 | Atraso mínimo entre verificações de saúde em segundo plano. |
| Tempo limite de chamada (ms) | 30000 | Prazo por chamada de ferramenta. |
| Atraso de reinício (ms) | 1000 | Backoff entre uma paragem/falha e o arranque seguinte. |

O cartão de estado mostra a saúde do servidor com ações de reiniciar/parar, e a secção de importação gere as nove origens de memória.

## Hot reload

A mecânica de HMR do DSH fica totalmente utilizável assim que o plugin tiver sido carregado uma vez:

- **Plugin do host** — ativa a entrada Cordis HMR no patch do perfil com a raiz de vigilância apontada para o output `lib/` deste pacote e mantém a dependência `link:`. Executa `pnpm run build` e o DSH em execução recarrega automaticamente a entrada do plugin (o processo filho do servidor Noema é reiniciado pelo recarregamento) — sem reiniciar o servidor.

  ```yaml
  # ~/.dsh/profiles/<profile>/cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Bundle do cliente** — `ppnpm run build:client` reescreve `lib/client.js`; a metade Node do client-hmr faz stat-polling de cada bundle do grafo (predefinição 500 ms) e transmite um frame `rebuilt` pelo canal SSE `/plugins/events`, e o navegador troca o módulo a quente sem atualizar a página.
- **Definições** — todas as alterações feitas na página de definições Noema Memory são aplicadas em tempo real através do serviço de definições.

A única coisa que o hot reload não consegue fazer é carregar um plugin que nunca esteve na árvore iniciada: a composição em execução nem vigia a camada de patch do perfil (a aplicação web não liga o `watchUserPatches`) nem expõe uma API de mutação do carregador (o RPC do inventário de plugins é só de leitura). Um plugin novo precisa, portanto, de exatamente um reinício do servidor, após o qual o ciclo acima fica totalmente a quente.

## Desenvolvimento

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

O teste e2e corre contra `noema/target/debug/noema-mcp` quando presente (caso contrário, é ignorado).

## Licença

MIT
