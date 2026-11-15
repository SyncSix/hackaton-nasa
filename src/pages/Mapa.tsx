import { useState } from 'react'
import { Camera, Layers, MapPin, ShieldAlert } from 'lucide-react'
import { ALVOS, MISSAO } from '../lib/mission'
import { IMAGENS_JEZERO } from '../lib/nasa'

/** Camadas de informação exibidas sobre o mapa-base. */
const CAMADAS = [
  { id: 'terreno', nome: 'Terreno e declividade', fonte: 'HiRISE / CTX', ativa: true },
  { id: 'alvos', nome: 'Alvos científicos', fonte: 'Missão', ativa: true },
  { id: 'risco', nome: 'Zonas de risco', fonte: 'Análise de terreno', ativa: true },
  { id: 'comunicacao', nome: 'Zonas cegas de comunicação', fonte: 'Modelo simulado', ativa: false },
  { id: 'subsolo', nome: 'Gelo no subsolo', fonte: 'SHARAD / RIMFAX', ativa: false },
]

/** Pontos no mapa em coordenadas relativas (%). */
const PONTOS = [
  { id: 'BASE', x: 50, y: 50, tipo: 'base', rotulo: 'HAB' },
  { id: 'T1', x: 63, y: 33, tipo: 'alvo', rotulo: 'T1' },
  { id: 'T2', x: 34, y: 28, tipo: 'risco', rotulo: 'T2' },
  { id: 'T3', x: 72, y: 68, tipo: 'alvo', rotulo: 'T3' },
  { id: 'T4', x: 26, y: 62, tipo: 'alvo', rotulo: 'T4' },
]

export function Mapa() {
  const [camadasAtivas, setCamadasAtivas] = useState<Set<string>>(
    new Set(CAMADAS.filter((c) => c.ativa).map((c) => c.id)),
  )
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const imagem = IMAGENS_JEZERO[imagemAtiva]

  function alternar(id: string) {
    setCamadasAtivas((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label">Navegação territorial</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Mapa Marciano</h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/70">
            {MISSAO.local} · onde estou, para onde vou e quais condições tornam uma região
            adequada para passagem.
          </p>
        </div>
        <span className="rounded border border-alerta/30 bg-alerta/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-alerta">
          Posições demonstrativas
        </span>
      </section>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Mapa */}
        <div className="card-glass relative overflow-hidden lg:col-span-3">
          <div className="relative aspect-[16/10] w-full bg-black">
            {/* Mapa-base oficial da NASA — Cratera Jezero */}
            <img
              src={imagem.url}
              alt={`${imagem.titulo} — ${imagem.instrumento}`}
              className="h-full w-full object-cover opacity-75"
              loading="lazy"
            />

            {/* Grade de referência */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(233,232,226,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(233,232,226,0.04)_1px,transparent_1px)] bg-[length:40px_40px]" />

            {/* Zona de risco */}
            {camadasAtivas.has('risco') && (
              <div
                className="pointer-events-none absolute rounded-full border border-critico/40 bg-critico/10"
                style={{ left: '26%', top: '20%', width: '18%', height: '20%' }}
              />
            )}

            {/* Zona cega de comunicação */}
            {camadasAtivas.has('comunicacao') && (
              <div
                className="pointer-events-none absolute rounded border border-dashed border-alerta/40 bg-alerta/5"
                style={{ left: '58%', top: '58%', width: '24%', height: '22%' }}
              />
            )}

            {/* Pontos */}
            {PONTOS.map((p) => {
              const visivel =
                p.tipo === 'base' ||
                (p.tipo === 'alvo' && camadasAtivas.has('alvos')) ||
                (p.tipo === 'risco' && camadasAtivas.has('risco'))
              if (!visivel) return null
              return (
                <div
                  key={p.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11.5px] font-semibold ${
                      p.tipo === 'base'
                        ? 'border-emerald-400/60 bg-emerald-400/20 text-emerald-300'
                        : p.tipo === 'risco'
                          ? 'border-critico/60 bg-critico/25 text-critico'
                          : 'border-gelo/40 bg-gelo/15 text-gelo'
                    }`}
                  >
                    {p.rotulo}
                  </div>
                </div>
              )
            })}

            {/* Coordenadas */}
            <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[11px] text-gelo/70">
              18.4°N · 77.5°E
            </div>
            <div className="pointer-events-none absolute right-3 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11.5px] text-gelo/70">
              <span className="font-mono">N</span>
              <span>↑</span>
            </div>

            {/* Atribuição da imagem oficial */}
            <div className="pointer-events-none absolute bottom-2 right-3 max-w-[60%] rounded bg-black/70 px-2 py-1 text-right">
              <div className="truncate text-[10px] font-medium text-gelo/80">
                {imagem.titulo}
              </div>
              <div className="truncate text-[9.5px] text-gelo/50">
                {imagem.instrumento} · NASA
              </div>
            </div>
          </div>

          {/* Seletor de imagens oficiais */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/8 px-3 py-2">
            <Camera size={12} className="shrink-0 text-gelo/40" />
            <span className="mr-1 text-[10.5px] uppercase tracking-wider text-gelo/45">
              Acervo NASA
            </span>
            {IMAGENS_JEZERO.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setImagemAtiva(i)}
                className={`rounded border px-2 py-0.5 text-[10.5px] transition-colors ${
                  i === imagemAtiva
                    ? 'border-marte/50 bg-marte/15 text-marte'
                    : 'border-white/10 text-gelo/55 hover:border-white/25 hover:text-gelo/85'
                }`}
                title={img.descricao}
              >
                {img.id}
              </button>
            ))}
          </div>
        </div>

        {/* Camadas */}
        <aside className="card-glass p-4">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-gelo/60" />
            <h2 className="text-[12px] font-semibold tracking-tight">Camadas</h2>
          </div>
          <ul className="mt-3 space-y-1">
            {CAMADAS.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => alternar(c.id)}
                  className={`w-full rounded px-2 py-1.5 text-left transition-colors ${
                    camadasAtivas.has(c.id) ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-sm border ${
                        camadasAtivas.has(c.id)
                          ? 'border-critico bg-critico/60'
                          : 'border-white/20 bg-transparent'
                      }`}
                    />
                    <span
                      className={`flex-1 text-[11px] ${
                        camadasAtivas.has(c.id) ? 'text-gelo/85' : 'text-gelo/65'
                      }`}
                    >
                      {c.nome}
                    </span>
                  </div>
                  <div className="ml-5 text-[11px] text-gelo/70">{c.fonte}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-white/8 pt-3">
            <div className="label mb-2">Legenda</div>
            <ul className="space-y-1.5 text-[11px] text-gelo/70">
              <li className="flex items-center gap-2">
                <MapPin size={10} className="text-emerald-400" /> Base / HAB
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={10} className="text-gelo/60" /> Alvo científico
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert size={10} className="text-critico" /> Zona de risco
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Alvos e leitura */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-glass p-4">
          <h2 className="text-[12px] font-semibold tracking-tight">Alvos no setor</h2>
          <ul className="mt-2.5 divide-y divide-white/5">
            {ALVOS.map((a) => (
              <li key={a.id} className="flex items-center gap-2.5 py-2">
                <span className="font-mono text-[11px] text-gelo/70">{a.id}</span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/80">
                  {a.nome}
                </span>
                <span className="font-mono text-[11px] tnum text-gelo/60">
                  {a.distanciaKm} km
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-glass p-4">
          <h2 className="text-[12px] font-semibold tracking-tight">Como ler este mapa</h2>
          <ol className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-gelo/65">
            <li>
              <span className="text-gelo/70">1. Onde estou.</span> O marcador HAB indica a base. O
              mapa-base é uma imagem real da NASA.
            </li>
            <li>
              <span className="text-gelo/70">2. Para onde vou.</span> Ative a camada de alvos
              científicos para ver os pontos de interesse.
            </li>
            <li>
              <span className="text-gelo/70">3. Que região é adequada.</span> Zonas de risco
              exigem revisão de itinerário antes da passagem.
            </li>
          </ol>
          <p className="mt-3 border-t border-white/8 pt-2.5 text-[11px] leading-relaxed text-gelo/70">
            Posições, zonas e traçados são demonstrativos. O mapa-base é uma imagem real do acervo
            da NASA e não corresponde à região operacional da missão simulada.
          </p>
        </section>
      </div>
    </div>
  )
}
