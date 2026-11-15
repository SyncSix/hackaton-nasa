import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { PROTOCOLOS } from '../lib/protocolos'
import { EQUIPAMENTOS } from '../lib/equipamentos'
import { PRIORIDADES } from '../lib/prioridades'
import { t } from '../lib/i18n'

type Resultado = {
  id: string
  titulo: string
  tipo: 'Protocolo' | 'Equipamento' | 'Risco' | 'Tela'
  para: string
  detalhe: string
}

const TELAS: Resultado[] = [
  { id: 't-home', titulo: t("Centro de Missão"), tipo: "Tela", para: '/', detalhe: "Alarmes, guia e recursos" },
  { id: 't-sist', titulo: t("Sistemas Vitais"), tipo: "Tela", para: '/sistemas', detalhe: "PLSS, atmosfera, abrigo, frio, contaminação" },
  { id: 't-eva', titulo: t("Checklist de EVA"), tipo: "Tela", para: '/eva', detalhe: "Verificação antes, durante e depois" },
  { id: 't-rotas', titulo: t("Rotas"), tipo: "Tela", para: '/rotas', detalhe: "Waypoints, limites e desvios" },
  { id: 't-mapa', titulo: t("Exploração"), tipo: "Tela", para: '/mapa', detalhe: "Mapa de Jezero e camadas" },
  { id: 't-dec', titulo: t("Decisões"), tipo: "Tela", para: '/decisoes', detalhe: t("Registro de decisões autônomas") },
  { id: 't-sim', titulo: t("Simulador"), tipo: "Tela", para: '/simulador', detalhe: "Cenários de treino" },
  { id: 't-man', titulo: t("Manual"), tipo: "Tela", para: '/manual', detalhe: "Como usar o sistema, tela por tela" },
]

/**
 * Busca rápida (Ctrl+K).
 *
 * Com 11 telas, achar o protocolo certo sob pressão não pode depender de
 * navegar menus. Um comando único encontra protocolo, equipamento, risco ou tela.
 */
export function BuscaRapida() {
  const [aberto, setAberto] = useState(false)
  const [termo, setTermo] = useState('')
  const [indice, setIndice] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const todos = useMemo<Resultado[]>(
    () => [
      ...PROTOCOLOS.map((p) => ({
        id: p.id,
        titulo: `${p.id} · ${p.titulo}`,
        tipo: "Protocolo" as const,
        para: `/protocolos/${p.id}`,
        detalhe: p.sistema,
      })),
      ...Object.values(EQUIPAMENTOS).map((e) => ({
        id: `eq-${e.id}`,
        titulo: `${e.nome} — ${e.completo ?? e.nome}`,
        tipo: "Equipamento" as const,
        para: '/equipamentos',
        detalhe: e.mede,
      })),
      ...PRIORIDADES.map((p) => ({
        id: `pr-${p.id}`,
        titulo: p.nome,
        tipo: "Risco" as const,
        para: '/sobrevivencia',
        detalhe: p.tempoCritico,
      })),
      ...TELAS,
    ],
    [],
  )

  const filtrados = useMemo(() => {
    const t = termo.trim().toLowerCase()
    if (!t) return todos.slice(0, 8)
    return todos
      .filter(
        (r) =>
          r.titulo.toLowerCase().includes(t) ||
          r.detalhe.toLowerCase().includes(t) ||
          r.tipo.toLowerCase().includes(t),
      )
      .slice(0, 10)
  }, [termo, todos])

  // Atalho Ctrl+K / Cmd+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAberto((a) => !a)
        setTermo('')
        setIndice(0)
      }
      if (e.key === 'Escape') setAberto(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (aberto) inputRef.current?.focus()
  }, [aberto])

  function ir(r: Resultado) {
    navigate(r.para)
    setAberto(false)
    setTermo('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndice((i) => Math.min(i + 1, filtrados.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndice((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtrados[indice]) {
      e.preventDefault()
      ir(filtrados[indice])
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 rounded border border-white/12 bg-black/25 px-2.5 py-1.5 text-[11px] text-gelo/65 transition-colors hover:border-white/25 hover:text-gelo/90"
        aria-label={t("Buscar (Ctrl+K)")}
      >
        <Search size={11} />
        <span className="hidden sm:inline">{t("Buscar")}</span>
        <kbd className="hidden rounded border border-white/15 px-1 font-mono text-[9.5px] text-gelo/55 sm:inline">
          {"Ctrl K"}
        </kbd>
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setAberto(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("Busca rápida")}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/15 bg-grafite shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
              <Search size={14} className="shrink-0 text-gelo/55" />
              <input
                ref={inputRef}
                value={termo}
                onChange={(e) => {
                  setTermo(e.target.value)
                  setIndice(0)
                }}
                onKeyDown={onKeyDown}
                placeholder={t("Protocolo, equipamento, risco ou tela…")}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-gelo/95 outline-none placeholder:text-gelo/45"
                aria-label={t("Termo de busca")}
              />
              <button
                onClick={() => setAberto(false)}
                className="shrink-0 text-gelo/55 transition-colors hover:text-gelo/90"
                aria-label={t("Fechar busca")}
              >
                <X size={14} />
              </button>
            </div>

            <ul className="max-h-[50vh] overflow-y-auto">
              {filtrados.length === 0 && (
                <li className="px-3.5 py-6 text-center text-[12px] text-gelo/55">
                  {t("Nada encontrado para \"")}{termo}".
                </li>
              )}
              {filtrados.map((r, i) => (
                <li key={r.id}>
                  <button
                    onClick={() => ir(r)}
                    onMouseEnter={() => setIndice(i)}
                    className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                      i === indice ? 'bg-marte/12' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="w-20 shrink-0 text-[9.5px] uppercase tracking-wider text-gelo/55">
                      {r.tipo}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-gelo/90">{r.titulo}</span>
                      <span className="block truncate text-[10.5px] text-gelo/55">{r.detalhe}</span>
                    </span>
                    <ArrowRight size={11} className="shrink-0 text-gelo/40" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 border-t border-white/10 px-3.5 py-1.5 text-[10px] text-gelo/50">
              <span>{t("↑↓ navegar")}</span>
              <span>{t("↵ abrir")}</span>
              <span>{t("esc fechar")}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
