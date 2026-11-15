import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { VisaoGeral } from './pages/VisaoGeral'
import { Mapa } from './pages/Mapa'
import { Condicoes } from './pages/Condicoes'
import { Rotas } from './pages/Rotas'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <VisaoGeral /> },
      { path: 'mapa', element: <Mapa /> },
      { path: 'condicoes', element: <Condicoes /> },
      { path: 'rotas', element: <Rotas /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
