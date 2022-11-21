const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const app = express();

let corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

const { db } = require("./src/models");

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("db sync");

    db.course.bulkCreate([
      {
        uuid: uuidv4(),
        name: "Finance",
        status: "enabled",
        priority: 0,
      },
      {
        uuid: uuidv4(),
        name: "Investment",
        status: "enabled",
        priority: 1,
        requiredCourseId: 1,
      },
      {
        uuid: uuidv4(),
        name: "InvestmentManagement",
        status: "enabled",
        priority: 2,
        requiredCourseId: 2,
      },
      {
        uuid: uuidv4(),
        name: "PortfolioTheories",
        status: "enabled",
        priority: 3,
        requiredCourseId: 2,
      },
      {
        uuid: uuidv4(),
        name: "InvestmentStyle",
        status: "enabled",
        priority: 4,
        requiredCourseId: 3,
      },
      {
        uuid: uuidv4(),
        name: "PortfolioConstruction",
        status: "enabled",
        priority: 5,
        requiredCourseId: 4,
      },
    ]);
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

require("./src/routes/course.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/scheduler.routes")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
