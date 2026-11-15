import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { CORES_CRITICIDADE, PROTOCOLOS } from '../lib/protocolos'
import { t } from '../lib/i18n'

export function Protocolos() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">{t("Referência operacional")}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t("Protocolos de sobrevivência")}</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/65">
          {t("Procedimentos para as situações que ameaçam diretamente a tripulação e o habitat. Cada protocolo descreve como identificar, avaliar e responder à emergência.")}
        </p>
      </header>

      <div className="flex items-start gap-2 rounded-lg border border-alerta/25 bg-alerta/5 p-3">
        <AlertTriangle size={13} className="mt-0.5 shrink-0 text-alerta" />
        <p className="text-[11.5px] leading-relaxed text-alerta/85">
          {t("Os procedimentos abaixo são ilustrativos, criados para demonstrar a experiência do protótipo. Não constituem documentação operacional validada e não devem orientar atividades reais.")}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {PROTOCOLOS.map((p) => (
          <Link
            key={p.id}
            to={`/protocolos/${p.id}`}
            className="card-glass card-glass-hover group p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[11px] text-gelo/70">{p.id}</span>
              <span
                className={`shrink-0 rounded border px-2 py-0.5 text-[11.5px] uppercase tracking-wider ${
                  CORES_CRITICIDADE[p.criticidade]
                }`}
              >
                {t("criticidade")} {p.criticidade}
              </span>
            </div>

            <h2 className="mt-2 text-[14px] font-semibold leading-snug tracking-tight">
              {p.titulo}
            </h2>

            <p className="mt-1 text-[11.5px] text-gelo/55">
              {p.categoria} · {p.sistema}
            </p>

            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-gelo/65">
              {p.identificacao[0]}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
              <span className="text-[11px] uppercase tracking-wider text-gelo/65">
                RIDGE · {p.ridge}
              </span>
              <ArrowRight
                size={12}
                className="text-gelo/65 transition-transform group-hover:translate-x-0.5 group-hover:text-critico"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
