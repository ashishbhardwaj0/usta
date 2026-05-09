// Cloudflare Worker — TennisRecord Proxy
// Deploy at: https://dash.cloudflare.com/workers
// Returns JSON: { currentRating, ratings: [{date, mr, ra}] }

export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const playerName = url.searchParams.get("player");
    const year = url.searchParams.get("year") || new Date().getFullYear();

    if (!playerName) {
      return new Response(
        JSON.stringify({ error: "Missing ?player= parameter" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const trUrl = `https://www.tennisrecord.com/adult/matchhistory.aspx?playername=${encodeURIComponent(playerName)}&year=${year}`;

    try {
      const resp = await fetch(trUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      });

      if (!resp.ok) throw new Error(`TR returned HTTP ${resp.status}`);
      const html = await resp.text();

      // Parse current dynamic rating from header
      let currentRating = null;
      const dynMatch = html.match(/Estimated Dynamic Rating[\s\S]{0,300}?(\d\.\d{4})/i);
      if (dynMatch) currentRating = parseFloat(dynMatch[1]);

      // Parse match table rows — find rows with date + numeric Rating column
      const ratings = [];
      const trs = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      for (const tr of trs) {
        const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (tds.length < 10) continue;
        const strip = s => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
        const dateCell = strip(tds[0]);
        const raCell   = strip(tds[tds.length - 1]);
        const mrCell   = strip(tds[tds.length - 2]);
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateCell)) continue;
        if (!/^\d\.\d{2}$/.test(raCell)) continue;
        // Skip S (self-rated) and NC rows
        if (mrCell === "S" || mrCell === "NC") {
          ratings.push({ date: dateCell, mr: null, ra: parseFloat(raCell) });
          continue;
        }
        ratings.push({ date: dateCell, mr: parseFloat(mrCell) || null, ra: parseFloat(raCell) });
      }

      return new Response(
        JSON.stringify({ currentRating, ratings, year: parseInt(year), player: playerName }),
        { headers: corsHeaders }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
