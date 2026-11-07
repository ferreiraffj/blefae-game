# Backlog de migração do design — Blefaê

## Contexto

As referências em [`design-assets/design-system/`](design-assets/design-system/) definem uma nova
identidade para o Blefaê: **Tactile Party Deduction**, com estética de jogo de tabuleiro casual,
componentes com sensação física e linguagem visual mais expressiva.

A migração deve preservar o produto atual: jogo presencial, local, em um único celular, sem
login, servidor ou sincronização entre dispositivos. O novo design não deve introduzir
complexidade de multiplayer antes da necessidade real existir.

Referências analisadas:

- [`DESIGN.md`](design-assets/design-system/DESIGN.md): tokens, paleta, tipografia, espaçamento,
  elevação e princípios de interação.
- [`tela-inicial-DESIGN.md`](design-assets/design-system/tela-inicial/tela-inicial-DESIGN.md):
  entrada do jogo e chamada principal.
- [`lobby-DESIGN.md`](design-assets/design-system/lobby/lobby-DESIGN.md): cadastro e preparação
  dos participantes.
- [`palavra-secreta-DESIGN.md`](design-assets/design-system/palavra-secreta/palavra-secreta-DESIGN.md):
  revelação da palavra para civis.
- [`impostor-DESIGN.md`](design-assets/design-system/impostor/impostor-DESIGN.md): revelação do
  papel do impostor.
- [`tela-ordem-de-fala-DESIGN.md`](design-assets/design-system/tela-ordem-de-fala/tela-ordem-de-fala-DESIGN.md):
  ordem e preparação das dicas.
- [`tela-selecao-impostor-DESIGN.md`](design-assets/design-system/tela-selecao-impostor/tela-selecao-impostor-DESIGN.md):
  seleção/votação do suspeito.
- [`revelacao-do-impostor-DESIGN.md`](design-assets/design-system/revelacao-do-impostor/revelacao-do-impostor-DESIGN.md):
  resultado da votação.
- [`variacao-impostor-multipla-escolha-DESIGN.md`](design-assets/design-system/variacao-impostor-multipla-escolha/variacao-impostor-multipla-escolha-DESIGN.md):
  palpite do impostor em múltipla escolha.
- [`placar-pos-rodada-DESIGN.md`](design-assets/design-system/placar-pos-rodada/placar-pos-rodada-DESIGN.md):
  pontos da rodada.
- [`placar-final-DESIGN.md`](design-assets/design-system/placar-final/placar-final-DESIGN.md):
  encerramento, ranking e vencedor.

## O que já foi aplicado nesta etapa

- Tokens claros alinhados à paleta:
  - canvas `#FDFBF7`;
  - card `#FFFFFF`;
  - superfície agrupada `#F4EFE6`;
  - tinta principal `#181126`;
  - roxo primário `#6C28D9`;
  - sombra roxa `#4C1D95`;
  - amarelo `#FFE566`;
  - coral `#FF5A5F` / `#FF7A59`;
  - ciano `#00B4D8`;
  - mint `#06D6A0`.
- O modo visual padrão passou de escuro/coral para claro/roxo.
- O modo escuro continua disponível, agora usando a mesma família cromática.
- As preferências de tema do usuário continuam independentes e persistidas.
- A camada sazonal continua independente e pode sobrescrever os tokens enquanto estiver ativa.

Arquivos dessa fundação:

- [`src/domain/types.ts`](src/domain/types.ts)
- [`src/styles/global.css`](src/styles/global.css)
- [`src/seasonalThemes.ts`](src/seasonalThemes.ts)
- [`src/state/useSeasonalTheme.ts`](src/state/useSeasonalTheme.ts)

## Decisões de produto para o modo local

### Manter e priorizar

1. **Cadastro local de jogadores**
   - manter de 3 a 12 jogadores;
   - manter edição em modal;
   - transformar o lobby em um painel de preparação compacto;
   - deixar claro que o telefone será passado entre as pessoas.
2. **Revelação privada**
   - manter a cortina de privacidade;
   - separar visualmente palavra secreta e papel de impostor;
   - manter confirmação explícita antes de passar o aparelho.
3. **Ordem de fala**
   - manter a ordem completa já implementada;
   - destacar o primeiro jogador sem sugerir que os demais são opcionais.
4. **Votação sequencial**
   - adaptar a seleção do impostor para uma grade/lista tátil;
   - manter bloqueio de voto em si mesmo;
   - preservar a natureza secreta e sequencial da votação.
5. **Palpite final**
   - manter digitação e múltipla escolha;
   - manter confirmação para erros e respostas parciais;
   - usar o novo visual para diferenciar “palavra correta”, “palpite” e “decisão do grupo”.
6. **Pontuação**
   - manter configuração de pontos;
   - destacar ganho da rodada, ranking e empate;
   - preservar desempate e encerramento antecipado.
7. **PWA, offline e recuperação**
   - manter instalação, autosave e recuperação de 24 horas;
   - preservar atualização segura do service worker durante uma partida.

### Despriorizar ou descartar por enquanto

- código de sala, QR Code e entrada por outro dispositivo;
- lobby online com presença e status de conexão;
- votação simultânea;
- reconexão, troca de host e sincronização por WebSocket;
- proteção de segredo contra DevTools;
- autenticação, histórico, ranking global e contas;
- indicadores de “jogador online” ou estados de rede.

Esses itens continuam documentados no roadmap online, mas não devem influenciar a arquitetura
visual do modo local agora.

## Backlog de implementação

### P0 — Fundação visual e acessibilidade

- [x] Atualizar tokens de cor e o modo padrão.
- [ ] Decidir se o modo escuro será uma variação completa ou apenas um tema de contraste.
- [x] Adotar Bubblegum Sans como fonte expressiva de títulos, marca, badges e ações, carregada pelo
      Google Fonts conforme a referência fornecida.
- [ ] Avaliar empacotamento local da Bubblegum Sans e de uma fonte de leitura para preservar a mesma
      identidade visual em uso offline.
- [ ] Criar tokens nomeados para `primary`, `secondary`, `tertiary`, `success`, `danger`,
      `surface` e `ink`, evitando cores soltas em componentes.
- [ ] Revisar contraste de texto, foco e estados desabilitados em ambos os modos.
- [x] Definir um componente de botão tátil com camada de extrusão e estado pressionado.
- [x] Definir card/bubble base com borda cromática, sombra roxa e raios do design system.
- [x] Criar primitives reutilizáveis de card, badge e chip de jogador.

### P1 — Shell, tela inicial e lobby local

- [x] Remodelar [`StartScreen.tsx`](src/screens/StartScreen.tsx) conforme a referência de entrada:
      hero, CTA principal, hierarquia de marca e instrução curta.
- [x] Remodelar [`SetupScreen.tsx`](src/screens/SetupScreen.tsx) como lobby local:
      participantes, tema, rodadas, configurações e indicação de “passar o celular”.
- [x] Reduzir texto concorrente e agrupar ações secundárias em modal.
- [ ] Preservar scroll em telas pequenas, landscape e partidas com 12 jogadores.
- [ ] Adicionar testes visuais/manuais em pelo menos 320x568, 390x844 e landscape.

### P1 — Revelação da palavra e do impostor

- [x] Adaptar [`RevealScreen.tsx`](src/screens/RevealScreen.tsx) à composição de palavra secreta.
- [x] Criar variação visual distinta para civil e impostor, sem alterar a regra do reducer.
- [x] Manter cortina, suspense, som e botão de ocultar/passsar como ações primárias.
- [x] Garantir que o segredo permaneça legível e não seja exposto por animações inadequadas.

### P1 — Ordem de fala e votação

- [x] Remodelar [`SpeakingScreen.tsx`](src/screens/SpeakingScreen.tsx) com lista de ordem
      como componente principal.
- [x] Remodelar [`VotingScreen.tsx`](src/screens/VotingScreen.tsx) para seleção tátil do impostor.
- [x] Destacar seleção, confirmação, progresso e candidato atual com semântica clara.
- [x] Manter ação fixa/flutuante quando a lista ultrapassar a altura da tela.

### P1 — Resultado, palpite e pontuação

- [x] Adaptar [`ResultScreen.tsx`](src/screens/ResultScreen.tsx) para a revelação do impostor.
- [x] Adaptar [`GuessScreen.tsx`](src/screens/GuessScreen.tsx) e a variação de múltipla escolha.
- [x] Adaptar [`GuessConfirmationScreen.tsx`](src/screens/GuessConfirmationScreen.tsx) sem
      remover a confirmação para parciais/erros.
- [x] Remodelar [`ScoreScreen.tsx`](src/screens/ScoreScreen.tsx) para o placar pós-rodada.
- [x] Remodelar [`FinishedScreen.tsx`](src/screens/FinishedScreen.tsx) para placar final,
      empate, desempate e nova partida.
- [ ] Preservar sons, suspense e atualização segura da PWA durante o fluxo.

### P2 — Componentes visuais e assets

- [x] Substituir emojis genéricos em elementos centrais por ícones/ilustrações consistentes.
- [ ] Avaliar assets vetoriais para espião, carta de pergunta, troféu e estados de resultado.
- [ ] Criar componentes de badge, player chip, score row, reveal card e action bar.
- [x] Adicionar estados de toque, foco, pressionado e desabilitado.
- [ ] Garantir que os assets entrem no precache da PWA.

### P3 — Qualidade e manutenção

- [ ] Criar uma matriz de telas x fases x viewport.
- [x] Adicionar testes de regressão para transições do reducer após cada etapa visual.
- [ ] Validar `npm test` e `npm run build` em cada lote.
- [ ] Documentar tokens e regras de uso para evitar novas cores ad hoc.
- [ ] Atualizar screenshots e novidades da versão somente após uma etapa completa.

## Plano de execução por etapas

Cada etapa deve ser implementada e validada separadamente. A próxima etapa só deve começar após a
confirmação visual da anterior.

### Etapa 1 — Tokens e base visual

Já iniciada nesta alteração. Confirmar:

- paleta clara;
- modo escuro;
- contraste;
- comportamento das preferências e do tema sazonal.

### Etapa 2 — Componentes primitivos

Criar botão tátil, card, badge, chip de jogador e barra de ação. Validar estados e responsividade
antes de migrar qualquer tela.

### Etapa 3 — Entrada e lobby local

Migrar tela inicial, cadastro, modal de jogadores, tema, rodadas e configurações. Validar partidas
de 3, 6 e 12 participantes.

### Etapa 4 — Revelação

Migrar palavra secreta, impostor, suspense e passagem do celular. Validar privacidade física e
leitura em baixa altura.

### Etapa 5 — Dicas e votação

Migrar ordem de fala, seleção do impostor, progresso e confirmação. Validar scroll e ações fixas.

### Etapa 6 — Resultados e placares

Migrar revelação do impostor, palpite, confirmação, placar da rodada, placar final e desempate.

### Etapa 7 — Assets, polimento e regressão

Substituir ilustrações provisórias, revisar microinterações, executar matriz de viewports, atualizar
testes e registrar a versão.

## Critérios de aceite da migração

- Todas as fases locais continuam acessíveis sem backend.
- Nenhum segredo é exibido fora da etapa correta.
- O jogo continua jogável com 3–12 participantes.
- Nenhuma tela perde scroll em portrait, landscape ou baixa altura.
- Todos os controles têm alvo mínimo de toque de 48px.
- `npm test` e `npm run build` passam.
- A instalação/offline da PWA continua funcional.
- O modo online não é introduzido implicitamente como dependência.
