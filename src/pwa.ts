import { registerSW } from 'virtual:pwa-register'
import { hasGameInProgress } from './state/storage'

/** De quanto em quanto tempo procura uma versão nova do app. */
const CHECK_INTERVAL_MS = 15 * 60 * 1000
/** Enquanto houver partida em andamento, de quanto em quanto tempo tenta recarregar. */
const IDLE_RECHECK_MS = 5 * 1000

/**
 * A nova versão já assumiu o controle do service worker. Recarrega na hora se
 * não houver jogo em andamento; caso contrário espera a partida terminar para
 * não interromper quem está jogando.
 */
function reloadWhenIdle(): void {
  if (!hasGameInProgress()) {
    window.location.reload()
    return
  }
  window.setTimeout(reloadWhenIdle, IDLE_RECHECK_MS)
}

/**
 * Registra o service worker com atualização automática:
 * - recarrega quando uma versão nova é ativada;
 * - verifica atualizações periodicamente e sempre que o app volta ao primeiro
 *   plano (o navegador, sozinho, só procura uma vez a cada 24 horas).
 */
export function setupPwaUpdates(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  registerSW({
    immediate: true,
    onNeedReload() {
      reloadWhenIdle()
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return

      const checkForUpdate = () => {
        if (document.visibilityState !== 'visible') return
        registration.update().catch(() => {
          // Sem conexão ou fora do ar: tenta de novo no próximo ciclo.
        })
      }

      window.setInterval(checkForUpdate, CHECK_INTERVAL_MS)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate()
      })
      window.addEventListener('online', checkForUpdate)
    },
    onRegisterError(error) {
      console.warn('[PWA] Não foi possível registrar o service worker.', error)
    },
  })
}
