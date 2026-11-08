const OBJECT_IMAGE_BY_WORD: Record<string, string> = {
  abajur: 'abajur.png',
  almofada: 'almofada.png',
  bicicleta: 'bicicleta.png',
  cadeira: 'cadeira.png',
  camera: 'camera.png',
  caneta: 'caneta.png',
  carteira: 'carteira.png',
  celular: 'celular.png',
  chave: 'chave.png',
  computador: 'computador.png',
  'controle remoto': 'controle-remoto.png',
  'copo termico': 'copo-termico.png',
  'escova de dentes': 'escova-de-dentes.png',
  espelho: 'espelho.png',
  'fone de ouvido': 'fone-de-ouvido.png',
  'garrafa termica': 'garrafa-termica.png',
  geladeira: 'geladeira.png',
  'guarda chuva': 'guarda-chuva.png',
  isqueiro: 'isqueiro.png',
  livro: 'livro.png',
  luminaria: 'luminaria.png',
  mala: 'mala.png',
  microfone: 'microfone.png',
  mochila: 'mochila.png',
  oculos: 'oculos.png',
  panela: 'panela.png',
  quadro: 'quadro.png',
  relogio: 'relogio.png',
  'secador de cabelo': 'secador-de-cabelo.png',
  tapete: 'tapete.png',
  televisao: 'televisao.png',
  tesoura: 'tesoura.png',
  travesseiro: 'travesseiro.png',
  ventilador: 'ventilador.png',
}

const WORD_EMOJI_RULES: readonly [string, string][] = [
  ['cachorro|gato|leao|tigre|lobo|raposa|cavalo|golfinho|tartaruga|aguia|coruja|macaco|capivara|jacare|coelho|urso|canguru|polvo|abelha|flamingo|panda|morcego|camaleao|tubarao|foca|lontra|arara|zebra|hipopotamo|pavao|esquilo', '🐾'],
  ['pizza|hamburguer|sushi|feijoada|lasanha|coxinha|brigadeiro|pastel|pao de queijo|acai|churrasco|taco|panqueca|pudim|bolo|hot dog|ramen|tapioca|risoto|batata|salada|sorvete|burrito|paella|escondidinho|pipoca|strogonoff|fondue|guacamole|churros|croissant|waffle|torta', '🍽️'],
  ['praia|shopping|aeroporto|hospital|escola|biblioteca|parque|museu|restaurante|cinema|estadio|fazenda|deserto|montanha|floresta|aquario|zoologico|hotel|igreja|academia|supermercado|teatro|estacao|castelo|ilha|piramides|cachoeira|farol|vulcao|cassino|caverna|observatorio', '📍'],
  ['medico|professor|bombeiro|programador|cozinheiro|policial|dentista|piloto|advogado|enfermeiro|veterinario|arquiteto|jornalista|astronauta|mecanico|designer|fotografo|garcom|engenheiro|padeiro|ator|psicologo|motorista|eletricista|cientista|biologo|detetive|juiz|carteiro|carpinteiro|barbeiro|bailarino|magico', '🧑‍💼'],
  ['mickey|bob esponja|scooby|pica pau|tom|jerry|homer|bart|pernalonga|shrek|dora|popeye|patrick|finn|jake|coragem|naruto|goku|pikachu|po|elsa|masha|luffy|stitch|pantera|garfield|buzz|coringa|robin|gato de botas|wall e|nemo|simba', '🎬'],
  ['harry potter|darth vader|homem aranha|batman|superman|barbie|jack sparrow|hermione|walter white|eleven|jon snow|tony stark|woody|katniss|neo|indiana|deadpool|wolverine|frodo|hulk|loki|wandinha|mandaloriano|sherlock|gollum|james bond|jack dawson|voldemort|dumbledore|pennywise', '🎥'],
  ['brasil|argentina|japao|italia|franca|canada|mexico|portugal|alemanha|egito|australia|chile|india|china|coreia|noruega|suecia|grecia|peru|colombia|espanha|tailandia|marrocos|islandia|africa|londres|paris|toquio|roma|nova york|cairo|lisboa|amsterda', '🌎'],
  ['playstation|xbox|nintendo|minecraft|fortnite|inteligencia artificial|robo|drone|realidade virtual|metaverso|bitcoin|hacker|teclado|mouse|placa de video|impressora|smartwatch|satelite|algoritmo|cyberpunk|super mario|sonic|pac man|tetris|zelda|gta|among us|foguete|chip|monitor|gamepad', '🎮'],
  ['guitarra|bateria|violao|piano|saxofone|microfone|rock|samba|pop|funk|jazz|hip hop|eletronica|reggae|bossa|heavy metal|cassete|vinil|concerto|show|festival|maestro|trompete|violino|baixo|acordeom|dj|banda|flauta|karaoke', '🎵'],
  ['futebol|basquete|volei|tenis|natacao|skate|surfe|corrida|ciclismo|boxe|judo|golfe|escalada|boliche|formula|arco|patinacao|handebol|rugby|canoagem|paraquedismo|xadrez|sinuca|musculacao|ioga|dardo|snowboard', '🏅'],
  ['dragao|fenix|zeus|thor|poseidon|medusa|centauro|minotauro|unicornio|pegasus|lobisomem|vampiro|mago|bruxa|duende|elfo|anao|sereia|troia|excalibur|valhala|olimpo|atlas|hercules|afrodite|ares|kraken|esfinge|ciclope|anubis', '🐉'],
]

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export interface WordVisual {
  imageSrc?: string
  emoji: string
}

export function wordVisual(word: string): WordVisual {
  const normalized = normalize(word)
  const image = OBJECT_IMAGE_BY_WORD[normalized]
  if (image) {
    return {
      imageSrc: `/word-images/objetos-cotidianos/${image}`,
      emoji: '🧳',
    }
  }

  const rule = WORD_EMOJI_RULES.find(([pattern]) => new RegExp(`(?:^| )(${pattern})(?:$| )`).test(normalized))
  return { emoji: rule?.[1] ?? '✨' }
}
