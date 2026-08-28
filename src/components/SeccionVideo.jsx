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
    } catch (e) { console.error(e); setError('Error al escanear: ' + e.message) }
    finally { setEscaneando(false) }
  }
  const listo = video && formato

  return (
    <section className="space-y-5">
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg shadow-fuchsia-100/50 border border-fuchsia-100 p-7 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎬</span>
          <div>
            <h2 className="text-xl font-bold text-slate-700">Sección Video</h2>
            <p className="text-sm text-slate-400">Video + tu formato → la IA transcribe y llena el Word</p>
          </div>
        </div>

        <label className="block border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/40 rounded-2xl p-8 text-center cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-300 transition">
          <input type="file" accept="video/*" className="hidden" onChange={e => elegir(e.target.files[0])} />
          <div className="text-4xl mb-2">📤</div>
          <p className="font-semibold text-fuchsia-600">Subir video</p>
          <p className="text-xs text-slate-400 mt-1">Entrevista, declaración (máx. recomendado: 15 min)</p>
        </label>

        {video && <video src={URL.createObjectURL(video.file)} controls className="w-full max-h-72 rounded-2xl border border-fuchsia-100 shadow-sm" />}

        <SubirFormato onFormato={setFormato} />
        {error && <p className="text-sm text-rose-500 bg-rose-50 rounded-lg p-3">{error}</p>}

        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-40 shadow-lg shadow-fuchsia-200/50">
            {escaneando ? '🔍 Escaneando… la IA está viendo y escuchando (puede tardar varios minutos)' : !listo ? '🔍 ESCANEAR (sube video y formato primero)' : '🔍 ESCANEAR'}
          </button>
        )}

        {resultado && formato && (
          <>
            <VerWord formatoNombre={formato.nombre} parrafos={resultado} />
            <button onClick={() => setResultado(null)} className="w-full text-sm text-slate-400 hover:text-fuchsia-500">↺ Escanear de nuevo</button>
          </>
        )}
      </div>
    </section>
  )
}
