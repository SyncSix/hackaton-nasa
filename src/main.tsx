import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { CentroMissao } from './pages/CentroMissao'
import { Sobrevivencia } from './pages/Sobrevivencia'
import { Protocolos } from './pages/Protocolos'
import { ProtocoloDetalhe } from './pages/ProtocoloDetalhe'
import { Mapa } from './pages/Mapa'
import { Rotas } from './pages/Rotas'
import { BaseCientifica } from './pages/BaseCientifica'
import { Simulador } from './pages/Simulador'
import { ChecklistEva } from './pages/ChecklistEva'
import { Equipamentos } from './pages/Equipamentos'
import { SistemasVitais } from './pages/SistemasVitais'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CentroMissao /> },
      { path: 'sobrevivencia', element: <Sobrevivencia /> },
      { path: 'protocolos', element: <Protocolos /> },
      { path: 'protocolos/:id', element: <ProtocoloDetalhe /> },
      { path: 'mapa', element: <Mapa /> },
      { path: 'rotas', element: <Rotas /> },
      { path: 'ciencia', element: <BaseCientifica /> },
      { path: 'simulador', element: <Simulador /> },
      { path: 'eva', element: <ChecklistEva /> },
      { path: 'equipamentos', element: <Equipamentos /> },
      { path: 'sistemas', element: <SistemasVitais /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
