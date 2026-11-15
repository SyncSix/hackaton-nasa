import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import { CENARIOS, TOTAL_CENARIOS, type Opcao } from '../lib/simulador'

type Fase = 'contexto' | 'resposta' | 'resultado'

export function Simulador() {
  const [indice, setIndice] = useState(0)
  const [fase, setFase] = useState<Fase>('contexto')
  const [escolha, setEscolha] = useState<Opcao | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [historico, setHistorico] = useState<Array<{ id: string; acertou: boolean }>>([])
  const [finalizado, setFinalizado] = useState(false)

  const cenario = CENARIOS[indice]
  const ultimo = indice === TOTAL_CENARIOS - 1
  const encerrado = finalizado

  function responder(opcao: Opcao) {
    setEscolha(opcao)
    setFase('resultado')
    if (opcao.correta) setAcertos((a) => a + 1)
    setHistorico((h) => [...h, { id: cenario.id, acertou: opcao.correta }])
  }

  function avancar() {
    if (ultimo) return
    setIndice((i) => i + 1)
    setFase('contexto')
    setEscolha(null)
  }

  function reiniciar() {
    setIndice(0)
    setFase('contexto')
    setEscolha(null)
    setAcertos(0)
    setHistorico([])
    setFinalizado(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label-micro">Mission Simulation</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Simulador de emergências
          </h1>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-gelo/65">
            Cenários de risco para praticar decisões sob pressão. Cada escolha mostra a consequência
            e o raciocínio por trás dela.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-gelo/70">Acertos</div>
          <div className="font-mono text-lg font-semibold tnum text-gelo/85">
            {acertos}
            <span className="text-[11px] text-gelo/70"> / {historico.length || 0}</span>
          </div>
        </div>
      </header>

      {/* Progresso */}
      <div className="flex gap-1">
        {CENARIOS.map((c, i) => {
          const feito = historico.find((h) => h.id === c.id)
          return (
            <div
              key={c.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                feito
                  ? feito.acertou
                    ? 'bg-emerald-400'
                    : 'bg-critico'
                  : i === indice
                    ? 'bg-gelo/40'
                    : 'bg-white/10'
              }`}
            />
          )
        })}
      </div>

      {/* FIM */}
      {encerrado ? (
        <section className="card-glass p-6 text-center">
          <div className="text-[11px] uppercase tracking-wider text-gelo/70">Simulação concluída</div>
          <div className="mt-3 font-mono text-5xl font-bold text-critico">{acertos}</div>
          <p className="text-[12px] text-gelo/65">de {TOTAL_CENARIOS} decisões recomendadas</p>

          <p className="mx-auto mt-4 max-w-lg text-[12px] leading-relaxed text-gelo/70">
            {acertos === TOTAL_CENARIOS
              ? 'Todas as decisões seguiram os princípios de segurança de missão: pessoas antes de equipamento, redundância antes de improviso, autonomia diante da distância.'
              : 'Revise os cenários em que a decisão contrariou a prioridade de segurança. O padrão comum é proteger o equipamento ou o objetivo antes da tripulação.'}
          </p>

          <button
            onClick={reiniciar}
            className="mx-auto mt-5 flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-5 py-2.5 text-[12.5px] font-medium transition-colors hover:border-critico/40 hover:text-critico"
          >
            <RotateCcw size={14} /> Refazer simulação
          </button>
        </section>
      ) : (
        <section className="card-glass overflow-hidden">
          {/* Cabeçalho do cenário */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] text-critico">SIM-{cenario.numero}</span>
              <span className="text-[11px] uppercase tracking-wider text-gelo/70">
                RIDGE · {cenario.ridge}
              </span>
            </div>
            <span className="text-[11px] text-gelo/70">
              {indice + 1} de {TOTAL_CENARIOS}
            </span>
          </div>

          <div className="p-5">
            <h2 className="text-[17px] font-semibold leading-snug tracking-tight">
              {cenario.titulo}
            </h2>

            <p className="mt-2.5 rounded border border-white/6 bg-black/20 p-3 font-mono text-[11px] leading-relaxed text-gelo/70">
              {cenario.contexto}
            </p>

            <p className="mt-4 text-[13px] font-medium leading-relaxed text-gelo/85">
              {cenario.situacao}
            </p>

            {/* Opções */}
            <div className="mt-3.5 space-y-2">
              {cenario.opcoes.map((o) => {
                const respondido = fase === 'resultado'
                const escolhida = escolha?.id === o.id
                const revelarCerta = respondido && o.correta

                let borda = 'border-white/8 bg-black/20 hover:border-white/20'
                if (revelarCerta) borda = 'border-emerald-400/45 bg-emerald-400/8'
                else if (respondido && escolhida) borda = 'border-critico/50 bg-marte/8'
                else if (respondido) borda = 'border-white/6 bg-black/10 opacity-55'

                return (
                  <button
                    key={o.id}
                    onClick={() => fase === 'contexto' && responder(o)}
                    disabled={respondido}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${borda} ${
                      fase === 'contexto' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] ${
                        revelarCerta
                          ? 'bg-emerald-400/20 text-emerald-400'
                          : respondido && escolhida
                            ? 'bg-critico/20 text-critico'
                            : 'bg-white/8 text-gelo/70'
                      }`}
                    >
                      {o.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] leading-relaxed text-gelo/85">{o.texto}</p>

                      {respondido && (escolhida || revelarCerta) && (
                        <div className="mt-2 space-y-1.5">
                          <p
                            className={`text-[11px] leading-relaxed ${
                              o.correta ? 'text-emerald-400/90' : 'text-critico/90'
                            }`}
                          >
                            {o.consequencia}
                          </p>
                          <p className="text-[11.5px] leading-relaxed text-gelo/60">
                            {o.justificativa}
                          </p>
                        </div>
                      )}
                    </div>
                    {revelarCerta && (
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                    )}
                    {respondido && escolhida && !o.correta && (
                      <XCircle size={14} className="mt-0.5 shrink-0 text-critico" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Rodapé do resultado */}
            {fase === 'resultado' && escolha && (
              <div className="mt-4 space-y-3 border-t border-white/8 pt-3.5">
                <div className="flex items-start gap-2">
                  <BookOpen size={12} className="mt-0.5 shrink-0 text-gelo/65" />
                  <p className="text-[11px] leading-relaxed text-gelo/70">
                    <span className="text-gelo/75">Lição:</span> {cenario.licao}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {cenario.protocolo && (
                    <Link
                      to={`/protocolos/${cenario.protocolo}`}
                      className="flex items-center gap-1 rounded border border-white/10 px-2.5 py-1.5 text-[11.5px] text-gelo/55 transition-colors hover:border-critico/40 hover:text-critico"
                    >
                      protocolo {cenario.protocolo} <ArrowRight size={10} />
                    </Link>
                  )}
                  {!ultimo && (
                    <button
                      onClick={avancar}
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-marte px-4 py-2 text-[12px] font-semibold text-grafite transition-opacity hover:opacity-90"
                    >
                      Próximo cenário <ArrowRight size={13} />
                    </button>
                  )}
                  {ultimo && (
                    <button
                      onClick={() => setFinalizado(true)}
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-marte px-4 py-2 text-[12px] font-semibold text-grafite transition-opacity hover:opacity-90"
                    >
                      Ver resultado <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-alerta/25 bg-alerta/5 p-3">
        <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
        <p className="text-[11px] leading-relaxed text-alerta/85">
          Cenários ilustrativos. As respostas refletem princípios gerais de segurança de missão
          (pessoas antes de equipamento, redundância antes de improviso), não procedimentos
          operacionais validados.
        </p>
      </div>
    </div>
  )
}
