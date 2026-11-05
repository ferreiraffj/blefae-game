import { Button } from './Button'
import { FlagIcon } from './Icons'
import { Modal } from './Modal'

interface EndGameDialogProps {
  onClose: () => void
  onConfirm: () => void
}

export function EndGameDialog({ onClose, onConfirm }: EndGameDialogProps) {
  return (
    <Modal
      title="Encerrar partida?"
      subtitle="Você pode finalizar o jogo antes da última rodada."
      onClose={onClose}
      footer={
        <div className="modal__actions">
          <Button variant="ghost" onClick={onClose}>
            CONTINUAR JOGANDO
          </Button>
          <Button variant="danger" onClick={onConfirm} icon={<FlagIcon size={16} />}>
            ENCERRAR AGORA
          </Button>
        </div>
      }
    >
      <p className="modal-text">
        A classificação atual será mantida e a partida será finalizada. Os pontos da rodada em
        andamento não serão contabilizados.
      </p>
    </Modal>
  )
}
