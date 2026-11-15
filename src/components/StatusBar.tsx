import { MISSAO } from '../lib/mission'

export function StatusBar() {
  return (
    <div className="border-t border-white/6 bg-black/25">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-6 py-2 text-[11px]">
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marte opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-marte" />
          </span>
          <span className="font-mono tnum text-gelo/80">SOL {MISSAO.sol}</span>
        </span>

        <span className="font-mono tnum text-gelo/45">LMST {MISSAO.lmst}</span>

        <span className="text-gelo/20">·</span>

        <span className="text-gelo/45">
          Sem relay orbital · <span className="text-alerta/90">{MISSAO.proximoRelay}</span>
        </span>

        <span className="ml-auto flex items-center gap-2 text-gelo/35">
          <span className="h-1 w-1 rounded-full bg-alerta" />
          Relay local {MISSAO.relayLocal} · Simulação
        </span>
      </div>
    </div>
  )
}
