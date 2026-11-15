import { AlertTriangle, CheckCircle2, Radio, Sun, Wind, Gauge, Thermometer } from 'lucide-react'
import { useMarsWeather, usePdsInstruments } from '../lib/useNasa'

/** Indicadores operacionais. Radiação e comunicação são simulados. */
const AMBIENTE = [
  {
    id: 'radiacao',
    nome: 'Radiação acumulada',
    valor: '0,67',
    unidade: 'mSv/sol',
    limite: 'limite 1,0 mSv/sol',
    estado: 'atencao' as const,
    fonte: 'simulado',
  },
  {
    id: 'visibilidade',
    nome: 'Opacidade de poeira (τ)',
    valor: '0,84',
    unidade: 'τ',
    limite: 'limite operacional 1,5',
    estado: 'nominal' as const,
    fonte: 'simulado',
  },
  {
    id: 'comunicacao',
    nome: 'Janela de comunicação',
    valor: '1 h 15',
    unidade: 'até próximo relay',
    limite: 'Odyssey',
    estado: 'atencao' as const,
    fonte: 'simulado',
  },
]

const CORES = {
  nominal: 'text-emerald-400',
  atencao: 'text-alerta',
  critico: 'text-marte',
}

export function Condicoes() {
  const { data: clima, erro, carregando } = useMarsWeather()
  const { data: instrumentos, erro: erroPds } = usePdsInstruments()
  const sol = clima?.[clima.length - 1]

  const veredito = AMBIENTE.every((a) => a.estado !== ('critico' as string))

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section>
        <div className="label">Avaliação pré-EVA</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Condições atuais</h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/50">
          Clima, radiação, tempestades de poeira e disponibilidade de comunicação. Avalie antes de
          autorizar uma atividade extraveicular.
        </p>
      </section>

      {/* Veredito GO / NO-GO */}
      <section
        className={`card-glass flex items-center gap-3 p-4 ${
          veredito ? 'border-emerald-400/30' : 'border-marte/40'
        }`}
      >
        {veredito ? (
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
        ) : (
          <AlertTriangle size={20} className="shrink-0 text-marte" />
        )}
        <div>
          <div className="text-[13px] font-semibold tracking-tight">
            {veredito ? 'GO — condições dentro dos limites' : 'NO-GO — restrição ativa'}
          </div>
          <div className="text-[11px] text-gelo/45">
            {veredito
              ? 'Nenhum indicador em estado crítico. Mantenha monitoramento durante a EVA.'
              : 'Revise os indicadores em estado crítico antes de prosseguir.'}
          </div>
        </div>
        <span className="ml-auto rounded border border-alerta/30 bg-alerta/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-alerta">
          Simulado
        </span>
      </section>

      {/* Indicadores simulados */}
      <section className="grid gap-3 sm:grid-cols-3">
        {AMBIENTE.map((a) => (
          <div key={a.id} className="card-glass p-4">
            <div className="label">{a.nome}</div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="metric">{a.valor}</span>
              <span className="text-[11px] text-gelo/40">{a.unidade}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-gelo/35">{a.limite}</span>
              <span className={`text-[10px] uppercase tracking-wider ${CORES[a.estado]}`}>
                {a.estado}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Clima real */}
      <section className="card-glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Clima medido — InSight</h2>
            <p className="text-[11px] text-gelo/40">
              Dados reais da NASA · Elysium Planitia
            </p>
          </div>
          <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
            NASA API
          </span>
        </div>

        {carregando && <p className="mt-4 text-[12px] text-gelo/40">Carregando telemetria…</p>}
        {erro && <p className="mt-4 text-[12px] text-marte">Erro: {erro}</p>}

        {sol && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Leitura
              icone={<Thermometer size={13} />}
              rotulo="Temperatura média"
              valor={`${sol.tempAvg.toFixed(1)} °C`}
              detalhe={`${sol.tempMin.toFixed(0)}° / ${sol.tempMax.toFixed(0)}°`}
            />
            <Leitura
              icone={<Wind size={13} />}
              rotulo="Vento"
              valor={`${sol.windAvg.toFixed(1)} m/s`}
              detalhe={`máx ${sol.windMax.toFixed(1)} · ${sol.windDir}`}
            />
            <Leitura
              icone={<Gauge size={13} />}
              rotulo="Pressão"
              valor={`${sol.pressureAvg.toFixed(0)} Pa`}
              detalhe="média do sol"
            />
            <Leitura
              icone={<Sun size={13} />}
              rotulo="Estação"
              valor={sol.season}
              detalhe={`Sol ${sol.sol}`}
            />
          </div>
        )}
      </section>

      {/* Instrumentos do PDS */}
      <section className="card-glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Instrumentos de Marte</h2>
            <p className="text-[11px] text-gelo/40">Registro PDS · NASA</p>
          </div>
          <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
            PDS
          </span>
        </div>

        {erroPds && (
          <p className="mt-3 text-[11px] text-alerta">
            PDS indisponível ({erroPds}). Inicie o servidor com <code>npm run dev</code> para usar o
            proxy.
          </p>
        )}

        {instrumentos && instrumentos.length > 0 && (
          <ul className="mt-3 divide-y divide-white/5">
            {instrumentos.slice(0, 6).map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-2">
                <Radio size={12} className="shrink-0 text-gelo/25" />
                <span className="min-w-0 flex-1 truncate text-[12px] text-gelo/80">{i.title}</span>
                <span className="shrink-0 font-mono text-[10px] text-gelo/30">{i.type}</span>
              </li>
            ))}
          </ul>
        )}

        {instrumentos && instrumentos.length === 0 && (
          <p className="mt-3 text-[11px] text-gelo/35">Nenhum instrumento retornado.</p>
        )}
      </section>
    </div>
  )
}

function Leitura({
  icone,
  rotulo,
  valor,
  detalhe,
}: {
  icone: React.ReactNode
  rotulo: string
  valor: string
  detalhe: string
}) {
  return (
    <div className="rounded border border-white/6 bg-black/20 p-2.5">
      <div className="flex items-center gap-1.5 text-gelo/40">
        {icone}
        <span className="text-[10px] uppercase tracking-wider">{rotulo}</span>
      </div>
      <div className="mt-1 font-mono text-[15px] tnum">{valor}</div>
      <div className="text-[10px] text-gelo/35">{detalhe}</div>
    </div>
  )
}
