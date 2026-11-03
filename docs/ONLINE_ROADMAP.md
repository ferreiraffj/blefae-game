# Roadmap do modo online

> Status: **não implementado**. Este documento descreve a arquitetura recomendada para a próxima
> etapa: cada jogador usando o próprio celular, em vez de passar um único aparelho.

## 1. Objetivo

Transformar o Blefaê em um jogo **multiplayer por sala**, mantendo o modo local atual como fallback.

Requisitos funcionais:

- Criar sala e entrar por **código curto** ou **QR Code**.
- De 3 a 12 jogadores, cada um no próprio dispositivo.
- O host configura tema, rodadas, pontuação e modo de palpite.
- O servidor sorteia impostor, palavra e ordem de fala.
- Cada jogador vê o próprio papel **somente no próprio aparelho**.
- Votação simultânea e secreta, sem voto em si mesmo.
- Resultado, palpite do impostor e pontuação sincronizados.
- Reconexão após queda de rede ou troca de aba.
- Troca automática de host se o host sair.
- Nenhum jogador consegue descobrir a palavra secreta pelo DevTools, pela rede ou pelo estado público.

Requisitos não funcionais:

- Baixa latência (idealmente < 150 ms no Brasil).
- Sala efêmera, sem cadastro obrigatório.
- Custo próximo de zero em uso casual.
- Frontend continua estático e instalável como PWA.

---

## 2. Recomendação de arquitetura

### 2.1. Visão geral

```text
┌──────────────────────┐        WSS         ┌──────────────────────────┐
│  PWA (Vercel/CF)     │ ─────────────────► │  Servidor de salas        │
│  React + game-core   │ ◄───────────────── │  autoritativo             │
└──────────────────────┘   snapshots/eventos └──────────────────────────┘
          │                                              │
          │ localStorage (token, preferências)           │ storage efêmero
          ▼                                              ▼
   jogador reconecta                             sala por 24 h / TTL
```

- **Frontend:** continua na Vercel ou Cloudflare Pages, servindo o build do Vite.
- **Servidor de salas:** WebSocket autoritativo, uma instância por sala.
- **Fonte da verdade:** o servidor. O cliente envia **intenções** (`vote`, `guess`, `ready`) e recebe
  **snapshots** versionados. O cliente nunca calcula o resultado oficial.
- **Persistência:** o próprio servidor de salas guarda o snapshot da partida para reconexão. Banco de
  dados só é necessário para histórico, contas ou ranking.

### 2.2. Tecnologia recomendada

**Cloudflare Durable Objects** (direto ou via **PartyKit**) é o encaixe mais natural:

- Cada sala vira um Durable Object isolado, com estado em memória e armazenamento persistente.
- WebSocket nativo, sem servidor sempre ligado para gerenciar.
- Escala por sala, não por processo global.
- TTL/alarm para expirar salas e limpar estado.
- Combina com o frontend estático na Cloudflare Pages ou na Vercel.
- O código do domínio pode ser compartilhado entre React e Worker.

Alternativa: **Supabase Realtime**.

- Excelente para um MVP rápido com Postgres, Auth e RLS.
- O ponto delicado é o **segredo por jogador**. Broadcast e Presence são públicos para o canal;
  enviar a palavra apenas ao jogador certo exige canais privados por jogador, Edge Functions ou
  tabelas com RLS bem desenhadas. É possível, mas mais trabalhoso do que um socket autoritativo.

Alternativa: **Node.js + Socket.IO** em Fly.io/Render/Railway.

- Máxima familiaridade e liberdade.
- Exige um processo sempre disponível, health check e gestão de memória; free tiers costumam dormir
  ou ter limites apertados. Não é a melhor relação esforço/custo para salas efêmeras.

### 2.3. Decisão sugerida

1. **Curto prazo:** PartyKit ou Durable Objects direto na Cloudflare.
2. **Se houver necessidade de login, histórico e painel:** adicionar Supabase apenas para
   identidade/histórico, mantendo o tempo real no Durable Object.
3. **Frontend:** manter na Vercel se o deploy atual já estiver bom; mover para Cloudflare Pages
   apenas se isso simplificar o domínio/roteamento.

> Free tiers mudam com frequência. Antes de escolher, confira os limites atuais de Durable Objects,
> PartyKit, Supabase e Vercel, principalmente requisições, duração de conexão e armazenamento.

---

## 3. Modelo de sala

```ts
type RoomPhase =
  | 'LOBBY'
  | 'REVEAL'
  | 'SPEAKING'
  | 'VOTING'
  | 'RESULT'
  | 'GUESS'
  | 'GUESS_CONFIRMATION'
  | 'SCORE'
  | 'ROUND_TRANSITION'
  | 'FINISHED'

interface RoomState {
  code: string                  // ex.: "K7M2Q"
  version: number               // incrementa a cada transição
  phase: RoomPhase
  hostId: string
  createdAt: number
  expiresAt: number
  players: PublicPlayer[]       // nunca inclui papel ou palavra
  round: number
  totalRounds: number
  theme: string
  scoreConfig: ScoreConfig
  guessMode: 'typing' | 'multiple'
  speakerOrder: string[]
  votes: Record<string, string>
  guessOptions: string[]        // apenas no modo múltipla escolha
  guess: string | null          // público apenas depois da revelação
  guessCorrect: boolean | null
  lastRoundPoints: Record<string, number>
  usedWords: string[]
}

interface PublicPlayer {
  id: string
  name: string
  points: number
  connected: boolean
  ready: boolean
}
```

Estado **privado**, mantido apenas no servidor e enviado por socket individual:

```ts
interface PrivateRole {
  isImpostor: boolean
  word: string | null   // null para o impostor
}
```

Regras de ouro:

- `word` e `impostorId` **nunca** entram no snapshot público antes da fase de resultado.
- O impostor recebe `{ isImpostor: true, word: null }`.
- Civis recebem `{ isImpostor: false, word }`.
- O cliente não deve conseguir derivar o impostor pelo tamanho da mensagem, por campos extras ou por
  eventos de broadcast. Use mensagens unicast e payloads de tamanho uniforme quando possível.

---

## 4. Protocolo de eventos

### 4.1. Cliente → servidor

| Evento | Payload | Autorização |
| --- | --- | --- |
| `room:create` | `{ name, theme, rounds, scoreConfig, guessMode }` | aberto |
| `room:join` | `{ code, name, token? }` | sala em lobby ou reconexão |
| `player:ready` | `{ ready }` | jogador da sala |
| `game:start` | `{}` | host, todos prontos, 3–12 jogadores |
| `role:ack` | `{}` | jogador da vez (revelação) |
| `speaking:done` | `{}` | host |
| `vote:cast` | `{ targetId }` | jogador que ainda não votou; alvo ≠ ele mesmo |
| `guess:submit` | `{ guess }` | apenas o impostor, fase `GUESS` |
| `guess:confirm` | `{ accepted }` | host ou votação dos civis, fase `GUESS_CONFIRMATION` |
| `round:next` | `{ theme? }` | host, fase `ROUND_TRANSITION` |
| `game:reset` | `{}` | host, fase `FINISHED` |
| `player:leave` | `{}` | jogador da sala |
| `room:ping` | `{}` | qualquer conexão |

### 4.2. Servidor → cliente

| Evento | Destino | Conteúdo |
| --- | --- | --- |
| `room:state` | todos | snapshot público + `version` + `you` |
| `role:private` | **um socket** | `{ isImpostor, word }` |
| `room:error` | um socket | `{ code, message }` |
| `room:closed` | todos | motivo e tempo de expiração |
| `host:changed` | todos | novo `hostId` |
| `player:presence` | todos | entrou/saiu/reconectou |

### 4.3. Versionamento

- Cada transição gera `version + 1`.
- O cliente ignora snapshots com versão menor que a atual.
- Se o cliente detectar um salto de versão, ele apenas renderiza o snapshot mais recente; não tenta
  “reproduzir” eventos perdidos.
- Ações do cliente carregam a versão esperada quando forem sensíveis (ex.: voto). Se estiver
  defasada, o servidor responde com o snapshot atual e um erro recuperável.

---

## 5. Fluxo de jogo online

```text
Host cria sala
  └─ servidor gera código + QR
Jogadores entram e marcam "pronto"
  └─ host inicia
Servidor sorteia impostor, palavra e ordem de fala
  └─ cada jogador recebe seu papel no próprio socket
Todos confirmam que viram o papel
  └─ host libera a rodada de dicas
Todos veem a ordem de fala; cronômetro opcional
  └─ host libera a votação
Cada jogador vota em segredo, simultaneamente
  └─ servidor valida e calcula
Servidor revela impostor + placar da votação
  └─ se houve voto no impostor, ele recebe a chance de palpite
Palpite (texto ou múltipla escolha) apenas no dispositivo do impostor
  └─ validação: host decide ou civis votam (definir na configuração)
Servidor calcula pontos e envia placar
  └─ host mantém/troca o tema
Próxima rodada ou ranking final
```

### 5.1. Revelação privada

No modo local, o aparelho passa de mão em mão. No online:

- Cada jogador toca em **“Ver meu papel”** e o servidor envia `role:private` somente ao socket dele.
- A tela pode ser reaberta enquanto a fase de revelação estiver ativa.
- O host vê apenas “X de Y confirmaram”; nunca vê o papel dos outros.
- O servidor pode exigir `role:ack` de todos para avançar (recomendado).

### 5.2. Votação

- Votos são enviados ao servidor e **não** aparecem no snapshot público até todos votarem.
- O servidor rejeita voto em si mesmo, voto duplicado, alvo inexistente e voto fora de fase.
- Para evitar “voto por eliminação” em salas pequenas, o cliente só mostra os outros jogadores.
- Resultado oficial usa `calculateRoundPoints` do domínio compartilhado.

### 5.3. Palpite do impostor

- O evento `guess:submit` só é aceito do socket do impostor.
- No modo digitação, o servidor aplica `evaluateGuess` e, se `isLikelyTypo`, entra em
  `GUESS_CONFIRMATION`.
- A confirmação pode ser:
  - **Host decide** (simples e rápido), ou
  - **Civis votam** (mais justo, porém mais uma rodada de cliques).
- O palpite e a palavra só se tornam públicos na fase de pontuação.

---

## 6. Reconexão, presença e host

- No `join`, o cliente envia um `token` opaco salvo em `sessionStorage`/`localStorage` por sala.
- O servidor associa o token ao jogador e substitui o socket antigo.
- Janela de graça de **2 a 5 minutos** antes de marcar o jogador como ausente.
- Se o host cair:
  - aguardar reconexão por 60–120 s;
  - depois promover o jogador conectado mais antigo;
  - emitir `host:changed` e atualizar a interface.
- Se um jogador sair no meio da partida:
  - em `LOBBY`, remover;
  - em partida, manter como ausente para não quebrar votação/ordem de fala;
  - permitir que o host encerre a sala.
- A sala expira por inatividade (ex.: 24 h) via alarme/TTL e libera memória.

---

## 7. Segurança e anticheat

O modo online não precisa ser à prova de trapaça absoluta — é um jogo social —, mas o servidor deve
impedir que o segredo vaze por acidente e que um cliente manipule o placar.

Checklist:

- [ ] Palavra e impostor **somente** no servidor e em mensagens unicast.
- [ ] Nenhum campo privado no snapshot público, no HTML, no `localStorage` ou em logs do cliente.
- [ ] Validar fase, turno, identidade, alvo e unicidade do voto no servidor.
- [ ] Recalcular pontos no servidor; ignorar pontos enviados pelo cliente.
- [ ] Limitar tamanho de nome (ex.: 24 caracteres), payload e número de jogadores.
- [ ] Rate limit por conexão/IP para criação e entrada em salas.
- [ ] Fechar o lobby após o início; impedir entrada de novos jogadores no meio da partida.
- [ ] Códigos de sala com alfabeto sem caracteres ambíguos (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- [ ] Verificar `Origin` no upgrade WebSocket e usar apenas `wss://`.
- [ ] Não registrar a palavra secreta em logs de produção.
- [ ] Sanitizar nomes exibidos (React já escapa; ainda assim, limitar e normalizar).
- [ ] Definir política de privacidade: sem contas, sem PII, tokens efêmeros.
- [ ] TTL e alarme para apagar salas abandonadas.
- [ ] Testes de abuso: voto duplicado, voto em si, palpite fora da vez, join após início,
      reconexão com token de outro jogador.

### 7.1. Código de sala é segredo?

Não trate o código como senha forte. Ele evita entrada acidental, não um atacante determinado.
Mitigações proporcionais:

- 5–6 caracteres aleatórios;
- sala fecha ao iniciar;
- limite de tentativas por IP;
- opção futura de PIN ou aprovação do host;
- nomes duplicados desabilitados;
- capacidade máxima 12.

---

## 8. Estrutura de código sugerida

### 8.1. Extrair o núcleo do jogo

Hoje as regras puras estão em `src/domain/`. Para reutilizar no servidor:

```text
packages/
  game-core/
    src/
      types.ts
      engine.ts
      words.ts
      index.ts
apps/
  web/        # React atual
  rooms/      # Worker/Durable Object
```

Alternativas mais simples, sem monorepo:

- publicar `@blefae/game-core` como pacote privado;
- copiar `engine.ts`/`types.ts` para o worker via script de build;
- usar um alias do Vite e um bundle separado para o worker.

O importante é **uma única implementação** de `calculateRoundPoints`, `voteVerdict`,
`weightedSpeakerOrder` e `evaluateGuess`, com os mesmos testes.

### 8.2. Frontend

```text
src/
  online/
    RoomProvider.tsx      # conexão, reconexão, snapshot
    useRoomSocket.ts      # WebSocket + backoff
    roomClient.ts         # envio de intents
    types.ts              # eventos do protocolo
  screens/
    CreateRoomScreen.tsx
    JoinRoomScreen.tsx
    LobbyScreen.tsx
    OnlineRevealScreen.tsx
    OnlineVotingScreen.tsx
    OnlineResultScreen.tsx
  ...
```

- Feature flag `VITE_ONLINE_ENABLED` para lançar sem quebrar o modo local.
- O modo local continua sendo a opção “Jogar em um celular”.
- Rotas: usar `?sala=ABC12` ou `/sala/ABC12` com fallback de SPA. Se o deploy for na Vercel com
  rewrite, cuidado para não interceptar `/sw.js`, `/manifest.webmanifest` e `/icons/*`.

### 8.3. Servidor

```text
rooms/
  src/
    index.ts              # roteamento HTTP/WS
    Room.ts               # Durable Object por sala
    protocol.ts           # schemas (zod/valibot)
    auth.ts               # tokens de jogador
    words.ts              # banco compartilhado
  wrangler.toml
```

- Use um schema validator (Zod/Valibot) em toda mensagem recebida.
- Guarde o snapshot após cada transição para reconexão.
- Emita sempre o snapshot completo; evite patches complexos no MVP.
- Separe “estado público” de “segredos por jogador”.

---

## 9. Fases de implementação

### Fase 0 — Preparação (1–2 dias)

- Extrair `game-core` e rodar os testes atuais contra ele.
- Definir protocolo e schemas.
- Criar o worker “hello world” com WebSocket e deploy de teste.

### Fase 1 — Lobby (2–3 dias)

- Criar sala, código, QR e link de convite.
- Entrar, escolher nome, marcar pronto.
- Presença em tempo real, host, limite de 12, fechamento do lobby.
- Reconexão básica por token.

### Fase 2 — Partida privada (3–4 dias)

- Sorteio no servidor.
- `role:private` unicast.
- Confirmação de papel.
- Ordem de fala e liberação da rodada de dicas.

### Fase 3 — Votação e resultado (3–4 dias)

- Votos simultâneos, validação e ocultação até o fim.
- Revelação do impostor e placar.
- Palpite (digitação e múltipla escolha).
- Confirmação de erro de digitação.
- Pontuação e próxima rodada.

### Fase 4 — Robustez (3–5 dias)

- Reconexão com janela de graça, troca de host.
- Sala expirada, host sai, jogador sai.
- Rate limit, limites de payload, logs sem segredos.
- Testes de integração com dois ou mais clientes WebSocket.
- Testes E2E com múltiplos contextos do Playwright.

### Fase 5 — Polimento (opcional)

- Cronômetro de dicas.
- Chat rápido/reações.
- Histórico e estatísticas.
- Espectadores.
- Matchmaking público.
- Ranking sazonal.

---

## 10. Testes

- **Unitários:** núcleo compartilhado (já existe) + schemas do protocolo.
- **Integração:** subir o worker em Miniflare e conectar 3–12 clientes; simular votos, reconexão,
  host ausente, payload inválido e tentativa de voto duplicado.
- **E2E:** Playwright com múltiplos contextos (cada contexto = um celular), criar sala, entrar por
  código, revelar, votar, palpitar e conferir o ranking.
- **Segurança:** inspecionar frames WebSocket e garantir que a palavra não aparece para o impostor;
  tentar enviar `guess:submit` como civil; tentar votar duas vezes; entrar após o início.
- **Carga:** 100–500 salas simultâneas, medir latência de broadcast e uso de memória por sala.

---

## 11. Custos e operação

Cenário casual (dezenas de partidas por dia):

- Frontend estático: **Vercel Hobby** ou **Cloudflare Pages** — gratuito.
- Salas: **Durable Objects/PartyKit** — free tier costuma ser suficiente; conferir limites atuais.
- Banco: desnecessário no MVP.
- Domínio: opcional.

Sinais de que chegou a hora de pagar:

- muitas conexões simultâneas ou duração média alta;
- necessidade de histórico/contas;
- uso comercial;
- limites de free tier apertando.

Operação:

- métricas de salas ativas, duração, erros de socket e reconexões;
- alertas de taxa de erro;
- logs sem palavras secretas;
- versão do protocolo no handshake para permitir deploy sem quebrar salas antigas.

---

## 12. Riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| Vazamento da palavra pelo estado público | Separar snapshot público de segredo por socket; testes que inspecionam frames |
| Cliente manipula votos/pontos | Servidor autoritativo; nunca confiar no cliente |
| Host cai no meio da partida | Janela de graça + promoção automática |
| Jogador entra depois do início | Fechar lobby; validar fase no join |
| Código de sala adivinhado | Código aleatório, rate limit, sala fecha ao iniciar |
| WebSocket cai em rede móvel | Reconexão com backoff + snapshot versionado |
| Custo de servidor sempre ligado | Durable Objects por sala, TTL e sem processo global |
| Complexidade de monorepo | Começar com cópia controlada do núcleo e extrair depois, se necessário |

---

## 13. Critérios de aceite do MVP online

- [ ] 3 a 12 jogadores entram pelo código/QR e veem o lobby atualizar em tempo real.
- [ ] Cada jogador vê o próprio papel apenas no próprio aparelho.
- [ ] O impostor não recebe a palavra em nenhum frame, campo ou log do cliente.
- [ ] Votos são simultâneos, secretos e validados no servidor.
- [ ] Resultado, palpite, pontuação e ranking batem com o modo local.
- [ ] Queda e retorno de um jogador não travam a partida.
- [ ] Saída do host promove outro jogador.
- [ ] Sala expira e libera recursos.
- [ ] Testes E2E com pelo menos 4 contextos passam em CI.
- [ ] Modo local continua funcionando sem regressões.
