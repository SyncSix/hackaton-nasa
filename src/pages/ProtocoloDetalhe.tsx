import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, ListChecks, Package } from 'lucide-react'
import { CORES_CRITICIDADE, PROTOCOLOS } from '../lib/protocolos'
import { ProtocoloExecutavel } from '../components/ProtocoloExecutavel'

export function ProtocoloDetalhe() {
  const { id } = useParams()
  const p = PROTOCOLOS.find((x) => x.id === id)

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[13px] text-gelo/70">Protocolo não encontrado.</p>
        <Link to="/protocolos" className="mt-2 inline-block text-[12px] text-critico">
          Voltar para protocolos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-6 py-6">
      <Link
        to="/protocolos"
        className="inline-flex items-center gap-1.5 text-[11px] text-gelo/60 transition-colors hover:text-critico"
      >
        <ArrowLeft size={12} /> Protocolos
      </Link>

      <header className="card-glass p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11.5px] text-gelo/55">PROTOCOL · {p.id}</span>
              <span
                className={`rounded border px-2 py-0.5 text-[11.5px] uppercase tracking-wider ${
                  CORES_CRITICIDADE[p.criticidade]
                }`}
              >
                {p.criticidade} criticidade
              </span>
            </div>
            <h1 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-tight">
              {p.titulo}
            </h1>
            <p className="mt-1 text-[11.5px] text-gelo/60">
              {p.categoria} · {p.sistema} · RIDGE {p.ridge}
            </p>
          </div>
        </div>
      </header>

      <Bloco numero="01" titulo="Identificação" icone={<ListChecks size={13} />}>
        <ul className="space-y-1.5">
          {p.identificacao.map((i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-gelo/70">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-marte" />
              {i}
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco numero="02" titulo="Avaliação" icone={<ListChecks size={13} />}>
        <ul className="space-y-1.5">
          {p.avaliacao.map((i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-gelo/70">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-alerta" />
              {i}
            </li>
          ))}
        </ul>
      </Bloco>

      <ProtocoloExecutavel protocolo={p} />

      <Bloco numero="04" titulo="Recursos necessários" icone={<Package size={13} />}>
        <div className="flex flex-wrap gap-1.5">
          {p.recursos.map((r) => (
            <span
              key={r}
              className="rounded border border-white/8 bg-black/25 px-2 py-1 text-[11.5px] text-gelo/60"
            >
              {r}
            </span>
          ))}
        </div>
      </Bloco>

      <Bloco numero="05" titulo="Situação controlada quando" icone={<CheckCircle2 size={13} />}>
        <ul className="space-y-1.5">
          {p.criterioResolucao.map((c) => (
            <li key={c} className="flex items-start gap-2 text-[12px] leading-relaxed text-gelo/70">
              <CheckCircle2 size={11} className="mt-1 shrink-0 text-emerald-400/70" />
              {c}
            </li>
          ))}
        </ul>
      </Bloco>

      <footer className="flex items-start gap-2 rounded-lg border border-white/8 bg-black/20 p-3">
        <BookOpen size={11} className="mt-0.5 shrink-0 text-gelo/65" />
        <div>
          <p className="text-[11px] text-gelo/55">
            <span className="text-gelo/55">Referência técnica:</span> {p.referencia}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-gelo/65">
            Procedimento ilustrativo do protótipo. Não é documentação operacional validada.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Bloco({
  numero,
  titulo,
  icone,
  children,
}: {
  numero: string
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="card-glass p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="font-mono text-[11px] text-gelo/70">{numero}</span>
        <span className="text-gelo/70">{icone}</span>
        <h2 className="text-[12.5px] font-semibold tracking-tight">{titulo}</h2>
      </div>
      {children}
    </section>
  )
}
