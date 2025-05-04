const express = require("express");
const db = require("../models");
const { Telegraf } = require("telegraf");
const router = express.Router();
const { BOT_TOKEN } = require("../config.json");
const { changeStatus, success } = require("../changestatus.js");

const bot = new Telegraf(BOT_TOKEN);

bot.action(
  /^(accept|reject)_(tech|net|office|access|other)_(\d+)_([^_]+)_(\d+)$/,
  async (ctx) => {
    const action = ctx.match[1];
    const type = ctx.match[2];
    const id = ctx.match[3];
    const status = ctx.match[4];
    const chat_id = ctx.match[5];
    console.log(type);
    try {
      let typeForServer;
      switch (type) {
        case "tech":
          typeForServer = "Техническая заявка";
          break;
        case "net":
          typeForServer = "Сетевая заявка";
          break;
        case "office":
          typeForServer = "Офис";
          break;
        case "access":
          typeForServer = "Доступ";
          break;
        case "other":
          typeForServer = "Другое";
          break;
      }

      if (action === "accept") {
        const result = await changeStatus(typeForServer, {
          id,
          status,
          chat_id,
        });

        if (result.success) {
          await ctx.answerCbQuery(result.message);
          await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
          const messageText =
            ctx.update.callback_query.message.text +
            `\n\n🔄 Статус: В процессе (принято ${ctx.from.first_name})`;
          await ctx.editMessageText(messageText, { parse_mode: "HTML" });
        } else {
          await ctx.answerCbQuery(`❌ Ошибка: ${result.message}`);
        }
      } else {
        const result = await success(typeForServer, { id });

        if (result.success) {
          if (typeForServer === "Доступ") {
            await ctx.answerCbQuery("✅ Отказано в доступе");
            await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
            const messageText =
              ctx.update.callback_query.message.text +
              `\n\n❌ Статус: Отказано в доступе (${ctx.from.first_name})`;
            await ctx.editMessageText(messageText, { parse_mode: "HTML" });
          } else {
            await ctx.answerCbQuery("✅ Заявка завершена");
            await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

            const messageText =
              ctx.update.callback_query.message.text +
              `\n\n✅ Статус: Завершено (${ctx.from.first_name})`;
            await ctx.editMessageText(messageText, { parse_mode: "HTML" });
          }
        } else {
          await ctx.answerCbQuery(`❌ Ошибка: ${result.message}`);
        }
      }
    } catch (error) {
      console.error(`Ошибка обработки заявки ${type}-${id}:`, error);
      await ctx.answerCbQuery("❌ Произошла ошибка при обработке");
    }
  }
);

router.post("/notify-tech", async (req, res) => {
  try {
    const { application } = req.body;
    const masters = await db.users.findAll({
      where: { role: "Системный администратор" },
      attributes: ["chat_id"],
    });

    if (masters.length === 0) {
      return res.json({
        success: false,
        message: "Нет мастеров для уведомления",
      });
    }

    const messages = masters.map((master) =>
      bot.telegram
        .sendMessage(
          master.chat_id,
          `🚨 Новая заявка #${application.id}\n\n` +
            `📱 Устройство: ${application.type_of_device}\n` +
            `🔢 Номер: ${application.number}\n` +
            `⚠️ Тип проблемы: ${application.type_of_failure}\n` +
            `📝 Описание: ${application.description}\n` +
            `🔄 Статус: ${application.status}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "❌ Отклонить",
                    callback_data: `reject_tech_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "🔄 Принять",
                    callback_data: `accept_tech_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "✅ Завершить",
                    callback_data: `reject_tech_${application.id}_${application.status}_${application.chat_id}`,
                  },
                ],
              ],
            },
          }
        )
        .catch((e) =>
          console.error(`Ошибка отправки мастеру ${master.chat_id}:`, e)
        )
    );

    await Promise.all(messages);
    res.json({ success: true, notified: masters.length });
  } catch (error) {
    console.error("Ошибка уведомления:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/notify-network", async (req, res) => {
  try {
    const { application } = req.body;
    const masters = await db.users.findAll({
      where: { role: "Системный администратор" },
      attributes: ["chat_id"],
    });

    if (masters.length === 0) {
      return res.json({
        success: false,
        message: "Нет сетевых администраторов для уведомления",
      });
    }

    const messages = masters.map((master) =>
      bot.telegram
        .sendMessage(
          master.chat_id,
          `🌐 Новая сетевая заявка #${application.id}\n\n` +
            `📍 Локация: ${application.location}\n` +
            `🔌 Тип соединения: ${application.connectionType}\n` +
            `⚠️ Симптомы: ${application.signsStr}\n` +
            `⏱️ Началось: ${new Date(
              application.startTime
            ).toLocaleString()}\n` +
            `📝 Описание: ${application.description}\n` +
            `🔄 Статус: ${application.status}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "❌ Отклонить",
                    callback_data: `reject_net_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "🔄 Принять",
                    callback_data: `accept_net_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "✅ Завершить",
                    callback_data: `reject_net_${application.id}_${application.status}_${application.chat_id}`,
                  },
                ],
              ],
            },
          }
        )
        .catch((e) =>
          console.error(
            `Ошибка отправки сетевому администратору ${master.chat_id}:`,
            e
          )
        )
    );

    await Promise.all(messages);
    res.json({ success: true, notified: masters.length });
  } catch (error) {
    console.error("Ошибка уведомления:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/notify-office", async (req, res) => {
  try {
    const { application } = req.body;
    const managers = await db.users.findAll({
      where: { role: "Менеджер по закупкам" },
      attributes: ["chat_id"],
    });

    if (managers.length === 0) {
      return res.json({
        success: false,
        message: "Нет менеджеров по закупкам для уведомления",
      });
    }

    const messages = managers.map((manager) =>
      bot.telegram
        .sendMessage(
          manager.chat_id,
          `🛒 Новая заявка на расходники #${application.id}\n\n` +
            `🏷️ Товар: ${application.item}\n` +
            `🔢 Количество: ${application.quantity}\n` +
            `📍 Локация: ${application.location}\n` +
            `🔄 Статус: ${application.status}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "❌ Отклонить",
                    callback_data: `reject_office_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "🔄 Принять",
                    callback_data: `accept_office_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "✅ Завершить",
                    callback_data: `reject_office_${application.id}_${application.status}_${application.chat_id}`,
                  },
                ],
              ],
            },
          }
        )
        .catch((e) =>
          console.error(`Ошибка отправки менеджеру ${manager.chat_id}:`, e)
        )
    );

    await Promise.all(messages);
    res.json({ success: true, notified: managers.length });
  } catch (error) {
    console.error("Ошибка уведомления:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post("/notify-access", async (req, res) => {
  try {
    const { application } = req.body;
    const admins = await db.users.findAll({
      where: { role: "Администратор" },
      attributes: ["chat_id"],
    });

    if (admins.length === 0) {
      return res.json({
        success: false,
        message: "Нет администраторов для уведомления",
      });
    }

    const messages = admins.map((admin) =>
      bot.telegram
        .sendMessage(
          admin.chat_id,
          `🔑 Новая заявка на доступ #${application.id}\n\n` +
            `👤 Имя: ${application.fname} ${application.lname}\n` +
            `🔓 Тип доступа: ${application.access_type}\n` +
            `📝 Обоснование: ${application.description}\n` +
            `🔄 Статус: ${application.status}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "❌ Отклонить",
                    callback_data: `reject_access_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "✅ Принять",
                    callback_data: `accept_access_${application.id}_${application.status}_${application.chat_id}`,
                  },
                ],
              ],
            },
          }
        )
        .catch((e) =>
          console.error(`Ошибка отправки администратору ${admin.chat_id}:`, e)
        )
    );

    await Promise.all(messages);
    res.json({ success: true, notified: admins.length });
  } catch (error) {
    console.error("Ошибка уведомления:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/notify-other", async (req, res) => {
  try {
    const { application } = req.body;
    const recipients = await db.users.findAll({
      attributes: ["chat_id"],
    });

    if (recipients.length === 0) {
      return res.json({
        success: false,
        message: "Нет ответственных для уведомления",
      });
    }

    const messages = recipients.map((recipient) =>
      bot.telegram
        .sendMessage(
          recipient.chat_id,
          `❓ Новая заявка "Другое" #${application.id}\n\n` +
            `🏷️ Категория: ${application.category}\n` +
            `⏱️ Срочность: ${application.urgency}\n` +
            `📝 Описание: ${application.description}\n` +
            `🔄 Статус: ${application.status}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "❌ Отклонить",
                    callback_data: `reject_other_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "🔄 Принять",
                    callback_data: `accept_other_${application.id}_${application.status}_${application.chat_id}`,
                  },
                  {
                    text: "✅ Завершить",
                    callback_data: `reject_other_${application.id}_${application.status}_${application.chat_id}`,
                  },
                ],
              ],
            },
          }
        )
        .catch((e) => console.error(`Ошибка отправки ${recipient.chat_id}:`, e))
    );

    await Promise.all(messages);
    res.json({ success: true, notified: recipients.length });
  } catch (error) {
    console.error("Ошибка уведомления:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;
