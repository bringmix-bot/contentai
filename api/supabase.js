import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, table, data, match, userId } = req.body || {};

  try {
    if (action === 'upsert') {
      const { error } = await supabase.from(table).upsert(data);
      if (error) throw error;
      return res.json({ success: true });
    }

    if (action === 'select') {
      const { data: rows, error } = await supabase.from(table).select('*').match(match || {});
      if (error) throw error;
      return res.json({ success: true, data: rows });
    }

    if (action === 'delete') {
      const { error } = await supabase.from(table).delete().match(match);
      if (error) throw error;
      return res.json({ success: true });
    }

    if (action === 'upload') {
      const { path, base64, mimeType } = data;
      const buffer = Buffer.from(base64, 'base64');
      const { error } = await supabase.storage.from('mcm-files').upload(path, buffer, {
        contentType: mimeType, upsert: true
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('mcm-files').getPublicUrl(path);
      return res.json({ success: true, url: urlData.publicUrl });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
