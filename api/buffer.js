export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Parse action from query string
  const url = new URL(req.url, `https://${req.headers.host}`);
  const action = url.searchParams.get('action');

  // Token always comes in POST body
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token requerido' });

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

  // ── CHANNELS ─────────────────────────────────────────────────
  if (action === 'channels') {
    try {
      const orgRes = await gql(`query { account { organizations { id name } } }`);
      const orgs = orgRes?.account?.organizations || [];
      if (!orgs.length) return res.status(400).json({ error: 'No se encontraron organizaciones. Conectá al menos una red social en Buffer primero.' });

      const orgId = orgs[0].id;
      const chanRes = await gql(
        `query GetChannels {
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

  // ── SCHEDULE ─────────────────────────────────────────────────
  if (action === 'schedule') {
    const { channelId, text, scheduledAt } = req.body;
    if (!channelId || !text) return res.status(400).json({ error: 'channelId y text son requeridos' });

    try {
      const input = scheduledAt
        ? { channelId, text, schedulingType: 'custom', dueAt: new Date(scheduledAt).toISOString() }
        : { channelId, text, schedulingType: 'automatic', mode: 'addToQueue' };

      const data = await gql(
        `mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            ... on PostActionSuccess { post { id } }
            ... on MutationError { message }
          }
        }`,
        { input }
      );

      const result = data?.createPost;
      if (result?.message) return res.status(400).json({ error: result.message });
      return res.status(200).json({ success: true, postId: result?.post?.id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Acción inválida. Usá ?action=channels o ?action=schedule', received: action });
}
