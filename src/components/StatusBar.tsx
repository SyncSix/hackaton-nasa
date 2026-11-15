import { useEffect, useState } from 'react'
import { MISSAO } from '../lib/mission'

/** Converte "HH:MM:SS" em segundos. */
function paraSegundos(hhmmss: string): number {
  const [h, m, s] = hhmmss.split(':').map(Number)
  return h * 3600 + m * 60 + s
}

/** Formata segundos como HH:MM:SS. */
function formatar(total: number): string {
  const h = Math.floor(total / 3600) % 24
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

/**
 * Faixa superior: Sol, hora local marciana (LMST) e próximo relay.
 *
 * O LMST avança em tempo real. Um segundo marciano dura ~1,0275 s terrestres,
 * mas para uma animação de interface usamos 1:1, o que mantém a leitura natural.
 */
export function StatusBar() {
  const [segundos, setSegundos] = useState(() => paraSegundos(MISSAO.lmstInicial))
  const [relaySeg, setRelaySeg] = useState(75 * 60)

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos((s) => (s + 1) % 86400)
      setRelaySeg((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const relayMin = Math.floor(relaySeg / 60)
  const relayResto = relaySeg % 60

  return (
    <div className="border-t border-white/6 bg-black/25">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-6 py-2 text-[11.5px]">
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nominal opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-nominal" />
          </span>
          <span className="font-mono font-medium tnum text-gelo/90">SOL {MISSAO.sol}</span>
        </span>

        <span className="font-mono tnum text-gelo/65">
          LMST <span className="tabular-nums">{formatar(segundos)}</span>
        </span>

        <span className="text-gelo/65">·</span>

        <span className="text-gelo/60">
          Sem relay orbital ·{' '}
          <span className="font-mono tnum text-alerta">
            Odyssey em {relayMin} min {String(relayResto).padStart(2, '0')} s
          </span>
        </span>

        <span className="ml-auto flex items-center gap-2 text-gelo/65">
          <span className="h-1 w-1 rounded-full bg-alerta" />
          Relay local {MISSAO.relayLocal} · Simulação
        </span>
      </div>
    </div>
  )
}
