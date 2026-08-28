// Prueba del nuevo motor: envía el formato madre a Gemini SIN fotos
// (solo verifica estructura: mismo nº de párrafos, sin duplicados)
const { GoogleGenAI } = require('@google/genai');
const mammoth = require('mammoth');

(async () => {
  const fs = require('fs');
  // leer clave
  let key = '';
  try { key = fs.readFileSync('.env', 'utf8').match(/VITE_GEMINI_API_KEY=(.*)/)[1].trim(); } catch {}
  const ai = new GoogleGenAI({ apiKey: key });

  const r = await mammoth.convertToHtml({ path: 'C:/Users/fabia/Downloads/SENTENCIA MODELO ALIMENTOS FUNDADA EN PARTE.docx' });
  const parrafos = r.value.split(/<\/p>/i).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('Párrafos del formato:', parrafos.length);

  const instruccion = `
Eres un redactor judicial peruano experto. Tu tarea es LLENAR UN FORMATO DE SENTENCIA.
No se adjunta material en esta prueba; deja los puntos suspensivos tal como estaban.

REGLAS ABSOLUTAS:
1. Devuelve EXACTAMENTE el mismo documento, con la MISMA cantidad de párrafos y el MISMO texto.
2. ÚNICAMENTE reemplaza los puntos suspensivos/guiones con la información encontrada en el material.
3. PROHIBIDO repetir o duplicar ningún párrafo.
4. PROHIBIDO agregar texto nuevo.
5. Si NO existe el dato, deja los puntos suspensivos tal como estaban.
6. No incluyas numeración extra ni comentarios.

FORMATO VACÍO (un párrafo por línea, separados por el marcador <<<P>>>):
${parrafos.map(p => p + ' <<<P>>>').join('\n')}

RESPUESTA: devuelve únicamente el documento YA LLENADO, usando <<<P>>> entre párrafos,
con exactamente ${parrafos.length} párrafos (es decir, ${parrafos.length - 1} marcadores).
`;
  const resp = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{ role: 'user', parts: [{ text: instruccion }] }],
    config: { temperature: 0 },
  });
  const out = resp.text.replace(/```[a-z]*\n?/gi, '').trim();
  const resultado = out.split('<<<P>>>').map(s => s.trim()).filter(Boolean);
  console.log('Párrafos devueltos:', resultado.length);
  console.log('¿Misma cantidad?', resultado.length === parrafos.length ? 'SÍ ✓' : 'NO ✗');
  // detectar duplicados consecutivos
  let dup = 0;
  for (let i = 1; i < resultado.length; i++) if (resultado[i] === resultado[i-1]) dup++;
  console.log('Párrafos duplicados consecutivos:', dup);
  console.log('\n--- Muestra (párrafos 0-3) ---');
  resultado.slice(0, 4).forEach((p, i) => console.log(`[${i}]`, p.slice(0, 150)));
})();
