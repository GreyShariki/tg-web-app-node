const express = require("express");
const { Telegraf } = require("telegraf");

const router = express.Router();
const db = require("../models");

const { BOT_TOKEN } = require("../config.json");

const bot = new Telegraf(BOT_TOKEN);

router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    if (
      !orderData.user_id ||
      !orderData.product_id ||
      !orderData.quantity ||
      !orderData.total_price ||
      !orderData.address ||
      !orderData.phone
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await db.orders.create(orderData);

    const admins = await db.person.findAll({ where: { role: "admin" } });

    const message =
      `🆕 *Новый заказ!*\n\n` +
      `👤 Пользователь ID: ${order.user_id}\n` +
      `📦 Товар ID: ${order.product_id}\n` +
      `📏 Размер: ${order.size || "-"}\n` +
      `🔢 Кол-во: ${order.quantity}\n` +
      `💰 Сумма: ${order.total_price}₽\n` +
      `🏠 Адрес: ${order.address}\n` +
      `📱 Телефон: ${order.phone}\n` +
      (order.comment ? `💬 Комментарий: ${order.comment}\n` : "");

    for (const admin of admins) {
      try {
        await bot.telegram.sendMessage(admin.chat_id, message, {
          parse_mode: "Markdown",
        });
      } catch (err) {
        console.error(
          `Ошибка при отправке администратору ${admin.chat_id}:`,
          err
        );
      }
    }

    await db.cart.destroy({
      where: {
        user_id: orderData.user_id,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
