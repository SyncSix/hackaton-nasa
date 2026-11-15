import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Radio, WifiOff } from 'lucide-react'
import { CORES_CATEGORIA, DECISOES, type DecisaoAutonoma } from '../lib/decisoes'

const FILTROS: Array<{ id: string; rotulo: string }> = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'emergência', rotulo: 'Emergência' },
  { id: 'EVA', rotulo: 'EVA' },
  { id: 'recurso', rotulo: 'Recurso' },
  { id: 'rota', rotulo: 'Rota' },
  { id: 'médico', rotulo: 'Médico' },
]

export function Decisoes() {
  const [filtro, setFiltro] = useState('todas')

  const lista =
    filtro === 'todas' ? DECISOES : DECISOES.filter((d) => d.categoria === filtro)

  const semContato = DECISOES.filter((d) => d.enlace === 'sem contato').length
  const naoReportadas = DECISOES.filter((d) => !d.reportado).length

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Auditoria de missão</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Registro de decisões autônomas
        </h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/60">
          Com atraso de 4 a 24 minutos e janelas de relay intermitentes, a tripulação decide
          sozinha. Cada decisão tomada sem orientação da Terra fica registrada com o contexto, a
          justificativa e o estado do enlace no momento.
        </p>
      </header>

      {/* Resumo */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        <div className="card-glass p-3.5">
          <div className="font-mono text-xl font-semibold tnum text-gelo/90">{DECISOES.length}</div>
          <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">
            decisões registradas
          </div>
        </div>
        <div className="card-glass card-estado card-estado-atencao p-3.5">
          <div className="font-mono text-xl font-semibold tnum text-alerta">{semContato}</div>
          <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">
            tomadas sem contato
          </div>
        </div>
        <div className="card-glass card-estado card-estado-critico p-3.5">
          <div className="font-mono text-xl font-semibold tnum text-critico">{naoReportadas}</div>
          <div className="text-[11.5px] uppercase tracking-wider text-gelo/65">
            ainda não reportadas
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-1.5">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`rounded border px-2.5 py-1 text-[11px] transition-colors ${
              filtro === f.id
                ? 'border-marte/50 bg-marte/15 text-marte'
                : 'border-white/10 text-gelo/60 hover:border-white/25 hover:text-gelo/85'
            }`}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2.5">
        {lista.map((d) => (
          <CartaoDecisao key={d.id} d={d} />
        ))}
      </div>

      <p className="pb-1 text-center text-[11.5px] leading-relaxed text-gelo/60">
        Registro ilustrativo do protótipo. O fluxo de auditoria segue o princípio de que decisões
        autônomas precisam ser rastreáveis e reportáveis à Terra.
      </p>
    </div>
  )
}

function CartaoDecisao({ d }: { d: DecisaoAutonoma }) {
  const cor = CORES_CATEGORIA[d.categoria]

  return (
    <article className="card-glass p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11.5px] text-gelo/65">{d.id}</span>
          <span className={`rounded border px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider ${cor}`}>
            {d.categoria}
          </span>
          <span className="font-mono text-[11.5px] text-gelo/65">
            Sol {d.sol} · {d.hora}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {d.enlace === 'sem contato' ? (
            <span className="flex items-center gap-1 rounded border border-alerta/35 bg-alerta/10 px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider text-alerta">
              <WifiOff size={9} /> sem contato
            </span>
          ) : d.enlace === 'aguardando' ? (
            <span className="flex items-center gap-1 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider text-gelo/60">
              <Clock size={9} /> aguardando
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded border border-nominal/35 bg-nominal/10 px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider text-nominal">
              <Radio size={9} /> enlace ativo
            </span>
          )}
          <span className="font-mono text-[11px] text-gelo/60">+{d.latenciaMin} min</span>
        </div>
      </div>

      <h2 className="mt-2 text-[13.5px] font-semibold leading-snug tracking-tight">{d.titulo}</h2>

      <div className="mt-2 space-y-1.5">
        <p className="text-[11px] leading-relaxed text-gelo/60">
          <span className="text-gelo/65">Contexto: </span>
          {d.contexto}
        </p>
        <p className="text-[11px] leading-relaxed text-gelo/75">
          <span className="text-gelo/65">Decisão: </span>
          {d.decisao}
        </p>
        <p className="text-[11px] leading-relaxed text-gelo/60">
          <span className="text-gelo/65">Justificativa: </span>
          {d.justificativa}
        </p>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/8 pt-2.5">
        {d.protocolo && (
          <Link
            to={`/protocolos/${d.protocolo}`}
            className="flex items-center gap-1 rounded border border-white/12 px-2 py-0.5 text-[11px] text-gelo/60 transition-colors hover:border-marte/40 hover:text-marte"
          >
            protocolo {d.protocolo} <ArrowRight size={9} />
          </Link>
        )}
        <span
          className={`ml-auto flex items-center gap-1 text-[11px] ${
            d.reportado ? 'text-nominal' : 'text-critico'
          }`}
        >
          {d.reportado ? (
            <>
              <CheckCircle2 size={10} /> reportada à Terra
            </>
          ) : (
            <>
              <Clock size={10} /> pendente de reporte
            </>
          )}
        </span>
      </div>
    </article>
  )
}
