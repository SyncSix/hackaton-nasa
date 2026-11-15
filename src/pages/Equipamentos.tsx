import { Radio, AlertTriangle, CircleDot } from 'lucide-react'
import { EQUIPAMENTOS } from '../lib/equipamentos'
import { RIDGE, CORES } from '../lib/ridge'

/** Agrupa os equipamentos por plataforma para leitura mais clara. */
const ORDEM_PLATAFORMA = [
  'Perseverance',
  'MSL Curiosity',
  'MEDA · Perseverance',
  'SHERLOC · Perseverance',
  'Habitat',
  'Traje EVA',
  'Tripulante',
  'Orbital',
  'Terra',
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
        <div className="label-micro">Rastreabilidade de dados</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Equipamentos e instrumentos
        </h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/60">
          Cada indicador do sistema é produzido por um equipamento real. Esta é a cadeia completa:
          grandeza medida, instrumento, plataforma e o que ele retorna.
        </p>
      </header>

      <div className="space-y-4">
        {grupos.map((g) => (
          <section key={g.plataforma} className="card-glass overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
              <Radio size={12} className="text-marte" />
              <h2 className="text-[12.5px] font-semibold tracking-tight">{g.plataforma}</h2>
              <span className="ml-auto font-mono text-[10.5px] text-gelo/45">
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
                          <span className={`text-[10px] uppercase tracking-wider ${cor.texto}`}>
                            RIDGE {e.ridge}
                          </span>
                        </div>
                        {e.completo && e.completo !== e.nome && (
                          <div className="mt-0.5 text-[10.5px] leading-tight text-gelo/45">
                            {e.completo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-[11px] leading-relaxed text-gelo/70">
                        <span className="text-gelo/45">Mede: </span>
                        {e.mede}
                      </p>
                      <p className="font-mono text-[10.5px] text-gelo/55">{e.unidade}</p>
                    </div>

                    {e.nota && (
                      <p className="mt-1.5 border-t border-white/6 pt-1.5 text-[10.5px] leading-relaxed text-gelo/45">
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

      {/* Lacunas identificadas */}
      <section className="card-glass border border-alerta/35 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-alerta" />
          <h2 className="text-[13.5px] font-semibold tracking-tight">
            Cuidados que ainda faltam no sistema
          </h2>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/55">
          Riscos reais da exploração marciana que ainda não têm módulo dedicado. Listados para
          decisão de escopo, não como funcionalidade implementada.
        </p>

        <ul className="mt-3 space-y-2">
          {LACUNAS.map((l) => (
            <li key={l.titulo} className="flex items-start gap-2.5">
              <CircleDot size={11} className="mt-1 shrink-0 text-alerta/70" />
              <div>
                <div className="text-[11.5px] font-medium text-gelo/85">{l.titulo}</div>
                <p className="text-[11px] leading-relaxed text-gelo/55">{l.detalhe}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** Riscos identificados na pesquisa que ainda não têm módulo no sistema. */
const LACUNAS = [
  {
    titulo: 'Protocolo de proteção planetária',
    detalhe:
      'Contaminação cruzada: microrganismos terrestres podem contaminar Marte, e amostras podem trazer risco de volta. Exige contenção de amostras e protocolos de selagem.',
  },
  {
    titulo: 'Gestão de poeira em trajes e juntas',
    detalhe:
      'A poeira fina entra em vedações e mecanismos. Falta um plano de manutenção de traje por ciclos de uso, não só descontaminação na entrada.',
  },
  {
    titulo: 'Procedimento de tempestade de partículas solares',
    detalhe:
      'Eventos solares podem dobrar a radiação na superfície em horas. Existe o risco, mas falta um abrigo de emergência com tempo de evacuação definido.',
  },
  {
    titulo: 'Cadeia de frio de amostras e medicamentos',
    detalhe:
      'Medicamentos e amostras degradam com ciclos térmicos. Falta monitoramento de temperatura de armazenamento, distinto da temperatura ambiente.',
  },
  {
    titulo: 'Gestão de resíduos e ciclo do ar',
    detalhe:
      'CO₂, umidade e voláteis precisam de remoção contínua. Só o nível de O₂ é exibido; falta o espelho de CO₂ e o balanço de umidade.',
  },
  {
    titulo: 'Massa óssea e cardiovascular em detalhe',
    detalhe:
      'Existe o indicador de densidade óssea, mas faltam os efeitos cardiovasculares e o risco renal associado à radiação galáctica.',
  },
  {
    titulo: 'Latência de decisão autônoma',
    detalhe:
      'O atraso de comunicação é exibido, mas não há registro formal de decisões tomadas sem orientação da Terra — algo que uma auditoria de missão exigiria.',
  },
  {
    titulo: 'Consumo de consumíveis do traje em tempo real',
    detalhe:
      'O checklist cobre a verificação, mas não há leitura contínua do PLSS durante a EVA, o que impediria detectar consumo anormal no meio da atividade.',
  },
]
