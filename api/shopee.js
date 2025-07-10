export default async function handler(req, res) {
  const inputUrl = req.query.url;
  if (!inputUrl) return res.status(400).json({ error: "Thiếu URL" });

  try {
    // B1: Fetch HTML từ Shopee
    const htmlRes = await fetch(inputUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const html = await htmlRes.text();

    // B2: Dùng regex để lấy title và image
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    if (!titleMatch || !imageMatch) {
      return res.status(500).json({ error: "Không tìm thấy thông tin sản phẩm" });
    }

    const result = {
      title: titleMatch[1],
      image: imageMatch[1]
    };

    return res.json(result);

  } catch (err) {
    return res.status(500).json({ error: "Lỗi khi fetch", details: err.message });
  }
}
