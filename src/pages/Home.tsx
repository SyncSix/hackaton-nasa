import { Link } from 'react-router-dom'
import {
  Rocket,
  Map as MapIcon,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  Radio,
} from 'lucide-react'
import { ALVOS, CONSUMIVEIS, MISSAO, ROTAS } from '../lib/mission'
import { useMarsWeather } from '../lib/useNasa'

export function Home() {
  const { data: clima } = useMarsWeather()
  const sol = clima?.[clima.length - 1]

  return (
    <div className="relative overflow-hidden">
      {/* Blobs animados de fundo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 top-10 h-80 w-80 rounded-full bg-marte/20 blur-3xl" />
        <div className="animate-blob delay-600 absolute -right-24 top-40 h-96 w-96 rounded-full bg-alerta/12 blur-3xl" />
        <div className="animate-blob delay-900 absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gelo/6 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-marte/25 bg-marte/10 px-4 py-2">
            <Sparkles size={14} className="text-marte" />
            <span className="text-[12px] text-gelo/80">
              NASA Space Apps Challenge 2026 · Missão {MISSAO.nome}
            </span>
          </div>

          <h1 className="animate-fade-in delay-150 bg-gradient-accent bg-clip-text-gradient text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Sobreviva em
            <br />
            Marte
          </h1>

          <p className="animate-fade-in delay-300 mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-gelo/55 md:text-[17px]">
            Sistema integrado de navegação, segurança operacional e exploração científica na
            superfície marciana. Reúne relevo, condições ambientais, zonas de risco, comunicação e
            objetivos científicos em um único console de decisão.
          </p>

          <div className="animate-fade-in delay-450 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/visao-geral"
              className="shadow-glow shadow-glow-hover flex items-center gap-2 rounded-lg bg-marte px-7 py-3.5 text-[14px] font-semibold text-grafite transition-all"
            >
              <Rocket size={17} />
              Abrir console da missão
            </Link>
            <Link
              to="/mapa"
              className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-gelo/85 transition-all hover:border-white/25 hover:bg-white/10"
            >
              <MapIcon size={17} />
              Ver mapa marciano
            </Link>
          </div>

          {/* Leitura ao vivo */}
          {sol && (
            <div className="animate-fade-in delay-600 mt-10 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-full border border-white/8 bg-black/25 px-5 py-2 text-[11px] text-gelo/45">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Dados ao vivo da NASA
              </span>
              <span className="font-mono tnum">{sol.tempAvg.toFixed(1)} °C</span>
              <span className="font-mono tnum">{sol.windAvg.toFixed(1)} m/s</span>
              <span className="font-mono tnum">{sol.pressureAvg.toFixed(0)} Pa</span>
              <span className="text-gelo/30">Sol {sol.sol}</span>
            </div>
          )}
        </div>

        {/* FEATURES */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-6 md:grid-cols-3">
          <Feature
            icone={<MapIcon size={22} />}
            titulo="Mapa em camadas"
            texto="Relevo, alvos científicos, zonas de risco e cobertura de comunicação sobrepostos em uma leitura única do terreno."
            delay=""
          />
          <Feature
            icone={<ShieldCheck size={22} />}
            titulo="Avaliação de risco"
            texto="Veredito GO/NO-GO antes de cada EVA, com radiação, poeira, temperatura e janelas de comunicação."
            delay="delay-150"
          />
          <Feature
            icone={<Layers size={22} />}
            titulo="Planejamento de rota"
            texto="Compare trajetos por inclinação, duração e consumo de oxigênio. A rota mais curta não é a mais segura."
            delay="delay-300"
          />
        </div>

        {/* STATS */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          <Stat valor={`${ALVOS.length}`} rotulo="Alvos científicos" delay="delay-450" />
          <Stat valor={`${ROTAS.length}`} rotulo="Rotas avaliadas" delay="delay-600" />
          <Stat valor={`${CONSUMIVEIS.length}`} rotulo="Consumíveis monitorados" delay="delay-750" />
          <Stat valor={`${MISSAO.tripulacao}`} rotulo="Tripulantes" delay="delay-900" />
        </div>
      </section>

      {/* ACESSO RÁPIDO */}
      <section className="relative border-t border-white/8 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="label-micro">Roteiro da missão</div>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
                Três passos antes de sair
              </h2>
            </div>
            <span className="hidden text-[11px] text-gelo/30 sm:block">
              Observar · contextualizar · decidir
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Passo
              numero="01"
              titulo="Confira as condições"
              texto="Clima, radiação e janelas de comunicação antes de autorizar a atividade externa."
              to="/condicoes"
              icone={<Radio size={15} />}
            />
            <Passo
              numero="02"
              titulo="Compare as rotas"
              texto="Máximo científico contra segurança e economia de oxigênio, com perfil de inclinação."
              to="/rotas"
              icone={<Layers size={15} />}
            />
            <Passo
              numero="03"
              titulo="Abra o mapa"
              texto="Camadas de terreno, alvos e zonas de risco em uma leitura espacial integrada."
              to="/mapa"
              icone={<MapIcon size={15} />}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function Feature({
  icone,
  titulo,
  texto,
  delay,
}: {
  icone: React.ReactNode
  titulo: string
  texto: string
  delay: string
}) {
  return (
    <div className={`card-glass card-glass-hover animate-fade-in p-7 ${delay}`}>
      <div className="bg-gradient-cosmic mb-4 inline-flex rounded-xl p-3 text-marte">{icone}</div>
      <h3 className="text-[15px] font-semibold tracking-tight">{titulo}</h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-gelo/45">{texto}</p>
    </div>
  )
}

function Stat({ valor, rotulo, delay }: { valor: string; rotulo: string; delay: string }) {
  return (
    <div className={`animate-fade-in text-center ${delay}`}>
      <div className="font-mono text-4xl font-bold text-marte md:text-5xl">{valor}</div>
      <div className="mt-1.5 text-[11px] uppercase tracking-wider text-gelo/40">{rotulo}</div>
    </div>
  )
}

function Passo({
  numero,
  titulo,
  texto,
  to,
  icone,
}: {
  numero: string
  titulo: string
  texto: string
  to: string
  icone: React.ReactNode
}) {
  return (
    <Link to={to} className="card-glass card-glass-hover group p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-marte">{numero}</span>
        <ArrowRight
          size={14}
          className="text-gelo/25 transition-transform group-hover:translate-x-0.5 group-hover:text-marte"
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-gelo/40">{icone}</span>
        <span className="text-[13px] font-medium">{titulo}</span>
      </div>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-gelo/40">{texto}</p>
    </Link>
  )
}
