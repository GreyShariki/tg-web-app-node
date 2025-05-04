const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type_of_appointment, data } = req.body;

    if (!type_of_appointment || !data || !data.id) {
      return res.status(400).json({ error: "Неверные параметры запроса" });
    }

    let result;

    switch (type_of_appointment) {
      case "Офис":
        if (data.status === "На рассмотрении") {
          result = await db.office_applications.update(
            { status: "В процессе" },
            { where: { id: data.id } }
          );
        }
        break;

      case "Доступ":
        const userExists = await db.users.findOne({
          where: { chat_id: data.chat_id },
        });
        const accesses = await db.accesses_applications.findOne({
          where: { id: data.id },
        });
        if (userExists) {
          result = await db.users.update(
            { role: data.role },
            { where: { chat_id: data.chat_id } }
          );
        } else {
          result = await db.users.create({
            fname: accesses.fname,
            lname: accesses.lname,
            chat_id: accesses.chat_id,
            role: accesses.access_type,
          });
        }

        await db.accesses_applications.destroy({ where: { id: data.id } });
        break;

      case "Техническая заявка":
        result = await db.tech_applications.update(
          { status: "В процессе" },
          { where: { id: data.id } }
        );
        break;

      case "Сетевая заявка":
        result = await db.network_applications.update(
          { status: "В процессе" },
          { where: { id: data.id } }
        );
        break;

      case "Другое":
        result = await db.another_applications.update(
          { status: "В процессе" },
          { where: { id: data.id } }
        );
        break;

      default:
        return res
          .status(400)
          .json({ error: `Неизвестный тип заявки${type_of_appointment}` });
    }
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
