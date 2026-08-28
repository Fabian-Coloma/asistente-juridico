import { useState } from 'react'
import SeccionFotos from './components/SeccionFotos.jsx'
import SeccionVideo from './components/SeccionVideo.jsx'

export default function App({ onLogout }) {
  const [tab, setTab] = useState('fotos')

  return (
    <div className="min-h-screen bg-aurora text-slate-800">
      {/* HEADER cristal */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/50 border-b border-white/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center text-xl shadow-lg animate-pulse-ring">
              ⚖️
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                Asistente Judicial
              </h1>
              <p className="text-[11px] text-slate-400 -mt-0.5">IA que llena tus sentencias con elegancia</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="group flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-500 transition px-3 py-1.5 rounded-xl hover:bg-rose-50">
            <span className="transition group-hover:rotate-180 duration-500">⏻</span> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 pt-7">
        {/* TABS tipo píldora flotante */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white/60 backdrop-blur border border-white/70 shadow-md">
          <button onClick={() => setTab('fotos')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              tab === 'fotos'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                : 'text-slate-500 hover:text-rose-500'}`}>
            🌷 Fotos
          </button>
          <button onClick={() => setTab('video')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              tab === 'video'
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-200'
                : 'text-slate-500 hover:text-fuchsia-500'}`}>
            🎬 Video
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-5 pt-5 space-y-6">
        {tab === 'fotos' ? <SeccionFotos /> : <SeccionVideo />}
      </main>

      <footer className="text-center text-xs text-slate-400 pb-10 pt-4">
        <div className="font-medium text-slate-500">Con mucho amor, descansa y estudia mas</div>
        <div className="text-rose-500 font-bold mt-0.5">TE AMO</div>
      </footer>
    </div>
  )
}