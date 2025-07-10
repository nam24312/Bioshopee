export default async function handler(req, res) {
  let inputUrl = req.query.url;
  if (!inputUrl) return res.status(400).json({ error: "Thiếu URL" });

  try {
    // Nếu là link rút gọn Shopee → mở rộng
    if (inputUrl.includes("s.shopee.vn")) {
      const r = await fetch(inputUrl, { method: "HEAD", redirect: "manual" });
      const redirectUrl = r.headers.get("location");
      if (!redirectUrl) return res.status(400).json({ error: "Link rút gọn không hợp lệ!" });
      inputUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://shopee.vn${redirectUrl}`;
    }

    // Fetch HTML của trang Shopee
    const htmlRes = await fetch(inputUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const html = await htmlRes.text();

    // Lấy dữ liệu từ meta tag
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    if (!titleMatch || !imageMatch) {
      return res.status(500).json({ error: "Không tìm thấy thông tin sản phẩm" });
    }

    return res.json({
      title: titleMatch[1],
      image: imageMatch[1]
    });

  } catch (err) {
    return res.status(500).json({ error: "Fetch lỗi", details: err.message });
  }
}
