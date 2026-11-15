import { Languages } from 'lucide-react'
import { definirIdioma, idioma, t } from '../lib/i18n'

/**
 * Alternador de idioma.
 *
 * A troca recarrega a página de propósito: os arquivos de dados montam suas
 * constantes no carregamento do módulo, então recarregar é o jeito mais
 * simples e confiável de remontá-las no idioma novo.
 */
export function SeletorIdioma() {
  const atual = idioma()

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded border border-white/12 bg-black/25 p-0.5"
      role="group"
      aria-label={t('Idioma da interface')}
    >
      <Languages size={11} className="ml-1 mr-0.5 text-gelo/50" aria-hidden="true" />
      {(['en', 'pt'] as const).map((i) => (
        <button
          key={i}
          onClick={() => definirIdioma(i)}
          aria-pressed={atual === i}
          className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider transition-colors ${
            atual === i
              ? 'bg-marte/20 text-marte'
              : 'text-gelo/55 hover:bg-white/5 hover:text-gelo/85'
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  )
}
