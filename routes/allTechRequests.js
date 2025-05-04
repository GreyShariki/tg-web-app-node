const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  const userRole = req.user?.role;

  try {
    let response = {};

    if (userRole === "Системный администратор") {
      response = {
        tech: await db.tech_applications.findAll().catch(() => []),
        network: await db.network_applications.findAll().catch(() => []),
        other: await db.another_applications.findAll().catch(() => []),
      };
    } else if (userRole === "Менеджер по закупкам") {
      response = {
        office: await db.office_applications.findAll().catch(() => []),
        other: await db.another_applications.findAll().catch(() => []),
      };
    } else if (userRole === "Администратор") {
      response = {
        access: await db.accesses_applications.findAll().catch(() => []),
        other: await db.another_applications.findAll().catch(() => []),
      };
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
