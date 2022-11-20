const db = require("../models");
const Course = db.course;
const { v4: uuidv4 } = require("uuid");

exports.create = (req, res) => {
  if (!req.body.name || !req.body.priority) {
    res.status(400).send({
      message: "Some fields are obligatories!",
    });
    return;
  }

  const course = {
    uuid: uuidv4(),
    name: req.body.name,
    priority: req.body.priority,
    status: "enabled",
  };

  Course.create(course)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Course.",
      });
    });
};

exports.addPriority = (courseUuid, priority) => {
  return Course.findOne({ where: { uuid: courseUuid } })
    .then((course) => {
      if (!course) {
        throw "course not found!";
      }

      course.update(
        { priority: priority },
        {
          where: { uuid: courseUuid },
        }
      );
      console.log(`>> added Priority=${priority} to Course id=${course.id}`);
      return course;
    })
    .catch((err) => {
      console.log(">> Error while adding priority to Course: ", err);
    });
};

exports.addRequiredCourse = (courseUuid, requiredCourseUuid) => {
  return Course.findOne({ where: { uuid: courseUuid } })
    .then((course) => {
      if (!course) {
        throw "course not found!";
      }
      return db.course
        .findOne({ where: { uuid: requiredCourseUuid } })
        .then((requiredCourse) => {
          if (!requiredCourse) {
            throw "requiredCourse not found!";
          }

          course.update(
            { requiredCourseId: requiredCourse.dataValues.id },
            {
              where: { uuid: courseUuid },
            }
          );
          console.log(
            `>> added requiredCourse id=${requiredCourse.id} to Course id=${course.id}`
          );
          return course;
        });
    })
    .catch((err) => {
      console.log(">> Error while adding CoursePriority to Course: ", err);
    });
};

exports.findAll = (req, res) => {
  Course.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving courses.",
      });
    });
};

exports.findAllDB = () => {
  Course.findAll({ where: {}, include: [Course] })
    .then((courses) => {
      return courses;
    })
    .catch((err) => {
      console.log(err);
    });
};

// Find a single Course with an id
exports.findOne = (req, res) => {
  const id = req.params.uuid;

  Course.findOne({ where: { uuid: id } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Course with uuid=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Course with uuid=" + id,
      });
    });
};

// Update a Course by the id in the request
exports.update = (req, res) => {
  const id = req.params.uuid;

  Course.update(req.body, {
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Course was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Course with uuid=${id}. Maybe Course was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Course with uuid=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.uuid;

  Course.destroy({
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Course was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Course with uuid=${uuid}. Maybe Course was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Course with uuid=" + uuid,
      });
    });
};
