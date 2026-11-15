import { useState } from 'react'
import { Layers, MapPin, ShieldAlert } from 'lucide-react'
import { ALVOS, MISSAO } from '../lib/mission'
import { useMarsImages } from '../lib/useNasa'

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
  const { data: imagens, erro } = useMarsImages('mars surface panorama')
  const imagem = imagens?.[0]

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
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/50">
            {MISSAO.local} · onde estou, para onde vou e quais condições tornam uma região
            adequada para passagem.
          </p>
        </div>
        <span className="rounded border border-alerta/30 bg-alerta/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-alerta">
          Posições demonstrativas
        </span>
      </section>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Mapa */}
        <div className="panel relative overflow-hidden lg:col-span-3">
          <div className="relative aspect-[16/10] w-full bg-black">
            {/* Mapa-base real da NASA */}
            {imagem && (
              <img
                src={imagem.thumb}
                alt={imagem.title}
                className="h-full w-full object-cover opacity-70"
                loading="lazy"
              />
            )}
            {!imagem && (
              <div className="flex h-full items-center justify-center text-[11px] text-gelo/30">
                {erro ? `Mapa-base indisponível: ${erro}` : 'Carregando mapa-base…'}
              </div>
            )}

            {/* Grade de referência */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(233,232,226,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(233,232,226,0.04)_1px,transparent_1px)] bg-[length:40px_40px]" />

            {/* Zona de risco */}
            {camadasAtivas.has('risco') && (
              <div
                className="pointer-events-none absolute rounded-full border border-marte/40 bg-marte/10"
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
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-semibold ${
                      p.tipo === 'base'
                        ? 'border-emerald-400/60 bg-emerald-400/20 text-emerald-300'
                        : p.tipo === 'risco'
                          ? 'border-marte/60 bg-marte/25 text-marte'
                          : 'border-gelo/40 bg-gelo/15 text-gelo'
                    }`}
                  >
                    {p.rotulo}
                  </div>
                </div>
              )
            })}

            {/* Coordenadas */}
            <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] text-gelo/35">
              4.5°N · 135.9°E
            </div>
            <div className="pointer-events-none absolute right-3 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-gelo/50">
              <span className="font-mono">N</span>
              <span>↑</span>
            </div>
          </div>
        </div>

        {/* Camadas */}
        <aside className="panel p-4">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-gelo/40" />
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
                          ? 'border-marte bg-marte/60'
                          : 'border-white/20 bg-transparent'
                      }`}
                    />
                    <span
                      className={`flex-1 text-[11px] ${
                        camadasAtivas.has(c.id) ? 'text-gelo/85' : 'text-gelo/45'
                      }`}
                    >
                      {c.nome}
                    </span>
                  </div>
                  <div className="ml-5 text-[9.5px] text-gelo/30">{c.fonte}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-white/8 pt-3">
            <div className="label mb-2">Legenda</div>
            <ul className="space-y-1.5 text-[10px] text-gelo/50">
              <li className="flex items-center gap-2">
                <MapPin size={10} className="text-emerald-400" /> Base / HAB
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={10} className="text-gelo/60" /> Alvo científico
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert size={10} className="text-marte" /> Zona de risco
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Alvos e leitura */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <h2 className="text-[12px] font-semibold tracking-tight">Alvos no setor</h2>
          <ul className="mt-2.5 divide-y divide-white/5">
            {ALVOS.map((a) => (
              <li key={a.id} className="flex items-center gap-2.5 py-2">
                <span className="font-mono text-[10px] text-gelo/30">{a.id}</span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-gelo/80">
                  {a.nome}
                </span>
                <span className="font-mono text-[10px] tnum text-gelo/40">
                  {a.distanciaKm} km
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-4">
          <h2 className="text-[12px] font-semibold tracking-tight">Como ler este mapa</h2>
          <ol className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-gelo/45">
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
          <p className="mt-3 border-t border-white/8 pt-2.5 text-[10px] leading-relaxed text-gelo/30">
            Posições, zonas e traçados são demonstrativos. O mapa-base é uma imagem real do acervo
            da NASA e não corresponde à região operacional da missão simulada.
          </p>
        </section>
      </div>
    </div>
  )
}
