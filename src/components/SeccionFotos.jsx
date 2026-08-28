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
    } catch (e) { console.error(e); setError('Error al escanear: ' + e.message) }
    finally { setEscaneando(false) }
  }
  const listo = fotos.length > 0 && formato

  return (
    <section className="space-y-5">
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg shadow-rose-100/50 border border-rose-100 p-7 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌷</span>
          <div>
            <h2 className="text-xl font-bold text-slate-700">Sección Fotos</h2>
            <p className="text-sm text-slate-400">Fotos del expediente + tu formato → sentencia llenada</p>
          </div>
        </div>

        <label className="block border-2 border-dashed border-rose-200 bg-rose-50/40 rounded-2xl p-8 text-center cursor-pointer hover:bg-rose-50 hover:border-rose-300 transition">
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => agregar(e.target.files)} />
          <div className="text-4xl mb-2">📤</div>
          <p className="font-semibold text-rose-600">Subir fotos</p>
          <p className="text-xs text-slate-400 mt-1">Varias fotos del expediente (6–8 recomendado)</p>
        </label>

        {fotos.length > 0 && (
          <>
            <p className="text-sm font-medium text-slate-500">{fotos.length} foto(s) lista(s)</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {fotos.map((f, i) => (
                <div key={i} className="relative group">
                  <img src={f.url} alt={f.nombre} className="w-full h-20 object-cover rounded-xl border border-rose-100 shadow-sm" />
                  <button onClick={() => quitar(i)} className="absolute -top-1 -right-1 bg-rose-500 text-white w-5 h-5 rounded-full text-xs shadow">✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        <SubirFormato onFormato={setFormato} />
        {error && <p className="text-sm text-rose-500 bg-rose-50 rounded-lg p-3">{error}</p>}

        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-40 shadow-lg shadow-rose-200/50">
            {escaneando ? '🔍 Escaneando… la IA está llenando tu formato' : !listo ? '🔍 ESCANEAR (sube fotos y tu formato primero)' : '🔍 ESCANEAR'}
          </button>
        )}

        {resultado && formato && (
          <>
            <VerWord formatoNombre={formato.nombre} parrafos={resultado} />
            <button onClick={() => setResultado(null)} className="w-full text-sm text-slate-400 hover:text-rose-500">↺ Escanear de nuevo</button>
          </>
        )}
      </div>
    </section>
  )
}
