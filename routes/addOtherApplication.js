const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { otherRequest } = req.body;
    const { category, urgency, description, chat_id } = otherRequest;

    const application = await db.another_applications.create({
      category,
      urgency,
      description,
      status: "На рассмотрении",
      chat_id,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
