module.exports = (app) => {
  const scheduler = require("../controllers/scheduler.controller.js");

  const router = require("express").Router();

  router.post("/", scheduler.schedule);

  router.get("/:uuid", scheduler.getSchedule);

  router.get("/:uuid/ordered", scheduler.getScheduleOrdered);

  router.post("/change-lifecycle", scheduler.changeLifecycle);

  app.use("/api/scheduler/1.0", router);
};
