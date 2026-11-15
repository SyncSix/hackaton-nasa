import { useState } from 'react'
import {
  AlertTriangle,
  Battery,
  Droplets,
  Radio,
  Snowflake,
  Sun,
  Timer,
  Wind,
} from 'lucide-react'
import {
  ATMOSFERA,
  avaliarGas,
  riscoCo2,
  type GasAtmosferico,
} from '../lib/atmosfera'
import { autonomiaEva, estadoTraje, horasAteRetorno, limiteCaminhada, PLSS } from '../lib/traje'
import { ABRIGOS, CORES_SPE, ESTADO_SOLAR, vereditoAbrigo } from '../lib/abrigo'
import { CORES } from '../lib/ridge'
import { PainelResiduos } from '../components/PainelResiduos'
import { PainelFrio } from '../components/PainelFrio'
import { PainelContaminacao } from '../components/PainelContaminacao'
import { EstadoIcone } from '../components/EstadoIcone'

type Aba = 'plss' | 'atmosfera' | 'residuos' | 'abrigo' | 'frio' | 'contaminacao'

const ABAS: Array<{ id: Aba; rotulo: string; descricao: string }> = [
  { id: 'plss', rotulo: 'Traje (PLSS)', descricao: 'Consumíveis durante a EVA' },
  { id: 'atmosfera', rotulo: 'Atmosfera', descricao: 'Gases do habitat' },
  { id: 'residuos', rotulo: 'Resíduos', descricao: 'Ciclo do ar' },
  { id: 'abrigo', rotulo: 'Abrigo solar', descricao: 'Evento solar' },
  { id: 'frio', rotulo: 'Cadeia de frio', descricao: 'Medicamentos e amostras' },
  { id: 'contaminacao', rotulo: 'Contaminação', descricao: 'Proteção planetária' },
]

const ICONES_PLSS: Record<string, React.ReactNode> = {
  o2: <Wind size={15} />,
  co2: <Wind size={15} />,
  agua: <Droplets size={15} />,
  bateria: <Battery size={15} />,
}

export function SistemasVitais() {
  const [aba, setAba] = useState<Aba>('plss')

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">Suporte à vida</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sistemas vitais</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/60">
          O que mantém a tripulação viva dentro do habitat e fora dele. Três sistemas que falham
          de formas diferentes e em escalas de tempo diferentes.
        </p>
      </header>

      {/* Abas */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
              aba === a.id
                ? 'border-marte/50 bg-marte/10'
                : 'border-white/8 bg-black/20 hover:border-white/20'
            }`}
          >
            <div
              className={`text-[12.5px] font-medium ${aba === a.id ? 'text-marte' : 'text-gelo/85'}`}
            >
              {a.rotulo}
            </div>
            <div className="text-[11.5px] text-gelo/65">{a.descricao}</div>
          </button>
        ))}
      </div>

      {aba === 'plss' && <PainelPlss />}
      {aba === 'atmosfera' && <PainelAtmosfera />}
      {aba === 'residuos' && <PainelResiduos />}
      {aba === 'abrigo' && <PainelAbrigo />}
      {aba === 'frio' && <PainelFrio />}
      {aba === 'contaminacao' && <PainelContaminacao />}

      <p className="pb-1 text-center text-[11.5px] leading-relaxed text-gelo/60">
        Valores simulados para demonstração. Grandezas monitoradas e subsistemas seguem o que o
        ECLSS e o PLSS reais controlam. Protótipo sem validação operacional.
      </p>
    </div>
  )
}

/* ---------------- PLSS ---------------- */

function PainelPlss() {
  const { horas, critico } = autonomiaEva()
  const limiteKm = limiteCaminhada(horas)

  return (
    <div className="space-y-4">
      <section className="card-glass flex flex-wrap items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-marte/12 text-marte">
          <Timer size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="label-micro">Autonomia restante da EVA</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tnum">{horas.toFixed(1)}</span>
            <span className="text-[12px] text-gelo/60">horas até o limite de retorno</span>
          </div>
          <p className="mt-0.5 text-[11px] text-gelo/65">
            Limitado por <span className="text-gelo/80">{critico.nome}</span> ·{' '}
            {critico.subsistema}
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-white/8 bg-black/25 px-3.5 py-2 text-right">
          <div className="text-[11px] uppercase tracking-wider text-gelo/65">Walkback</div>
          <div className="font-mono text-[15px] tnum text-gelo/90">{limiteKm.toFixed(1)} km</div>
          <div className="text-[11px] text-gelo/60">sem veículo</div>
        </div>
      </section>

      <section>
        <div className="mb-2">
          <h2 className="text-[13px] font-semibold tracking-tight">
            Consumíveis do traje em tempo real
          </h2>
          <p className="text-[11px] text-gelo/65">
            A mochila do traje (PLSS) fornece O₂, remove CO₂, controla temperatura e pressão.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLSS.map((c) => {
            const e = estadoTraje(c)
            const cor = CORES[e]
            const pct = Math.round((c.atual / c.capacidade) * 100)
            return (
              <div key={c.id} className={`card-glass card-estado card-estado-${e} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gelo/60">
                    {ICONES_PLSS[c.id]}
                    <span className="text-[11px] font-medium text-gelo/80">{c.nome}</span>
                  </div>
                  <EstadoIcone estado={e} tamanho={11} />
                </div>
                <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">
                  {c.subsistema}
                </div>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`font-mono text-xl font-medium tnum ${cor.texto}`}>{pct}</span>
                  <span className="text-[11px] text-gelo/60">{c.unidade}</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full ${cor.texto.replace('text-', 'bg-')}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] text-gelo/65">retorno em</span>
                  <span className={`font-mono text-[11px] tnum ${cor.texto}`}>
                    {horasAteRetorno(c).toFixed(1)} h
                  </span>
                </div>

                <p className="mt-2 border-t border-white/8 pt-2 text-[11px] leading-relaxed text-gelo/65">
                  {c.consequencia}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card-glass p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-alerta" />
          <div>
            <div className="text-[12px] font-medium text-gelo/90">Como o limite é calculado</div>
            <p className="mt-1 text-[11px] leading-relaxed text-gelo/60">
              A distância máxima a pé é metade da autonomia restante, com 20% de margem,
              multiplicada pela velocidade de caminhada de 1,6 km/h. Se o veículo falhar, o
              astronauta precisa conseguir voltar ao habitat caminhando com o traje.
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-gelo/65">
              limite = (horas × 0,8 ÷ 2) × 1,6 km/h = {limiteKm.toFixed(1)} km
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------------- Atmosfera ---------------- */

function PainelAtmosfera() {
  const co2 = riscoCo2()
  const criticos = ATMOSFERA.filter((g) => avaliarGas(g) !== 'nominal')

  return (
    <div className="space-y-4">
      <section
        className={`card-glass flex flex-wrap items-center gap-4 p-5 ${
          co2.nivel === 'critico'
            ? 'card-estado card-estado-critico'
            : co2.nivel === 'atencao'
              ? 'card-estado card-estado-atencao'
              : 'card-estado card-estado-nominal'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="label-micro">Balanço de CO₂ do habitat</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tnum text-gelo/95">
              {co2.pct}%
            </span>
            <span className="text-[12px] text-gelo/60">da faixa crítica</span>
          </div>
          <p className="mt-0.5 max-w-xl text-[11px] leading-relaxed text-gelo/55">
            Exibir apenas o O₂ esconde o problema: o CO₂ sobe enquanto o O₂ parece normal, e é o
            CO₂ que derruba a consciência primeiro em ambiente fechado.
          </p>
        </div>
        {criticos.length > 0 && (
          <div className="shrink-0 rounded-lg border border-alerta/30 bg-alerta/8 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-alerta">
              {criticos.length} grandeza(s) fora da faixa
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-[13px] font-semibold tracking-tight">
          Composição atmosférica do habitat
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ATMOSFERA.map((g) => (
            <CartaoGas key={g.id} gas={g} />
          ))}
        </div>
      </section>

      <section className="card-glass p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-alerta" />
          <p className="text-[11px] leading-relaxed text-gelo/60">
            <span className="text-gelo/85">Por que o CO₂ importa mais que o O₂ em ambiente fechado:</span>{' '}
            um vazamento de O₂ é percebido rápido pela queda de pressão. Já o CO₂ sobe devagar,
            sem sintoma claro até o nível de confusão — justamente quando o julgamento de quem
            está dentro já está comprometido.
          </p>
        </div>
      </section>
    </div>
  )
}

function CartaoGas({ gas }: { gas: GasAtmosferico }) {
  const e = avaliarGas(gas)
  const cor = CORES[e]
  return (
    <div className={`card-glass card-estado card-estado-${e} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11.5px] font-medium text-gelo/85">{gas.nome}</div>
          {gas.formula && (
            <div className="font-mono text-[11px] text-gelo/65">{gas.formula}</div>
          )}
        </div>
        <EstadoIcone estado={e} tamanho={11} />
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className={`font-mono text-xl font-medium tnum ${cor.texto}`}>{gas.valor}</span>
        <span className="text-[11px] text-gelo/60">{gas.unidade}</span>
      </div>

      <div className="mt-1 text-[11px] text-gelo/65">
        faixa segura {gas.min}–{gas.max} {gas.unidade}
      </div>

      <p className="mt-2 border-t border-white/8 pt-2 text-[11px] leading-relaxed text-gelo/65">
        {gas.efeito}
      </p>

      <div className="mt-1.5 flex items-center gap-1">
        <Radio size={9} className="shrink-0 text-marte/70" />
        <span className="truncate text-[11.5px] text-gelo/65">{gas.sistema}</span>
      </div>
    </div>
  )
}

/* ---------------- Abrigo solar ---------------- */

function PainelAbrigo() {
  const cor = CORES_SPE[ESTADO_SOLAR.nivel]

  return (
    <div className="space-y-4">
      <section className={`card-glass border p-5 ${cor.borda}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="label-micro">Estado solar</span>
              <span
                className={`rounded border px-2 py-0.5 text-[11px] uppercase tracking-wider ${cor.bg} ${cor.texto} ${cor.borda}`}
              >
                {cor.rotulo}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <div>
                <span className="font-mono text-xl font-semibold tnum text-gelo/95">
                  {ESTADO_SOLAR.doseAtual}
                </span>
                <span className="ml-1 text-[11px] text-gelo/65">mSv/sol agora</span>
              </div>
              <div>
                <span className="font-mono text-xl font-semibold tnum text-critico">
                  {ESTADO_SOLAR.dosePico}
                </span>
                <span className="ml-1 text-[11px] text-gelo/65">mSv/sol no pico</span>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-gelo/55">
              {ESTADO_SOLAR.origem} · pico estimado em {ESTADO_SOLAR.tempoAtePicoMin} min
            </p>
            <p className={`mt-2 text-[12px] font-medium ${cor.texto}`}>{cor.acao}</p>
          </div>
          <Sun size={24} className={`shrink-0 ${cor.texto}`} />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[13px] font-semibold tracking-tight">
          Abrigos disponíveis
        </h2>
        <p className="mb-3 text-[11px] text-gelo/65">
          Em um evento solar, a radiação na superfície pode dobrar em horas. A decisão é: consigo
          chegar a um abrigo antes do pico?
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {ABRIGOS.map((a) => {
            const v = vereditoAbrigo(ESTADO_SOLAR, a)
            const estado = v.ok ? 'nominal' : 'critico'
            const c = CORES[estado]
            return (
              <div key={a.id} className={`card-glass card-estado card-estado-${estado} p-4`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12px] font-medium text-gelo/90">{a.nome}</span>
                  <EstadoIcone estado={estado} tamanho={11} />
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/65">{a.descricao}</p>

                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">
                      Evacuação
                    </div>
                    <div className="font-mono text-[13px] tnum text-gelo/85">
                      {a.tempoEvacuacaoMin} min
                    </div>
                  </div>
                  <div>
                    <div className="text-[11.5px] uppercase tracking-wider text-gelo/60">
                      Blindagem
                    </div>
                    <div className="font-mono text-[13px] tnum text-gelo/85">
                      {a.blindagemGcm2} g/cm²
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <Snowflake size={10} className="shrink-0 text-gelo/60" />
                  <span className="text-[11px] text-gelo/65">
                    reduz {Math.round(a.reducaoDose * 100)}% da dose
                  </span>
                </div>

                <p className={`mt-2 border-t border-white/8 pt-2 text-[11.5px] leading-relaxed ${c.texto}`}>
                  {v.mensagem}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card-glass p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-alerta" />
          <p className="text-[11px] leading-relaxed text-gelo/60">
            <span className="text-gelo/85">A regra operacional:</span> durante um evento solar, a
            tripulação não espera o pico para agir. Se a margem entre o tempo de evacuação e o
            tempo até o pico for menor que 15 minutos, a EVA não é autorizada. Nenhum abrigo
            móvel substitui o habitat para eventos prolongados.
          </p>
        </div>
      </section>
    </div>
  )
}
