const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_id, product_id, size, quantity, comment } = req.body;

    if (!user_id || !product_id || !size || !quantity) {
      return res
        .status(400)
        .json({ error: "Не все обязательные поля заполнены" });
    }

    const cartItem = await db.cart.create({
      user_id,
      product_id,
      quantity,
      size,
      comment: comment || null,
    });

    res.json({
      success: true,
      cartItem,
    });
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
