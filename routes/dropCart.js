const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const deletedCart = await db.cart.destroy({
    where: {
      user_id: userId,
    },
  });
  if (deletedCart === 0) {
    return res.status(200).json({ error: "✅ В корзине ничего не было" });
  }
  return res.status(200).json({ success: "✅ Корзина успешно очищена" });
});
module.exports = router;
