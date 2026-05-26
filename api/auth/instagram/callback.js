// api/auth/instagram/callback.js

const APP_ID = "1670117560696079";
const APP_SECRET = "98ed03a1d79ed2fc6b2601f41aa41e1b";
const REDIRECT_URI = "https://contentai-nine.vercel.app/api/auth/instagram/callback";
const SUPABASE_URL = "https://ffbmazlunqbtyzrajqnk.supabase.co";

export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/?ig_error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return res.status(400).json({ error: "No code received" });
  }

  try {
    // 1. Intercambiar code por short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error.message);
    const shortToken = tokenData.access_token;

    // 2. Intercambiar por long-lived token (60 días)
    const longRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longData = await longRes.json();
    const longToken = longData.access_token || shortToken;

    // 3. Obtener páginas de Facebook
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${longToken}`
    );
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    // 4. Buscar cuenta de Instagram Business asociada
    let igAccountId = null;
    let igUsername = null;
    let igPageToken = null;

    for (const page of pages) {
      const igRes = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );
      const igData = await igRes.json();
      if (igData.instagram_business_account?.id) {
        igAccountId = igData.instagram_business_account.id;
        igPageToken = page.access_token;
        const userRes = await fetch(
          `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,name&access_token=${igPageToken}`
        );
        const userData = await userRes.json();
        igUsername = userData.username || page.name;
        break;
      }
    }

    if (!igAccountId) {
      return res.redirect(`/?ig_error=${encodeURIComponent("No se encontró cuenta de Instagram Business. Asegurate de tener una cuenta Business o Creador vinculada a una Página de Facebook.")}`);
    }

    // 5. Guardar en Supabase via REST (sin SDK)
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (serviceKey) {
      await fetch(`${SUPABASE_URL}/rest/v1/social_connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          ig_account_id: igAccountId,
          ig_username: igUsername,
          ig_access_token: longToken,
          ig_page_token: igPageToken,
          connected_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
    }

    // 6. Redirigir al frontend con los datos
    res.redirect(`/?ig_connected=1&ig_user=${encodeURIComponent(igUsername)}&ig_id=${igAccountId}&ig_token=${encodeURIComponent(longToken)}`);

  } catch (e) {
    console.error("OAuth error:", e);
    res.redirect(`/?ig_error=${encodeURIComponent(e.message)}`);
  }
}
