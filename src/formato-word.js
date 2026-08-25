// ============================================================
// LECTURA DEL FORMATO WORD QUE SUBE EL USUARIO
// Extrae el documento COMPLETO, párrafo por párrafo, en orden.
// ============================================================

import mammoth from 'mammoth'

export async function leerFormato(file) {
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
  // Cada <p> del Word es un párrafo; conservamos orden y vacíos significativos
  const parrafos = html
    .split(/<\/p>/i)
    .map(p => p.replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
      .replace(/>/g, '>').replace(/&nbsp;/g, ' ')
      .trim())
  // Eliminamos vacíos al inicio/final pero conservamos estructura interna
  while (parrafos.length && !parrafos[0]) parrafos.shift()
  while (parrafos.length && !parrafos[parrafos.length - 1]) parrafos.pop()
  return parrafos
}
