module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  const router = require("express").Router();

  router.post("/signup", user.create);

  router.get("/", user.findAll);

  router.get("/:uuid", user.findOne);

  router.put("/:uuid", user.update);

  router.delete("/:uuid", user.delete);

  app.use("/api/user/1.0", router);
};
