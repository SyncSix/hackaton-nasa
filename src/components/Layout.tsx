import { NavLink, Outlet } from 'react-router-dom'
import { StatusBar } from './StatusBar'

const NAV = [
  { to: '/', label: 'Visão Geral', end: true },
  { to: '/mapa', label: 'Mapa Marciano' },
  { to: '/condicoes', label: 'Condições' },
  { to: '/rotas', label: 'Rotas' },
]

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-grafite/95 backdrop-blur">
        <div className="flex items-center gap-6 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-marte">
              <span className="font-mono text-[13px] font-bold text-grafite">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight">Mapa Marciano</div>
              <div className="text-[10px] text-gelo/40">Guia de Sobrevivência Interplanetária</div>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded px-3 py-1.5 text-[12px] transition-colors',
                    isActive
                      ? 'bg-marte/15 text-marte'
                      : 'text-gelo/55 hover:bg-white/5 hover:text-gelo/85',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 rounded border border-white/8 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-gelo/50">Sistemas nominais</span>
          </div>
        </div>

        <StatusBar />
      </header>

      <main className="flex-1 px-5 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 px-5 py-3 text-[10px] text-gelo/30">
        Protótipo demonstrativo · Dados de consumíveis simulados · Contexto científico: NASA PDS e
        NASA Open APIs · NASA Space Apps Challenge 2026
      </footer>
    </div>
  )
}
