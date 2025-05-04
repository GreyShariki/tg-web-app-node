const express = require("express");
const db = require("./models");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 443;
app.use(express.json());
app.use(cors({ origin: "*" }));

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/apikazakovm.ru/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/apikazakovm.ru/fullchain.pem",
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

app.get("/", (req, res) => {
  res.send("Как же я долго переходил на протокол https");
});

const allUsersRouter = require("./routes/allUsers");
const authMiddleware = require("./routes/authMiddleware");
const deleteUser = require("./routes/deleteUser");
const techApplication = require("./routes/techEquipment");
const allTechApplications = require("./routes/allTechRequests");
const networkApplications = require("./routes/addNetworkEquipment");
const officeApplications = require("./routes/addOfficeApplication");
const notificationsRouter = require("./routes/notifications");
const accessRouter = require("./routes/addAccesses");
const otherRouter = require("./routes/addOtherApplication");
const changeStatus = require("./routes/proccess");
const success = require("./routes/successAppointment");

app.use("/api/allusers", authMiddleware, allUsersRouter);
app.use("/api/deleteUser", authMiddleware, deleteUser);
app.use("/api/addtech", techApplication);
app.use("/api/allRequests", authMiddleware, allTechApplications);
app.use("/api/addNetwork", networkApplications);
app.use("/api/addOffice", officeApplications);
app.use("/api/addAccess", accessRouter);
app.use("/api/addOther", otherRouter);
app.use("/api/changeStatus", changeStatus);
app.use("/api/success", success);
app.use("/api/notify", notificationsRouter);

const catalog = require("./routes/getCatalog");
const addCart = require("./routes/addCart.js");
const getCart = require("./routes/getCart.js");
const orderRoutes = require("./routes/addOrder.js");
const dropCart = require("./routes/dropCart.js");

app.use("/api/orders", orderRoutes);
app.use("/api/catalog", catalog);
app.use("/api/addCart", addCart);
app.use("/api/getCart", getCart);
app.use("/api/dropCart", dropCart);

https.createServer(credentials, app).listen(port, "0.0.0.0", async () => {
  try {
    await db.sequelize.sync({ alter: true });

    db.catalog.hasMany(db.cart, { foreignKey: "product_id", as: "carts" });
    db.cart.belongsTo(db.catalog, { foreignKey: "product_id", as: "product" });

    db.catalog.hasMany(db.orders, { foreignKey: "product_id", as: "orders" });
    db.orders.belongsTo(db.catalog, {
      foreignKey: "product_id",
      as: "product",
    });
    const initialUsers = [
      {
        fname: "Дмитрий",
        lname: "Голяшов",
        role: "admin",
        chat_id: 724908758,
      },
      {
        fname: "Абоба",
        lname: "Абоба",
        role: "admin",
        chat_id: 1225637752,
      },
    ];
    const existingUsers = await db.person.count();
    if (existingUsers === 0) {
      await db.person.bulkCreate(initialUsers);
      console.log("Добавлены тестовые пользователи");
    }
    console.log("All associations have been set up");
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`Подключение к БД успешно установлено`);
  } catch (error) {
    console.error("Ошибка при запуске сервера:", error);
  }
});
// Запуск сервера без HTTPS
// app.listen(port, "0.0.0.0", async () => {
//   try {
//     await db.sequelize.sync({ alter: true });

//     db.catalog.hasMany(db.cart, { foreignKey: "product_id", as: "carts" });
//     db.cart.belongsTo(db.catalog, { foreignKey: "product_id", as: "product" });

//     db.catalog.hasMany(db.orders, { foreignKey: "product_id", as: "orders" });
//     db.orders.belongsTo(db.catalog, {
//       foreignKey: "product_id",
//       as: "product",
//     });

//     console.log("All associations have been set up");
//     console.log(`Сервер запущен на порту ${port}`);
//     console.log(`Подключение к БД успешно установлено`);
//   } catch (error) {
//     console.error("Ошибка при запуске сервера:", error);
//   }
// });
