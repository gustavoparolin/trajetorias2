import type { JSX } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { usarSessao } from './store/sessao'
import Login from './paginas/Login'
import Dashboard from './paginas/Dashboard'

/** Rota que exige sessão — sem token, redireciona ao login. */
function Protegida({ children }: { children: JSX.Element }) {
  const token = usarSessao((e) => e.token)
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  const token = usarSessao((e) => e.token)
  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/painel" replace /> : <Login />} />
      <Route
        path="/painel"
        element={
          <Protegida>
            <Dashboard />
          </Protegida>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
