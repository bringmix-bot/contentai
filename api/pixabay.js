// api/pixabay.js
export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  
  const { query, count = 3, type = "photo", category = "", page = 1 } = req.body;
  if(!query) return res.status(400).json({error:"query required"});

  const PIXABAY_KEY = "55967298-763db9b1cebbd409766093b27";

  // Diccionario español → inglés
  const DICT = {
    "huevo":"egg","huevos":"eggs","gallina":"hen","gallinas":"hens",
    "pollo":"chicken","pollos":"chickens","granja":"farm","campo":"field",
    "huerta":"garden","cosecha":"harvest","verdura":"vegetable","verduras":"vegetables",
    "tomate":"tomato","tomates":"tomatoes","zanahoria":"carrot","lechuga":"lettuce",
    "espinaca":"spinach","zapallo":"pumpkin","acelga":"chard","brócoli":"broccoli",
    "orgánico":"organic","organico":"organic","orgánica":"organic","organica":"organic",
    "natural":"natural","fresco":"fresh","sano":"healthy","sana":"healthy",
    "campo":"countryside","granja":"farm","pastoreo":"pasture",
    "merienda":"snack","alimento":"food","comida":"food","alimentación":"nutrition",
    "temporada":"seasonal","semilla":"seed","semillas":"seeds",
    "gastronomía":"gastronomy","restaurante":"restaurant","cocina":"kitchen",
    "pizza":"pizza","pasta":"pasta","carne":"meat","pescado":"fish",
    "fitness":"fitness","ejercicio":"exercise","gimnasio":"gym",
    "moda":"fashion","ropa":"clothing","estilo":"style",
    "tecnología":"technology","digital":"digital",
    "casa":"house","familia":"family","niños":"children",
    "yema":"egg yolk","sol":"sun","naturaleza":"nature",
    "amanecer":"sunrise","mañana":"morning",
    "feliz":"happy","felices":"happy","amor":"love",
    "tortilla":"omelette","desayuno":"breakfast","receta":"recipe",
    "agroecología":"organic farming","libre":"free range",
  };

  const translateQuery = (q) => {
    const words = q.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .split(/\s+/);
    return words.map(w => DICT[w] || w).join(" ");
  };

  const englishQuery = translateQuery(query);
  
  try {
    const params = new URLSearchParams({
      key: PIXABAY_KEY,
      q: englishQuery,
      image_type: type === "video" ? "all" : "photo",
      orientation: "all",
      min_width: 800,
      safesearch: "true",
      per_page: Math.min(count * 3, 30),
      lang: "en",
      order: "popular",
      page: Math.max(1, Math.min(page, 5)), // max page 5
    });

    if(category && category !== "all") params.set("category", category);

    const url = type === "video"
      ? `https://pixabay.com/api/videos/?${params}`
      : `https://pixabay.com/api/?${params}`;
    
    const r = await fetch(url);
    const data = await r.json();
    let hits = data.hits || [];

    // Si no hay resultados con la query completa, intentar con la primera palabra clave
    if(hits.length === 0 && englishQuery.includes(" ")) {
      const simpleQuery = englishQuery.split(" ").filter(w=>w.length>3)[0] || englishQuery.split(" ")[0];
      const params2 = new URLSearchParams({
        key: PIXABAY_KEY, q: simpleQuery,
        image_type: "photo", orientation: "all",
        min_width: 800, safesearch: "true",
        per_page: 20, lang: "en", order: "popular", page: 1
      });
      const r2 = await fetch(`https://pixabay.com/api/?${params2}`);
      const data2 = await r2.json();
      hits = data2.hits || [];
    }
    
    const results = hits.slice(0, count).map(hit => ({
      url: type === "video"
        ? (hit.videos?.medium?.url || hit.videos?.small?.url || "")
        : (hit.largeImageURL || hit.webformatURL),
      thumb: hit.previewURL,
      tags: hit.tags,
      source: "pixabay",
      id: hit.id
    })).filter(r => r.url);

    res.json({ success: true, results, query_used: englishQuery });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
