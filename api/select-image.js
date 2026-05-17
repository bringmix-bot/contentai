// api/select-image.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const { brief, images } = req.body;
  if (!brief || !images || images.length === 0) {
    return res.status(400).json({ success: false, error: "Faltan datos" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  try {
    // Construir bloques: texto + imagen para cada una
    const imageBlocks = images.map((img, i) => ([
      { type: "text", text: `Imagen ${i + 1}${img.fileName ? ` (archivo: ${img.fileName})` : ""}:` },
      { type: "image", source: { type: "base64", media_type: img.mtype || "image/jpeg", data: img.b64 } }
    ])).flat();

    const content = [
      ...imageBlocks,
      {
        type: "text",
        text: `El cliente quiere publicar sobre: "${brief}".

Analizá cada imagen cuidadosamente y elegí cuál muestra mejor el tema "${brief}".
Buscá imágenes que contengan ${brief} o elementos directamente relacionados.
Si ninguna imagen está relacionada con "${brief}", elegí la que más se acerque visualmente al tema.

Respondé ÚNICAMENTE con el número de imagen (1 al ${images.length}). Sin explicaciones.`
      }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 10,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    const raw = data.content?.[0]?.text?.trim() || "";
    const num = parseInt(raw.replace(/\D/g, ""));
    const chosenIdx = isNaN(num) ? 0 : num - 1;
    const safeIdx = Math.max(0, Math.min(chosenIdx, images.length - 1));
    const originalIdx = images[safeIdx]?.idx ?? safeIdx;

    return res.status(200).json({ success: true, chosenIdx: originalIdx, raw });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
