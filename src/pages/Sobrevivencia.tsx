import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Info } from 'lucide-react'
import { CORES, RIDGE, resumoRidge } from '../lib/ridge'
import { PROTOCOLOS } from '../lib/protocolos'
import { EstadoIcone } from '../components/EstadoIcone'

export function Sobrevivencia() {
  const resumo = resumoRidge()

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Avaliação de risco · Modelo RIDGE</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sobrevivência</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/65">
          A NASA organiza os perigos da exploração humana em cinco categorias. Elas cobrem o risco
          ambiental, o biológico, o psicológico e o operacional — não apenas o clima.
        </p>
      </header>

      {/* Resumo */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Resumo rotulo="Nominal" n={resumo.nominal} cor="text-emerald-400" />
        <Resumo rotulo="Atenção" n={resumo.atencao} cor="text-alerta" />
        <Resumo rotulo="Crítico" n={resumo.critico} cor="text-critico" />
      </div>

      {/* Categorias */}
      <div className="space-y-3">
        {RIDGE.map((r) => {
          const cor = CORES[r.estado]
          return (
            <section key={r.id} className={`card-glass border p-5 ${cor.borda}`}>
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-mono text-lg font-semibold ${cor.bg} ${cor.texto}`}
                >
                  {r.letra}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <h2 className="text-[15px] font-semibold tracking-tight">{r.nome}</h2>
                    <span className="text-[11.5px] uppercase tracking-wider text-gelo/70">
                      {r.nomeEn}
                    </span>
                    <span
                      className={`ml-auto flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 text-[11.5px] uppercase tracking-wider ${cor.bg} ${cor.texto} ${cor.borda}`}
                    >
                      <EstadoIcone estado={r.estado} tamanho={10} />
                      {cor.rotulo}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-gelo/70">
                    {r.descricao}
                  </p>

                  <div className="mt-2.5 flex items-start gap-1.5 rounded border border-white/6 bg-black/20 p-2.5">
                    <Info size={11} className="mt-0.5 shrink-0 text-gelo/65" />
                    <p className="text-[11px] leading-relaxed text-gelo/65">{r.risco}</p>
                  </div>

                  {/* Indicadores */}
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {r.indicadores.map((i) => {
                      const ci = CORES[i.estado]
                      return (
                        <div
                          key={i.nome}
                          className="rounded border border-white/6 bg-black/20 p-2.5"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-[11px] leading-tight text-gelo/60">{i.nome}</span>
                            <span
                              className={`shrink-0 text-[11px] uppercase tracking-wider ${ci.texto}`}
                            >
                              {ci.rotulo}
                            </span>
                          </div>
                          <div className="mt-1 font-mono text-[13px] tnum text-gelo/90">
                            {i.valor}
                          </div>
                          <div className="text-[11.5px] text-gelo/65">limite {i.limite}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Resposta */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/6 pt-2.5">
                    <span className="text-[11.5px] text-gelo/60">
                      <span className="text-gelo/65">Resposta:</span> {r.resposta}
                    </span>
                    {r.protocolo && (
                      <Link
                        to={`/protocolos/${r.protocolo}`}
                        className="ml-auto flex shrink-0 items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] text-gelo/55 transition-colors hover:border-critico/40 hover:text-critico"
                      >
                        protocolo {r.protocolo} <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-gelo/65">
                    <BookOpen size={9} />
                    {r.fonte.instituicao} · {r.fonte.documento}
                  </p>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <p className="pb-1 text-center text-[11px] leading-relaxed text-gelo/65">
        Estados e valores são ilustrativos e não representam avaliação científica real da missão.
        Limites e categorias seguem o Human Research Program da NASA.
      </p>
    </div>
  )
}

function Resumo({ rotulo, n, cor }: { rotulo: string; n: number; cor: string }) {
  return (
    <div className="card-glass flex items-center gap-3 p-3.5">
      <span className={`font-mono text-2xl font-semibold tnum ${cor}`}>{n}</span>
      <div>
        <div className="text-[11px] font-medium text-gelo/70">{rotulo}</div>
        <div className="text-[11px] text-gelo/70">de 5 categorias</div>
      </div>
    </div>
  )
}

export { PROTOCOLOS }
