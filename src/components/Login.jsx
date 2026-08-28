import { useState } from 'react'

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
    setTimeout(() => {
      if (user.trim() === USUARIO && pass === CLAVE) {
        localStorage.setItem('aj_token', btoa(`${USUARIO}:${Date.now()}`))
        onLogin()
      } else {
        setError('🌸 Usuario o clave incorrectos. Revisa tus datos.')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-aurora flex items-center justify-center px-4 relative overflow-hidden">
      {/* burbujas decorativas */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-fuchsia-300/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm animate-float">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-4xl shadow-xl shadow-rose-200/60 mb-4 animate-pop">
            ⚖️
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
            Asistente Judicial
          </h1>
          <p className="text-sm text-slate-400 mt-1">Tu asistente inteligente de sentencias</p>
        </div>

        <form onSubmit={entrar} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-100/60 border border-white/70 p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1">Usuario</label>
            <input value={user} onChange={e => setUser(e.target.value)}
              className="w-full mt-1.5 bg-white/80 border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition shadow-inner"
              placeholder="tu usuario" autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1">Clave</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="w-full mt-1.5 bg-white/80 border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition shadow-inner"
              placeholder="••••••" />
          </div>

          {error && (
            <div className="animate-float text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-center">
              {error}
            </div>
          )}

          <button disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-rose-200/50">
            {loading ? (
              <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" /> Entrando…</span>
            ) : 'Entrar 💗'}
          </button>

          <p className="text-center text-xs text-slate-300 pt-1">
            💡 Indicio de clave: <span className="font-medium text-rose-400">chinita</span>
          </p>
        </form>
      </div>
    </div>
  )
}
