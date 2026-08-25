import mammoth from 'mammoth'

// ============================================================
// LECTURA DEL FORMATO WORD QUE SUBE EL USUARIO
// Extrae las líneas del .docx para saber qué información pide.
// ============================================================

export async function leerFormato(file) {
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
  // Convertimos el HTML a líneas de texto simples conservando el orden
  const texto = html
    .replace(/<\/(p|h1|h2|h3|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  const lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  return lineas
}

// ¿Es una línea que pide un dato? (tiene ":", "___", o es corta tipo título de campo)
export const esCampo = (linea) => /[:：]|_{2,}|\. ?_{2,}/.test(linea)

// Limpia la línea para usarla como nombre de campo ante la IA
export const limpiarCampo = (linea) =>
  linea.replace(/[:：]+$/, '').replace(/_{2,}/g, '').trim()
