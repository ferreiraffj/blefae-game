import { animalAsset, ANIMAL_LABELS, animalForIndex, type AnimalId } from '../domain/animals'
import { cx } from '../utils'

interface AnimalAvatarProps {
  animalId?: AnimalId
  index?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AnimalAvatar({ animalId, index = 0, size = 'md', className }: AnimalAvatarProps) {
  const resolvedAnimal = animalId ?? animalForIndex(index)
  return (
    <img
      className={cx('animal-avatar', `animal-avatar--${size}`, className)}
      src={animalAsset(resolvedAnimal)}
      alt={ANIMAL_LABELS[resolvedAnimal]}
    />
  )
}
