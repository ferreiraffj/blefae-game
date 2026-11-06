# Contexto do projeto — Blefaê

## 1. Visão geral

**Blefaê — Descubra quem está blefando** é um jogo de dedução social para ser jogado
presencialmente com um único celular. O aparelho passa de mão em mão para que cada participante
veja seu papel em segredo, participe da rodada de dicas, vote e acompanhe a pontuação.

Esta aplicação é a versão web/PWA do jogo originalmente desenvolvido para Android. O produto atual
é deliberadamente local:

- não possui backend, contas, login ou banco de dados;
- uma partida usa um único dispositivo compartilhado pelo grupo;
- o estado da partida é mantido em memória e salvo no `localStorage`;
- depois do primeiro carregamento, os recursos da PWA podem funcionar offline;
- o modo online, com um celular por jogador, está apenas especificado em
  [`docs/ONLINE_ROADMAP.md`](docs/ONLINE_ROADMAP.md).

O idioma da interface é português do Brasil (`pt-BR`).

## 2. Objetivo e regras do produto

O objetivo de cada rodada é descobrir qual jogador é o impostor. Os civis recebem uma palavra
secreta; o impostor não recebe a palavra e precisa se misturar durante as dicas. Depois da votação,
o impostor revelado pode tentar adivinhar a palavra.

Fluxo de uma partida:

1. Configurar de 3 a 12 jogadores, tema, quantidade de rodadas, pontuação e modo de palpite.
2. Sortear a palavra e o impostor.
3. Revelar o papel individualmente, com o telefone sendo passado entre os jogadores.
4. Exibir quem começa a falar e as regras da rodada de dicas.
5. Realizar a votação secreta, um jogador por vez, sem permitir voto em si mesmo.
6. Revelar o resultado da votação.
7. Permitir o palpite final do impostor.
8. Exibir e contabilizar os pontos.
9. Na transição entre rodadas, permitir adicionar, remover ou renomear jogadores.
10. Iniciar a próxima rodada ou finalizar a partida.
11. Se houver empate entre pelo menos três jogadores no topo, oferecer uma única rodada de
    desempate.

Pontuação padrão para cada civil que votou no impostor:

| Situação | Pontos |
| --- | ---: |
| Impostor recebeu exatamente um voto | 150 |
| Impostor foi o mais votado sem empate | 125 |
| Impostor empatou no topo | 100 |
| Impostor recebeu votos, mas não foi o mais votado | 50 |
| Votou em um inocente ou não identificou o impostor | 0 |

O impostor recebe 125 pontos se acertar a palavra no palpite final. Todos os valores são
configuráveis na tela de configuração da partida.

## 3. Stack e execução

- **React 19** com componentes funcionais e hooks.
- **TypeScript** em modo ESM.
- **Vite 8** para desenvolvimento e build.
- **Vitest** para testes unitários.
- **vite-plugin-pwa** para manifesto, precache e service worker.
- CSS próprio em `src/styles/global.css`, sem biblioteca de componentes.
- Fontes locais Outfit e Inter.
- Sons locais em `public/sounds/`.
- Ícones e marca em `public/` e `design-assets/`.

Requisitos documentados:

- Node.js `20.19+` ou `22.12+`;
- npm 10+.

Comandos principais:

```bash
npm install
npm run dev       # Vite com HMR em http://localhost:5173
npm run build     # tsc --noEmit e build de produção em dist/
npm run preview   # preview do build em http://localhost:4173
npm test          # Vitest uma vez
npm run test:watch
npm run icons     # regenera ícones a partir de design-assets/
```

O service worker fica desabilitado no modo de desenvolvimento. Para validar instalação e offline,
use `npm run build` seguido de `npm run preview`.

## 4. Arquitetura da aplicação

### 4.1. Shell e composição

[`src/main.tsx`](src/main.tsx) inicializa o React em `StrictMode`, registra as atualizações da PWA e
carrega os estilos globais. [`src/App.tsx`](src/App.tsx) é o componente de composição principal:

- carrega preferências visuais e o rascunho de configuração;
- conecta o hook de estado da partida ao reducer;
- controla modais, menu lateral, instalação e recuperação;
- decide qual tela renderizar conforme `game.phase`;
- dispara preload e efeitos sonoros de interação;
- aplica o shell visual, logo, botão de encerramento e aviso de partida expirada.

O jogo começa na tela inicial e, após a entrada do usuário, renderiza a tela correspondente à fase
atual. Não existe roteamento por URL; a navegação é uma máquina de estados dentro de `App`.

### 4.2. Camadas e responsabilidades

```text
src/
├── App.tsx                 composição, modais e roteamento por fase
├── appInfo.ts              metadados do aplicativo
├── main.tsx                bootstrap React
├── pwa.ts                  registro e atualização segura do service worker
├── utils.ts                utilitários de apresentação
├── components/             componentes reutilizáveis e modais
├── screens/                telas de cada etapa da partida
├── domain/                 tipos, regras puras e banco de palavras
├── state/                  reducer, hooks e persistência local
├── styles/                 tokens e estilos globais
├── assets/fonts/           fontes empacotadas
└── utils/sound.ts          carregamento e reprodução de sons
```

Princípios importantes:

- as regras de domínio ficam em funções puras e não dependem de React;
- o reducer é a fonte de transições válidas da partida;
- as telas recebem estado e callbacks; não devem alterar o estado diretamente;
- o `localStorage` é acessado por helpers em `state/storage.ts`;
- componentes comuns, como botões, modais e ícones, ficam em `components/`;
- o CSS usa variáveis customizadas para tema, cor de destaque, raio e acessibilidade visual.

## 5. Máquina de estados da partida

O tipo `Phase`, definido em [`src/domain/types.ts`](src/domain/types.ts), possui estas fases:

```text
SETUP
  -> REVEAL
  -> SPEAKING
  -> VOTING
  -> RESULT
  -> GUESS
  -> GUESS_CONFIRMATION  (apenas quando há possível erro de digitação)
  -> SCORE
  -> ROUND_TRANSITION     (se ainda houver rodadas)
  -> REVEAL                (próxima rodada)
  -> FINISHED
```

As ações e transições estão em [`src/state/gameReducer.ts`](src/state/gameReducer.ts):

- `START`: cria jogadores, sorteia impostor e palavra e inicia a revelação;
- `REVEAL_PLAYER`: avança a revelação sequencial e privada;
- `START_VOTING`: sai da tela de dicas;
- `CAST_VOTE`: registra um voto e muda para resultado quando todos votarem;
- `OPEN_GUESS`: prepara o palpite e as opções de múltipla escolha;
- `SUBMIT_GUESS`: avalia o palpite e pode abrir confirmação dos civis;
- `CONFIRM_GUESS`: aceita ou rejeita um palpite provável por erro de digitação;
- `ADVANCE_FROM_SCORE`: soma os pontos e escolhe final ou próxima rodada;
- `UPDATE_PLAYERS`: edita os jogadores durante a transição, preservando pontos dos mantidos e
  iniciando novos jogadores com zero;
- `START_NEXT_ROUND`: sorteia nova palavra e novo impostor;
- `START_TIEBREAKER`: cria a rodada extra permitida após empate no topo;
- `END_GAME`: encerra a partida sem contabilizar a rodada em andamento;
- `RESET`: remove a partida atual.

O reducer rejeita ações incompatíveis com a fase atual e mantém a partida imutável. A validação
dos nomes ocorre antes de `START`, exigindo pelo menos três nomes preenchidos e sem duplicatas.

## 6. Modelo de dados

`GameState` contém:

- metadados: `createdAt`, `round`, `totalRounds`, `phase` e `endedEarly`;
- jogadores (`id`, `name`, `points`);
- configuração da rodada: `theme`, `word`, `impostorId`, `speakerOrder`;
- votação: `votes`;
- palpite: `impostorGuess`, `guessCorrect`, `guessMode`, `guessOptions`;
- pontuação: `scoreConfig`, `lastRoundPoints`;
- controle de repetição e desempate: `usedWords`, `tiebreakerPlayed`.

Preferências separadas da partida:

- `SetupDraft`: nomes, tema, rodadas, pontuação e modo de palpite;
- `VisualThemeConfig`: modo claro/escuro/automático, cor de destaque, animações e raio dos cards.

Os tipos e defaults estão centralizados em [`src/domain/types.ts`](src/domain/types.ts).

## 7. Regras de domínio

[`src/domain/engine.ts`](src/domain/engine.ts) concentra as regras independentes da interface:

- normalização de texto com remoção de acentos, espaços e pontuação;
- distância de Levenshtein;
- avaliação de palpite exato, erro por token e resposta parcial;
- sorteio ponderado da ordem de fala, com 20% de chance total de o impostor começar;
- contagem de votos e classificação do veredito;
- cálculo dos pontos da rodada;
- identificação dos maiores pontuadores;
- validação e criação de IDs de jogadores;
- embaralhamento e validação mínima de um estado salvo.

O palpite digitado é comparado após normalização. Distância de até 2 caracteres por palavra é
tratada como possível erro para palavras maiores; para palavras curtas, o limite é 1. Em palavras
compostas, tokens correspondentes ou respostas incompletas também entram em
`GUESS_CONFIRMATION`, sem serem aceitos automaticamente. Assim, um palpite como `fone` para
`Fone de ouvido` é decidido pelo grupo. O modo de múltipla escolha não usa essa confirmação:
as alternativas são geradas pelo banco de palavras.

[`src/domain/words.ts`](src/domain/words.ts) contém o banco local, com 12 temas e o tema aleatório.
Ele também:

- conta palavras por tema;
- resolve o tema concreto quando o usuário escolhe aleatório;
- evita repetir palavras dentro da partida enquanto houver opções;
- procura palavras em outros temas quando o tema se esgota;
- gera alternativas para o modo de múltipla escolha.

## 8. Persistência, recuperação e privacidade local

[`src/state/storage.ts`](src/state/storage.ts) usa três chaves de `localStorage`:

```text
blefae:game:v1
blefae:visual-theme:v1
blefae:setup:v1
```

Comportamento:

- a partida é salva automaticamente sempre que o estado muda;
- o estado salvo expira após 24 horas a partir de `createdAt`;
- JSON inválido ou estado incompatível é removido;
- ao abrir o app, uma partida em andamento pode ser recuperada ou descartada;
- uma partida expirada gera um aviso na tela inicial;
- se `localStorage` estiver indisponível ou cheio, o jogo continua em memória;
- o rascunho de configuração e o tema visual são persistidos separadamente.

Como o modo atual é local, o segredo da palavra depende da privacidade física do aparelho e do
fluxo de revelação. O estado completo contém a palavra e o `impostorId` no navegador; isso não é
uma arquitetura adequada para multiplayer online. O roadmap online exige servidor autoritativo e
payload privado por jogador.

## 9. Interface e experiência

Telas em [`src/screens/`](src/screens/):

- início e configuração;
- revelação de papéis;
- instruções e ordem de fala;
- votação;
- resultado da votação;
- palpite do impostor;
- confirmação de possível erro;
- pontuação da rodada;
- transição entre rodadas;
- classificação final.

Componentes em [`src/components/`](src/components/):

- botão, modal e ícones reutilizáveis;
- cadastro de jogadores em modal, com apenas o resumo e o botão de edição na configuração;
- controles de tema, partida e sobre na barra superior da configuração;
- configuração de categoria, pontuação e tema visual;
- modal Sobre com informações do app, instalação da PWA e página de novidades da versão atual;
- recuperação de partida;
- encerramento antecipado;
- ajuda de instalação;
- painel de suspense.

Características de UX já implementadas:

- layout responsivo para uso predominantemente em portrait;
- suporte a safe areas de notch e barra de gestos;
- tema claro, escuro ou automático;
- nove cores de destaque;
- raio de cards configurável entre 8 e 28 px;
- opção de desligar animações;
- camada sazonal independente, atualmente com tema Halloween automático de 1º de outubro a 7 de
  novembro;
- contraste do texto sobre a cor de destaque calculado em runtime;
- foco visível e atributos ARIA em controles relevantes;
- sons de clique, confirmação, acerto, erro, suspense e vencedor.

## 10. PWA e deploy

[`vite.config.ts`](vite.config.ts) configura o manifesto e o Workbox:

- nome e descrição do Blefaê;
- idioma `pt-BR`, orientação portrait e modo standalone;
- ícones comuns e maskable;
- precache de JavaScript, CSS, HTML, imagens, fontes e sons;
- `navigateFallback` para `index.html`;
- limpeza de caches antigos, `clientsClaim` e `skipWaiting`.

[`src/pwa.ts`](src/pwa.ts) registra o service worker com atualização automática. A atualização é
verificada periodicamente e quando o app volta ao primeiro plano ou fica online. Se houver uma
partida em andamento, a recarga é adiada até o jogo ficar ocioso, evitando interromper a rodada.

[`vercel.json`](vercel.json) contém as regras de cache do deploy, especialmente para assets
versionados, `sw.js` e `manifest.webmanifest`.

## 11. Testes

Os testes unitários estão próximos do código testado:

- [`src/domain/engine.test.ts`](src/domain/engine.test.ts): normalização, palpites, votação,
  pontuação, sorteios e validações;
- [`src/domain/words.test.ts`](src/domain/words.test.ts): sorteio, não repetição, temas e opções;
- [`src/state/gameReducer.test.ts`](src/state/gameReducer.test.ts): transições da máquina de
  estados e regras de pontuação no fluxo completo.

Ao alterar regras do jogo, priorize testes em `domain/` e `state/` antes de testar componentes.
O comando mínimo de validação é:

```bash
npm test
npm run build
```

## 12. Limites atuais e próximos passos

O escopo atual não inclui:

- partidas online;
- sincronização entre dispositivos;
- autenticação, contas ou histórico;
- ranking global;
- servidor ou API;
- proteção contra inspeção do estado no DevTools.

O modo online está descrito em [`docs/ONLINE_ROADMAP.md`](docs/ONLINE_ROADMAP.md). A direção
recomendada é manter o frontend estático e introduzir salas efêmeras com servidor autoritativo,
WebSocket, versionamento de snapshots e estado privado por jogador. O cliente online deve enviar
intenções, não calcular o resultado oficial. A palavra e o papel não podem aparecer no snapshot
público.

## 13. Convenções para manutenção

1. Mantenha regras de negócio em funções puras ou no reducer; não replique lógica em telas.
2. Ao adicionar uma fase, atualize o tipo `Phase`, o reducer, o switch de `App` e os testes.
3. Ao alterar `GameState`, revise `isGameState`, persistência, recuperação e fixtures de teste.
4. Prefira reaproveitar os componentes, tokens CSS e helpers existentes.
5. Preserve o funcionamento offline e a atualização segura da PWA.
6. Não introduza dependências ou backend para resolver um problema que pertence ao modo local.
7. Para funcionalidades online, trate o roadmap como mudança arquitetural: não exponha segredos
   no estado público nem tente adaptar o `localStorage` como mecanismo de sincronização.
