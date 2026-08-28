import { useState } from 'react'
import fondo from '../assets/fondo-login.webp'

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
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black"
    >
      {/* foto de estrellas COMPLETA (sin recorte), centrada, fondo negro en los bordes */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondo})`, backgroundColor: '#000' }}
      />
      {/* velo sutil solo en el centro para que el login y el texto se lean sin tapar las estrellas */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative w-full max-w-sm animate-float z-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-xl text-4xl shadow-xl border border-white/30 mb-4 animate-pop">
            ⚖️
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-200 via-white to-fuchsia-200 bg-clip-text text-transparent drop-shadow">
            Asistente Judicial
          </h1>
          <p className="text-sm text-white/70 mt-1 drop-shadow">Tu asistente inteligente de sentencias</p>
        </div>

        <form onSubmit={entrar} className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/25 p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-white/80 ml-1">Usuario</label>
            <input value={user} onChange={e => setUser(e.target.value)}
              className="w-full mt-1.5 bg-white/15 border border-white/25 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-300/70 focus:border-transparent transition shadow-inner"
              placeholder="tu usuario" autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/80 ml-1">Clave</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="w-full mt-1.5 bg-white/15 border border-white/25 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-300/70 focus:border-transparent transition shadow-inner"
              placeholder="••••••" />
          </div>

          {error && (
            <div className="animate-float text-sm text-rose-200 bg-rose-500/20 border border-rose-300/30 rounded-xl px-3 py-2 text-center">
              {error}
            </div>
          )}

          <button disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-rose-900/40">
            {loading ? (
              <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" /> Entrando…</span>
            ) : 'Entrar 💗'}
          </button>

          <p className="text-center text-xs text-white/60 pt-1">
            💡 Indicio de clave: <span className="font-medium text-rose-300">chinita</span>
          </p>
        </form>

        <p className="text-center text-sm text-white/80 mt-6 font-medium tracking-wide drop-shadow">
          Bajo estas estrellas inicio nuestra historia ♥
        </p>
      </div>
    </div>
  )
}
