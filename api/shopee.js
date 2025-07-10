import axios from 'axios';

export default async function handler(req, res) {
  const { itemid, shopid } = req.query;

  if (!itemid || !shopid) {
    return res.status(400).json({ error: 'Thiếu itemid hoặc shopid' });
  }

  try {
    const response = await axios.get('https://shopee.vn/api/v4/item/get', {
      params: { itemid, shopid },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const data = response.data.data.item_basic;

    return res.json({
      name: data.name,
      image: `https://cf.shopee.vn/file/${data.image}`,
      price: data.price / 100000,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi lấy dữ liệu Shopee' });
  }
}
