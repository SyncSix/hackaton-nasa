import { Link } from 'react-router-dom'
import { ArrowRight, Moon, Radio, Users } from 'lucide-react'
import {
  CORES_APTIDAO,
  disponiveis,
  foraDoHabitat,
  ROTULO_LOCAL,
  TRIPULACAO_STATUS,
} from '../lib/tripulacao'

/**
 * Quem está a bordo, onde, e em que condição.
 * Responde à pergunta de emergência: quem pode agir agora?
 */
export function PainelTripulacao() {
  const aptos = disponiveis().length
  const fora = foraDoHabitat()

  return (
    <section className="card-glass p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gelo/70" />
          <h2 className="text-[13px] font-semibold tracking-tight">Tripulação</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-gelo/65">
            <span className="font-mono tnum text-gelo/90">{aptos}</span> disponíveis
          </span>
          {fora > 0 && (
            <span className="text-alerta">
              <span className="font-mono tnum">{fora}</span> fora do habitat
            </span>
          )}
        </div>
      </div>

      <ul className="mt-2.5 space-y-2">
        {TRIPULACAO_STATUS.map((t) => {
          const apt = CORES_APTIDAO[t.aptidao]
          const sonoBaixo = t.sonoH < 7
          return (
            <li key={t.id} className="rounded border border-white/8 bg-black/20 p-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[12px] font-medium text-gelo/95">{t.nome}</span>
                    <span className={`text-[10px] uppercase tracking-wider ${apt.texto}`}>
                      {apt.rotulo}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-gelo/65">
                    {t.funcao} · {t.papelEmergencia}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {t.plssPct !== undefined && (
                    <span className="flex items-center gap-1 rounded border border-alerta/35 bg-alerta/10 px-1.5 py-0.5 font-mono text-[10px] tnum text-alerta">
                      <Radio size={8} /> {t.plssPct}%
                    </span>
                  )}
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                      t.local === 'eva'
                        ? 'border-alerta/35 bg-alerta/10 text-alerta'
                        : 'border-white/12 bg-white/5 text-gelo/65'
                    }`}
                  >
                    {ROTULO_LOCAL[t.local]}
                  </span>
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/6 pt-1.5 text-[10.5px]">
                <span className={sonoBaixo ? 'text-alerta' : 'text-gelo/65'}>
                  <Moon size={9} className="mr-1 inline" />
                  {t.sonoH.toFixed(1)} h de sono
                </span>
                <span className="text-gelo/65">
                  <span className="font-mono tnum">{t.doseMsv}</span> mSv acumulados
                </span>
              </div>

              {t.observacao && (
                <p className="mt-1 text-[10.5px] leading-relaxed text-alerta">{t.observacao}</p>
              )}
            </li>
          )
        })}
      </ul>

      <Link
        to="/decisoes"
        className="mt-2.5 flex items-center justify-center gap-1 rounded border border-white/12 py-1.5 text-[11px] text-gelo/70 transition-colors hover:border-marte/40 hover:text-marte"
      >
        Registro de decisões <ArrowRight size={10} />
      </Link>
    </section>
  )
}
