const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { techRequest } = req.body;
    const { type_of_device, number, chat_id, type_of_failure, description } =
      techRequest;

    const addApplication = await db.tech_applications.create({
      type_of_device,
      number,
      chat_id,
      type_of_failure,
      description,
      status: "На рассмотрении",
    });
    res.status(201).json(addApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
