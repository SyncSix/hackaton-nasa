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
import { RidgeIcone } from '../components/RidgeIcone'
import { GuiaDecisao } from '../components/GuiaDecisao'
import { CardEstado } from '../components/CardEstado'
import { CORES_JANELA, PRIORIDADES } from '../lib/prioridades'
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
          <p className="mt-1 text-[12px] text-gelo/65">
            Sol {MISSAO.sol} · {MISSAO.tripulacao} tripulantes · Habitat principal
          </p>
        </div>

        <div className="flex items-center gap-5">
          {sol && (
            <div className="hidden items-center gap-4 rounded-lg border border-white/8 bg-black/25 px-4 py-2 sm:flex">
              <Mini icone={<Thermometer size={12} />} valor={`${sol.tempAvg.toFixed(0)}°C`} rotulo="Temp. ref." />
              <Mini icone={<Wind size={12} />} valor={`${sol.windAvg.toFixed(1)}`} rotulo="m/s" />
              <Mini icone={<Zap size={12} />} valor={`${paParaKpa(sol.pressureAvg)}`} rotulo="kPa" />
            </div>
          )}
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-gelo/70">Alertas</div>
            <div className="font-mono text-lg font-semibold tnum text-critico">
              {resumo.critico}
            </div>
          </div>
        </div>
      </header>

      {/* GUIA DE DECISÃO — o sistema conduz a próxima ação */}
      <GuiaDecisao />

      {/* PRIORIDADE DA MISSÃO */}
      {prioridade && (
        <section className="card-glass border border-critico/40 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="label-micro">Prioridade da missão</span>
                <span className="rounded border border-critico/40 bg-critico/10 px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider text-critico">
                  Crítico
                </span>
              </div>
              <h2 className="mt-1.5 text-[17px] font-semibold tracking-tight">
                {prioridade.nome} fora do limite operacional
              </h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-gelo/70">
                {prioridade.risco}
              </p>
            </div>
            <ShieldAlert size={22} className="shrink-0 text-critico" />
          </div>

          {protocoloPrioridade && (
            <Link
              to={`/protocolos/${protocoloPrioridade.id}`}
              className="mt-3.5 flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-3.5 py-2.5 transition-colors hover:border-critico/40 hover:bg-black/40"
            >
              <AlertTriangle size={15} className="shrink-0 text-critico" />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-gelo/90">
                  Ver protocolo de emergência
                </div>
                <div className="text-[11.5px] text-gelo/60">
                  {protocoloPrioridade.id} · {protocoloPrioridade.titulo}
                </div>
              </div>
              <ArrowRight size={14} className="shrink-0 text-gelo/70" />
            </Link>
          )}
        </section>
      )}

      {/* RECURSOS DO HABITAT */}
      <section>
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-[13px] font-semibold tracking-tight">Recursos do habitat</h2>
          <span className="text-[11px] text-gelo/70">valores simulados</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CONSUMIVEIS.map((c) => {
            const e = estadoConsumivel(c)
            const cor = CORES[e === 'critico' ? 'critico' : e === 'atencao' ? 'atencao' : 'nominal']
            return (
              <CardEstado key={c.id} estado={e === 'critico' ? 'critico' : e === 'atencao' ? 'atencao' : 'nominal'} className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gelo/65">
                    {ICONES[c.id]}
                    <span className="text-[11.5px] font-medium text-gelo/65">{c.nome}</span>
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full ${cor.texto.replace('text-', 'bg-')}`} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-[19px] font-medium tnum">{c.atual}</span>
                  <span className="text-[11px] text-gelo/70">{c.unidade}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={`h-full ${cor.texto.replace('text-', 'bg-')}`}
                    style={{ width: `${percentual(c)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px]">
                  <span className="text-gelo/55">{percentual(c)}% disponível</span>
                  <span className={`font-mono tnum ${cor.texto}`}>{diasRestantes(c)} sóis</span>
                </div>
              </CardEstado>
            )
          })}
        </div>
      </section>

      {/* PRIORIDADES POR LETALIDADE */}
      <section>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">
              Prioridades de sobrevivência
            </h2>
            <p className="text-[11px] text-gelo/55">
              Ordenadas por tempo até dano irreversível — o que mata em segundos vem primeiro
            </p>
          </div>
          <Link
            to="/sobrevivencia"
            className="flex items-center gap-1 text-[11px] text-gelo/55 transition-colors hover:text-marte"
          >
            modelo RIDGE <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-glass divide-y divide-white/5">
          {PRIORIDADES.map((p) => {
            const ridge = RIDGE.find((r) => r.letra === p.ridge)
            const cor = ridge ? CORES[ridge.estado] : CORES.nominal
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="w-4 shrink-0 font-mono text-[11px] text-gelo/45">
                  {p.ordem}
                </span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded bg-black/25 ${cor.texto}`}>
                  {ridge && <RidgeIcone icone={ridge.icone} tamanho={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-gelo/90">{p.nome}</div>
                  <div className="truncate text-[10.5px] text-gelo/50">{p.tempoCritico}</div>
                </div>
                <span
                  className={`shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${CORES_JANELA[p.janela]}`}
                >
                  {p.janela}
                </span>
                {p.protocolo && (
                  <Link
                    to={`/protocolos/${p.protocolo}`}
                    className="hidden shrink-0 text-gelo/40 transition-colors hover:text-marte sm:block"
                    aria-label={`Protocolo ${p.protocolo}`}
                  >
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* TRIPULAÇÃO + PROTOCOLOS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Tripulação</h2>
            <span className="text-[11px] text-gelo/70">{TRIPULACAO.length} ativos</span>
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
                <span className="shrink-0 text-[11px] text-gelo/55">{t.funcao}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">Protocolos de emergência</h2>
            <Link
              to="/protocolos"
              className="flex items-center gap-1 text-[11.5px] text-gelo/55 transition-colors hover:text-critico"
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
                  <span className="font-mono text-[11px] text-gelo/70">{p.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/80">
                    {p.titulo}
                  </span>
                  <span
                    className={`shrink-0 text-[11.5px] uppercase tracking-wider ${
                      p.criticidade === 'alta' ? 'text-critico' : 'text-alerta'
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

      <p className="pb-1 text-center text-[11px] leading-relaxed text-gelo/65">
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
      <span className="text-gelo/70">{icone}</span>
      <span className="font-mono text-[11px] tnum text-gelo/75">{valor}</span>
      <span className="text-[11.5px] text-gelo/70">{rotulo}</span>
    </div>
  )
}
