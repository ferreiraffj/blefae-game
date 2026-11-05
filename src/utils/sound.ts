export type SoundName =
  | 'clique'
  | 'confirmacao'
  | 'palavra_correta'
  | 'palavra_incorreta'
  | 'suspense'
  | 'vencedor'

const VOLUMES: Record<SoundName, number> = {
  clique: 0.28,
  confirmacao: 0.55,
  palavra_correta: 0.6,
  palavra_incorreta: 0.6,
  suspense: 0.5,
  vencedor: 0.55,
}

const SOURCES: Record<SoundName, string> = {
  clique: '/sounds/clique.wav',
  confirmacao: '/sounds/confirmacao.ogg',
  palavra_correta: '/sounds/palavra_correta.wav',
  palavra_incorreta: '/sounds/palavra_incorreta.wav',
  suspense: '/sounds/suspense.wav',
  vencedor: '/sounds/vencedor.wav',
}

const cache = new Map<SoundName, HTMLAudioElement>()

function getAudio(name: SoundName): HTMLAudioElement | null {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null

  const cached = cache.get(name)
  if (cached) return cached

  const audio = new Audio(SOURCES[name])
  audio.preload = 'auto'
  audio.volume = VOLUMES[name]
  cache.set(name, audio)
  return audio
}

/** Pré-carrega os efeitos para que a primeira reprodução não atrase. */
export function preloadSounds(): void {
  for (const name of Object.keys(SOURCES) as SoundName[]) {
    getAudio(name)?.load()
  }
}

/**
 * Reproduz um efeito sonoro. Falhas de autoplay ou formato são silenciosas,
 * para nunca interromper o fluxo do jogo.
 */
export function playSound(name: SoundName, delayMs = 0): void {
  if (typeof window === 'undefined') return

  const play = () => {
    const audio = getAudio(name)
    if (!audio) return

    try {
      audio.currentTime = 0
      const result = audio.play()
      if (result && typeof result.catch === 'function') result.catch(() => {})
    } catch {
      // Ignora bloqueios do navegador ou indisponibilidade do arquivo.
    }
  }

  if (delayMs > 0) {
    window.setTimeout(play, delayMs)
    return
  }

  play()
}

/** Interrompe um efeito (usado para cortar o suspense quando a revelação chega). */
export function stopSound(name: SoundName): void {
  if (typeof window === 'undefined') return

  const audio = cache.get(name)
  if (!audio) return

  try {
    audio.pause()
    audio.currentTime = 0
  } catch {
    // Ignora indisponibilidade do arquivo.
  }
}
