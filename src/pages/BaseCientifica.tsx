import { BookOpen, ExternalLink, Radio, Thermometer, Wind, Gauge, Sun } from 'lucide-react'
import { useMarsWeather, useMedaJezero, usePdsInstruments } from '../lib/useNasa'
import { paParaKpa } from '../lib/formato'

type Natureza = 'histórico' | 'simulado' | 'medido'

type Evidencia = {
  indicador: string
  valor: string
  unidade: string
  fonte: string
  instrumento: string
  missao: string
  data: string
  natureza: Natureza
  link: string
}

const EVIDENCIAS: Evidencia[] = [
  {
    indicador: 'Temperatura e pressão',
    valor: '−62,4 / 743,6',
    unidade: '°C / Pa',
    fonte: 'NASA InSight Mars Weather Service (Elysium)',
    instrumento: 'TWINS',
    missao: 'InSight',
    data: '2020-10-20',
    natureza: 'histórico',
    link: 'https://api.nasa.gov/insight_weather/',
  },
  {
    indicador: 'Radiação de superfície',
    valor: '0,67',
    unidade: 'mSv/sol',
    fonte: 'NASA/JPL Curiosity RAD',
    instrumento: 'RAD',
    missao: 'MSL Curiosity',
    data: '2012–2013',
    natureza: 'histórico',
    link: 'https://science.nasa.gov/mission/msl-curiosity/science-instruments/',
  },
  {
    indicador: 'Percloratos no solo',
    valor: '0,5–1',
    unidade: '% em massa',
    fonte: 'NASA Phoenix Mars Lander',
    instrumento: 'WCL',
    missao: 'Phoenix',
    data: '2008',
    natureza: 'histórico',
    link: 'https://science.nasa.gov/mission/phoenix/',
  },
  {
    indicador: 'Temperatura local (Jezero)',
    valor: 'EDL',
    unidade: '°C',
    fonte: 'NASA MEDA — Mars 2020 Weather Feed (ao vivo)',
    instrumento: 'MEDA',
    missao: 'Perseverance',
    data: 'leitura mais recente publicada',
    natureza: 'medido',
    link: 'https://mars.nasa.gov/mars2020/weather/',
  },
  {
    indicador: 'Pressão local (Jezero)',
    valor: 'EDL',
    unidade: 'Pa',
    fonte: 'NASA MEDA — Mars 2020 Weather Feed (ao vivo)',
    instrumento: 'MEDA',
    missao: 'Perseverance',
    data: 'leitura mais recente publicada',
    natureza: 'medido',
    link: 'https://mars.nasa.gov/mars2020/weather/',
  },
  {
    indicador: 'Opacidade de poeira (τ)',
    valor: 'variável',
    unidade: 'τ',
    fonte: 'NASA MEDA (Perseverance) · REMS (Curiosity)',
    instrumento: 'MEDA / REMS',
    missao: 'Mars 2020 / MSL',
    data: '2021–presente',
    natureza: 'medido',
    link: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
  },
  {
    indicador: 'Gravidade de superfície',
    valor: '0,38',
    unidade: 'g',
    fonte: 'NASA Mars Facts',
    instrumento: '—',
    missao: '—',
    data: 'referência',
    natureza: 'histórico',
    link: 'https://science.nasa.gov/mars/facts/',
  },
  {
    indicador: 'Atraso de comunicação',
    valor: '4–24',
    unidade: 'min',
    fonte: 'NASA Mars Relay Network',
    instrumento: '—',
    missao: 'Rede de relay',
    data: 'contínuo',
    natureza: 'histórico',
    link: 'https://science.nasa.gov/mars/',
  },
]

const CORES_NATUREZA: Record<Natureza, string> = {
  histórico: 'border-gelo/20 bg-gelo/8 text-gelo/60',
  medido: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
  simulado: 'border-alerta/30 bg-alerta/10 text-alerta',
}

export function BaseCientifica() {
  const { data: clima } = useMarsWeather()
  const { data: meda } = useMedaJezero()
  const { data: instrumentos, erro: erroPds } = usePdsInstruments()
  const sol = clima?.[clima.length - 1]
  // Último sol do MEDA com temperatura válida (o feed publica dias incompletos).
  const medaSol = [...(meda ?? [])]
    .reverse()
    .find((s) => s.tempMin !== null && s.tempMax !== null)

  // Preenche as evidências com a leitura real do momento, quando disponível.
  const evidencias = EVIDENCIAS.map((e) => {
    if (!medaSol) return e
    if (e.indicador === 'Temperatura local (Jezero)') {
      return {
        ...e,
        valor: `${medaSol.tempMin?.toFixed(1)} / ${medaSol.tempMax?.toFixed(1)}`,
        data: medaSol.dataTerrestre,
      }
    }
    if (e.indicador === 'Pressão local (Jezero)') {
      return {
        ...e,
        valor: medaSol.pressaoPa !== null ? String(medaSol.pressaoPa.toFixed(1)) : 'EDL',
        data: medaSol.dataTerrestre,
      }
    }
    return e
  })

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Scientific Intelligence</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Base científica</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/65">
          De onde vem cada número do sistema. Toda informação exibe fonte, missão, instrumento,
          data e se o dado é histórico, medido ou simulado.
        </p>
      </header>

      {/* Leitura ao vivo — MEDA, no próprio local da missão */}
      {medaSol && (
        <section className="card-glass p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-[13px] font-semibold tracking-tight">
                Clima local — MEDA / Perseverance
              </h2>
              <p className="text-[11.5px] text-gelo/55">
                Cratera Jezero · mesma região do habitat · leitura mais recente publicada
              </p>
            </div>
            <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11.5px] uppercase tracking-wider text-emerald-400">
              Medido
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Leitura
              icone={<Thermometer size={12} />}
              rotulo="Mínima"
              valor={medaSol.tempMin !== null ? `${medaSol.tempMin.toFixed(1)} °C` : '—'}
            />
            <Leitura
              icone={<Thermometer size={12} />}
              rotulo="Máxima"
              valor={medaSol.tempMax !== null ? `${medaSol.tempMax.toFixed(1)} °C` : '—'}
            />
            <Leitura
              icone={<Gauge size={12} />}
              rotulo="Pressão"
              valor={
                medaSol.pressaoPa !== null ? `${paParaKpa(medaSol.pressaoPa)} kPa` : '—'
              }
            />
            <Leitura icone={<Sun size={12} />} rotulo="Estação" valor={medaSol.estacao} />
          </div>
          <p className="mt-2 text-[11.5px] text-gelo/65">
            Sol {medaSol.sol} · {medaSol.dataTerrestre} · nascer {medaSol.nascerSol} · pôr{' '}
            {medaSol.porDoSol} (LMST) · Ls {medaSol.ls.toFixed(1)}°
          </p>
        </section>
      )}

      {/* Série histórica — InSight, outro local */}
      {sol && (
        <section className="card-glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold tracking-tight">
                Série histórica — InSight
              </h2>
              <p className="text-[11.5px] text-gelo/55">
                Elysium Planitia · arquivo final da missão · não é o clima local de Jezero
              </p>
            </div>
            <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11.5px] uppercase tracking-wider text-emerald-400">
              Medido
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Leitura icone={<Thermometer size={12} />} rotulo="Temperatura" valor={`${sol.tempAvg.toFixed(1)} °C`} />
            <Leitura icone={<Wind size={12} />} rotulo="Vento" valor={`${sol.windAvg.toFixed(1)} m/s`} />
            <Leitura icone={<Gauge size={12} />} rotulo="Pressão" valor={`${paParaKpa(sol.pressureAvg)} kPa`} />
            <Leitura icone={<Sun size={12} />} rotulo="Estação" valor={sol.season} />
          </div>
          <p className="mt-2 text-[11.5px] text-gelo/65">
            Sol {sol.sol} · última leitura {new Date(sol.lastUtc).toLocaleString('pt-BR')}
          </p>
        </section>
      )}

      {/* Tabela de evidências */}
      <section className="card-glass overflow-hidden">
        <div className="border-b border-white/8 px-4 py-3">
          <h2 className="text-[13px] font-semibold tracking-tight">Evidências do sistema</h2>
          <p className="text-[11.5px] text-gelo/55">
            Origem de cada indicador exibido nas telas operacionais
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-white/8 text-[11.5px] uppercase tracking-wider text-gelo/70">
                <th className="px-4 py-2 font-medium">Indicador</th>
                <th className="px-3 py-2 font-medium">Valor</th>
                <th className="px-3 py-2 font-medium">Fonte</th>
                <th className="px-3 py-2 font-medium">Instrumento</th>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium">Natureza</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {evidencias.map((e) => (
                <tr key={e.indicador} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-[11.5px] text-gelo/85">{e.indicador}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] tnum text-gelo/65">
                    {e.valor} <span className="text-gelo/70">{e.unidade}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[11.5px] text-gelo/70">{e.fonte}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-gelo/60">{e.instrumento}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-gelo/60">{e.data}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[11px] uppercase tracking-wider ${CORES_NATUREZA[e.natureza]}`}
                    >
                      {e.natureza}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gelo/65 transition-colors hover:text-critico"
                      aria-label={`Abrir fonte de ${e.indicador}`}
                    >
                      <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Instrumentos PDS */}
      <section className="card-glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">
              Instrumentos científicos no registro PDS
            </h2>
            <p className="text-[11.5px] text-gelo/55">
              Consulta ao vivo · Planetary Data System · NASA
            </p>
          </div>
          <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11.5px] uppercase tracking-wider text-emerald-400">
            PDS
          </span>
        </div>

        {erroPds && (
          <p className="mt-3 text-[11px] text-alerta">
            PDS indisponível ({erroPds}). Rode <code>npm run dev</code> para usar o proxy.
          </p>
        )}

        {instrumentos && instrumentos.length > 0 && (
          <ul className="mt-3 divide-y divide-white/5">
            {instrumentos.slice(0, 8).map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-2">
                <Radio size={11} className="shrink-0 text-gelo/65" />
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/75">
                  {i.title}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-gelo/65 sm:block">
                  {i.id.length > 52 ? `${i.id.slice(0, 52)}…` : i.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Metodologia */}
      <section className="card-glass p-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={13} className="text-gelo/70" />
          <h2 className="text-[13px] font-semibold tracking-tight">Como interpretar</h2>
        </div>
        <dl className="grid gap-2 sm:grid-cols-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-emerald-400">Medido</dt>
            <dd className="mt-0.5 text-[11px] leading-relaxed text-gelo/65">
              Retornado por API oficial da NASA nesta sessão.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-gelo/55">Histórico</dt>
            <dd className="mt-0.5 text-[11px] leading-relaxed text-gelo/65">
              Medição real de uma missão encerrada. Não descreve Marte hoje.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-alerta">Simulado</dt>
            <dd className="mt-0.5 text-[11px] leading-relaxed text-gelo/65">
              Valor de demonstração do protótipo, sem origem em telemetria real.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

function Leitura({
  icone,
  rotulo,
  valor,
}: {
  icone: React.ReactNode
  rotulo: string
  valor: string
}) {
  return (
    <div className="rounded border border-white/6 bg-black/20 p-2.5">
      <div className="flex items-center gap-1.5 text-gelo/55">
        {icone}
        <span className="text-[11.5px] uppercase tracking-wider">{rotulo}</span>
      </div>
      <div className="mt-0.5 font-mono text-[13px] tnum text-gelo/85">{valor}</div>
    </div>
  )
}
