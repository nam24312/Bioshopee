export default async function handler(req, res) {
  const inputUrl = req.query.url;

  if (!inputUrl) return res.status(400).json({ error: "Missing URL" });

  // Step 1: Expand shortlink if needed
  let realUrl = inputUrl;
  if (inputUrl.includes("s.shopee.vn")) {
    const headRes = await fetch(inputUrl, {
      method: "HEAD",
      redirect: "manual"
    });

    const location = headRes.headers.get("location");
    if (!location) return res.status(400).json({ error: "Invalid shortlink" });

    realUrl = location;
  }

  // Step 2: Extract itemid + shopid
  const match = realUrl.match(/product\/(\d+)\/(\d+)/);
  if (!match) return res.status(400).json({ error: "Cannot extract IDs" });

  const shopid = match[1];
  const itemid = match[2];

  // Step 3: Call Shopee API
  const apiUrl = `https://shopee.vn/api/v4/item/get?shopid=${shopid}&itemid=${itemid}`;

  try {
    const fetchRes = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await fetchRes.json();
    const item = data?.data?.item_basic;

    if (!item) return res.status(500).json({ error: "No product data" });

    const result = {
      name: item.name,
      image: `https://cf.shopee.vn/file/${item.image}`,
      price: item.price / 100000
    };

    return res.json(result);

  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err.message });
  }
}
