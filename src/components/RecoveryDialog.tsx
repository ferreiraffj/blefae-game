import { Modal } from './Modal'
import { Button } from './Button'

interface RecoveryDialogProps {
  onContinue: () => void
  onDiscard: () => void
}

export function RecoveryDialog({ onContinue, onDiscard }: RecoveryDialogProps) {
  return (
    <Modal
      title="Partida em andamento"
      onClose={onContinue}
      footer={
        <div className="modal__actions">
          <Button variant="ghost" onClick={onDiscard}>
            Nova partida
          </Button>
          <Button onClick={onContinue}>Continuar</Button>
        </div>
      }
    >
      <p className="modal-text">
        Encontramos uma partida iniciada nas últimas 24 horas. Deseja continuar de onde parou?
      </p>
    </Modal>
  )
}
