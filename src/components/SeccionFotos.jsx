import { useState } from 'react'
import SubirFormato from './SubirFormato.jsx'
import VerWord from './VerWord.jsx'

export default function SeccionFotos() {
  const [fotos, setFotos] = useState([])
  const [formato, setFormato] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [escaneando, setEscaneando] = useState(false)
  const [error, setError] = useState('')

  const agregar = (files) => {
    setFotos(prev => [...prev, ...Array.from(files).map(f => ({
      tipo: 'foto', file: f, url: URL.createObjectURL(f), nombre: f.name,
    }))])
    setResultado(null)
  }
  const quitar = (i) => {
    setFotos(fotos.filter((_, j) => j !== i))
    setResultado(null)
  }
  const escanear = async () => {
    if (fotos.length === 0 || !formato) return
    setEscaneando(true); setError('')
    try {
      const { extraerConIA } = await import('../gemini.js')
      setResultado(await extraerConIA(formato.parrafos, fotos))
    } catch (e) {
      console.error(e)
      setError('🌸 No se pudo escanear: ' + (e?.message || e))
    } finally { setEscaneando(false) }
  }
  const listo = fotos.length > 0 && formato

  return (
    <section className="space-y-5 animate-float">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-rose-100/50 border border-white/70 p-7 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-xl shadow-lg">🌷</div>
          <div>
            <h2 className="text-xl font-bold text-slate-700">Sección Fotos</h2>
            <p className="text-sm text-slate-400">Fotos del expediente + tu formato → sentencia llenada</p>
          </div>
        </div>

        <label className="group block border-2 border-dashed border-rose-200 bg-rose-50/30 rounded-3xl p-9 text-center cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:scale-[1.01] active:scale-95 transition-all duration-200">
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => agregar(e.target.files)} />
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">📤</div>
          <p className="font-semibold text-rose-600">Subir fotos</p>
          <p className="text-xs text-slate-400 mt-1">Varias fotos del expediente (6–8 recomendado)</p>
        </label>

        {fotos.length > 0 && (
          <div className="animate-float">
            <p className="text-sm font-medium text-slate-500 mb-2">{fotos.length} foto(s) lista(s)</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
              {fotos.map((f, i) => (
                <div key={i} className="relative group">
                  <img src={f.url} alt={f.nombre} className="w-full h-20 object-cover rounded-2xl border border-white shadow-md group-hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => quitar(i)} className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full text-xs shadow-lg opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <SubirFormato onFormato={setFormato} />

        {error && (
          <div className="animate-float text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">{error}</div>
        )}

        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all duration-200 shadow-lg shadow-rose-200/50">
            {escaneando ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                Escaneando… la IA está llenando tu formato
              </span>
            ) : !listo ? '🔍 ESCANEAR (sube fotos y tu formato primero)' : '🔍 ESCANEAR'}
          </button>
        )}

        {resultado && formato && (
          <div className="animate-pop">
            <VerWord formatoNombre={formato.nombre} parrafos={resultado} />
            <button onClick={() => setResultado(null)} className="w-full text-sm text-slate-400 hover:text-rose-500 mt-2 transition">↺ Escanear de nuevo</button>
          </div>
        )}
      </div>
    </section>
  )
}
