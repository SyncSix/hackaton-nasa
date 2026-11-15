import { Mountain, Radiation, Satellite, Users, Weight } from 'lucide-react'

const MAPA = {
  Radiation,
  Users,
  Satellite,
  Weight,
  Mountain,
} as const

/**
 * Ícone temático de cada categoria RIDGE.
 * A letra permanece como reforço textual, mas o ícone carrega o significado.
 */
export function RidgeIcone({
  icone,
  tamanho = 16,
  className = '',
}: {
  icone: keyof typeof MAPA
  tamanho?: number
  className?: string
}) {
  const Componente = MAPA[icone] ?? Mountain
  return <Componente size={tamanho} className={className} aria-hidden="true" />
}
