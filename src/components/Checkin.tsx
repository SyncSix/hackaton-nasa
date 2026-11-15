import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ShieldCheck, XCircle } from 'lucide-react'
import { avaliar, CORES_ESTADO, RISCOS, type Estado } from '../lib/riscos'
import { CONSUMIVEIS, diasRestantes, estadoConsumivel } from '../lib/mission'

type Item = {
  id: string
  nome: string
  estado: Estado
  valor: string
  limite: string
  acao: string
  detalhe: string
}

/**
 * Check-in de segurança: reúne todos os fatores que precisam estar alinhados
 * para sobreviver em Marte e diz, em linguagem direta, o que está errado.
 */
export function Checkin() {
  const [aberto, setAberto] = useState(false)

  const itens = useMemo<Item[]>(() => {
    const riscos: Item[] = RISCOS.map((r) => ({
      id: r.id,
      nome: r.nome,
      estado: avaliar(r),
      valor: `${r.atual} ${r.unidade}`,
      limite: `${r.limite} ${r.unidade}`,
      acao: r.acao,
      detalhe: r.perigo,
    }))

    const consumiveis: Item[] = CONSUMIVEIS.map((c) => {
      const e = estadoConsumivel(c)
      const dias = diasRestantes(c)
      return {
        id: c.id,
        nome: c.nome,
        estado: e === 'critico' ? 'critico' : e === 'atencao' ? 'atencao' : 'ok',
        valor: `${dias} sóis restantes`,
        limite: `mínimo ${c.critico}% da capacidade`,
        acao:
          e === 'critico'
            ? `Racionar ${c.nome.toLowerCase()} imediatamente e reportar à Terra.`
            : `Monitorar consumo de ${c.nome.toLowerCase()}.`,
        detalhe: `Consumo de ${c.consumoPorSol} ${c.unidade}/sol por tripulante.`,
      }
    })

    return [...riscos, ...consumiveis]
  }, [])

  const criticos = itens.filter((i) => i.estado === 'critico')
  const atencao = itens.filter((i) => i.estado === 'atencao')
  const ok = itens.filter((i) => i.estado === 'ok')

  const veredito: Estado = criticos.length > 0 ? 'critico' : atencao.length > 0 ? 'atencao' : 'ok'
  const cor = CORES_ESTADO[veredito]

  const titulo =
    veredito === 'ok'
      ? 'Tudo alinhado para sobreviver'
      : veredito === 'atencao'
        ? `${atencao.length} ${atencao.length === 1 ? 'item precisa' : 'itens precisam'} de atenção`
        : `${criticos.length} ${criticos.length === 1 ? 'item está' : 'itens estão'} fora do limite`

  const resumo =
    veredito === 'ok'
      ? 'Todos os fatores de sobrevivência estão dentro dos limites. A missão pode operar normalmente.'
      : veredito === 'atencao'
        ? 'Nada crítico, mas há fatores que precisam ser ajustados antes de uma saída.'
        : 'Não autorize atividade externa até corrigir os itens abaixo.'

  return (
    <section className={`card-glass overflow-hidden border ${cor.borda}`}>
      {/* Cabeçalho do check-in */}
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            veredito === 'ok'
              ? 'bg-emerald-400/12 text-emerald-400'
              : veredito === 'atencao'
                ? 'bg-alerta/12 text-alerta'
                : 'bg-marte/12 text-marte'
          }`}
        >
          {veredito === 'ok' ? (
            <ShieldCheck size={22} />
          ) : veredito === 'atencao' ? (
            <AlertTriangle size={22} />
          ) : (
            <XCircle size={22} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="label-micro">Check-in de segurança</span>
            <span className={`text-[10px] uppercase tracking-wider ${cor.texto}`}>
              {cor.rotulo}
            </span>
          </div>
          <h2 className="mt-0.5 text-[16px] font-semibold tracking-tight">{titulo}</h2>
          <p className="mt-0.5 text-[12px] text-gelo/45">{resumo}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <Contagem n={ok.length} rotulo="OK" cor="text-emerald-400" />
          <Contagem n={atencao.length} rotulo="Atenção" cor="text-alerta" />
          <Contagem n={criticos.length} rotulo="Crítico" cor="text-marte" />
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-gelo/30 transition-transform ${aberto ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Detalhe */}
      {aberto && (
        <div className="border-t border-white/8">
          {criticos.length > 0 && (
            <Grupo titulo="Corrigir antes de sair" itens={criticos} />
          )}
          {atencao.length > 0 && <Grupo titulo="Ajustar quando possível" itens={atencao} />}
          {ok.length > 0 && <Grupo titulo="Dentro do limite" itens={ok} recolhido />}
        </div>
      )}
    </section>
  )
}

function Contagem({ n, rotulo, cor }: { n: number; rotulo: string; cor: string }) {
  return (
    <div className="text-center">
      <div className={`font-mono text-lg font-semibold tnum ${n > 0 ? cor : 'text-gelo/25'}`}>
        {n}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-gelo/30">{rotulo}</div>
    </div>
  )
}

function Grupo({
  titulo,
  itens,
  recolhido = false,
}: {
  titulo: string
  itens: Item[]
  recolhido?: boolean
}) {
  const [aberto, setAberto] = useState(!recolhido)

  return (
    <div className="border-b border-white/6 last:border-0">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-2.5 text-left hover:bg-white/[0.02]"
      >
        <span className="label-micro">{titulo}</span>
        <span className="flex items-center gap-2 text-[10px] text-gelo/30">
          {itens.length}
          <ChevronDown size={12} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {aberto && (
        <ul className="divide-y divide-white/5">
          {itens.map((i) => {
            const c = CORES_ESTADO[i.estado]
            return (
              <li key={i.id} className="px-5 py-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.barra}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12.5px] font-medium text-gelo/90">{i.nome}</span>
                      <span className={`font-mono text-[11px] tnum ${c.texto}`}>{i.valor}</span>
                      <span className="text-[10px] text-gelo/30">limite {i.limite}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gelo/40">{i.detalhe}</p>
                    {i.estado !== 'ok' && (
                      <p className={`mt-1 text-[11px] leading-relaxed ${c.texto}`}>
                        → {i.acao}
                      </p>
                    )}
                  </div>
                  {i.estado === 'ok' && (
                    <CheckCircle2 size={13} className="mt-1 shrink-0 text-emerald-400/60" />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
