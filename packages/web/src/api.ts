const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://api-trajetorias2.parolin.net'

/** Cliente HTTP simples com Authorization automático. */
export async function api(caminho: string, opcoes: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const resp = await fetch(`${BASE}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  })
  const dados = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    throw new Error(dados.erro ?? 'Falha na comunicação com o servidor.')
  }
  return dados
}
