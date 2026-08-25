import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

// ============================================================
// VER WORD: muestra el formato del usuario YA LLENADO por la IA
// y permite descargarlo en .docx
// ============================================================

// Sustituye los espacios en blanco de una línea por el valor extraído.
// "DNI: ____" o "DNI:" → "DNI: 12345678"
function llenarLinea(linea, datos, campos) {
  // Busca a qué campo corresponde esta línea
  const campo = campos.find(c => linea.toLowerCase().includes(c.toLowerCase()))
  if (!campo) return linea
  const valor = String(datos[campo] ?? '').trim()
  if (!valor || valor === 'NO ENCONTRADO') return linea.replace(/_{2,}/g, '(sin dato)')
  // Reemplaza los guiones bajos por el valor; si no hay, lo agrega tras los ":"
  if (/_{2,}/.test(linea)) return linea.replace(/_{2,}/, ' ' + valor)
  if (/[:：]\s*$/.test(linea)) return linea + ' ' + valor
  return linea + ': ' + valor
}

export default function VerWord({ formato, datos }) {
  const [abierto, setAbierto] = useState(false)
  const lineasLlenas = formato.lineas.map(l => llenarLinea(l, datos, formato.campos))

  const descargar = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: formato.nombre.replace(/\.docx$/i, ''),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          ...lineasLlenas.map(l => new Paragraph({
            children: [new TextRun(l)],
            spacing: { after: 200 },
          })),
        ],
      }],
    })
    saveAs(await Packer.toBlob(doc), formato.nombre.replace(/\.docx$/i, '-LLENADO.docx'))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setAbierto(!abierto)}
          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">
          {abierto ? '🙈 Ocultar Word' : '👁️ Ver Word'}
        </button>
        <button onClick={descargar}
          className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700">
          📄 Descargar Word
        </button>
      </div>

      {abierto && (
        <div className="border rounded-xl bg-white shadow-inner p-8 max-h-[500px] overflow-y-auto">
          {/* Vista tipo hoja de Word */}
          <div className="bg-white mx-auto max-w-2xl border border-slate-200 shadow-sm p-10 font-serif text-slate-900 leading-relaxed whitespace-pre-wrap">
            {lineasLlenas.map((l, i) => (
              l.trim() ? <p key={i}>{l}</p> : <br key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
