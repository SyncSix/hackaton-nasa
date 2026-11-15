import { avaliarFrio, CADEIA_FRIO, margemTermica } from '../lib/cadeiaFrio'
import { CORES } from '../lib/ridge'
import { EstadoIcone } from './EstadoIcone'

export function PainelFrio() {
  return (
    <div className="space-y-4">
      <section className="card-glass p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">Cadeia de frio</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-gelo/60">
          Temperatura de armazenamento é diferente de temperatura ambiente. Medicamentos e amostras
          degradam com ciclos térmicos, e a degradação não tem sinal visível: o medicamento parece
          normal e não funciona.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {CADEIA_FRIO.map((i) => {
          const e = avaliarFrio(i)
          const cor = CORES[e]
          const margem = margemTermica(i)
          return (
            <div key={i.id} className={`card-glass card-estado card-estado-${e} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[12px] font-medium text-gelo/90">{i.nome}</div>
                  <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">
                    {i.categoria}
                  </div>
                </div>
                <EstadoIcone estado={e} tamanho={11} />
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">Atual</div>
                  <div className={`font-mono text-[14px] tnum ${cor.texto}`}>
                    {i.temperatura} °C
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">Faixa</div>
                  <div className="font-mono text-[12px] tnum text-gelo/70">
                    {i.faixaMin} a {i.faixaMax}
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">
                    Excursões
                  </div>
                  <div className={`font-mono text-[14px] tnum ${cor.texto}`}>
                    {i.excursões}/{i.limiteExcursões}
                  </div>
                </div>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full ${cor.texto.replace('text-', 'bg-')}`}
                  style={{ width: `${(i.excursões / i.limiteExcursões) * 100}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-gelo/65">{i.nota}</p>
              <p className={`mt-1.5 text-[11.5px] ${cor.texto}`}>
                {margem === 0
                  ? 'Limite de excursões atingido — descartar.'
                  : `${margem} excursão(ões) restante(s) antes do descarte.`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
