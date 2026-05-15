// api/select-image.js
// Recibe un brief y N imágenes, devuelve el índice de la más relevante.
// Un solo llamado a Claude con todas las imágenes — sin pasos intermedios.

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
    // Construir el mensaje con todas las imágenes + la pregunta
    // Claude las ve todas juntas y elige directamente
    const imageBlocks = images.map((img, i) => ([
      {
        type: "text",
        text: `Imagen ${i + 1}:`
      },
      {
        type: "image",
        source: {
          type: "base64",
          media_type: img.mtype || "image/jpeg",
          data: img.b64,
        }
      }
    ])).flat();

    const content = [
      ...imageBlocks,
      {
        type: "text",
        text: `El cliente quiere publicar sobre: "${brief}".\n\nMirá las ${images.length} imágenes de arriba. ¿Cuál número de imagen (1 al ${images.length}) muestra mejor el tema "${brief}"?\n\nRespondé ÚNICAMENTE con el número de imagen. Sin explicaciones, sin texto adicional. Solo el número.`
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

    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    const raw = data.content?.[0]?.text?.trim() || "";
    const chosen = parseInt(raw.replace(/\D/g, "")) - 1; // convertir a índice 0-based

    if (isNaN(chosen) || chosen < 0 || chosen >= images.length) {
      // Claude no devolvió un número válido — devolver índice 0 como fallback
      return res.status(200).json({ success: true, chosenIdx: 0, raw });
    }

    // Devolver el índice original de la imagen elegida (puede ser diferente si filtramos)
    const originalIdx = images[chosen]?.idx ?? chosen;
    return res.status(200).json({ success: true, chosenIdx: originalIdx, raw });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
