import { AlertTriangle, CheckCircle2, Info, Radio, Sun, Wind, Gauge, Thermometer } from 'lucide-react'
import { avaliar, CORES_ESTADO, RISCOS } from '../lib/riscos'
import { useMarsWeather, usePdsInstruments } from '../lib/useNasa'

export function Condicoes() {
  const { data: clima, erro, carregando } = useMarsWeather()
  const { data: instrumentos, erro: erroPds } = usePdsInstruments()
  const sol = clima?.[clima.length - 1]

  const avaliados = RISCOS.map((r) => ({ ...r, estado: avaliar(r) }))
  const criticos = avaliados.filter((r) => r.estado === 'critico')
  const atencao = avaliados.filter((r) => r.estado === 'atencao')
  const veredito = criticos.length > 0 ? 'critico' : atencao.length > 0 ? 'atencao' : 'ok'
  const cor = CORES_ESTADO[veredito]

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Avaliação pré-EVA</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Condições e riscos</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-gelo/45">
          Tudo que precisa estar alinhado para sobreviver na superfície. Cada fator mostra o valor
          atual, o limite e o que fazer se estiver fora.
        </p>
      </header>

      {/* Veredito */}
      <section className={`card-glass flex items-center gap-3 border p-4 ${cor.borda}`}>
        {veredito === 'ok' ? (
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
        ) : (
          <AlertTriangle size={20} className={`shrink-0 ${cor.texto}`} />
        )}
        <div>
          <div className="text-[13px] font-semibold tracking-tight">
            {veredito === 'ok'
              ? 'GO — todos os fatores dentro do limite'
              : veredito === 'atencao'
                ? `ATENÇÃO — ${atencao.length} fator(es) próximo(s) do limite`
                : `NO-GO — ${criticos.length} fator(es) fora do limite`}
          </div>
          <div className="text-[11px] text-gelo/45">
            {veredito === 'ok'
              ? 'Nenhuma restrição ativa. Mantenha o monitoramento durante a atividade.'
              : 'Revise os fatores destacados antes de autorizar a saída.'}
          </div>
        </div>
        <span className="ml-auto rounded border border-alerta/30 bg-alerta/10 px-2 py-0.5 text-[9.5px] uppercase tracking-wider text-alerta">
          Valores simulados
        </span>
      </section>

      {/* Riscos detalhados */}
      <section>
        <h2 className="mb-2.5 text-[13px] font-semibold tracking-tight">
          Fatores de sobrevivência
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {avaliados.map((r) => {
            const c = CORES_ESTADO[r.estado]
            return (
              <div key={r.id} className={`card-glass border p-4 ${c.borda}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[13px] font-medium text-gelo/90">{r.nome}</div>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className={`font-mono text-lg tnum ${c.texto}`}>{r.atual}</span>
                      <span className="text-[10px] text-gelo/35">{r.unidade}</span>
                      <span className="text-[10px] text-gelo/25">
                        · limite {r.limite} {r.unidade}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] uppercase tracking-wider ${c.texto}`}>
                    {c.rotulo}
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-gelo/45">{r.explicacao}</p>

                <div className="mt-2 flex items-start gap-1.5 rounded border border-white/6 bg-black/20 p-2">
                  <Info size={11} className="mt-0.5 shrink-0 text-gelo/25" />
                  <p className="text-[10.5px] leading-relaxed text-gelo/40">{r.perigo}</p>
                </div>

                {r.estado !== 'ok' && (
                  <p className={`mt-2 text-[11px] leading-relaxed ${c.texto}`}>→ {r.acao}</p>
                )}

                <p className="mt-2 text-[9px] text-gelo/25">{r.referencia}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Clima real */}
      <section className="card-glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Clima medido — InSight</h2>
            <p className="text-[11px] text-gelo/40">Dados reais da NASA · Elysium Planitia</p>
          </div>
          <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-emerald-400">
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

      {/* Instrumentos PDS */}
      <section className="card-glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Instrumentos de Marte</h2>
            <p className="text-[11px] text-gelo/40">Registro PDS · NASA</p>
          </div>
          <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-emerald-400">
            PDS
          </span>
        </div>

        {erroPds && (
          <p className="mt-3 text-[11px] text-alerta">
            PDS indisponível ({erroPds}). Inicie com <code>npm run dev</code> para usar o proxy.
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
