import { create } from 'zustand'

export interface Usuario {
  id: number
  login: string
  nome: string
  perfil: string
}

interface EstadoSessao {
  token: string | null
  usuario: Usuario | null
  entrar: (token: string, usuario: Usuario) => void
  sair: () => void
}

function lerUsuario(): Usuario | null {
  try {
    return JSON.parse(localStorage.getItem('usuario') ?? 'null')
  } catch {
    return null
  }
}

/** Sessão do usuário, persistida em localStorage (sobrevive a recarregar a página). */
export const usarSessao = create<EstadoSessao>((set) => ({
  token: localStorage.getItem('token'),
  usuario: lerUsuario(),
  entrar: (token, usuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    set({ token, usuario })
  },
  sair: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    set({ token: null, usuario: null })
  },
}))
