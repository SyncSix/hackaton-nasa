import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { StatusBar } from './StatusBar'

const NAV = [
  { to: '/', label: 'Início', end: true },
  { to: '/visao-geral', label: 'Visão Geral' },
  { to: '/mapa', label: 'Mapa Marciano' },
  { to: '/condicoes', label: 'Condições' },
  { to: '/rotas', label: 'Rotas' },
]

export function Layout() {
  const { pathname } = useLocation()
  const naHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-gradient-space">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-grafite/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent shadow-glow">
              <span className="font-mono text-[14px] font-bold text-grafite">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight">Mapa Marciano</div>
              <div className="text-[9.5px] uppercase tracking-[0.12em] text-gelo/35">
                Guia de Sobrevivência
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-1.5 text-[12px] transition-all',
                    isActive
                      ? 'bg-marte/15 text-marte'
                      : 'text-gelo/55 hover:bg-white/5 hover:text-gelo/90',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-300/90">
              Sistemas nominais
            </span>
          </div>
        </div>

        {!naHome && <StatusBar />}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-[10.5px] text-gelo/30 sm:flex-row">
          <p>
            © 2026 Mapa Marciano · NASA Space Apps Challenge · Sistema demonstrativo
          </p>
          <p>Dados científicos: NASA PDS e NASA Open APIs</p>
        </div>
      </footer>
    </div>
  )
}
