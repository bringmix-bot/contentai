// api/instagram.js — upload, publish, stats, schedule
const SUPABASE_URL = "https://ffbmazlunqbtyzrajqnk.supabase.co";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query.action;

  // Obtener token e IG_ID: primero desde social_connections, fallback a env vars
  const getIGCredentials = async (igAccountId) => {
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (igAccountId && serviceKey) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/social_connections?ig_account_id=eq.${igAccountId}&select=*&limit=1`,
        { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } }
      );
      const data = await r.json();
      if (data?.[0]) return { token: data[0].ig_page_token, igId: data[0].ig_account_id };
    }
    // Fallback a env vars
    return {
      token: process.env.META_PAGE_ACCESS_TOKEN,
      igId: process.env.INSTAGRAM_ACCOUNT_ID || "17841400870249463"
    };
  };

  // ── SCHEDULE — guardar post programado en Supabase ──────────────
  if (action === "schedule") {
    try {
      const { caption, imageUrl, slides, format, scheduledAt, igAccountId, userId } = req.body;
      const serviceKey = process.env.SUPABASE_SERVICE_KEY;
      if (!serviceKey) throw new Error("No SUPABASE_SERVICE_KEY");

      const r = await fetch(`${SUPABASE_URL}/rest/v1/scheduled_posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          user_id: userId || null,
          ig_account_id: igAccountId || process.env.INSTAGRAM_ACCOUNT_ID,
          caption,
          image_url: imageUrl || null,
          slides: slides ? JSON.stringify(slides) : null,
          format: format || "post",
          scheduled_at: scheduledAt,
          status: "pending"
        })
      });
      const data = await r.json();
      return res.status(200).json({ success: true, post: data?.[0] });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // ── STATS ──────────────────────────────────────────────────────
  if (action === "stats") {
    try {
      const igAccountId = req.query.ig_account_id;
      const { token: TOKEN, igId: IG_ID } = await getIGCredentials(igAccountId);

      const accountFields = "id,name,username,biography,profile_picture_url,followers_count,follows_count,media_count,website";
      const accountRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}?fields=${accountFields}&access_token=${TOKEN}`);
      const account = await accountRes.json();
      if (account.error) throw new Error(account.error.message);

      const insightMetrics = "impressions,reach,profile_views,website_clicks,follower_count";
      const insightRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/insights?metric=${insightMetrics}&period=days_28&access_token=${TOKEN}`);
      const insightData = await insightRes.json();
      const insights = {};
      if (insightData.data) insightData.data.forEach(m => {
        insights[m.name] = m.values ? m.values.reduce((s, v) => s + (v.value || 0), 0) : 0;
      });

      const mediaFields = "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink";
      const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media?fields=${mediaFields}&limit=12&access_token=${TOKEN}`);
      const mediaData = await mediaRes.json();
      let posts = [];
      if (mediaData.data) {
        const postInsightsPromises = mediaData.data.map(async post => {
          try {
            const metrics = post.media_type === "VIDEO" ? "impressions,reach,plays,saved,shares" : "impressions,reach,saved,shares";
            const piRes = await fetch(`https://graph.facebook.com/v19.0/${post.id}/insights?metric=${metrics}&access_token=${TOKEN}`);
            const piData = await piRes.json();
            const pi = {};
            if (piData.data) piData.data.forEach(m => { pi[m.name] = m.values?.[0]?.value || 0; });
            return { ...post, ...pi };
          } catch { return post; }
        });
        posts = await Promise.all(postInsightsPromises);
      }

      const totalInteractions = posts.reduce((s, p) => s + (p.like_count || 0) + (p.comments_count || 0) + (p.saved || 0), 0);
      const totalImpressions = posts.reduce((s, p) => s + (p.impressions || 0), 0);
      const engagement_rate = totalImpressions > 0 ? totalInteractions / totalImpressions : 0;

      return res.status(200).json({
        success: true,
        account: {
          ...account, ...insights, engagement_rate,
          total_likes: posts.reduce((s, p) => s + (p.like_count || 0), 0),
          total_comments: posts.reduce((s, p) => s + (p.comments_count || 0), 0),
          total_shares: posts.reduce((s, p) => s + (p.shares || 0), 0),
          total_saves: posts.reduce((s, p) => s + (p.saved || 0), 0),
        },
        posts,
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // ── UPLOAD to Cloudinary ───────────────────────────────────────
  if (action === "upload") {
    try {
      const { imageBase64 } = req.body;
      const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
      const KEY = process.env.CLOUDINARY_API_KEY;
      const SECRET = process.env.CLOUDINARY_API_SECRET;
      const ts = Math.round(Date.now() / 1000);
      const str = `timestamp=${ts}${SECRET}`;
      const sig = await sha1(str);
      const form = new FormData();
      form.append("file", imageBase64);
      form.append("timestamp", ts);
      form.append("api_key", KEY);
      form.append("signature", sig);
      const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: form });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      return res.status(200).json({ success: true, url: d.secure_url });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // ── PUBLISH to Instagram ───────────────────────────────────────
  if (action === "publish") {
    try {
      const { caption, imageUrl, format, link, linkLabel, poll, igAccountId } = req.body;
      const { token: TOKEN, igId: IG_ID } = await getIGCredentials(igAccountId);

      if (format === "story" && poll?.active && poll?.question) {
        const storyBody = {
          image_url: imageUrl, media_type: "STORIES", access_token: TOKEN,
          story_stickers: JSON.stringify({ poll_sticker: { question: poll.question, options: poll.options.filter(o => o).slice(0, 5) } })
        };
        if (link) storyBody.link = link;
        const createRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(storyBody) });
        const createData = await createRes.json();
        if (createData.error) throw new Error(createData.error.message);
        const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media_publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ creation_id: createData.id, access_token: TOKEN }) });
        const publishData = await publishRes.json();
        if (publishData.error) throw new Error(publishData.error.message);
        return res.status(200).json({ success: true, id: publishData.id });
      }

      const mediaType = format === "reel" ? "REELS" : format === "story" ? "STORIES" : null;
      const fullCaption = link ? `${caption}\n\n🔗 ${linkLabel || "Ver más"}: ${link}` : caption;
      const body = { image_url: imageUrl, caption: fullCaption, access_token: TOKEN };
      if (mediaType) body.media_type = mediaType;

      const createRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const createData = await createRes.json();
      if (createData.error) throw new Error(createData.error.message);
      const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media_publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ creation_id: createData.id, access_token: TOKEN }) });
      const publishData = await publishRes.json();
      if (publishData.error) throw new Error(publishData.error.message);
      return res.status(200).json({ success: true, id: publishData.id });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(400).json({ success: false, error: "Acción no reconocida: " + action });
}

async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}
