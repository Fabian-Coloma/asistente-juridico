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
    } catch (e) { setError('No se pudo leer el Word: ' + e.message) }
    finally { setLeyendo(false) }
  }

  return (
    <div className="space-y-2">
      <label className="block border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-6 text-center cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition">
        <input type="file" accept=".docx" className="hidden" onChange={e => elegir(e.target.files[0])} />
        <div className="text-3xl mb-1">📝</div>
        <p className="font-semibold text-amber-700">Subir formato que desea ser transcrito</p>
        <p className="text-xs text-slate-400 mt-0.5">Word (.docx) con espacios marcados con ……… o puntos suspensivos</p>
      </label>

      {leyendo && <p className="text-sm text-slate-500">📖 Leyendo tu formato…</p>}
      {error && <p className="text-sm text-rose-500 bg-rose-50 rounded p-2">{error}</p>}

      {formato && !leyendo && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-sm">
          <p className="font-semibold text-amber-800">✅ {formato.nombre}</p>
          <p className="text-xs text-slate-500 mt-1">
            {formato.parrafos.length} párrafos · {' '}
            {formato.parrafos.filter(p => /\.{3,}|…|_{2,}/.test(p)).length} con espacios por llenar.
            La IA conserva tu estructura EXACTA y solo reemplaza los puntos suspensivos.
          </p>
          <button onClick={() => { setFormato(null); onFormato(null) }} className="mt-2 text-xs text-rose-400 hover:underline">✕ Quitar formato</button>
        </div>
      )}
    </div>
  )
}
