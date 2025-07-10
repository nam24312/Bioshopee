export default async function handler(req, res) {
  const { shopid, itemid } = req.query;

  if (!shopid || !itemid)
    return res.status(400).json({ error: "Thiếu shopid hoặc itemid" });

  try {
    const response = await fetch(`https://shopee.vn/api/v4/item/get?shopid=${shopid}&itemid=${itemid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const json = await response.json();
    const item = json?.data?.item_basic;

    if (!item)
      return res.status(500).json({ error: "Không tìm thấy sản phẩm" });

    return res.json({
      name: item.name,
      price: item.price / 100000,
      image: `https://cf.shopee.vn/file/${item.image}`
    });

  } catch (err) {
    return res.status(500).json({ error: "Fetch lỗi", details: err.message });
  }
}
