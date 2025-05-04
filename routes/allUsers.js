const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  const userRole = req.user?.role;
  if (userRole === "Администратор") {
    const getAllusers = await db.users.findAll();
    return res.status(200).json(getAllusers);
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
});
module.exports = router;
