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
    let tableName;

    switch (type_of_appointment) {
      case "Офис":
        tableName = "office_applications";
        break;
      case "Техническая заявка":
        tableName = "tech_applications";
        break;
      case "Сетевая заявка":
        tableName = "network_applications";
        break;
      case "Доступ":
        tableName = "accesses_applications";
        break;
      case "Другое":
        tableName = "another_applications";
        break;
      default:
        return res.status(400).json({ error: "Неизвестный тип заявки" });
    }

    result = await db[tableName].destroy({ where: { id: data.id } });

    if (result === 0) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
