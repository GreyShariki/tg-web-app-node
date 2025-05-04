const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { networkRequest } = req.body;
    const {
      location,
      connectionType,
      signsStr,
      description,
      chat_id,
      startTime,
    } = networkRequest;

    const application = await db.network_applications.create({
      location,
      connectionType,
      signsStr,
      description,
      chat_id,
      startTime,
      status: "На рассмотрении",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
