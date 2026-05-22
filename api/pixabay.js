export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  
  const { query, count = 3, type = "photo" } = req.body;
  if(!query) return res.status(400).json({error:"query required"});

  const PIXABAY_KEY = "55967298-763db9b1cebbd409766093b27";
  
  try {
    const params = new URLSearchParams({
      key: PIXABAY_KEY,
      q: query,
      image_type: type === "video" ? "all" : "photo",
      orientation: "vertical",
      category: "all",
      min_width: 800,
      safesearch: "true",
      per_page: Math.min(count * 3, 20),
      lang: "es"
    });

    let url, data;
    
    if(type === "video") {
      url = `https://pixabay.com/api/videos/?${params}`;
    } else {
      url = `https://pixabay.com/api/?${params}`;
    }
    
    const r = await fetch(url);
    data = await r.json();
    
    const hits = data.hits || [];
    
    const results = hits.slice(0, count).map(hit => ({
      url: type === "video" 
        ? (hit.videos?.medium?.url || hit.videos?.small?.url || "")
        : (hit.largeImageURL || hit.webformatURL),
      thumb: type === "video"
        ? hit.picture_id ? `https://i.vimeocdn.com/video/${hit.picture_id}_295x166.jpg` : ""
        : hit.previewURL,
      tags: hit.tags,
      source: "pixabay",
      id: hit.id
    })).filter(r => r.url);

    res.json({ success: true, results });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
