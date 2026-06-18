import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { usarSessao } from '../store/sessao'

interface UsuarioDemo {
  login: string
  nome: string
  perfil: string
}

const corPerfil: Record<string, string> = {
  USUARIO: 'bg-[#006C3A]',
  GESTOR: 'bg-[#1A237E]',
  ADMIN: 'bg-[#F0B400] text-[#070C1E]',
}

export default function Login() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [demo, setDemo] = useState<{ senha: string; usuarios: UsuarioDemo[] } | null>(null)
  const entrar = usarSessao((e) => e.entrar)
  const navegar = useNavigate()

  useEffect(() => {
    api('/usuarios-demo')
      .then(setDemo)
      .catch(() => setDemo(null))
  }, [])

  async function aoEnviar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (!login || !senha) {
      setErro('Informe usuário e senha.')
      return
    }
    setCarregando(true)
    try {
      const { token, usuario } = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ login, senha }),
      })
      entrar(token, usuario)
      navegar('/painel')
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070C1E] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Formulário */}
        <div className="bg-white text-[#070C1E] rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="h-1.5 w-12 bg-[#F0B400] rounded-full mb-4" />
            <h1 className="text-2xl font-bold">Trajetórias 2.0</h1>
            <p className="text-sm text-gray-500">Sistema de trilhas de competências — TCU</p>
          </div>

          <form onSubmit={aoEnviar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="login">
                Usuário TCU
              </label>
              <input
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="ex.: usuario.a"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="demo"
                autoComplete="current-password"
              />
            </div>

            {erro && (
              <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2" role="alert">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-[#1A237E] text-white font-semibold py-2.5 hover:bg-[#283593] transition disabled:opacity-60"
            >
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Painel de demonstração */}
        {demo && (
          <div className="text-white">
            <h2 className="text-lg font-semibold mb-1">Usuários de demonstração</h2>
            <p className="text-sm text-gray-400 mb-4">
              Clique em um usuário para preencher. Senha de todos:{' '}
              <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">{demo.senha}</span>
            </p>
            <ul className="space-y-2">
              {demo.usuarios.map((u) => (
                <li key={u.login}>
                  <button
                    onClick={() => setLogin(u.login)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-left transition"
                  >
                    <span>
                      <span className="font-mono">{u.login}</span>
                      <span className="block text-xs text-gray-400">{u.nome}</span>
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${corPerfil[u.perfil] ?? 'bg-gray-600'}`}>
                      {u.perfil}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
