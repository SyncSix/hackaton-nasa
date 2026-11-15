import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Footprints,
  Package,
  Route as RouteIcon,
  RotateCcw,
  Siren,
  XCircle,
} from 'lucide-react'
import { ROTEIROS, TIPOS, type Veredito } from '../lib/guia'

const ICONES = {
  Siren,
  Footprints,
  Route: RouteIcon,
  Package,
} as const

const ESTILO = {
  go: {
    icone: CheckCircle2,
    cor: 'text-nominal',
    bg: 'bg-nominal/10',
    borda: 'border-nominal/40',
    rotulo: 'Seguir em frente',
  },
  atencao: {
    icone: AlertTriangle,
    cor: 'text-alerta',
    bg: 'bg-alerta/10',
    borda: 'border-alerta/40',
    rotulo: 'Prosseguir com cuidado',
  },
  'no-go': {
    icone: XCircle,
    cor: 'text-critico',
    bg: 'bg-critico/10',
    borda: 'border-critico/45',
    rotulo: 'Não prosseguir',
  },
} as const

/**
 * Guia de decisão: o astronauta escolhe o tipo de situação, responde
 * perguntas de triagem e recebe um veredito com a ordem de ações.
 */
export function GuiaDecisao() {
  const [tipo, setTipo] = useState<string | null>(null)
  const [no, setNo] = useState<string>('')
  const [historico, setHistorico] = useState<string[]>([])
  const [veredito, setVeredito] = useState<Veredito | null>(null)

  function escolherTipo(id: string) {
    const roteiro = ROTEIROS[id]
    setTipo(id)
    setNo(roteiro.inicio)
    setHistorico([])
    setVeredito(null)
  }

  function responder(texto: string, proximo?: string, v?: Veredito) {
    if (v) {
      setVeredito(v)
      return
    }
    if (proximo) {
      setHistorico((h) => [...h, texto])
      setNo(proximo)
    }
  }

  function voltar() {
    if (veredito) {
      setVeredito(null)
      return
    }
    if (historico.length === 0) {
      setTipo(null)
      return
    }
    // Retrocede um passo. O roteiro atual não guarda o caminho completo,
    // então reinicia o tipo quando há mais de um passo.
    setHistorico((h) => h.slice(0, -1))
    if (historico.length === 1 && tipo) setNo(ROTEIROS[tipo].inicio)
  }

  function reiniciar() {
    setTipo(null)
    setNo('')
    setHistorico([])
    setVeredito(null)
  }

  const roteiro = tipo ? ROTEIROS[tipo] : null
  const passo = roteiro ? roteiro.nos[no] : null
  const definicao = tipo ? TIPOS.find((t) => t.id === tipo) : null

  return (
    <section className="card-glass overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-marte">
            <ArrowRight size={13} />
          </span>
          <h2 className="text-[13px] font-semibold tracking-tight">Guia de decisão</h2>
          <span className="text-[11px] text-gelo/45">
            {tipo ? 'triagem em andamento' : 'o que você vai fazer agora?'}
          </span>
        </div>
        {tipo && (
          <button
            onClick={reiniciar}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gelo/55 transition-colors hover:text-marte"
          >
            <RotateCcw size={10} /> recomeçar
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Escolha do tipo */}
        {!tipo && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {TIPOS.map((t) => {
              const Icone = ICONES[t.icone]
              return (
                <button
                  key={t.id}
                  onClick={() => escolherTipo(t.id)}
                  className="card-glass card-glass-hover group p-3 text-left"
                >
                  <div className="flex items-center gap-1.5 text-marte">
                    <Icone size={15} />
                    <span className="text-[12px] font-medium text-gelo/90">{t.titulo}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gelo/55">{t.descricao}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Perguntas */}
        {tipo && passo && !veredito && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {definicao && (
                <span className="rounded border border-marte/30 bg-marte/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-marte">
                  {definicao.titulo}
                </span>
              )}
              {historico.map((h, i) => (
                <span key={i} className="text-[11px] text-gelo/45">
                  {h} <span className="text-gelo/25">›</span>
                </span>
              ))}
            </div>

            <h3 className="mt-2.5 text-[15px] font-medium leading-snug text-gelo/95">
              {passo.pergunta}
            </h3>
            <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/55">{passo.ajuda}</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {passo.opcoes.map((o) => (
                <button
                  key={o.texto}
                  onClick={() => responder(o.texto, o.proximo, o.veredito)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-left transition-colors hover:border-marte/40 hover:bg-black/40"
                >
                  <span className="text-[12px] text-gelo/85">{o.texto}</span>
                  <ArrowRight size={12} className="shrink-0 text-gelo/35" />
                </button>
              ))}
            </div>

            <button
              onClick={voltar}
              className="mt-3 flex items-center gap-1.5 text-[11px] text-gelo/45 transition-colors hover:text-gelo/80"
            >
              <ArrowLeft size={11} /> voltar
            </button>
          </div>
        )}

        {/* Veredito */}
        {veredito && (
          <div>
            <div
              className={`flex items-start gap-3 rounded-lg border p-3.5 ${ESTILO[veredito.nivel].borda} ${ESTILO[veredito.nivel].bg}`}
            >
              {(() => {
                const Ic = ESTILO[veredito.nivel].icone
                return (
                  <Ic
                    size={19}
                    className={`mt-0.5 shrink-0 ${ESTILO[veredito.nivel].cor}`}
                  />
                )
              })()}
              <div className="min-w-0">
                <div
                  className={`text-[10px] uppercase tracking-wider ${ESTILO[veredito.nivel].cor}`}
                >
                  {ESTILO[veredito.nivel].rotulo}
                </div>
                <h3 className="mt-0.5 text-[14.5px] font-semibold leading-snug text-gelo/95">
                  {veredito.titulo}
                </h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/65">
                  {veredito.explicacao}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="label-micro mb-1.5">Faça nesta ordem</div>
              <ol className="space-y-1.5">
                {veredito.acoes.map((a, i) => (
                  <li key={a} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/10 font-mono text-[10px] text-gelo/70">
                      {i + 1}
                    </span>
                    <span className="text-[12px] leading-relaxed text-gelo/85">{a}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-3 rounded border border-white/8 bg-black/20 p-2.5">
              <span className="text-[10.5px] font-medium text-gelo/70">Por quê: </span>
              <span className="text-[11px] leading-relaxed text-gelo/55">{veredito.razao}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={voltar}
                className="flex items-center gap-1.5 rounded border border-white/12 px-2.5 py-1.5 text-[11px] text-gelo/65 transition-colors hover:border-white/25"
              >
                <ArrowLeft size={11} /> voltar
              </button>
              {veredito.link && (
                <Link
                  to={veredito.link.para}
                  className="flex items-center gap-1.5 rounded-lg bg-marte px-3 py-1.5 text-[11.5px] font-semibold text-grafite transition-opacity hover:opacity-90"
                >
                  {veredito.link.rotulo} <ArrowRight size={12} />
                </Link>
              )}
              {veredito.protocolo && !veredito.link && (
                <Link
                  to={`/protocolos/${veredito.protocolo}`}
                  className="flex items-center gap-1.5 rounded border border-white/12 px-2.5 py-1.5 text-[11px] text-gelo/65 transition-colors hover:border-marte/40 hover:text-marte"
                >
                  protocolo {veredito.protocolo} <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
