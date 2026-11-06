export interface SeasonalTheme {
  key: 'halloween'
  label: string
  fromMonth: number
  fromDay: number
  untilMonth: number
  untilDay: number
}

/**
 * Catálogo de temporadas. Para adicionar uma nova data sazonal, inclua outro
 * registro e seus estilos em global.css sem alterar o tema visual do usuário.
 */
export const SEASONAL_THEMES: readonly SeasonalTheme[] = [
  {
    key: 'halloween',
    label: 'Halloween',
    fromMonth: 10,
    fromDay: 1,
    untilMonth: 11,
    untilDay: 7,
  },
]

function dayOfYear(month: number, day: number): number {
  return month * 100 + day
}

export function getActiveSeasonalTheme(
  date: Date = new Date(),
): SeasonalTheme | null {
  const current = dayOfYear(date.getMonth() + 1, date.getDate())

  return (
    SEASONAL_THEMES.find((theme) => {
      const start = dayOfYear(theme.fromMonth, theme.fromDay)
      const end = dayOfYear(theme.untilMonth, theme.untilDay)
      return current >= start && current <= end
    }) ?? null
  )
}
