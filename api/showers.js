const { put, list } = require("@vercel/blob");

const PATHNAME = "showers.json";

async function readCount() {
  try {
    const { blobs } = await list({ prefix: PATHNAME, limit: 10 });
    const blob = blobs.find((b) => b.pathname === PATHNAME) || blobs[0];
    if (!blob) return 0;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return Number.isFinite(data.count) ? Math.max(0, Math.floor(data.count)) : 0;
  } catch {
    return 0;
  }
}

async function writeCount(count) {
  await put(PATHNAME, JSON.stringify({ count }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "POST") {
      const count = (await readCount()) + 1;
      await writeCount(count);
      return res.status(200).json({ count });
    }
    const count = await readCount();
    return res.status(200).json({ count });
  } catch {
    return res.status(500).json({ error: "unavailable" });
  }
};
