import { useState } from 'react'

// Login validado en el cliente contra variables de entorno (sin base de datos).
// Nota: para una sola usuaria esto es suficiente; la clave vive en VITE_ (ya expuesta
// como la API de Gemini). Si crece a varios clientes, migrar a Supabase Auth.
const USUARIO = import.meta.env.VITE_APP_USER || 'llelsitapreciosa02'
const CLAVE = import.meta.env.VITE_APP_PASS || '020526'

export default function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const entrar = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // pequeña simulación de red para UX
    setTimeout(() => {
      if (user === USUARIO && pass === CLAVE) {
        localStorage.setItem('aj_token', btoa(`${USUARIO}:${Date.now()}`))
        onLogin()
      } else {
        setError('Usuario o clave incorrectos 🌸')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-fuchsia-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-white text-3xl shadow-lg mb-3">
            🌸
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
            Asistente Judicial
          </h1>
          <p className="text-sm text-slate-400">Ingresa para continuar</p>
        </div>

        <form onSubmit={entrar} className="bg-white rounded-3xl shadow-xl border border-rose-100 p-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Usuario</label>
            <input value={user} onChange={e => setUser(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="tu usuario" autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Clave</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="••••••" />
          </div>

          {error && <p className="text-sm text-rose-500 text-center">{error}</p>}

          <button disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 shadow">
            {loading ? 'Entrando…' : 'Entrar 💗'}
          </button>

          <p className="text-center text-xs text-slate-300 pt-1">
            💡 Indicio de clave: <span className="font-medium text-slate-400">chinita</span>
          </p>
        </form>
      </div>
    </div>
  )
}
