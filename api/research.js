export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key no configurada' });

  try {
    const { industry, subIndustries, brandName, target, description, customIndustry } = req.body;
    if (!industry && !customIndustry) return res.status(400).json({ error: 'Rubro requerido' });

    const industryList = [industry, ...(subIndustries||[]), customIndustry||""].filter(Boolean).join(", ");
    const currentDate = new Date().toLocaleDateString("es-AR", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

    const prompt = `Hoy es ${currentDate}. Sos un estratega de contenido para redes sociales especializado en el rubro: ${industryList}.

La empresa se llama "${brandName||"el cliente"}" y su público objetivo es: ${target||"general"}.
Descripción: ${description||""}

Investigá en internet y respondé ÚNICAMENTE con un JSON válido, sin backticks ni markdown:

{
  "trends": [
    {"topic": "tema trending", "why": "por qué es relevante ahora", "content_angle": "ángulo de contenido sugerido"}
  ],
  "commercial_dates": [
    {"date": "fecha", "event": "nombre del evento", "content_idea": "idea de post"}
  ],
  "hashtags": [
    {"tag": "#hashtag", "growth": "alto/medio", "reason": "por qué usarlo"}
  ],
  "competitor_insights": [
    {"insight": "qué está funcionando en cuentas similares", "format": "formato recomendado"}
  ],
  "content_ideas": [
    {"title": "título del post", "format": "foto/reel/carrusel/historia", "hook": "primera línea del caption", "why_now": "por qué publicarlo esta semana"}
  ],
  "best_posting_times": {
    "recommendation": "descripción general",
    "slots": [{"day": "día", "time": "horario", "reason": "por qué"}]
  },
  "weekly_summary": "resumen en 2-3 oraciones de qué oportunidades tiene esta marca esta semana"
}

Asegurate que trends tenga 5 items, commercial_dates tenga 4, hashtags tenga 10, competitor_insights tenga 3, content_ideas tenga 7, best_posting_times.slots tenga 4.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        tools: [{
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 5
        }],
        messages: [{ role: 'user', content: prompt }]
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Error de la API' });

    // Extraer el texto de la respuesta (puede venir después de tool_use blocks)
    const textBlock = data.content?.find(b => b.type === 'text');
    if (!textBlock) return res.status(500).json({ error: 'Sin respuesta de texto' });

    let result;
    try {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : textBlock.text);
    } catch(e) {
      return res.status(500).json({ error: 'Error parseando JSON', raw: textBlock.text });
    }

    return res.status(200).json({ success: true, data: result });

  } catch(err) {
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
