export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  // ── GET PROFILES ──────────────────────────────────────────────
  if (req.method === 'GET' && action === 'profiles') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token requerido' });
    try {
      const r = await fetch('https://api.bufferapp.com/1/profiles.json', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data.error || 'Error de Buffer' });
      // Map to simplified format
      const profiles = data.map(p => ({
        id: p.id,
        service: p.service,
        name: p.formatted_username || p.service_username,
        avatar: p.avatar_https,
      }));
      return res.status(200).json({ profiles });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── SCHEDULE POST ─────────────────────────────────────────────
  if (req.method === 'POST' && action === 'schedule') {
    const { token, profileId, text, imageBase64, scheduledAt } = req.body;
    if (!token || !profileId || !text) return res.status(400).json({ error: 'Faltan datos' });

    try {
      const body = new URLSearchParams();
      body.append('profile_ids[]', profileId);
      body.append('text', text);
      if (scheduledAt) {
        body.append('scheduled_at', scheduledAt);
      } else {
        body.append('now', 'true');
      }

      // If image, upload first
      if (imageBase64) {
        try {
          const imgBuffer = Buffer.from(imageBase64, 'base64');
          const formData = new FormData();
          const blob = new Blob([imgBuffer], { type: 'image/png' });
          formData.append('file', blob, 'mcm_post.png');

          const uploadRes = await fetch('https://api.bufferapp.com/1/media/upload.json', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.media) {
              body.append('media[photo]', uploadData.media.photo || '');
            }
          }
        } catch (uploadErr) {
          console.warn('Image upload failed, posting text only:', uploadErr.message);
        }
      }

      const r = await fetch('https://api.bufferapp.com/1/updates/create.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data.error || 'Error al programar' });
      return res.status(200).json({ success: true, updateId: data.updates?.[0]?.id });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Acción no encontrada' });
}
