// ============================================================
// MOTOR DE RELLENO DE FORMATO WORD (v2)
// Toma el .docx ORIGINAL del usuario y reemplaza únicamente los
// espacios vacíos (……, XXX, ____) por los datos extraídos.
// El resto del documento queda EXACTAMENTE igual.
// ============================================================

import JSZip from 'jszip'

const PATRON = /(…{2,}|\.{6,}|_{3,}|X{2,}|x{2,})/g

/** Cuenta los huecos en el texto plano del documento */
export function contarHuecos(xml) {
  const textos = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]).join('')
  return [...textos.matchAll(PATRON)].length
}

/**
 * Pide a Gemini los datos para cada hueco y devuelve el XML del docx rellenado.
 * @param {File} file - el .docx del formato madre
 * @param {{tipo:'foto'|'video', file:File}[]} fuentes
 * @param {string} apiKeyExtraida - clave Gemini
 */
export async function rellenarFormato(file, fuentes) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  let xml = await zip.file('word/document.xml').async('string')

  // 1. Extraer el texto completo con marcadores de posición numerados.
  //    Cada hueco se marca como [[HUECO_n]] en el texto que ve la IA,
  //    pero en el XML real seguimos buscando el patrón original en orden.
  const textosPlano = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)]
  const textoCompleto = textosPlano.map(m => m[1]).join('\n')

  // Lista ordenada de huecos tal como aparecen en el documento
  const huecos = []
  let idx = 0
  const textoMarcado = textoCompleto.replace(PATRON, () => `[[HUECO_${idx++}]]`)
  // Recorremos de nuevo para guardar contexto de cada hueco
  let contador = 0
  for (const m of textoCompleto.matchAll(PATRON)) {
    const inicio = Math.max(0, m.index - 300)
    const fin = Math.min(textoCompleto.length, m.index + m[0].length + 300)
    huecos.push({
      n: contador++,
      original: m[0],
      contexto: textoCompleto.slice(inicio, fin).replace(PATRON, '______'),
    })
  }

  if (huecos.length === 0) {
    throw new Error('No se encontraron espacios vacíos (………) en el formato.')
  }

  // 2. Enviar a Gemini: material + lista de huecos con su contexto
  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

  const partes = []
  for (const f of fuentes) {
    partes.push({
      inlineData: { mimeType: f.file.type, data: await toBase64(f.file) },
    })
  }

  const instruccion = `
Eres un asistente judicial experto. Te envío:
1) Material fuente: ${fuentes.length === 1 && fuentes[0].tipo === 'video' ? 'UN VIDEO' : `${fuentes.length} FOTOS de documentos`}.
2) Un formato de sentencia con espacios vacíos marcados como ______ en cada fragmento de contexto.

Tu tarea: determinar QUÉ dato exacto debe ir en CADA espacio vacío, leyendo todo el material.

FRAGMENTOS DEL FORMATO (cada uno contiene un espacio marcado con ______):
${huecos.map(h => `\n[HUECO_${h.n}] contexto: «...${h.contexto}...»`).join('\n')}

REGLAS ESTRICTAS:
- Responde SOLO un JSON válido: {"HUECO_0": "...", "HUECO_1": "...", ...}
- Cada valor debe ser ÚNICAMENTE el dato que falta (un nombre, una cifra, una fecha corta, etc.), NUNCA repitas la frase del formato ni escribas oraciones completas si solo falta un nombre o número.
- Ejemplo correcto: "ANA MARÍA PÉREZ CRUZ". Ejemplo INCORRECTO: "la demanda interpuesta por ANA MARÍA..."
- Si el dato no aparece en el material, usa "…………" (déjalo vacío como estaba).
- Si el contexto pide montos, escribe solo el número: "1,000.00".
- Respeta mayúsculas como en el material.
`

  const modelo = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
  const respuesta = await ai.models.generateContent({
    model: modelo,
    contents: [{ role: 'user', parts: [...partes, { text: instruccion }] }],
    config: { temperature: 0.1 },
  })

  const crudo = respuesta.text.replace(/```json|```/g, '').trim()
  const ini = crudo.indexOf('{'), fin = crudo.lastIndexOf('}')
  const datos = JSON.parse(crudo.slice(ini, fin + 1))

  // 3. Reemplazar en el XML: recorrer los <w:t> en orden y sustituir cada
  //    hueco por su dato. Puede haber varios huecos dentro de un mismo <w:t>.
  let n = 0
  xml = xml.replace(/(<w:t[^>]*>)([^<]*)(<\/w:t>)/g, (full, open, contenido, close) => {
    let nuevo = contenido
    nuevo = nuevo.replace(PATRON, (m) => {
      const val = datos[`HUECO_${n}`]
      n++
      return val && !/^…+$/.test(val.trim()) ? ` ${val.trim()} ` : m
    })
    return open + nuevo + close
  })

  // Guardar el XML modificado
  zip.file('word/document.xml', xml)
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  return { blob, totalHuecos: huecos.length, llenados: Object.values(datos).filter(v => v && !/^…+$/.test(v.trim())).length }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })
}
