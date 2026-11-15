import { useMemo, useState } from 'react'
import { AlertTriangle, Check, Clock, Mountain, Route as RouteIcon, Sparkles } from 'lucide-react'
import { ALVOS, ROTAS } from '../lib/mission'

type Prioridade = 'tempo' | 'recursos' | 'ciencia'

const PRIORIDADES: Array<{ id: Prioridade; rotulo: string; descricao: string }> = [
  { id: 'tempo', rotulo: 'Menor duração', descricao: 'Voltar mais rápido ao habitat' },
  { id: 'recursos', rotulo: 'Menor consumo', descricao: 'Economizar oxigênio' },
  { id: 'ciencia', rotulo: 'Maior valor científico', descricao: 'Visitar mais alvos' },
]

const VALOR_CIENTIFICO: Record<string, number> = { R1: 3, R2: 2 }
const VALOR_CIENTIFICO_ROTULO: Record<string, string> = { R1: 'Alto', R2: 'Médio' }

const RISCO = {
  baixo: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  moderado: 'text-alerta bg-alerta/10 border-alerta/25',
  alto: 'text-marte bg-marte/10 border-marte/25',
}

function minutos(duracao: string): number {
  const h = /(\d+)\s*h/.exec(duracao)
  const m = /(\d+)\s*min/.exec(duracao)
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
}

export function Rotas() {
  const [prioridade, setPrioridade] = useState<Prioridade>('recursos')
  const [selecionada, setSelecionada] = useState('R2')

  const recomendada = useMemo(() => {
    const pontuar = (id: string) => {
      const r = ROTAS.find((x) => x.id === id)!
      if (prioridade === 'tempo') return -minutos(r.duracao)
      if (prioridade === 'recursos') return -r.o2Necessario
      return VALOR_CIENTIFICO[r.id] ?? 0
    }
    return [...ROTAS].sort((a, b) => pontuar(b.id) - pontuar(a.id))[0].id
  }, [prioridade])

  const rota = ROTAS.find((r) => r.id === selecionada) ?? ROTAS[0]

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Planejamento de deslocamento</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Rotas</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/45">
          Compare trajetos por distância, duração, inclinação, consumo de oxigênio e valor
          científico. A rota mais curta não é necessariamente a mais segura.
        </p>
      </header>

      <section className="card-glass p-4">
        <div className="label-micro mb-2.5">O que importa nesta saída</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRIORIDADES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPrioridade(p.id)}
              className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                prioridade === p.id
                  ? 'border-marte/50 bg-marte/8'
                  : 'border-white/8 bg-black/20 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full border ${
                    prioridade === p.id ? 'border-marte bg-marte' : 'border-white/25'
                  }`}
                />
                <span className="text-[11.5px] font-medium text-gelo/85">{p.rotulo}</span>
              </div>
              <div className="ml-4 text-[10px] text-gelo/35">{p.descricao}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card-glass overflow-hidden">
        <div className="border-b border-white/8 px-4 py-3">
          <h2 className="text-[13px] font-semibold tracking-tight">Comparação multicritério</h2>
          <p className="text-[10.5px] text-gelo/35">Valores ilustrativos do protótipo</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-white/8 text-[9px] uppercase tracking-wider text-gelo/30">
                <th className="px-4 py-2 font-medium">Critério</th>
                {ROTAS.map((r) => (
                  <th key={r.id} className="px-4 py-2 text-right font-medium">
                    <span className="flex items-center justify-end gap-1.5">
                      {r.id === recomendada && <Sparkles size={10} className="text-marte" />}
                      {r.nome}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11.5px]">
              <Linha rotulo="Distância" valores={ROTAS.map((r) => `${r.distanciaKm} km`)} />
              <Linha rotulo="Duração" valores={ROTAS.map((r) => r.duracao)} />
              <Linha rotulo="Inclinação máxima" valores={ROTAS.map((r) => `${r.inclinacaoMax}°`)} />
              <Linha rotulo="Consumo de O₂" valores={ROTAS.map((r) => `${r.o2Necessario}%`)} />
              <Linha
                rotulo="Valor científico"
                valores={ROTAS.map((r) => VALOR_CIENTIFICO_ROTULO[r.id] ?? '—')}
              />
              <tr>
                <td className="px-4 py-2.5 text-gelo/45">Risco</td>
                {ROTAS.map((r) => (
                  <td key={r.id} className="px-4 py-2.5 text-right">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${RISCO[r.risco]}`}
                    >
                      {r.risco}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/8 bg-black/20 px-4 py-2.5">
          <p className="text-[10.5px] text-gelo/45">
            <span className="text-marte">Recomendação:</span>{' '}
            {ROTAS.find((r) => r.id === recomendada)?.nome} — melhor resultado para{' '}
            {PRIORIDADES.find((p) => p.id === prioridade)?.rotulo.toLowerCase()}.
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="space-y-2.5 lg:col-span-2">
          {ROTAS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelecionada(r.id)}
              className={`card-glass w-full p-4 text-left transition-colors ${
                r.id === selecionada
                  ? 'border-marte/50 bg-marte/5'
                  : 'hover:border-white/15 hover:bg-titanio'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-gelo/30">{r.id}</span>
                    <span className="truncate text-[12.5px] font-medium">{r.nome}</span>
                    {r.id === recomendada && (
                      <span className="shrink-0 rounded bg-marte/15 px-1.5 py-0.5 text-[8.5px] uppercase tracking-wider text-marte">
                        recomendada
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gelo/40">{r.descricao}</p>
                </div>
                {r.id === selecionada && <Check size={14} className="shrink-0 text-marte" />}
              </div>
              <div className="mt-2.5 flex items-center gap-4 text-[11px] text-gelo/50">
                <span className="flex items-center gap-1">
                  <RouteIcon size={11} /> {r.distanciaKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {r.duracao}
                </span>
                <span className="flex items-center gap-1">
                  <Mountain size={11} /> {r.inclinacaoMax}°
                </span>
              </div>
            </button>
          ))}
        </section>

        <section className="card-glass p-5 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-micro">Rota selecionada</div>
              <h2 className="mt-1 text-[15px] font-semibold tracking-tight">{rota.nome}</h2>
            </div>
            <span
              className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-wider ${RISCO[rota.risco]}`}
            >
              risco {rota.risco}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Dado rotulo="Distância" valor={`${rota.distanciaKm} km`} />
            <Dado rotulo="Duração" valor={rota.duracao} />
            <Dado rotulo="Inclinação" valor={`${rota.inclinacaoMax}°`} />
            <Dado rotulo="O₂" valor={`${rota.o2Necessario}%`} />
          </div>

          <div className="mt-4">
            <div className="label-micro mb-2">Perfil de inclinação</div>
            <div className="flex h-24 items-end gap-0.5 rounded border border-white/6 bg-black/20 p-2">
              {PERFIL[rota.id]?.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${
                    h > 20 ? 'bg-marte/70' : h > 12 ? 'bg-alerta/60' : 'bg-emerald-400/40'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[9.5px] text-gelo/30">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400/60" /> &lt; 12°
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-alerta/70" /> 12–20°
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-marte/80" /> &gt; 20°
              </span>
              <span className="ml-auto">Limite operacional: 30°</span>
            </div>
          </div>

          {rota.inclinacaoMax > 20 && (
            <div className="mt-3 flex items-start gap-2 rounded border border-alerta/25 bg-alerta/5 p-2.5">
              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
              <p className="text-[10.5px] leading-relaxed text-alerta/90">
                Encosta acima de 20° exige redução de velocidade e avaliação do terreno por imagem.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="card-glass p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">Alvos científicos</h2>
        <p className="text-[10.5px] text-gelo/35">
          Proximidade de um alvo não implica acesso seguro.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-white/8 text-[9px] uppercase tracking-wider text-gelo/30">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Alvo</th>
                <th className="pb-2 font-medium">Tipo</th>
                <th className="pb-2 text-right font-medium">Distância</th>
                <th className="pb-2 text-right font-medium">Prioridade</th>
                <th className="pb-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALVOS.map((a) => (
                <tr key={a.id}>
                  <td className="py-2 font-mono text-[10px] text-gelo/30">{a.id}</td>
                  <td className="py-2 text-gelo/85">{a.nome}</td>
                  <td className="py-2 text-gelo/40">{a.tipo}</td>
                  <td className="py-2 text-right font-mono tnum text-gelo/55">
                    {a.distanciaKm} km
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={
                        a.prioridade === 'alta'
                          ? 'text-marte'
                          : a.prioridade === 'média'
                            ? 'text-alerta'
                            : 'text-gelo/35'
                      }
                    >
                      {a.prioridade}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <span className={a.status === 'acessível' ? 'text-emerald-400' : 'text-gelo/30'}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Linha({ rotulo, valores }: { rotulo: string; valores: string[] }) {
  return (
    <tr>
      <td className="px-4 py-2.5 text-gelo/45">{rotulo}</td>
      {valores.map((v, i) => (
        <td key={i} className="px-4 py-2.5 text-right font-mono tnum text-gelo/80">
          {v}
        </td>
      ))}
    </tr>
  )
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded border border-white/6 bg-black/20 p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-gelo/30">{rotulo}</div>
      <div className="mt-0.5 font-mono text-[14px] tnum">{valor}</div>
    </div>
  )
}

const PERFIL: Record<string, number[]> = {
  R1: [8, 12, 18, 26, 34, 42, 50, 58, 62, 55, 46, 38, 30, 26, 34, 44, 52, 46, 36, 28, 20, 14, 10],
  R2: [6, 8, 9, 10, 12, 11, 9, 8, 10, 13, 11, 9, 7, 8, 10, 9, 7, 6, 8, 7, 6, 5, 5],
}
