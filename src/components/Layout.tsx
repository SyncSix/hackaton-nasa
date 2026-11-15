import { NavLink, Outlet } from 'react-router-dom'
import { StatusBar } from './StatusBar'
import { RIDGE } from '../lib/ridge'
import { Logo } from './Logo'

const NAV = [
  { to: '/', label: 'Centro de Missão', end: true },
  { to: '/sobrevivencia', label: 'Sobrevivência' },
  { to: '/mapa', label: 'Exploração' },
  { to: '/rotas', label: 'Rotas' },
  { to: '/protocolos', label: 'Protocolos' },
  { to: '/eva', label: 'EVA' },
  { to: '/simulador', label: 'Simulador' },
  { to: '/sistemas', label: 'Sistemas Vitais' },
  { to: '/equipamentos', label: 'Equipamentos' },
  { to: '/ciencia', label: 'Base Científica' },
]

export function Layout() {
  // O indicador do cabeçalho deriva do estado real dos riscos,
  // para não contradizer o painel.
  const criticos = RIDGE.filter((r) => r.estado === 'critico').length
  const atencao = RIDGE.filter((r) => r.estado === 'atencao').length

  const global =
    criticos > 0
      ? { texto: `${criticos} ${criticos === 1 ? 'alerta crítico' : 'alertas críticos'}`, cor: 'text-critico', borda: 'border-critico/30', bg: 'bg-critico/10', ponto: 'bg-critico' }
      : atencao > 0
        ? { texto: `${atencao} em atenção`, cor: 'text-alerta', borda: 'border-alerta/30', bg: 'bg-alerta/10', ponto: 'bg-alerta' }
        : { texto: 'Sistemas nominais', cor: 'text-emerald-300/90', borda: 'border-emerald-400/25', bg: 'bg-emerald-400/8', ponto: 'bg-emerald-400' }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-space">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-grafite/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2.5">
          <NavLink to="/" className="shrink-0" aria-label="S6 Marte · início">
            <Logo />
          </NavLink>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-md px-2.5 py-1.5 text-[11.5px] transition-all',
                    isActive
                      ? 'bg-marte/15 text-marte'
                      : 'text-gelo/70 hover:bg-white/5 hover:text-gelo/85',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/sobrevivencia"
            className={`ml-auto flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 ${global.borda} ${global.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${global.ponto}`} />
            <span className={`text-[11px] uppercase tracking-wider ${global.cor}`}>
              {global.texto}
            </span>
          </NavLink>
        </div>

        {/* Navegação em telas estreitas: rolagem horizontal, sem esconder destinos */}
        <nav className="flex items-center gap-0.5 overflow-x-auto border-t border-white/6 px-4 py-1.5 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'shrink-0 rounded-md px-2.5 py-1 text-[11.5px] transition-all',
                  isActive
                    ? 'bg-marte/15 text-marte'
                    : 'text-gelo/70 hover:bg-white/5 hover:text-gelo/85',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <StatusBar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 text-[11px] text-gelo/65 sm:flex-row">
          <p>© 2026 Mars Survival Guide · NASA Space Apps Challenge</p>
          <p>
            Dados científicos: NASA PDS · NASA Open APIs ·{' '}
            <span className="text-gelo/60">protótipo demonstrativo</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
