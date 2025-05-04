const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const getAllusers = await db.catalog.findAll();
    return res.status(200).json(getAllusers);
  } catch (error) {
    return res.status(404).json({ error: "Эщкере" });
  }
});

module.exports = router;
