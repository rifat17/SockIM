const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const LOCALHOST = "localhost";
const PORT = "5000";

var corsOrigin = {
  origin: `${LOCALHOST}:5001`,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log("[DB.SEQUELIZE.SYNC] Drop and Rsync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "admin",
  });
}

// db.sequelize
//   .authenticate()
//   .then(() => console.log("DB Connection OK"))
//   .catch((err) => console.log(err));

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome Here!" });
});

app.listen(PORT, () => {
  console.log("Server is listeing..", PORT);
});
