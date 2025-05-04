const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { officeRequest } = req.body;
    const { itemType, quantity, location, chat_id } = officeRequest;

    const application = await db.office_applications.create({
      item: itemType,
      quantity,
      location,
      chat_id,
      status: "На рассмотрении",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
