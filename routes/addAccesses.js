const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { accessRequest } = req.body;
    const { access_type, description, fname, lname, chat_id } = accessRequest;

    const application = await db.accesses_applications.create({
      access_type,
      description,
      fname,
      lname,
      chat_id,
      status: "На рассмотрении",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal server error:${error}`, error });
  }
});

module.exports = router;
