import { Button } from '../components/Button'
import { ArrowRightIcon } from '../components/Icons'

interface StartScreenProps {
  hasSavedGame: boolean
  onPlay: () => void
}

export function StartScreen({ hasSavedGame, onPlay }: StartScreenProps) {
  return (
    <div className="screen screen--center start">
      <span className="start__glow" aria-hidden="true" />

      <img
        className="start__logo"
        src="/brand/logo-wordmark.png"
        alt="Blefaê"
        width={800}
        height={533}
      />

      <p className="start__tagline">Descubra quem está blefando</p>
      <p className="start__lead">
        Um jogo de dedução social para jogar presencialmente com um único celular.
      </p>

      <div className="start__actions">
        <Button
          block
          onClick={onPlay}
          icon={<ArrowRightIcon size={18} />}
          className="start__play"
        >
          JOGAR
        </Button>
        {hasSavedGame ? (
          <p className="start__hint">Há uma partida em andamento salva neste dispositivo.</p>
        ) : null}
      </div>

      <p className="start__footer">Desenvolvido por: @fellpsfr | github.com/ferreiraffj</p>
    </div>
  )
}
