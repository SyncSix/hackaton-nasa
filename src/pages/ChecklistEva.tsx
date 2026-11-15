import { AlertTriangle } from 'lucide-react'
import { ChecklistEvaBloco } from '../components/ChecklistEvaBloco'
import { t } from '../lib/i18n'

export function ChecklistEva() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-6 py-6">
      <header>
        <div className="label-micro">{t("Atividade extraveicular")}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t("Checklist de EVA")}</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-gelo/65">
          {t("Verificações antes, durante e depois da saída. Os itens críticos bloqueiam a autorização da atividade.")}
        </p>
      </header>

      <ChecklistEvaBloco />

      <div className="flex items-start gap-2 rounded-lg border border-alerta/30 bg-alerta/5 p-3">
        <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
        <p className="text-[11px] leading-relaxed text-alerta/90">
          {t("Checklist ilustrativo, baseado em princípios gerais de operação de traje. Não é procedimento operacional validado e não deve orientar atividade real.")}
        </p>
      </div>
    </div>
  )
}
