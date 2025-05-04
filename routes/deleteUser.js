const express = require("express");
const db = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  const userRole = req.user?.role;
  const userId = req.body.user_id;
  if (userRole === "Администратор") {
    const deletedUser = await db.users.destroy({
      where: {
        id: userId,
      },
    });
    if (deletedUser === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    return res.status(200).json(deletedUser);
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
});
module.exports = router;
