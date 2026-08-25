import { useState } from 'react'
import SeccionFotos from './components/SeccionFotos.jsx'
import SeccionVideo from './components/SeccionVideo.jsx'

export default function App() {
  const [tab, setTab] = useState('fotos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800">
      <header className="bg-slate-900 text-white px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-3xl">⚖️</span>
          <div>
            <h1 className="text-xl font-bold">Asistente Judicial</h1>
            <p className="text-xs text-slate-300">
              Sube tus fotos/video + tu formato Word → escanea → obtén el Word llenado
            </p>
          </div>
        </div>
      </header>

      {/* Pestañas: secciones totalmente separadas */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setTab('fotos')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${
              tab === 'fotos' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            📸 Fotos
          </button>
          <button
            onClick={() => setTab('video')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${
              tab === 'video' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            🎥 Video
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 pt-4 space-y-6">
        {tab === 'fotos' ? <SeccionFotos /> : <SeccionVideo />}
      </main>

      <footer className="text-center text-xs text-slate-400 pb-6">
        Cada sección: sube tu material + sube TU formato Word → ESCANEAR → Ver Word
      </footer>
    </div>
  )
}
