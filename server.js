const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

let corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

const {db} = require("./src/models");

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db sync");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bankuish application." });
});

require("./src/routes/course.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/scheduler.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
