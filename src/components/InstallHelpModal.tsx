import { Modal } from './Modal'
import { Button } from './Button'
import { DownloadIcon, ShareIcon } from './Icons'

interface InstallHelpModalProps {
  isIos: boolean
  onClose: () => void
}

export function InstallHelpModal({ isIos, onClose }: InstallHelpModalProps) {
  return (
    <Modal
      title="Instalar o Blefaê"
      subtitle="Jogue como um app, até sem internet."
      onClose={onClose}
      footer={
        <Button block onClick={onClose}>
          ENTENDI
        </Button>
      }
    >
      <div className="install-steps">
        <div className="install-step">
          <span className="install-step__icon">
            <ShareIcon size={22} />
          </span>
          <div>
            <p className="install-step__title">
              {isIos ? 'No Safari, toque em Compartilhar' : 'Abra o menu do navegador'}
            </p>
            <p className="install-step__text">
              {isIos
                ? 'O ícone fica na barra inferior (um quadrado com uma seta para cima).'
                : 'No Chrome, toque nos três pontinhos no canto superior direito.'}
            </p>
          </div>
        </div>

        <div className="install-step">
          <span className="install-step__icon">
            <DownloadIcon size={22} />
          </span>
          <div>
            <p className="install-step__title">
              {isIos ? 'Escolha “Adicionar à Tela de Início”' : 'Toque em “Instalar aplicativo”'}
            </p>
            <p className="install-step__text">
              O Blefaê ganha um ícone na tela inicial e abre em tela cheia, sem a barra do
              navegador.
            </p>
          </div>
        </div>
      </div>

      <p className="modal-text modal-text--muted">
        A instalação é opcional. O jogo também funciona normalmente pelo navegador.
      </p>
    </Modal>
  )
}
