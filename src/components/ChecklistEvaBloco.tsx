import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react'
import { CRITICOS, GRUPOS_EVA, TODOS_ITENS } from '../lib/eva'

const ROTULO_FASE: Record<string, string> = {
  pre: 'Pré-EVA',
  durante: 'Durante',
  pos: 'Pós-EVA',
}

/**
 * Checklist de EVA completo, em 3 fases.
 *
 * Fonte única: usado tanto na página dedicada quanto no Centro de Missão,
 * para que o astronauta veja exatamente os mesmos itens nos dois lugares.
 */
export function ChecklistEvaBloco({ compacto = false }: { compacto?: boolean }) {
  const [feitos, setFeitos] = useState<Set<string>>(new Set())

  function alternar(id: string) {
    setFeitos((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })
  }

  const progresso = useMemo(() => {
    const total = TODOS_ITENS.length
    const concluidos = feitos.size
    const criticosFeitos = TODOS_ITENS.filter((i) => i.critico && feitos.has(i.id)).length
    const pendentesCriticos = TODOS_ITENS.filter((i) => i.critico && !feitos.has(i.id))
    return {
      total,
      concluidos,
      pct: Math.round((concluidos / total) * 100),
      criticosFeitos,
      pendentesCriticos,
      autorizado: pendentesCriticos.length === 0,
    }
  }, [feitos])

  return (
    <div className="space-y-3">
      {/* Estado de autorização */}
      <section
        className={`card-glass card-estado flex flex-wrap items-center gap-4 p-4 ${
          progresso.autorizado ? 'card-estado-nominal' : 'card-estado-atencao'
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            progresso.autorizado ? 'bg-nominal/12 text-nominal' : 'bg-alerta/12 text-alerta'
          }`}
        >
          {progresso.autorizado ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={`text-[13px] font-semibold tracking-tight ${
              progresso.autorizado ? 'text-nominal' : 'text-alerta'
            }`}
          >
            {progresso.autorizado ? 'EVA autorizada' : 'EVA não autorizada'}
          </div>
          <p className="text-[11px] text-gelo/60">
            {progresso.autorizado
              ? 'Todos os itens críticos foram verificados.'
              : `${progresso.pendentesCriticos.length} ${
                  progresso.pendentesCriticos.length === 1
                    ? 'item crítico pendente'
                    : 'itens críticos pendentes'
                }`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-[15px] font-semibold tnum text-gelo/90">
              {progresso.criticosFeitos}
              <span className="text-[11px] text-gelo/65">/{CRITICOS}</span>
            </div>
            <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">críticos</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[15px] font-semibold tnum text-gelo/90">
              {progresso.pct}%
            </div>
            <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">total</div>
          </div>
          <button
            onClick={() => setFeitos(new Set())}
            className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[11.5px] text-gelo/65 transition-colors hover:border-white/30 hover:text-gelo/90"
            aria-label="Reiniciar checklist"
          >
            <RotateCcw size={10} /> reiniciar
          </button>
        </div>
      </section>

      {/* Barra de progresso */}
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all ${
            progresso.autorizado ? 'bg-nominal' : 'bg-alerta'
          }`}
          style={{ width: `${progresso.pct}%` }}
        />
      </div>

      {/* Grupos */}
      <div className="space-y-2.5">
        {GRUPOS_EVA.map((g) => {
          const feitosNoGrupo = g.itens.filter((i) => feitos.has(i.id)).length
          return (
            <section key={g.fase} className="card-glass overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-white/12 px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider text-gelo/60">
                      {ROTULO_FASE[g.fase]}
                    </span>
                    <h3 className="text-[12.5px] font-semibold tracking-tight">{g.titulo}</h3>
                  </div>
                  {!compacto && (
                    <p className="mt-0.5 text-[11.5px] text-gelo/65">{g.descricao}</p>
                  )}
                </div>
                <span className="font-mono text-[11.5px] tnum text-gelo/65">
                  {feitosNoGrupo}/{g.itens.length}
                </span>
              </div>

              <ul className="divide-y divide-white/5">
                {g.itens.map((i) => {
                  const feito = feitos.has(i.id)
                  return (
                    <li key={i.id}>
                      <button
                        onClick={() => alternar(i.id)}
                        className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                        aria-pressed={feito}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            feito
                              ? 'border-nominal bg-nominal text-grafite'
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          {feito && <CheckCircle2 size={11} strokeWidth={3} />}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-[12px] ${
                                feito ? 'text-gelo/65 line-through' : 'text-gelo/90'
                              }`}
                            >
                              {i.texto}
                            </span>
                            {i.critico && (
                              <span className="rounded bg-critico/15 px-1 py-0.5 text-[8.5px] uppercase tracking-wider text-critico">
                                crítico
                              </span>
                            )}
                          </div>
                          {i.detalhe && (
                            <p className="mt-0.5 text-[11.5px] leading-relaxed text-gelo/65">
                              {i.detalhe}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
