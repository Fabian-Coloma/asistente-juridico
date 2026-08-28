import { useState } from 'react'
import SubirFormato from './SubirFormato.jsx'
import VerWord from './VerWord.jsx'

export default function SeccionVideo() {
  const [video, setVideo] = useState(null)
  const [formato, setFormato] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [escaneando, setEscaneando] = useState(false)
  const [error, setError] = useState('')

  const elegir = (file) => { setVideo(file ? { tipo: 'video', file } : null); setResultado(null) }
  const escanear = async () => {
    if (!video || !formato) return
    setEscaneando(true); setError('')
    try {
      const { extraerConIA } = await import('../gemini.js')
      setResultado(await extraerConIA(formato.parrafos, [video]))
    } catch (e) {
      console.error(e)
      setError('🌸 No se pudo escanear: ' + (e?.message || e))
    } finally { setEscaneando(false) }
  }
  const listo = video && formato

  return (
    <section className="space-y-5 animate-float">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-fuchsia-100/50 border border-white/70 p-7 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center text-xl shadow-lg">🎬</div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">Sección Video</h2>
            <p className="text-sm text-slate-400">Video + tu formato → la IA transcribe y llena el Word</p>
          </div>
        </div>

        <label className="group block border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/30 rounded-3xl p-9 text-center cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-300 hover:scale-[1.01] active:scale-95 transition-all duration-200">
          <input type="file" accept="video/*" className="hidden" onChange={e => elegir(e.target.files[0])} />
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">📤</div>
          <p className="font-semibold text-fuchsia-600">Subir video</p>
          <p className="text-xs text-slate-400 mt-1">Entrevista, declaración (máx. recomendado: 15 min)</p>
        </label>

        {video && (
          <video src={URL.createObjectURL(video.file)} controls
            className="w-full max-h-72 rounded-3xl border border-white shadow-md animate-float" />
        )}

        <SubirFormato onFormato={setFormato} />

        {error && (
          <div className="animate-float text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">{error}</div>
        )}

        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all duration-200 shadow-lg shadow-fuchsia-200/50">
            {escaneando ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                Escaneando… la IA está viendo y escuchando
              </span>
            ) : !listo ? '🔍 ESCANEAR (sube video y formato primero)' : '🔍 ESCANEAR'}
          </button>
        )}

        {resultado && formato && (
          <div className="animate-pop">
            <VerWord formatoNombre={formato.nombre} parrafos={resultado} />
            <button onClick={() => setResultado(null)} className="w-full text-sm text-slate-400 hover:text-fuchsia-500 mt-2 transition">↺ Escanear de nuevo</button>
          </div>
        )}
      </div>
    </section>
  )
}
