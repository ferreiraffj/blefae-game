import { APP_CREATOR, APP_GITHUB_URL, APP_GITHUB_USER, APP_VERSION } from '../appInfo'
import { Button } from './Button'
import { CheckIcon, DownloadIcon, ShareIcon } from './Icons'
import { Modal } from './Modal'

interface AboutModalProps {
  installed: boolean
  isIos: boolean
  onInstall: () => void
  onClose: () => void
}

export function AboutModal({ installed, isIos, onInstall, onClose }: AboutModalProps) {
  return (
    <Modal
      title="Sobre"
      subtitle="Blefaê — descubra quem está blefando."
      onClose={onClose}
      className="modal--about"
      footer={
        <Button block onClick={onClose}>
          FECHAR
        </Button>
      }
    >
      <div className="about__brand">
        <img
          className="about__logo"
          src="/brand/logo-icon.png"
          alt="Blefaê"
          width={58}
          height={58}
        />
        <div className="about__brand-copy">
          <p className="about__name">Blefaê</p>
          <p className="about__version">Versão {APP_VERSION}</p>
        </div>
      </div>

      <dl className="about__list">
        <div className="about__row">
          <dt className="about__label">Criador do app</dt>
          <dd className="about__value">{APP_CREATOR}</dd>
        </div>
        <div className="about__row">
          <dt className="about__label">GitHub</dt>
          <dd className="about__value">
            <a
              className="about__link"
              href={APP_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              @{APP_GITHUB_USER}
            </a>
          </dd>
        </div>
        <div className="about__row">
          <dt className="about__label">Versão atual</dt>
          <dd className="about__value">{APP_VERSION}</dd>
        </div>
      </dl>

      <div className="about__install">
        <p className="about__install-title">Instalar o app</p>
        <p className="about__install-text">
          {installed
            ? 'O Blefaê já está instalado neste dispositivo.'
            : isIos
              ? 'No iPhone ou iPad, adicione à Tela de Início pelo menu Compartilhar do Safari.'
              : 'Instale para abrir em tela cheia e jogar até sem internet.'}
        </p>

        {installed ? (
          <p className="about__installed">
            <CheckIcon size={16} />
            Instalado
          </p>
        ) : (
          <Button
            block
            icon={isIos ? <ShareIcon size={18} /> : <DownloadIcon size={18} />}
            onClick={onInstall}
          >
            {isIos ? 'COMO INSTALAR' : 'INSTALAR O APP'}
          </Button>
        )}
      </div>
    </Modal>
  )
}
