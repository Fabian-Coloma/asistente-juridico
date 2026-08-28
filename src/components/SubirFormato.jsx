import { useState } from 'react'
import { leerFormato } from '../formato-word.js'

export default function SubirFormato({ onFormato }) {
  const [formato, setFormato] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [error, setError] = useState('')

  const elegir = async (file) => {
    if (!file) return
    setLeyendo(true); setError('')
    try {
      const parrafos = await leerFormato(file)
      const f = { nombre: file.name, parrafos }
      setFormato(f); onFormato(f)
    } catch (e) {
      setError('🌸 No se pudo leer el Word: ' + (e?.message || e))
    } finally { setLeyendo(false) }
  }

  return (
    <div className="space-y-2">
      <label className="group block border-2 border-dashed border-amber-300 bg-amber-50/40 rounded-3xl p-7 text-center cursor-pointer hover:bg-amber-50 hover:border-amber-400 hover:scale-[1.01] active:scale-95 transition-all duration-200">
        <input type="file" accept=".docx" className="hidden" onChange={e => elegir(e.target.files[0])} />
        <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">📝</div>
        <p className="font-semibold text-amber-700">Subir formato que desea ser transcrito</p>
        <p className="text-xs text-slate-400 mt-0.5">Word (.docx) con espacios marcados con ……… o puntos suspensivos</p>
      </label>

      {leyendo && (
        <div className="loading-shimmer rounded-2xl h-16 animate-pulse" />
      )}
      {error && (
        <div className="animate-float text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">{error}</div>
      )}

      {formato && !leyendo && (
        <div className="animate-pop bg-amber-50/70 border border-amber-200 rounded-3xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✅</span>
            <p className="font-semibold text-amber-800 truncate">{formato.nombre}</p>
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            {formato.parrafos.length} párrafos · {' '}
            {formato.parrafos.filter(p => /\.{3,}|…|_{2,}/.test(p)).length} con espacios por llenar.
            La IA conserva tu estructura EXACTA y solo reemplaza los puntos suspensivos.
          </p>
          <button type="button" onClick={() => { setFormato(null); onFormato(null) }}
            className="mt-2.5 text-xs text-rose-400 hover:underline">✕ Quitar formato</button>
        </div>
      )}
    </div>
  )
}
