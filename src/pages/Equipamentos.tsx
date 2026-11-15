import { Radio } from 'lucide-react'
import { EQUIPAMENTOS } from '../lib/equipamentos'
import { RIDGE, CORES } from '../lib/ridge'
import { t } from '../lib/i18n'

/** Agrupa os equipamentos por plataforma para leitura mais clara. */
const ORDEM_PLATAFORMA = [
  t("Perseverance"),
  t("MSL Curiosity"),
  t("MEDA · Perseverance"),
  t("SHERLOC · Perseverance"),
  "Habitat",
  t("Traje EVA"),
  t("Tripulante"),
  "Orbital",
  "Terra",
]

const lista = Object.values(EQUIPAMENTOS)

export function Equipamentos() {
  const grupos = ORDEM_PLATAFORMA.map((p) => ({
    plataforma: p,
    itens: lista.filter((e) => e.plataforma === p),
  })).filter((g) => g.itens.length > 0)

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">{t("Rastreabilidade de dados")}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {t("Equipamentos e instrumentos")}
        </h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/60">
          {t("Cada indicador do sistema é produzido por um equipamento real. Esta é a cadeia completa: grandeza medida, instrumento, plataforma e o que ele retorna.")}
        </p>
      </header>

      <div className="space-y-4">
        {grupos.map((g) => (
          <section key={g.plataforma} className="card-glass overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
              <Radio size={12} className="text-marte" />
              <h2 className="text-[12.5px] font-semibold tracking-tight">{g.plataforma}</h2>
              <span className="ml-auto font-mono text-[11.5px] text-gelo/65">
                {g.itens.length}
              </span>
            </div>

            <div className="grid gap-0 divide-y divide-white/5 md:grid-cols-2 md:divide-y-0">
              {g.itens.map((e) => {
                const ridge = RIDGE.find((r) => r.letra === e.ridge)
                const cor = ridge ? CORES[ridge.estado] : CORES.nominal
                return (
                  <div
                    key={e.id}
                    className="border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/[0.02] md:border-b-0 md:border-r md:last:border-r-0 md:[&:nth-child(2n)]:border-r-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-mono text-[12px] font-medium text-gelo/95">
                            {e.nome}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wider ${cor.texto}`}>
                            {"RIDGE"} {e.ridge}
                          </span>
                        </div>
                        {e.completo && e.completo !== e.nome && (
                          <div className="mt-0.5 text-[11.5px] leading-tight text-gelo/65">
                            {e.completo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-[11px] leading-relaxed text-gelo/70">
                        <span className="text-gelo/65">{t("Mede:")} </span>
                        {e.mede}
                      </p>
                      <p className="font-mono text-[11.5px] text-gelo/55">{e.unidade}</p>
                    </div>

                    {e.nota && (
                      <p className="mt-1.5 border-t border-white/6 pt-1.5 text-[11.5px] leading-relaxed text-gelo/65">
                        {e.nota}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

    </div>
  )
}
