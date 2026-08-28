// Serverless: entrega la API key de Gemini al frontend (oculta en el servidor)
export const config = { runtime: 'nodejs' }

export default function handler(req, res) {
  res.status(200).json({ key: process.env.VITE_GEMINI_API_KEY || '' })
}
