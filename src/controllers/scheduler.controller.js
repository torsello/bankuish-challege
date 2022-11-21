const {db, sequelize} = require("../models");
const User = db.user;
const Course = db.course;
const userController = require("./user.controller.js");
const LIFECYCLE = require("../utils/enums");
const sortByPriority = require("../utils/functions");
let nextLifecycleMap = new Map()

nextLifecycleMap.set(LIFECYCLE.ASSIGNED, LIFECYCLE.ONGOING)
nextLifecycleMap.set(LIFECYCLE.ONGOING, LIFECYCLE.COMPLETED)
nextLifecycleMap.set(LIFECYCLE.COMPLETED, LIFECYCLE.COMPLETED)

const schedule = async (req, res) => {
  const id = req.body.userId;
  const coursesList = req.body.courses;

  if (!id) {
    res.status(400).send({
      message: "userId not found",
    });
  }

  console.log("Retrieving user with uuid: "+ id+" from db")

  let user = await User.findOne({
    where: { uuid: id },
    include: [{ model: Course, include: [Course] }],
  })
    .then((user) => {
      if (user) {
        return user;
      } else {
        res.status(404).send({
          message: `Cannot find User with userId=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with userId=" + id,
      });
    });

  const dbCoursesMap = new Map(
    user.courses.map((object) => {
      return [
        object.name.toLowerCase(),
        object.course ? object.course.name.toLowerCase() : "",
      ];
    })
  );

  console.log("Proceed to save only the courses that the user does not have")
  for await (course of coursesList) {
    if (!dbCoursesMap.has(course.desiredCourse.toLowerCase())) {
      await userController.addCourse(
        id,
        course.desiredCourse,
        LIFECYCLE.ASSIGNED
      );
    }
  }

  res.status(201).send({ response: "OK" });
};

const getSchedule = async (req, res) => {
  const id = req.params.uuid;

  if (!id) {
    res.status(400).send({
      message: "user not found",
    });
  }

  console.log("Getting courses order by dependencies for user uuid", id)
  let userWithCourses = await User.findOne({
    where: { uuid: id },
    include: [{ model: Course, include: [Course] }],
  });

  if (!userWithCourses) {
    res.status(404).send({
      message: `Cannot find User with userId=${id}.`,
    });
  }

  let userCourses = userWithCourses.courses.sort(sortByPriority);

  res.status(200).send(
    userCourses.map((course) => {
      return {
        desiredCourse: course.name,
        requiredCourse: course.course ? course.course.name : "",
      };
    })
  );
};

const getScheduleOrdered = async (req, res) => {
  const id = req.params.uuid;
  console.log("Getting courses order by dependencies and priorities with lifecycle / is_available for user uuid", id)

  if (!id) {
    res.status(400).send({
      message: "user not found",
    });
  }

  let userWithCourses = await User.findOne({
    where: { uuid: id },
    include: [{ model: Course, include: [Course] }],
  });

  if (!userWithCourses) {
    res.status(404).send({
      message: `Cannot find User with userId=${id}.`,
    });
  }

  let userCourses = userWithCourses.courses.sort(sortByPriority);

  for (let index = userCourses.length - 1; index >= 0; index--) {
    const course = userCourses[index];
    if (
      userCourses[index - 1] &&
      userCourses[index - 1].user_courses.lifecycle === LIFECYCLE.COMPLETED
    ) {
      course.is_available = true;
    } else if (!userCourses[index - 1]) {
      course.is_available = true;
    } else {
      course.is_available = false;
    }

    if (course.user_courses.lifecycle === LIFECYCLE.COMPLETED || course.user_courses.lifecycle === LIFECYCLE.ONGOING) {
      course.is_available = false;
    }
  }

  res.status(200).send(
    userCourses.map((course) => {
      return {
        uuid: course.uuid,
        desiredCourse: course.name,
        requiredCourse: course.course ? course.course.name : "",
        lifecycle: course.user_courses.lifecycle,
        is_available: course.is_available,
      };
    })
  );
};

const changeLifecycle = async (req, res) => {
  if (!req.body.user?.uuid || !req.body.course?.uuid) {
    res.status(400).send({
      message: "userId not found",
    });
  }

  const userId = req.body.user.uuid;
  const courseUuid = req.body.course.uuid;

  console.log("Changing course lifecycle for course uuid "+courseUuid+" user uuid "+userId)

  let user = await User.findOne({
    where: { uuid: userId },
    include: [{ model: Course, include: [Course] }],
  })
    .then((user) => {
      if (user) {
        return user;
      } else {
        res.status(404).send({
          message: `Cannot find User with userId=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with userId=" + userId,
      });
    });

  if (!user.courses.some((course) => course.uuid === courseUuid)) {
    res.status(404).send({
      message: "Course does not exist",
    });
  }

  let course = user.courses.find((course) => course.uuid === courseUuid);

  let nextLifecycle = nextLifecycleMap.get(course.user_courses.lifecycle)

  const [results, metadata] = await sequelize.query(`UPDATE user_courses SET lifecycle="${nextLifecycle}" WHERE userId = ${user.id} and courseId = ${course.id}`);
  
  if(metadata <= 0){
    res.status(404).send({
      message: "course user relation does not exist",
    });
  }

  res.status(200).send({
    course: {
      uuid: courseUuid,
    },
  });
};

exports.getSchedule = getSchedule;
exports.schedule = schedule;
exports.getScheduleOrdered = getScheduleOrdered;
exports.changeLifecycle = changeLifecycle;