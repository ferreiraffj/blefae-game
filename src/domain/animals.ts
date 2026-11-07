export const ANIMAL_IDS = [
  'cachorro',
  'gato',
  'leao',
  'zebra',
  'aguia',
  'papagaio',
  'cobra',
  'elefante',
  'porco',
  'tartaruga',
  'coelho',
  'dinossauro-rex',
] as const

export type AnimalId = (typeof ANIMAL_IDS)[number]

export const ANIMAL_LABELS: Record<AnimalId, string> = {
  cachorro: 'Cachorro',
  gato: 'Gato',
  leao: 'Leão',
  zebra: 'Zebra',
  aguia: 'Águia',
  papagaio: 'Papagaio',
  cobra: 'Cobra',
  elefante: 'Elefante',
  porco: 'Porco',
  tartaruga: 'Tartaruga',
  coelho: 'Coelho',
  'dinossauro-rex': 'Dinossauro rex',
}

export function animalAsset(animalId: AnimalId): string {
  return `/animals/${animalId}.png`
}

export function animalForIndex(index: number): AnimalId {
  return ANIMAL_IDS[index % ANIMAL_IDS.length]
}

export function shuffledAnimals(count: number): AnimalId[] {
  const available = [...ANIMAL_IDS]
  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[available[index], available[swapIndex]] = [available[swapIndex], available[index]]
  }
  return available.slice(0, count)
}
