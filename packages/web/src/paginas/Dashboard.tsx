import { useNavigate } from 'react-router-dom'
import { usarSessao } from '../store/sessao'

export default function Dashboard() {
  const usuario = usarSessao((e) => e.usuario)
  const sair = usarSessao((e) => e.sair)
  const navegar = useNavigate()

  function trocarUsuario() {
    sair()
    navegar('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#070C1E]">
      {/* Header */}
      <header className="bg-[#070C1E] text-white">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 bg-[#F0B400] rounded-full" />
            <span className="font-bold">Trajetórias 2.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Olá, <strong>{usuario?.nome}</strong>
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">{usuario?.perfil}</span>
            </span>
            <button
              onClick={trocarUsuario}
              className="text-sm rounded-lg border border-white/20 px-3 py-1.5 hover:bg-white/10 transition"
            >
              Trocar usuário
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Minhas trajetórias</h1>
        <p className="text-gray-500 mb-8">Bem-vindo(a), {usuario?.nome}. Sua jornada começa aqui.</p>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          Em construção — aderir a trajetórias, autoavaliar comportamentos e consultar sua posição
          chegam nas próximas entregas.
        </div>
      </main>
    </div>
  )
}
