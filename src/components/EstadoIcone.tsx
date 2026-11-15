import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import type { Estado } from '../lib/ridge'
import { t } from '../lib/i18n'

/**
 * Indicador de estado que não depende só da cor: cada estado tem
 * forma e ícone próprios, para leitura em condições de baixa visão
 * ou daltonismo.
 */
export function EstadoIcone({
  estado,
  tamanho = 12,
  className = '',
}: {
  estado: Estado
  tamanho?: number
  className?: string
}) {
  if (estado === 'critico') {
    return <XCircle size={tamanho} className={`text-critico ${className}`} aria-label={t("Crítico")} />
  }
  if (estado === 'atencao') {
    return (
      <AlertTriangle size={tamanho} className={`text-alerta ${className}`} aria-label={t("Atenção")} />
    )
  }
  return (
    <CheckCircle2
      size={tamanho}
      className={`text-nominal ${className}`}
      aria-label={t("Nominal")}
    />
  )
}

/** Ponto de estado com forma distinta: círculo, triângulo e losango. */
export function EstadoPonto({ estado, className = '' }: { estado: Estado; className?: string }) {
  if (estado === 'critico') {
    return (
      <span
        className={`inline-block h-2 w-2 rotate-45 bg-critico ${className}`}
        aria-label={t("Crítico")}
      />
    )
  }
  if (estado === 'atencao') {
    return (
      <span
        className={`inline-block h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-alerta ${className}`}
        aria-label={t("Atenção")}
      />
    )
  }
  return (
    <span className={`inline-block h-2 w-2 rounded-full bg-nominal ${className}`} aria-label={t("Nominal")} />
  )
}
