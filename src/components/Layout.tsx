import { NavLink, Outlet } from 'react-router-dom'
import { StatusBar } from './StatusBar'
import { RIDGE } from '../lib/ridge'

const NAV = [
  { to: '/', label: 'Centro de Missão', end: true },
  { to: '/sobrevivencia', label: 'Sobrevivência' },
  { to: '/mapa', label: 'Exploração' },
  { to: '/rotas', label: 'Rotas' },
  { to: '/protocolos', label: 'Protocolos' },
  { to: '/eva', label: 'EVA' },
  { to: '/simulador', label: 'Simulador' },
  { to: '/ciencia', label: 'Base Científica' },
]

export function Layout() {
  // O indicador do cabeçalho deriva do estado real dos riscos,
  // para não contradizer o painel.
  const criticos = RIDGE.filter((r) => r.estado === 'critico').length
  const atencao = RIDGE.filter((r) => r.estado === 'atencao').length

  const global =
    criticos > 0
      ? { texto: `${criticos} ${criticos === 1 ? 'alerta crítico' : 'alertas críticos'}`, cor: 'text-marte', borda: 'border-marte/30', bg: 'bg-marte/10', ponto: 'bg-marte' }
      : atencao > 0
        ? { texto: `${atencao} em atenção`, cor: 'text-alerta', borda: 'border-alerta/30', bg: 'bg-alerta/10', ponto: 'bg-alerta' }
        : { texto: 'Sistemas nominais', cor: 'text-emerald-300/90', borda: 'border-emerald-400/25', bg: 'bg-emerald-400/8', ponto: 'bg-emerald-400' }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-space">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-grafite/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2.5">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-accent shadow-glow">
              <span className="font-mono text-[13px] font-bold text-grafite">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold tracking-tight">
                Mars // Mission Control
              </div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-gelo/35">
                Guia de Sobrevivência
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-0.5 lg:flex">
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
                      : 'text-gelo/50 hover:bg-white/5 hover:text-gelo/85',
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
            <span className={`text-[9.5px] uppercase tracking-wider ${global.cor}`}>
              {global.texto}
            </span>
          </NavLink>
        </div>

        <StatusBar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 text-[10px] text-gelo/25 sm:flex-row">
          <p>© 2026 Mars Survival Guide · NASA Space Apps Challenge</p>
          <p>
            Dados científicos: NASA PDS · NASA Open APIs ·{' '}
            <span className="text-gelo/40">protótipo demonstrativo</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
