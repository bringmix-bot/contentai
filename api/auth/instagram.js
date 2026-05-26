// api/auth/instagram.js
// Inicia el flujo OAuth de Instagram

export default function handler(req, res) {
  const APP_ID = "1670117560696079";
  const REDIRECT_URI = "https://contentai-bk5na9kky-gonzalo-s-projecto-ia.vercel.app/api/auth/instagram/callback";
  
  const scopes = [
    "instagram_basic",
    "instagram_content_publish",
    "instagram_manage_insights",
    "pages_read_engagement",
    "pages_show_list"
  ].join(",");

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&response_type=code&state=${Date.now()}`;

  res.redirect(authUrl);
}
