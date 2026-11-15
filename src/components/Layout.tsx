import { NavLink, Outlet } from 'react-router-dom'
import { StatusBar } from './StatusBar'

import { Logo } from './Logo'
import { BuscaRapida } from './BuscaRapida'
import { SeletorIdioma } from './SeletorIdioma'
import { derivarAlarmes, resumoAlarmes } from '../lib/alarmes'
import { t, tt } from '../lib/i18n'

const NAV = [
  { to: '/', label: t("Centro de Missão"), end: true },
  { to: '/sobrevivencia', label: t("Sobrevivência") },
  { to: '/mapa', label: t("Exploração") },
  { to: '/rotas', label: t("Rotas") },
  { to: '/protocolos', label: t("Protocolos") },
  { to: '/eva', label: "EVA" },
  { to: '/simulador', label: t("Simulador") },
  { to: '/sistemas', label: t("Sistemas Vitais") },
  { to: '/decisoes', label: t("Decisões") },
  { to: '/equipamentos', label: t("Equipamentos") },
  { to: '/manual', label: t("Manual") },
]

export function Layout() {
  // O indicador do cabeçalho deriva do estado real dos riscos,
  // para não contradizer o painel.
  const alarmes = derivarAlarmes()
  const resumo = resumoAlarmes(alarmes)
  const criticos = resumo.criticos
  const atencao = resumo.atencao

  const global =
    criticos > 0
      ? { texto: tt(criticos === 1 ? "{n} alerta crítico" : "{n} alertas críticos", { n: criticos }), cor: 'text-critico', borda: 'border-critico/30', bg: 'bg-critico/10', ponto: 'bg-critico' }
      : atencao > 0
        ? { texto: tt("{n} em atenção", { n: atencao }), cor: 'text-alerta', borda: 'border-alerta/30', bg: 'bg-alerta/10', ponto: 'bg-alerta' }
        : { texto: t("Sistemas nominais"), cor: 'text-nominal', borda: 'border-nominal/30', bg: 'bg-nominal/10', ponto: 'bg-nominal' }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-space">
      <a href="#conteudo" className="skip-link">
        {t("Pular para o conteúdo")}
      </a>
      <header className="sticky top-0 z-30 border-b border-white/8 bg-grafite/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2.5">
          <NavLink to="/" className="shrink-0" aria-label="S6 Mars · início">
            <Logo />
          </NavLink>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <BuscaRapida />
            <SeletorIdioma />
          </div>

          <NavLink
            to="/sobrevivencia"
            className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 ${global.borda} ${global.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${global.ponto}`} />
            <span className={`text-[11px] uppercase tracking-wider ${global.cor}`}>
              {global.texto}
            </span>
          </NavLink>
        </div>

        {/* Navegação em faixa própria: 12 destinos não cabem ao lado do logo.
            Rola na horizontal em telas estreitas, sem esconder nenhum destino. */}
        <nav
          className="flex items-center gap-0.5 overflow-x-auto border-t border-white/6 px-4 py-1.5"
          aria-label={t("Navegação principal")}
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "shrink-0 rounded-md px-2.5 py-1.5 text-[11.5px] transition-all",
                  isActive
                    ? "bg-marte/15 text-marte"
                    : "text-gelo/70 hover:bg-white/5 hover:text-gelo/85",
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <StatusBar />
      </header>

      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 text-[11px] text-gelo/65 sm:flex-row">
          <p>{t("© 2026 Mars Survival Guide · NASA Space Apps Challenge")}</p>
          <p>
            {t("Dados científicos: NASA PDS · NASA Open APIs ·")}{' '}
            <span className="text-gelo/60">{t("protótipo demonstrativo")}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
