module.exports = (app) => {
  const course = require("../controllers/course.controller.js");

  const router = require("express").Router();

  router.post("/", course.create);

  router.get("/", course.findAll);

  router.get("/:uuid", course.findOne);

  router.put("/:uuid", course.update);

  router.delete("/:uuid", course.delete);

  app.use("/api/course/1.0", router);
};
