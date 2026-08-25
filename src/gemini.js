// ============================================================
// EXTRACCIÓN CON GEMINI
// Envía las fotos o el video + el formato Word del usuario,
// y recibe un JSON con cada casillero llenado.
// ============================================================

import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

/**
 * @param {{lineas:string[], campos:string[]}} formato - formato Word leído
 * @param {{tipo:'foto'|'video', file:File}[]} fuentes
 * @returns {Promise<Object>} { campo: valor }
 */
export async function extraerConIA(formato, fuentes) {
  const partes = []
  for (const f of fuentes) {
    partes.push({
      inlineData: {
        mimeType: f.file.type,
        data: await fileToBase64(f.file),
      },
    })
  }

  const usarCampos = formato.campos.length > 0

  const instruccion = `
Eres un asistente judicial experto en transcripción de documentos.

El usuario te envía material (fotos de documentos o un video) junto con su FORMATO oficial,
que define exactamente qué información se debe extraer y en qué orden.

FORMATO OFICIAL DEL USUARIO (líneas originales):
${formato.lineas.map(l => `| ${l}`).join('\n')}

${usarCampos ? `CASELLEROS A LLENAR (extraídos del formato):\n${formato.campos.map(c => `- "${c}"`).join('\n')}` : ''}

INSTRUCCIONES:
1. Analiza TODO el material adjunto con detalle (lee textos, escucha el audio del video si lo hay).
2. Devuelve ÚNICAMENTE un JSON válido, sin markdown ni explicaciones.
3. Cada clave del JSON debe ser EXACTAMENTE el nombre del casillero del formato.
4. Llena cada casillero con la información encontrada en el material, tal cual aparece.
5. Si un dato no aparece en el material, usa "NO ENCONTRADO".
`

  const modelo = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
  const respuesta = await ai.models.generateContent({
    model: modelo,
    contents: [{ role: 'user', parts: [...partes, { text: instruccion }] }],
    config: { temperature: 0.1 },
  })

  const texto = respuesta.text.replace(/```json|```/g, '').trim()
  // Buscamos el primer objeto JSON en la respuesta
  const inicio = texto.indexOf('{')
  const fin = texto.lastIndexOf('}')
  return JSON.parse(texto.slice(inicio, fin + 1))
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
