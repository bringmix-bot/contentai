export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse action from query string manually
  const url = new URL(req.url, `https://${req.headers.host}`);
  const action = url.searchParams.get('action');
  const tokenFromQuery = url.searchParams.get('token');

  async function gql(token, query, variables = {}) {
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
    try { data = JSON.parse(text); } catch { throw new Error('Buffer respondió: ' + text.slice(0, 200)); }
    if (data.errors?.length) throw new Error(data.errors[0].message);
    return data.data;
  }

  // ── GET CHANNELS ──────────────────────────────────────────────
  if (action === 'channels') {
    const token = tokenFromQuery;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    try {
      const orgRes = await gql(token, `
        query {
          account {
            organizations { id name }
          }
        }
      `);

      const orgs = orgRes?.account?.organizations || [];
      if (!orgs.length) return res.status(400).json({ error: 'No se encontraron organizaciones en tu cuenta de Buffer. Conectá al menos una red social primero.' });

      const orgId = orgs[0].id;

      const chanRes = await gql(token, `
        query GetChannels($organizationId: String!) {
          channels(organizationId: $organizationId) {
            id name service serviceId
          }
        }
      `, { organizationId: orgId });

      const icons = { instagram:'📸', facebook:'👥', linkedin:'💼', twitter:'🐦', tiktok:'🎵', threads:'🧵' };
      const channels = (chanRes?.channels || []).map(ch => ({
        id: ch.id,
        name: ch.name || ch.serviceId || ch.service,
        service: ch.service,
        icon: icons[ch.service] || '🌐',
      }));

      return res.status(200).json({ channels, total: channels.length });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── SCHEDULE POST ─────────────────────────────────────────────
  if (action === 'schedule') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { token, channelId, text, scheduledAt } = req.body;
    if (!token || !channelId || !text) return res.status(400).json({ error: 'Faltan datos: token, channelId y text son requeridos' });

    try {
      const input = scheduledAt
        ? { channelId, text, schedulingType: 'customScheduled', dueAt: new Date(scheduledAt).toISOString() }
        : { channelId, text, schedulingType: 'automatic', mode: 'addToQueue' };

      const data = await gql(token, `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            ... on PostActionSuccess { post { id text } }
            ... on MutationError { message }
          }
        }
      `, { input });

      const result = data?.createPost;
      if (result?.message) return res.status(400).json({ error: result.message });
      return res.status(200).json({ success: true, postId: result?.post?.id });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Default - show available actions
  return res.status(400).json({
    error: 'Acción requerida',
    available: ['channels (GET)', 'schedule (POST)'],
    received: { action, method: req.method, url: req.url }
  });
}
