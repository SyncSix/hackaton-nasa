import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, Timer } from 'lucide-react'
import type { Protocolo } from '../lib/protocolos'
import { t } from '../lib/i18n'

/**
 * Protocolo em modo execução.
 *
 * Ler um procedimento sob estresse é diferente de executá-lo. Este componente
 * transforma o protocolo em uma sequência marcável, com progresso e tempo
 * decorrido — o que um astronauta realmente precisa durante a emergência.
 */
export function ProtocoloExecutavel({ protocolo }: { protocolo: Protocolo }) {
  const [feitos, setFeitos] = useState<Set<number>>(new Set())
  const [iniciado, setIniciado] = useState<number | null>(null)
  const [agora, setAgora] = useState(Date.now())

  const total = protocolo.procedimento.length
  const concluidos = feitos.size
  const pct = Math.round((concluidos / total) * 100)
  const completo = concluidos === total

  // Atualiza o cronômetro a cada segundo enquanto houver execução em curso.
  useMemo(() => {
    if (iniciado === null || completo) return
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [iniciado, completo])

  function alternar(i: number) {
    if (iniciado === null) setIniciado(Date.now())
    setFeitos((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(i)) proximo.delete(i)
      else proximo.add(i)
      return proximo
    })
  }

  function reiniciar() {
    setFeitos(new Set())
    setIniciado(null)
  }

  const decorrido =
    iniciado === null ? 0 : Math.floor((agora - iniciado) / 1000)
  const mm = String(Math.floor(decorrido / 60)).padStart(2, '0')
  const ss = String(decorrido % 60).padStart(2, '0')

  return (
    <section className="card-glass overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-marte">
            <CheckCircle2 size={13} />
          </span>
          <h2 className="text-[13px] font-semibold tracking-tight">{t("Execução do procedimento")}</h2>
          <span className="text-[11px] text-gelo/65">
            {concluidos}/{total} {t("passos")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {iniciado !== null && (
            <span className="flex items-center gap-1 rounded border border-white/12 bg-black/25 px-2 py-0.5 font-mono text-[11px] tnum text-gelo/80">
              <Timer size={10} /> {mm}:{ss}
            </span>
          )}
          {concluidos > 0 && (
            <button
              onClick={reiniciar}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gelo/65 transition-colors hover:text-marte"
            >
              <RotateCcw size={10} /> {t("reiniciar")}
            </button>
          )}
        </div>
      </div>

      <div className="h-1 overflow-hidden bg-white/8">
        <div
          className={`h-full transition-all ${completo ? 'bg-nominal' : 'bg-marte'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="divide-y divide-white/5">
        {protocolo.procedimento.map((passo, i) => {
          const feito = feitos.has(i)
          return (
            <li key={passo}>
              <button
                onClick={() => alternar(i)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
                aria-pressed={feito}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[10px] transition-colors ${
                    feito
                      ? "border-nominal bg-nominal text-grafite"
                      : "border-white/30 text-gelo/70"
                  }`}
                >
                  {feito ? <CheckCircle2 size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`text-[12.5px] leading-relaxed ${
                    feito ? "text-gelo/55 line-through" : 'text-gelo/90'
                  }`}
                >
                  {passo}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {completo && (
        <div className="border-t border-nominal/30 bg-nominal/8 px-4 py-3">
          <div className="text-[12px] font-semibold text-nominal">
            {t("Procedimento concluído em")} {mm}:{ss}
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gelo/70">
            {t("Confirme os critérios de resolução abaixo antes de considerar a situação controlada.")}
          </p>
        </div>
      )}
    </section>
  )
}
