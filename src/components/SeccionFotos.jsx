import { useState } from 'react'
import SubirFormato from './SubirFormato.jsx'
import VerWord from './VerWord.jsx'

export default function SeccionFotos() {
  const [fotos, setFotos] = useState([])
  const [formato, setFormato] = useState(null) // {nombre, parrafos}
  const [resultado, setResultado] = useState(null) // string[] párrafos llenados
  const [escaneando, setEscaneando] = useState(false)
  const [error, setError] = useState('')

  const agregar = (files) => {
    setFotos(prev => [...prev, ...Array.from(files).map(f => ({
      tipo: 'foto', file: f,
      url: URL.createObjectURL(f), nombre: f.name,
    }))])
    setResultado(null)
  }

  const quitar = (i) => {
    setFotos(fotos.filter((_, j) => j !== i))
    setResultado(null)
  }

  const escanear = async () => {
    if (fotos.length === 0 || !formato) return
    setEscaneando(true)
    setError('')
    try {
      const { extraerConIA } = await import('../gemini.js')
      const parrafos = await extraerConIA(formato.parrafos, fotos)
      setResultado(parrafos)
    } catch (e) {
      console.error(e)
      setError('Error al escanear: ' + e.message)
    } finally {
      setEscaneando(false)
    }
  }

  const listo = fotos.length > 0 && formato

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📸</span>
          <div>
            <h2 className="text-xl font-bold">Sección Fotos</h2>
            <p className="text-sm text-slate-500">Fotos del expediente + formato Word → sentencia llenada</p>
          </div>
        </div>

        {/* 1. Casillero de fotos */}
        <label className="block border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition">
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={e => agregar(e.target.files)} />
          <div className="text-4xl mb-2">📤</div>
          <p className="font-semibold text-blue-700">Subir fotos</p>
          <p className="text-xs text-slate-400 mt-1">Haz clic para subir varias fotos de los documentos (6–8 recomendado)</p>
        </label>

        {fotos.length > 0 && (
          <>
            <p className="text-sm font-medium">{fotos.length} foto(s) lista(s)</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {fotos.map((f, i) => (
                <div key={i} className="relative group">
                  <img src={f.url} alt={f.nombre} className="w-full h-20 object-cover rounded-lg border" />
                  <button onClick={() => quitar(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs shadow">✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 2. Casillero del FORMATO WORD del usuario */}
        <SubirFormato onFormato={setFormato} />

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

        {/* 3. ESCANEAR */}
        {!resultado && (
          <button onClick={escanear} disabled={!listo || escaneando}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-40 shadow">
            {escaneando
              ? '🔍 Escaneando… la IA está leyendo tus fotos y llenando el formato'
              : !listo
                ? '🔍 ESCANEAR (sube fotos y tu formato Word primero)'
                : '🔍 ESCANEAR'}
          </button>
        )}

        {/* 4. Ver Word con el formato del usuario llenado */}
        {resultado && formato && (
          <>
            <VerWord formatoNombre={formato.nombre} parrafos={resultado} />
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
