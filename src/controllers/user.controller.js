const {db} = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

exports.create = (req, res) => {
  if (!req.body.email || !req.body.fullname || !req.body.phone) {
    res.status(400).send({
      message: "Some fields are obligatories!",
    });
    return;
  }

  const user = {
    uuid: uuidv4(),
    email: req.body.email,
    fullname: req.body.fullname,
    phone: req.body.phone,
    status: "enabled",
  };

  User.create(user)
    .then((data) => {
      res.send({ user: { uuid: data.uuid } });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.addCourse = async (userUuid, courseName, lifecycle) => {
  return await User.findOne({ where: { uuid: userUuid } })
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        return null;
      }
      const condition = { name: { [Op.like]: `%${courseName}%` } };

      return db.course.findOne({ where: condition }).then((course) => {
        if (!course) {
          console.log("Course not found!");
          return null;
        }
        user.addCourse(course, { through: { lifecycle: lifecycle } });
        console.log(`>> added Course id=${course.id} to User id=${user.id}`);
        return user;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding Course to User: ", err);
    });
};

exports.findAll = (req, res) => {
  User.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.uuid;

  User.findOne({ where: { uuid: id } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with uuid=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with uuid=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.uuid;

  User.update(req.body, {
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with uuid=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with uuid=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.uuid;

  User.destroy({
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with uuid=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with uuid=" + id,
      });
    });
};
