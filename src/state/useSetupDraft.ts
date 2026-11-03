import { useEffect, useState } from 'react'
import type { SetupDraft } from '../domain/types'
import { loadSetupDraft, persistSetupDraft } from '../state/storage'

export function useSetupDraft() {
  const [draft, setDraft] = useState<SetupDraft>(loadSetupDraft)

  useEffect(() => {
    persistSetupDraft(draft)
  }, [draft])

  return [draft, setDraft] as const
}
