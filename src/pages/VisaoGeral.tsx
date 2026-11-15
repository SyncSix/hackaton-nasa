import { Link } from 'react-router-dom'
import { ArrowRight, Radio, Thermometer, Wind, Gauge } from 'lucide-react'
import { ConsumivelCard } from '../components/ConsumivelCard'
import { ALVOS, CONSUMIVEIS, MISSAO, ROTAS, TRIPULACAO } from '../lib/mission'
import { useMarsWeather } from '../lib/useNasa'

export function VisaoGeral() {
  const { data: clima, erro } = useMarsWeather()
  const ultimoSol = clima?.[clima.length - 1]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Cabeçalho da missão */}
      <section>
        <div className="label">Briefing · Missão {MISSAO.nome}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Visão geral da missão
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/50">
          Síntese do plano de deslocamento: rota, distância, duração, alvos científicos e zonas de
          risco. Consulte antes de qualquer atividade extraveicular.
        </p>
      </section>

      {/* KPIs da missão */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi rotulo="Local" valor={MISSAO.local} detalhe="Elysium Planitia" />
        <Kpi rotulo="Tripulação" valor={`${MISSAO.tripulacao}`} detalhe="tripulantes ativos" />
        <Kpi rotulo="Alvos científicos" valor={`${ALVOS.length}`} detalhe="2 prioritários" />
        <Kpi rotulo="Rotas avaliadas" valor={`${ROTAS.length}`} detalhe="comparação disponível" />
      </section>

      {/* Consumíveis */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Consumíveis do habitat</h2>
            <p className="text-[11px] text-gelo/40">
              Projeção com {MISSAO.tripulacao} tripulantes · valores simulados
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONSUMIVEIS.map((c) => (
            <ConsumivelCard key={c.id} item={c} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Clima real da InSight */}
        <section className="card-glass p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold tracking-tight">Clima em Marte</h2>
              <p className="text-[11px] text-gelo/40">
                Dados reais · InSight · Elysium Planitia
              </p>
            </div>
            <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              NASA API
            </span>
          </div>

          {erro && (
            <p className="mt-4 text-[12px] text-marte">Não foi possível carregar o clima: {erro}</p>
          )}

          {!erro && !ultimoSol && (
            <p className="mt-4 text-[12px] text-gelo/40">Carregando telemetria…</p>
          )}

          {ultimoSol && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Leitura
                  icone={<Thermometer size={13} />}
                  rotulo="Temperatura"
                  valor={`${ultimoSol.tempAvg.toFixed(1)}°C`}
                  detalhe={`${ultimoSol.tempMin.toFixed(0)}° / ${ultimoSol.tempMax.toFixed(0)}°`}
                />
                <Leitura
                  icone={<Wind size={13} />}
                  rotulo="Vento"
                  valor={`${ultimoSol.windAvg.toFixed(1)} m/s`}
                  detalhe={`máx ${ultimoSol.windMax.toFixed(1)} · ${ultimoSol.windDir}`}
                />
                <Leitura
                  icone={<Gauge size={13} />}
                  rotulo="Pressão"
                  valor={`${ultimoSol.pressureAvg.toFixed(0)} Pa`}
                  detalhe="média do sol"
                />
                <Leitura
                  icone={<Radio size={13} />}
                  rotulo="Estação"
                  valor={ultimoSol.season}
                  detalhe={`Sol ${ultimoSol.sol}`}
                />
              </div>
              <p className="mt-3 text-[10px] text-gelo/30">
                Última leitura: {new Date(ultimoSol.lastUtc).toLocaleString('pt-BR')} · a missão
                InSight encerrou operações; os dados são o arquivo final disponível.
              </p>
            </>
          )}
        </section>

        {/* Tripulação */}
        <section className="card-glass p-4">
          <h2 className="text-[13px] font-semibold tracking-tight">Tripulação</h2>
          <ul className="mt-3 space-y-2.5">
            {TRIPULACAO.map((t) => (
              <li key={t.nome} className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    t.status === 'nominal' ? 'bg-emerald-400' : 'bg-alerta'
                  }`}
                />
                <div className="min-w-0">
                  <div className="truncate text-[12px] text-gelo/85">{t.nome}</div>
                  <div className="truncate text-[10px] text-gelo/40">{t.funcao}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Próximos passos */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Passo
          numero="01"
          titulo="Confira as condições"
          texto="Clima, radiação e janelas de comunicação antes de sair."
          to="/condicoes"
        />
        <Passo
          numero="02"
          titulo="Compare as rotas"
          texto="Máximo científico contra segurança e economia de O₂."
          to="/rotas"
        />
        <Passo
          numero="03"
          titulo="Abra o mapa"
          texto="Camadas de terreno, alvos e zonas de risco."
          to="/mapa"
        />
      </section>
    </div>
  )
}

function Kpi({ rotulo, valor, detalhe }: { rotulo: string; valor: string; detalhe: string }) {
  return (
    <div className="card-glass p-3.5">
      <div className="label">{rotulo}</div>
      <div className="mt-1 truncate text-[15px] font-medium tracking-tight">{valor}</div>
      <div className="text-[10px] text-gelo/35">{detalhe}</div>
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

function Passo({
  numero,
  titulo,
  texto,
  to,
}: {
  numero: string
  titulo: string
  texto: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="card-glass card-glass-hover group p-4 transition-colors hover:border-marte/40 hover:bg-titanio"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-marte">{numero}</span>
        <ArrowRight
          size={13}
          className="text-gelo/25 transition-transform group-hover:translate-x-0.5 group-hover:text-marte"
        />
      </div>
      <div className="mt-2 text-[12px] font-medium">{titulo}</div>
      <div className="mt-0.5 text-[11px] leading-relaxed text-gelo/40">{texto}</div>
    </Link>
  )
}
