import { useState } from 'react'
import { AlertTriangle, Check, Clock, Route as RouteIcon } from 'lucide-react'
import { ALVOS, ROTAS } from '../lib/mission'

const RISCO = {
  baixo: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  moderado: 'text-alerta bg-alerta/10 border-alerta/25',
  alto: 'text-marte bg-marte/10 border-marte/25',
}

export function Rotas() {
  const [selecionada, setSelecionada] = useState<string>('R2')
  const rota = ROTAS.find((r) => r.id === selecionada) ?? ROTAS[0]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section>
        <div className="label">Planejamento de deslocamento</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Rotas</h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/50">
          Compare risco, consumo de oxigênio e duração antes de escolher o trajeto. A rota mais
          curta não é necessariamente a mais segura.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Lista de rotas */}
        <section className="space-y-3 lg:col-span-2">
          {ROTAS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelecionada(r.id)}
              className={`panel w-full p-4 text-left transition-colors ${
                r.id === selecionada
                  ? 'border-marte/50 bg-marte/5'
                  : 'hover:border-white/15 hover:bg-titanio'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gelo/35">{r.id}</span>
                    <span className="truncate text-[12.5px] font-medium">{r.nome}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gelo/40">{r.descricao}</p>
                </div>
                {r.id === selecionada && <Check size={14} className="shrink-0 text-marte" />}
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] text-gelo/50">
                <span className="flex items-center gap-1">
                  <RouteIcon size={11} /> {r.distanciaKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {r.duracao}
                </span>
                <span className={`ml-auto rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${RISCO[r.risco]}`}>
                  {r.risco}
                </span>
              </div>
            </button>
          ))}
        </section>

        {/* Detalhe da rota */}
        <section className="panel p-5 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="label">Rota selecionada</div>
              <h2 className="mt-1 text-[15px] font-semibold tracking-tight">{rota.nome}</h2>
            </div>
            <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${RISCO[rota.risco]}`}>
              risco {rota.risco}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Dado rotulo="Distância" valor={`${rota.distanciaKm} km`} />
            <Dado rotulo="Duração" valor={rota.duracao} />
            <Dado rotulo="Inclinação máx." valor={`${rota.inclinacaoMax}°`} />
            <Dado rotulo="O₂ necessário" valor={`${rota.o2Necessario}%`} />
          </div>

          {/* Perfil de inclinação aproximado */}
          <div className="mt-5">
            <div className="label mb-2">Perfil de inclinação</div>
            <div className="flex h-24 items-end gap-0.5 rounded border border-white/6 bg-black/20 p-2">
              {PERFIL[rota.id]?.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${
                    h > 20 ? 'bg-marte/70' : h > 12 ? 'bg-alerta/60' : 'bg-emerald-400/40'
                  }`}
                  style={{ height: `${h}%` }}
                  title={`${((h / 100) * 30).toFixed(0)}° inclinação`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-gelo/35">
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
            <div className="mt-4 flex items-start gap-2 rounded border border-alerta/25 bg-alerta/5 p-2.5">
              <AlertTriangle size={13} className="mt-0.5 shrink-0 text-alerta" />
              <p className="text-[11px] leading-relaxed text-alerta/90">
                Encosta acima de 20° exige redução de velocidade e avaliação do terreno por imagem.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Alvos científicos */}
      <section className="panel p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">Alvos científicos</h2>
        <p className="text-[11px] text-gelo/40">
          Proximidade de um alvo não implica acesso seguro.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-white/8 text-[10px] uppercase tracking-wider text-gelo/35">
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
                  <td className="py-2 font-mono text-[11px] text-gelo/35">{a.id}</td>
                  <td className="py-2 text-gelo/85">{a.nome}</td>
                  <td className="py-2 text-gelo/45">{a.tipo}</td>
                  <td className="py-2 text-right font-mono tnum text-gelo/60">
                    {a.distanciaKm} km
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={
                        a.prioridade === 'alta'
                          ? 'text-marte'
                          : a.prioridade === 'média'
                            ? 'text-alerta'
                            : 'text-gelo/40'
                      }
                    >
                      {a.prioridade}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={
                        a.status === 'acessível' ? 'text-emerald-400' : 'text-gelo/35'
                      }
                    >
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

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded border border-white/6 bg-black/20 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gelo/35">{rotulo}</div>
      <div className="mt-0.5 font-mono text-[15px] tnum">{valor}</div>
    </div>
  )
}

/** Perfil de elevação ilustrativo por rota (alturas relativas em %). */
const PERFIL: Record<string, number[]> = {
  R1: [8, 12, 18, 26, 34, 42, 50, 58, 62, 55, 46, 38, 30, 26, 34, 44, 52, 46, 36, 28, 20, 14, 10],
  R2: [6, 8, 9, 10, 12, 11, 9, 8, 10, 13, 11, 9, 7, 8, 10, 9, 7, 6, 8, 7, 6, 5, 5],
}

