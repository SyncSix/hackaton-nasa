import { Radio } from 'lucide-react'
import { avaliarResiduo, RESIDUOS } from '../lib/atmosfera'
import { CORES } from '../lib/ridge'
import { EstadoIcone } from './EstadoIcone'

export function PainelResiduos() {
  return (
    <div className="space-y-4">
      <section className="card-glass p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">
          Resíduos e voláteis do ciclo do ar
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-gelo/60">
          O ECLSS não remove só CO₂. Umidade, amônia, metano e voláteis orgânicos também circulam.
          Acúmulo de voláteis é invisível e tóxico — não tem cheiro nem sintoma imediato.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RESIDUOS.map((r) => {
          const e = avaliarResiduo(r)
          const cor = CORES[e]
          return (
            <div key={r.id} className={`card-glass card-estado card-estado-${e} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11.5px] font-medium text-gelo/85">{r.nome}</span>
                <EstadoIcone estado={e} tamanho={11} />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`font-mono text-xl font-medium tnum ${cor.texto}`}>{r.valor}</span>
                <span className="text-[10px] text-gelo/40">{r.unidade}</span>
              </div>
              <div className="text-[10px] text-gelo/45">
                limite {r.risco === 'alto' ? 'máximo' : 'mínimo'} {r.limite} {r.unidade}
              </div>
              <p className="mt-2 border-t border-white/8 pt-2 text-[10px] leading-relaxed text-gelo/50">
                {r.efeito}
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                <Radio size={9} className="shrink-0 text-marte/70" />
                <span className="truncate text-[9.5px] text-gelo/45">{r.sistema}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
