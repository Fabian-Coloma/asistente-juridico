import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

export default function VerWord({ formatoNombre, parrafos }) {
  const [abierto, setAbierto] = useState(false)

  const descargar = async () => {
    const doc = new Document({
      sections: [{
        children: parrafos.map(p => p.trim()
          ? new Paragraph({ children: [new TextRun(p)], spacing: { after: 200 }, alignment: AlignmentType.JUSTIFIED })
          : new Paragraph({ text: '' })),
      }],
    })
    saveAs(await Packer.toBlob(doc), formatoNombre.replace(/\.docx$/i, '-LLENADO.docx'))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setAbierto(!abierto)}
          className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold hover:bg-emerald-600 shadow">
          {abierto ? '🙈 Ocultar Word' : '👁️ Ver Word'}
        </button>
        <button onClick={descargar}
          className="flex-1 bg-slate-800 text-white py-3 rounded-2xl font-bold hover:bg-slate-700 shadow">
          📄 Descargar Word
        </button>
      </div>

      {abierto && (
        <div className="border border-rose-100 rounded-2xl bg-white shadow-inner p-4 max-h-[560px] overflow-y-auto">
          <p className="text-[11px] text-slate-400 mb-2">
            {parrafos.length} párrafos · los ……… que quedan = dato no encontrado en el material
          </p>
          <div className="bg-white mx-auto max-w-2xl border border-slate-200 shadow-sm p-10 font-serif text-slate-900 leading-relaxed">
            {parrafos.map((p, i) => (p.trim() ? <p key={i} className="mb-3 text-justify">{p}</p> : <br key={i} />))}
          </div>
        </div>
      )}
    </div>
  )
}
