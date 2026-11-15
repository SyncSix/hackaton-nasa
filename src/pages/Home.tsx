import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,

  Radio,
  Route as RouteIcon,
  Thermometer,
  Utensils,
  Wind,
  Zap,
} from 'lucide-react'
import { Checkin } from '../components/Checkin'
import { ALVOS, CONSUMIVEIS, MISSAO, ROTAS, TRIPULACAO, diasRestantes, estadoConsumivel, percentual } from '../lib/mission'
import { avaliar, CORES_ESTADO, RISCOS } from '../lib/riscos'
import { useMarsWeather } from '../lib/useNasa'

const ICONES: Record<string, React.ReactNode> = {
  o2: <Wind size={15} />,
  agua: <Droplets size={15} />,
  energia: <Zap size={15} />,
  alimento: <Utensils size={15} />,
}

export function Home() {
  const { data: clima } = useMarsWeather()
  const sol = clima?.[clima.length - 1]

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-32 top-0 h-80 w-80 rounded-full bg-marte/12 blur-3xl" />
        <div className="animate-blob delay-600 absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-alerta/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-5 px-6 py-6">
        {/* Cabeçalho compacto */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="label-micro">Console da missão · {MISSAO.nome}</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {MISSAO.local}
            </h1>
            <p className="mt-0.5 text-[12px] text-gelo/40">
              {MISSAO.tripulacao} tripulantes · Sol {MISSAO.sol} · LMST {MISSAO.lmst}
            </p>
          </div>

          {sol && (
            <div className="flex items-center gap-4 rounded-lg border border-white/8 bg-black/25 px-4 py-2">
              <LeituraMini icone={<Thermometer size={12} />} valor={`${sol.tempAvg.toFixed(0)}°C`} rotulo="Temp." />
              <LeituraMini icone={<Wind size={12} />} valor={`${sol.windAvg.toFixed(1)}`} rotulo="m/s" />
              <LeituraMini icone={<Radio size={12} />} valor={`${sol.pressureAvg.toFixed(0)}`} rotulo="Pa" />
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-emerald-400">
                NASA
              </span>
            </div>
          )}
        </header>

        {/* CHECK-IN — o elemento mais importante */}
        <Checkin />

        {/* Consumíveis */}
        <section>
          <div className="mb-2.5 flex items-end justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Consumíveis</h2>
            <span className="text-[10px] text-gelo/30">projeção com {MISSAO.tripulacao} tripulantes</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONSUMIVEIS.map((c) => {
              const e = estadoConsumivel(c)
              const cor = CORES_ESTADO[e === 'critico' ? 'critico' : e === 'atencao' ? 'atencao' : 'ok']
              return (
                <div key={c.id} className="card-glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gelo/50">
                      {ICONES[c.id]}
                      <span className="text-[11px] font-medium text-gelo/70">{c.nome}</span>
                    </div>
                    <span className={`h-1.5 w-1.5 rounded-full ${cor.barra}`} />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="font-mono text-xl font-medium tnum">{c.atual}</span>
                    <span className="text-[10px] text-gelo/35">
                      / {c.capacidade} {c.unidade}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
                    <div className={`h-full ${cor.barra}`} style={{ width: `${percentual(c)}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px]">
                    <span className="text-gelo/35">{percentual(c)}%</span>
                    <span className={`font-mono tnum ${cor.texto}`}>{diasRestantes(c)} sóis</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Riscos ambientais */}
        <section>
          <div className="mb-2.5 flex items-end justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Fatores de sobrevivência</h2>
            <Link
              to="/condicoes"
              className="flex items-center gap-1 text-[10.5px] text-gelo/35 transition-colors hover:text-marte"
            >
              detalhes <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {RISCOS.slice(0, 4).map((r) => {
              const e = avaliar(r)
              const cor = CORES_ESTADO[e]
              return (
                <div key={r.id} className={`card-glass border p-3.5 ${cor.borda}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gelo/70">{r.nome}</span>
                    <span className={`text-[9px] uppercase tracking-wider ${cor.texto}`}>
                      {cor.rotulo}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="font-mono text-lg tnum">{r.atual}</span>
                    <span className="text-[10px] text-gelo/35">{r.unidade}</span>
                  </div>
                  <div className="mt-0.5 text-[9.5px] text-gelo/30">limite {r.limite} {r.unidade}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Rotas e alvos */}
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="card-glass p-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold tracking-tight">Rotas disponíveis</h2>
              <Link
                to="/rotas"
                className="flex items-center gap-1 text-[10.5px] text-gelo/35 transition-colors hover:text-marte"
              >
                comparar <ArrowRight size={11} />
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {ROTAS.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2.5"
                >
                  <RouteIcon size={14} className="shrink-0 text-gelo/30" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] text-gelo/85">{r.nome}</div>
                    <div className="text-[10px] text-gelo/35">
                      {r.distanciaKm} km · {r.duracao} · inclinação {r.inclinacaoMax}°
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[12px] tnum text-gelo/70">{r.o2Necessario}%</div>
                    <div className="text-[9px] text-gelo/30">O₂</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-glass p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold tracking-tight">Tripulação</h2>
              <span className="text-[10px] text-gelo/30">{TRIPULACAO.length}</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {TRIPULACAO.map((t) => (
                <li key={t.nome} className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      t.status === 'nominal' ? 'bg-emerald-400' : 'bg-alerta'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] text-gelo/80">{t.nome}</div>
                    <div className="truncate text-[9.5px] text-gelo/35">{t.funcao}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Alvos */}
        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Alvos científicos</h2>
            <Link
              to="/mapa"
              className="flex items-center gap-1 text-[10.5px] text-gelo/35 transition-colors hover:text-marte"
            >
              ver no mapa <ArrowRight size={11} />
            </Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {ALVOS.map((a) => (
              <div key={a.id} className="rounded-lg border border-white/6 bg-black/20 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9.5px] text-gelo/30">{a.id}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider ${
                      a.prioridade === 'alta' ? 'text-marte' : 'text-alerta'
                    }`}
                  >
                    {a.prioridade}
                  </span>
                </div>
                <div className="mt-1 truncate text-[11px] text-gelo/80">{a.nome}</div>
                <div className="text-[9.5px] text-gelo/30">{a.distanciaKm} km · {a.tipo}</div>
              </div>
            ))}
          </div>
        </section>

        <p className="pb-2 text-center text-[9.5px] leading-relaxed text-gelo/25">
          Consumíveis, radiação e janelas de comunicação são valores simulados. Limites e
          explicações científicas vêm de publicações da NASA. Protótipo demonstrativo, sem
          validação operacional.
        </p>
      </div>
    </div>
  )
}

function LeituraMini({
  icone,
  valor,
  rotulo,
}: {
  icone: React.ReactNode
  valor: string
  rotulo: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gelo/30">{icone}</span>
      <span className="font-mono text-[11px] tnum text-gelo/75">{valor}</span>
      <span className="text-[9px] text-gelo/30">{rotulo}</span>
    </div>
  )
}

