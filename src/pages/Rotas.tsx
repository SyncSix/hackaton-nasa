import { useMemo, useState } from 'react'
import { AlertTriangle, Check, Clock, Eye, EyeOff, MapPin, Mountain, Route as RouteIcon, ShieldAlert, Sparkles } from 'lucide-react'
import { ALVOS, ROTAS } from '../lib/mission'
import { autonomiaEva, limiteCaminhada } from '../lib/traje'
import { ESTADO_SOLAR } from '../lib/abrigo'
import { t } from '../lib/i18n'

type Prioridade = 'tempo' | 'recursos' | 'ciencia'

const PRIORIDADES: Array<{ id: Prioridade; rotulo: string; descricao: string }> = [
  { id: 'tempo', rotulo: t("Menor duração"), descricao: t("Voltar mais rápido ao habitat") },
  { id: 'recursos', rotulo: t("Menor consumo"), descricao: t("Economizar oxigênio") },
  { id: 'ciencia', rotulo: t("Maior valor científico"), descricao: t("Visitar mais alvos") },
]

const VALOR_CIENTIFICO: Record<string, number> = { R1: 3, R2: 2 }
const VALOR_CIENTIFICO_ROTULO: Record<string, string> = { R1: t("Alto"), R2: t("Médio") }

const RISCO = {
  baixo: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  moderado: "text-alerta bg-alerta/10 border-alerta/25",
  alto: "text-critico bg-critico/10 border-critico/25",
}

function minutos(duracao: string): number {
  const h = /(\d+)\s*h/.exec(duracao)
  const m = /(\d+)\s*min/.exec(duracao)
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
}

export function Rotas() {
  const [prioridade, setPrioridade] = useState<Prioridade>('recursos')
  const [selecionada, setSelecionada] = useState("R2")

  const recomendada = useMemo(() => {
    const pontuar = (id: string) => {
      const r = ROTAS.find((x) => x.id === id)!
      if (prioridade === 'tempo') return -minutos(r.duracao)
      if (prioridade === 'recursos') return -r.o2Necessario
      return VALOR_CIENTIFICO[r.id] ?? 0
    }
    return [...ROTAS].sort((a, b) => pontuar(b.id) - pontuar(a.id))[0].id
  }, [prioridade])

  const rota = ROTAS.find((r) => r.id === selecionada) ?? ROTAS[0]
  const { horas: horasEva } = autonomiaEva()
  const limiteKm = limiteCaminhada(horasEva)
  const waypointsSemVisao = rota.waypoints.filter((w) => !w.linhaVisao).length

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <header>
        <div className="label-micro">{t("Planejamento de deslocamento")}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t("Rotas")}</h1>
        <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-gelo/65">
          {t("Compare trajetos por distância, duração, inclinação, consumo de oxigênio e valor científico. A rota mais curta não é necessariamente a mais segura.")}
        </p>
      </header>

      <section className="card-glass p-4">
        <div className="label-micro mb-2.5">{t("O que importa nesta saída")}</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRIORIDADES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPrioridade(p.id)}
              className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                prioridade === p.id
                  ? "border-critico/50 bg-marte/8"
                  : "border-white/8 bg-black/20 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full border ${
                    prioridade === p.id ? "border-marte bg-marte" : 'border-white/25'
                  }`}
                />
                <span className="text-[11.5px] font-medium text-gelo/85">{p.rotulo}</span>
              </div>
              <div className="ml-4 text-[11px] text-gelo/55">{p.descricao}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card-glass overflow-hidden">
        <div className="border-b border-white/8 px-4 py-3">
          <h2 className="text-[13px] font-semibold tracking-tight">{t("Comparação multicritério")}</h2>
          <p className="text-[11.5px] text-gelo/55">{t("Valores ilustrativos do protótipo")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-white/8 text-[11.5px] uppercase tracking-wider text-gelo/70">
                <th className="px-4 py-2 font-medium">{t("Critério")}</th>
                {ROTAS.map((r) => (
                  <th key={r.id} className="px-4 py-2 text-right font-medium">
                    <span className="flex items-center justify-end gap-1.5">
                      {r.id === recomendada && <Sparkles size={10} className="text-critico" />}
                      {r.nome}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11.5px]">
              <Linha rotulo={t("Distância")} valores={ROTAS.map((r) => `${r.distanciaKm} km`)} />
              <Linha rotulo={t("Duração")} valores={ROTAS.map((r) => r.duracao)} />
              <Linha rotulo={t("Inclinação máxima")} valores={ROTAS.map((r) => `${r.inclinacaoMax}°`)} />
              <Linha rotulo={t("Consumo de O₂")} valores={ROTAS.map((r) => `${r.o2Necessario}%`)} />
              <Linha
                rotulo={t("Valor científico")}
                valores={ROTAS.map((r) => VALOR_CIENTIFICO_ROTULO[r.id] ?? '—')}
              />
              <tr>
                <td className="px-4 py-2.5 text-gelo/65">{t("Risco")}</td>
                {ROTAS.map((r) => (
                  <td key={r.id} className="px-4 py-2.5 text-right">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[11.5px] uppercase tracking-wider ${RISCO[r.risco]}`}
                    >
                      {r.risco}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/8 bg-black/20 px-4 py-2.5">
          <p className="text-[11.5px] text-gelo/65">
            <span className="text-critico">{t("Recomendação:")}</span>{' '}
            {ROTAS.find((r) => r.id === recomendada)?.nome} {t("— melhor resultado para")}{' '}
            {PRIORIDADES.find((p) => p.id === prioridade)?.rotulo.toLowerCase()}.
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="space-y-2.5 lg:col-span-2">
          {ROTAS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelecionada(r.id)}
              className={`card-glass w-full p-4 text-left transition-colors ${
                r.id === selecionada
                  ? "border-critico/50 bg-marte/5"
                  : "hover:border-white/15 hover:bg-titanio"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-gelo/70">{r.id}</span>
                    <span className="truncate text-[12.5px] font-medium">{r.nome}</span>
                    {r.id === recomendada && (
                      <span className="shrink-0 rounded bg-critico/15 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-critico">
                        {t("recomendada")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gelo/60">{r.descricao}</p>
                </div>
                {r.id === selecionada && <Check size={14} className="shrink-0 text-critico" />}
              </div>
              <div className="mt-2.5 flex items-center gap-4 text-[11px] text-gelo/70">
                <span className="flex items-center gap-1">
                  <RouteIcon size={11} /> {r.distanciaKm} {t("km")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {r.duracao}
                </span>
                <span className="flex items-center gap-1">
                  <Mountain size={11} /> {r.inclinacaoMax}°
                </span>
              </div>
            </button>
          ))}
        </section>

        <section className="card-glass p-5 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-micro">{t("Rota selecionada")}</div>
              <h2 className="mt-1 text-[15px] font-semibold tracking-tight">{rota.nome}</h2>
            </div>
            <span
              className={`rounded border px-2 py-0.5 text-[11.5px] uppercase tracking-wider ${RISCO[rota.risco]}`}
            >
              {t("risco")} {rota.risco}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Dado rotulo={t("Distância")} valor={`${rota.distanciaKm} km`} />
            <Dado rotulo={t("Duração")} valor={rota.duracao} />
            <Dado rotulo={t("Inclinação")} valor={`${rota.inclinacaoMax}°`} />
            <Dado rotulo={t("O₂")} valor={`${rota.o2Necessario}%`} />
          </div>

          <div className="mt-4">
            <div className="label-micro mb-2">{t("Perfil de inclinação")}</div>
            <div className="flex h-24 items-end gap-0.5 rounded border border-white/6 bg-black/20 p-2">
              {PERFIL[rota.id]?.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${
                    h > 20 ? 'bg-critico/70' : h > 12 ? 'bg-alerta/60' : 'bg-emerald-400/40'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-gelo/70">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400/60" /> {t("&lt; 12°")}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-alerta/70" /> 12–20°
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-critico/80" /> {t("&gt; 20°")}
              </span>
              <span className="ml-auto">{t("Limite operacional: 30°")}</span>
            </div>
          </div>

          {rota.inclinacaoMax > 20 && (
            <div className="mt-3 flex items-start gap-2 rounded border border-alerta/25 bg-alerta/5 p-2.5">
              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
              <p className="text-[11.5px] leading-relaxed text-alerta/90">
                {t("Encosta acima de 20° exige redução de velocidade e avaliação do terreno por imagem.")}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Segurança da rota */}
      <section className="card-glass p-4">
        <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">{t("Segurança da rota")}</h2>
            <p className="text-[11px] text-gelo/65">
              {t("Limites que definem até onde esta rota pode ir com segurança")}
            </p>
          </div>
          <span className="text-[11.5px] text-gelo/65">{t("rota")} {rota.id}</span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Limite
            icone={<RouteIcon size={13} />}
            rotulo={t("Raio máximo")}
            valor={`${rota.raioMaxKm} km`}
            detalhe={t("distância do habitat")}
            ok={rota.raioMaxKm <= limiteKm}
          />
          <Limite
            icone={<ShieldAlert size={13} />}
            rotulo={t("Abrigo mais próximo")}
            valor={`${rota.tempoAbrigoMin} min`}
            detalhe={rota.abrigoMaisProximo}
            ok={rota.tempoAbrigoMin <= ESTADO_SOLAR.tempoAtePicoMin - 15}
          />
          <Limite
            icone={<Clock size={13} />}
            rotulo={t("Autonomia do traje")}
            valor={`${horasEva.toFixed(1)} h`}
            detalhe={`walkback ${limiteKm.toFixed(1)} km`}
            ok={rota.distanciaKm / 2 <= limiteKm}
          />
          <Limite
            icone={<Eye size={13} />}
            rotulo={t("Linha de visão")}
            valor={`${waypointsSemVisao} trecho(s)`}
            detalhe={t("sem contato direto")}
            ok={waypointsSemVisao === 0}
          />
        </div>

        {/* Waypoints */}
        <div className="mt-4">
          <div className="label-micro mb-2">{t("Pontos de passagem")}</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {rota.waypoints.map((w, i) => (
              <div key={`${w.id}-${i}`} className="flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-1.5 rounded border px-2 py-1 ${
                    w.tipo === 'base'
                      ? "border-nominal/40 bg-nominal/8"
                      : w.tipo === 'alvo'
                        ? "border-marte/40 bg-marte/8"
                        : w.terrenoDuvidoso
                          ? "border-alerta/40 bg-alerta/8"
                          : "border-white/12 bg-black/25"
                  }`}
                  title={`${w.nome} · ${w.kmBase} km da base${w.linhaVisao ? '' : t(' · sem linha de visão')}`}
                >
                  <MapPin
                    size={9}
                    className={
                      w.tipo === 'base'
                        ? 'text-nominal'
                        : w.tipo === 'alvo'
                          ? 'text-marte'
                          : w.terrenoDuvidoso
                            ? 'text-alerta'
                            : 'text-gelo/65'
                    }
                  />
                  <span className="text-[11.5px] text-gelo/80">{w.nome}</span>
                  {!w.linhaVisao && <EyeOff size={9} className="text-alerta" />}
                </div>
                {i < rota.waypoints.length - 1 && (
                  <span className="text-[11px] text-gelo/25">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rota alternativa */}
        {rota.alternativa && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-alerta/30 bg-alerta/5 p-3">
            <AlertTriangle size={12} className="mt-0.5 shrink-0 text-alerta" />
            <div>
              <div className="text-[11px] font-medium text-alerta">{t("Desvio programado")}</div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gelo/65">{rota.alternativa}</p>
            </div>
          </div>
        )}

        {waypointsSemVisao > 0 && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-critico/30 bg-critico/5 p-3">
            <EyeOff size={12} className="mt-0.5 shrink-0 text-critico" />
            <p className="text-[11px] leading-relaxed text-gelo/65">
              <span className="text-critico">{t("Sem linha de visão com o habitat")}</span> {t("em")}{' '}
              {waypointsSemVisao} {t("trecho(s). A comunicação depende de repetidor. Se o repetidor falhar, a equipe fica incomunicável.")}
            </p>
          </div>
        )}
      </section>

      <section className="card-glass p-4">
        <h2 className="text-[13px] font-semibold tracking-tight">{t("Alvos científicos")}</h2>
        <p className="text-[11.5px] text-gelo/55">
          {t("Proximidade de um alvo não implica acesso seguro.")}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-white/8 text-[11.5px] uppercase tracking-wider text-gelo/70">
                <th className="pb-2 font-medium">{t("ID")}</th>
                <th className="pb-2 font-medium">{t("Alvo")}</th>
                <th className="pb-2 font-medium">{t("Tipo")}</th>
                <th className="pb-2 text-right font-medium">{t("Distância")}</th>
                <th className="pb-2 text-right font-medium">{t("Prioridade")}</th>
                <th className="pb-2 text-right font-medium">{t("Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALVOS.map((a) => (
                <tr key={a.id}>
                  <td className="py-2 font-mono text-[11px] text-gelo/70">{a.id}</td>
                  <td className="py-2 text-gelo/85">{a.nome}</td>
                  <td className="py-2 text-gelo/60">{a.tipo}</td>
                  <td className="py-2 text-right font-mono tnum text-gelo/55">
                    {a.distanciaKm} {t("km")}
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={
                        a.prioridade === 'alta'
                          ? 'text-critico'
                          : a.prioridade === 'média'
                            ? 'text-alerta'
                            : 'text-gelo/55'
                      }
                    >
                      {t(a.prioridade)}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <span className={a.status === 'acessível' ? 'text-emerald-400' : 'text-gelo/70'}>
                      {t(a.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Linha({ rotulo, valores }: { rotulo: string; valores: string[] }) {
  return (
    <tr>
      <td className="px-4 py-2.5 text-gelo/65">{rotulo}</td>
      {valores.map((v, i) => (
        <td key={i} className="px-4 py-2.5 text-right font-mono tnum text-gelo/80">
          {v}
        </td>
      ))}
    </tr>
  )
}

function Limite({
  icone,
  rotulo,
  valor,
  detalhe,
  ok,
}: {
  icone: React.ReactNode
  rotulo: string
  valor: string
  detalhe: string
  ok: boolean
}) {
  return (
    <div
      className={`rounded-lg border bg-black/25 p-2.5 ${
        ok ? 'border-nominal/30' : 'border-critico/40'
      }`}
    >
      <div className="flex items-center gap-1.5 text-gelo/65">
        {icone}
        <span className="text-[11.5px] uppercase tracking-wider">{rotulo}</span>
      </div>
      <div className={`mt-0.5 font-mono text-[14px] tnum ${ok ? 'text-gelo/90' : 'text-critico'}`}>
        {valor}
      </div>
      <div className="truncate text-[11.5px] text-gelo/65">{detalhe}</div>
    </div>
  )
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded border border-white/6 bg-black/20 p-2.5">
      <div className="text-[11.5px] uppercase tracking-wider text-gelo/70">{rotulo}</div>
      <div className="mt-0.5 font-mono text-[14px] tnum">{valor}</div>
    </div>
  )
}

const PERFIL: Record<string, number[]> = {
  R1: [8, 12, 18, 26, 34, 42, 50, 58, 62, 55, 46, 38, 30, 26, 34, 44, 52, 46, 36, 28, 20, 14, 10],
  R2: [6, 8, 9, 10, 12, 11, 9, 8, 10, 13, 11, 9, 7, 8, 10, 9, 7, 6, 8, 7, 6, 5, 5],
}
