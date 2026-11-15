import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Droplets,
  ShieldAlert,
  Thermometer,
  Utensils,
  Wind,
  Zap,
} from 'lucide-react'
import {
  CONSUMIVEIS,
  MISSAO,
  TRIPULACAO,
  diasRestantes,
  estadoConsumivel,
  percentual,
} from '../lib/mission'
import { CORES, RIDGE, resumoRidge } from '../lib/ridge'
import { PROTOCOLOS } from '../lib/protocolos'
import { useMarsWeather } from '../lib/useNasa'
import { paParaKpa } from '../lib/formato'

const ICONES: Record<string, React.ReactNode> = {
  o2: <Wind size={14} />,
  agua: <Droplets size={14} />,
  energia: <Zap size={14} />,
  alimento: <Utensils size={14} />,
}

export function CentroMissao() {
  const { data: clima } = useMarsWeather()
  const sol = clima?.[clima.length - 1]
  const resumo = resumoRidge()

  // Prioridade da missão: o fator mais grave em aberto.
  const criticos = RIDGE.filter((r) => r.estado === 'critico')
  const prioridade = criticos[0]
  const protocoloPrioridade = prioridade
    ? PROTOCOLOS.find((p) => p.id === prioridade.protocolo)
    : undefined

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-6 py-5">
      {/* CABEÇALHO */}
      <header className="card-glass flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="label-micro">{MISSAO.nome} · Mission Control</div>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight">
            {MISSAO.local}
          </h1>
          <p className="mt-1 text-[12px] text-gelo/45">
            Sol {MISSAO.sol} · {MISSAO.tripulacao} tripulantes · Habitat principal
          </p>
        </div>

        <div className="flex items-center gap-5">
          {sol && (
            <div className="hidden items-center gap-4 rounded-lg border border-white/8 bg-black/25 px-4 py-2 sm:flex">
              <Mini icone={<Thermometer size={12} />} valor={`${sol.tempAvg.toFixed(0)}°C`} rotulo="Temp." />
              <Mini icone={<Wind size={12} />} valor={`${sol.windAvg.toFixed(1)}`} rotulo="m/s" />
              <Mini icone={<Zap size={12} />} valor={`${paParaKpa(sol.pressureAvg)}`} rotulo="kPa" />
            </div>
          )}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-gelo/30">Alertas</div>
            <div className="font-mono text-lg font-semibold tnum text-marte">
              {resumo.critico}
            </div>
          </div>
        </div>
      </header>

      {/* PRIORIDADE DA MISSÃO */}
      {prioridade && (
        <section className="card-glass border border-marte/40 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="label-micro">Prioridade da missão</span>
                <span className="rounded border border-marte/40 bg-marte/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-marte">
                  Crítico
                </span>
              </div>
              <h2 className="mt-1.5 text-[17px] font-semibold tracking-tight">
                {prioridade.nome} fora do limite operacional
              </h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-gelo/50">
                {prioridade.risco}
              </p>
            </div>
            <ShieldAlert size={22} className="shrink-0 text-marte" />
          </div>

          {protocoloPrioridade && (
            <Link
              to={`/protocolos/${protocoloPrioridade.id}`}
              className="mt-3.5 flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-3.5 py-2.5 transition-colors hover:border-marte/40 hover:bg-black/40"
            >
              <AlertTriangle size={15} className="shrink-0 text-marte" />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-gelo/90">
                  Ver protocolo de emergência
                </div>
                <div className="text-[10.5px] text-gelo/40">
                  {protocoloPrioridade.id} · {protocoloPrioridade.titulo}
                </div>
              </div>
              <ArrowRight size={14} className="shrink-0 text-gelo/30" />
            </Link>
          )}
        </section>
      )}

      {/* RECURSOS DO HABITAT */}
      <section>
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-[13px] font-semibold tracking-tight">Recursos do habitat</h2>
          <span className="text-[10px] text-gelo/30">valores simulados</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CONSUMIVEIS.map((c) => {
            const e = estadoConsumivel(c)
            const cor = CORES[e === 'critico' ? 'critico' : e === 'atencao' ? 'atencao' : 'nominal']
            return (
              <div key={c.id} className="card-glass p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gelo/45">
                    {ICONES[c.id]}
                    <span className="text-[10.5px] font-medium text-gelo/65">{c.nome}</span>
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full ${cor.texto.replace('text-', 'bg-')}`} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-[19px] font-medium tnum">{c.atual}</span>
                  <span className="text-[10px] text-gelo/30">{c.unidade}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={`h-full ${cor.texto.replace('text-', 'bg-')}`}
                    style={{ width: `${percentual(c)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px]">
                  <span className="text-gelo/35">{percentual(c)}% disponível</span>
                  <span className={`font-mono tnum ${cor.texto}`}>{diasRestantes(c)} sóis</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* RIDGE */}
      <section>
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">
              Avaliação de risco de sobrevivência
            </h2>
            <p className="text-[10.5px] text-gelo/35">
              Modelo RIDGE · NASA Human Research Program
            </p>
          </div>
          <Link
            to="/sobrevivencia"
            className="flex items-center gap-1 text-[10.5px] text-gelo/35 transition-colors hover:text-marte"
          >
            detalhes <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-glass divide-y divide-white/5">
          {RIDGE.map((r) => {
            const cor = CORES[r.estado]
            return (
              <Link
                key={r.id}
                to="/sobrevivencia"
                className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[11px] font-semibold ${cor.bg} ${cor.texto}`}
                >
                  {r.letra}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-gelo/85">{r.nome}</div>
                  <div className="truncate text-[10px] text-gelo/30">{r.nomeEn}</div>
                </div>
                <span className={`shrink-0 text-[10px] uppercase tracking-wider ${cor.texto}`}>
                  {cor.rotulo}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* TRIPULAÇÃO + PROTOCOLOS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Tripulação</h2>
            <span className="text-[10px] text-gelo/30">{TRIPULACAO.length} ativos</span>
          </div>
          <ul className="mt-2.5 space-y-2">
            {TRIPULACAO.map((t) => (
              <li key={t.nome} className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    t.status === 'nominal' ? 'bg-emerald-400' : 'bg-alerta'
                  }`}
                />
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/80">
                  {t.nome}
                </span>
                <span className="shrink-0 text-[10px] text-gelo/35">{t.funcao}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Protocolos de emergência</h2>
            <Link
              to="/protocolos"
              className="flex items-center gap-1 text-[10.5px] text-gelo/35 transition-colors hover:text-marte"
            >
              todos <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {PROTOCOLOS.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link
                  to={`/protocolos/${p.id}`}
                  className="flex items-center gap-2.5 rounded px-1.5 py-1.5 transition-colors hover:bg-white/5"
                >
                  <span className="font-mono text-[9.5px] text-gelo/30">{p.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/80">
                    {p.titulo}
                  </span>
                  <span
                    className={`shrink-0 text-[9px] uppercase tracking-wider ${
                      p.criticidade === 'alta' ? 'text-marte' : 'text-alerta'
                    }`}
                  >
                    {p.criticidade}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="pb-1 text-center text-[9.5px] leading-relaxed text-gelo/25">
        Recursos, indicadores e estados são simulados para demonstração. Limites e referências
        científicas vêm de publicações da NASA. Protótipo sem validação operacional.
      </p>
    </div>
  )
}

function Mini({
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
