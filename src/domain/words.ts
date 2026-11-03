/**
 * Banco local de palavras, portado do app Android.
 * Cada tema mantém a lista original para que as partidas tenham a mesma variedade.
 */

export const RANDOM_THEME = '🎲 Tema Aleatório'

export const THEMES_WITH_ICONS = [
  '📱 Objetos Cotidianos',
  '🦁 Animais & Criaturas',
  '🍕 Comidas & Gastronomia',
  '🏖️ Lugares & Construções',
  '🩺 Profissões & Ocupações',
  '🎨 Personagens de Desenho',
  '🎬 Filmes & Séries',
  '🌎 Países & Capitais',
  '🎮 Tecnologia & Games',
  '🎵 Música & Ritmos',
  '⚽ Esportes & Lazer',
  '⚡ Mitologia & Fantasia',
] as const

export const THEMES: readonly string[] = [RANDOM_THEME, ...THEMES_WITH_ICONS]

export const WORD_BANK: Record<string, readonly string[]> = {
  '📱 Objetos Cotidianos': [
    'Celular', 'Relógio', 'Televisão', 'Geladeira', 'Guarda-chuva', 'Mochila', 'Óculos',
    'Chave', 'Espelho', 'Ventilador', 'Cadeira', 'Controle remoto', 'Microfone', 'Câmera',
    'Fone de ouvido', 'Panela', 'Bicicleta', 'Computador', 'Livro', 'Caneta', 'Tesoura',
    'Luminária', 'Travesseiro', 'Escova de dentes', 'Mala', 'Garrafa térmica', 'Carteira',
    'Secador de cabelo', 'Quadro', 'Copo térmico', 'Almofada', 'Tapete', 'Abajur', 'Isqueiro',
  ],
  '🦁 Animais & Criaturas': [
    'Cachorro', 'Gato', 'Elefante', 'Pinguim', 'Girafa', 'Leão', 'Tigre', 'Lobo', 'Raposa',
    'Cavalo', 'Golfinho', 'Tartaruga', 'Águia', 'Coruja', 'Macaco', 'Capivara', 'Jacaré',
    'Coelho', 'Urso', 'Canguru', 'Polvo', 'Abelha', 'Flamingo', 'Panda', 'Morcego',
    'Camaleão', 'Tubarão', 'Foca', 'Lontra', 'Arara', 'Zebra', 'Hipopótamo', 'Pavão', 'Esquilo',
  ],
  '🍕 Comidas & Gastronomia': [
    'Pizza', 'Hambúrguer', 'Sushi', 'Feijoada', 'Lasanha', 'Coxinha', 'Brigadeiro',
    'Pastel', 'Pão de queijo', 'Açaí', 'Churrasco', 'Taco', 'Panqueca', 'Pudim',
    'Bolo de cenoura', 'Hot dog', 'Ramen', 'Tapioca', 'Risoto', 'Batata frita',
    'Salada', 'Sorvete', 'Burrito', 'Paella', 'Escondidinho', 'Pipoca', 'Strogonoff',
    'Fondue', 'Guacamole', 'Churros', 'Croissant', 'Waffle', 'Torta de limão',
  ],
  '🏖️ Lugares & Construções': [
    'Praia', 'Shopping', 'Aeroporto', 'Hospital', 'Escola', 'Biblioteca', 'Parque',
    'Museu', 'Restaurante', 'Cinema', 'Estádio', 'Fazenda', 'Deserto', 'Montanha',
    'Floresta', 'Aquário', 'Zoológico', 'Hotel', 'Igreja', 'Academia', 'Supermercado',
    'Teatro', 'Estação de metrô', 'Castelo', 'Ilha', 'Pirâmides', 'Cachoeira', 'Farol',
    'Vulcão', 'Cassino', 'Parque de diversões', 'Caverna', 'Observatório',
  ],
  '🩺 Profissões & Ocupações': [
    'Médico', 'Professor', 'Bombeiro', 'Programador', 'Cozinheiro', 'Policial', 'Dentista',
    'Piloto', 'Advogado', 'Enfermeiro', 'Veterinário', 'Arquiteto', 'Jornalista', 'Astronauta',
    'Mecânico', 'Designer', 'Fotógrafo', 'Garçom', 'Engenheiro', 'Padeiro', 'Ator',
    'Psicólogo', 'Motorista', 'Eletricista', 'Cientista', 'Biólogo', 'Detetive', 'Juiz',
    'Carteiro', 'Carpinteiro', 'Barbeiro', 'Bailarino', 'Mágico',
  ],
  '🎨 Personagens de Desenho': [
    'Mickey Mouse', 'Bob Esponja', 'Scooby-Doo', 'Pica-Pau', 'Tom', 'Jerry', 'Homer Simpson',
    'Bart Simpson', 'Pernalonga', 'Shrek', 'Dora', 'Popeye', 'Patrick Estrela', 'Finn',
    'Jake', 'Coragem', 'Naruto', 'Goku', 'Pikachu', 'Po', 'Elsa', 'Masha', 'Luffy',
    'Stitch', 'Pantera Cor-de-Rosa', 'Garfield', 'Buzz Lightyear', 'Coringa', 'Robin',
    'Gato de Botas', 'Wall-E', 'Nemo', 'Simba',
  ],
  '🎬 Filmes & Séries': [
    'Harry Potter', 'Darth Vader', 'Homem-Aranha', 'Batman', 'Superman', 'Barbie',
    'Jack Sparrow', 'Hermione Granger', 'Walter White', 'Eleven', 'Jon Snow', 'Tony Stark',
    'Woody', 'Katniss Everdeen', 'Neo', 'Indiana Jones', 'Deadpool', 'Wolverine',
    'Frodo', 'Hulk', 'Loki', 'Wandinha Addams', 'Mandaloriano', 'Sherlock Holmes',
    'Gollum', 'James Bond', 'Jack Dawson', 'Voldemort', 'Dumbledore', 'Pennywise',
  ],
  '🌎 Países & Capitais': [
    'Brasil', 'Argentina', 'Japão', 'Itália', 'França', 'Canadá', 'México', 'Portugal',
    'Alemanha', 'Egito', 'Austrália', 'Chile', 'Índia', 'China', 'Coreia do Sul',
    'Noruega', 'Suécia', 'Grécia', 'Peru', 'Colômbia', 'Espanha', 'Tailândia',
    'Marrocos', 'Islândia', 'África do Sul', 'Londres', 'Paris', 'Tóquio', 'Roma',
    'Nova York', 'Cairo', 'Lisboa', 'Amsterdã',
  ],
  '🎮 Tecnologia & Games': [
    'PlayStation', 'Xbox', 'Nintendo Switch', 'Minecraft', 'Fortnite', 'Inteligência Artificial',
    'Robô', 'Drone', 'Realidade Virtual', 'Metaverso', 'Bitcoin', 'Hacker', 'Teclado mecânico',
    'Mouse gamer', 'Placa de vídeo', 'Impressora 3D', 'Smartwatch', 'Satélite', 'Algoritmo',
    'Cyberpunk', 'Super Mario', 'Sonic', 'Pac-Man', 'Tetris', 'Zelda', 'GTA', 'Among Us',
    'Foguete', 'Chip de computador', 'Monitor curvo', 'Gamepad',
  ],
  '🎵 Música & Ritmos': [
    'Guitarra', 'Bateria', 'Violão', 'Piano', 'Saxofone', 'Microfone', 'Rock', 'Samba',
    'Pop', 'Funk', 'Jazz', 'Hip Hop', 'Eletrônica', 'Reggae', 'Bossa Nova', 'Heavy Metal',
    'Fita Cassete', 'Disco de Vinil', 'Concerto', 'Show de rock', 'Festival', 'Maestro',
    'Trompete', 'Violino', 'Baixo', 'Acordeom', 'DJ', 'Banda', 'Flauta', 'Karaokê',
  ],
  '⚽ Esportes & Lazer': [
    'Futebol', 'Basquete', 'Vôlei', 'Tênis', 'Natação', 'Skate', 'Surfe', 'Corrida',
    'Ciclismo', 'Boxe', 'Judô', 'Golfe', 'Escalada', 'Boliche', 'Fórmula 1', 'Arco e flecha',
    'Patinação', 'Handebol', 'Rugby', 'Canoagem', 'Paraquedismo', 'Tênis de mesa',
    'Xadrez', 'Sinuca', 'Musculação', 'Ioga', 'Dardo', 'Snowboard',
  ],
  '⚡ Mitologia & Fantasia': [
    'Dragão', 'Fênix', 'Zeus', 'Thor', 'Poseidon', 'Medusa', 'Centauro', 'Minotauro',
    'Unicórnio', 'Pegasus', 'Lobisomem', 'Vampiro', 'Mago', 'Bruxa', 'Duende', 'Elfo',
    'Anão', 'Sereia', 'Cavalo de Troia', 'Excalibur', 'Valhala', 'Olimpo', 'Atlas',
    'Hércules', 'Afrodite', 'Ares', 'Kraken', 'Esfinge', 'Ciclope', 'Anúbis',
  ],
}

export const TOTAL_WORDS = Object.values(WORD_BANK).reduce((total, words) => total + words.length, 0)

export function themeWordCount(theme: string): number {
  if (theme === RANDOM_THEME) return TOTAL_WORDS
  return WORD_BANK[theme]?.length ?? 0
}

/** Escolhe um tema concreto quando o tema sorteado é "Tema Aleatório". */
export function resolveTheme(chosenTheme: string, rng: () => number = Math.random): string {
  if (chosenTheme !== RANDOM_THEME) return chosenTheme
  return THEMES_WITH_ICONS[Math.floor(rng() * THEMES_WITH_ICONS.length)]
}

function normalizeWord(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Sorteia uma palavra do tema, sem repetir palavras já usadas na partida.
 * Se o tema esgotar, busca em outros temas; se tudo esgotar, reutiliza do tema.
 */
export function randomWord(
  theme: string,
  usedWords: readonly string[] = [],
  rng: () => number = Math.random,
): string {
  const actualTheme = resolveTheme(theme, rng)
  const wordList = WORD_BANK[actualTheme] ?? Object.values(WORD_BANK).flat()
  const normalizedUsed = new Set(usedWords.map(normalizeWord))

  const available = wordList.filter((word) => !normalizedUsed.has(normalizeWord(word)))
  if (available.length > 0) return pick(available, rng)

  const allAvailable = Object.values(WORD_BANK)
    .flat()
    .filter((word) => !normalizedUsed.has(normalizeWord(word)))
  if (allAvailable.length > 0) return pick(allAvailable, rng)

  return pick(wordList, rng)
}

/**
 * Alternativas de múltipla escolha: a palavra correta + distratoras do mesmo tema.
 */
export function getMultipleChoiceOptions(
  theme: string,
  targetWord: string,
  count = 5,
  rng: () => number = Math.random,
): string[] {
  const actualTheme =
    theme === RANDOM_THEME
      ? Object.entries(WORD_BANK).find(([, words]) => words.includes(targetWord))?.[0] ??
        THEMES_WITH_ICONS[Math.floor(rng() * THEMES_WITH_ICONS.length)]
      : theme

  const wordList = WORD_BANK[actualTheme] ?? Object.values(WORD_BANK).flat()
  const distractors = shuffle(
    wordList.filter((word) => word.toLowerCase() !== targetWord.toLowerCase()),
    rng,
  ).slice(0, Math.max(count - 1, 1))

  return shuffle([...distractors, targetWord], rng)
}

function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)]
}

function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
