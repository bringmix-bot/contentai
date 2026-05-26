// api/auth/instagram/callback.js
// Recibe el code de Meta, lo intercambia por token y lo guarda en Supabase

import { createClient } from "@supabase/supabase-js";

const APP_ID = "1670117560696079";
const APP_SECRET = "98ed03a1d79ed2fc6b2601f41aa41e1b";
const REDIRECT_URI = "https://contentai-bk5na9kky-gonzalo-s-projecto-ia.vercel.app/api/auth/instagram/callback";
const SUPABASE_URL = "https://ffbmazlunqbtyzrajqnk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  const { code, error, state } = req.query;

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

    // 3. Obtener páginas de Facebook del usuario
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${longToken}`
    );
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    // 4. Para cada página, buscar la cuenta de Instagram asociada
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
        // Obtener username
        const usernameRes = await fetch(
          `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,name,profile_picture_url&access_token=${igPageToken}`
        );
        const usernameData = await usernameRes.json();
        igUsername = usernameData.username || page.name;
        break;
      }
    }

    if (!igAccountId) {
      return res.redirect(`/?ig_error=${encodeURIComponent("No se encontró cuenta de Instagram Business asociada a tu página de Facebook")}`);
    }

    // 5. Guardar en Supabase (tabla social_connections)
    if (SUPABASE_SERVICE_KEY) {
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      // Buscar uid desde state (si lo pasamos) o usar ig_account_id como clave
      await sb.from("social_connections").upsert({
        ig_account_id: igAccountId,
        ig_username: igUsername,
        ig_access_token: longToken,
        ig_page_token: igPageToken,
        connected_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      }, { onConflict: "ig_account_id" });
    }

    // 6. Redirigir al frontend con los datos
    const redirectUrl = `/?ig_connected=1&ig_user=${encodeURIComponent(igUsername)}&ig_id=${igAccountId}&ig_token=${encodeURIComponent(longToken)}`;
    res.redirect(redirectUrl);

  } catch (e) {
    console.error("Instagram OAuth error:", e);
    res.redirect(`/?ig_error=${encodeURIComponent(e.message)}`);
  }
}
