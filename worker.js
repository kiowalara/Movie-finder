// Cloudflare Worker: CORS-Proxy nur für deine Filmsuche-Seite.
// 1) ORIGIN auf deine GitHub-Pages-Adresse setzen (ohne Pfad), 2) ALLOW um weitere Hosts ergänzen.
const ORIGIN = 'https://DEINNAME.github.io';
const ALLOW = ['mediathekviewweb.de', 'www.youtube.com', 'html.duckduckgo.com'];

export default {
  async fetch(req) {
    const cors = {'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Headers': '*', 'Vary': 'Origin'};
    if (req.method === 'OPTIONS') return new Response(null, {headers: cors});
    if (req.headers.get('Origin') !== ORIGIN) return new Response('Nicht erlaubt', {status: 403});
    let u;
    try { u = new URL(new URL(req.url).searchParams.get('u')); } catch { return new Response('Ungültige URL', {status: 400, headers: cors}); }
    if (u.protocol !== 'https:' || !ALLOW.includes(u.hostname)) return new Response('Host nicht freigegeben', {status: 403, headers: cors});
    const r = await fetch(u, {
      method: req.method,
      body: req.method === 'POST' ? await req.text() : undefined,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Filmsuche',
        'Accept-Language': 'de,en;q=0.8',
        'Content-Type': req.headers.get('Content-Type') || 'text/plain',
        'Cookie': 'CONSENT=YES+1; SOCS=CAI',
      },
    });
    return new Response(r.body, {status: r.status, headers: {...cors, 'Content-Type': r.headers.get('Content-Type') || 'text/plain'}});
  },
};
