const { put, list } = require("@vercel/blob");

const PATHNAME = "views.json";

async function readViews() {
  try {
    const { blobs } = await list({ prefix: PATHNAME, limit: 10 });
    const blob = blobs.find((b) => b.pathname === PATHNAME) || blobs[0];
    if (!blob) {
      return { totalViews: 0, uniqueVisits: 0, lastViewedAt: null };
    }
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) {
      return { totalViews: 0, uniqueVisits: 0, lastViewedAt: null };
    }
    const data = await res.json();
    return {
      totalViews: Number.isFinite(data.totalViews) ? Math.max(0, Math.floor(data.totalViews)) : 0,
      uniqueVisits: Number.isFinite(data.uniqueVisits) ? Math.max(0, Math.floor(data.uniqueVisits)) : 0,
      lastViewedAt: data.lastViewedAt || null,
    };
  } catch {
    return { totalViews: 0, uniqueVisits: 0, lastViewedAt: null };
  }
}

async function writeViews(data) {
  await put(PATHNAME, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "POST") {
      let body = {};
      if (typeof req.body === "object" && req.body !== null) {
        body = req.body;
      } else if (typeof req.body === "string" && req.body.length > 0) {
        try { body = JSON.parse(req.body); } catch {}
      }

      const current = await readViews();
      const isNewSession = body.isNewSession !== false;

      const updated = {
        totalViews: current.totalViews + 1,
        uniqueVisits: isNewSession ? current.uniqueVisits + 1 : current.uniqueVisits,
        lastViewedAt: new Date().toISOString(),
      };

      await writeViews(updated);
      return res.status(200).json(updated);
    }

    // Default GET: Return current view statistics (hidden backend query)
    const stats = await readViews();
    return res.status(200).json(stats);
  } catch {
    return res.status(500).json({ error: "unavailable" });
  }
};
