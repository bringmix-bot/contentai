export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  async function gql(token, query, variables = {}) {
    const r = await fetch('https://api.buffer.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Respuesta inválida de Buffer: ' + text.slice(0, 200)); }
    if (data.errors?.length) throw new Error(data.errors[0].message);
    return data.data;
  }

  // ── GET CHANNELS ──────────────────────────────────────────────
  if (req.method === 'GET' && action === 'channels') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    try {
      // Step 1: get org ID
      const orgRes = await gql(token, `query { account { organizations { id name } } }`);
      const orgs = orgRes?.account?.organizations || [];
      if (!orgs.length) return res.status(400).json({ error: 'No se encontraron organizaciones' });

      const orgId = orgs[0].id;

      // Step 2: get channels
      const chanRes = await gql(token, `
        query($orgId: String!) {
          channels(organizationId: $orgId) {
            id name service serviceId
          }
        }
      `, { orgId });

      const serviceIcons = { instagram:'📸', facebook:'👥', linkedin:'💼', twitter:'🐦', tiktok:'🎵' };
      const channels = (chanRes?.channels || []).map(ch => ({
        id: ch.id,
        name: ch.name || ch.serviceId || ch.service,
        service: ch.service,
        icon: serviceIcons[ch.service] || '🌐',
      }));

      return res.status(200).json({ channels });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── SCHEDULE POST ─────────────────────────────────────────────
  if (req.method === 'POST' && action === 'schedule') {
    const { token, channelId, text, scheduledAt } = req.body;
    if (!token || !channelId || !text) return res.status(400).json({ error: 'Faltan datos requeridos' });

    try {
      const input = {
        channelId,
        text,
        schedulingType: scheduledAt ? 'customScheduled' : 'automatic',
        ...(scheduledAt ? { dueAt: new Date(scheduledAt).toISOString() } : { mode: 'addToQueue' }),
      };

      const data = await gql(token, `
        mutation($input: CreatePostInput!) {
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

  return res.status(404).json({ error: 'Acción no encontrada' });
}
