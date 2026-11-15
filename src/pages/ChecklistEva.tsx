import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react'
import { CRITICOS, GRUPOS_EVA, TODOS_ITENS } from '../lib/eva'

const ROTULO_FASE: Record<string, string> = {
  pre: 'Pré-EVA',
  durante: 'Durante',
  pos: 'Pós-EVA',
}

export function ChecklistEva() {
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
    <div className="mx-auto max-w-5xl space-y-4 px-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label-micro">Atividade extraveicular</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Checklist de EVA</h1>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-gelo/45">
            Verificações antes, durante e depois da saída. Os itens críticos bloqueiam a
            autorização da atividade.
          </p>
        </div>
        <button
          onClick={() => setFeitos(new Set())}
          className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] text-gelo/60 transition-colors hover:border-white/25"
        >
          <RotateCcw size={11} /> Reiniciar
        </button>
      </header>

      {/* Estado de autorização */}
      <section
        className={`card-glass flex flex-wrap items-center gap-4 p-4 ${
          progresso.autorizado ? 'border-emerald-400/35' : 'border-alerta/35'
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            progresso.autorizado
              ? 'bg-emerald-400/12 text-emerald-400'
              : 'bg-alerta/12 text-alerta'
          }`}
        >
          {progresso.autorizado ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={`text-[13px] font-semibold tracking-tight ${
              progresso.autorizado ? 'text-emerald-400' : 'text-alerta'
            }`}
          >
            {progresso.autorizado ? 'EVA autorizada' : 'EVA não autorizada'}
          </div>
          <p className="text-[11px] text-gelo/45">
            {progresso.autorizado
              ? 'Todos os itens críticos foram verificados.'
              : `${progresso.pendentesCriticos.length} ${
                  progresso.pendentesCriticos.length === 1
                    ? 'item crítico pendente'
                    : 'itens críticos pendentes'
                }`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div className="text-center">
            <div className="font-mono text-[15px] font-semibold tnum text-gelo/85">
              {progresso.criticosFeitos}
              <span className="text-[10px] text-gelo/30">/{CRITICOS}</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gelo/30">críticos</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[15px] font-semibold tnum text-gelo/85">
              {progresso.pct}%
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gelo/30">total</div>
          </div>
        </div>
      </section>

      {/* Barra de progresso */}
      <div className="h-1 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full transition-all ${
            progresso.autorizado ? 'bg-emerald-400' : 'bg-alerta'
          }`}
          style={{ width: `${progresso.pct}%` }}
        />
      </div>

      {/* Grupos */}
      <div className="space-y-3">
        {GRUPOS_EVA.map((g) => {
          const feitosNoGrupo = g.itens.filter((i) => feitos.has(i.id)).length
          return (
            <section key={g.fase} className="card-glass overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-gelo/45">
                      {ROTULO_FASE[g.fase]}
                    </span>
                    <h2 className="text-[12.5px] font-semibold tracking-tight">{g.titulo}</h2>
                  </div>
                  <p className="mt-0.5 text-[10px] text-gelo/30">{g.descricao}</p>
                </div>
                <span className="font-mono text-[10.5px] tnum text-gelo/35">
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
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            feito
                              ? 'border-emerald-400 bg-emerald-400 text-grafite'
                              : 'border-white/25 bg-transparent'
                          }`}
                        >
                          {feito && <CheckCircle2 size={11} strokeWidth={3} />}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-[12px] ${
                                feito ? 'text-gelo/40 line-through' : 'text-gelo/85'
                              }`}
                            >
                              {i.texto}
                            </span>
                            {i.critico && (
                              <span className="rounded bg-marte/12 px-1 py-0.5 text-[8px] uppercase tracking-wider text-marte">
                                crítico
                              </span>
                            )}
                          </div>
                          {i.detalhe && (
                            <p className="mt-0.5 text-[10px] leading-relaxed text-gelo/30">
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

      <div className="flex items-start gap-2 rounded-lg border border-alerta/25 bg-alerta/5 p-3">
        <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
        <p className="text-[10px] leading-relaxed text-alerta/85">
          Checklist ilustrativo, baseado em princípios gerais de operação de traje. Não é
          procedimento operacional validado e não deve orientar atividade real.
        </p>
      </div>
    </div>
  )
}
