import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, Clock, Radio, XCircle, AlertTriangle } from 'lucide-react'
import { derivarAlarmes, resumoAlarmes, type Alarme } from '../lib/alarmes'
import { t, tt } from '../lib/i18n'

/**
 * Central de alarmes: a lista única do que está errado, quanto tempo resta
 * e o que fazer. Substitui a necessidade de visitar 11 telas em emergência.
 */
export function CentralAlarmes() {
  const [aberto, setAberto] = useState(true)
  const alarmes = derivarAlarmes()
  const resumo = resumoAlarmes(alarmes)

  if (alarmes.length === 0) {
    return (
      <section className="card-glass card-estado card-estado-nominal flex items-center gap-3 p-4">
        <span className="text-nominal">
          <XCircle size={16} />
        </span>
        <div>
          <div className="text-[13px] font-semibold text-nominal">{t("Nenhum alarme ativo")}</div>
          <p className="text-[11.5px] text-gelo/65">
            {t("Todos os sistemas dentro dos limites. Continue o monitoramento de rotina.")}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="card-glass overflow-hidden">
      <button
        onClick={() => setAberto((a) => !a)}
        className="flex w-full items-center gap-3 border-b border-white/8 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
        aria-expanded={aberto}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${
            resumo.criticos > 0 ? "bg-critico/15 text-critico" : "bg-alerta/15 text-alerta"
          }`}
        >
          {resumo.criticos > 0 ? <XCircle size={15} /> : <AlertTriangle size={15} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h2 className="text-[14px] font-semibold tracking-tight">{t("Central de alarmes")}</h2>
            <span className={resumo.criticos > 0 ? "text-[12px] text-critico" : "text-[12px] text-alerta"}>
              {resumo.criticos > 0
                ? tt('{n} crítico', { n: resumo.criticos })
                : tt('{n} em atenção', { n: resumo.atencao })}
            </span>
          </div>
          <p className="text-[11.5px] text-gelo/65">
            {resumo.total} {resumo.total === 1 ? t("item requer") : t("itens requerem")} {t("ação")}
          </p>
        </div>

        <span className="shrink-0 text-gelo/60">
          {aberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {aberto && (
        <ul className="divide-y divide-white/5">
          {alarmes.map((a) => (
            <ItemAlarme key={a.id} alarme={a} />
          ))}
        </ul>
      )}
    </section>
  )
}

function ItemAlarme({ alarme: a }: { alarme: Alarme }) {
  const critico = a.severidade === 'critico'
  const cor = critico ? 'text-critico' : 'text-alerta'
  const bg = critico ? 'bg-critico/8' : 'bg-alerta/6'

  return (
    <li className={`px-4 py-3 ${bg}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${cor}`}>
              {a.origem}
            </span>
            {a.equipamento && (
              <span className="flex items-center gap-1 text-[10.5px] text-gelo/60">
                <Radio size={9} /> {a.equipamento}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[13px] font-medium text-gelo/95">{a.titulo}</div>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-gelo/70">{a.detalhe}</p>
        </div>

        {a.tempoRestante && (
          <div className="shrink-0 rounded border border-white/12 bg-black/30 px-2 py-1 text-right">
            <div className="flex items-center justify-end gap-1 text-[9.5px] uppercase tracking-wider text-gelo/60">
              <Clock size={9} /> {t("restam")}
            </div>
            <div className={`font-mono text-[12px] tnum ${cor}`}>{a.tempoRestante}</div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className={`flex-1 text-[11.5px] font-medium leading-relaxed ${cor}`}>
          → {a.acao}
        </p>
        <div className="flex shrink-0 gap-1.5">
          {a.protocolo && (
            <Link
              to={`/protocolos/${a.protocolo}`}
              className="rounded border border-white/15 px-2 py-0.5 text-[10.5px] text-gelo/70 transition-colors hover:border-marte/40 hover:text-marte"
            >
              {a.protocolo}
            </Link>
          )}
          {a.tela && (
            <Link
              to={a.tela}
              className="flex items-center gap-1 rounded border border-white/15 px-2 py-0.5 text-[10.5px] text-gelo/70 transition-colors hover:border-marte/40 hover:text-marte"
            >
              {t("detalhes")} <ArrowRight size={9} />
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}
