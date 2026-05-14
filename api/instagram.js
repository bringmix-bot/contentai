export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
  const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  // ── GET INSTAGRAM ACCOUNT INFO ──
  if (action === 'account') {
    try {
      const r = await fetch(
        `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}?fields=id,username,profile_picture_url,followers_count&access_token=${PAGE_ACCESS_TOKEN}`
      );
      const data = await r.json();
      if (data.error) return res.status(400).json({ error: data.error.message });
      return res.status(200).json({ success: true, account: data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── PUBLISH POST ──
  if (action === 'publish' && req.method === 'POST') {
    const { caption, imageUrl, scheduleTime } = req.body;

    if (!caption) return res.status(400).json({ error: 'Se necesita un caption' });
    if (!imageUrl) return res.status(400).json({ error: 'Se necesita una imagen' });

    try {
      // Step 1: Create media container
      const containerBody = new URLSearchParams({
        image_url: imageUrl,
        caption: caption,
        access_token: PAGE_ACCESS_TOKEN,
      });

      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media`,
        { method: 'POST', body: containerBody }
      );
      const containerData = await containerRes.json();

      if (containerData.error) {
        return res.status(400).json({ error: `Error al crear container: ${containerData.error.message}` });
      }

      const containerId = containerData.id;

      // Step 2: Wait for container to be ready
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check container status
      const statusRes = await fetch(
        `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${PAGE_ACCESS_TOKEN}`
      );
      const statusData = await statusRes.json();

      if (statusData.status_code === 'ERROR') {
        return res.status(400).json({ error: 'Error al procesar la imagen en Instagram' });
      }

      // Step 3: Publish the container
      const publishBody = new URLSearchParams({
        creation_id: containerId,
        access_token: PAGE_ACCESS_TOKEN,
      });

      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
        { method: 'POST', body: publishBody }
      );
      const publishData = await publishRes.json();

      if (publishData.error) {
        return res.status(400).json({ error: `Error al publicar: ${publishData.error.message}` });
      }

      return res.status(200).json({
        success: true,
        postId: publishData.id,
        message: '¡Post publicado en Instagram exitosamente!'
      });

    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── UPLOAD IMAGE TO CLOUDINARY ──
  if (action === 'upload' && req.method === 'POST') {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Se necesita la imagen en base64' });

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const crypto = await import('crypto');
      const signature = crypto.createHash('sha1')
        .update(`timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
        .digest('hex');

      const formData = new URLSearchParams({
        file: imageBase64,
        timestamp: timestamp.toString(),
        api_key: CLOUDINARY_API_KEY,
        signature,
      });

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const uploadData = await uploadRes.json();

      if (uploadData.error) {
        return res.status(400).json({ error: uploadData.error.message });
      }

      return res.status(200).json({
        success: true,
        url: uploadData.secure_url,
        publicId: uploadData.public_id
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: `Acción desconocida: ${action}` });
}
