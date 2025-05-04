const db = require("../models");
const authMiddleware = async (req, res, next) => {
  const user = await db.users.findOne({
    where: { chat_id: req.body.chat_id },
    attributes: ["role"],
  });
  if (!user) {
    return res.status(401).json({ message: "Пользователь не найден" });
  } else {
    req.user = user;
    next();
  }
};
module.exports = authMiddleware;
