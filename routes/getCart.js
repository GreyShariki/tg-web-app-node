const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cartItems = await db.cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.catalog,
          as: "product",
          attributes: ["id", "name", "price", "photo", "category"],
        },
      ],
      attributes: ["id", "quantity", "size", "comment"],
    });

    if (!cartItems.length) {
      return res.status(200).json([]);
    }

    const formattedItems = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      comment: item.comment,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        photo: item.product.photo,
        category: item.product.category,
      },
    }));

    return res.status(200).json(formattedItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
