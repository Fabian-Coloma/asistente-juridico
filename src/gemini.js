// ============================================================
// EXTRACCIÓN CON GEMINI — MODO DOCUMENTO COMPLETO
// La IA recibe el formato Word íntegro (párrafo por párrafo) y
// devuelve EL MISMO documento con los puntos suspensivos (…)
// reemplazados por los datos del material. Sin duplicar, sin
// agregar, sin quitar.
// ============================================================

import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

/**
 * @param {string[]} parrafos - el formato Word completo, un string por párrafo
 * @param {{tipo:'foto'|'video', file:File}[]} fuentes
 * @returns {Promise<string[]>} el documento llenado, mismo número de párrafos
 */
export async function extraerConIA(parrafos, fuentes) {
  const partes = []
  for (const f of fuentes) {
    partes.push({
      inlineData: {
        mimeType: f.file.type,
        data: await fileToBase64(f.file),
      },
    })
  }

  const instruccion = `
Eres un redactor judicial peruano experto. Tu tarea es LLENAR UN FORMATO DE SENTENCIA.

Te envío: (1) fotos de documentos del expediente [o un video], y (2) el FORMATO VACÍO de la sentencia.
En el formato, los espacios pendientes de llenar están marcados con puntos suspensivos (………), guiones (…..) o similares.

REGLAS ABSOLUTAS (las más importantes):
1. Devuelve EXACTAMENTE el mismo documento, con la MISMA cantidad de párrafos y el MISMO texto.
2. ÚNICAMENTE reemplaza los puntos suspensivos/guiones con la información encontrada en el material.
3. PROHIBIDO repetir o duplicar ningún párrafo. Si un párrafo aparece dos veces en tu respuesta, es un error grave.
4. PROHIBIDO agregar texto nuevo que no esté en el formato original.
5. PROHIBIDO dejar puntos suspensivos sin llenar si el dato existe en el material; si NO existe el dato, deja los puntos suspensivos tal como estaban.
6. Conserva intactos todos los fundamentos legales, citas de artículos y texto fijo del formato: NO los modifiques ni los copies dos veces.
7. No incluyas numeración extra, comentarios ni explicaciones: solo el documento final.

FORMATO VACÍO (un párrafo por línea, separados por el marcador <<<P>>>):
${parrafos.map(p => p + ' <<<P>>>').join('\n')}

RESPUESTA: devuelve únicamente el documento YA LLENADO, usando el marcador <<<P>>> entre párrafos,
con exactamente ${parrafos.length} párrafos (es decir, ${parrafos.length - 1} marcadores <<<P>>>).
`

  const modelo = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
  const respuesta = await ai.models.generateContent({
    model: modelo,
    contents: [{ role: 'user', parts: [...partes, { text: instruccion }] }],
    config: { temperature: 0 },
  })

  const texto = respuesta.text.replace(/```[a-z]*\n?/gi, '').trim()
  let resultado = texto.split('<<<P>>>').map(s => s.trim())

  // VERIFICACIÓN ANTI-DUPLICADO: la respuesta debe tener ~el mismo nº de párrafos
  if (resultado.length !== parrafos.length) {
    console.warn(`Párrafos esperados: ${parrafos.length}, recibidos: ${resultado.length}. Reintentando…`)
    // Segundo intento con corrección explícita
    const resp2 = await ai.models.generateContent({
      model: modelo,
      contents: [{
        role: 'user',
        parts: [...partes, {
          text: instruccion +
            `\n\nATENCIÓN: tu tarea anterior devolvió ${resultado.length} párrafos en lugar de ${parrafos.length}.
Devuelve EXACTAMENTE ${parrafos.length} párrafos. Copia el formato vacío línea por línea y SOLO sustituye los puntos suspensivos.`,
        }],
      }],
      config: { temperature: 0 },
    })
    const texto2 = resp2.text.replace(/```[a-z]*\n?/gi, '').trim()
    resultado = texto2.split('<<<P>>>').map(s => s.trim())
  }

  return resultado
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
