/**
 * Formatação única de unidades, para que o mesmo dado não apareça com
 * valores diferentes em telas diferentes.
 */

import { idioma } from './i18n'

/** Converte pressão em Pa para kPa, com uma casa decimal. */
export function paParaKpa(pa: number): string {
  return (pa / 1000).toFixed(2)
}

/** Temperatura com uma casa decimal e sinal explícito. */
export function temperatura(c: number): string {
  return `${c.toFixed(1).replace('.', ',')} °C`
}

/** Vento em m/s com uma casa decimal. */
export function vento(ms: number): string {
  return `${ms.toFixed(1).replace('.', ',')} m/s`
}

/** Data e hora em formato local curto. */
export function dataLocal(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(idioma() === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
