# ⚖️ Asistente Jurídico

SaaS para asistentes judiciales: sube **fotos** de documentos o un **video**, junto con tu
**formato Word (.docx)**, y la IA (Gemini) extrae la información solicitada y genera un
**Word limpio** ya llenado, listo para revisar y enviar.

## Flujo

1. 📸 / 🎥 Sube fotos o video en su sección
2. 📝 Sube tu formato Word — define qué información extraer
3. 🔍 ESCANEAR — Gemini lee el material y llena los casilleros de tu formato
4. 👁️ Ver Word / 📄 Descargar — tu mismo formato, llenado

## Tecnologías

- React + Vite + Tailwind CSS 4
- Gemini API (`gemini-3.6-flash`) — visión + audio/video
- mammoth (lectura de .docx) · docx (generación de .docx)

## Desarrollo

```bash
npm install
cp .env.example .env   # agrega tu VITE_GEMINI_API_KEY
npm run dev
```

> ⚠️ La llamada a Gemini corre desde el navegador con la clave `VITE_`.
> Para producción real, mover a una Edge Function de Supabase.
