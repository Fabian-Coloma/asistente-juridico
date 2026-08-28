// Serverless: valida usuario/clave y devuelve token (oculta la clave real)
export const config = { runtime: "nodejs" }

const USUARIO = process.env.APP_USER || "llelsitapreciosa02"
const CLAVE = process.env.APP_PASS || "020526"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { user, pass } = req.body || {}
  if (user === USUARIO && pass === CLAVE) {
    const token = Buffer.from(`${USUARIO}:${Date.now()}`).toString("base64")
    return res.status(200).json({ token, ok: true })
  }
  return res.status(401).json({ error: "invalid" })
}
// deploy trigger 1787877610
