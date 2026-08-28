import { useState } from 'react'
import SeccionFotos from './components/SeccionFotos.jsx'
import SeccionVideo from './components/SeccionVideo.jsx'

// Color tokens femeninos y elegantes
const S = {
  navActive: 'bg-rose-500 text-white shadow',
  navIdle: 'text-slate-500 hover:bg-rose-50',
  fotos: 'from-rose-500 to-pink-500',
  video: 'from-fuchsia-500 to-purple-500',
  formato: 'border-amber-300 bg-amber-50/60',
}

export default function App({ onLogout }) {
  const [tab, setTab] = useState('fotos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 text-slate-800">
      <header className="bg-white/70 backdrop-blur border-b border-rose-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                Asistente Judicial
              </h1>
              <p className="text-[11px] text-slate-400">
                Fotos/video + tu formato → sentencia limpia con IA
              </p>
            </div>
          </div>
          <button onClick={onLogout}
            className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition">
            ⏻ Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex gap-2 bg-white/80 backdrop-blur p-1.5 rounded-2xl shadow-sm border border-rose-100 w-fit">
          <button onClick={() => setTab('fotos')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${tab === 'fotos' ? S.navActive : S.navIdle}`}>
            🌷 Fotos
          </button>
          <button onClick={() => setTab('video')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${tab === 'video' ? 'bg-fuchsia-500 text-white shadow' : S.navIdle}`}>
            🎬 Video
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 pt-4 space-y-6">
        {tab === 'fotos' ? <SeccionFotos /> : <SeccionVideo />}
      </main>

      <footer className="text-center text-xs text-slate-400 pb-8">
        Hecho con 💗 para la asistente judicial · IA: Gemini
      </footer>
    </div>
  )
}
