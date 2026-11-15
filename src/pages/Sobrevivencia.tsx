import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Info, Radio, ShieldCheck } from 'lucide-react'
import { CORES, RIDGE, resumoRidge } from '../lib/ridge'
import { EstadoIcone } from '../components/EstadoIcone'
import { RidgeIcone } from '../components/RidgeIcone'
import { CardEstado } from '../components/CardEstado'
import { PRIORIDADES } from '../lib/prioridades'
import { equipamento } from '../lib/equipamentos'

export function Sobrevivencia() {
  const resumo = resumoRidge()

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-micro">Avaliação de risco · Modelo RIDGE</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sobrevivência</h1>
          <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/60">
            A NASA organiza os perigos da exploração humana em cinco categorias. Elas cobrem o risco
            ambiental, o biológico, o psicológico e o operacional — não apenas o clima.
          </p>
        </div>

        <div className="flex gap-2">
          <Resumo rotulo="Nominal" n={resumo.nominal} estado="nominal" />
          <Resumo rotulo="Atenção" n={resumo.atencao} estado="atencao" />
          <Resumo rotulo="Crítico" n={resumo.critico} estado="critico" />
        </div>
      </header>

      {/* Categorias RIDGE — cards largos, com borda por estado */}
      <div className="space-y-4">
        {RIDGE.map((r) => {
          const cor = CORES[r.estado]
          const prioridade = PRIORIDADES.find((p) => p.ridge === r.letra)

          return (
            <CardEstado key={r.id} estado={r.estado} className="p-5">
              {/* Cabeçalho da categoria */}
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/30 ${cor.texto}`}
                  title={`${r.letra} — ${r.nomeEn}`}
                >
                  <RidgeIcone icone={r.icone} tamanho={24} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-[16px] font-semibold tracking-tight">{r.nome}</h2>
                    <span className="text-[11px] uppercase tracking-wider text-gelo/45">
                      {r.nomeEn}
                    </span>
                    <span
                      className={`ml-auto flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 text-[10.5px] uppercase tracking-wider ${cor.bg} ${cor.texto} ${cor.borda}`}
                    >
                      <EstadoIcone estado={r.estado} tamanho={10} />
                      {cor.rotulo}
                    </span>
                  </div>

                  <p className="mt-2 text-[12px] leading-relaxed text-gelo/65">{r.descricao}</p>
                </div>
              </div>

              {/* Risco + tempo crítico */}
              <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
                <div className="flex items-start gap-2 rounded-lg border border-white/8 bg-black/25 p-3 lg:col-span-2">
                  <Info size={13} className="mt-0.5 shrink-0 text-gelo/40" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gelo/45">
                      Por que ameaça
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-gelo/70">{r.risco}</p>
                  </div>
                </div>

                {prioridade && (
                  <div className="rounded-lg border border-white/8 bg-black/25 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-gelo/45">
                      Tempo até dano
                    </div>
                    <div className={`mt-0.5 font-mono text-[13px] font-medium ${cor.texto}`}>
                      {prioridade.janela}
                    </div>
                    <div className="mt-0.5 text-[10.5px] leading-relaxed text-gelo/55">
                      {prioridade.tempoCritico}
                    </div>
                  </div>
                )}
              </div>

              {/* Indicadores — ocupam a largura toda */}
              <div className="mt-3">
                <div className="label-micro mb-1.5">Indicadores monitorados</div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {r.indicadores.map((i) => {
                    const ci = CORES[i.estado]
                    return (
                      <div
                        key={i.nome}
                        className={`rounded-lg border bg-black/25 p-2.5 ${ci.borda}`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10.5px] leading-tight text-gelo/55">
                            {i.nome}
                          </span>
                          <EstadoIcone estado={i.estado} tamanho={10} className="shrink-0" />
                        </div>
                        <div className={`mt-1 font-mono text-[14px] tnum ${ci.texto}`}>
                          {i.valor}
                        </div>
                        <div className="text-[10px] text-gelo/40">limite {i.limite}</div>
                        {(() => {
                          const eq = equipamento(i.equipamento)
                          if (!eq) return null
                          return (
                            <div
                              className="mt-1.5 flex items-center gap-1 border-t border-white/8 pt-1.5"
                              title={`${eq.completo ?? eq.nome} — ${eq.mede} (${eq.plataforma})`}
                            >
                              <Radio size={9} className="shrink-0 text-marte/70" />
                              <span className="truncate text-[9.5px] text-gelo/50">
                                {eq.nome}
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Resposta + fonte */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/8 pt-3">
                <ShieldCheck size={13} className="shrink-0 text-gelo/40" />
                <p className="min-w-0 flex-1 text-[11.5px] leading-relaxed text-gelo/65">
                  <span className="font-medium text-gelo/85">Resposta: </span>
                  {r.resposta}
                </p>
                {r.protocolo && (
                  <Link
                    to={`/protocolos/${r.protocolo}`}
                    className="flex shrink-0 items-center gap-1 rounded border border-white/12 px-2.5 py-1 text-[10.5px] text-gelo/65 transition-colors hover:border-marte/40 hover:text-marte"
                  >
                    protocolo {r.protocolo} <ArrowRight size={10} />
                  </Link>
                )}
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-gelo/40">
                <BookOpen size={10} />
                {r.fonte.instituicao} · {r.fonte.documento}
              </p>
            </CardEstado>
          )
        })}
      </div>

      <p className="pb-1 text-center text-[10.5px] leading-relaxed text-gelo/40">
        Estados e valores são ilustrativos e não representam avaliação científica real da missão.
        Limites e categorias seguem o Human Research Program da NASA.
      </p>
    </div>
  )
}

function Resumo({
  rotulo,
  n,
  estado,
}: {
  rotulo: string
  n: number
  estado: 'nominal' | 'atencao' | 'critico'
}) {
  const cor = CORES[estado]
  return (
    <div className={`card-glass card-estado card-estado-${estado} px-3.5 py-2`}>
      <div className={`font-mono text-xl font-semibold tnum ${cor.texto}`}>{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-gelo/50">{rotulo}</div>
    </div>
  )
}
