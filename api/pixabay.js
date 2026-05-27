// api/pixabay.js
export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  
  const { query, count = 3, type = "photo", category = "" } = req.body;
  if(!query) return res.status(400).json({error:"query required"});

  const PIXABAY_KEY = "55967298-763db9b1cebbd409766093b27";

  // Traducción directa español → inglés antes de buscar
  const DICT = {
    "huevo":"egg","huevos":"eggs","gallina":"hen","gallinas":"hens",
    "pollo":"chicken","pollos":"chickens","granja":"farm","campo":"field",
    "huerta":"garden","cosecha":"harvest","verdura":"vegetable","verduras":"vegetables",
    "tomate":"tomato","tomates":"tomatoes","zanahoria":"carrot","lechuga":"lettuce",
    "espinaca":"spinach","zapallo":"pumpkin","acelga":"chard","brócoli":"broccoli",
    "orgánico":"organic","organico":"organic","orgánica":"organic","organica":"organic",
    "natural":"natural","fresco":"fresh","sano":"healthy","sana":"healthy",
    "libre":"free range","pastoreo":"pasture","agroecología":"agroecology",
    "merienda":"snack","alimento":"food","comida":"food","alimentación":"nutrition",
    "temporada":"seasonal","estación":"season","semilla":"seed","semillas":"seeds",
    "gastronomía":"gastronomy","restaurante":"restaurant","cocina":"kitchen",
    "pizza":"pizza","pasta":"pasta","carne":"meat","pescado":"fish",
    "fitness":"fitness","ejercicio":"exercise","gimnasio":"gym","entrenamiento":"workout",
    "moda":"fashion","ropa":"clothing","estilo":"style","diseño":"design",
    "tecnología":"technology","digital":"digital","inmobiliaria":"real estate",
    "casa":"house","familia":"family","niños":"children","madre":"mother",
    "yema":"egg yolk","campo":"countryside","sol":"sun","naturaleza":"nature",
    "verde":"green","naranja":"orange","rojo":"red","amarillo":"yellow",
    "amanecer":"sunrise","atardecer":"sunset","mañana":"morning","tarde":"afternoon",
    "feliz":"happy","felices":"happy","amor":"love","vida":"life",
    "producto":"product","productos":"products","calidad":"quality",
    "testimonios":"testimonial","testimonio":"testimonial","cliente":"customer",
  };

  // Traducir query al inglés
  const translateQuery = (q) => {
    const words = q.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .split(/\s+/);
    const translated = words.map(w => DICT[w] || w);
    // Si ya tiene palabras en inglés conocidas, dejar como está
    return translated.join(" ");
  };

  const englishQuery = translateQuery(query);
  
  try {
    const params = new URLSearchParams({
      key: PIXABAY_KEY,
      q: englishQuery,
      image_type: "photo",
      orientation: "all",        // más resultados
      min_width: 800,
      safesearch: "true",
      per_page: Math.min(count * 4, 40),  // pedir más para filtrar mejor
      lang: "en",                // SIEMPRE en inglés
      order: "popular",          // imágenes más populares primero (más relevantes)
    });

    if(category) params.set("category", category);

    const url = type === "video"
      ? `https://pixabay.com/api/videos/?${params}`
      : `https://pixabay.com/api/?${params}`;
    
    const r = await fetch(url);
    const data = await r.json();
    const hits = data.hits || [];

    // Si no hay resultados, intentar con solo la primera palabra
    if(hits.length === 0 && englishQuery.includes(" ")) {
      const simpleQuery = englishQuery.split(" ")[0];
      const params2 = new URLSearchParams({
        key: PIXABAY_KEY, q: simpleQuery,
        image_type: "photo", orientation: "all",
        min_width: 800, safesearch: "true",
        per_page: 20, lang: "en", order: "popular"
      });
      const r2 = await fetch(`https://pixabay.com/api/?${params2}`);
      const data2 = await r2.json();
      const hits2 = data2.hits || [];
      const results2 = hits2.slice(0, count).map(hit => ({
        url: hit.largeImageURL || hit.webformatURL,
        thumb: hit.previewURL,
        tags: hit.tags,
        source: "pixabay",
        id: hit.id
      })).filter(r => r.url);
      return res.json({ success: true, results: results2, query_used: simpleQuery });
    }
    
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

    res.json({ success: true, results, query_used: englishQuery });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
