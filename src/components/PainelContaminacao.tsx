import { Radio } from 'lucide-react'
import { avaliarZona, CICLOS_TRAJE, estadoGlobal, ZONAS } from '../lib/contaminacao'
import { CORES } from '../lib/ridge'
import { EstadoIcone } from './EstadoIcone'

export function PainelContaminacao() {
  const global = estadoGlobal()
  const cor = CORES[global]

  return (
    <div className="space-y-4">
      <section className={`card-glass card-estado card-estado-${global} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="label-micro">Proteção planetária</div>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight">
              Controle de contaminação
            </h2>
            <p className="mt-1 max-w-2xl text-[11.5px] leading-relaxed text-gelo/60">
              Dois sentidos: microrganismos terrestres não podem contaminar Marte, e material
              marciano não pode entrar no habitat. O solo tem 0,5–1% de percloratos, tóxico para a
              tireoide e para os pulmões.
            </p>
          </div>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cor.bg} ${cor.texto} ${cor.borda}`}
          >
            {cor.rotulo}
          </span>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {ZONAS.map((z) => {
          const e = avaliarZona(z)
          const c = CORES[e]
          return (
            <div key={z.id} className={`card-glass card-estado card-estado-${e} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[12px] font-medium text-gelo/90">{z.nome}</span>
                <EstadoIcone estado={e} tamanho={11} />
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-gelo/50">{z.descricao}</p>

              <div className="mt-2.5 flex items-baseline gap-1">
                <span className={`font-mono text-lg font-medium tnum ${c.texto}`}>{z.nivel}</span>
                <span className="text-[10px] text-gelo/40">/ limite {z.limite}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full ${c.texto.replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min(100, (z.nivel / z.limite) * 100)}%` }}
                />
              </div>

              <p className={`mt-2 text-[10.5px] leading-relaxed ${c.texto}`}>→ {z.acao}</p>
              <div className="mt-1.5 flex items-center gap-1">
                <Radio size={9} className="shrink-0 text-marte/70" />
                <span className="truncate text-[9.5px] text-gelo/45">{z.equipamento}</span>
              </div>
            </div>
          )
        })}
      </div>

      <section className="card-glass p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium text-gelo/90">Ciclos de EVA do traje</div>
            <p className="mt-0.5 text-[10.5px] text-gelo/50">{CICLOS_TRAJE.nota}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-semibold tnum text-alerta">
              {CICLOS_TRAJE.usados}
              <span className="text-[11px] text-gelo/40">/{CICLOS_TRAJE.limite}</span>
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-gelo/40">ciclos</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-alerta"
            style={{ width: `${(CICLOS_TRAJE.usados / CICLOS_TRAJE.limite) * 100}%` }}
          />
        </div>
      </section>
    </div>
  )
}
