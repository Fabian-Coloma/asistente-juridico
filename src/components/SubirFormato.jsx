import { useState } from 'react'
import { leerFormato } from '../formato-word.js'

// Casillero reutilizable para subir el formato Word del usuario
export default function SubirFormato({ onFormato }) {
  const [formato, setFormato] = useState(null) // {nombre, parrafos}
  const [leyendo, setLeyendo] = useState(false)
  const [error, setError] = useState('')

  const elegir = async (file) => {
    if (!file) return
    setLeyendo(true)
    setError('')
    try {
      const parrafos = await leerFormato(file)
      const conPuntos = parrafos.filter(p => /\.{3,}|…|_{2,}/.test(p)).length
      const f = { nombre: file.name, parrafos }
      setFormato(f)
      onFormato(f)
    } catch (e) {
      setError('No se pudo leer el Word: ' + e.message)
    } finally {
      setLeyendo(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block border-2 border-dashed border-amber-400 bg-amber-50/50 rounded-xl p-6 text-center cursor-pointer hover:bg-amber-50 transition">
        <input type="file" accept=".docx" className="hidden"
          onChange={e => elegir(e.target.files[0])} />
        <div className="text-3xl mb-1">📝</div>
        <p className="font-semibold text-amber-700">Subir formato que desea ser transcrito</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Word (.docx) con los espacios a llenar marcados con ……… o puntos suspensivos
        </p>
      </label>

      {leyendo && <p className="text-sm text-slate-500">📖 Leyendo tu formato…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

      {formato && !leyendo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
          <p className="font-semibold">✅ {formato.nombre}</p>
          <p className="text-xs text-slate-500 mt-1">
            Formato leído: {formato.parrafos.length} párrafos ·{' '}
            {formato.parrafos.filter(p => /\.{3,}|…|_{2,}/.test(p)).length} con espacios por llenar.
            La IA conservará tu estructura EXACTA y solo reemplazará los puntos suspensivos.
          </p>
          <button onClick={() => { setFormato(null); onFormato(null) }}
            className="mt-2 text-xs text-red-500 hover:underline">✕ Quitar formato</button>
        </div>
      )}
    </div>
  )
}
