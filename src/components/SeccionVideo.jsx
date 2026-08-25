import { useState } from 'react'
import SubirFormato from './SubirFormato.jsx'
import VerWord from './VerWord.jsx'

export default function SeccionVideo() {
  const [video, setVideo] = useState(null)
  const [formato, setFormato] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [escaneando, setEscaneando] = useState(false)
  const [error, setError] = useState('')

  const elegir = (file) => {
    setVideo(file ? { tipo: 'video', file } : null)
    setResultado(null)
  }

  const escanear = async () => {
    if (!video || !formato) return
    setEscaneando(true)
    setError('')
    try {
      const { extraerConIA } = await import('../gemini.js')
      const datos = await extraerConIA(formato, [video])
      setResultado({ datos })
    } catch (e) {
      console.error(e)
      setError('Error al escanear: ' + e.message)
    } finally {
      setEscaneando(false)
    }
  }

  const listo = video && formato

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎥</span>
          <div>
            <h2 className="text-xl font-bold">Sección Video</h2>
            <p className="text-sm text-slate-500">Video + tu formato → la IA transcribe y llena el Word</p>
          </div>
        </div>

        {/* 1. Casillero de video */}
        <label className="block border-2 border-dashed border-purple-300 bg-purple-50/50 rounded-xl p-8 text-center cursor-pointer hover:bg-purple-50 transition">
          <input type="file" accept="video/*" className="hidden"
            onChange={e => elegir(e.target.files[0])} />
          <div className="text-4xl mb-2">📤</div>
          <p className="font-semibold text-purple-700">Subir video</p>
          <p className="text-xs text-slate-400 mt-1">Entrevista, declaración o reconstrucción de hechos (máx. recomendado: 15 min)</p>
        </label>

        {video && (
          <video src={URL.createObjectURL(video.file)} controls
            className="w-full max-h-72 rounded-xl border" />
        )}

        {/* 2. Casillero del FORMATO WORD del usuario */}
        <SubirFormato onFormato={setFormato} />

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

        {/* 3. ESCANEAR */}
        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-40 shadow">
            {escaneando
              ? '🔍 Escaneando… la IA está viendo y escuchando tu video (puede tardar varios minutos)'
              : !listo
                ? '🔍 ESCANEAR (sube el video y tu formato Word primero)'
                : '🔍 ESCANEAR'}
          </button>
        )}

        {/* 4. Ver Word con el formato del usuario llenado */}
        {resultado && (
          <>
            <VerWord formato={formato} datos={resultado.datos} />
            <button onClick={() => setResultado(null)}
              className="w-full text-sm text-slate-500 hover:text-slate-700">
              ↺ Escanear de nuevo
            </button>
          </>
        )}
      </div>
    </section>
  )
}
