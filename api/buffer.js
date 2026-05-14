import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = new URL(req.url, `https://${req.headers.host}`);
  const action = url.searchParams.get('action');
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token requerido' });

  // ── Buffer GraphQL helper ─────────────────────────────────────
  async function gql(query, variables = {}) {
    const r = await fetch('https://api.buffer.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Buffer: ' + text.slice(0, 200)); }
    if (data.errors?.length) throw new Error(data.errors[0].message);
    return data.data;
  }

  // ── Cloudinary upload helper ──────────────────────────────────
  async function uploadToCloudinary(base64Image) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary no configurado en variables de entorno');
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'mcm_posts';

    // Generate signature
    const signStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signStr).digest('hex');

    // Build form data
    const formData = new URLSearchParams();
    formData.append('file', `data:image/png;base64,${base64Image}`);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    const uploadData = await uploadRes.json();
    if (uploadData.error) throw new Error('Cloudinary: ' + uploadData.error.message);
    return uploadData.secure_url;
  }

  // ── GET CHANNELS ──────────────────────────────────────────────
  if (action === 'channels') {
    try {
      const orgRes = await gql(`query { account { organizations { id name } } }`);
      const orgs = orgRes?.account?.organizations || [];
      if (!orgs.length) return res.status(400).json({ error: 'No hay organizaciones en Buffer. Conectá al menos una red social.' });

      const orgId = orgs[0].id;
      const chanRes = await gql(`query GetChannels {
          channels(input: { organizationId: "${orgId}" }) {
            id name displayName service
          }
        }`
      );

      const icons = { instagram:'📸', facebook:'👥', linkedin:'💼', twitter:'🐦', tiktok:'🎵', threads:'🧵' };
      const channels = (chanRes?.channels || []).map(ch => ({
        id: ch.id,
        name: ch.displayName || ch.name || ch.service,
        service: ch.service,
        icon: icons[ch.service] || '🌐',
      }));

      return res.status(200).json({ channels });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── SCHEDULE POST ─────────────────────────────────────────────
  if (action === 'schedule') {
    const { channelId, text, scheduledAt, imageBase64, service } = req.body;
    if (!channelId || !text) return res.status(400).json({ error: 'channelId y text son requeridos' });

    try {
      // Upload image to Cloudinary if provided
      let imageUrl = null;
      if (imageBase64) {
        try {
          imageUrl = await uploadToCloudinary(imageBase64);
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr.message);
          // Continue without image for non-Instagram networks
        }
      }

      // Build input based on service and whether we have an image
      const scheduling = scheduledAt
        ? { schedulingType: 'automatic', mode: 'customScheduled', dueAt: new Date(scheduledAt).toISOString() }
        : { schedulingType: 'automatic', mode: 'addToQueue' };

      let input = { channelId, text, ...scheduling };

      // Add image using correct Buffer assets format
      if (imageUrl) {
        input.assets = [{ image: { url: imageUrl } }];
      }

      // Instagram requires type
      if (service === 'instagram') {
        input.instagramOptions = { type: 'post' };
      }

      const data = await gql(`
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            ... on PostActionSuccess { post { id text } }
            ... on MutationError { message }
          }
        }
      `, { input });

      const result = data?.createPost;
      if (result?.message) return res.status(400).json({ error: result.message });
      return res.status(200).json({ success: true, postId: result?.post?.id, imageUrl });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Acción inválida', received: action });
}
