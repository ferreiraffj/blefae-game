# Blefaê

Versão web do jogo **Blefaê — Descubra quem está blefando**, originalmente feito para Android.
É um jogo de dedução social para jogar **presencialmente com um único celular**: o aparelho passa
de mão em mão para revelar papéis, votar e dar o palpite final.

O app é uma **PWA** (Progressive Web App): pode ser instalado na tela inicial do Android e do iOS,
funciona **offline** depois do primeiro carregamento e não depende de login, servidor ou banco de dados.

> **Escopo desta versão:** partidas locais (um aparelho por grupo). O modo online, com cada jogador
> no próprio celular, ainda **não** está implementado. O plano técnico está em
> [`docs/ONLINE_ROADMAP.md`](docs/ONLINE_ROADMAP.md).

---

## Índice

- [Jogar](#jogar)
- [Funcionalidades](#funcionalidades)
- [Regras implementadas](#regras-implementadas)
- [Rodando o projeto](#rodando-o-projeto)
- [Build de produção](#build-de-produção)
- [Instalando como PWA](#instalando-como-pwa)
- [Deploy na Vercel](#deploy-na-vercel)
- [Hospedagem: recomendações](#hospedagem-recomendações)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Identidade visual e ícones](#identidade-visual-e-ícones)
- [Testes](#testes)
- [Limitações conhecidas](#limitações-conhecidas)
- [Próximos passos](#próximos-passos)

---

## Jogar

1. Abra o app e cadastre de **3 a 12 jogadores**.
2. Escolha o tema das palavras e a quantidade de rodadas (1 a 20).
3. Toque em **INICIAR PARTIDA**.
4. Passe o celular para cada jogador, na ordem indicada. Cada um toca em **ME CHAMO …** para ver
   seu papel em segredo e depois em **OCULTAR E PASSAR CELULAR**.
5. Na rodada de dicas, cada jogador fala **uma única palavra** relacionada à palavra secreta.
   São duas voltas completas, começando pelo jogador sorteado na tela.
6. Todos votam em segredo, sem poder votar em si mesmos.
7. O impostor é revelado. Se ele foi pego, ainda pode tentar **adivinhar a palavra secreta**.
8. A pontuação da rodada aparece e o grupo decide se mantém ou troca o tema.
9. Ao final, o ranking mostra o vencedor (ou o empate).

A partida é salva automaticamente. Se a página for recarregada ou o navegador for fechado, o app
oferece **continuar de onde parou** por até **24 horas**. Depois disso, a partida expira e um aviso
é mostrado na tela inicial.

---

## Funcionalidades

- Partidas de **3 a 12 jogadores** e **1 a 20 rodadas**.
- 12 temas de palavras + **Tema Aleatório**, com **382 palavras** no total e sem repetição dentro da
  mesma partida.
- Sorteio de impostor e ordem de fala com **20% de chance** de o impostor começar.
- Revelação privada, uma pessoa por vez, com botão explícito de “ocultar e passar”.
- Votação secreta, sequencial, com bloqueio de voto em si mesmo.
- Dois modos de palpite do impostor:
  - **Digitação com validação**: erros pequenos de digitação podem ser aceitos pelo grupo.
  - **Múltipla escolha**: 5 alternativas sorteadas do tema da rodada.
- Pontuação configurável (sozinho, maioria, empate, minoria e acerto do impostor).
- Tela de pontuação com barras comparativas e ranking final, incluindo empates.
- Autosave com expiração de 24 horas e diálogo de recuperação.
- Tema visual: **Auto / Claro / Escuro**, 9 cores de destaque, raio dos cards de 8 a 28 px e
  opção de desligar animações.
- Interface em **pt-BR**, responsiva, com suporte a **safe areas** (notch e barra de gestos).
- PWA instalável, com funcionamento offline e atalho de instalação.
- Acessibilidade: contraste calculado para o texto sobre a cor de destaque, `aria-label` nos
  controles de ícone, `aria-pressed`/`aria-checked` nos seletores e foco visível.

---

## Regras implementadas

| Situação | Pontos para quem votou no impostor |
| --- | ---: |
| Acertou o impostor sozinho (apenas 1 voto no impostor) | 150 |
| Impostor foi o mais votado, sem empate | 125 |
| Impostor empatou no topo da votação | 100 |
| Impostor recebeu votos, mas não foi o mais votado | 50 |
| Votou em um inocente | 0 |

O impostor recebe **125 pontos** se acertar a palavra secreta no palpite final (configurável).
Todos os valores podem ser alterados em **Configurações da Partida**.

Detalhes de fidelidade ao app Android:

- Nomes vazios são ignorados no início da partida; é preciso pelo menos 3 nomes preenchidos.
- Nomes repetidos são bloqueados.
- A palavra secreta nunca se repete dentro da mesma partida.
- O tema pode ser mantido ou trocado entre rodadas.
- Se todos empatarem no topo, o app anuncia o empate com todos os nomes.

---

## Rodando o projeto

### Requisitos

- **Node.js 20.19+** ou **22.12+** (exigência do Vite 8).
- npm 10+.

### Instalação

```bash
cd impostor-web
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:5173`.

> O service worker fica **desativado no modo dev** de propósito, para não interferir no hot reload.
> Para testar instalação e offline, use o build de produção com `npm run preview`.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Checagem de tipos (`tsc --noEmit`) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção em `http://localhost:4173` |
| `npm test` | Roda a suíte Vitest uma vez |
| `npm run test:watch` | Vitest em modo watch |
| `npm run icons` | Regenera ícones e wordmark a partir de `design-assets/` |

---

## Build de produção

```bash
npm run build
npm run preview
```

O build gera:

- `dist/index.html`
- `dist/assets/*` (JS, CSS e fontes com hash)
- `dist/manifest.webmanifest`
- `dist/sw.js` + `dist/workbox-*.js`
- `dist/icons/*` e `dist/brand/*`

### Verificando a PWA

1. Rode `npm run preview`.
2. Abra `http://localhost:4173`.
3. No Chrome DevTools, vá em **Application → Service Workers** e confirme o SW ativo.
4. Em **Application → Manifest**, confira nome, ícones e `display: standalone`.
5. Em **Application → Cache Storage**, confira `workbox-precache-v2-…`.
6. Para testar offline: com a página já carregada, pare o servidor (`Ctrl+C`) e recarregue.
   O app deve continuar abrindo pelo cache.

---

## Instalando como PWA

### Android (Chrome, Edge, Samsung Internet)

- Ao abrir o site, pode aparecer o convite nativo de instalação.
- Também há o link **“Instalar o Blefaê”** no rodapé quando o navegador permite a instalação.
- Alternativa manual: menu do navegador → **Instalar aplicativo** / **Adicionar à tela inicial**.

### iOS / iPadOS (Safari)

1. Abra o site no **Safari**.
2. Toque em **Compartilhar**.
3. Escolha **Adicionar à Tela de Início**.
4. Confirme em **Adicionar**.

No iOS, a instalação precisa ser feita pelo Safari; outros navegadores podem não oferecer a opção.
Depois de instalado, o app abre em tela cheia e funciona offline.

> A instalação e o service worker exigem **HTTPS** (ou `localhost`). Em um domínio da Vercel isso já
> é atendido automaticamente.

---

## Deploy na Vercel

### Opção A — painel da Vercel (recomendado)

1. Envie o projeto para um repositório no GitHub/GitLab/Bitbucket.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Em **Root Directory**, selecione **`impostor-web`**.
   - Isso é obrigatório neste workspace, porque a raiz do repositório contém outro projeto.
   - Se você copiar apenas a pasta `impostor-web` para um repositório próprio, deixe a raiz vazia.
4. Configurações de build (a Vercel detecta o Vite automaticamente):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **Deploy**. Não há variáveis de ambiente.

O arquivo [`vercel.json`](vercel.json) já define:

- cache imutável para `/assets/*`;
- `Cache-Control: no-cache` para `/sw.js` e `/manifest.webmanifest`, garantindo atualizações do PWA.

### Opção B — CLI

```bash
cd impostor-web
npx vercel
# ou, para produção:
npx vercel --prod
```

A CLI usa a pasta atual como raiz do projeto.

### Atualizações

O service worker usa `registerType: 'autoUpdate'` + `skipWaiting` + `clientsClaim`. Ao publicar uma
nova versão, o app baixa o novo precache e assume o controle na próxima abertura. Se quiser forçar a
atualização durante o desenvolvimento, use **Application → Service Workers → Update** ou
**Unregister** no DevTools.

### Sobre o plano gratuito

O **Vercel Hobby** é gratuito para projetos pessoais e não comerciais. Para uso comercial, leia os
termos e considere o plano Pro ou uma alternativa como Cloudflare Pages. Para este app (100% estático,
sem funções serverless), o consumo de banda é o único custo relevante.

---

## Hospedagem: recomendações

| Plataforma | Quando faz sentido |
| --- | --- |
| **Vercel Hobby** | Melhor experiência de deploy para este projeto; HTTPS, previews e CDN prontos. Ótimo para uso pessoal. |
| **Cloudflare Pages** | Excelente opção gratuita para estático, com banda generosa. Boa escolha se o modo online futuro usar **Cloudflare Durable Objects/Workers**. |
| **Netlify** | Equivalente à Vercel para estático; bom se você já usa Netlify. |
| **GitHub Pages** | Funciona, mas exige configurar `base` no Vite e cuidado com rotas/recursos; menos conveniente para PWA com service worker. |

**Recomendação:** comece na **Vercel Hobby** se o uso for pessoal. Se o jogo virar produto
comercial, migre para **Cloudflare Pages** (frontend) + **Cloudflare Durable Objects** ou
**Supabase** para o modo online — veja o roadmap.

---

## Estrutura do projeto

```text
impostor-web/
├─ design-assets/            # artes originais do app Android (fonte dos ícones)
├─ docs/
│  └─ ONLINE_ROADMAP.md      # plano do modo multiplayer
├─ public/
│  ├─ brand/                 # logo e wordmark otimizados
│  └─ icons/                 # favicon, ícones PWA e maskable
├─ scripts/
│  └─ generate-icons.mjs     # geração dos ícones com sharp
├─ src/
│  ├─ assets/fonts/          # Outfit + Inter (self-hosted, licenças OFL)
│  ├─ components/            # Modal, Button, Icons, modais de configuração
│  ├─ data/                  # (reservado para dados auxiliares)
│  ├─ domain/
│  │  ├─ types.ts            # tipos do jogo, tema visual e pontuação
│  │  ├─ engine.ts           # regras puras: votos, pontos, palpite, ordem de fala
│  │  ├─ words.ts            # banco de 382 palavras em 12 temas
│  │  └─ *.test.ts           # testes das regras
│  ├─ screens/               # 10 telas do fluxo de jogo
│  ├─ state/
│  │  ├─ gameReducer.ts      # máquina de estados das fases
│  │  ├─ storage.ts          # localStorage, autosave e expiração de 24 h
│  │  ├─ useGameState.ts     # integração reducer + persistência
│  │  └─ useInstallPrompt.ts # instalação PWA (Android/iOS)
│  ├─ styles/global.css      # design system, layout, temas e animações
│  ├─ App.tsx                # composição das telas e modais
│  └─ main.tsx               # entrada da aplicação
├─ index.html
├─ vite.config.ts            # Vite + PWA (manifest e Workbox)
├─ vercel.json               # build e headers de cache
└─ package.json
```

### Persistência local

| Chave | Conteúdo |
| --- | --- |
| `blefae:game:v1` | Partida em andamento (autosave) |
| `blefae:visual-theme:v1` | Tema visual (modo, accent, raio, animações) |
| `blefae:setup:v1` | Rascunho da configuração (nomes, tema, rodadas, pontuação) |

A partida expira quando `createdAt` tem **24 horas ou mais**. Ao carregar, o app remove o save antigo
e mostra o aviso “A partida anterior expirou após 24 horas.”.

---

## Identidade visual e ícones

As artes originais do app Android estão em `design-assets/`. Os arquivos usados em produção são
gerados por:

```bash
npm run icons
```

O script usa `sharp` para gerar:

- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/maskable-512.png` (com área de segurança para ícones adaptativos)
- `public/icons/apple-touch-icon.png`
- `public/icons/favicon-32.png`
- `public/brand/logo-icon.png`
- `public/brand/logo-wordmark.png`

As fontes **Outfit** e **Inter** são self-hosted em `src/assets/fonts/` para que a PWA funcione
offline. As licenças OFL estão na mesma pasta.

---

## Testes

```bash
npm test
```

Cobrem:

- normalização de texto (acentos, caixa, pontuação);
- avaliação exata e detecção de erro de digitação;
- sorteio ponderado da ordem de fala (20% para o impostor);
- pontuação por sozinho, maioria, empate, minoria e acerto do impostor;
- cenários de empate com 3 jogadores;
- ausência de pontuação quando o impostor passa despercebido;
- integridade do banco de palavras e opções de múltipla escolha.

O build também roda `tsc --noEmit`, então erros de tipo quebram o deploy.

---

## Limitações conhecidas

- **Somente modo local.** Todos jogam com o mesmo aparelho.
- **Sem contas, ranking online ou histórico persistente entre partidas.** A pontuação vive na partida
  atual e no `localStorage`.
- **Sem sincronização entre dispositivos.** Cada navegador tem seu próprio save.
- A partida expira em 24 horas por design.
- Limpar os dados do site remove o save, o tema e o rascunho.
- A instalação como PWA depende do navegador e do sistema; no iOS, apenas o Safari oferece o fluxo
  completo.
- O modo offline funciona depois do primeiro carregamento; a primeira visita ainda precisa de rede.
- `npm audit` pode reportar vulnerabilidades em dependências de desenvolvimento. Elas não entram no
  bundle final; revise antes de atualizar breaking changes.

---

## Próximos passos

1. **Modo online** com sala por código/QR, cada jogador no próprio celular.
2. Servidor autoritativo para nunca revelar a palavra ao impostor e validar votos.
3. Reconexão, troca de host e partidas com espectadores.
4. Histórico e estatísticas por grupo.

O desenho técnico recomendado, incluindo alternativas de infraestrutura gratuita, protocolo de
eventos e cuidados de segurança, está em [`docs/ONLINE_ROADMAP.md`](docs/ONLINE_ROADMAP.md).
