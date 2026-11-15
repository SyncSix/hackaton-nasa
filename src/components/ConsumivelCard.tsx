import { diasRestantes, estadoConsumivel, percentual, type Consumivel } from '../lib/mission'

const CORES = {
  nominal: { barra: 'bg-emerald-400', texto: 'text-emerald-400', rotulo: 'Nominal' },
  atencao: { barra: 'bg-alerta', texto: 'text-alerta', rotulo: 'Atenção' },
  critico: { barra: 'bg-critico', texto: 'text-critico', rotulo: 'Crítico' },
}

export function ConsumivelCard({ item }: { item: Consumivel }) {
  const pct = percentual(item)
  const estado = estadoConsumivel(item)
  const cor = CORES[estado]
  const dias = diasRestantes(item)

  return (
    <div className="card-glass p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="label">{item.nome}</div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="metric">{item.atual}</span>
            <span className="text-[11px] text-gelo/60">
              / {item.capacidade} {item.unidade}
            </span>
          </div>
        </div>
        <span className={`text-[11px] font-medium uppercase tracking-wider ${cor.texto}`}>
          {cor.rotulo}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full ${cor.barra} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <span className="text-gelo/60">{pct}% restante</span>
        <span className="font-mono tnum text-gelo/60">
          {dias} {dias === 1 ? 'sol' : 'sóis'}
        </span>
      </div>
    </div>
  )
}
