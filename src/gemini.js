import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function extraerConIA(parrafos, fuentes) {
  const partes = []
  for (const f of fuentes) {
    partes.push({ inlineData: { mimeType: f.file.type, data: await fileToBase64(f.file) } })
  }

  const instruccion = `
Eres un redactor judicial peruano experto. Tu tarea es LLENAR UN FORMATO DE SENTENCIA.

REGLAS ABSOLUTAS:
1. Devuelve EXACTAMENTE el mismo documento, con la MISMA cantidad de párrafos y el MISMO texto.
2. ÚNICAMENTE reemplaza los puntos suspensivos/guiones con la información encontrada en el material.
3. PROHIBIDO repetir o duplicar ningún párrafo.
4. PROHIBIDO agregar texto nuevo que no esté en el formato original.
5. PROHIBIDO dejar puntos suspensivos sin llenar si el dato existe en el material; si NO existe, deja los puntos suspensivos tal como estaban.
6. Conserva intactos todos los fundamentos legales y citas. No los modifiques ni los copies dos veces.
7. Sin numeración extra, comentarios ni explicaciones: solo el documento final.
8. MAYÚSCULAS EN NOMBRES PROPIOS: la PRIMERA letra de cada nombre de PERSONA, CIUDAD, DISTRITO, PROVINCIA, PAÍS y cualquier lugar geográfico debe ir en MAYÚSCULA. Ejemplos: "maría gonzález" → "María González", "lima" → "Lima", "perú" → "Perú". Aplica esto tanto a los nombres que llenes como a los que ya vengan en el formato.

FORMATO VACÍO (un párrafo por línea, separados por <<<P>>>):
${parrafos.map(p => p + ' <<<P>>>').join('\n')}

RESPUESTA: únicamente el documento YA LLENADO, con ${parrafos.length - 1} marcadores <<<P>>> y exactamente ${parrafos.length} párrafos.
`

  const modelo = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
  const resp = await ai.models.generateContent({
    model: modelo,
    contents: [{ role: 'user', parts: [...partes, { text: instruccion }] }],
    config: { temperature: 0 },
  })

  let resultado = resp.text.replace(/```[a-z]*\n?/gi, '').trim()
    .split('<<<P>>>').map(s => s.trim())

  if (resultado.length !== parrafos.length) {
    const resp2 = await ai.models.generateContent({
      model: modelo,
      contents: [{ role: 'user', parts: [...partes, {
        text: instruccion + `\n\nATENCIÓN: devolviste ${resultado.length} párrafos en vez de ${parrafos.length}. Copia el formato línea por línea y SOLO sustituye los puntos suspensivos.`,
      }] }],
      config: { temperature: 0 },
    })
    resultado = resp2.text.replace(/```[a-z]*\n?/gi, '').trim().split('<<<P>>>').map(s => s.trim())
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
