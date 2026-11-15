import type { Estado } from '../lib/ridge'

/**
 * Card com borda sutil na cor do estado.
 * Verde = dentro do limite, âmbar = atenção, vermelho = fora do limite.
 * A cor reforça o estado sem depender só dela: o conteúdo traz ícone e texto.
 */
export function CardEstado({
  estado,
  children,
  className = '',
  interativo = false,
}: {
  estado: Estado
  children: React.ReactNode
  className?: string
  interativo?: boolean
}) {
  return (
    <div
      className={`card-glass card-estado card-estado-${estado} ${
        interativo ? 'card-glass-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
