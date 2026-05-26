// api/cron.js
// Cron job que corre cada hora y publica los posts programados
// Configurar en vercel.json: {"crons": [{"path": "/api/cron", "schedule": "0 * * * *"}]}

const SUPABASE_URL = "https://ffbmazlunqbtyzrajqnk.supabase.co";

export default async function handler(req, res) {
  // Verificar que es una llamada autorizada (Vercel Cron o manual)
  const authHeader = req.headers.authorization;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) throw new Error("No SUPABASE_SERVICE_KEY");

    // 1. Obtener posts programados que ya deberían haberse publicado
    const now = new Date().toISOString();
    const scheduledRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scheduled_posts?status=eq.pending&scheduled_at=lte.${now}&select=*`,
      {
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`
        }
      }
    );
    const scheduledPosts = await scheduledRes.json();

    if (!scheduledPosts?.length) {
      return res.status(200).json({ message: "No posts to publish", count: 0 });
    }

    const results = [];

    for (const post of scheduledPosts) {
      try {
        // 2. Obtener token de Instagram del usuario
        const connRes = await fetch(
          `${SUPABASE_URL}/rest/v1/social_connections?ig_account_id=eq.${post.ig_account_id}&select=*`,
          {
            headers: {
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`
            }
          }
        );
        const connections = await connRes.json();
        const conn = connections?.[0];
        if (!conn) throw new Error("No Instagram connection found");

        const igAccountId = conn.ig_account_id;
        const pageToken = conn.ig_page_token;

        let publishedId = null;

        if (post.format === "reel" && post.video_url) {
          // Publicar Reel
          const createRes = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                media_type: "REELS",
                video_url: post.video_url,
                caption: post.caption,
                access_token: pageToken
              })
            }
          );
          const createData = await createRes.json();
          if (createData.error) throw new Error(createData.error.message);

          // Esperar que el video procese
          await new Promise(r => setTimeout(r, 15000));

          const publishRes = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creation_id: createData.id,
                access_token: pageToken
              })
            }
          );
          const publishData = await publishRes.json();
          if (publishData.error) throw new Error(publishData.error.message);
          publishedId = publishData.id;

        } else if (post.format === "story") {
          // Publicar Historia
          const createRes = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                media_type: "IMAGE",
                image_url: post.image_url,
                media_category: "STORIES",
                access_token: pageToken
              })
            }
          );
          const createData = await createRes.json();
          if (createData.error) throw new Error(createData.error.message);
          await new Promise(r => setTimeout(r, 3000));
          const publishRes = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ creation_id: createData.id, access_token: pageToken })
            }
          );
          const publishData = await publishRes.json();
          if (publishData.error) throw new Error(publishData.error.message);
          publishedId = publishData.id;

        } else {
          // Publicar Post / Carrusel
          let creationId;
          if (post.slides && post.slides.length > 1) {
            // Carrusel: crear cada imagen
            const childIds = [];
            for (const slideUrl of post.slides) {
              const childRes = await fetch(
                `https://graph.facebook.com/v18.0/${igAccountId}/media`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    image_url: slideUrl,
                    is_carousel_item: true,
                    access_token: pageToken
                  })
                }
              );
              const childData = await childRes.json();
              if (childData.error) throw new Error(childData.error.message);
              childIds.push(childData.id);
            }
            // Crear el carrusel
            const carouselRes = await fetch(
              `https://graph.facebook.com/v18.0/${igAccountId}/media`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  media_type: "CAROUSEL",
                  children: childIds.join(","),
                  caption: post.caption,
                  access_token: pageToken
                })
              }
            );
            const carouselData = await carouselRes.json();
            if (carouselData.error) throw new Error(carouselData.error.message);
            creationId = carouselData.id;
          } else {
            // Post simple
            const createRes = await fetch(
              `https://graph.facebook.com/v18.0/${igAccountId}/media`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  image_url: post.image_url,
                  caption: post.caption,
                  access_token: pageToken
                })
              }
            );
            const createData = await createRes.json();
            if (createData.error) throw new Error(createData.error.message);
            creationId = createData.id;
          }

          await new Promise(r => setTimeout(r, 3000));
          const publishRes = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ creation_id: creationId, access_token: pageToken })
            }
          );
          const publishData = await publishRes.json();
          if (publishData.error) throw new Error(publishData.error.message);
          publishedId = publishData.id;
        }

        // 3. Actualizar estado en Supabase
        await fetch(
          `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${post.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`
            },
            body: JSON.stringify({
              status: "published",
              published_at: new Date().toISOString(),
              instagram_post_id: publishedId
            })
          }
        );

        results.push({ id: post.id, status: "published", instagram_id: publishedId });

      } catch (postError) {
        console.error(`Error publishing post ${post.id}:`, postError.message);
        // Marcar como fallido
        await fetch(
          `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${post.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`
            },
            body: JSON.stringify({ status: "failed", error_message: postError.message })
          }
        );
        results.push({ id: post.id, status: "failed", error: postError.message });
      }
    }

    return res.status(200).json({ message: "Cron completed", results });

  } catch (e) {
    console.error("Cron error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
