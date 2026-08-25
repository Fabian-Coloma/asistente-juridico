import { useState } from 'react'
import { leerFormato, esCampo, limpiarCampo } from '../formato-word.js'

// Casillero reutilizable para subir el formato Word del usuario
export default function SubirFormato({ onFormato }) {
  const [formato, setFormato] = useState(null) // {file, lineas, campos}
  const [leyendo, setLeyendo] = useState(false)
  const [error, setError] = useState('')

  const elegir = async (file) => {
    if (!file) return
    setLeyendo(true)
    setError('')
    try {
      const lineas = await leerFormato(file)
      const detectados = lineas.filter(esCampo).map(limpiarCampo)
      // Si no hay líneas con ":", usamos todas las líneas como referencia
      const f = {
        file,
        nombre: file.name,
        lineas,
        campos: detectados.length > 0 ? detectados : [],
      }
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
        <p className="text-xs text-slate-400 mt-0.5">Archivo Word (.docx) con el orden exacto de la información</p>
      </label>

      {leyendo && <p className="text-sm text-slate-500">📖 Leyendo tu formato…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

      {formato && !leyendo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
          <p className="font-semibold">✅ {formato.nombre}</p>
          {formato.campos.length > 0 ? (
            <>
              <p className="text-xs text-slate-500 mt-1">
                La IA llenará estos {formato.campos.length} casilleros detectados:
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {formato.campos.map((c, i) => (
                  <span key={i} className="bg-white border rounded-full px-2 py-0.5 text-[11px]">{c}</span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 mt-1">
              Formato leído ({formato.lineas.length} líneas). La IA lo usará completo como guía.
            </p>
          )}
          <button onClick={() => { setFormato(null); onFormato(null) }}
            className="mt-2 text-xs text-red-500 hover:underline">✕ Quitar formato</button>
        </div>
      )}
    </div>
  )
}
